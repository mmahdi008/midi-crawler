# Midi Crawler 🦎

> **One-click Googlebot Smartphone emulation for technical SEO audits.**

**Midi Crawler** is a lightweight Chrome extension (Manifest V3) designed for technical SEO professionals, web developers, and site auditors. It instantly configures your active browser tab to mirror how Googlebot Mobile crawls and renders web pages with JavaScript disabled.

---

## Key Features

- **One-Click Emulation:** Instantly switch between your standard user session and Googlebot Mobile view.
- **JavaScript Block Toggle:** Automatically blocks JavaScript execution for the targeted hostname to simulate raw HTML crawling.
- **Dynamic Header Spoofing:** Overrides the outgoing `User-Agent` request header using Chrome's `declarativeNetRequest` API.
- **Zero Overhead:** No heavy background scripts, external dependencies, or data collection—operates completely locally.

---

## 🛠️ How to Use

1. Click the **Midi Crawler** icon in your browser toolbar to activate Googlebot mode.
2. The active tab will reload automatically with Googlebot Mobile user-agent headers and JavaScript disabled.
3. Compare page elements, server-side rendering (SSR) output, and metadata against your standard browsing session.
4. Click the extension icon again to toggle off and restore normal browser behavior.

> **Pro Tip:** Press `Ctrl+U` (or `Cmd+Option+U` on macOS) before and after toggling the extension to compare standard HTML source code against raw Googlebot rendering output.

---

## 💻 Tech Stack & Architecture

- **Manifest Version:** 3
- **APIs Used:** `declarativeNetRequest`, `contentSettings`, `storage`, `tabs`
- **User-Agent String:** Googlebot Smartphone / Mobile
- **Permissions:** Restricted strictly to active tab manipulation and header modification without external tracking.

---

## 📥 Installation (Local Development)

1. Clone or download this repository:
   ```bash
   git clone [https://github.com/YOUR_USERNAME/midi-crawler.git](https://github.com/YOUR_USERNAME/midi-crawler.git)
