# BrandForge Blog

This repository contains the source code for the BrandForge Blog, built to align perfectly with the BrandForge aesthetic and design system.

## 🚀 Tech Stack

- **Framework**: [Astro](https://astro.build/) - For fast, static site generation.
- **CMS**: [Sanity.io](https://sanity.io/) - Headless CMS used for managing blog posts, categories, and authors.
- **Styling**: Vanilla CSS utilizing CSS variables for a maintainable design system.
- **Typography**: `Syne` (Display) and `Inter` (Sans-serif) to match the main brandforgeinc.com website.
- **Deployment**: Cloudflare Pages.

## 📁 Project Structure

```text
/
├── public/                 # Static assets (images, icons)
├── src/
│   ├── components/         # Reusable UI components (Header, Footer, HeroSlider, etc.)
│   ├── layouts/            # Page wrappers (Layout.astro)
│   ├── lib/                # Utilities and Sanity client config (sanity.ts, queries.ts)
│   ├── pages/              # Astro routes (index.astro, blog/[slug].astro)
│   └── styles/             # Global CSS variables and design tokens (globals.css)
└── package.json
```

## 🛠️ Local Development

### 1. Install Dependencies

```sh
npm install
```

### 2. Environment Variables

Ensure your Sanity credentials are set up. Create a `.env` file in the root directory (if not already present). The project ID and dataset are publicly accessible, but required to fetch content:

```env
PUBLIC_SANITY_PROJECT_ID="dij92dms"
PUBLIC_SANITY_DATASET="production"
```

*(Note: Replace with your actual project ID if different)*

### 3. Start the Development Server

To run the site locally:

```sh
npm run dev
```

The site will be available at `http://localhost:4321`.

## 📦 Building & Deployment

To build a production version of the site:

```sh
npm run build
```

This will generate a static build in the `./dist/` folder.

**Deployment**: The site is set up for continuous deployment on **Cloudflare Pages**. Pushing to the `main` branch of the GitHub repository (`BrandForge-Ltd/brandforge-blog`) will automatically trigger a build and deployment.
