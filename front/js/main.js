/**
 * PORTA Architectural Doors - Minimalist Frontend Controller
 * Dynamically binds data store state to the Google Stitch layout.
 */

import { store } from '../../shared/js/store.js';
import { Utils } from '../../shared/js/utils.js';

let currentAttachedFileName = '';

document.addEventListener('DOMContentLoaded', () => {
  renderHeaderAndFooter();
  renderHeroSection();
  renderPhilosophySection();
  renderNewArrivals();
  renderBestSellers();
  renderDoorSystems();
  renderCompletedProjects();
  renderTestimonials();
  updateSpecCounter();
  renderSpecDrawer();

  // Listen to store updates
  window.addEventListener('porta-store-updated', () => {
    renderHeaderAndFooter();
    renderHeroSection();
    renderPhilosophySection();
    renderNewArrivals();
    renderBestSellers();
    renderDoorSystems();
    renderCompletedProjects();
  });

  window.addEventListener('porta-spec-list-updated', () => {
    updateSpecCounter();
    renderSpecDrawer();
  });
});

/* ================= 1. HEADER & FOOTER ================= */
function renderHeaderAndFooter() {
  const settings = store.getSettings();

  const brandTitle = document.getElementById('header-brand-title');
  if (brandTitle) brandTitle.textContent = settings.companyName || 'PORTA';

  const phone = document.getElementById('header-phone');
  if (phone) {
    phone.textContent = settings.phone || '+1 (800) 942-7678';
    phone.href = `tel:${(settings.phone || '').replace(/[^0-9+]/g, '')}`;
  }

  const inqPhone = document.getElementById('inquiry-phone');
  if (inqPhone) {
    inqPhone.textContent = settings.tradeLine || settings.phone || '+1 (800) 942-7678';
    inqPhone.href = `tel:${(settings.phone || '').replace(/[^0-9+]/g, '')}`;
  }

  const footerName = document.getElementById('footer-company-name');
  if (footerName) footerName.textContent = settings.companyName;

  const footerCopy = document.getElementById('footer-copyright');
  if (footerCopy) footerCopy.textContent = settings.copyright;

  const footerCert = document.getElementById('footer-certifications');
  if (footerCert) footerCert.textContent = settings.certifications;

  const showroomsList = document.getElementById('footer-showrooms-list');
  if (showroomsList && settings.showrooms) {
    showroomsList.innerHTML = settings.showrooms.map(s => `
      <li>${Utils.escapeHtml(s.city)} — ${Utils.escapeHtml(s.address)}</li>
    `).join('') + `
      <li class="pt-2 font-label-sm text-xs text-secondary">
        <a class="hover:text-primary transition-colors" href="tel:${(settings.phone || '').replace(/[^0-9+]/g, '')}">Direct: ${settings.phone}</a>
      </li>
    `;
  }
}

/* ================= 2. HERO SECTION ================= */
function renderHeroSection() {
  const hero = store.getSettings().hero;
  if (!hero) return;

  const setEl = (id, text) => {
    const el = document.getElementById(id);
    if (el && text) el.textContent = text;
  };

  setEl('hero-headline', hero.headline);
  setEl('hero-subheadline', hero.subheadline);
  setEl('hero-directive', hero.directive);
  setEl('hero-model-badge', hero.modelBadge);
  setEl('hero-metrics-pill', hero.metricsPill);

  const heroImg = document.getElementById('hero-image');
  if (heroImg && hero.imageUrl) {
    heroImg.src = hero.imageUrl;
  }
}

/* ================= 3. PHILOSOPHY ================= */
function renderPhilosophySection() {
  const phil = store.getSettings().philosophy;
  if (!phil) return;

  const setEl = (id, text) => {
    const el = document.getElementById(id);
    if (el && text) el.textContent = text;
  };

  setEl('philosophy-tag', phil.tag);
  setEl('philosophy-quote', phil.quote);
  setEl('philosophy-author', phil.attribution);
}

/* ================= 4. RESPONSIVE CAROUSEL HELPERS & STATE ================= */
let arrivalsIndex = 0;
let arrivalsCount = 0;
let favoritesIndex = 0;
let favoritesCount = 0;
let activeFavoritesCategory = 'all';

function getVisibleCount() {
  if (typeof window === 'undefined') return 3;
  if (window.innerWidth >= 1024) return 3; // Desktop: 3 visible, others hidden
  if (window.innerWidth >= 640) return 2;  // Tablet: 2 visible, others hidden
  return 1;                                // Mobile: 1 visible, others hidden
}

window.slideArrivals = function(direction) {
  const visible = getVisibleCount();
  const maxIndex = Math.max(0, arrivalsCount - visible);
  arrivalsIndex = Math.max(0, Math.min(arrivalsIndex + direction, maxIndex));
  updateArrivalsCarousel();
};

function updateArrivalsCarousel() {
  const track = document.getElementById('arrivals-track');
  const counter = document.getElementById('arrivals-carousel-counter');
  const prevBtn = document.getElementById('arrivals-prev-btn');
  const nextBtn = document.getElementById('arrivals-next-btn');

  const visible = getVisibleCount();
  const maxIndex = Math.max(0, arrivalsCount - visible);
  if (arrivalsIndex > maxIndex) arrivalsIndex = maxIndex;

  if (track) {
    const shiftPercent = arrivalsIndex * (100 / visible);
    track.style.transform = `translateX(-${shiftPercent}%)`;
  }

  if (counter) {
    const currentNum = String(arrivalsIndex + 1).padStart(2, '0');
    const totalNum = String(arrivalsCount).padStart(2, '0');
    counter.textContent = `${currentNum} / ${totalNum}`;
  }

  if (prevBtn) prevBtn.disabled = (arrivalsIndex <= 0);
  if (nextBtn) nextBtn.disabled = (arrivalsIndex >= maxIndex);
}

window.slideFavorites = function(direction) {
  const visible = getVisibleCount();
  const maxIndex = Math.max(0, favoritesCount - visible);
  favoritesIndex = Math.max(0, Math.min(favoritesIndex + direction, maxIndex));
  updateFavoritesCarousel();
};

function updateFavoritesCarousel() {
  const track = document.getElementById('favorites-track');
  const counter = document.getElementById('favorites-carousel-counter');
  const prevBtn = document.getElementById('favorites-prev-btn');
  const nextBtn = document.getElementById('favorites-next-btn');

  const visible = getVisibleCount();
  const maxIndex = Math.max(0, favoritesCount - visible);
  if (favoritesIndex > maxIndex) favoritesIndex = maxIndex;

  if (track) {
    const shiftPercent = favoritesIndex * (100 / visible);
    track.style.transform = `translateX(-${shiftPercent}%)`;
  }

  if (counter) {
    const currentNum = String(favoritesIndex + 1).padStart(2, '0');
    const totalNum = String(favoritesCount).padStart(2, '0');
    counter.textContent = `${currentNum} / ${totalNum}`;
  }

  if (prevBtn) prevBtn.disabled = (favoritesIndex <= 0);
  if (nextBtn) nextBtn.disabled = (favoritesIndex >= maxIndex);
}

// Window resize handler to maintain responsive positioning
window.addEventListener('resize', () => {
  updateArrivalsCarousel();
  updateFavoritesCarousel();
});

function attachSwipeListeners(elementId, slideFn) {
  const el = document.getElementById(elementId);
  if (!el || el.dataset.swipeBound) return;
  el.dataset.swipeBound = 'true';
  let startX = 0;
  el.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });
  el.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      slideFn(diff > 0 ? 1 : -1);
    }
  }, { passive: true });
}

/* ================= 5. NEW ARRIVALS (Responsive Carousel up to 5 items) ================= */
function renderNewArrivals() {
  const secConfig = store.getSettings().sectionConfigs?.newArrivals;
  const section = document.getElementById('new-arrivals');
  if (secConfig?.enabled === false) {
    if (section) section.style.display = 'none';
    return;
  }
  if (section) section.style.display = 'block';

  const titleEl = document.getElementById('sec-arrivals-title');
  const subEl = document.getElementById('sec-arrivals-subtitle');
  if (titleEl && secConfig?.title) titleEl.textContent = secConfig.title;
  if (subEl && secConfig?.subtitle) subEl.textContent = secConfig.subtitle;

  const track = document.getElementById('arrivals-track');
  if (!track) return;

  // Filter doors where tags include 'New Arrival', max 5 items
  const newArrivals = store.getDoors({ isActive: true })
    .filter(d => (d.tags || []).includes('New Arrival'))
    .slice(0, 5);

  arrivalsCount = newArrivals.length;

  if (newArrivals.length === 0) {
    track.innerHTML = `
      <div class="w-full p-12 text-center bg-surface-container-low text-secondary font-label-sm text-xs uppercase tracking-widest">
        New architectural prototypes currently undergoing acoustic certification. Check back shortly.
      </div>
    `;
    return;
  }

  track.innerHTML = newArrivals.map(door => {
    const brand = store.getBrandById(door.brandId);
    const priceInfo = store.calculateEffectivePrice(door);

    const primaryImg = (door.images || []).find(i => i.isPrimary)?.url || 
                       door.images?.[0]?.url || 
                       Utils.getArchitecturalPlaceholderSvg();

    return `
      <div class="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-3 flex flex-col">
        <article class="group bg-surface-container-lowest flex flex-col shadow-sm hover:shadow-md transition-all h-full border border-surface-container">
          <div class="relative aspect-[3/4] overflow-hidden bg-surface-container">
            <img class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700" 
                 src="${primaryImg}" 
                 alt="${Utils.escapeHtml(door.name)}"/>
            <div class="absolute top-4 left-4 bg-primary text-on-primary font-label-sm text-[10px] uppercase tracking-widest px-3 py-1">
              New Release
            </div>
            ${priceInfo.hasDiscount ? `
              <div class="absolute top-4 right-4 bg-[#ba1a1a] text-on-primary font-label-sm text-[10px] uppercase tracking-widest px-3 py-1">
                Spec Incentive -${priceInfo.discountPercent}%
              </div>
            ` : ''}
          </div>

          <div class="p-6 flex flex-col justify-between flex-grow bg-surface-container-lowest">
            <div>
              <div class="flex items-center justify-between text-secondary font-label-sm text-[10px] uppercase tracking-widest mb-1">
                <span>Model ${Utils.escapeHtml(door.sku)}</span>
                <span>
                  ${brand ? `<a href="brand.html?slug=${brand.slug}" class="hover:underline">${Utils.escapeHtml(brand.name)}</a>` : 'PORTA Germany'}
                </span>
              </div>
              
              <h3 class="font-headline-md text-xl uppercase text-primary tracking-tight mt-1">
                ${Utils.escapeHtml(door.name)}
              </h3>

              <p class="font-body-sm text-xs text-on-surface-variant mt-2 leading-relaxed line-clamp-2">
                ${Utils.escapeHtml(door.shortDescription || 'Flush concealed door leaf with sub-millimeter perimeter shadow line.')}
              </p>

              <!-- Specs Grid -->
              <div class="grid grid-cols-2 gap-2 mt-4 pt-4 bg-surface-container-low p-3 font-label-sm text-[10px] uppercase tracking-wider text-on-surface">
                <div><span class="text-secondary">Acoustic:</span> ${door.specs?.acoustic || '42dB Lab'}</div>
                <div><span class="text-secondary">Max Height:</span> ${door.specs?.maxHeight || '3000mm'}</div>
                <div><span class="text-secondary">Frame:</span> ${door.specs?.frame || 'Zero-Jamb Flush'}</div>
                <div><span class="text-secondary">Latches:</span> ${door.specs?.latches || 'Magnetic Silent'}</div>
              </div>

              <!-- Price display -->
              <div class="mt-4 flex items-baseline gap-2">
                <span class="font-label-md text-sm uppercase text-primary font-bold">
                  From ${Utils.formatCurrency(priceInfo.effectivePrice)}
                </span>
                ${priceInfo.hasDiscount ? `
                  <span class="font-label-sm text-xs text-secondary line-through">
                    ${Utils.formatCurrency(priceInfo.basePrice)}
                  </span>
                ` : ''}
              </div>
            </div>

            <div class="flex items-center justify-between mt-6 pt-4 border-t border-surface-container">
              <button class="font-label-md text-xs uppercase tracking-widest text-primary hover:text-secondary flex items-center gap-1 font-semibold" onclick="addToSpec('${door.id}')">
                <span>+ Add to Spec List</span>
              </button>
              <a class="font-label-md text-xs uppercase tracking-widest text-primary hover:underline" href="catalog.html">
                Explore Model →
              </a>
            </div>
          </div>
        </article>
      </div>
    `;
  }).join('');

  attachSwipeListeners('arrivals-track', window.slideArrivals);
  updateArrivalsCarousel();
}

/* ================= 6. BEST SELLERS / ARCHITECTURAL FAVORITES (Responsive Carousel up to 5 items) ================= */
function renderBestSellers(categoryFilter = 'all') {
  activeFavoritesCategory = categoryFilter;
  const secConfig = store.getSettings().sectionConfigs?.bestSellers;
  const section = document.getElementById('bestsellers');
  if (secConfig?.enabled === false) {
    if (section) section.style.display = 'none';
    return;
  }
  if (section) section.style.display = 'block';

  const titleEl = document.getElementById('sec-bestsellers-title');
  if (titleEl && secConfig?.title) titleEl.textContent = secConfig.title;

  const track = document.getElementById('favorites-track');
  if (!track) return;

  let bestSellers = store.getDoors({ isActive: true }).filter(d => (d.tags || []).includes('Best Seller'));

  if (categoryFilter !== 'all') {
    bestSellers = bestSellers.filter(d => (d.categoryIds || []).includes(categoryFilter));
  }

  // Up to 5 items in the carousel
  bestSellers = bestSellers.slice(0, 5);
  favoritesCount = bestSellers.length;
  favoritesIndex = 0; // Reset index when filter changes

  if (bestSellers.length === 0) {
    track.innerHTML = `
      <div class="w-full p-12 text-center bg-surface-container-low text-secondary font-label-sm text-xs uppercase tracking-widest">
        No models found matching the selected filter.
      </div>
    `;
    updateFavoritesCarousel();
    return;
  }

  track.innerHTML = bestSellers.map(door => {
    const brand = store.getBrandById(door.brandId);
    const priceInfo = store.calculateEffectivePrice(door);

    const primaryImg = (door.images || []).find(i => i.isPrimary)?.url || 
                       door.images?.[0]?.url || 
                       Utils.getArchitecturalPlaceholderSvg();

    return `
      <div class="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-3 flex flex-col">
        <div class="product-item flex flex-col bg-surface shadow-sm h-full border border-surface-container">
          <div class="aspect-[4/5] overflow-hidden bg-surface-container relative">
            <img class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                 src="${primaryImg}" 
                 alt="${Utils.escapeHtml(door.name)}"/>
            
            <span class="absolute top-4 right-4 bg-surface/90 backdrop-blur-sm font-label-sm text-[10px] uppercase px-3 py-1 text-primary">
              ${brand ? Utils.escapeHtml(brand.name) : 'Architectural Standard'}
            </span>

            ${priceInfo.hasDiscount ? `
              <span class="absolute bottom-4 left-4 bg-primary text-on-primary font-label-sm text-[9px] uppercase px-2.5 py-1">
                Active Promo: -${priceInfo.discountPercent}%
              </span>
            ` : ''}
          </div>

          <div class="p-6 flex flex-col justify-between flex-grow">
            <div>
              <div class="flex items-baseline justify-between">
                <h3 class="font-headline-md text-lg uppercase text-primary">${Utils.escapeHtml(door.name)}</h3>
                <div class="text-right">
                  <span class="font-label-md text-xs text-primary uppercase font-bold">
                    ${Utils.formatCurrency(priceInfo.effectivePrice)}
                  </span>
                  ${priceInfo.hasDiscount ? `
                    <div class="font-label-sm text-[10px] text-secondary line-through">
                      ${Utils.formatCurrency(priceInfo.basePrice)}
                    </div>
                  ` : ''}
                </div>
              </div>

              <p class="font-body-sm text-xs text-on-surface-variant mt-2 leading-relaxed line-clamp-2">
                ${Utils.escapeHtml(door.shortDescription || 'Precision engineered door panel with concealed 3D adjustable hardware.')}
              </p>
            </div>

            <div class="mt-6 pt-4 flex items-center justify-between border-t border-surface-container">
              <span class="font-label-sm text-[10px] text-secondary uppercase tracking-widest">
                Spec Code: ${Utils.escapeHtml(door.sku)}
              </span>
              <button class="bg-primary text-on-primary font-label-sm text-[10px] uppercase tracking-widest px-4 py-2 hover:bg-surface-container-high hover:text-primary transition-colors" onclick="addToSpec('${door.id}')">
                + Add to Spec List
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  attachSwipeListeners('favorites-track', window.slideFavorites);
  updateFavoritesCarousel();
}

window.filterFavorites = function(categoryId, buttonEl) {
  const tabs = document.querySelectorAll('#favorites-filter-tabs .filter-tab');
  tabs.forEach(tab => {
    tab.classList.remove('bg-primary', 'text-on-primary');
    tab.classList.add('bg-surface-container', 'text-on-surface');
  });
  buttonEl.classList.remove('bg-surface-container', 'text-on-surface');
  buttonEl.classList.add('bg-primary', 'text-on-primary');

  renderBestSellers(categoryId);
};

/* ================= 6. STRICT 8 DOOR SYSTEMS ================= */
function renderDoorSystems() {
  const secConfig = store.getSettings().sectionConfigs?.mechanicalSystems;
  const section = document.getElementById('systems');
  if (secConfig?.enabled === false) {
    if (section) section.style.display = 'none';
    return;
  }
  if (section) section.style.display = 'block';

  const titleEl = document.getElementById('sec-systems-title');
  if (titleEl && secConfig?.title) titleEl.textContent = secConfig.title;

  const grid = document.getElementById('systems-grid');
  if (!grid) return;

  const systems = store.getMechanicalSystems();

  grid.innerHTML = systems.map(sys => `
    <div class="p-6 bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between text-secondary font-label-sm text-xs uppercase tracking-widest mb-4">
          <span>${sys.code}</span>
          <span class="font-mono text-[10px]">${sys.frameType || 'Concealed Subframe'}</span>
        </div>

        <div class="h-20 flex items-center justify-center bg-surface-container-low mb-4 text-primary">
          ${sys.svg || ''}
        </div>

        <h3 class="font-headline-md text-base uppercase text-primary">${Utils.escapeHtml(sys.name)}</h3>
        <p class="font-body-sm text-xs text-on-surface-variant mt-2 leading-relaxed">
          ${Utils.escapeHtml(sys.description)}
        </p>

        <div class="mt-4 pt-3 font-label-sm text-[10px] text-secondary uppercase space-y-1 border-t border-surface-container">
          <div>Capacity: <span class="text-primary font-mono">${Utils.escapeHtml(sys.capacity)}</span></div>
          <div>Max Height: <span class="text-primary font-mono">${Utils.escapeHtml(sys.maxHeight)}</span></div>
        </div>
      </div>

      <button class="mt-6 pt-3 text-left font-label-sm text-[10px] uppercase tracking-widest text-primary hover:text-secondary flex items-center justify-between border-t border-surface-container" onclick="downloadCad('${sys.name}')">
        <span>CAD / BIM (.DWG, .RVT)</span>
        <span class="material-symbols-outlined text-[14px]">download</span>
      </button>
    </div>
  `).join('');
}

window.downloadCad = function(systemName) {
  triggerToast(`CAD/BIM Package Ready: ${systemName} (.DWG/.RVT Family)`);
};

/* ================= 7. COMPLETED PROJECTS & CASE STUDIES ================= */
function renderCompletedProjects() {
  const secConfig = store.getSettings().sectionConfigs?.projects;
  const section = document.getElementById('projects');
  if (secConfig?.enabled === false) {
    if (section) section.style.display = 'none';
    return;
  }
  if (section) section.style.display = 'block';

  const titleEl = document.getElementById('sec-projects-title');
  if (titleEl && secConfig?.title) titleEl.textContent = secConfig.title;

  const stack = document.getElementById('projects-stack');
  if (!stack) return;

  const projects = store.getProjects();

  stack.innerHTML = projects.map((proj, idx) => {
    const isEven = idx % 2 === 1;
    const imgUrl = proj.images?.[0]?.url || Utils.getArchitecturalPlaceholderSvg();

    const systemNames = (proj.installedSystemIds || []).map(id => store.getMechanicalSystemById(id)?.name || id).join(' & ');

    return `
      <article class="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center bg-surface-container-low p-6 lg:p-10 shadow-sm">
        <div class="lg:col-span-7 ${isEven ? 'order-1 lg:order-2' : ''} overflow-hidden">
          <img class="w-full aspect-[16/10] object-cover hover:scale-[1.01] transition-transform duration-700" 
               src="${imgUrl}" 
               alt="${Utils.escapeHtml(proj.title)}"/>
        </div>

        <div class="lg:col-span-5 ${isEven ? 'order-2 lg:order-1' : ''} flex flex-col justify-between space-y-6">
          <div>
            <div class="flex items-center gap-space-xs text-secondary font-label-sm text-xs uppercase tracking-widest mb-2">
              <span>${Utils.escapeHtml(proj.clientType || 'Architectural Dossier')}</span>
              <span>/</span>
              <span>${Utils.escapeHtml(proj.location)}</span>
            </div>
            
            <h3 class="font-headline-lg text-2xl uppercase text-primary tracking-tight">
              ${Utils.escapeHtml(proj.title)}
            </h3>

            <div class="mt-3 font-label-sm text-xs uppercase tracking-widest text-on-surface-variant space-y-1">
              <div><span class="text-secondary">Architect:</span> ${Utils.escapeHtml(proj.architectStudio || 'International Practice')}</div>
              <div><span class="text-secondary">Systems Installed:</span> ${Utils.escapeHtml(systemNames || 'Flush Pivot & Pocket')}</div>
              <div><span class="text-secondary">Detail:</span> ${Utils.escapeHtml(proj.scale || 'Monolithic Sub-Millimeter Shadow Margins')}</div>
            </div>
          </div>

          <blockquote class="p-4 bg-surface-container-lowest font-body-md text-sm italic text-primary leading-relaxed border-l-2 border-primary">
            ${Utils.escapeHtml(proj.clientQuote)}
            <footer class="mt-2 not-italic font-label-sm text-[10px] uppercase tracking-widest text-secondary">
              — ${Utils.escapeHtml(proj.clientName || 'Project Lead')}
            </footer>
          </blockquote>

          <div>
            <a class="inline-flex items-center gap-2 font-label-md text-xs uppercase tracking-widest text-primary hover:underline" href="#inquiry">
              <span>Request Project Case Dossier</span>
              <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
            </a>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

/* ================= 8. TESTIMONIALS ================= */
function renderTestimonials() {
  const container = document.getElementById('testimonials-grid');
  if (!container) return;

  const testimonials = store.getTestimonials();

  container.innerHTML = testimonials.map(t => `
    <div class="p-8 bg-surface-container-lowest flex flex-col justify-between shadow-sm">
      <p class="font-body-md text-sm text-on-surface leading-relaxed italic">
        ${Utils.escapeHtml(t.quote)}
      </p>
      <div class="mt-6 pt-4 bg-surface-container-low p-3 font-label-sm text-[10px] uppercase tracking-widest text-on-surface">
        <div class="font-bold text-primary">${Utils.escapeHtml(t.authorTitle)}</div>
        <div class="text-secondary">${Utils.escapeHtml(t.authorOrg)}</div>
      </div>
    </div>
  `).join('');
}

/* ================= 9. SPECIFICATION LIST & DRAWER ================= */
window.addToSpec = function(doorId) {
  const door = store.getDoorById(doorId);
  if (!door) return;

  store.addToSpecList(doorId);
  triggerToast(`Added to Spec Schedule: ${door.name} (${door.sku})`);
  toggleSpecDrawer(true);
};

window.toggleSpecDrawer = function(open) {
  const drawer = document.getElementById('spec-drawer');
  const backdrop = document.getElementById('drawer-backdrop');

  if (open) {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  } else {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
};

function updateSpecCounter() {
  const list = store.getSpecList();
  const totalCount = list.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const counter = document.getElementById('spec-list-counter');
  if (counter) {
    counter.textContent = `[ ${totalCount} ]`;
  }
}

function renderSpecDrawer() {
  const list = store.getSpecList();
  const container = document.getElementById('drawer-items-container');
  const countLabel = document.getElementById('drawer-item-count');
  const totalVal = document.getElementById('drawer-total-val');

  if (!container) return;

  const totalQuantity = list.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = list.reduce((sum, i) => sum + (i.effectivePrice * i.quantity), 0);

  if (countLabel) countLabel.textContent = `${totalQuantity} opening(s) across ${list.length} model(s)`;
  if (totalVal) totalVal.textContent = Utils.formatCurrency(totalAmount);

  if (list.length === 0) {
    container.innerHTML = `
      <div class="h-64 flex flex-col items-center justify-center text-center p-6 text-secondary">
        <span class="material-symbols-outlined text-4xl mb-2 text-surface-container-high">door_sliding</span>
        <div class="font-label-sm text-xs uppercase tracking-widest text-primary font-medium">Specification Schedule Empty</div>
        <p class="font-body-sm text-xs mt-1">Select architectural doors from the catalog or New Arrivals to assemble your project schedule.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(item => `
    <div class="p-4 bg-surface-low border border-surface-container flex gap-3 items-start justify-between">
      <img src="${item.primaryImage}" class="w-14 h-18 object-cover bg-surface-container" alt="${Utils.escapeHtml(item.name)}"/>
      
      <div class="flex-1">
        <div class="flex items-baseline justify-between">
          <h4 class="font-headline-md text-xs uppercase text-primary">${Utils.escapeHtml(item.name)}</h4>
          <span class="font-mono text-xs font-semibold">${Utils.formatCurrency(item.effectivePrice * item.quantity)}</span>
        </div>
        <div class="font-label-sm text-[10px] uppercase text-secondary">
          <span>${item.sku}</span> • <span>${item.brandName}</span>
        </div>
        <div class="font-body-sm text-[10px] text-secondary mt-1">
          Finish: ${Utils.escapeHtml(item.finish || 'Standard')}
        </div>

        <!-- Quantity Adjuster -->
        <div class="flex items-center gap-2 mt-3">
          <button class="w-6 h-6 border border-surface-container bg-surface-lowest text-xs flex items-center justify-center hover:bg-surface-high" onclick="updateSpecQty('${item.id}', ${item.quantity - 1})">-</button>
          <span class="font-mono text-xs font-bold w-6 text-center">${item.quantity}</span>
          <button class="w-6 h-6 border border-surface-container bg-surface-lowest text-xs flex items-center justify-center hover:bg-surface-high" onclick="updateSpecQty('${item.id}', ${item.quantity + 1})">+</button>
          <button class="ml-auto text-[10px] uppercase font-label-sm tracking-wider text-secondary hover:text-primary" onclick="removeSpecItem('${item.id}')">Remove</button>
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

window.clearSpecSchedule = function() {
  if (confirm('Clear all doors from your active specification list?')) {
    store.clearSpecList();
  }
};

/* ================= 10. PUBLIC INQUIRY FORM SUBMISSION ================= */
window.togglePill = function(btn) {
  if (btn.classList.contains('bg-primary')) {
    btn.classList.remove('bg-primary', 'text-on-primary');
    btn.classList.add('bg-surface-container', 'text-on-surface');
  } else {
    btn.classList.remove('bg-surface-container', 'text-on-surface');
    btn.classList.add('bg-primary', 'text-on-primary');
  }
};

window.handleInqFile = function(input) {
  const display = document.getElementById('inq-file-display');
  if (input.files && input.files[0]) {
    currentAttachedFileName = input.files[0].name;
    display.textContent = `Attached: ${currentAttachedFileName} (${(input.files[0].size / 1024 / 1024).toFixed(2)} MB)`;
    display.classList.remove('hidden');
  }
};

window.handlePublicInquirySubmit = function(e) {
  e.preventDefault();

  const projectType = document.getElementById('inq-project-type').value;
  const openingsCount = document.getElementById('inq-openings').value;
  const finishPreference = document.getElementById('inq-finish').value;
  const projectLocation = document.getElementById('inq-location').value.trim();
  const contactName = document.getElementById('inq-name').value.trim();
  const contactEmail = document.getElementById('inq-email').value.trim();

  // Systems of interest
  const systemsInterest = [];
  document.querySelectorAll('#inq-systems-selection .spec-pill.bg-primary').forEach(pill => {
    systemsInterest.push(pill.textContent.trim());
  });

  // Current spec list schedule
  const items = store.getSpecList();

  const newInquiry = store.submitInquiry({
    contactName,
    contactEmail,
    projectLocation,
    projectType,
    openingsCount,
    finishPreference,
    systemsInterest,
    fileName: currentAttachedFileName || null,
    items,
    notes: `Public Trade Inquiry submitted with ${items.length} specified models.`
  });

  const successMsg = document.getElementById('inq-success-msg');
  if (successMsg) successMsg.classList.remove('hidden');

  triggerToast('Specification Request Received — Dossier Created');

  // Reset form
  e.target.reset();
  currentAttachedFileName = '';
  document.getElementById('inq-file-display')?.classList.add('hidden');
  document.querySelectorAll('#inq-systems-selection .spec-pill').forEach(pill => {
    pill.classList.remove('bg-primary', 'text-on-primary');
    pill.classList.add('bg-surface-container', 'text-on-surface');
  });

  // Clear spec schedule
  store.clearSpecList();
};

/* ================= 11. TOAST NOTIFICATION ================= */
function triggerToast(message) {
  const toast = document.getElementById('spec-toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
  }, 3500);
}
