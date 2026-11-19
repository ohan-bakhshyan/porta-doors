# Architectural Documentation Suite: Architectural Doors Catalog & CMS Platform

This directory contains the comprehensive architectural blueprints and specifications for creating the high-end architectural doors catalog and content management system, modeled after **Doors Los Angeles** ([doorslosangeles.com](https://doorslosangeles.com)) with reference benchmarks from **Urban Doors Company** ([urbandoorscompany.com](https://www.urbandoorscompany.com)) and **Interior Doors Co** ([interiordoorsco.com](https://interiordoorsco.com)).

---

## Document Index

| Document | Purpose & Scope |
|---|---|
| [**01-SYSTEM-ARCHITECTURE.md**](./01-SYSTEM-ARCHITECTURE.md) | High-level system architecture, client vs. admin topology, runtime environment strategy, catalog-first "no purchase initially" business model, and component interactions. |
| [**02-CATALOG-AND-DATA-MODELS.md**](./02-CATALOG-AND-DATA-MODELS.md) | Complete data entities and TypeScript schemas: Door Models, Categories, Finishes/Swatches, Sizing, Jamb/Frame options, Hardware, Layout Config, Static Pages, and Quote Leads. |
| [**03-ADMIN-PANEL-SPECIFICATION.md**](./03-ADMIN-PANEL-SPECIFICATION.md) | Detailed administrative capabilities: Dashboard overview, Catalog CRUD, Homepage Layout & Section Reordering Controller, Static Pages CMS, and Quote Inquiries Inbox. |
| [**04-FRONTEND-UIUX-SPECIFICATION.md**](./04-FRONTEND-UIUX-SPECIFICATION.md) | Frontend design tokens, typography, cardinal red accent cues, sticky header, mega-menu, homepage layout modules, faceted catalog filtering, interactive door customizer, and Quote List drawer. |
| [**05-VIBECODING-IMPLEMENTATION-GUIDE.md**](./05-VIBECODING-IMPLEMENTATION-GUIDE.md) | Phase-by-phase implementation roadmap, directory scaffolding, file manifests, and prompt-driven agile execution playbook. |

---

## Architectural Highlights
1. **Catalog-First Experience**: Purchases/credit card checkouts are not enabled initially. Instead, a streamlined **"Request a Quote" / "Add to Quote List"** workflow captures customer leads and door specifications.
2. **Total Admin Control**: The Admin Panel controls:
   - **Catalog**: Create, edit, and categorize doors, finishes, sizes, and architectural spec sheets.
   - **Layout**: Drag, drop, reorder, or toggle homepage sections, hero banners, and promotional announcement bars.
   - **Static Content**: Manage *About Us*, *Showroom & Location*, *Installation Services*, and *2-Year Warranty*.
   - **Leads**: Review, track, and export quote requests submitted by homeowners and contractors.
3. **Showroom Seed Data**: Pre-configured with realistic Los Angeles showroom data (Gardena warehouse address, `(424) 426-5566` phone, high-end frameless, swing, pocket, and barn door collections).
