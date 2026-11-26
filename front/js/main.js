/**
 * DOORS GALLERY — Compact Full-HD & Mobile-Responsive Frontend Controller
 * Implements:
 *  a. Header + Dynamic Category Banner Menu + Mobile Drawer
 *  b. 3 Rotating Hero Banners (auto-rotation + swipe + dots)
 *  c. Product Categories Grid + New Models Carousel (up to 5 items)
 *  d. Category Best Sellers Carousel with dynamic category tabs (up to 5 items)
 *  e. 8 Mechanical Systems, Completed Projects, Endorsements, Spec List & Inquiry
 */

import { store } from '../../shared/js/store.js';
import { Utils } from '../../shared/js/utils.js';

let currentAttachedFileName = '';
let currentBannerIndex = 0;
let heroIntervalId = null;

let arrivalsIndex = 0;
let arrivalsCount = 0;
let favoritesIndex = 0;
let favoritesCount = 0;
let activeFavoritesCategory = 'all';

document.addEventListener('DOMContentLoaded', () => {
  renderAllSections();

  window.addEventListener('porta-store-updated', () => {
    renderAllSections();
  });

  window.addEventListener('porta-spec-list-updated', () => {
    updateSpecCounter();
    renderSpecDrawer();
  });

  window.addEventListener('resize', () => {
    updateArrivalsCarousel();
    updateFavoritesCarousel();
  });
});

function renderAllSections() {
  renderHeaderAndFooter();
  renderCategoryMenus();
  renderHeroBanners();
  renderCategoriesShowcase();
  renderNewArrivals();
  renderBestSellersFilterTabs();
  renderBestSellers(activeFavoritesCategory);
  renderDoorSystems();
  renderCompletedProjects();
  renderTestimonials();
  updateSpecCounter();
  renderSpecDrawer();
}

/* ================= A. HEADER, MOBILE MENU & CATEGORY BAR ================= */
window.toggleMobileMenu = function(forceState) {
  const drawer = document.getElementById('mobile-nav-drawer');
  const icon = document.getElementById('mobile-menu-icon');
  if (!drawer) return;
  const shouldOpen = forceState !== undefined ? forceState : drawer.classList.contains('hidden');
  if (shouldOpen) {
    drawer.classList.remove('hidden');
    if (icon) icon.textContent = 'close';
  } else {
    drawer.classList.add('hidden');
    if (icon) icon.textContent = 'menu';
  }
};

function renderHeaderAndFooter() {
  const settings = store.getSettings();
  const logoSrc = settings.logoUrl || '../shared/assets/logo-mark.png';

  const headerLogo = document.getElementById('header-logo-img');
  if (headerLogo) headerLogo.src = logoSrc;

  const footerLogo = document.getElementById('footer-logo-img');
  if (footerLogo) footerLogo.src = logoSrc;

  const brandTitle = document.getElementById('header-brand-title');
  if (brandTitle) brandTitle.textContent = settings.companyName || 'DOORS GALLERY';

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
  if (footerName) footerName.textContent = settings.companyName || 'DOORS GALLERY';

  const footerCopy = document.getElementById('footer-copyright');
  if (footerCopy) footerCopy.textContent = settings.copyright || '© 2026 DOORS GALLERY.';

  const footerCert = document.getElementById('footer-certifications');
  if (footerCert) footerCert.textContent = settings.certifications || '';

  const showroomsList = document.getElementById('footer-showrooms-list');
  if (showroomsList && settings.showrooms) {
    showroomsList.innerHTML = settings.showrooms.map(s => `
      <li><strong class="text-ink font-medium">${Utils.escapeHtml(s.city)}:</strong> ${Utils.escapeHtml(s.address)}</li>
    `).join('') + `
      <li class="pt-1.5 font-label text-[11px] text-gold-dark">
        <a class="hover:underline" href="tel:${(settings.phone || '').replace(/[^0-9+]/g, '')}">${Utils.escapeHtml(settings.phone || '')}</a>
      </li>
    `;
  }
}

function renderCategoryMenus() {
  const categories = store.getCategories().filter(c => c.isActive !== false);
  const bar = document.getElementById('header-category-bar');
  const mobileCats = document.getElementById('mobile-categories-list');

  if (bar) {
    bar.innerHTML = `
      <div class="flex items-center gap-5 shrink-0">
        <a href="catalog.html" class="font-label text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-ink font-semibold hover:text-gold-dark whitespace-nowrap">
          All Doors
        </a>
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

  if (mobileCats) {
    mobileCats.innerHTML = categories.map(cat => `
      <a href="catalog.html?category=${encodeURIComponent(cat.slug)}" class="px-2.5 py-1 bg-surface-low border border-hairline text-[11px] font-label uppercase tracking-wider text-on-surface hover:border-gold">
        ${Utils.escapeHtml(cat.name)}
      </a>
    `).join('');
  }
}

/* ================= B. 3 BANNERS IN ROTATION (HERO SLIDER) ================= */
function getActiveBanners() {
  const settings = store.getSettings();
  if (Array.isArray(settings.heroBanners) && settings.heroBanners.length > 0) {
    return settings.heroBanners.slice(0, 3);
  }
  // Fallback if custom single hero was saved
  return [
    {
      id: 'banner-fallback-1',
      badge: settings.hero?.directive || 'ARCHITECTURAL SERIES',
      headline: settings.hero?.headline || 'Frameless & Flush Concealed Doors',
      subheadline: settings.hero?.subheadline || 'Engineered flush door systems with silent magnetic hardware.',
      imageUrl: settings.hero?.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      ctaText: 'Explore Catalog',
      ctaLink: 'catalog.html',
      secondaryCtaText: 'Request Quote',
      secondaryCtaLink: '#inquiry'
    }
  ];
}

function renderHeroBanners() {
  const slidesContainer = document.getElementById('hero-slides-container');
  const dotsContainer = document.getElementById('hero-dots-container');
  const viewport = document.getElementById('hero-carousel-viewport');
  if (!slidesContainer || !dotsContainer) return;

  const banners = getActiveBanners();
  if (currentBannerIndex >= banners.length) currentBannerIndex = 0;

  slidesContainer.innerHTML = banners.map((b, idx) => `
    <div class="hero-slide ${idx === currentBannerIndex ? 'active' : ''}" data-slide-idx="${idx}">
      <img src="${b.imageUrl || Utils.getArchitecturalPlaceholderSvg()}" alt="${Utils.escapeHtml(b.headline)}" class="w-full h-full object-cover object-center"/>
      <div class="absolute inset-0 bg-gradient-to-r from-white/85 via-white/45 to-transparent sm:from-white/75 sm:via-white/25 sm:to-transparent"></div>
      <div class="absolute inset-0 flex items-center px-11 sm:px-14 lg:px-16">
        <div class="bg-white/92 backdrop-blur-md p-4 sm:p-6 max-w-md lg:max-w-lg border border-hairline border-l-[3px] border-l-gold shadow-md">
          <div class="font-label text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-gold-dark font-semibold mb-1">
            ${Utils.escapeHtml(b.badge || 'DOORS GALLERY')}
          </div>
          <h1 class="font-headline text-lg sm:text-2xl lg:text-[26px] uppercase text-ink leading-tight tracking-tight font-medium">
            ${Utils.escapeHtml(b.headline)}
          </h1>
          <p class="text-xs text-on-surface-variant mt-1.5 sm:mt-2 leading-relaxed line-clamp-2 sm:line-clamp-3">
            ${Utils.escapeHtml(b.subheadline)}
          </p>
          <div class="mt-3.5 sm:mt-4 flex flex-wrap items-center gap-2">
            <a href="${b.ctaLink || 'catalog.html'}" class="bg-ink text-gold-light border border-gold/50 hover:bg-gold hover:text-white font-label text-[10px] uppercase tracking-[0.16em] px-4 py-2 transition-colors">
              ${Utils.escapeHtml(b.ctaText || 'Explore Doors')}
            </a>
            ${b.secondaryCtaText ? `
              <a href="${b.secondaryCtaLink || '#inquiry'}" class="bg-white border border-hairline hover:border-gold text-ink font-label text-[10px] uppercase tracking-[0.15em] px-3.5 py-2 transition-colors">
                ${Utils.escapeHtml(b.secondaryCtaText)}
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `).join('');

  dotsContainer.innerHTML = banners.map((_, idx) => `
    <button onclick="goToHeroBanner(${idx})" aria-label="Banner ${idx + 1}" class="h-2 rounded-full transition-all ${idx === currentBannerIndex ? 'w-6 bg-gold' : 'w-2 bg-secondary/40 hover:bg-gold/60'}"></button>
  `).join('');

  startHeroAutoplay();

  if (viewport && !viewport.dataset.bound) {
    viewport.dataset.bound = 'true';
    viewport.addEventListener('mouseenter', () => stopHeroAutoplay());
    viewport.addEventListener('mouseleave', () => startHeroAutoplay());
    attachSwipeListeners('hero-carousel-viewport', window.changeHeroBanner);
  }
}

function updateHeroActiveSlide() {
  const banners = getActiveBanners();
  document.querySelectorAll('#hero-slides-container .hero-slide').forEach((el, idx) => {
    el.classList.toggle('active', idx === currentBannerIndex);
  });
  const dotsContainer = document.getElementById('hero-dots-container');
  if (dotsContainer) {
    dotsContainer.innerHTML = banners.map((_, idx) => `
      <button onclick="goToHeroBanner(${idx})" aria-label="Banner ${idx + 1}" class="h-2 rounded-full transition-all ${idx === currentBannerIndex ? 'w-6 bg-gold' : 'w-2 bg-secondary/40 hover:bg-gold/60'}"></button>
    `).join('');
  }
}

window.changeHeroBanner = function(delta) {
  const banners = getActiveBanners();
  if (banners.length <= 1) return;
  currentBannerIndex = (currentBannerIndex + delta + banners.length) % banners.length;
  updateHeroActiveSlide();
  startHeroAutoplay();
};

window.goToHeroBanner = function(index) {
  currentBannerIndex = index;
  updateHeroActiveSlide();
  startHeroAutoplay();
};

function startHeroAutoplay() {
  stopHeroAutoplay();
  const speed = Number(store.getSettings().heroAutoplayMs) || 5000;
  heroIntervalId = setInterval(() => {
    const banners = getActiveBanners();
    if (banners.length > 1) {
      currentBannerIndex = (currentBannerIndex + 1) % banners.length;
      updateHeroActiveSlide();
    }
  }, speed);
}

function stopHeroAutoplay() {
  if (heroIntervalId) {
    clearInterval(heroIntervalId);
    heroIntervalId = null;
  }
}

/* ================= C.1 PRODUCT CATEGORIES SHOWCASE ================= */
function renderCategoriesShowcase() {
  const secConfig = store.getSettings().sectionConfigs?.categories;
  const section = document.getElementById('categories-section');
  if (secConfig?.enabled === false) {
    if (section) section.style.display = 'none';
    return;
  }
  if (section) section.style.display = 'block';

  const titleEl = document.getElementById('sec-categories-title');
  if (titleEl && secConfig?.title) titleEl.textContent = secConfig.title;

  const grid = document.getElementById('categories-showcase-grid');
  if (!grid) return;

  const categories = store.getCategories().filter(c => c.isActive !== false);
  const allDoors = store.getDoors({ isActive: true });

  grid.innerHTML = categories.map(cat => {
    const count = allDoors.filter(d => (d.categoryIds || []).includes(cat.id)).length;
    const img = cat.coverImage || Utils.getArchitecturalPlaceholderSvg();
    return `
      <a href="catalog.html?category=${encodeURIComponent(cat.slug)}" class="group bg-white border border-hairline hover:border-gold transition-all flex flex-col overflow-hidden shadow-xs">
        <div class="aspect-[4/3] overflow-hidden bg-surface-container relative">
          <img src="${img}" alt="${Utils.escapeHtml(cat.name)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
        </div>
        <div class="p-3 flex items-center justify-between gap-2 bg-white">
          <div class="min-w-0">
            <h3 class="font-headline text-xs sm:text-[13px] font-medium uppercase text-ink group-hover:text-gold-dark truncate transition-colors">
              ${Utils.escapeHtml(cat.name)}
            </h3>
            <div class="font-label text-[10px] text-secondary uppercase">${count} Models</div>
          </div>
          <span class="material-symbols-outlined text-[15px] text-secondary group-hover:text-gold-dark transition-colors shrink-0">arrow_forward</span>
        </div>
      </a>
    `;
  }).join('');
}

/* ================= CAROUSEL HELPERS (FULL HD 4-CARD COMPACT SCALE) ================= */
function getVisibleCount() {
  if (typeof window === 'undefined') return 4;
  if (window.innerWidth >= 1200) return 4; // Full HD Desktop: 4 compact cards visible, 5th hidden
  if (window.innerWidth >= 900) return 3;  // Laptop: 3 visible
  if (window.innerWidth >= 600) return 2;  // Tablet: 2 visible
  return 1;                                // Mobile: 1 visible
}

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
    if (Math.abs(diff) > 38) {
      slideFn(diff > 0 ? 1 : -1);
    }
  }, { passive: true });
}

function renderDoorCarouselCard(door, badgeText) {
  const brand = store.getBrandById(door.brandId);
  const system = store.getMechanicalSystemById(door.mechanicalSystemId);
  const priceInfo = store.calculateEffectivePrice(door);

  const primaryImg = (door.images || []).find(i => i.isPrimary)?.url ||
                     door.images?.[0]?.url ||
                     Utils.getArchitecturalPlaceholderSvg();

  return `
    <div class="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2 flex flex-col">
      <article class="group bg-white border border-hairline hover:border-gold/70 transition-all flex flex-col h-full shadow-xs">
        <div class="relative aspect-[4/4.5] overflow-hidden bg-surface-container">
          <img src="${primaryImg}" alt="${Utils.escapeHtml(door.name)}" class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"/>
          <span class="absolute top-2.5 left-2.5 bg-white/95 text-ink border-l-2 border-gold font-label text-[9px] uppercase tracking-wider px-2 py-0.5 shadow-xs">
            ${Utils.escapeHtml(badgeText)}
          </span>
          ${priceInfo.hasDiscount ? `
            <span class="absolute top-2.5 right-2.5 bg-gold-tint text-gold-dark border border-gold/50 font-label text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5">
              -${priceInfo.discountPercent}% Offer
            </span>
          ` : ''}
        </div>

        <div class="p-3.5 flex flex-col justify-between flex-grow">
          <div>
            <div class="flex items-center justify-between text-[10px] font-label uppercase tracking-wider text-secondary mb-1">
              <span>${Utils.escapeHtml(door.sku)}</span>
              ${brand ? `<a href="brand.html?slug=${encodeURIComponent(brand.slug)}" class="hover:text-gold-dark hover:underline truncate max-w-[130px]">${Utils.escapeHtml(brand.name)}</a>` : '<span>Doors Gallery</span>'}
            </div>

            <h3 class="font-headline text-sm font-medium uppercase text-ink tracking-tight leading-snug">
              ${Utils.escapeHtml(door.name)}
            </h3>

            <p class="text-[11px] text-on-surface-variant mt-1 leading-relaxed line-clamp-2">
              ${Utils.escapeHtml(door.shortDescription || 'Concealed flush architectural door system.')}
            </p>

            <div class="mt-2.5 py-1.5 px-2 bg-surface-low border border-hairline flex items-center justify-between text-[10px] font-label uppercase text-on-surface-variant">
              <span>${Utils.escapeHtml(system ? system.name : 'Flush Swing')}</span>
              <span>${Utils.escapeHtml(door.specs?.acoustic || '40dB')}</span>
            </div>
          </div>

          <div class="mt-3 pt-2.5 border-t border-hairline flex items-center justify-between gap-2">
            <div>
              <span class="font-headline text-sm font-semibold text-gold-dark">
                ${Utils.formatCurrency(priceInfo.effectivePrice)}
              </span>
              ${priceInfo.hasDiscount ? `
                <span class="text-[10px] text-secondary line-through ml-1">
                  ${Utils.formatCurrency(priceInfo.basePrice)}
                </span>
              ` : ''}
            </div>

            <button onclick="addToSpec('${door.id}')" class="border border-gold bg-white text-ink hover:bg-ink hover:text-gold-light font-label text-[10px] font-medium uppercase tracking-wider px-2.5 py-1.5 transition-colors shrink-0">
              + Spec List
            </button>
          </div>
        </div>
      </article>
    </div>
  `;
}

/* ================= C.2 NEW MODELS CAROUSEL (UP TO 5 ITEMS) ================= */
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
    const shiftPercent = arrivalsCount > 0 ? arrivalsIndex * (100 / visible) : 0;
    track.style.transform = `translateX(-${shiftPercent}%)`;
  }
  if (counter) {
    counter.textContent = arrivalsCount > 0
      ? `${String(arrivalsIndex + 1).padStart(2, '0')} / ${String(arrivalsCount).padStart(2, '0')}`
      : '00 / 00';
  }
  if (prevBtn) prevBtn.disabled = (arrivalsIndex <= 0);
  if (nextBtn) nextBtn.disabled = (arrivalsIndex >= maxIndex);
}

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

  const newArrivals = store.getDoors({ isActive: true })
    .filter(d => (d.tags || []).includes('New Arrival'))
    .slice(0, 5);

  arrivalsCount = newArrivals.length;

  if (newArrivals.length === 0) {
    track.innerHTML = `<div class="w-full p-8 text-center bg-white border border-hairline text-secondary text-xs uppercase font-label">No new models currently tagged.</div>`;
    updateArrivalsCarousel();
    return;
  }

  track.innerHTML = newArrivals.map(d => renderDoorCarouselCard(d, 'New Model')).join('');
  attachSwipeListeners('arrivals-track', window.slideArrivals);
  updateArrivalsCarousel();
}

/* ================= D. CATEGORY BEST SELLERS CAROUSEL (UP TO 5 ITEMS) ================= */
function renderBestSellersFilterTabs() {
  const tabsContainer = document.getElementById('favorites-filter-tabs');
  if (!tabsContainer) return;

  const categories = store.getCategories().filter(c => c.isActive !== false);
  const allTabs = [{ id: 'all', name: 'All Categories' }, ...categories];

  tabsContainer.innerHTML = allTabs.map(tab => {
    const isActive = activeFavoritesCategory === tab.id;
    const cls = isActive
      ? 'bg-gold-tint border-gold text-ink font-semibold'
      : 'bg-surface-low border-hairline text-on-surface-variant hover:border-gold/60';
    return `
      <button onclick="filterFavorites('${tab.id}')" class="filter-tab px-3 py-1.5 border font-label text-[10px] uppercase tracking-wider whitespace-nowrap transition-colors ${cls}">
        ${Utils.escapeHtml(tab.name)}
      </button>
    `;
  }).join('');
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
    const shiftPercent = favoritesCount > 0 ? favoritesIndex * (100 / visible) : 0;
    track.style.transform = `translateX(-${shiftPercent}%)`;
  }
  if (counter) {
    counter.textContent = favoritesCount > 0
      ? `${String(favoritesIndex + 1).padStart(2, '0')} / ${String(favoritesCount).padStart(2, '0')}`
      : '00 / 00';
  }
  if (prevBtn) prevBtn.disabled = (favoritesIndex <= 0);
  if (nextBtn) nextBtn.disabled = (favoritesIndex >= maxIndex);
}

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

  bestSellers = bestSellers.slice(0, 5);
  favoritesCount = bestSellers.length;
  favoritesIndex = 0;

  if (bestSellers.length === 0) {
    track.innerHTML = `<div class="w-full p-8 text-center bg-surface-low border border-hairline text-secondary text-xs uppercase font-label">No best sellers in this category yet.</div>`;
    updateFavoritesCarousel();
    return;
  }

  track.innerHTML = bestSellers.map(d => renderDoorCarouselCard(d, 'Best Seller')).join('');
  attachSwipeListeners('favorites-track', window.slideFavorites);
  updateFavoritesCarousel();
}

window.filterFavorites = function(categoryId) {
  activeFavoritesCategory = categoryId;
  renderBestSellersFilterTabs();
  renderBestSellers(categoryId);
};

/* ================= E.1 8 MECHANICAL SYSTEMS ================= */
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
    <div class="p-4 bg-white border border-hairline hover:border-gold/60 transition-colors flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between text-[10px] font-label uppercase tracking-wider text-secondary mb-2.5">
          <span class="text-gold-dark font-semibold">${Utils.escapeHtml(sys.code)}</span>
          <span class="truncate max-w-[140px]">${Utils.escapeHtml(sys.frameType || 'Concealed Frame')}</span>
        </div>

        <div class="h-14 flex items-center justify-center bg-surface-low border border-hairline mb-3 text-ink">
          ${sys.svg || ''}
        </div>

        <h3 class="font-headline text-sm font-medium uppercase text-ink">${Utils.escapeHtml(sys.name)}</h3>
        <p class="text-[11px] text-on-surface-variant mt-1 leading-relaxed line-clamp-2">
          ${Utils.escapeHtml(sys.description)}
        </p>

        <div class="mt-3 pt-2 border-t border-hairline text-[10px] font-label uppercase text-secondary space-y-0.5">
          <div>Load: <span class="text-ink font-mono">${Utils.escapeHtml(sys.capacity)}</span></div>
          <div>Span: <span class="text-ink font-mono">${Utils.escapeHtml(sys.maxHeight)}</span></div>
        </div>
      </div>

      <div class="mt-3 pt-2 border-t border-hairline flex items-center justify-between">
        <a href="catalog.html?system=${encodeURIComponent(sys.id)}" class="font-label text-[10px] uppercase tracking-wider text-ink hover:text-gold-dark">
          View Doors →
        </a>
        <button onclick="downloadCad('${Utils.escapeHtml(sys.name)}')" class="font-label text-[10px] uppercase tracking-wider text-secondary hover:text-gold-dark flex items-center gap-1">
          <span>CAD</span>
          <span class="material-symbols-outlined text-[13px]">download</span>
        </button>
      </div>
    </div>
  `).join('');
}

window.downloadCad = function(systemName) {
  triggerToast(`CAD / BIM Package Ready: ${systemName}`);
};

/* ================= E.2 COMPLETED PROJECTS (COMPACT 3-COL FULL HD) ================= */
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
  stack.innerHTML = projects.map(proj => {
    const imgUrl = proj.images?.[0]?.url || Utils.getArchitecturalPlaceholderSvg();
    const systemNames = (proj.installedSystemIds || []).map(id => store.getMechanicalSystemById(id)?.name || id).join(', ');

    return `
      <article class="bg-surface-low border border-hairline flex flex-col overflow-hidden">
        <div class="aspect-[16/10] overflow-hidden bg-surface-container">
          <img src="${imgUrl}" alt="${Utils.escapeHtml(proj.title)}" class="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500"/>
        </div>
        <div class="p-4 flex flex-col justify-between flex-grow space-y-3">
          <div>
            <div class="font-label text-[10px] uppercase tracking-wider text-gold-dark font-semibold">
              ${Utils.escapeHtml(proj.clientType || 'Project')} • ${Utils.escapeHtml(proj.location)}
            </div>
            <h3 class="font-headline text-base font-medium uppercase text-ink mt-0.5">
              ${Utils.escapeHtml(proj.title)}
            </h3>
            <div class="mt-1.5 text-[11px] text-on-surface-variant space-y-0.5">
              <div><strong class="text-ink">Studio:</strong> ${Utils.escapeHtml(proj.architectStudio || 'Private Practice')}</div>
              <div><strong class="text-ink">Systems:</strong> ${Utils.escapeHtml(systemNames || 'Flush Concealed')}</div>
            </div>
          </div>

          <blockquote class="p-3 bg-white border-l-2 border-gold text-xs italic text-on-surface leading-relaxed">
            ${Utils.escapeHtml(proj.clientQuote)}
            <footer class="mt-1 not-italic font-label text-[9px] uppercase tracking-widest text-secondary">
              — ${Utils.escapeHtml(proj.clientName || 'Project Architect')}
            </footer>
          </blockquote>
        </div>
      </article>
    `;
  }).join('');
}

/* ================= E.3 TESTIMONIALS ================= */
function renderTestimonials() {
  const container = document.getElementById('testimonials-grid');
  if (!container) return;

  const testimonials = store.getTestimonials();
  container.innerHTML = testimonials.map(t => `
    <div class="p-4 sm:p-5 bg-white border border-hairline flex flex-col justify-between">
      <p class="text-xs text-on-surface leading-relaxed italic">
        ${Utils.escapeHtml(t.quote)}
      </p>
      <div class="mt-3 pt-2.5 border-t border-hairline font-label text-[10px] uppercase tracking-wider">
        <span class="font-semibold text-ink">${Utils.escapeHtml(t.authorTitle)}</span>
        <span class="text-gold-dark ml-1">• ${Utils.escapeHtml(t.authorOrg)}</span>
      </div>
    </div>
  `).join('');
}

/* ================= SPEC LIST & SLIDE-OUT DRAWER ================= */
window.addToSpec = function(doorId) {
  const door = store.getDoorById(doorId);
  if (!door) return;
  store.addToSpecList(doorId);
  triggerToast(`Added: ${door.name} (${door.sku})`);
  toggleSpecDrawer(true);
};

window.toggleSpecDrawer = function(open) {
  const drawer = document.getElementById('spec-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  if (!drawer || !backdrop) return;
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

  if (countLabel) countLabel.textContent = `${totalQuantity} opening(s) across ${list.length} model(s)`;
  if (totalVal) totalVal.textContent = Utils.formatCurrency(totalAmount);

  if (list.length === 0) {
    container.innerHTML = `
      <div class="h-52 flex flex-col items-center justify-center text-center p-4 text-secondary">
        <span class="material-symbols-outlined text-3xl mb-1.5 text-gold">door_front</span>
        <div class="font-label text-xs uppercase tracking-wider text-ink font-medium">Spec List Empty</div>
        <p class="text-xs mt-1">Click "+ Spec List" on any door model to build your project schedule.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(item => `
    <div class="p-3 bg-surface-low border border-hairline flex gap-3 items-start justify-between">
      <img src="${item.primaryImage}" class="w-12 h-16 object-cover bg-surface-container shrink-0" alt="${Utils.escapeHtml(item.name)}"/>
      <div class="flex-1 min-w-0">
        <div class="flex items-baseline justify-between gap-2">
          <h4 class="font-headline text-xs font-medium uppercase text-ink truncate">${Utils.escapeHtml(item.name)}</h4>
          <span class="font-headline text-xs font-semibold text-gold-dark shrink-0">${Utils.formatCurrency(item.effectivePrice * item.quantity)}</span>
        </div>
        <div class="font-label text-[10px] uppercase text-secondary">
          ${Utils.escapeHtml(item.sku)} • ${Utils.escapeHtml(item.brandName)}
        </div>
        <div class="flex items-center gap-1.5 mt-2">
          <button class="w-6 h-6 border border-hairline bg-white text-xs flex items-center justify-center hover:border-gold" onclick="updateSpecQty('${item.id}', ${item.quantity - 1})">-</button>
          <span class="font-mono text-xs font-semibold w-5 text-center">${item.quantity}</span>
          <button class="w-6 h-6 border border-hairline bg-white text-xs flex items-center justify-center hover:border-gold" onclick="updateSpecQty('${item.id}', ${item.quantity + 1})">+</button>
          <button class="ml-auto text-[10px] uppercase font-label tracking-wider text-secondary hover:text-ink" onclick="removeSpecItem('${item.id}')">Remove</button>
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
  store.clearSpecList();
};

/* ================= PUBLIC INQUIRY SUBMISSION ================= */
window.togglePill = function(btn) {
  if (btn.classList.contains('border-gold')) {
    btn.classList.remove('bg-gold-tint', 'border-gold', 'text-ink', 'font-semibold');
    btn.classList.add('bg-surface-low', 'border-hairline', 'text-on-surface');
  } else {
    btn.classList.remove('bg-surface-low', 'border-hairline', 'text-on-surface');
    btn.classList.add('bg-gold-tint', 'border-gold', 'text-ink', 'font-semibold');
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

  const systemsInterest = [];
  document.querySelectorAll('#inq-systems-selection .spec-pill.border-gold').forEach(pill => {
    systemsInterest.push(pill.textContent.trim());
  });

  const items = store.getSpecList();

  store.submitInquiry({
    contactName,
    contactEmail,
    projectLocation,
    projectType,
    openingsCount,
    finishPreference,
    systemsInterest,
    fileName: currentAttachedFileName || null,
    items,
    notes: `Submitted with ${items.length} door model(s) in schedule.`
  });

  const successMsg = document.getElementById('inq-success-msg');
  if (successMsg) successMsg.classList.remove('hidden');

  triggerToast('Quote Request Submitted');

  e.target.reset();
  currentAttachedFileName = '';
  document.getElementById('inq-file-display')?.classList.add('hidden');
  document.querySelectorAll('#inq-systems-selection .spec-pill').forEach(pill => {
    pill.classList.remove('bg-gold-tint', 'border-gold', 'text-ink', 'font-semibold');
    pill.classList.add('bg-surface-low', 'border-hairline', 'text-on-surface');
  });

  store.clearSpecList();
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
  }, 3200);
}
