<div align="center">

# khxaiyan — Developer Portfolio

<p><em>Minimalist, ultra-clean developer portfolio featuring dynamic real-time projects showcase, zero-flicker live theme hydration, dark/light modes, and secure serverless deployment architecture.</em></p>

[![Live Site](https://img.shields.io/badge/Live_Site-khxaiyan.vercel.app-00ff00?style=for-the-badge&logo=vercel&logoColor=black)](https://khxaiyan.vercel.app)
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

- **⚡ Zero-Flash Live Theme Hydration**: Direct serverless configuration streaming via `/api/config.js` ensuring instant, single-paint theme and asset loading in incognito and privacy-focused browsers (Brave Shields).
- **🛡️ Pure CSS & HTML Fallbacks**: Pre-rendered project cards and resilient CSS design tokens for zero layout shifts and instant readability even when JavaScript is disabled or blocked.
- **⚡ Dynamic Projects Showcase**: Automatically renders curated portfolio projects with direct links to live deployments and GitHub repositories.
- **🎨 Signature Tech Branding**: Sleek rail-node timeline layout, modern typography with *Space Grotesk* and *IBM Plex Mono*, and automatic accent highlighting (`glyph-5`) on wordmark and project capital letters.
- **🌓 Dual Theme Support (Dark & Light)**: Smooth theme toggling with immediate `localStorage` state persistence and system color-scheme detection.
- **🍃 MongoDB Atlas Cloud Persistence**: Instant configuration saving without git-push clutter or Vercel redeployment delays.
- **☁️ Cloudinary Direct Media Uploads**: Fast CDN delivery for avatars and favicons with local base64 fallback.
- **⚡ Inngest Event-Driven Workflows**: Background pipelines for automated GitHub stars synchronization and contact message archiving.
- **📬 Working Contact Form**: Web3Forms integration with hCaptcha bot verification for spam protection.
- **🔒 Privacy & Security First**: Complete `.gitignore` setup, sanitized credentials, and isolated `keys/` folder — secrets are never served to the browser.
- **🔐 Clerk Authentication & Developer Customizer**: Role-protected developer settings (`/developer` & quick modal) for updating profiles, social links, projects, and themes with live instant previews.
- **📱 Fully Responsive**: Flawless experience across mobile, tablet, and widescreen desktop monitors.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **HTML5** | Semantic, accessible document structure with pre-rendered fallbacks |
| **Vanilla CSS** | Design tokens, custom CSS variables, responsive grid, animations |
| **Vanilla JavaScript (ES6+)** | Dynamic API hydration, theme synchronization, form handling |
| **MongoDB Atlas** | Instant cloud configuration storage (`/api/save-config` & `/api/config.js`) |
| **Cloudinary** | Global CDN media storage & direct unsigned uploads |
| **Inngest** | Background serverless workflows (`/api/inngest`), cron GitHub sync, and contact pipeline |
| **Clerk** | Authentication & RBAC for the developer admin dashboard |
| **Web3Forms API** | Serverless contact form submission endpoint |
| **hCaptcha** | Privacy-friendly CAPTCHA protection |
| **Vercel** | Serverless functions hosting and continuous deployment |

---

## 📁 Project Structure

```text
MyPortfolioA/
│
├── api/                             ← Vercel serverless endpoints
│   ├── config.js                    # GET /api/config.js (Live executable JS/JSON config loader)
│   ├── get-config.js                # GET /api/get-config (MongoDB configuration loader)
│   ├── save-config.js               # POST /api/save-config (MongoDB configuration writer)
│   ├── inngest.js                   # Inngest endpoint serving background workflows
│   └── lib/
│       └── mongodb.js               # Shared MongoDB Atlas connection pooling
│
├── frontend/                        ← Static portfolio files
│   ├── index.html                   # Main portfolio homepage with pre-rendered cards
│   ├── developer.html               # Developer admin dashboard (/developer)
│   ├── 404.html                     # Themed 404 error page
│   ├── style.css                    # Design tokens, themes & skeleton shimmer
│   ├── app.js                       # Main application & GitHub pins loader
│   └── config.js                    # Local configuration fallback
│
├── backend/                         ← Node.js server & workflow routines
│   ├── dev-server.js                # Local dev server with API routing & static serving
│   ├── sync-env.js                  # Reads keys/.env & MongoDB Atlas → writes frontend/config.js
│   └── inngest/                     # Inngest workflows (GitHub sync & contact pipeline)
│
├── keys/                            ← API keys & secrets (never committed to git)
│   ├── .env                         # Real secrets (gitignored ✓)
│   └── .env.example                 # Safe template (committed to git ✓)
│
├── package.json                     # Project manifest & npm scripts
├── vercel.json                      # Vercel deployment configuration
└── README.md
```

---

## ⚙️ Configuration

All personal information and API keys live in `keys/.env`.
Run `npm run sync` to write initial defaults into `frontend/config.js`.

**`keys/.env` structure:**
```bash
# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Contact Form & Security
WEB3FORMS_ACCESS_KEY=your_web3forms_access_key
HCAPTCHA_SITEKEY=50b2fe65-b00b-4b9e-ad62-3ba471098be2

# Cloudinary Media Storage (Unsigned Direct Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_UPLOAD_PRESET=your_preset
AVATAR_URL=https://res.cloudinary.com/...
FAVICON_URL=https://res.cloudinary.com/...

# MongoDB Atlas (Cloud Persistence)
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/myportfolio?retryWrites=true&w=majority

# Inngest Background Workflows (Optional)
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

# Whitelist of Authorized Admins (comma-separated)
AUTHORIZED_USERS=your@email.com
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
  --red:          #00ff00;       /* Signature neon green accent (customizable in developer settings) */
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
