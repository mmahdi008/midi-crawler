const GOOGLEBOT_UA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const RULE_ID = 1;

// Initialize state on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ isEnabled: false });
  updateBadge(false);
});

// One-click extension action trigger
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.url || tab.url.startsWith("chrome://") || tab.url.startsWith("edge://")) {
    console.warn("Cannot run extension on system pages.");
    return;
  }

  const { isEnabled } = await chrome.storage.local.get("isEnabled");
  const newState = !isEnabled;

  const url = new URL(tab.url);
  const primaryPattern = `${url.protocol}//${url.hostname}/*`;

  // 1. Toggle User-Agent Spoofing via Dynamic Rules
  if (newState) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [RULE_ID],
      addRules: [
        {
          id: RULE_ID,
          priority: 1,
          action: {
            type: "modifyHeaders",
            requestHeaders: [
              {
                header: "User-Agent",
                operation: "set",
                value: GOOGLEBOT_UA
              }
            ]
          },
          condition: {
            urlFilter: "*",
            resourceTypes: [
              "main_frame",
              "sub_frame",
              "stylesheet",
              "script",
              "image",
              "font",
              "xmlhttprequest",
              "other"
            ]
          }
        }
      ]
    });

    // 2. Disable JavaScript for the active host
    chrome.contentSettings.javascript.set({
      primaryPattern: primaryPattern,
      setting: "block"
    });
  } else {
    // Clear UA override rule
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [RULE_ID]
    });

    // Re-enable JavaScript for the active host
    chrome.contentSettings.javascript.set({
      primaryPattern: primaryPattern,
      setting: "allow"
    });
  }

  // Update storage & visual indicators
  await chrome.storage.local.set({ isEnabled: newState });
  updateBadge(newState);

  // 3. Reload current tab to execute request under new conditions
  chrome.tabs.reload(tab.id, { bypassCache: true });
});

// Update Action Badge Text & Color
function updateBadge(enabled) {
  if (enabled) {
    chrome.action.setBadgeText({ text: "BOT" });
    chrome.action.setBadgeBackgroundColor({ color: "#EA4335" }); // Google Red
  } else {
    chrome.action.setBadgeText({ text: "" });
  }
}