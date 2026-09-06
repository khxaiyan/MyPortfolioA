<div align="center">

# khxaiyan — Developer Portfolio

<p><em>Minimalist, ultra-clean developer portfolio featuring dynamic real-time projects showcase, smooth skeleton shimmer loading, dark/light themes, and secure deployment architecture.</em></p>

[![Live Site](https://img.shields.io/badge/Live_Site-khxaiyan.vercel.app-ff2a5f?style=for-the-badge&logo=vercel&logoColor=white)](https://khxaiyan.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-@khxaiyan-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/khxaiyan)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

</div>

---

## 📑 Table of Contents
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚙️ Configuration](#️-configuration)
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

- **⚡ Dynamic Projects Showcase**: Automatically renders your curated portfolio projects with direct links to live deployments.
- **⚡ Pixel-Perfect Skeleton Shimmer Loading**: Zero layout-shift skeleton shimmer loader mirroring the exact card dimensions during initial data resolution.
- **🎨 Signature Tech Branding**: Sleek rail-node timeline layout, modern typography with *Space Grotesk* and *IBM Plex Mono*, and automatic red accent highlighting (`glyph-5`) on all project capital letters.
- **🌓 Dual Theme Support (Dark & Light)**: Smooth theme toggling with immediate `localStorage` state persistence and system color-scheme detection.
- **📬 Working Contact Form**: Web3Forms integration with hCaptcha bot verification for spam protection.
- **🔒 Privacy & Security First**: Complete `.gitignore` setup, sanitized credentials, and isolated `keys/` folder — secrets are never served to the browser.
- **🔐 Clerk Authentication & Secret Customizer**: Secret 10-click trigger on the bottom-right `@khxaiyan` tag opens the Clerk-authenticated admin customizer, allowing you to edit profile picture, bio, links, and custom project settings with live instant preview.
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
| **Clerk** | Authentication for the developer admin customizer |
| **GitHub Actions** | Automated CI/CD deployment trigger |

---

## 📁 Project Structure

```text
MyPortfolioA/
│
├── frontend/                        ← Everything the browser loads
│   ├── index.html                   # Main portfolio homepage
│   ├── developer.html               # Clerk-authenticated admin customizer (/developer)
│   ├── 404.html                     # Themed 404 error page
│   ├── style.css                    # Core stylesheet, tokens & skeleton shimmer
│   ├── app.js                       # Main application logic & GitHub pins loader
│   ├── config.js                    # Auto-generated config (synced from keys/.env)
│   └── logo.png                     # Default profile avatar image
│
├── backend/                         ← Node / server-side scripts
│   └── sync-env.js                  # Reads keys/.env → writes frontend/config.js
│
├── keys/                            ← API keys & secrets (never served to browser)
│   ├── .env                         # Real secrets (gitignored ✓)
│   ├── .env.local                   # Local overrides (gitignored ✓)
│   └── .env.example                 # Safe template (committed to git ✓)
│
├── .github/
│   └── workflows/
│       └── notify-deploy.yml        # Auto-triggers deployment on push
├── .gitignore
├── package.json                     # Project manifest & npm scripts
└── README.md
```

> **Security note:** `npm run serve` only serves the `frontend/` folder.
> The `keys/` and `backend/` folders are completely unreachable from the browser.

---

## ⚙️ Configuration

All personal information and API keys live in `keys/.env`.
Run `npm run sync` to write them into `frontend/config.js`.

**`keys/.env` structure:**
```bash
# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_FRONTEND_API=https://your-app.clerk.accounts.dev

# Contact Form & Security
WEB3FORMS_ACCESS_KEY=your_web3forms_access_key
HCAPTCHA_SITEKEY=50b2fe65-b00b-4b9e-ad62-3ba471098be2

# Socials & Profile Identity
GITHUB_USERNAME=khxaiyan
TELEGRAM_USERNAME=khxaiyan
X_USERNAME=khxaiyan
CONTACT_EMAIL=your@email.com
SITE_NAME=khxaiyan
ACCENT_LETTER=x

# Whitelist of Authorized Admins (comma-separated)
AUTHORIZED_USERS=your@email.com

# Optional Cloudflare Analytics Token
CF_ANALYTICS=false
```

> Copy `keys/.env.example` → `keys/.env` and fill in your values, then run `npm run sync`.

---

## 🚀 Quick Start / Local Development

### Prerequisites
- Node.js (v18+) installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/khxaiyan/MyPortfolioA.git
cd MyPortfolioA
```

### 2. Set up your environment keys
```bash
cp keys/.env.example keys/.env
# Edit keys/.env with your real values
```

### 3. Sync keys into config
```bash
npm run sync
```

### 4. Start the local development server
```bash
npm run serve
```

### 5. Open in Browser
Visit **`http://localhost:3000`** in your browser.

---

### npm scripts reference

| Command | What it does |
| :--- | :--- |
| `npm run sync` | Reads `keys/.env` → writes `frontend/config.js` |
| `npm run serve` | Serves `frontend/` at `http://localhost:3000` |
| `npm run dev` | `sync` + `serve` in one step |
| `npm run start` | Same as `dev` |

---

## 🌐 Deployment Options

### Option A: Deploy on Vercel (Recommended)
1. Push your repository to GitHub as **Private** (or Public).
2. Go to **[vercel.com/new](https://vercel.com/new)** and import your `MyPortfolioA` repository.
3. Set the **Root Directory** to `frontend/` in the Vercel project settings.
4. Click **Deploy**. Vercel will automatically build and assign a free SSL-secured domain.

---

### Option B: GitHub Pages with Hidden Source Code
If you want to host on `https://<username>.github.io` while keeping your source code 100% private:

1. **Private Repository (`MyPortfolioA`)**: Contains your full source code and `.github/workflows/notify-deploy.yml`.
2. **Public Repository (`<username>.github.io`)**: Contains only `.github/workflows/deploy.yml`.
3. **Secret Token**: Add your GitHub Personal Access Token (`PAGES_TOKEN` / `PRIVATE_REPO_TOKEN`) in the repository secrets.
4. Whenever you push to `MyPortfolioA`, it triggers `<username>.github.io` to deploy behind the scenes without exposing your source files!

---

## 🎨 Design System & Customization

### Color Palette (CSS Variables in `frontend/style.css`)
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
2. Add your Access Key to `keys/.env` under `WEB3FORMS_ACCESS_KEY`.
3. Run `npm run sync` to push the key into `frontend/config.js`.
4. Messages submitted through the contact form will be delivered directly to your email inbox.

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
