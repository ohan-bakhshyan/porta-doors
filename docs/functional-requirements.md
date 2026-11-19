# Functional Requirements Document (FRD): Minimalist Architectural Doors Platform

**Document Version:** 2.0  
**Design Philosophy:** Strict Architectural Minimalism (Zero Visual Clutter, Monochromatic Elegance, High Precision Grid)  
**Target:** Public Catalog & Comprehensive Content Management System (CMS)

---

## 1. Executive Summary & Brand Identity Shift

### 1.1 Aesthetic Reset: Stripping Away Reference Clutter
Previous references (Doors Los Angeles, Urban Doors, Interior Doors Co) served to understand domain features. In this iteration:
- **Discard all reference styling**, loud badges, and red marketing banners.
- Adopt a **pure minimalist architectural aesthetic**: high-contrast monochrome (`#000000`, `#FFFFFF`, `#707070`, subtle stone `#F9F9F9`), generous negative space, refined hairline borders (`1px solid #E5E5E5`), and geometric sans-serif typography (`Inter` / `Helvetica Neue` / `Plus Jakarta Sans`).

### 1.2 New Minimalist Logo Concept
- **Concept Name:** `KADO` / `PORTA` / `ARCHITRAVE STUDIO` (or client custom name).
- **Mark:** A single, continuous geometric line depicting a door swinging on an axis or a flush architectural jamb reveal.
- **Wordmark:** Clean uppercase monospace or geometric sans-serif with wide tracking (`letter-spacing: 0.2em`).

---

## 2. Core Functional Requirements

### 2.1 Independent Category Management
- **Stand-alone CRUD Module:** Categories are managed independently in their own dedicated Admin view (`/admin/categories`).
- **Attributes per Category:**
  * Category Name (e.g. *Frameless Systems*, *Interior Swing*, *Sliding & Pocket*, *Pivot Entrances*)
  * URL Slug (auto-generated or customized)
  * Display Order (drag-and-drop or numeric weight)
  * Cover / Banner Image
  * Category Status (`Active` / `Draft` / `Hidden`)
  * SEO Meta Tags (Title, Description)
- **Product Reassignment:** Deleting or deactivating a category prompts safe reassignment of associated door models.

---

### 2.2 Door Management & Multi-Image Asset Pipeline
- **Multi-Image Set:** Every door model supports an array of high-resolution images:
  * Overall architectural view
  * Detail close-up (jamb, 3D concealed hinge, magnetic lock reveal)
  * In-situ residential/commercial interior context
- **Primary / Cover Image Designation:**
  * Admin marks one image explicitly as `[Primary / Cover]`.
  * The primary image serves as the catalog grid preview and first hero shot.
  * Secondary images populate the interactive modal/gallery slider.
- **Image Upload & Download:**
  * Support for direct file upload from local machine.
  * Support for remote image URL downloading and local persistence.
  * Image alt text and caption management.

---

### 2.3 Strict Door Types Classification
Every door model must be categorized by its mechanical door system type:
1. **Single Swing** (Standard flush interior swinging door with concealed or prehung jamb)
2. **Single Pocket** (Single sliding slab disappearing into a framed wall cavity)
3. **Double Swing** (Pair of matching swinging doors for wide architectural openings)
4. **Double Pocket** (Biparting pocket doors meeting seamlessly in center)
5. **Barn System** (Surface-mounted sliding door on contemporary top-suspension rail)
6. **Bypass System** (Multi-panel sliding doors overlapping on parallel tracks, ideal for closets)
7. **Bifold System** (Folding paired panels optimizing clear opening space)
8. **Concealed Barn** (Zero visible track; mechanism concealed entirely inside top of door slab and wall)

---

### 2.4 Promotional Actions & Discount Engine
- **Promotional Campaigns Module:**
  * Campaign Name (e.g. *"Architectural Spring Showcase"*, *"Architect & Trade Incentive"*)
  * Discount Type:
    - **Percentage Discount** (e.g. `15% off`)
    - **Fixed Amount Discount** (e.g. `$150 off per door`)
  * Date Range: Start date and optional End date.
  * Active Toggle (`Enabled` / `Paused`).
- **Flexible Scope Targeting:**
  * **Option A: Entire Catalog / Category:** Apply discount across all doors in a selected category (e.g. *10% off all Frameless Systems*).
  * **Option B: Product Groups (Bundles / Custom Sets):**
    - Admin creates named Groups (e.g. *"Modern Black Hardware Package"*, *"Villa Renovation Set"*, *"Overstock 8-Foot Doors"*).
    - Assign specific doors to the group.
    - Apply custom discount rule to the group.
- **Frontend Display:**
  * Displays subtle original strikethrough price alongside promotional price.
  * Displays understated promotional badge (e.g. `PROMO — 15% OFF`).

---

### 2.5 Homepage Layout & Content Modules
The minimalist homepage consists of clean, high-impact sections:
1. **Minimalist Architectural Hero:**
   - Full-bleed or framed high-contrast architectural photo.
   - Clean typographic manifesto.
   - Minimalist CTAs: `Explore Collections` and `Request Specification / Quote`.
2. **New Arrivals Showcase:**
   - Editorial spotlight on the latest door models and newly engineered profiles.
3. **Best Sellers Showcase:**
   - Curated grid of top-specified door models with starting prices or quote badges.
4. **Door Systems Directory:**
   - Visual catalog cards for the 8 Door Types (Single Swing, Pocket, Barn, Concealed, etc.).
5. **Architectural Projects & Client Feedback:**
   - Highlighting verified completed architectural installations with real photos and client feedback.
6. **Direct Quote & Specification Request:**
   - Understated form for architects, designers, and homeowners to submit blueprints, schedules, or door counts.

---

### 2.6 Completed Projects & Client Feedback (Portfolio CMS)
- **Dedicated Admin Section (`/admin/projects`):**
  * Project Title (e.g. *"Trousdale Estates Residence"*, *"Silicon Beach Design Studio"*)
  * Client Type (`Architect`, `Interior Designer`, `General Contractor`, `Homeowner`)
  * Project Location (e.g. *"Beverly Hills, CA"*, *"Brentwood, Los Angeles"*)
  * Door Systems Installed (tags: *Single Swing Frameless*, *Concealed Barn*)
  * High-Res Project Photo Gallery (exterior context, hallway alignment, door close-up)
  * Client Testimonial & Review Text (verified architect/client feedback quote)
  * Completion Date
  * Featured on Homepage Toggle
- **Frontend Presentation:**
  * Clean architectural case study cards.
  * Minimalist client testimonial quotes with client name and architectural practice.
