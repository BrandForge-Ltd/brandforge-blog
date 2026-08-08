# BrandForge Blog — Project Handoff Documentation

**Live Blog:** [https://blog.brandforgeinc.com](https://blog.brandforgeinc.com)  
**Main Site:** [https://brandforgeinc.com](https://brandforgeinc.com)  
**Sanity Studio:** [https://blog.brandforgeinc.com/studio](https://blog.brandforgeinc.com/studio)  
**Repository:** [BrandForge-Ltd/brandforge-blog](https://github.com/BrandForge-Ltd/brandforge-blog)  
**Deployment:** Cloudflare Pages (Static Site Generation / SSG)

---

## 1. System Architecture & Tech Stack

* **Framework:** [Astro v4+](https://astro.build) with Static Site Generation (`output: "static"`).
* **UI Components:** React (for interactive elements like PDF modal, search, TOC, carousels).
* **Content Management (CMS):** [Sanity.io v3](https://sanity.io) (`projectId: "aejxymic"`, `dataset: "production"`).
* **CRM & Lead Capture:** **ForgeHub CRM** (`https://crm.brandforgeinc.com`) via `forgehub-capture.js`.
* **Hosting & CDN:** Cloudflare Pages (global edge distribution, 300+ data centers).
* **Styling:** Bespoke Vanilla CSS with design tokens in `src/styles/globals.css`.

---

## 2. Editorial & Publishing Workflow (Sanity Studio)

### Accessing the CMS
Go to **`https://blog.brandforgeinc.com/studio`** (embedded directly into the website).

### Post Fields & Capabilities
1. **Title & Slug:** Title generates a clean, root-level permalink (`https://blog.brandforgeinc.com/my-post-title`).
2. **Published Date:** Automatically pre-filled with the current date/time (`initialValue: () => new Date().toISOString()`). If omitted, queries automatically fall back to creation time (`coalesce(publishedAt, _createdAt)`).
3. **Authors:** Select from single or multiple contributing authors.
4. **Categories:** Categorize posts under Strategy, Branding, Business, Design, Technology, AI & Automation, etc.
5. **Main Image (Cover):** Supports hotspot cropping. Automatically serves optimized WebP/AVIF images and social OG preview images for Twitter/LinkedIn.
6. **SEO Description & Keywords:** Used for Google meta descriptions and social share previews.
7. **Audio Narration (MP3):** Upload pre-recorded MP3 narration files to activate the custom audio player on the article.
8. **Rich Body Editor (Portable Text):**
   * **Text:** Headings (H2, H3), lists, links, inline code.
   * **Images:** Inline illustrations and figures with captions.
   * **Quotes:** Highlight text and choose *Quote* style for borderless editorial quotes.
   * **YouTube / Video Embeds:** Insert video block, paste YouTube/Vimeo URL, and set optional caption.
   * **Twitter / X Embeds:** Insert tweet block and paste any `x.com` / `twitter.com` URL to render the official interactive card.
   * **Callout Box:** Dedicated quote box with author attribution.

---

## 3. Automated Deployment & Webhook Pipeline

* **Push to GitHub (`main`):** Automatically triggers Cloudflare Pages to build and deploy static HTML.
* **Publishing in Sanity:** A Sanity Webhook triggers Cloudflare's **Deploy Hook** on `Create`, `Update`, and `Delete` events (`_type == "post"`), ensuring that any newly published post or edit appears on the live site automatically in ~60 seconds.

---

## 4. Gated PDF Downloads & ForgeHub CRM Integration

1. **Lead Capture Flow:**
   * Readers click **`PDF Edition`** (located subtly in the post metadata bar).
   * First-time visitors are presented with a minimalist capture modal asking for:
     * Full Name (Required)
     * Business Email (Required)
     * Company / Organization (Optional)
   * The submission is immediately dispatched to **ForgeHub CRM** (`https://crm.brandforgeinc.com`) using `site_key: "blog_brandforgeinc_com"` and tagged with the post title as the lead source.
2. **1-Click Returning Session Memory:**
   * Captured contact details are saved in `localStorage`. Returning visitors can download any future article PDF in **1 click** without re-entering their data.
3. **Clean Publication PDF Layout (`@media print`):**
   * Custom print styling strips all web UI (nav, sidebars, TOC, audio player, modal overlays).
   * Generates a clean 2-column header with BrandForge Logo, Title, Author, Date, Cover Image, and footer copyright attribution.

---

## 5. SEO, Permalinks, & Backward Compatibility

* **Root Permalinks:** Post URLs follow the modern standard:
  `https://blog.brandforgeinc.com/:slug`
* **301 Redirects:** Legacy `/blog/:slug` URLs are automatically redirected to `/:slug` via `public/_redirects` on Cloudflare Pages to preserve backlinks and search rankings.

---

## 6. Local Development & Build Commands

```bash
# Install dependencies
npm install

# Start local development server (with Sanity Studio at /studio)
npm run dev

# Build static production bundle (outputs to dist/)
npm run build

# Preview static production build locally
npm run preview
```
