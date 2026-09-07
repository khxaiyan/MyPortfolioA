# 🌗 Master Guide: Complete Light & Dark Mode Implementation & Extraction

A comprehensive, step-by-step technical guide on how light-to-dark and dark-to-light mode works, how it is implemented in this Astro project, and how to extract and paste it into any other web project (HTML/CSS/JS, React, or Tailwind).

---

## 📑 Table of Contents
1. [Core Principles of Modern Theme Switching](#1-core-principles-of-modern-theme-switching)
2. [The Anti-FOUC Solution (Eliminating the Screen Flash)](#2-the-anti-fouc-solution-eliminating-the-screen-flash)
3. [The Design Token Palette (Light vs Dark)](#3-the-design-token-palette-light-vs-dark)
4. [Astro Project Implementation (Files Modified)](#4-astro-project-implementation-files-modified)
5. [Standalone Extraction (Copy & Paste for Other Projects)](#5-standalone-extraction-copy--paste-for-other-projects)
   - [A. Vanilla HTML + CSS + JavaScript (e.g., MyPortfolioA)](#a-vanilla-html--css--javascript)
   - [B. Tailwind CSS Setup](#b-tailwind-css-setup)
   - [C. React Component Setup](#c-react-component-setup)
6. [Troubleshooting & FAQs (Resolving 'astro' not recognized)](#6-troubleshooting--faqs)

---

## 1. Core Principles of Modern Theme Switching

A professional theme switcher relies on **3 core layers**:

```
┌─────────────────────────────────────────────────────────┐
│ 1. State & Storage (JavaScript)                         │
│    Reads/saves user preference in localStorage & OS     │
├─────────────────────────────────────────────────────────┤
│ 2. Class Modifier on Root (DOM)                         │
│    Adds or removes the 'dark' class on <html>           │
├─────────────────────────────────────────────────────────┤
│ 3. Semantic CSS Variables (CSS / Tailwind)              │
│    Colors change automatically through CSS variables    │
└─────────────────────────────────────────────────────────┘
```

### Why Use CSS Variables (`var(--name)`)?
Instead of writing duplicate CSS rules for every class (e.g., `.dark .card { ... }`), we define **semantic variables**.
- In **Light Mode** (`:root`), `--card-bg` is white/translucent light grey.
- In **Dark Mode** (`html.dark`), `--card-bg` is dark obsidian/translucent black.
- Components simply use `background: var(--card-bg)`. When the class on `<html>` switches from `""` to `"dark"`, **every component on the page adapts instantly with zero duplicate CSS!**

---

## 2. The Anti-FOUC Solution (Eliminating the Screen Flash)

### What is FOUC?
**FOUC** stands for *Flash of Unstyled Content*. If your theme script is placed in an external file or loaded after the page renders:
1. The browser renders the default light/dark page.
2. JavaScript finishes downloading and reads `localStorage`.
3. JavaScript applies the dark class.
4. **The user sees an annoying white or black flash.**

### The Fix: Synchronous Inline `<head>` Script
Place an inline `<script>` in the `<head>` of your HTML **before any stylesheets or body content**:

```html
<script is:inline>
  (function () {
    // 1. Check localStorage first
    const savedTheme = typeof localStorage !== 'undefined' ? localStorage.getItem('theme') : null;
    
    // 2. Fall back to system preference (OS setting)
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // 3. Determine if dark mode should be enabled
    const isDark = savedTheme ? savedTheme === 'dark' : systemPrefersDark;
    
    // 4. Immediately add or remove 'dark' class before rendering
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  })();
</script>
```

Because this script runs synchronously in `<head>`, the browser already knows whether to render in dark or light mode before the first pixel is drawn.

---

## 3. The Design Token Palette (Light vs Dark)

Here is the exact token system configured for this project to maintain high contrast and aesthetic polish:

| Token Name | Light Mode Value | Dark Mode Value | Usage |
| :--- | :--- | :--- | :--- |
| `--background` | `#f8fafc` (Soft White-Slate) | `#101010` (Deep Obsidian) | Page body background |
| `--card-bg` | `rgba(255, 255, 255, 0.85)` | `#1414149c` (Glass Obsidian) | Cards, badges, drawers |
| `--card-hover` | `rgba(241, 245, 249, 0.95)` | `#1e1e1e9c` | Card hover states |
| `--white` | `#0f172a` (Crisp Charcoal Black) | `#dfdfdf` (Off-white) | Headings, primary text |
| `--white-icon` | `#475569` (Muted Slate Grey) | `#f3f3f398` (Soft Light Grey) | Subtitles, body text, icons |
| `--white-icon-tr`| `rgba(0, 0, 0, 0.08)` (Subtle Grey) | `#f3f3f310` (Subtle White) | Borders, card outlines, dividers |
| `--sec` | `#7c3aed` (Deep Violet) | `#a476ff` (Bright Lavender) | Accent, highlights, badges |
| `--nav-bg` | `rgba(255, 255, 255, 0.85)` | `#1414149c` | Floating navigation bar |

---

## 4. Astro Project Implementation (Files Modified)

In this project, the following files work together to power the system:

### 1. `tailwind.config.mjs`
Enabled class-based dark mode so Tailwind utilities respect `html.dark`:
```javascript
export default {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  // ...
};
```

### 2. `src/layouts/Layout.astro`
- Added the anti-FOUC `<script is:inline>` inside `<head>`.
- Defined `:root` (Light mode) and `html.dark` (Dark mode) tokens.
- Added smooth color transition to `body`:
```css
body {
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

### 3. `src/components/ThemeToggle.astro`
An interactive toggle button with:
- Sun SVG icon (shown in dark mode, switches to light).
- Moon SVG icon (shown in light mode, switches to dark).
- Click listener that toggles the `.dark` class and saves the setting to `localStorage`:
```typescript
toggleBtn.addEventListener("click", () => {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateIcons(isDark);
});
```

### 4. `src/components/nav.astro`
- Imported and rendered `<ThemeToggle />` directly inside the floating navigation bar.
- Changed `nav a.active` color from hardcoded `white` to `var(--white)` so active links are sharp and readable in both light and dark modes.

### 5. Cards and React Components
Updated hardcoded `#1414149c` classes to `var(--card-bg)` and `var(--card-hover)` in:
- `home.astro`, `about.astro`, `services.astro`, `projects.astro`, `contact.astro`, `footer.astro`
- `FAQAccordion.tsx`, `SkillsList.tsx`, `TestimonialsMarquee.tsx`, `LikeButton.tsx`

---

## 5. Standalone Extraction (Copy & Paste for Other Projects)

If you want to add this exact dark/light mode toggle to any other project (such as `MyPortfolioA` or an HTML/JS template), follow this 4-step guide:

### A. Vanilla HTML + CSS + JavaScript

#### Step 1: Add the Head Script (`index.html`)
Inside `<head>`, paste:
```html
<script>
  (function () {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  })();
</script>
```

#### Step 2: Add the CSS Design Tokens (`style.css`)
```css
/* =========================================
   LIGHT & DARK MODE CSS VARIABLES
   ========================================= */

/* Default (Light Mode) */
:root {
  --background: #f8fafc;
  --card-bg: rgba(255, 255, 255, 0.85);
  --card-hover: rgba(241, 245, 249, 0.95);
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --border-color: rgba(0, 0, 0, 0.08);
  --accent-color: #7c3aed;
}

/* Dark Mode */
html.dark {
  --background: #101010;
  --card-bg: #1414149c;
  --card-hover: #1e1e1e9c;
  --text-primary: #dfdfdf;
  --text-secondary: #f3f3f398;
  --border-color: rgba(255, 255, 255, 0.1);
  --accent-color: #a476ff;
}

/* Smooth Transition across the page */
body {
  background-color: var(--background);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Generic Card Class */
.custom-card {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.custom-card:hover {
  background-color: var(--card-hover);
}

/* Toggle Button Styling */
.theme-toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background-color: var(--card-bg);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.theme-toggle-btn:hover {
  background-color: var(--card-hover);
  color: var(--text-primary);
  transform: scale(1.05);
}

/* Icon Switching Logic */
html.dark .theme-icon-moon { display: none; }
html.dark .theme-icon-sun { display: block; }
html:not(.dark) .theme-icon-sun { display: none; }
html:not(.dark) .theme-icon-moon { display: block; }
```

#### Step 3: Add the HTML Button (`index.html`)
Paste this button wherever you want it to appear (e.g. in your `<nav>` or header):
```html
<button id="theme-toggle" class="theme-toggle-btn" aria-label="Toggle Light and Dark Mode">
  <!-- Sun Icon (Active when dark) -->
  <svg class="theme-icon-sun" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16ZM11 1H13V4H11V1ZM11 20H13V23H11V20ZM3.51472 4.92893L4.92893 3.51472L7.05025 5.63604L5.63604 7.05025L3.51472 4.92893ZM16.9497 18.364L18.364 16.9497L20.4853 19.0711L19.0711 20.4853L16.9497 18.364ZM19.0711 3.51472L20.4853 4.92893L18.364 7.05025L16.9497 5.63604L19.0711 3.51472ZM5.63604 16.9497L7.05025 18.364L4.92893 20.4853L3.51472 19.0711L5.63604 16.9497ZM23 11V13H20V11H23ZM4 11V13H1V11H4Z" />
  </svg>
  <!-- Moon Icon (Active when light) -->
  <svg class="theme-icon-moon" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 7C10 10.866 13.134 14 17 14C18.9584 14 20.7288 13.1965 22 11.8973C21.4965 17.5878 16.7118 22 10.8889 22C4.87515 22 0 17.1249 0 11.1111C0 5.28822 4.41219 0.503466 10.1027 0C8.80352 1.2712 8 3.04159 8 5C8 5.68749 8.13886 6.34293 8.39088 6.94098C8.89201 6.97998 9.43981 7 10 7ZM12 4.09916C10.741 4.54911 10 5.68817 10 7C10 8.65685 11.3431 10 13 10C14.3118 10 15.4509 9.25901 15.9008 8.00084C14.5161 7.24075 13.3323 6.09633 12.5186 4.70882C12.3389 4.4988 12.1654 4.29472 12 4.09916Z" />
  </svg>
</button>
```

#### Step 4: Add the JavaScript Click Handler (`app.js`)
```javascript
const themeToggle = document.getElementById('theme-toggle');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    // 1. Toggle dark class on <html>
    const isDark = document.documentElement.classList.toggle('dark');
    
    // 2. Persist in localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}
```

---

### B. Tailwind CSS Setup
If using Tailwind CSS in your other project:
1. In `tailwind.config.js`:
   ```javascript
   module.exports = {
     darkMode: 'class', // REQUIRED
     // ...
   }
   ```
2. In your HTML/JSX, you can use either the CSS variable system or Tailwind's `dark:` modifier:
   ```html
   <div class="bg-white text-gray-900 dark:bg-zinc-900 dark:text-zinc-100">
     Adaptive Card
   </div>
   ```

---

### C. React Component Setup
If you want a React component (`ThemeToggle.jsx`):
```jsx
import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
    if (nextIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className="p-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 transition-all"
    >
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}
```

---

## 6. Troubleshooting & FAQs

### Error: `'astro' is not recognized as an internal or external command`
#### Cause:
Dependencies are not installed in the project folder yet.
#### Fix:
Run the following commands in your PowerShell / Terminal:

```powershell
# 1. Move to the inner project directory:
cd "Main-Portfolio-main"

# 2. Install dependencies:
npm install

# 3. Start the dev server:
npm run dev
```

Once installed, running `npm run dev` or `npm run serve` from the root directory will automatically start the project smoothly at `http://localhost:4321`.

---

### FAQ: How does the system remember the theme across page refreshes?
When the user clicks the toggle button:
`localStorage.setItem('theme', isDark ? 'dark' : 'light');`
When any page loads, the anti-FOUC script inside `<head>` checks `localStorage.getItem('theme')`. If set to `'dark'`, it adds the `dark` class before the page is visible, preserving the choice permanently.

---

### FAQ: What happens if a user has never visited the site before?
The anti-FOUC script checks `window.matchMedia('(prefers-color-scheme: dark)').matches`. If their laptop/phone is set to dark mode, your site will automatically open in dark mode. If their OS is set to light mode, it opens in light mode. Once they click the toggle button, their explicit choice takes precedence.
