<div align="center">

# khxaiyan — Developer Portfolio

<p><em>A modern, high-performance, minimalist developer portfolio featuring zero-flash theme hydration, dynamic GitHub project and language synchronization, cloud persistence, and a secure serverless architecture.</em></p>

[![Live Site](https://img.shields.io/badge/Live_Site-khxaiyan.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=black)](https://khxaiyan.vercel.app)   
[![GitHub](https://img.shields.io/badge/GitHub-@khxaiyan-000000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/khxaiyan)   
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

</div>

---

## 📑 Table of Contents

- [✨ Overview & Highlights](#-overview--highlights)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Complete Installation & Setup Guide](#-complete-installation--setup-guide)
  - [Prerequisites](#prerequisites)
  - [Step 1: Clone the Repository](#step-1-clone-the-repository)
  - [Step 2: Install Dependencies](#step-2-install-dependencies)
  - [Step 3: Configure Environment Keys](#step-3-configure-environment-keys)
  - [Step 4: Synchronize Environment Variables](#step-4-synchronize-environment-variables)
  - [Step 5: Start the Local Development Server](#step-5-start-the-local-development-server)
  - [Step 6: Access Local Portfolio & Developer Panel](#step-6-access-local-portfolio--developer-panel)
- [⚙️ Environment Variables Reference](#️-environment-variables-reference)
- [🌐 Production Deployment Guide](#-production-deployment-guide)
  - [Deploying to Vercel (Recommended)](#deploying-to-vercel-recommended)
  - [Deploying to GitHub Pages](#deploying-to-github-pages)
- [🎨 Design System & Visual Customization](#-design-system--visual-customization)
- [📬 Contact Form Integration](#-contact-form-integration)
- [🙏 Acknowledgements & Credits](#-acknowledgements--credits)
- [👤 Author](#-author)
- [📄 License](#-license)

---

## ✨ Overview & Highlights

- **⚡ Zero-Flash Live Theme Hydration**: Direct serverless configuration streaming via `/api/config.js` ensuring instant, single-paint theme and asset loading in incognito and privacy-focused browsers (Brave Shields, Firefox Enhanced Tracking).
- **🛡️ Pure CSS & HTML Fallbacks**: Pre-rendered project cards and resilient CSS design tokens for zero layout shifts and instant readability even when JavaScript is disabled or blocked.
- **⚡ Dynamic GitHub Sync & Language Detection**: Automatically imports repository details, live demo links, star counts, and coding languages directly from GitHub API (`@khxaiyan`).
- **🎨 Signature Tech Branding**: Sleek rail-node timeline layout, modern typography with *Space Grotesk* and *IBM Plex Mono*, and automatic accent highlighting (`glyph-5`) on wordmark and project capital letters.
- **🌓 Dual Theme Support (Dark & Light)**: Smooth theme toggling with immediate `localStorage` state persistence and system color-scheme detection.
- **🍃 MongoDB Atlas Cloud Persistence**: Instant configuration saving without git-push clutter or Vercel redeployment delays.
- **☁️ Cloudinary Direct Media Uploads**: Fast CDN delivery for avatars, favicons, and assets with local base64 fallback.
- **⚡ Inngest Event-Driven Workflows**: Background pipelines for automated GitHub stars synchronization and contact message archiving.
- **📬 Working Contact Form**: Web3Forms integration with hCaptcha bot verification for spam protection.
- **🔒 Privacy & Security First**: Complete `.gitignore` setup, sanitized credentials, and isolated `keys/` folder — secrets are never served to the browser.
- **🔐 Clerk Authentication & Developer Customizer**: Role-protected developer settings (`/developer` & quick modal) for updating profiles, social links, projects, and themes with live instant previews.
- **📱 Fully Responsive**: Flawless experience across mobile, tablet, and widescreen desktop monitors.

---

## 🛠️ Tech Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Structure** | HTML5 | Semantic, accessible document structure with pre-rendered cards |
| **Styling** | Vanilla CSS | Custom design tokens, CSS variables, responsive grid, animations |
| **Client Logic** | Vanilla JavaScript (ES6+) | Dynamic API hydration, theme synchronization, form handling |
| **Database** | MongoDB Atlas | Instant cloud configuration storage (`/api/save-config` & `/api/config.js`) |
| **Media CDN** | Cloudinary | Global CDN media storage & direct unsigned uploads |
| **Workflows** | Inngest | Background serverless workflows (`/api/inngest`), cron GitHub sync |
| **Authentication** | Clerk | Authentication & RBAC for the developer admin dashboard |
| **Contact Form** | Web3Forms API | Serverless contact form submission endpoint |
| **Anti-Bot Protection**| hCaptcha | Privacy-friendly CAPTCHA protection |
| **Icons** | Iconify & Custom SVG | Authentic full-color brand logos and vector icons |
| **Hosting & Functions**| Vercel | Serverless functions hosting and continuous deployment |

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
│   ├── config.js                    # Local configuration fallback
│   ├── cv.pdf                       # Local résumé file
│   └── robots.txt                   # Search engine crawl rules
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
├── .github/                         ← GitHub workflows & automation
│   ├── dependabot.yml               # Automated weekly dependency security updates
│   └── workflows/
│       └── notify-deploy.yml        # Webhook trigger for GitHub Pages
│
├── package.json                     # Project manifest & npm scripts
├── vercel.json                      # Vercel deployment configuration
├── .gitignore                       # Strict recursive secrets exclusion rules
└── README.md
```

---

## 🚀 Complete Installation & Setup Guide

Follow this step-by-step walkthrough to run the portfolio locally on your computer:

### Prerequisites

Make sure you have the following installed on your machine:
- **[Node.js](https://nodejs.org/)** (v18.0.0 or higher)
- **[Git](https://git-scm.com/)**
- **npm** (bundled with Node.js)

Verify your installation:
```bash
node -v
npm -v
git --version
```

---

### Step 1: Clone the Repository

Clone the project from GitHub and navigate into the workspace:

```bash
git clone https://github.com/khxaiyan/MyPortfolioA.git
cd MyPortfolioA
```

---

### Step 2: Install Dependencies

Install all project dependencies:

```bash
npm install
```

---

### Step 3: Configure Environment Keys

Create your private environment file from the provided example template:

```bash
# On Windows (PowerShell):
Copy-Item keys/.env.example keys/.env

# On Linux / macOS:
cp keys/.env.example keys/.env
```

Open `keys/.env` in your text editor and fill in your values (see [Environment Variables Reference](#️-environment-variables-reference) below for guidance).

---

### Step 4: Synchronize Environment Variables

Run the sync script to compile public variables from `keys/.env` into `frontend/config.js`:

```bash
npm run sync
```

> **Note:** The sync script only copies safe, client-facing identifiers (like Clerk publishable key and Web3Forms key) into `frontend/config.js`. Private secrets (like `MONGODB_URI` and `CLERK_SECRET_KEY`) are kept strictly isolated on the backend.

---

### Step 5: Start the Local Development Server

Start the local server:

```bash
npm run serve
```

Alternatively, you can run sync and serve in a single command:
```bash
npm run dev
```

---

### Step 6: Access Local Portfolio & Developer Panel

Open your browser and navigate to:
- **Portfolio Homepage**: [`http://localhost:3000`](http://localhost:3000)
- **Developer Admin Panel**: [`http://localhost:3000/developer`](http://localhost:3000/developer)

---

### npm Scripts Reference

| Command | Description |
| :--- | :--- |
| `npm run sync` | Reads `keys/.env` and updates `frontend/config.js` |
| `npm run serve` | Starts the local dev server at `http://localhost:3000` with API routing |
| `npm run dev` | Runs `sync` followed by `serve` |
| `npm run start` | Alias for `npm run dev` |

---

## ⚙️ Environment Variables Reference

All credentials are kept in `keys/.env` (which is excluded from Git tracking):

```bash
# ==========================================
# ── PUBLIC KEYS & CLIENT IDENTIFIERS ──
# (Safe for browser / client-side consumption)
# ==========================================

# Clerk Authentication (Publishable Key - https://clerk.com)
CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_FRONTEND_API=https://your-app.clerk.accounts.dev

# Contact Form & Anti-Bot Protection (https://web3forms.com & https://hcaptcha.com)
WEB3FORMS_ACCESS_KEY=your_web3forms_access_key
HCAPTCHA_SITEKEY=50b2fe65-b00b-4b9e-ad62-3ba471098be2

# Cloudinary Media Storage (Unsigned Direct Uploads - https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_UPLOAD_PRESET=your_upload_preset
AVATAR_URL=https://res.cloudinary.com/your_cloud_name/image/upload/avatar.png
FAVICON_URL=https://res.cloudinary.com/your_cloud_name/image/upload/favicon.png

# ==========================================
# ── PRIVATE KEYS & ADMIN SECRETS ──
# (Keep secure - Server-side & admin access only)
# ==========================================

# Clerk Secret Key (Backend API access only)
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key

# Authorized Admin Whitelist (Comma-separated emails allowed to edit settings)
AUTHORIZED_USERS=your@email.com

# MongoDB Atlas (Cloud Persistence Connection String)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/myportfolio?retryWrites=true&w=majority

# Inngest Background Workflows (Optional - https://inngest.com)
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

---

## 🌐 Production Deployment Guide

### Deploying to Vercel (Recommended)

1. Push your repository to GitHub.
2. Log in to **[Vercel](https://vercel.com/)** and click **Add New** → **Project**.
3. Import your **`MyPortfolioA`** repository.
4. In the configuration screen:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave default, `vercel.json` will route to `frontend`)
   - **Build Command**: `node backend/sync-env.js`
   - **Output Directory**: `frontend`
5. Expand **Environment Variables** and add your secrets from `keys/.env`:
   - `MONGODB_URI`
   - `CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `AUTHORIZED_USERS`
   - `WEB3FORMS_ACCESS_KEY`
   - `HCAPTCHA_SITEKEY`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_UPLOAD_PRESET`
   - `INNGEST_EVENT_KEY` (optional)
   - `INNGEST_SIGNING_KEY` (optional)
6. Click **Deploy**. Vercel will build and assign your free SSL production URL.

---

### Deploying to GitHub Pages

If you wish to deploy to GitHub Pages:
1. Under your repository **Settings** → **Pages**, select **GitHub Actions** as the source.
2. The bundled `.github/workflows/notify-deploy.yml` workflow can trigger deployment on push to `main`.
3. If running statically on GitHub Pages, ensure `npm run sync` has been run locally so `frontend/config.js` holds your public configuration.

---

## 🎨 Design System & Visual Customization

The design system is managed via CSS variables in [style.css](file:///c:/Users/Lenovo/AIYAN/GitHub%20Project/khxaiyan/MyPortfolioA/frontend/style.css):

```css
:root {
  --bg:            #0a0a0e;       /* Deep dark background */
  --surface:       #131319;       /* Card surface background */
  --surface-hover: #191a22;       /* Elevated card hover surface */
  --line:          rgba(255,255,255,0.09); /* Subtle divider lines */
  --line-strong:   rgba(255,255,255,0.20);
  --ink:           #eef0f4;       /* Primary text */
  --ink-dim:       #8d90a0;       /* Secondary text */
  --ink-faint:     #787c93;       /* Metadata / caption text */
  --red:           #ff2a5f;       /* Signature Crimson Red accent */
  --red-dim:       rgba(255,42,95,0.12);
  --rail:          #363a63;       /* Timeline connection line */
  --success:       #22c07d;       /* Star count and online badge */
}

/* Light Theme Variables */
[data-theme="light"] {
  --bg:            #f5f5f7;
  --surface:       #ffffff;
  --surface-hover: #f0f0f3;
  --ink:           #111118;
  --line:          rgba(0,0,0,0.08);
}
```

---

## 📬 Contact Form Integration

1. Sign up for a free Access Key at **[web3forms.com](https://web3forms.com/)**.
2. Add your Access Key to `keys/.env` under `WEB3FORMS_ACCESS_KEY`.
3. (Optional) Set up hCaptcha at **[hcaptcha.com](https://hcaptcha.com/)** and add your site key to `HCAPTCHA_SITEKEY`.
4. Run `npm run sync` to update `frontend/config.js`.
5. Messages submitted through the contact modal will be sent directly to your email inbox.

---

## 🙏 Acknowledgements & Credits

- Special thanks and credit to **[offici5l](https://github.com/offici5l)** — while he did not create the UI code directly, his creative work provided great inspiration for the interface design, clean aesthetics, and visual concept of this portfolio.
- **[Clerk](https://clerk.com/)** for seamless, secure developer authentication.
- **[Inngest](https://www.inngest.com/)** for background event-driven serverless orchestration.
- **[Iconify](https://iconify.design/)** & **[TheSVG](https://thesvg.org/)** for brand icons and vector assets.
- **[Web3Forms](https://web3forms.com/)** & **[hCaptcha](https://www.hcaptcha.com/)** for contact delivery and spam protection.

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
