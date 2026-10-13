const GOOGLEBOT_UA =
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const TIMEOUT_MINUTES = 5; // auto-off after this many minutes
const ALARM_PREFIX = "midi-off-";

const RESOURCE_TYPES = [
  "main_frame", "sub_frame", "stylesheet", "script",
  "image", "font", "xmlhttprequest", "other"
];

/* ---------------- state (cleared automatically when Chrome closes) ---------------- */

async function getActive() {
  const { active = {} } = await chrome.storage.session.get("active");
  return active; // { [tabId]: { pattern } }
}

async function saveActive(active) {
  await chrome.storage.session.set({ active });
}

/* ---------------- full reset on install / update / browser start ---------------- */

async function resetAll() {
  try {
    // Remove leftover permanent rules from v1.0.0
    const dyn = await chrome.declarativeNetRequest.getDynamicRules();
    if (dyn.length) {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: dyn.map(r => r.id)
      });
    }
    const sess = await chrome.declarativeNetRequest.getSessionRules();
    if (sess.length) {
      await chrome.declarativeNetRequest.updateSessionRules({
        removeRuleIds: sess.map(r => r.id)
      });
    }
    // Remove every JS block this extension ever set
    await chrome.contentSettings.javascript.clear({});
    await chrome.alarms.clearAll();
    await chrome.storage.session.clear();
    await chrome.storage.local.remove("isEnabled"); // old v1.0.0 key
    await chrome.action.setBadgeText({ text: "" });
  } catch (e) {
    console.error("Midi crawler reset failed:", e);
  }
}

chrome.runtime.onInstalled.addListener(resetAll);
chrome.runtime.onStartup.addListener(resetAll);

/* ---------------- enable / disable for a single tab ---------------- */

async function enable(tab) {
  const url = new URL(tab.url);
  const pattern = `${url.protocol}//${url.hostname}/*`;

  // UA spoofing ONLY for this tab (session rule = never survives restart)
  await chrome.declarativeNetRequest.updateSessionRules({
    removeRuleIds: [tab.id],
    addRules: [{
      id: tab.id,
      priority: 1,
      action: {
        type: "modifyHeaders",
        requestHeaders: [
          { header: "User-Agent", operation: "set", value: GOOGLEBOT_UA }
        ]
      },
      condition: { tabIds: [tab.id], resourceTypes: RESOURCE_TYPES }
    }]
  });

  await chrome.contentSettings.javascript.set({
    primaryPattern: pattern,
    setting: "block"
  });

  const active = await getActive();
  active[tab.id] = { pattern };
  await saveActive(active);

  await chrome.alarms.create(ALARM_PREFIX + tab.id, {
    delayInMinutes: TIMEOUT_MINUTES
  });

  await setBadge(tab.id, true);
  chrome.tabs.reload(tab.id, { bypassCache: true });
}

async function disable(tabId, { reload = true } = {}) {
  const active = await getActive();
  delete active[tabId];
  await saveActive(active);

  await chrome.declarativeNetRequest.updateSessionRules({
    removeRuleIds: [tabId]
  });
  await chrome.alarms.clear(ALARM_PREFIX + tabId);

  // Clear all our JS blocks, then re-block only hosts still being inspected.
  // This never overrides the user's own JavaScript settings with "allow".
  await chrome.contentSettings.javascript.clear({});
  const stillBlocked = new Set(Object.values(active).map(a => a.pattern));
  for (const pattern of stillBlocked) {
    await chrome.contentSettings.javascript.set({
      primaryPattern: pattern,
      setting: "block"
    });
  }

  if (reload) {
    try {
      await setBadge(tabId, false);
      await chrome.tabs.reload(tabId, { bypassCache: true });
    } catch {
      /* tab no longer exists */
    }
  }
}

/* ---------------- triggers ---------------- */

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.url || !/^https?:/.test(tab.url)) {
    console.warn("Midi crawler only works on http(s) pages.");
    return;
  }
  const active = await getActive();
  if (active[tab.id]) {
    await disable(tab.id);
  } else {
    await enable(tab);
  }
});

// Timeout: auto-off
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (!alarm.name.startsWith(ALARM_PREFIX)) return;
  const tabId = Number(alarm.name.slice(ALARM_PREFIX.length));
  await disable(tabId);
});

// Closing the tab turns it off
chrome.tabs.onRemoved.addListener(async (tabId) => {
  const active = await getActive();
  if (active[tabId]) await disable(tabId, { reload: false });
});

// Keep the badge visible after navigation inside the inspected tab
chrome.tabs.onUpdated.addListener(async (tabId, info) => {
  if (info.status !== "complete") return;
  const active = await getActive();
  if (active[tabId]) await setBadge(tabId, true);
});

/* ---------------- badge (per tab) ---------------- */

async function setBadge(tabId, enabled) {
  await chrome.action.setBadgeText({ tabId, text: enabled ? "BOT" : "" });
  if (enabled) {
    await chrome.action.setBadgeBackgroundColor({ tabId, color: "#EA4335" });
  }
}