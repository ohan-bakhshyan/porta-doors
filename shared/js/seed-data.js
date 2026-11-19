/**
 * PORTA Architectural Doors - Minimalist Showroom Seed Data
 * Designed according to Google Stitch monochrome architectural specification.
 */

export const INITIAL_SEED_DATA = {
  // 1. Initial Admin Accounts
  admins: [
    {
      id: 'admin-001',
      username: 'admin',
      passwordHash: 'admin', // Demo environment plaintext / hashed
      name: 'Architectural Director',
      email: 'admin@porta-doors.com',
      role: 'superadmin',
      isActive: true,
      createdAt: '2025-01-01T00:00:00Z'
    }
  ],

  // 2. Global Site Settings & Homepage Configurations
  settings: {
    companyName: 'PORTA ARCHITECTURAL DOORS',
    tagline: 'Engineered Frameless Portals & Flush Architectural Door Systems',
    phone: '+1 (800) 942-7678',
    email: 'spec@porta-doors.com',
    tradeLine: '+1 (800) 942-7678',
    catalogPdfUrl: '#',
    certifications: 'CE & UL Certified Flush Systems • ISO 9001 Certified',
    copyright: '© 2025 PORTA ARCHITECTURAL DOORS GMBH. ALL RIGHTS RESERVED.',
    
    // Hero Section
    hero: {
      directive: 'Engineering Directive / Zurich • Milan • NYC',
      headline: 'Invisible Boundaries. Flush Doors Engineered with European Precision.',
      subheadline: 'Frameless acoustic door leaves, concealed magnetic latches, and sub-millimeter architectural shadow gaps for transcendent living spaces.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAo0SIg-akviU64YIyDKhR35TYcPhLzbsqrcevqKW-oQUPDFYtWMB1Mp1bcFcYT4cyLbjAgO_cvIDDpA1G8vuHU8exvI0fd8dFd5fq5h73yeKzWKaWgSeV_flrIAm4rrmf-dhctfybLRDGaVXtbKA4zA-I6kSiy8R_UbDRMOIo1BUPkUB0_gU1rxEXFwTiqe8RpYR2-0D0fIKrAS9YyxEaedon-jiO5psD8aAOmD2ZH6PZme7WzVRxBKw3puovKTdk3tGbWgAwyNU',
      modelBadge: 'Model: Monolith Flush Pivot 00 — Board-Formed Concrete',
      metricsPill: 'ISO 9001 Certified • Concealed German Hardware • Up to 12ft Floor-to-Ceiling Single Leaves',
      specs: {
        acoustic: 'Up to 46dB',
        jamb: '0mm Flush Profile',
        lead: '6-8 Weeks'
      },
      primaryCtaText: 'View Collections',
      primaryCtaLink: '#collections',
      secondaryCtaText: 'Request Specification',
      secondaryCtaLink: '#inquiry'
    },

    // Architectural Philosophy Statement
    philosophy: {
      tag: 'Tectonic Discipline & Truth to Material',
      quote: '“A door should not interrupt an architectural plane. It should either dissolve completely into the monolith or celebrate pure material truth.”',
      attribution: 'Dieter Rams & John Pawson Axiom • Aesthetic Baseline 2025'
    },

    // Homepage Section Configs
    sectionConfigs: {
      newArrivals: {
        enabled: true,
        tag: '01 / Mechanical Advancements',
        title: 'New Arrivals',
        subtitle: 'Recent mechanical patents, motorized flush pocket assemblies, and monolithic concrete-faced door sets.',
        maxItems: 6
      },
      bestSellers: {
        enabled: true,
        tag: '02 / Field-Tested Specifications',
        title: 'Architectural Favorites',
        subtitle: 'Field-tested specifications selected by premier architectural studios for uncompromising minimalist projects.',
        maxItems: 6
      },
      mechanicalSystems: {
        enabled: true,
        tag: '03 / Mechanical Typologies',
        title: 'Door Systems Directory',
        subtitle: 'Precision engineered opening typologies for seamless spatial choreography and perimeter zero-tolerance jambs.',
        maxItems: 8
      },
      projects: {
        enabled: true,
        tag: '04 / Built Architecture',
        title: 'Global Case Studies',
        subtitle: 'Uncompromised architectural visions realised alongside international practices and Master Builders.',
        maxItems: 6
      },
      inquiry: {
        enabled: true,
        tag: '05 / Direct Trade Engagement',
        title: 'Trade Specification & Inquiry',
        subtitle: 'Dedicated technical support for Architects, Interior Designers, General Contractors, and Millwork Developers.'
      },
      testimonials: {
        enabled: true,
        tag: '06 / Peer Recognition',
        title: 'Trade & Architect Endorsements',
        subtitle: 'Unvarnished feedback from architectural studios specifying PORTA.'
      }
    },

    // Global Showroom Locations
    showrooms: [
      { city: 'Milan', address: 'Via Manzoni 14' },
      { city: 'Zurich', address: 'Gotthardstrasse 26' },
      { city: 'New York', address: '520 West 28th St' },
      { city: 'Los Angeles', address: '8687 Melrose Ave' }
    ]
  },

  // 3. Brands Directory
  brands: [
    {
      id: 'brand-porta-de',
      name: 'PORTA Precision Germany',
      slug: 'porta-germany',
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
      bio: 'Pioneers of architectural sliding systems, fluted acoustic glass partitions, and extruded obsidian aluminum frames.',
      logo: '',
      heroBanner: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80',
      isActive: true
    },
    {
      id: 'brand-linvisibile',
      name: 'Linvisibile Portali',
      slug: 'linvisibile-portali',
      originCountry: 'Italy',
      bio: 'The pure Italian philosophy of absolute planar continuity: doors that dissolve completely into Venetian plaster and stone.',
      logo: '',
      heroBanner: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
      isActive: true
    },
    {
      id: 'brand-schuco',
      name: 'Schüco Systems',
      slug: 'schuco-systems',
      originCountry: 'Germany',
      bio: 'World benchmark in monumental pivot entrance portals, thermal break engineering, and certified acoustic attenuation.',
      logo: '',
      heroBanner: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
      isActive: true
    }
  ],

  // 4. Categories
  categories: [
    {
      id: 'cat-flush-concealed',
      name: 'Flush Concealed Portals',
      slug: 'flush-concealed',
      description: 'Zero-jamb doors flush with drywall, plaster, or stone paneling with invisible 3-axis hinges.',
      coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      sortOrder: 1,
      isActive: true
    },
    {
      id: 'cat-monolithic-wood',
      name: 'Acoustic Wood Portals',
      slug: 'acoustic-wood',
      description: 'Full-height smoked fumed oak, American black walnut, and architectural timber with 42dB+ solid core.',
      coverImage: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
      sortOrder: 2,
      isActive: true
    },
    {
      id: 'cat-fluted-glass',
      name: 'Minimal Fluted Glass',
      slug: 'minimal-glass',
      description: 'Precision reeded acoustic laminated glass enclosed in razor-thin matte black anodized aluminum.',
      coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      sortOrder: 3,
      isActive: true
    },
    {
      id: 'cat-concrete-stone',
      name: 'Architectural Stone & Concrete',
      slug: 'stone-concrete',
      description: 'Real micro-cement and board-formed stone veneers bonded to lightweight aerospace honeycomb aluminum cores.',
      coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      sortOrder: 4,
      isActive: true
    },
    {
      id: 'cat-pocket-cavity',
      name: 'Concealed Pocket Cavity Systems',
      slug: 'pocket-cavity',
      description: 'Trackless motorized and soft-closing flush cavity sliders that disappear completely inside dryline walls.',
      coverImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
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
      description: 'Flush concealed jamb with 3D adjustable hidden hinges and acoustic drop-down perimeter seal.',
      capacity: '160 kg / 352 lbs',
      maxHeight: '3600 mm',
      frameType: 'Zero-Jamb Flush Inset Subframe',
      svg: `<svg class="w-16 h-12 stroke-current fill-none stroke-[1.2]" viewBox="0 0 64 48">
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
      description: 'Trackless flush threshold sliding completely inside cavity walls with soft dampen stop.',
      capacity: '140 kg / 308 lbs',
      maxHeight: '3200 mm',
      frameType: 'Structural Cassette Pocket Frame',
      svg: `<svg class="w-16 h-12 stroke-current fill-none stroke-[1.2]" viewBox="0 0 64 48">
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
      description: 'Paired monolithic leaves with magnetic center rebate and sub-millimeter meeting margins.',
      capacity: '200 kg / leaf',
      maxHeight: '2800 mm',
      frameType: 'Dual Perimeter Shadow Reveal',
      svg: `<svg class="w-16 h-12 stroke-current fill-none stroke-[1.2]" viewBox="0 0 64 48">
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
      description: 'Synchronized bi-parting pocket system disappearing entirely into dual dryline wall cavities.',
      capacity: '150 kg / leaf',
      maxHeight: '4000 mm span',
      frameType: 'Bi-Parting Telescopic Cassette',
      svg: `<svg class="w-16 h-12 stroke-current fill-none stroke-[1.2]" viewBox="0 0 64 48">
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
      description: 'Exposed architectural top track in hand-brushed gunmetal, raw stainless, or blackened bronze.',
      capacity: '220 kg / 485 lbs',
      maxHeight: 'Solid Billet Milled Track',
      frameType: 'Top Suspension Surface Rail',
      svg: `<svg class="w-16 h-12 stroke-current fill-none stroke-[1.2]" viewBox="0 0 64 48">
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
      description: 'Parallel sliding panels for expansive multi-room spatial transitions and modular zoning.',
      capacity: '180 kg / panel',
      maxHeight: 'Up to 6 leaves',
      frameType: 'Recessed Ceiling Multi-Channel',
      svg: `<svg class="w-16 h-12 stroke-current fill-none stroke-[1.2]" viewBox="0 0 64 48">
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
      description: 'Flush folding partitions with zero floor track intrusion and continuous architectural reveals.',
      capacity: '100 kg / leaf',
      maxHeight: 'Recessed 0mm Flush',
      frameType: 'Ceiling Concealed Pivot Carrier',
      svg: `<svg class="w-16 h-12 stroke-current fill-none stroke-[1.2]" viewBox="0 0 64 48">
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
      description: 'Pure magic mechanism: all rolling track gear is concealed entirely inside the milled door leaf.',
      capacity: '180 kg / 400 lbs',
      maxHeight: 'Zero Track Exposed',
      frameType: 'Internal Milled Leaf Suspension',
      svg: `<svg class="w-16 h-12 stroke-current fill-none stroke-[1.2]" viewBox="0 0 64 48">
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
      description: 'Curated architectural door specification package for luxury residential estates.',
      doorIds: ['door-pv-300', 'door-syl-001', 'door-lnr-404']
    },
    {
      id: 'grp-penthouse-line',
      name: 'Penthouse Acoustic Suite',
      description: 'Monolithic acoustic doors rated 42dB-46dB for high-profile master suites and studies.',
      doorIds: ['door-cs-880', 'door-aur-992', 'door-pv-300']
    }
  ],

  // 7. Promotions
  promotions: [
    {
      id: 'promo-villa-bundle',
      name: 'Villa Specification Incentive',
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
      name: 'Engineered Stone Direct Allowance',
      discountType: 'fixed',
      discountValue: 500,
      targetType: 'category',
      targetIds: ['cat-concrete-stone'],
      isActive: true,
      startDate: '2025-01-01',
      endDate: '2027-12-31'
    }
  ],

  // 8. Relational Doors Catalog
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
      shortDescription: 'Smoked Fumed Oak veneer with sub-millimeter perimeter shadow line and 3-axis concealed pivot hardware.',
      images: [
        {
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkRn-7elj6NOepzHtzLZukL4dvCKZMgsnIpfztYT15ONO-hyZL1xYrHS6ixDSJ1Hy4Jlk2Qn3nwfdkzgQ5Fc4XpKEZMjBntcUGFI8fGaUQLt3iPLDc2xkDdLbgSxCOcmKfZf7naSB68Y2GCQsbwOFONYJ_mkTWc-dS8x8H7eeu1-log2tS3ITLBGrTKVOR-mYcl6xWDbB7GU3pL0xZAwDhKI95_bxz1Zy4r0hWIB3kFsQIFl-1P0-nJUdCvc6JR8f_PRVo_qGNmkU',
          caption: 'Monolithic smoked fumed oak leaf flush with plaster reveal',
          isPrimary: true
        },
        {
          url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          caption: 'Concealed German 3-axis pivot hinge detail',
          isPrimary: false
        }
      ],
      specs: {
        acoustic: '42dB Soundproof',
        maxHeight: '3000mm',
        frame: 'Zero-Jamb Flush',
        latches: 'Magnetic Silent Mortise',
        coreMaterial: 'Acoustic Honeycomb & Solid Timber',
        finishes: ['Smoked Fumed Oak', 'American Black Walnut', 'Primed for Plaster'],
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
      shortDescription: 'Precision fluted acoustic laminated glass set within hand-finished Italian anodized black profiles.',
      images: [
        {
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4rJGkT1rGqel4S09j30CdO59YfSsOSV2zpEumfc9CIuLs7gCBlo_Z6HJa5tjZpX9yMMeBU1TMb42YlttMpwypsHlt1KOI2Ux4wnas2k8icA_kZ_fcDe1Csi5OeB5MLIhVndsGo18APxND1eOVuc6gOO3XdveH-76NSZHd3OmCtH-XU02t7Kc2tY4XlVV1j0ILnGndqRwNnvN0-J7Z3TrP8y9XqAKtHqyP8r8V8e1SFuQBHSczT-T-tQUH7jQJZvf9f5Mescmz85c',
          caption: 'Fluted reeded glass leaf with micro matte black anodized frame',
          isPrimary: true
        }
      ],
      specs: {
        acoustic: '36dB Diffusion',
        maxHeight: '3200mm',
        frame: 'Slim Obsidian Aluminum',
        latches: 'Magnetic Soft-Close',
        coreMaterial: '12mm Acoustic Fluted Laminated Glass',
        finishes: ['Obsidian Anodized Black', 'Brushed Bronze', 'Raw Silver Alu'],
        fireRating: 'Non-combustible Glass',
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
      shortDescription: 'Real micro-cement and board-formed veneer over lightweight aircraft-grade honeycomb aluminum core.',
      images: [
        {
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDty1mjJUsiJh0_mCtoMTSg5Jt5UkqymGORx-7iAuJc-nq4wKDh1iE76YXLik9XHAkt2OI0kmxrzC0_341TnPVQw24gD1Th4aWe2YBntWGnO_Btim6F8snILnCgtVxGfZA6_ZwsqwNddEAz9EUb_cy2D4PZU3CD2D1ioYlGOrmpVTiO2LEyc1bSZZ2xrqbb2pt_qpPiEKoq8Dgm0Yka2Dfi2FM1uD7PB5wpyK40F8NUMlDAhfkSjmoV9kjkY1UA0bWkP0HuI1LwEkk',
          caption: 'Board-formed concrete sliding flush pocket door',
          isPrimary: true
        }
      ],
      specs: {
        acoustic: '44dB Lab Verified',
        maxHeight: '3400mm',
        frame: 'Plaster Flush Inset Cassette',
        latches: 'Magnetic Touch Release',
        coreMaterial: 'Honeycomb Aircraft Alu with 2mm Real Concrete',
        finishes: ['Light Grey Board Concrete', 'Dark Basalt', 'Warm Travertine'],
        fireRating: 'FD60 Rated Core',
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
      shortDescription: 'Continuous ceiling-height European Walnut flush panel with concealed 3D adjustable TECTUS hinges and magnetic strike mortise.',
      images: [
        {
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQlCc-a_yLLj9dlqmzYSkyHDKXvqn3Ew1dc7w4PohjVtuXmV1gcXNnY7AcXgRvqTVihXtD3qlSdxPoM1YNj8TauMFNm1UC19mXnYDEKfR7LEYapjaN15sI11aZhX66a5UiH4RWBUvZp3bDDqHGroASF46kv7Lj1kjlYKSLRS5jGbShTxxtBK8fHRqI3HWv7LA1W8Yx5S-Gw2nAa0itWdl6s5QX5Sl5uVpyAt_sXfwvvRQXmWkE0iDtMHJ5rvBfkuRaeaadQPCH1-Q',
          caption: 'Full-height European walnut door leaf flush with plaster wall',
          isPrimary: true
        }
      ],
      specs: {
        acoustic: '40dB Solid Core',
        maxHeight: '3000mm',
        frame: 'Sub-Millimeter Flush Extrusion',
        latches: 'TECTUS 3D & Magnetic Strike',
        coreMaterial: 'Solid Engineered Timber & Acoustic Core',
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
      shortDescription: 'Oversized 11-foot fluted monolithic glass entrance leaf with hydraulic self-closing floor pivot and integrated recessed pull channel.',
      images: [
        {
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO08XwXE0aI6cfHeG7SnlxZe0xBf3KnjkqX6LoXHQAjiky8ifiV8CGbebibPPpR2Cp43TPNI8UIvLmdHzLZTJbKSbpfi6eiv5_Nlb0EJ5GMoX9NZquJDJE8SK8SC-PBYBwNadbmmGrlz3wgaJok6AadoV46TL2HRhmOs-sMXO3iXKW7VSfeLZ86DdD7GkgbJpZ3cN2dNb-IdX4oZQnd9DxHHkhJHn8ujGHhVvV8sg9gxgrhyptA7Q7KZurEfxG0M8LjG2FuADEuW4',
          caption: '11-foot fluted architectural glass entrance pivot portal',
          isPrimary: true
        }
      ],
      specs: {
        acoustic: '38dB Laminated Glass',
        maxHeight: '3600mm',
        frame: 'Heavy Duty Thermal Break Profile',
        latches: 'Hydraulic In-Ground Pivot Self-Close',
        coreMaterial: '14mm Reeded Acoustic Fluted Safety Glass',
        finishes: ['Deep Obsidian Black', 'Champagne Bronze', 'Raw Satin Alu'],
        fireRating: 'Class A Non-Combustible',
        leadTime: '8-10 Weeks'
      }
    },
    {
      id: 'door-lnr-404',
      name: 'Linear Obsidian Pocket',
      slug: 'linear-obsidian-pocket',
      sku: 'LNR-404',
      basePrice: 3800,
      brandId: 'brand-linvisibile',
      categoryIds: ['cat-pocket-cavity', 'cat-flush-concealed'],
      mechanicalSystemId: 'sys-double-pocket',
      groupIds: ['grp-villa-package'],
      tags: ['Best Seller'],
      isActive: true,
      shortDescription: 'Concealed motorized track pocket door system with soft-open deceleration, flush wall touch-release, and 45dB acoustic seals.',
      images: [
        {
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9lJr5OlnqZrAFVGqZsajKQhAZAMFwv2QEcJ8NJWMLNB17DpGY4AXi747poiwn8xwYPgVQRgHKue1rVDqptSC_sToljCD1c-SZW3w51lyCfWVRgoQiUnzv1-1Nt_lJxZrA0F98nMLqwOYWZUmv0Zcvw2cnC1CPk7EO6Zaz2cLbLEYaGbQ74e3euExhfLgGn9nLzUnFM0ZUco-nNDJcZq8Sh3S4MU9Am_vB5XKcBQMENFOStE-B5xcWWJdtWRPDFbNzbiXK5TTKoyY',
          caption: 'Motorized acoustic pocket door flush with board-formed concrete wall',
          isPrimary: true
        }
      ],
      specs: {
        acoustic: '45dB Verified Seal',
        maxHeight: '3200mm',
        frame: 'Patented Cavity Cassette',
        latches: 'Touch-Release & Motorized Drive',
        coreMaterial: 'Multi-layer Acoustic Composite',
        finishes: ['Smoked Obsidian Veneer', 'Venetian Plaster Primed', 'Natural Oak'],
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
      shortDescription: 'All rolling track hardware is precision-milled directly into the interior top edge of the leaf. Zero track visible on wall or ceiling.',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          caption: 'Concealed barn door leaf floating against drywall',
          isPrimary: true
        }
      ],
      specs: {
        acoustic: '36dB Acoustic Leaf',
        maxHeight: '3000mm',
        frame: 'Internal Concealed Suspension Carriage',
        latches: 'Integrated Soft Dampeners',
        coreMaterial: 'Multi-ply Solid Wood with Aluminum Stabilizers',
        finishes: ['Smoked Fumed Oak', 'American Walnut', 'Matte Lacquer'],
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
      shortDescription: 'Expansive ceiling-hung folding leaf system with zero floor track reveal, allowing total spatial fluid unity when retracted.',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
          caption: 'Flush folding architectural partitions',
          isPrimary: true
        }
      ],
      specs: {
        acoustic: '38dB Dual Seals',
        maxHeight: '3200mm',
        frame: 'Zero Floor Track - Overhead Carrier',
        latches: 'Magnetic In-Line Leaf Latches',
        coreMaterial: 'Hybrid Aluminum Frame with Wood or Reeded Glass',
        finishes: ['Obsidian Black Aluminum', 'Natural Walnut', 'Fluted Glass'],
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
      shortDescription: 'Multi-leaf parallel sliding system with recessed ceiling track and synchronised soft-telescoping motion.',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
          caption: 'Parallel sliding telescopic architectural panels',
          isPrimary: true
        }
      ],
      specs: {
        acoustic: '40dB Multi-Panel Seals',
        maxHeight: '3400mm',
        frame: 'Recessed Ceiling Multi-Channel',
        latches: 'Synchronized Soft-Open/Close',
        coreMaterial: '12mm Reeded Acoustic Glass & Matte Aluminum',
        finishes: ['Obsidian Black', 'Brushed Bronze', 'Smoked Glass'],
        fireRating: 'Class A Non-combustible',
        leadTime: '7-9 Weeks'
      }
    },
    {
      id: 'door-ds-350',
      name: 'Monolith Double Swing Portal',
      slug: 'monolith-double-swing-portal',
      sku: 'DS-350',
      basePrice: 5400,
      brandId: 'brand-porta-de',
      categoryIds: ['cat-flush-concealed', 'cat-monolithic-wood'],
      mechanicalSystemId: 'sys-double-swing',
      groupIds: ['grp-villa-package'],
      tags: ['New Arrival', 'Best Seller'],
      isActive: true,
      shortDescription: 'Monumental paired leaves with magnetic center rebate and sub-millimeter perimeter shadow reveals.',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          caption: 'Paired monolithic architectural double swing doors',
          isPrimary: true
        }
      ],
      specs: {
        acoustic: '44dB Verified Solid Core',
        maxHeight: '3200mm',
        frame: 'Zero-Jamb Concealed Aluminum',
        latches: 'Magnetic Center Rebate & Concealed 3D Hinges',
        coreMaterial: 'Solid Engineered Timber Composite',
        finishes: ['European Walnut', 'Fumed Oak', 'Primed for Plaster'],
        fireRating: 'FD30 Available',
        leadTime: '6-8 Weeks'
      }
    }
  ],

  // 9. Completed Architectural Projects (Case Studies)
  projects: [
    {
      id: 'proj-malibu-01',
      title: 'Malibu Pavilion Residence',
      slug: 'malibu-pavilion-residence',
      clientType: 'Architect',
      architectStudio: 'Olson Kundig Collaborators',
      location: 'Malibu, California',
      scale: '40 Flush Portals across 12,000 sq ft',
      installedSystemIds: ['sys-double-pocket', 'sys-single-swing'],
      doorIds: ['door-pv-300', 'door-lnr-404'],
      clientQuote: '“PORTA allowed us to eliminate every traditional door frame in the 12,000 sq ft residence. The shadow line consistency across 40 openings is unprecedented.”',
      clientName: 'Lead Project Architect',
      images: [
        {
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEAcwYZPLp19NA5ESQnXo1Rj34c9SrDozzbV5hEaFinP1AJJoEyTUT8jFvOJycJenbhnBkZjds1s8zYoE_8B4mV124Uu7Pz8lZ2izfAZ7lDBrgaGpKiqrW1at9rzUJ9hva3rALudgtZSHAzWodBK1x3yp18CAXLNR2i2kV9_BOCUYyU8lg4_OiKzRA6smZiMHf4njLiWQNTR0eCRjs9k_ROzRzJHnnc60jK7pc_cTqQDZ65XsvZ_V0mY8cGMLSqfu7icAZh8Yg1EI',
          caption: 'Expansive modern architectural pavilion with oversized entrance pivot door',
          isPrimary: true
        }
      ]
    },
    {
      id: 'proj-zurich-02',
      title: 'The Brutalist Villa',
      slug: 'the-brutalist-villa',
      clientType: 'Designer',
      architectStudio: 'Studio Piet Boon Practice',
      location: 'Zurich, Switzerland',
      scale: 'Exact Color & Texture Match to Cast Concrete Walls',
      installedSystemIds: ['sys-single-swing', 'sys-single-pocket'],
      doorIds: ['door-cs-880'],
      clientQuote: '“The tactile weight and dead-silent magnetic latching create a museum-like tranquility. Visitors cannot detect the door until it smoothly articulates.”',
      clientName: 'Studio Principal',
      images: [
        {
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqfRDPi0SXEJLm6ynljqxPx9yQNbsQjsyvDQ3nHWNFg_GoiJITaa14lZaxMSQ5zuF3FVKbhKQZDFPaepYT8Dv_z2MDK2CR9W4RgojqI9JisRta7peJKtgpttNKkSBpKRuIcKZ7RiMqBqbjD0DWPDxzwQiEluZS8iKUAp7rIuAL9YL5UshB_vAp_oQ9dBCUqWtbuTvsq_-Jg0WuQ5Pkxs1FyBs7eElLHRifORhdNIMIJM6yYYCTnin5YGCAO8OixQF95Sj4tskn39A',
          caption: 'Monolithic flush pivot door clad in textured architectural concrete',
          isPrimary: true
        }
      ]
    },
    {
      id: 'proj-belair-03',
      title: 'Bel Air Penthouse',
      slug: 'bel-air-penthouse',
      clientType: 'Architect',
      architectStudio: 'Tadao Ando Studio Practice',
      location: 'Bel Air, California',
      scale: '1.5mm Shadow Margins throughout 28 Flush Portals',
      installedSystemIds: ['sys-single-swing', 'sys-concealed-barn'],
      doorIds: ['door-pv-300', 'door-syl-001'],
      clientQuote: '“The precision of the jamb geometry allowed pure material planes of smoked fumed timber to float without compromise.”',
      clientName: 'Associate Director',
      images: [
        {
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-AWqpW4pTCt6-JSYhCjAZKqje0he2EJWxNqV3LOYsEX--sNiSzV8z89UrnfdzqSBkP5CjpjexWoeSJ0RjntbdyMe8HY9OQn4_vozqOzvb_x1r2vr3J0w7ja8ncznFwTSevOaVpWtXWvFPDo2BVCSAquQ_FYfAwKrDkqj5aJPh67V8K0fqTie5EG79ZHdW3lzP6Wv_h0SvbYDWLOSYsIWrPjWTLmIp_uciX31RimGoU-DynxrMJAqD8NabymaPPpL3_zqqbf1tdrU',
          caption: 'Smoked fumed oak monolithic interior door set flush into polished grey plaster walls',
          isPrimary: true
        }
      ]
    }
  ],

  // 10. Peer Endorsements / Testimonials
  testimonials: [
    {
      id: 'test-01',
      quote: '“In high-end residential architecture, a door frame is an admission of failure. PORTA allows us to carry continuous Venetian plaster planes through opening after opening with absolute zero distortion.”',
      authorTitle: 'Senior Associate',
      authorOrg: 'Foster + Partners New York'
    },
    {
      id: 'test-02',
      quote: '“The concealed acoustic drop-seal system delivered 45dB lab performance inside our private boardroom projects while remaining totally invisible. The machining quality is equal to Swiss watchmaking.”',
      authorTitle: 'Technical Director',
      authorOrg: 'Boffi Projects & Interiors Milan'
    },
    {
      id: 'test-03',
      quote: '“Every custom pivot door we have ordered arrives with pre-hung sub-frames that shave weeks off general contractor rough-in times. The magnetic latch closure feel is utterly satisfying.”',
      authorTitle: 'Founding Principal',
      authorOrg: 'AD100 Architecture Practice Los Angeles'
    }
  ],

  // 11. Initial Trade Inquiries
  inquiries: [
    {
      id: 'INQ-7821',
      createdAt: '2025-01-14T11:20:00Z',
      status: 'new',
      contactName: 'Elena Rostova, Rostova Architects',
      contactEmail: 'elena@rostova-arch.com',
      contactPhone: '+1 (310) 555-8921',
      projectLocation: 'Aspen, Colorado',
      projectType: 'High-End Residential',
      openingsCount: '16 - 40 Estate / Commercial Floor',
      finishPreference: 'Smoked European Fumed Oak',
      systemsInterest: ['Flush Concealed Swing', 'Cavity Pocket System'],
      items: [
        { doorId: 'door-pv-300', doorName: 'Flush Pivot X-300', sku: 'PV-300', quantity: 14, effectivePrice: 3036 },
        { doorId: 'door-cs-880', doorName: 'Monolith Concrete Slider', sku: 'CS-880', quantity: 4, effectivePrice: 4600 }
      ],
      totalEstimate: 60904,
      fileName: 'Aspen_Estate_Door_Schedule_v2.dwg',
      notes: 'Need 3000mm full ceiling-height doors with 42dB acoustic core and zero-jamb flush plaster detail. Drawings attached.'
    }
  ]
};
