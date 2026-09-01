<div align="center">

# kh<span style="color:#ff2a5f">x</span>aiyan — Developer Portfolio

<p><em>Minimalist, ultra-clean developer portfolio featuring dynamic real-time GitHub pinned projects, Boneyard skeleton loading, dark/light themes, and secure deployment architecture.</em></p>

[![Live Site](https://img.shields.io/badge/Live_Site-khxaiyan.vercel.app-ff2a5f?style=for-the-badge&logo=vercel&logoColor=white)](https://khxaiyan.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-@khxaiyan-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/khxaiyan)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

</div>

---

## 📑 Table of Contents
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚙️ Configuration (`config.js`)](#️-configuration-configjs)
- [🚀 Quick Start / Local Development](#-quick-start--local-development)
- [🌐 Deployment Options](#-deployment-options)
  - [Option A: Deploy on Vercel (Recommended)](#option-a-deploy-on-vercel-recommended)
  - [Option B: GitHub Pages with Hidden Source Code](#option-b-github-pages-with-hidden-source-code)
- [🎨 Design System & Customization](#-design-system--customization)
- [📬 Contact Form Setup](#-contact-form-setup)
- [👤 Author](#-author)
- [📄 License](#-license)

---

## ✨ Key Features

- **⚡ Real-Time Dynamic GitHub Pins**: Automatically fetches and renders your live GitHub pinned repositories in real-time with zero caching delay (`no-store` + cache busting). When you update your pins on GitHub, your portfolio updates instantly without code changes or rebuilds.
- **💀 Boneyard Pixel-Perfect Skeleton Screen**: Zero layout-shift skeleton shimmer loader mirroring the exact DOM bones (avatars, text lines, star badges) during initial data resolution.
- **🎨 Signature Tech Branding**: Sleek rail-node timeline layout, modern typography with *Space Grotesk* and *IBM Plex Mono*, and automatic red accent highlighting (`glyph-5`) on all project capital letters.
- **🌓 Dual Theme Support (Dark & Light)**: Smooth theme toggling with immediate `localStorage` state persistence and system color-scheme detection.
- **📬 Working Contact Form**: Web3Forms integration with hCaptcha bot verification for spam protection.
- **🔒 Privacy & Security First**: Complete `.gitignore` setup, sanitized credentials, and support for 100% private repository hosting.
- **📱 Fully Responsive**: Flawless experience across mobile, tablet, and widescreen desktop monitors.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **HTML5** | Semantic, accessible document structure |
| **Vanilla CSS** | Design tokens, custom CSS variables, responsive grid, animations |
| **Vanilla JavaScript (ES6+)** | Dynamic GitHub API fetching, theme toggling, form handling |
| **Google Fonts** | `Space Grotesk` (Headings/Display) & `IBM Plex Mono` (Body/Code) |
| **Web3Forms API** | Serverless contact form submission endpoint |
| **hCaptcha** | Privacy-friendly CAPTCHA protection |
| **GitHub Actions** | Automated CI/CD deployment trigger |

---

## 📁 Project Structure

```text
MyPortfolioA/
├── .github/
│   └── workflows/
│       └── notify-deploy.yml   # Auto-triggers deployment on push
├── .gitignore                  # Keeps secrets, cache & OS files untracked
├── 404.html                    # Themed 404 error page with Return Home action
├── app.js                      # Main application logic & live GitHub pins loader
├── config.js                   # Centralized configuration (links, email, keys)
├── index.html                  # Main portfolio homepage
├── logo.png                    # Profile avatar image
├── package.json                # Project manifest & dev scripts (npx serve)
├── style.css                   # Core stylesheet, tokens & Boneyard skeletons
└── README.md                   # Complete documentation
```

---

## ⚙️ Configuration (`config.js`)

All personal information and public configuration settings are centralized inside `config.js`:

```javascript
const CONFIG = {
  github: 'khxaiyan',
  x: 'khxaiyan',
  telegram: 'khxaiyan',
  email: 'your-email@example.com', // Your contact email
  logo: 'logo.png',
  site_name: 'khxaiyan',
  site_desc: 'khxaiyan | developer in active building mode. crafting clean web tools & digital experiences.',
  seo_desc: 'khxaiyan | Web developer crafting clean tools, interfaces, and digital experiences.',
  
  // Contact Form & Security (https://web3forms.com)
  web3forms_access_key: 'YOUR_WEB3FORMS_ACCESS_KEY',
  hcaptcha_sitekey: '4e42ae9a-c9a2-4a7a-b9ae-0526a248f402',
};
```

---

## 🚀 Quick Start / Local Development

### Prerequisites
- Node.js (v18+) installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/khxaiyan/MyPortfolioA.git
cd MyPortfolioA
```

### 2. Start the local development server
```bash
npm run dev
```
*(or run `npx serve .`)*

### 3. Open in Browser
Visit **`http://localhost:3000`** in your browser.

---

## 🌐 Deployment Options

### Option A: Deploy on Vercel (Recommended)
1. Push your repository to GitHub as **Private** (or Public).
2. Go to **[vercel.com/new](https://vercel.com/new)** and import your `MyPortfolioA` repository.
3. Click **Deploy**. Vercel will automatically build and assign a free SSL-secured domain.

---

### Option B: GitHub Pages with Hidden Source Code
If you want to host on `https://<username>.github.io` while keeping your source code 100% private:

1. **Private Repository (`MyPortfolioA`)**: Contains your full source code and `.github/workflows/notify-deploy.yml`.
2. **Public Repository (`<username>.github.io`)**: Contains only `.github/workflows/deploy.yml`.
3. **Secret Token**: Add your GitHub Personal Access Token (`PAGES_TOKEN` / `PRIVATE_REPO_TOKEN`) in the repository secrets.
4. Whenever you push to `MyPortfolioA`, it triggers `<username>.github.io` to deploy behind the scenes without exposing your source files!

---

## 🎨 Design System & Customization

### Color Palette (CSS Variables in `style.css`)
```css
:root {
  --bg:           #0a0a0e;       /* Deep dark background */
  --surface:      #131319;       /* Card surface */
  --surface-hover:#191a22;       /* Hover card surface */
  --line:         rgba(255,255,255,0.09);
  --line-strong:  rgba(255,255,255,0.20);
  --ink:          #eef0f4;       /* Primary text */
  --ink-dim:      #8d90a0;       /* Secondary text */
  --ink-faint:    #787c93;       /* Metadata / eyebrow text */
  --red:          #ff2a5f;       /* Signature neon red accent */
  --rail:         #363a63;       /* Timeline rail line */
  --success:      #22c07d;       /* Star & status green */
}
```

---

## 📬 Contact Form Setup

1. Register for a free Access Key at **[web3forms.com](https://web3forms.com/)**.
2. Paste your Access Key into `config.js` under `web3forms_access_key`.
3. Messages submitted through the contact form on your portfolio will be delivered directly to your email inbox.

---

## 👤 Author

**Aiyan Khan (khxaiyan)**
- GitHub: [@khxaiyan](https://github.com/khxaiyan)
- Live Portfolio: [khxaiyan.vercel.app](https://khxaiyan.vercel.app)
- X (Twitter): [@khxaiyan](https://x.com/khxaiyan)
- Telegram: [@khxaiyan](https://t.me/khxaiyan)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
