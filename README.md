# Midi Crawler 🦎
> **One-click Googlebot Smartphone emulation for technical SEO audits.**
<img width="819" height="302" alt="midi crawler large promo" src="https://github.com/user-attachments/assets/3275f41f-4662-46ec-9b55-cfe06337e236" />


**Midi Crawler** is a lightweight Chrome extension (Manifest V3) designed for technical SEO professionals, web developers, and site auditors. It instantly configures your active browser tab to mirror how Googlebot Mobile crawls and renders web pages with JavaScript disabled.

---

## Key Features

- **One-Click Emulation:** Instantly switch between your standard user session and Googlebot Mobile view.
- **JavaScript Block Toggle:** Automatically blocks JavaScript execution for the targeted hostname to simulate raw HTML crawling.
- **Dynamic Header Spoofing:** Overrides the outgoing `User-Agent` request header using Chrome's `declarativeNetRequest` API.
- **Zero Overhead:** No heavy background scripts, external dependencies, or data collection—operates completely locally.

---

## 🛠️ How to Use
<img width="311" height="297" alt="Screenshot 1405-05-18 at 18 30 09" src="https://github.com/user-attachments/assets/fa08abb0-94c6-4f06-9714-f3b2167d66e8" />
<img width="311" height="292" alt="Screenshot 1405-05-18 at 18 30 00" src="https://github.com/user-attachments/assets/9fc48616-84dc-4e9a-ba25-af88de36caea" />
<img width="314" height="297" alt="Screenshot 1405-05-18 at 18 29 50" src="https://github.com/user-attachments/assets/2e33bf73-bd79-467f-a20e-68edd75cfc75" />



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
