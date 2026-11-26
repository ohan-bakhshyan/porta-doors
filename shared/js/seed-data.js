/**
 * DOORS GALLERY — Showroom Seed Data (v3)
 * Structured with 3 Rotating Hero Banners, Category Showcase, New Models,
 * Category Best Sellers, 8 Mechanical Systems, Projects, and Brand Logo settings.
 */

export const INITIAL_SEED_DATA = {
  // 1. Initial Admin Accounts
  admins: [
    {
      id: 'admin-001',
      username: 'admin',
      passwordHash: 'admin',
      name: 'Showroom Administrator',
      email: 'admin@doorsgallery.com',
      role: 'superadmin',
      isActive: true,
      createdAt: '2025-01-01T00:00:00Z'
    }
  ],

  // 2. Global Site Settings & Homepage Configurations
  settings: {
    companyName: 'DOORS GALLERY',
    tagline: 'Architectural Interior & Concealed Door Systems',
    logoUrl: '../shared/assets/logo-mark.png',
    logoBadgeUrl: '../shared/assets/logo.jpeg',
    phone: '+1 (800) 942-7678',
    email: 'sales@doorsgallery.com',
    tradeLine: '+1 (800) 942-7678',
    catalogPdfUrl: '#',
    certifications: 'CE & UL Certified Flush Systems • ISO 9001 Certified',
    copyright: '© 2026 DOORS GALLERY. ALL RIGHTS RESERVED.',

    // 3 Rotating Hero Banners (Editable in Admin Settings)
    heroAutoplayMs: 5000,
    heroBanners: [
      {
        id: 'banner-1',
        badge: 'EUROPEAN ARCHITECTURAL SERIES',
        headline: 'Frameless & Flush Concealed Doors',
        subheadline: 'Zero-jamb doors engineered to sit 100% flush with drywall and plaster with silent magnetic latches.',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAo0SIg-akviU64YIyDKhR35TYcPhLzbsqrcevqKW-oQUPDFYtWMB1Mp1bcFcYT4cyLbjAgO_cvIDDpA1G8vuHU8exvI0fd8dFd5fq5h73yeKzWKaWgSeV_flrIAm4rrmf-dhctfybLRDGaVXtbKA4zA-I6kSiy8R_UbDRMOIo1BUPkUB0_gU1rxEXFwTiqe8RpYR2-0D0fIKrAS9YyxEaedon-jiO5psD8aAOmD2ZH6PZme7WzVRxBKw3puovKTdk3tGbWgAwyNU',
        ctaText: 'Explore Flush Doors',
        ctaLink: 'catalog.html?category=flush-concealed',
        secondaryCtaText: 'Request Quote',
        secondaryCtaLink: '#inquiry'
      },
      {
        id: 'banner-2',
        badge: 'ACOUSTIC WOOD & FLUTED GLASS',
        headline: 'Precision Sliding, Pocket & Pivot Systems',
        subheadline: '42dB solid-core European walnut, smoked oak, and reeded acoustic glass crafted for modern residences.',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
        ctaText: 'View Best Sellers',
        ctaLink: '#bestsellers',
        secondaryCtaText: 'Browse All Systems',
        secondaryCtaLink: '#systems'
      },
      {
        id: 'banner-3',
        badge: 'TRADE & ARCHITECTURAL SPECIFIERS',
        headline: 'Custom Millwork & Direct Project Pricing',
        subheadline: 'Tailored dimensions up to 12ft ceiling height, pre-assembled subframes, and active package incentives.',
        imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
        ctaText: 'Explore New Models',
        ctaLink: '#new-arrivals',
        secondaryCtaText: 'Submit Door Schedule',
        secondaryCtaLink: '#inquiry'
      }
    ],

    // Legacy single-hero fallback object kept synced with Banner 1 for compatibility
    hero: {
      directive: 'Architectural Showroom • Los Angeles • Milan • Zurich',
      headline: 'Frameless & Flush Concealed Doors',
      subheadline: 'Zero-jamb doors engineered to sit 100% flush with drywall and plaster with silent magnetic latches.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAo0SIg-akviU64YIyDKhR35TYcPhLzbsqrcevqKW-oQUPDFYtWMB1Mp1bcFcYT4cyLbjAgO_cvIDDpA1G8vuHU8exvI0fd8dFd5fq5h73yeKzWKaWgSeV_flrIAm4rrmf-dhctfybLRDGaVXtbKA4zA-I6kSiy8R_UbDRMOIo1BUPkUB0_gU1rxEXFwTiqe8RpYR2-0D0fIKrAS9YyxEaedon-jiO5psD8aAOmD2ZH6PZme7WzVRxBKw3puovKTdk3tGbWgAwyNU',
      modelBadge: 'Flush Concealed Series',
      metricsPill: 'ISO 9001 Certified • Concealed Hardware • Up to 12ft Height'
    },

    philosophy: {
      tag: 'Architectural Craftsmanship',
      quote: '“A door should either dissolve effortlessly into the architectural plane or celebrate pure material craft.”',
      attribution: 'Doors Gallery Design Standard • Bespoke Interior Systems'
    },

    // Homepage Section Configs (Matches Client Sequence)
    sectionConfigs: {
      categories: {
        enabled: true,
        tag: '01 / Collections',
        title: 'Product Categories',
        subtitle: 'Browse engineered interior door families by architectural material and wall integration.'
      },
      newArrivals: {
        enabled: true,
        tag: '02 / Latest Releases',
        title: 'New Models',
        subtitle: 'Newly released flush pivot leaves, motorized cavity sliders, and monolithic stone-veneered doors.',
        maxItems: 5
      },
      bestSellers: {
        enabled: true,
        tag: '03 / Most Specified',
        title: 'Category Best Sellers',
        subtitle: 'Top-performing models across our core door categories, ready for residential and commercial schedules.',
        maxItems: 5
      },
      mechanicalSystems: {
        enabled: true,
        tag: '04 / Hardware & Motion',
        title: '8 Mechanical Door Systems',
        subtitle: 'Precision opening typologies engineered for zero-tolerance jambs and smooth spatial transitions.',
        maxItems: 8
      },
      projects: {
        enabled: true,
        tag: '05 / Portfolio & Feedback',
        title: 'Completed Projects',
        subtitle: 'Installed residential and commercial projects with verified architect and client feedback.',
        maxItems: 6
      },
      inquiry: {
        enabled: true,
        tag: '06 / Project Estimation',
        title: 'Request a Quote & Specification',
        subtitle: 'Send your opening counts or door schedule for tailored trade pricing within 24 business hours.'
      },
      testimonials: {
        enabled: true,
        tag: '07 / Client Reviews',
        title: 'Architect & Builder Endorsements',
        subtitle: 'Feedback from design studios and contractors specifying Doors Gallery.'
      }
    },

    // Showroom Locations
    showrooms: [
      { city: 'Los Angeles', address: '8687 Melrose Ave, West Hollywood, CA' },
      { city: 'New York', address: '520 West 28th St, Chelsea, NY' },
      { city: 'Milan', address: 'Via Manzoni 14, Milano' },
      { city: 'Zurich', address: 'Gotthardstrasse 26, Zürich' }
    ]
  },

  // 3. Brands Directory
  brands: [
    {
      id: 'brand-porta-de',
      name: 'Doors Gallery Signature',
      slug: 'doors-gallery-signature',
      originCountry: 'Germany',
      bio: 'High-precision sub-millimeter concealed aluminum jambs and heavy-duty 3D adjustable pivot systems engineered in Stuttgart.',
      logo: '',
      heroBanner: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      isActive: true
    },
    {
      id: 'brand-rimadesio',
      name: 'Rimadesio Milan',
      slug: 'rimadesio-milan',
      originCountry: 'Italy',
      bio: 'Pioneers of architectural sliding systems, fluted acoustic glass partitions, and extruded anodized aluminum frames.',
      logo: '',
      heroBanner: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80',
      isActive: true
    },
    {
      id: 'brand-linvisibile',
      name: 'Linvisibile Portali',
      slug: 'linvisibile-portali',
      originCountry: 'Italy',
      bio: 'Italian planar continuity: concealed doors engineered to sit seamlessly flush with plaster, wood, and stone walls.',
      logo: '',
      heroBanner: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
      isActive: true
    },
    {
      id: 'brand-schuco',
      name: 'Schüco Systems',
      slug: 'schuco-systems',
      originCountry: 'Germany',
      bio: 'Benchmark in monumental pivot portals, slim-profile glass dividers, and certified acoustic attenuation.',
      logo: '',
      heroBanner: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
      isActive: true
    }
  ],

  // 4. Categories
  categories: [
    {
      id: 'cat-flush-concealed',
      name: 'Flush Concealed',
      slug: 'flush-concealed',
      description: 'Zero-jamb doors flush with drywall or plaster using hidden 3D hinges.',
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkRn-7elj6NOepzHtzLZukL4dvCKZMgsnIpfztYT15ONO-hyZL1xYrHS6ixDSJ1Hy4Jlk2Qn3nwfdkzgQ5Fc4XpKEZMjBntcUGFI8fGaUQLt3iPLDc2xkDdLbgSxCOcmKfZf7naSB68Y2GCQsbwOFONYJ_mkTWc-dS8x8H7eeu1-log2tS3ITLBGrTKVOR-mYcl6xWDbB7GU3pL0xZAwDhKI95_bxz1Zy4r0hWIB3kFsQIFl-1P0-nJUdCvc6JR8f_PRVo_qGNmkU',
      sortOrder: 1,
      isActive: true
    },
    {
      id: 'cat-monolithic-wood',
      name: 'Acoustic Wood',
      slug: 'acoustic-wood',
      description: 'Full-height smoked oak, walnut, and natural veneers with 42dB+ solid cores.',
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQlCc-a_yLLj9dlqmzYSkyHDKXvqn3Ew1dc7w4PohjVtuXmV1gcXNnY7AcXgRvqTVihXtD3qlSdxPoM1YNj8TauMFNm1UC19mXnYDEKfR7LEYapjaN15sI11aZhX66a5UiH4RWBUvZp3bDDqHGroASF46kv7Lj1kjlYKSLRS5jGbShTxxtBK8fHRqI3HWv7LA1W8Yx5S-Gw2nAa0itWdl6s5QX5Sl5uVpyAt_sXfwvvRQXmWkE0iDtMHJ5rvBfkuRaeaadQPCH1-Q',
      sortOrder: 2,
      isActive: true
    },
    {
      id: 'cat-fluted-glass',
      name: 'Minimal Glass',
      slug: 'minimal-glass',
      description: 'Fluted and clear acoustic safety glass framed in ultra-slim aluminum.',
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4rJGkT1rGqel4S09j30CdO59YfSsOSV2zpEumfc9CIuLs7gCBlo_Z6HJa5tjZpX9yMMeBU1TMb42YlttMpwypsHlt1KOI2Ux4wnas2k8icA_kZ_fcDe1Csi5OeB5MLIhVndsGo18APxND1eOVuc6gOO3XdveH-76NSZHd3OmCtH-XU02t7Kc2tY4XlVV1j0ILnGndqRwNnvN0-J7Z3TrP8y9XqAKtHqyP8r8V8e1SFuQBHSczT-T-tQUH7jQJZvf9f5Mescmz85c',
      sortOrder: 3,
      isActive: true
    },
    {
      id: 'cat-concrete-stone',
      name: 'Stone & Concrete',
      slug: 'stone-concrete',
      description: 'Micro-cement and stone veneers over lightweight honeycomb aluminum cores.',
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDty1mjJUsiJh0_mCtoMTSg5Jt5UkqymGORx-7iAuJc-nq4wKDh1iE76YXLik9XHAkt2OI0kmxrzC0_341TnPVQw24gD1Th4aWe2YBntWGnO_Btim6F8snILnCgtVxGfZA6_ZwsqwNddEAz9EUb_cy2D4PZU3CD2D1ioYlGOrmpVTiO2LEyc1bSZZ2xrqbb2pt_qpPiEKoq8Dgm0Yka2Dfi2FM1uD7PB5wpyK40F8NUMlDAhfkSjmoV9kjkY1UA0bWkP0HuI1LwEkk',
      sortOrder: 4,
      isActive: true
    },
    {
      id: 'cat-pocket-cavity',
      name: 'Pocket & Sliding',
      slug: 'pocket-cavity',
      description: 'Trackless flush cavity sliders and soft-close architectural bypass doors.',
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9lJr5OlnqZrAFVGqZsajKQhAZAMFwv2QEcJ8NJWMLNB17DpGY4AXi747poiwn8xwYPgVQRgHKue1rVDqptSC_sToljCD1c-SZW3w51lyCfWVRgoQiUnzv1-1Nt_lJxZrA0F98nMLqwOYWZUmv0Zcvw2cnC1CPk7EO6Zaz2cLbLEYaGbQ74e3euExhfLgGn9nLzUnFM0ZUco-nNDJcZq8Sh3S4MU9Am_vB5XKcBQMENFOStE-B5xcWWJdtWRPDFbNzbiXK5TTKoyY',
      sortOrder: 5,
      isActive: true
    }
  ],

  // 5. Strict 8 Mechanical Door Systems
  mechanicalSystems: [
    {
      id: 'sys-single-swing',
      code: 'SW-101',
      name: 'Single Swing',
      description: 'Flush concealed jamb with 3D adjustable hidden hinges and acoustic drop-down seal.',
      capacity: '160 kg / 352 lbs',
      maxHeight: '3600 mm',
      frameType: 'Zero-Jamb Flush Inset',
      svg: `<svg class="w-12 h-10 stroke-current fill-none stroke-[1.3]" viewBox="0 0 64 48">
        <line opacity="0.4" stroke="currentColor" stroke-dasharray="2 2" x1="8" x2="8" y1="40" y2="8"></line>
        <line x1="8" x2="48" y1="40" y2="40"></line>
        <path d="M8,40 A32,32 0 0,1 40,8" opacity="0.5" stroke-dasharray="3 3"></path>
        <rect fill="currentColor" height="4" width="4" x="6" y="38"></rect>
        <line stroke-width="2" x1="8" x2="38" y1="40" y2="12"></line>
      </svg>`
    },
    {
      id: 'sys-single-pocket',
      code: 'PK-202',
      name: 'Single Pocket',
      description: 'Trackless flush threshold sliding cleanly inside wall cavities with soft-close.',
      capacity: '140 kg / 308 lbs',
      maxHeight: '3200 mm',
      frameType: 'Cavity Cassette Frame',
      svg: `<svg class="w-12 h-10 stroke-current fill-none stroke-[1.3]" viewBox="0 0 64 48">
        <rect fill="currentColor" fill-opacity="0.1" height="8" width="24" x="4" y="20"></rect>
        <line stroke-width="1.5" x1="4" x2="28" y1="20" y2="20"></line>
        <line stroke-width="1.5" x1="4" x2="28" y1="28" y2="28"></line>
        <rect fill="currentColor" height="4" width="34" x="24" y="22"></rect>
        <line stroke-dasharray="2 2" x1="28" x2="58" y1="12" y2="12"></line>
        <path d="M42 16 L48 12 L42 8" fill="none"></path>
      </svg>`
    },
    {
      id: 'sys-double-swing',
      code: 'DS-303',
      name: 'Double Swing',
      description: 'Paired monolithic leaves with magnetic center rebate and tight reveal margins.',
      capacity: '200 kg / leaf',
      maxHeight: '2800 mm',
      frameType: 'Dual Shadow Reveal',
      svg: `<svg class="w-12 h-10 stroke-current fill-none stroke-[1.3]" viewBox="0 0 64 48">
        <line opacity="0.4" stroke-dasharray="2 2" x1="8" x2="56" y1="40" y2="40"></line>
        <path d="M8,40 A24,24 0 0,1 32,16" opacity="0.5" stroke-dasharray="2 2"></path>
        <path d="M56,40 A24,24 0 0,0 32,16" opacity="0.5" stroke-dasharray="2 2"></path>
        <line stroke-width="2" x1="8" x2="26" y1="40" y2="18"></line>
        <line stroke-width="2" x1="56" x2="38" y1="40" y2="18"></line>
      </svg>`
    },
    {
      id: 'sys-double-pocket',
      code: 'DP-404',
      name: 'Double Pocket',
      description: 'Synchronized bi-parting pocket leaves disappearing into dual wall cavities.',
      capacity: '150 kg / leaf',
      maxHeight: '4000 mm span',
      frameType: 'Bi-Parting Cassette',
      svg: `<svg class="w-12 h-10 stroke-current fill-none stroke-[1.3]" viewBox="0 0 64 48">
        <rect fill="currentColor" fill-opacity="0.1" height="8" width="16" x="2" y="20"></rect>
        <rect fill="currentColor" fill-opacity="0.1" height="8" width="16" x="46" y="20"></rect>
        <rect fill="currentColor" height="4" width="18" x="14" y="22"></rect>
        <rect fill="currentColor" height="4" width="18" x="32" y="22"></rect>
      </svg>`
    },
    {
      id: 'sys-barn',
      code: 'BN-505',
      name: 'Barn System',
      description: 'Minimalist architectural top-suspension rail in brushed bronze or satin steel.',
      capacity: '220 kg / 485 lbs',
      maxHeight: 'Solid Billet Rail',
      frameType: 'Top Surface Track',
      svg: `<svg class="w-12 h-10 stroke-current fill-none stroke-[1.3]" viewBox="0 0 64 48">
        <line stroke-width="2.5" x1="6" x2="58" y1="12" y2="12"></line>
        <circle cx="20" cy="12" fill="currentColor" r="3"></circle>
        <line stroke-width="1.5" x1="20" x2="20" y1="15" y2="22"></line>
        <rect fill="currentColor" fill-opacity="0.2" height="18" stroke-width="1.5" width="32" x="16" y="22"></rect>
      </svg>`
    },
    {
      id: 'sys-bypass',
      code: 'BP-606',
      name: 'Bypass System',
      description: 'Parallel sliding panels for wide multi-room transitions and closet zoning.',
      capacity: '180 kg / panel',
      maxHeight: 'Up to 6 leaves',
      frameType: 'Recessed Ceiling Track',
      svg: `<svg class="w-12 h-10 stroke-current fill-none stroke-[1.3]" viewBox="0 0 64 48">
        <line stroke-dasharray="2 2" x1="6" x2="58" y1="16" y2="16"></line>
        <line stroke-dasharray="2 2" x1="6" x2="58" y1="24" y2="24"></line>
        <rect fill="currentColor" height="4" width="28" x="10" y="14"></rect>
        <rect fill="currentColor" height="4" width="28" x="26" y="22"></rect>
      </svg>`
    },
    {
      id: 'sys-bifold',
      code: 'BF-707',
      name: 'Bifold System',
      description: 'Flush folding partitions with zero floor track intrusion and slim reveals.',
      capacity: '100 kg / leaf',
      maxHeight: 'Recessed 0mm',
      frameType: 'Overhead Pivot Carrier',
      svg: `<svg class="w-12 h-10 stroke-current fill-none stroke-[1.3]" viewBox="0 0 64 48">
        <line stroke-width="1.5" x1="6" x2="58" y1="12" y2="12"></line>
        <line stroke-width="2" x1="10" x2="26" y1="12" y2="34"></line>
        <line stroke-width="2" x1="26" x2="38" y1="34" y2="12"></line>
        <circle cx="26" cy="34" fill="currentColor" r="2.5"></circle>
      </svg>`
    },
    {
      id: 'sys-concealed-barn',
      code: 'CB-808',
      name: 'Concealed Barn',
      description: 'Invisible sliding mechanism milled entirely inside the top of the door slab.',
      capacity: '180 kg / 400 lbs',
      maxHeight: 'Zero Track Exposed',
      frameType: 'Internal Milled Track',
      svg: `<svg class="w-12 h-10 stroke-current fill-none stroke-[1.3]" viewBox="0 0 64 48">
        <rect fill="currentColor" fill-opacity="0.15" height="28" stroke-width="1.5" width="36" x="14" y="10"></rect>
        <line stroke-dasharray="3 2" stroke-width="1.5" x1="18" x2="46" y1="18" y2="18"></line>
        <circle cx="24" cy="18" fill="currentColor" r="2"></circle>
        <circle cx="40" cy="18" fill="currentColor" r="2"></circle>
      </svg>`
    }
  ],

  // 6. Product Groups
  productGroups: [
    {
      id: 'grp-villa-package',
      name: 'Villa Renovation Package',
      description: 'Curated flush door specification package for full residential projects.',
      doorIds: ['door-pv-300', 'door-syl-001', 'door-lnr-404', 'door-ds-350']
    },
    {
      id: 'grp-penthouse-line',
      name: 'Penthouse Acoustic Suite',
      description: 'High-attenuation acoustic doors rated 40dB–45dB for master suites and offices.',
      doorIds: ['door-cs-880', 'door-aur-992', 'door-pv-300', 'door-bp-600']
    }
  ],

  // 7. Promotions
  promotions: [
    {
      id: 'promo-villa-bundle',
      name: 'Villa Package Incentive',
      discountType: 'percentage',
      discountValue: 12,
      targetType: 'group',
      targetIds: ['grp-villa-package'],
      isActive: true,
      startDate: '2025-01-01',
      endDate: '2027-12-31'
    },
    {
      id: 'promo-concrete-rebate',
      name: 'Stone Series Allowance',
      discountType: 'fixed',
      discountValue: 500,
      targetType: 'category',
      targetIds: ['cat-concrete-stone'],
      isActive: true,
      startDate: '2025-01-01',
      endDate: '2027-12-31'
    }
  ],

  // 8. Relational Doors Catalog (10 Models)
  doors: [
    {
      id: 'door-pv-300',
      name: 'Flush Pivot X-300',
      slug: 'flush-pivot-x-300',
      sku: 'PV-300',
      basePrice: 3450,
      brandId: 'brand-porta-de',
      categoryIds: ['cat-flush-concealed', 'cat-monolithic-wood'],
      mechanicalSystemId: 'sys-single-swing',
      groupIds: ['grp-villa-package', 'grp-penthouse-line'],
      tags: ['New Arrival'],
      isActive: true,
      shortDescription: 'Smoked fumed oak veneer with zero-jamb reveal and 3-axis concealed pivot hardware.',
      images: [
        {
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkRn-7elj6NOepzHtzLZukL4dvCKZMgsnIpfztYT15ONO-hyZL1xYrHS6ixDSJ1Hy4Jlk2Qn3nwfdkzgQ5Fc4XpKEZMjBntcUGFI8fGaUQLt3iPLDc2xkDdLbgSxCOcmKfZf7naSB68Y2GCQsbwOFONYJ_mkTWc-dS8x8H7eeu1-log2tS3ITLBGrTKVOR-mYcl6xWDbB7GU3pL0xZAwDhKI95_bxz1Zy4r0hWIB3kFsQIFl-1P0-nJUdCvc6JR8f_PRVo_qGNmkU',
          caption: 'Smoked fumed oak leaf flush with plaster reveal',
          isPrimary: true
        },
        {
          url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          caption: 'Concealed 3-axis pivot detail',
          isPrimary: false
        }
      ],
      specs: {
        acoustic: '42dB',
        maxHeight: '3000mm',
        frame: 'Zero-Jamb Flush',
        latches: 'Magnetic Silent',
        coreMaterial: 'Acoustic Honeycomb & Solid Timber',
        finishes: ['Smoked Fumed Oak', 'American Walnut', 'Primed for Plaster'],
        fireRating: 'FD30 Compliant',
        leadTime: '6-8 Weeks'
      }
    },
    {
      id: 'door-gl-120',
      name: 'Reeded Lumen Glas',
      slug: 'reeded-lumen-glas',
      sku: 'GL-120',
      basePrice: 4200,
      brandId: 'brand-rimadesio',
      categoryIds: ['cat-fluted-glass'],
      mechanicalSystemId: 'sys-single-swing',
      groupIds: [],
      tags: ['New Arrival'],
      isActive: true,
      shortDescription: 'Fluted acoustic laminated glass enclosed in slim Italian anodized aluminum profiles.',
      images: [
        {
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4rJGkT1rGqel4S09j30CdO59YfSsOSV2zpEumfc9CIuLs7gCBlo_Z6HJa5tjZpX9yMMeBU1TMb42YlttMpwypsHlt1KOI2Ux4wnas2k8icA_kZ_fcDe1Csi5OeB5MLIhVndsGo18APxND1eOVuc6gOO3XdveH-76NSZHd3OmCtH-XU02t7Kc2tY4XlVV1j0ILnGndqRwNnvN0-J7Z3TrP8y9XqAKtHqyP8r8V8e1SFuQBHSczT-T-tQUH7jQJZvf9f5Mescmz85c',
          caption: 'Fluted glass leaf with slim matte profile',
          isPrimary: true
        }
      ],
      specs: {
        acoustic: '36dB',
        maxHeight: '3200mm',
        frame: 'Slim Aluminum',
        latches: 'Magnetic Soft-Close',
        coreMaterial: '12mm Fluted Laminated Glass',
        finishes: ['Anodized Bronze', 'Matte Black', 'Brushed Champagne'],
        fireRating: 'Non-combustible',
        leadTime: '7-9 Weeks'
      }
    },
    {
      id: 'door-cs-880',
      name: 'Monolith Concrete Slider',
      slug: 'monolith-concrete-slider',
      sku: 'CS-880',
      basePrice: 5100,
      brandId: 'brand-linvisibile',
      categoryIds: ['cat-concrete-stone', 'cat-pocket-cavity'],
      mechanicalSystemId: 'sys-single-pocket',
      groupIds: ['grp-penthouse-line'],
      tags: ['New Arrival'],
      isActive: true,
      shortDescription: 'Real micro-cement stone veneer bonded over a featherlight aluminum honeycomb core.',
      images: [
        {
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDty1mjJUsiJh0_mCtoMTSg5Jt5UkqymGORx-7iAuJc-nq4wKDh1iE76YXLik9XHAkt2OI0kmxrzC0_341TnPVQw24gD1Th4aWe2YBntWGnO_Btim6F8snILnCgtVxGfZA6_ZwsqwNddEAz9EUb_cy2D4PZU3CD2D1ioYlGOrmpVTiO2LEyc1bSZZ2xrqbb2pt_qpPiEKoq8Dgm0Yka2Dfi2FM1uD7PB5wpyK40F8NUMlDAhfkSjmoV9kjkY1UA0bWkP0HuI1LwEkk',
          caption: 'Board-formed concrete flush pocket slider',
          isPrimary: true
        }
      ],
      specs: {
        acoustic: '44dB',
        maxHeight: '3400mm',
        frame: 'Flush Pocket Inset',
        latches: 'Touch Release',
        coreMaterial: 'Honeycomb Alu + 2mm Concrete',
        finishes: ['Light Grey Concrete', 'Warm Travertine', 'Basalt'],
        fireRating: 'FD60 Rated',
        leadTime: '8-10 Weeks'
      }
    },
    {
      id: 'door-syl-001',
      name: 'Sylvanus Zero',
      slug: 'sylvanus-zero',
      sku: 'SYL-001',
      basePrice: 2850,
      brandId: 'brand-porta-de',
      categoryIds: ['cat-flush-concealed', 'cat-monolithic-wood'],
      mechanicalSystemId: 'sys-single-swing',
      groupIds: ['grp-villa-package'],
      tags: ['Best Seller'],
      isActive: true,
      shortDescription: 'Ceiling-height European walnut flush panel with concealed TECTUS hinges and magnetic latch.',
      images: [
        {
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQlCc-a_yLLj9dlqmzYSkyHDKXvqn3Ew1dc7w4PohjVtuXmV1gcXNnY7AcXgRvqTVihXtD3qlSdxPoM1YNj8TauMFNm1UC19mXnYDEKfR7LEYapjaN15sI11aZhX66a5UiH4RWBUvZp3bDDqHGroASF46kv7Lj1kjlYKSLRS5jGbShTxxtBK8fHRqI3HWv7LA1W8Yx5S-Gw2nAa0itWdl6s5QX5Sl5uVpyAt_sXfwvvRQXmWkE0iDtMHJ5rvBfkuRaeaadQPCH1-Q',
          caption: 'Full-height European walnut flush door',
          isPrimary: true
        }
      ],
      specs: {
        acoustic: '40dB',
        maxHeight: '3000mm',
        frame: 'Flush Extrusion',
        latches: 'TECTUS 3D Magnetic',
        coreMaterial: 'Solid Engineered Timber',
        finishes: ['European Walnut', 'Fumed Oak', 'Natural Ash'],
        fireRating: 'FD30 Optional',
        leadTime: '4-6 Weeks'
      }
    },
    {
      id: 'door-aur-992',
      name: 'Aura Reeded Pivot',
      slug: 'aura-reeded-pivot',
      sku: 'AUR-992',
      basePrice: 4200,
      brandId: 'brand-schuco',
      categoryIds: ['cat-fluted-glass'],
      mechanicalSystemId: 'sys-single-swing',
      groupIds: ['grp-penthouse-line'],
      tags: ['Best Seller'],
      isActive: true,
      shortDescription: '11-foot fluted glass pivot leaf with hydraulic self-closing floor spring and recessed pull.',
      images: [
        {
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO08XwXE0aI6cfHeG7SnlxZe0xBf3KnjkqX6LoXHQAjiky8ifiV8CGbebibPPpR2Cp43TPNI8UIvLmdHzLZTJbKSbpfi6eiv5_Nlb0EJ5GMoX9NZquJDJE8SK8SC-PBYBwNadbmmGrlz3wgaJok6AadoV46TL2HRhmOs-sMXO3iXKW7VSfeLZ86DdD7GkgbJpZ3cN2dNb-IdX4oZQnd9DxHHkhJHn8ujGHhVvV8sg9gxgrhyptA7Q7KZurEfxG0M8LjG2FuADEuW4',
          caption: 'Fluted glass pivot entrance portal',
          isPrimary: true
        }
      ],
      specs: {
        acoustic: '38dB',
        maxHeight: '3600mm',
        frame: 'Slim Thermal Profile',
        latches: 'Hydraulic Floor Pivot',
        coreMaterial: '14mm Reeded Safety Glass',
        finishes: ['Champagne Gold', 'Anodized Bronze', 'Matte Black'],
        fireRating: 'Class A Glass',
        leadTime: '8-10 Weeks'
      }
    },
    {
      id: 'door-lnr-404',
      name: 'Linear Acoustic Pocket',
      slug: 'linear-obsidian-pocket',
      sku: 'LNR-404',
      basePrice: 3800,
      brandId: 'brand-linvisibile',
      categoryIds: ['cat-pocket-cavity', 'cat-flush-concealed'],
      mechanicalSystemId: 'sys-double-pocket',
      groupIds: ['grp-villa-package'],
      tags: ['Best Seller'],
      isActive: true,
      shortDescription: 'Concealed soft-open pocket door system with flush wall touch-release and 45dB seals.',
      images: [
        {
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9lJr5OlnqZrAFVGqZsajKQhAZAMFwv2QEcJ8NJWMLNB17DpGY4AXi747poiwn8xwYPgVQRgHKue1rVDqptSC_sToljCD1c-SZW3w51lyCfWVRgoQiUnzv1-1Nt_lJxZrA0F98nMLqwOYWZUmv0Zcvw2cnC1CPk7EO6Zaz2cLbLEYaGbQ74e3euExhfLgGn9nLzUnFM0ZUco-nNDJcZq8Sh3S4MU9Am_vB5XKcBQMENFOStE-B5xcWWJdtWRPDFbNzbiXK5TTKoyY',
          caption: 'Flush acoustic pocket door',
          isPrimary: true
        }
      ],
      specs: {
        acoustic: '45dB',
        maxHeight: '3200mm',
        frame: 'Cavity Cassette',
        latches: 'Touch-Release',
        coreMaterial: 'Multi-layer Acoustic Core',
        finishes: ['Venetian Plaster Primed', 'Natural Oak', 'Smoked Veneer'],
        fireRating: 'FD30 Available',
        leadTime: '6-8 Weeks'
      }
    },
    {
      id: 'door-cbn-700',
      name: 'Aero Concealed Barn',
      slug: 'aero-concealed-barn',
      sku: 'CBN-700',
      basePrice: 3950,
      brandId: 'brand-porta-de',
      categoryIds: ['cat-flush-concealed', 'cat-monolithic-wood'],
      mechanicalSystemId: 'sys-concealed-barn',
      groupIds: [],
      tags: ['New Arrival'],
      isActive: true,
      shortDescription: 'Rolling carriage milled invisibly into the top edge of the leaf with zero exposed wall rail.',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          caption: 'Concealed barn leaf floating cleanly on wall',
          isPrimary: true
        }
      ],
      specs: {
        acoustic: '36dB',
        maxHeight: '3000mm',
        frame: 'Hidden Carriage',
        latches: 'Soft Dampeners',
        coreMaterial: 'Solid Wood + Alu Stabilizers',
        finishes: ['Smoked Oak', 'American Walnut', 'Warm White Matte'],
        fireRating: 'FD30 Compatible',
        leadTime: '6-8 Weeks'
      }
    },
    {
      id: 'door-bf-900',
      name: 'Monolith Bifold Partition',
      slug: 'monolith-bifold-partition',
      sku: 'BF-900',
      basePrice: 5600,
      brandId: 'brand-rimadesio',
      categoryIds: ['cat-fluted-glass', 'cat-monolithic-wood'],
      mechanicalSystemId: 'sys-bifold',
      groupIds: [],
      tags: ['Best Seller'],
      isActive: true,
      shortDescription: 'Ceiling-hung folding partition system with zero floor track for seamless room openings.',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
          caption: 'Flush folding partition',
          isPrimary: true
        }
      ],
      specs: {
        acoustic: '38dB',
        maxHeight: '3200mm',
        frame: 'Zero Floor Track',
        latches: 'Magnetic In-Line',
        coreMaterial: 'Aluminum & Wood/Glass',
        finishes: ['Champagne Alu', 'Natural Walnut', 'Fluted Glass'],
        fireRating: 'Standard Interior',
        leadTime: '8-10 Weeks'
      }
    },
    {
      id: 'door-bp-600',
      name: 'Telescopic Bypass Grand',
      slug: 'telescopic-bypass-grand',
      sku: 'BP-600',
      basePrice: 4800,
      brandId: 'brand-schuco',
      categoryIds: ['cat-fluted-glass', 'cat-pocket-cavity'],
      mechanicalSystemId: 'sys-bypass',
      groupIds: ['grp-penthouse-line'],
      tags: ['New Arrival', 'Best Seller'],
      isActive: true,
      shortDescription: 'Multi-leaf parallel sliding system with recessed ceiling track and synchronized soft glide.',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
          caption: 'Parallel sliding telescopic panels',
          isPrimary: true
        }
      ],
      specs: {
        acoustic: '40dB',
        maxHeight: '3400mm',
        frame: 'Recessed Ceiling',
        latches: 'Synchronized Glide',
        coreMaterial: '12mm Reeded Glass & Alu',
        finishes: ['Brushed Gold Bronze', 'Satin Black', 'Clear Reeded'],
        fireRating: 'Class A',
        leadTime: '7-9 Weeks'
      }
    },
    {
      id: 'door-ds-350',
      name: 'Double Swing Portal DS-350',
      slug: 'monolith-double-swing-portal',
      sku: 'DS-350',
      basePrice: 5400,
      brandId: 'brand-porta-de',
      categoryIds: ['cat-concrete-stone', 'cat-flush-concealed', 'cat-monolithic-wood'],
      mechanicalSystemId: 'sys-double-swing',
      groupIds: ['grp-villa-package'],
      tags: ['New Arrival', 'Best Seller'],
      isActive: true,
      shortDescription: 'Paired architectural leaves with magnetic center rebate and razor-thin shadow reveals.',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
          caption: 'Paired double swing architectural portal',
          isPrimary: true
        }
      ],
      specs: {
        acoustic: '44dB',
        maxHeight: '3200mm',
        frame: 'Zero-Jamb Concealed',
        latches: 'Magnetic Center Rebate',
        coreMaterial: 'Solid Timber Composite',
        finishes: ['European Walnut', 'Travertine Stone', 'Primed'],
        fireRating: 'FD30 Available',
        leadTime: '6-8 Weeks'
      }
    }
  ],

  // 9. Completed Architectural Projects
  projects: [
    {
      id: 'proj-malibu-01',
      title: 'Malibu Pavilion Residence',
      slug: 'malibu-pavilion-residence',
      clientType: 'Architect',
      architectStudio: 'Olson Kundig Collaborators',
      location: 'Malibu, CA',
      scale: '40 Flush Portals • 12,000 sq ft',
      installedSystemIds: ['sys-double-pocket', 'sys-single-swing'],
      doorIds: ['door-pv-300', 'door-lnr-404'],
      clientQuote: '“Eliminated every traditional door frame across 40 openings with uniform shadow-line precision.”',
      clientName: 'Lead Project Architect',
      images: [
        {
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEAcwYZPLp19NA5ESQnXo1Rj34c9SrDozzbV5hEaFinP1AJJoEyTUT8jFvOJycJenbhnBkZjds1s8zYoE_8B4mV124Uu7Pz8lZ2izfAZ7lDBrgaGpKiqrW1at9rzUJ9hva3rALudgtZSHAzWodBK1x3yp18CAXLNR2i2kV9_BOCUYyU8lg4_OiKzRA6smZiMHf4njLiWQNTR0eCRjs9k_ROzRzJHnnc60jK7pc_cTqQDZ65XsvZ_V0mY8cGMLSqfu7icAZh8Yg1EI',
          caption: 'Modern pavilion with oversized pivot portal',
          isPrimary: true
        }
      ]
    },
    {
      id: 'proj-zurich-02',
      title: 'Lakeview Minimalist Villa',
      slug: 'the-brutalist-villa',
      clientType: 'Designer',
      architectStudio: 'Studio Piet Boon Practice',
      location: 'Zurich, Switzerland',
      scale: '22 Stone-Faced Concealed Pivots',
      installedSystemIds: ['sys-single-swing', 'sys-single-pocket'],
      doorIds: ['door-cs-880'],
      clientQuote: '“Dead-silent magnetic latching and exact texture matching made every doorway blend into the wall.”',
      clientName: 'Studio Principal',
      images: [
        {
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqfRDPi0SXEJLm6ynljqxPx9yQNbsQjsyvDQ3nHWNFg_GoiJITaa14lZaxMSQ5zuF3FVKbhKQZDFPaepYT8Dv_z2MDK2CR9W4RgojqI9JisRta7peJKtgpttNKkSBpKRuIcKZ7RiMqBqbjD0DWPDxzwQiEluZS8iKUAp7rIuAL9YL5UshB_vAp_oQ9dBCUqWtbuTvsq_-Jg0WuQ5Pkxs1FyBs7eElLHRifORhdNIMIJM6yYYCTnin5YGCAO8OixQF95Sj4tskn39A',
          caption: 'Flush pivot door clad in stone veneer',
          isPrimary: true
        }
      ]
    },
    {
      id: 'proj-belair-03',
      title: 'Bel Air Crest Penthouse',
      slug: 'bel-air-penthouse',
      clientType: 'Architect',
      architectStudio: 'Ando Associates LA',
      location: 'Bel Air, CA',
      scale: '28 Smoked Oak Portals • 44dB Core',
      installedSystemIds: ['sys-single-swing', 'sys-concealed-barn'],
      doorIds: ['door-pv-300', 'door-syl-001'],
      clientQuote: '“Pre-engineered aluminum subframes shaved weeks off drywall rough-in and delivered flawless reveals.”',
      clientName: 'Associate Director',
      images: [
        {
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-AWqpW4pTCt6-JSYhCjAZKqje0he2EJWxNqV3LOYsEX--sNiSzV8z89UrnfdzqSBkP5CjpjexWoeSJ0RjntbdyMe8HY9OQn4_vozqOzvb_x1r2vr3J0w7ja8ncznFwTSevOaVpWtXWvFPDo2BVCSAquQ_FYfAwKrDkqj5aJPh67V8K0fqTie5EG79ZHdW3lzP6Wv_h0SvbYDWLOSYsIWrPjWTLmIp_uciX31RimGoU-DynxrMJAqD8NabymaPPpL3_zqqbf1tdrU',
          caption: 'Smoked fumed oak interior door flush with plaster wall',
          isPrimary: true
        }
      ]
    }
  ],

  // 10. Endorsements / Testimonials
  testimonials: [
    {
      id: 'test-01',
      quote: '“Doors Gallery allowed us to carry continuous Venetian plaster planes room-to-room with zero visible casing.”',
      authorTitle: 'Senior Associate',
      authorOrg: 'Foster + Partners NY'
    },
    {
      id: 'test-02',
      quote: '“The 45dB drop-seal acoustic performance in our private residences feels like Swiss watchmaking.”',
      authorTitle: 'Technical Director',
      authorOrg: 'Boffi Interiors Milan'
    },
    {
      id: 'test-03',
      quote: '“Every custom pre-hung subframe arrived square to the millimeter, making contractor installation effortless.”',
      authorTitle: 'Founding Principal',
      authorOrg: 'AD100 Studio Los Angeles'
    }
  ],

  // 11. Initial Trade Inquiries
  inquiries: [
    {
      id: 'INQ-7821',
      createdAt: '2026-01-14T11:20:00Z',
      status: 'new',
      contactName: 'Elena Rostova, Rostova Architects',
      contactEmail: 'elena@rostova-arch.com',
      contactPhone: '+1 (310) 555-8921',
      projectLocation: 'Beverly Hills, CA',
      projectType: 'High-End Residential',
      openingsCount: '16 - 40 Estate / Commercial Floor',
      finishPreference: 'Smoked European Fumed Oak',
      systemsInterest: ['Flush Concealed Swing', 'Cavity Pocket System'],
      items: [
        { doorId: 'door-pv-300', doorName: 'Flush Pivot X-300', sku: 'PV-300', quantity: 14, effectivePrice: 3036 },
        { doorId: 'door-cs-880', doorName: 'Monolith Concrete Slider', sku: 'CS-880', quantity: 4, effectivePrice: 4600 }
      ],
      totalEstimate: 60904,
      fileName: 'Beverly_Estate_Door_Schedule.dwg',
      notes: 'Need 3000mm ceiling-height doors with 42dB acoustic core and zero-jamb plaster detail.'
    }
  ]
};
