/**
 * DOORS GALLERY — Single Product Page & Quote Order Controller
 * Handles multi-image gallery, live dimension/system/frame pricing,
 * information tabs, and the "Request a Quote" customer order drawer.
 */

import { store } from '../../shared/js/store.js';
import { Utils } from '../../shared/js/utils.js';

const HEIGHT_OPTIONS = [
  { id: '80', label: '80"', note: '80" Standard', addPrice: 0 },
  { id: '84', label: '84"', note: '84" Tall (+$120)', addPrice: 120 },
  { id: '92.5', label: '92 1/2"', note: '92 1/2" Architectural (+$240)', addPrice: 240 },
  { id: '96', label: '96"', note: '96" Eight-Foot (+$320)', addPrice: 320 },
  { id: '108', label: '108"', note: '108" Ceiling Span (+$540)', addPrice: 540 }
];

const SINGLE_WIDTHS = ['24"', '28"', '30"', '32"', '36"'];
const DOUBLE_WIDTHS = ['48"', '56"', '60"', '64"', '72"'];

const FRAME_PACKAGES = {
  slab: { label: 'Slab Only (No Frame)', addPrice: 0 },
  subframe: { label: 'Concealed Aluminum Subframe + 3D Hinges', addPrice: 340 },
  complete: { label: 'Complete Set: Flush Frame + Hinges + Magnetic Lock', addPrice: 490 }
};

let activeDoor = null;
let galleryImages = [];
let currentImgIdx = 0;

let configState = {
  finish: '',
  systemId: '',
  heightId: '80',
  width: '30"',
  frameKey: 'subframe',
  handing: 'Left Hand Inswing',
  quantity: 1
};

document.addEventListener('DOMContentLoaded', () => {
  syncHeaderAndCategories();
  loadProductFromUrl();
  updateSpecCounter();
  renderSpecDrawer();

  window.addEventListener('porta-store-updated', () => {
    syncHeaderAndCategories();
    loadProductFromUrl(true);
  });

  window.addEventListener('porta-spec-list-updated', () => {
    updateSpecCounter();
    renderSpecDrawer();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeQuoteOrderMenu();
      toggleSpecDrawer(false);
    }
  });
});

window.toggleMobileMenu = function(forceState) {
  const drawer = document.getElementById('mobile-nav-drawer');
  const icon = document.getElementById('mobile-menu-icon');
  if (!drawer) return;
  const shouldOpen = forceState !== undefined ? forceState : drawer.classList.contains('hidden');
  drawer.classList.toggle('hidden', !shouldOpen);
  if (icon) icon.textContent = shouldOpen ? 'close' : 'menu';
};

function syncHeaderAndCategories() {
  const settings = store.getSettings();
  const logo = document.getElementById('header-logo-img');
  if (logo && settings.logoUrl) logo.src = settings.logoUrl;
  const title = document.getElementById('header-brand-title');
  if (title && settings.companyName) title.textContent = settings.companyName;
  const phone = document.getElementById('header-phone');
  if (phone && settings.phone) {
    phone.textContent = settings.phone;
    phone.href = `tel:${settings.phone.replace(/[^0-9+]/g, '')}`;
  }
  const copy = document.getElementById('footer-copyright');
  if (copy && settings.copyright) copy.textContent = settings.copyright;

  const categories = store.getCategories().filter(c => c.isActive !== false);
  const bar = document.getElementById('header-category-bar');
  if (bar) {
    bar.innerHTML = `
      <div class="flex items-center gap-5 shrink-0">
        <a href="catalog.html" class="font-label text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-ink font-semibold hover:text-gold-dark whitespace-nowrap">All Doors</a>
        ${categories.map(cat => `
          <a href="catalog.html?category=${encodeURIComponent(cat.slug)}" class="font-label text-[10px] sm:text-[11px] uppercase tracking-[0.13em] text-on-surface-variant hover:text-gold-dark whitespace-nowrap transition-colors">
            ${Utils.escapeHtml(cat.name)}
          </a>
        `).join('')}
      </div>
      <a href="catalog.html?promo=active" class="font-label text-[10px] uppercase tracking-[0.15em] text-gold-dark font-semibold hover:underline whitespace-nowrap shrink-0">
        ★ Promotional Offers
      </a>
    `;
  }
}

/* ================= LOAD PRODUCT ================= */
function loadProductFromUrl(preserveSelection = false) {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  const id = params.get('id');

  const allDoors = store.getDoors({ isActive: true });
  activeDoor = (slug && store.getDoorBySlug(slug)) || (id && store.getDoorById(id)) || allDoors[0];

  if (!activeDoor) {
    document.getElementById('pdp-title').textContent = 'Door Model Unavailable';
    return;
  }

  document.title = `${activeDoor.name} — DOORS GALLERY`;

  const finishes = activeDoor.specs?.finishes?.length ? activeDoor.specs.finishes : ['Primed for Plaster', 'Natural Oak', 'American Walnut'];
  if (!preserveSelection || !configState.finish) {
    configState.finish = finishes[0];
    configState.systemId = activeDoor.mechanicalSystemId || 'sys-single-swing';
    const isDouble = isDoubleSystem(configState.systemId);
    configState.width = isDouble ? '60"' : '30"';
    configState.heightId = '80';
    configState.frameKey = 'subframe';
    configState.quantity = 1;
  }

  renderBreadcrumbs();
  renderGallery();
  renderProductInfo(finishes);
  renderConfiguratorControls(finishes);
  updateConfiguredPrice();
  renderTechnicalSpecs(finishes);
  renderReviewsTab();
  renderRelatedDoors();
}

function isDoubleSystem(sysId) {
  return sysId === 'sys-double-swing' || sysId === 'sys-double-pocket' || sysId === 'sys-bypass' || sysId === 'sys-bifold';
}

function renderBreadcrumbs() {
  const bc = document.getElementById('pdp-breadcrumbs');
  if (!bc || !activeDoor) return;
  const firstCatId = (activeDoor.categoryIds || [])[0];
  const cat = firstCatId ? store.getCategoryById(firstCatId) : null;

  bc.innerHTML = `
    <a href="index.html" class="hover:text-gold-dark">Home</a>
    <span>/</span>
    <a href="catalog.html" class="hover:text-gold-dark">Catalog</a>
    ${cat ? `<span>/</span><a href="catalog.html?category=${encodeURIComponent(cat.slug)}" class="hover:text-gold-dark">${Utils.escapeHtml(cat.name)}</a>` : ''}
    <span>/</span>
    <span class="text-ink font-semibold truncate max-w-[260px]">${Utils.escapeHtml(activeDoor.name)}</span>
  `;
}

/* ================= GALLERY ================= */
function renderGallery() {
  const rawImgs = Array.isArray(activeDoor.images) && activeDoor.images.length > 0
    ? [...activeDoor.images].sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0))
    : [{ url: Utils.getArchitecturalPlaceholderSvg(), caption: activeDoor.name, isPrimary: true }];

  galleryImages = rawImgs;
  if (currentImgIdx >= galleryImages.length) currentImgIdx = 0;

  updateMainGalleryImage();

  const prevBtn = document.getElementById('pdp-img-prev');
  const nextBtn = document.getElementById('pdp-img-next');
  const hasMultiple = galleryImages.length > 1;
  if (prevBtn) prevBtn.classList.toggle('hidden', !hasMultiple);
  if (prevBtn && hasMultiple) prevBtn.classList.add('flex');
  if (nextBtn) nextBtn.classList.toggle('hidden', !hasMultiple);
  if (nextBtn && hasMultiple) nextBtn.classList.add('flex');

  const thumbs = document.getElementById('pdp-thumbnails');
  if (thumbs) {
    thumbs.innerHTML = galleryImages.map((img, idx) => `
      <button type="button" onclick="selectProductImage(${idx})" class="aspect-square border overflow-hidden bg-surface-container transition-all ${idx === currentImgIdx ? 'border-2 border-gold' : 'border-hairline opacity-75 hover:opacity-100'}">
        <img src="${img.url}" alt="Thumbnail ${idx + 1}" class="w-full h-full object-cover"/>
      </button>
    `).join('');
  }

  // Badges
  const badgesEl = document.getElementById('pdp-image-badges');
  const priceInfo = store.calculateEffectivePrice(activeDoor);
  if (badgesEl) {
    const tagsHtml = (activeDoor.tags || []).map(t => `
      <span class="bg-white/95 text-ink border-l-2 border-gold font-label text-[9px] uppercase tracking-wider px-2.5 py-1 shadow-xs">
        ${Utils.escapeHtml(t)}
      </span>
    `).join('');
    const promoHtml = priceInfo.hasDiscount ? `
      <span class="bg-gold-tint text-gold-dark border border-gold/60 font-label text-[9px] font-semibold uppercase tracking-wider px-2.5 py-1 shadow-xs">
        -${priceInfo.discountPercent}% Promotional Offer
      </span>
    ` : '';
    badgesEl.innerHTML = tagsHtml + promoHtml;
  }
}

function updateMainGalleryImage() {
  const imgObj = galleryImages[currentImgIdx] || galleryImages[0];
  const mainImg = document.getElementById('pdp-main-image');
  const caption = document.getElementById('pdp-image-caption');
  if (mainImg && imgObj) mainImg.src = imgObj.url;
  if (caption && imgObj) caption.textContent = imgObj.caption || activeDoor.name;
}

window.selectProductImage = function(idx) {
  currentImgIdx = idx;
  updateMainGalleryImage();
  document.querySelectorAll('#pdp-thumbnails button').forEach((btn, i) => {
    btn.className = `aspect-square border overflow-hidden bg-surface-container transition-all ${i === idx ? 'border-2 border-gold' : 'border-hairline opacity-75 hover:opacity-100'}`;
  });
};

window.cycleProductImage = function(delta) {
  if (galleryImages.length <= 1) return;
  const next = (currentImgIdx + delta + galleryImages.length) % galleryImages.length;
  window.selectProductImage(next);
};

/* ================= PRODUCT DETAILS & CONFIGURATOR ================= */
function renderProductInfo() {
  const brand = store.getBrandById(activeDoor.brandId);
  const brandLink = document.getElementById('pdp-brand-link');
  if (brandLink) {
    brandLink.textContent = brand ? brand.name : 'Doors Gallery';
    brandLink.href = brand ? `brand.html?slug=${encodeURIComponent(brand.slug)}` : 'catalog.html';
  }

  document.getElementById('pdp-sku').textContent = activeDoor.sku || '—';
  document.getElementById('pdp-title').textContent = activeDoor.name;
  document.getElementById('pdp-short-desc').textContent = activeDoor.shortDescription || '';
  document.getElementById('pdp-lead-time').textContent = activeDoor.specs?.leadTime || '6–8 Weeks';
  document.getElementById('hl-acoustic').textContent = activeDoor.specs?.acoustic || '42dB Core';
}

function renderConfiguratorControls(finishes) {
  // 1. Finishes
  const finContainer = document.getElementById('config-finishes');
  document.getElementById('selected-finish-label').textContent = configState.finish;
  if (finContainer) {
    finContainer.innerHTML = finishes.map(f => {
      const active = f === configState.finish;
      return `
        <button type="button" onclick="selectFinish('${Utils.escapeHtml(f).replace(/'/g, "\\'")}')" class="px-3 py-1.5 border text-xs font-medium transition-colors ${active ? 'bg-gold-tint border-gold text-ink font-semibold' : 'bg-white border-hairline text-on-surface-variant hover:border-gold/60'}">
          ${Utils.escapeHtml(f)}
        </button>
      `;
    }).join('');
  }

  // 2. Mechanical System Select (Strict 8 Systems)
  const sysSelect = document.getElementById('config-system-select');
  const allSystems = store.getMechanicalSystems();
  if (sysSelect) {
    sysSelect.innerHTML = allSystems.map(s => {
      const multNote = isDoubleSystem(s.id) ? ' (Double / Multi-Panel +65%)' : ' (Single Leaf)';
      return `<option value="${s.id}" ${s.id === configState.systemId ? 'selected' : ''}>${Utils.escapeHtml(s.code)} — ${Utils.escapeHtml(s.name)}${multNote}</option>`;
    }).join('');
  }
  syncSystemDiagramCard();

  // 3. Heights
  renderHeightButtons();

  // 4. Widths
  renderWidthButtons();
}

function syncSystemDiagramCard() {
  const sys = store.getMechanicalSystemById(configState.systemId) || store.getMechanicalSystems()[0];
  if (!sys) return;
  const svgBox = document.getElementById('pdp-system-svg');
  if (svgBox) svgBox.innerHTML = sys.svg || '';
  document.getElementById('pdp-system-code').textContent = `${sys.code} • ${sys.frameType || 'Concealed Frame'}`;
  document.getElementById('pdp-system-label').textContent = sys.name;
  document.getElementById('selected-system-note').textContent = isDoubleSystem(sys.id) ? 'Double / Multi-Leaf Set' : 'Single Leaf Set';
}

function renderHeightButtons() {
  const container = document.getElementById('config-heights');
  const currentH = HEIGHT_OPTIONS.find(h => h.id === configState.heightId) || HEIGHT_OPTIONS[0];
  document.getElementById('selected-height-label').textContent = currentH.note;

  if (container) {
    container.innerHTML = HEIGHT_OPTIONS.map(h => {
      const active = h.id === configState.heightId;
      return `
        <button type="button" onclick="selectHeight('${h.id}')" class="py-2 px-2 border text-center transition-colors ${active ? 'bg-gold-tint border-gold text-ink font-semibold' : 'bg-white border-hairline text-on-surface-variant hover:border-gold/60'}">
          <div class="font-mono text-xs">${h.label}</div>
          <div class="text-[9px] text-secondary">${h.addPrice > 0 ? `+$${h.addPrice}` : 'Base'}</div>
        </button>
      `;
    }).join('');
  }
}

function renderWidthButtons() {
  const container = document.getElementById('config-widths');
  const widths = isDoubleSystem(configState.systemId) ? DOUBLE_WIDTHS : SINGLE_WIDTHS;
  if (!widths.includes(configState.width)) {
    configState.width = widths[2] || widths[0];
  }
  document.getElementById('selected-width-label').textContent = configState.width;

  if (container) {
    container.innerHTML = widths.map(w => {
      const active = w === configState.width;
      return `
        <button type="button" onclick="selectWidth('${w.replace(/"/g, '&quot;')}')" class="py-2 px-2 border font-mono text-xs text-center transition-colors ${active ? 'bg-gold-tint border-gold text-ink font-semibold' : 'bg-white border-hairline text-on-surface-variant hover:border-gold/60'}">
          ${w}
        </button>
      `;
    }).join('');
  }
}

window.selectFinish = function(finishName) {
  configState.finish = finishName;
  const finishes = activeDoor.specs?.finishes?.length ? activeDoor.specs.finishes : ['Primed for Plaster', 'Natural Oak', 'American Walnut'];
  renderConfiguratorControls(finishes);
  updateConfiguredPrice();
};

window.onSystemChange = function(sysId) {
  configState.systemId = sysId;
  syncSystemDiagramCard();
  renderWidthButtons();
  updateConfiguredPrice();
};

window.selectHeight = function(hId) {
  configState.heightId = hId;
  renderHeightButtons();
  updateConfiguredPrice();
};

window.selectWidth = function(w) {
  configState.width = w;
  renderWidthButtons();
  updateConfiguredPrice();
};

window.onFrameChange = function(frameKey) {
  configState.frameKey = frameKey;
  updateConfiguredPrice();
};

window.adjustPdpQty = function(delta) {
  configState.quantity = Math.max(1, configState.quantity + delta);
  document.getElementById('pdp-qty-val').textContent = configState.quantity;
  document.getElementById('pdp-qty-summary').textContent = configState.quantity;
  updateConfiguredPrice();
};

/* ================= LIVE CONFIGURED PRICING ================= */
function calculateConfiguredPricing() {
  const basePriceInfo = store.calculateEffectivePrice(activeDoor);
  const systemMultiplier = isDoubleSystem(configState.systemId) ? 1.65 : 1.0;
  const heightObj = HEIGHT_OPTIONS.find(h => h.id === configState.heightId) || HEIGHT_OPTIONS[0];
  const frameObj = FRAME_PACKAGES[configState.frameKey] || FRAME_PACKAGES.slab;

  const configuredBaseUnit = Math.round((basePriceInfo.basePrice * systemMultiplier) + heightObj.addPrice + frameObj.addPrice);
  const configuredEffectiveUnit = Math.round((basePriceInfo.effectivePrice * systemMultiplier) + heightObj.addPrice + frameObj.addPrice);

  return {
    slabStartingPrice: basePriceInfo.effectivePrice,
    unitBasePrice: configuredBaseUnit,
    unitEffectivePrice: configuredEffectiveUnit,
    totalPrice: configuredEffectiveUnit * configState.quantity,
    hasDiscount: basePriceInfo.hasDiscount,
    discountPercent: basePriceInfo.discountPercent,
    activePromo: basePriceInfo.activePromo
  };
}

window.updateConfiguredPrice = function() {
  if (!activeDoor) return;
  configState.handing = document.getElementById('config-handing-select')?.value || 'Left Hand Inswing';
  const pricing = calculateConfiguredPricing();

  document.getElementById('pdp-unit-price').textContent = Utils.formatCurrency(pricing.unitEffectivePrice);
  document.getElementById('pdp-total-price').textContent = Utils.formatCurrency(pricing.totalPrice);
  document.getElementById('pdp-base-slab-note').textContent = `Price from ${Utils.formatCurrency(pricing.slabStartingPrice)} (base single slab)`;

  const oldPriceEl = document.getElementById('pdp-old-price');
  const promoPill = document.getElementById('pdp-promo-pill');

  if (pricing.hasDiscount) {
    oldPriceEl.textContent = Utils.formatCurrency(pricing.unitBasePrice);
    oldPriceEl.classList.remove('hidden');
    promoPill.textContent = `Save ${pricing.discountPercent}% (${pricing.activePromo?.name || 'Promo'})`;
    promoPill.classList.remove('hidden');
  } else {
    oldPriceEl.classList.add('hidden');
    promoPill.classList.add('hidden');
  }
};

function buildCurrentConfiguredItem() {
  const pricing = calculateConfiguredPricing();
  const sys = store.getMechanicalSystemById(configState.systemId);
  const heightObj = HEIGHT_OPTIONS.find(h => h.id === configState.heightId) || HEIGHT_OPTIONS[0];
  const frameObj = FRAME_PACKAGES[configState.frameKey] || FRAME_PACKAGES.slab;
  const brand = store.getBrandById(activeDoor.brandId);
  const primaryImage = galleryImages[0]?.url || Utils.getArchitecturalPlaceholderSvg();
  const dimensions = `${configState.width} × ${heightObj.label}`;
  const configSummary = `${configState.finish} | ${sys ? sys.name : 'Flush'} | ${dimensions} | ${frameObj.label} | ${configState.handing}`;

  return {
    doorId: activeDoor.id,
    doorName: activeDoor.name,
    name: activeDoor.name,
    sku: activeDoor.sku,
    slug: activeDoor.slug,
    brandName: brand ? brand.name : 'Doors Gallery',
    systemName: sys ? sys.name : 'Single Swing',
    finish: configState.finish,
    dimensions,
    frameOption: frameObj.label,
    handing: configState.handing,
    configSummary,
    quantity: configState.quantity,
    basePrice: pricing.unitBasePrice,
    effectivePrice: pricing.unitEffectivePrice,
    lineTotal: pricing.totalPrice,
    primaryImage
  };
}

/* ================= REQUEST A QUOTE ORDER MENU ================= */
window.openQuoteOrderMenu = function() {
  if (!activeDoor) return;
  const item = buildCurrentConfiguredItem();
  const summaryBox = document.getElementById('quote-menu-product-summary');

  if (summaryBox) {
    summaryBox.innerHTML = `
      <img src="${item.primaryImage}" alt="${Utils.escapeHtml(item.name)}" class="w-16 h-20 object-cover bg-surface-container border border-hairline shrink-0"/>
      <div class="flex-1 min-w-0 text-xs">
        <div class="font-label text-[10px] uppercase tracking-wider text-secondary">${Utils.escapeHtml(item.sku)} • ${Utils.escapeHtml(item.brandName)}</div>
        <div class="font-headline text-sm font-semibold uppercase text-ink truncate">${Utils.escapeHtml(item.name)}</div>
        <div class="text-[11px] text-on-surface-variant mt-1 space-y-0.5">
          <div><strong>System:</strong> ${Utils.escapeHtml(item.systemName)} (${Utils.escapeHtml(item.dimensions)})</div>
          <div><strong>Finish:</strong> ${Utils.escapeHtml(item.finish)}</div>
          <div><strong>Set:</strong> ${Utils.escapeHtml(item.frameOption)}</div>
          <div><strong>Handing:</strong> ${Utils.escapeHtml(item.handing)}</div>
        </div>
        <div class="mt-2 pt-1.5 border-t border-hairline flex items-center justify-between">
          <span class="font-label text-[10px] uppercase text-secondary">Qty: ${item.quantity} × ${Utils.formatCurrency(item.effectivePrice)}</span>
          <span class="font-headline text-sm font-semibold text-gold-dark">${Utils.formatCurrency(item.lineTotal)}</span>
        </div>
      </div>
    `;
  }

  document.getElementById('product-quote-form').classList.remove('hidden');
  document.getElementById('quote-order-confirmation').classList.add('hidden');

  document.getElementById('quote-order-drawer').classList.add('open');
  document.getElementById('quote-order-backdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeQuoteOrderMenu = function() {
  document.getElementById('quote-order-drawer')?.classList.remove('open');
  document.getElementById('quote-order-backdrop')?.classList.remove('open');
  document.body.style.overflow = '';
};

window.submitProductQuoteOrder = function(e) {
  e.preventDefault();
  const item = buildCurrentConfiguredItem();

  const contactName = document.getElementById('qo-name').value.trim();
  const contactPhone = document.getElementById('qo-phone').value.trim();
  const contactEmail = document.getElementById('qo-email').value.trim();
  const clientRole = document.getElementById('qo-role').value;
  const deliveryMethod = document.getElementById('qo-delivery-method').value;
  const projectLocation = document.getElementById('qo-location').value.trim();
  const customNotes = document.getElementById('qo-notes').value.trim();

  const savedOrder = store.submitInquiry({
    requestType: 'product_order',
    source: 'Product Page Quote',
    contactName,
    contactPhone,
    contactEmail,
    clientRole,
    deliveryMethod,
    projectLocation,
    projectType: `${clientRole} • ${deliveryMethod}`,
    openingsCount: `${item.quantity} Configured Door(s)`,
    finishPreference: item.finish,
    systemsInterest: [item.systemName],
    items: [item],
    totalEstimate: item.lineTotal,
    dealValue: item.lineTotal,
    notes: customNotes
      ? `${customNotes} | Config: ${item.configSummary}`
      : `Configured Order Request: ${item.configSummary}`
  });

  document.getElementById('product-quote-form').classList.add('hidden');
  const confirmBox = document.getElementById('quote-order-confirmation');
  document.getElementById('quote-order-ref').textContent = `Order Request ID: #${savedOrder.id}`;
  confirmBox.classList.remove('hidden');

  e.target.reset();
  triggerToast(`Quote Request #${savedOrder.id} Sent`);
};

/* ================= ADD TO MULTI-DOOR SPEC LIST ================= */
window.addConfiguredToSpecList = function() {
  if (!activeDoor) return;
  const item = buildCurrentConfiguredItem();
  store.addToSpecList(activeDoor.id, item);
  triggerToast(`Added ${item.name} (${item.dimensions}) to Spec List`);
  toggleSpecDrawer(true);
};

/* ================= TABS, TECH SPECS, REVIEWS & RELATED ================= */
window.switchPdpTab = function(tabKey, btnEl) {
  document.querySelectorAll('.pdp-tab-pane').forEach(p => p.classList.remove('active'));
  document.getElementById(`pdp-tab-${tabKey}`)?.classList.add('active');

  document.querySelectorAll('.pdp-tab-btn').forEach(b => {
    b.className = 'pdp-tab-btn px-5 py-3.5 font-label text-[11px] font-medium uppercase tracking-wider text-on-surface-variant hover:text-ink border-b-2 border-transparent whitespace-nowrap';
  });
  if (btnEl) {
    btnEl.className = 'pdp-tab-btn px-5 py-3.5 font-label text-[11px] font-semibold uppercase tracking-wider text-ink bg-white border-b-2 border-gold whitespace-nowrap';
  }
};

function renderTechnicalSpecs(finishes) {
  const table = document.getElementById('pdp-tech-specs-table');
  if (!table || !activeDoor) return;
  const brand = store.getBrandById(activeDoor.brandId);
  const sys = store.getMechanicalSystemById(activeDoor.mechanicalSystemId);

  const rows = [
    ['Model Name', activeDoor.name],
    ['SKU Code', activeDoor.sku],
    ['Manufacturer / Collection', brand ? `${brand.name} (${brand.originCountry})` : 'Doors Gallery'],
    ['Default Mechanical System', sys ? `${sys.name} (${sys.code})` : 'Single Swing'],
    ['Core Construction', activeDoor.specs?.coreMaterial || 'Solid Engineered Acoustic Core'],
    ['Acoustic Rating', activeDoor.specs?.acoustic || '40–42dB'],
    ['Subframe / Jamb Profile', activeDoor.specs?.frame || 'Zero-Jamb Concealed Aluminum'],
    ['Latching & Hinges', activeDoor.specs?.latches || '3D Concealed Hinges & Magnetic Lock'],
    ['Maximum Slab Height', activeDoor.specs?.maxHeight || '3000mm (118")'],
    ['Fire Rating', activeDoor.specs?.fireRating || 'Standard Interior / FD30 Optional'],
    ['Available Finishes', finishes.join(', ')],
    ['Estimated Lead Time', activeDoor.specs?.leadTime || '6–8 Weeks']
  ];

  table.innerHTML = rows.map(([k, v]) => `
    <div class="py-2.5 border-b border-hairline flex items-baseline justify-between gap-4">
      <span class="font-label text-[10px] uppercase tracking-wider text-secondary shrink-0">${Utils.escapeHtml(k)}</span>
      <span class="text-ink font-medium text-right">${Utils.escapeHtml(v)}</span>
    </div>
  `).join('');
}

function renderReviewsTab() {
  const container = document.getElementById('pdp-reviews-list');
  if (!container) return;
  const testimonials = store.getTestimonials();
  container.innerHTML = testimonials.map(t => `
    <div class="p-4 bg-surface-low border border-hairline flex flex-col justify-between">
      <div>
        <div class="text-gold text-xs mb-1.5">★★★★★</div>
        <p class="text-xs text-on-surface italic leading-relaxed">${Utils.escapeHtml(t.quote)}</p>
      </div>
      <div class="mt-3 pt-2 border-t border-hairline font-label text-[10px] uppercase tracking-wider">
        <strong class="text-ink">${Utils.escapeHtml(t.authorTitle)}</strong> • <span class="text-gold-dark">${Utils.escapeHtml(t.authorOrg)}</span>
      </div>
    </div>
  `).join('');
}

function renderRelatedDoors() {
  const grid = document.getElementById('pdp-related-grid');
  if (!grid || !activeDoor) return;

  const allDoors = store.getDoors({ isActive: true }).filter(d => d.id !== activeDoor.id);
  const sameCat = allDoors.filter(d => (d.categoryIds || []).some(cid => (activeDoor.categoryIds || []).includes(cid)));
  const related = (sameCat.length >= 4 ? sameCat : [...sameCat, ...allDoors.filter(d => !sameCat.includes(d))]).slice(0, 4);

  grid.innerHTML = related.map(door => {
    const priceInfo = store.calculateEffectivePrice(door);
    const sys = store.getMechanicalSystemById(door.mechanicalSystemId);
    const img = (door.images || []).find(i => i.isPrimary)?.url || door.images?.[0]?.url || Utils.getArchitecturalPlaceholderSvg();

    return `
      <a href="product.html?slug=${encodeURIComponent(door.slug)}" class="group bg-white border border-hairline hover:border-gold transition-all flex flex-col shadow-xs">
        <div class="relative aspect-[4/4.5] overflow-hidden bg-surface-container">
          <img src="${img}" alt="${Utils.escapeHtml(door.name)}" class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"/>
          <span class="absolute top-2.5 left-2.5 bg-white/95 text-ink border-l-2 border-gold font-label text-[9px] uppercase tracking-wider px-2 py-0.5">
            ${sys ? Utils.escapeHtml(sys.name) : 'Flush System'}
          </span>
        </div>
        <div class="p-3.5 flex flex-col justify-between flex-grow">
          <div>
            <div class="text-[10px] font-label uppercase text-secondary">${Utils.escapeHtml(door.sku)}</div>
            <h3 class="font-headline text-sm font-medium uppercase text-ink group-hover:text-gold-dark mt-0.5 transition-colors">${Utils.escapeHtml(door.name)}</h3>
          </div>
          <div class="mt-3 pt-2 border-t border-hairline flex items-center justify-between">
            <span class="font-headline text-sm font-semibold text-gold-dark">${Utils.formatCurrency(priceInfo.effectivePrice)}</span>
            <span class="font-label text-[10px] uppercase tracking-wider text-ink group-hover:text-gold-dark">Configure →</span>
          </div>
        </div>
      </a>
    `;
  }).join('');
}

window.downloadDoorCad = function() {
  if (!activeDoor) return;
  triggerToast(`CAD & Spec Sheet Downloaded: ${activeDoor.sku}`);
};

/* ================= SPEC LIST DRAWER ================= */
window.toggleSpecDrawer = function(open) {
  document.getElementById('spec-drawer')?.classList.toggle('open', open);
  document.getElementById('drawer-backdrop')?.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
};

function updateSpecCounter() {
  const list = store.getSpecList();
  const totalCount = list.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const counter = document.getElementById('spec-list-counter');
  if (counter) counter.textContent = `[${totalCount}]`;
}

function renderSpecDrawer() {
  const list = store.getSpecList();
  const container = document.getElementById('drawer-items-container');
  const countLabel = document.getElementById('drawer-item-count');
  const totalVal = document.getElementById('drawer-total-val');
  if (!container) return;

  const totalQuantity = list.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = list.reduce((sum, i) => sum + (i.effectivePrice * i.quantity), 0);

  if (countLabel) countLabel.textContent = `${totalQuantity} opening(s) across ${list.length} item(s)`;
  if (totalVal) totalVal.textContent = Utils.formatCurrency(totalAmount);

  if (list.length === 0) {
    container.innerHTML = `
      <div class="h-48 flex flex-col items-center justify-center text-center p-4 text-secondary">
        <span class="material-symbols-outlined text-3xl mb-1.5 text-gold">door_front</span>
        <div class="font-label text-xs uppercase tracking-wider text-ink font-medium">Spec List Empty</div>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(item => `
    <div class="p-3 bg-surface-low border border-hairline flex gap-3 items-start justify-between">
      <img src="${item.primaryImage}" class="w-12 h-16 object-cover bg-surface-container shrink-0" alt="${Utils.escapeHtml(item.name)}"/>
      <div class="flex-1 min-w-0">
        <div class="flex items-baseline justify-between gap-2">
          <a href="product.html?slug=${encodeURIComponent(item.slug)}" class="font-headline text-xs font-medium uppercase text-ink hover:text-gold-dark truncate">${Utils.escapeHtml(item.name)}</a>
          <span class="font-headline text-xs font-semibold text-gold-dark shrink-0">${Utils.formatCurrency(item.effectivePrice * item.quantity)}</span>
        </div>
        <div class="text-[10px] text-secondary truncate">${Utils.escapeHtml(item.dimensions ? `${item.dimensions} • ${item.finish}` : item.finish)}</div>
        <div class="flex items-center gap-1.5 mt-2">
          <button class="w-6 h-6 border border-hairline bg-white text-xs" onclick="updateSpecQty('${item.id}', ${item.quantity - 1})">-</button>
          <span class="font-mono text-xs font-semibold w-5 text-center">${item.quantity}</span>
          <button class="w-6 h-6 border border-hairline bg-white text-xs" onclick="updateSpecQty('${item.id}', ${item.quantity + 1})">+</button>
          <button class="ml-auto text-[10px] uppercase font-label text-secondary hover:text-ink" onclick="removeSpecItem('${item.id}')">Remove</button>
        </div>
      </div>
    </div>
  `).join('');
}

window.updateSpecQty = function(itemId, qty) {
  store.updateSpecListQuantity(itemId, qty);
};

window.removeSpecItem = function(itemId) {
  store.removeFromSpecList(itemId);
};

function triggerToast(message) {
  const toast = document.getElementById('spec-toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;
  toastMsg.textContent = message;
  toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
  toast.classList.add('translate-y-0', 'opacity-100');
  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
  }, 3000);
}
