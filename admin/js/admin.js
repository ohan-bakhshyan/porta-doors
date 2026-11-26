/**
 * PORTA Architectural Doors - Unified Admin Controller
 * Handles auth guards, relational catalog mutations, and UI synchronization.
 */

import { store } from '../../shared/js/store.js';
import { Utils } from '../../shared/js/utils.js';

/* ================= 1. AUTH GUARD & SESSION VERIFICATION ================= */
const currentSession = store.getCurrentSession();
if (!currentSession) {
  window.location.replace('login.html');
}

// Global modal temp state
let currentEditingDoorImages = [];
let pendingDeleteBrandId = null;
let pendingDeleteCategoryId = null;

// Initialize Admin UI
document.addEventListener('DOMContentLoaded', () => {
  initSessionDisplay();
  initTabNavigation();
  loadAllViews();

  // Listen to cross-tab store updates
  window.addEventListener('porta-store-updated', () => {
    loadAllViews();
  });
});

function initSessionDisplay() {
  const display = document.getElementById('admin-user-display');
  if (display && currentSession) {
    display.textContent = `Admin: ${currentSession.username}`;
  }

  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      store.logout();
      window.location.replace('login.html');
    });
  }
}

/* ================= 2. TAB NAVIGATION ================= */
window.switchTab = function(tabName) {
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));

  const targetPane = document.getElementById(`tab-${tabName}`);
  const targetNav = document.querySelector(`.nav-item[data-tab="${tabName}"]`);
  const titleEl = document.getElementById('current-tab-title');

  if (targetPane) targetPane.classList.add('active');
  if (targetNav) targetNav.classList.add('active');

  const titles = {
    dashboard: 'Overview',
    doors: 'Doors & Specifications',
    brands: 'Partner Brands',
    categories: 'Door Categories',
    systems: '8 Mechanical Typologies',
    promotions: 'Promotions & Product Groups',
    projects: 'Completed Case Studies',
    inquiries: 'Order Requests & Deal Pipeline',
    settings: 'Showroom Settings & Security'
  };
  if (titleEl) titleEl.textContent = titles[tabName] || 'Overview';
  if (typeof window.toggleAdminSidebar === 'function') window.toggleAdminSidebar(false);
};

function initTabNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const tab = item.getAttribute('data-tab');
      if (tab) switchTab(tab);
    });
  });
}

function loadAllViews() {
  updateDashboardKpis();
  renderDoorsTable();
  renderBrandsTable();
  renderCategoriesTable();
  renderSystemsTable();
  renderGroupsTable();
  renderPromosTable();
  renderProjectsTable();
  renderInquiriesTable();
  loadSettingsForm();
  updateBadgeCounts();
}

function updateBadgeCounts() {
  const doors = store.getDoors();
  const brands = store.getBrands();
  const cats = store.getCategories();
  const promos = store.getPromotions().filter(p => p.isActive);
  const projects = store.getProjects();
  const inquiries = store.getInquiries().filter(i => i.status === 'new');

  const setBadge = (id, count) => {
    const el = document.getElementById(id);
    if (el) el.textContent = count;
  };

  setBadge('badge-doors-count', doors.length);
  setBadge('badge-brands-count', brands.length);
  setBadge('badge-cats-count', cats.length);
  setBadge('badge-promos-count', promos.length);
  setBadge('badge-projects-count', projects.length);
  setBadge('badge-inquiries-count', inquiries.length);
}

function showToast(msg) {
  const toast = document.getElementById('admin-toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ================= 3. DASHBOARD OVERVIEW ================= */
function updateDashboardKpis() {
  const doors = store.getDoors();
  const brands = store.getBrands();
  const cats = store.getCategories();
  const promos = store.getPromotions().filter(p => p.isActive);
  const projects = store.getProjects();
  const inquiries = store.getInquiries();

  const setKpi = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setKpi('kpi-doors', doors.length);
  setKpi('kpi-brands', brands.length);
  setKpi('kpi-categories', cats.length);
  setKpi('kpi-promos', promos.length);
  setKpi('kpi-projects', projects.length);
  setKpi('kpi-inquiries', inquiries.filter(i => i.status === 'new').length);

  // Recent Inquiries Table
  const tbody = document.getElementById('dashboard-recent-inquiries');
  if (!tbody) return;
  const recent = inquiries.slice(0, 5);

  if (recent.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:24px; color:var(--color-secondary);">No inquiries received yet.</td></tr>';
    return;
  }

  tbody.innerHTML = recent.map(i => {
    const dealVal = Number(i.dealValue ?? i.totalEstimate) || 0;
    return `
    <tr>
      <td style="font-family:var(--font-mono); font-weight:600;">${Utils.escapeHtml(i.id)}</td>
      <td><strong>${Utils.escapeHtml(i.contactName || 'Client')}</strong></td>
      <td>${Utils.escapeHtml(i.projectType || 'Order Quote')}</td>
      <td>${Utils.escapeHtml(i.projectLocation || '—')}</td>
      <td style="font-family:var(--font-mono); font-weight:600; color:var(--color-gold-dark);">${Utils.formatCurrency(dealVal)}</td>
      <td>${renderStageBadge(i.status)}</td>
      <td style="font-family:var(--font-mono); font-size:11px;">${Utils.formatDate(i.createdAt)}</td>
    </tr>
  `}).join('');
}

/* ================= 4. DOORS MANAGEMENT ================= */
function renderDoorsTable() {
  const tbody = document.getElementById('doors-table-body');
  if (!tbody) return;

  // Populate filter dropdowns if empty
  populateDoorFilters();

  const search = document.getElementById('door-search')?.value || '';
  const brandId = document.getElementById('door-filter-brand')?.value || 'all';
  const categoryId = document.getElementById('door-filter-category')?.value || 'all';
  const systemId = document.getElementById('door-filter-system')?.value || 'all';
  const tag = document.getElementById('door-filter-tag')?.value || 'all';

  const doors = store.getDoors({
    search,
    brandId,
    categoryId,
    systemId,
    tag
  });

  if (doors.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; padding:32px; color:var(--color-secondary);">No doors found matching criteria.</td></tr>';
    return;
  }

  tbody.innerHTML = doors.map(door => {
    const brand = store.getBrandById(door.brandId);
    const system = store.getMechanicalSystemById(door.mechanicalSystemId);
    const priceInfo = store.calculateEffectivePrice(door);

    const primaryImg = (door.images || []).find(i => i.isPrimary)?.url || 
                       door.images?.[0]?.url || 
                       Utils.getArchitecturalPlaceholderSvg();

    const isNew = (door.tags || []).includes('New Arrival');
    const isBest = (door.tags || []).includes('Best Seller');

    return `
      <tr>
        <td>
          <img src="${primaryImg}" class="table-thumb" alt="${Utils.escapeHtml(door.name)}">
        </td>
        <td>
          <a href="../front/product.html?slug=${encodeURIComponent(door.slug)}" target="_blank" style="text-decoration:underline; color:var(--color-primary);"><strong>${Utils.escapeHtml(door.name)} ↗</strong></a>
          <div style="font-size:11px; color:var(--color-secondary); font-family:var(--font-mono);">${door.slug}</div>
        </td>
        <td style="font-family:var(--font-mono); font-weight:600;">${Utils.escapeHtml(door.sku)}</td>
        <td>
          ${brand ? `<a href="../front/brand.html?slug=${brand.slug}" target="_blank" style="text-decoration:underline;">${Utils.escapeHtml(brand.name)}</a>` : '—'}
        </td>
        <td style="font-size:11px; font-family:var(--font-mono);">${system ? Utils.escapeHtml(system.name) : '—'}</td>
        <td style="font-family:var(--font-mono);">${Utils.formatCurrency(door.basePrice)}</td>
        <td style="font-family:var(--font-mono);">
          ${priceInfo.hasDiscount ? `
            <span style="color:var(--color-gold-dark); font-weight:600;">${Utils.formatCurrency(priceInfo.effectivePrice)}</span>
            <div style="font-size:10px; color:var(--color-secondary); text-decoration:line-through;">${Utils.formatCurrency(door.basePrice)} (-${priceInfo.discountPercent}%)</div>
          ` : `<span>${Utils.formatCurrency(door.basePrice)}</span>`}
        </td>
        <td>
          <button class="tag-toggle-btn ${isNew ? 'active' : ''}" onclick="toggleDoorTag('${door.id}', 'New Arrival')">New Arrival</button>
          <button class="tag-toggle-btn ${isBest ? 'active' : ''}" onclick="toggleDoorTag('${door.id}', 'Best Seller')">Best Seller</button>
        </td>
        <td>
          <span class="status-pill ${door.isActive ? 'status-active' : 'status-inactive'}" style="cursor:pointer;" onclick="toggleDoorActive('${door.id}')">
            ${door.isActive ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-secondary btn-sm" onclick="editDoor('${door.id}')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteDoor('${door.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function populateDoorFilters() {
  const brandSelect = document.getElementById('door-filter-brand');
  const catSelect = document.getElementById('door-filter-category');
  const sysSelect = document.getElementById('door-filter-system');

  if (brandSelect && brandSelect.options.length <= 1) {
    store.getBrands().forEach(b => {
      brandSelect.innerHTML += `<option value="${b.id}">${b.name}</option>`;
    });
  }
  if (catSelect && catSelect.options.length <= 1) {
    store.getCategories().forEach(c => {
      catSelect.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
  }
  if (sysSelect && sysSelect.options.length <= 1) {
    store.getMechanicalSystems().forEach(s => {
      sysSelect.innerHTML += `<option value="${s.id}">${s.code} - ${s.name}</option>`;
    });
  }

  // Attach search listeners once
  const searchInput = document.getElementById('door-search');
  if (searchInput && !searchInput.dataset.listening) {
    searchInput.dataset.listening = 'true';
    searchInput.addEventListener('input', () => renderDoorsTable());
    brandSelect?.addEventListener('change', () => renderDoorsTable());
    catSelect?.addEventListener('change', () => renderDoorsTable());
    sysSelect?.addEventListener('change', () => renderDoorsTable());
    document.getElementById('door-filter-tag')?.addEventListener('change', () => renderDoorsTable());
  }
}

window.toggleDoorTag = function(id, tag) {
  store.toggleDoorTag(id, tag);
  renderDoorsTable();
  showToast(`Updated tag "${tag}"`);
};

window.toggleDoorActive = function(id) {
  const status = store.toggleDoorActive(id);
  renderDoorsTable();
  showToast(`Door status changed to ${status ? 'Active' : 'Inactive'}`);
};

window.deleteDoor = function(id) {
  const door = store.getDoorById(id);
  if (!door) return;
  if (confirm(`Are you sure you want to delete door "${door.name}"?`)) {
    store.deleteDoor(id);
    renderDoorsTable();
    updateBadgeCounts();
    showToast('Door removed from specification catalog.');
  }
};

/* Door Editor Modal */
window.openDoorModal = function(doorId = null) {
  const modal = document.getElementById('modal-door');
  const form = document.getElementById('door-form');
  form.reset();

  currentEditingDoorImages = [];

  // Populate Brand and System dropdowns
  const brandSelect = document.getElementById('door-brandId');
  const sysSelect = document.getElementById('door-systemId');
  const catChecklist = document.getElementById('door-categories-checklist');

  brandSelect.innerHTML = store.getBrands().map(b => `<option value="${b.id}">${b.name}</option>`).join('');
  sysSelect.innerHTML = store.getMechanicalSystems().map(s => `<option value="${s.id}">${s.code} — ${s.name}</option>`).join('');
  
  catChecklist.innerHTML = store.getCategories().map(c => `
    <label style="display:flex; align-items:center; gap:6px; font-size:12px; cursor:pointer;">
      <input type="checkbox" name="door-cat" value="${c.id}"> ${c.name}
    </label>
  `).join('');

  if (doorId) {
    const door = store.getDoorById(doorId);
    if (!door) return;
    document.getElementById('door-modal-title').textContent = `Edit Model: ${door.name}`;
    document.getElementById('door-id').value = door.id;
    document.getElementById('door-name').value = door.name || '';
    document.getElementById('door-sku').value = door.sku || '';
    document.getElementById('door-basePrice').value = door.basePrice || 0;
    document.getElementById('door-slug').value = door.slug || '';
    document.getElementById('door-brandId').value = door.brandId || '';
    document.getElementById('door-systemId').value = door.mechanicalSystemId || '';
    document.getElementById('door-shortDescription').value = door.shortDescription || '';
    document.getElementById('door-isActive').value = door.isActive !== false ? 'true' : 'false';

    // Merchandising tags
    document.getElementById('door-tag-newarrival').checked = (door.tags || []).includes('New Arrival');
    document.getElementById('door-tag-bestseller').checked = (door.tags || []).includes('Best Seller');

    // Categories
    (door.categoryIds || []).forEach(cid => {
      const cb = catChecklist.querySelector(`input[value="${cid}"]`);
      if (cb) cb.checked = true;
    });

    // Specs
    document.getElementById('door-spec-acoustic').value = door.specs?.acoustic || '';
    document.getElementById('door-spec-maxHeight').value = door.specs?.maxHeight || '';
    document.getElementById('door-spec-frame').value = door.specs?.frame || '';
    document.getElementById('door-spec-latches').value = door.specs?.latches || '';
    document.getElementById('door-spec-core').value = door.specs?.coreMaterial || '';
    document.getElementById('door-spec-finishes').value = (door.specs?.finishes || []).join(', ');
    document.getElementById('door-spec-lead').value = door.specs?.leadTime || '';

    // Images
    currentEditingDoorImages = JSON.parse(JSON.stringify(door.images || []));
  } else {
    document.getElementById('door-modal-title').textContent = 'Add New Architectural Door';
    document.getElementById('door-id').value = '';
    document.getElementById('door-isActive').value = 'true';
  }

  renderGalleryManager();
  modal.classList.add('open');
};

window.editDoor = function(id) {
  openDoorModal(id);
};

window.addImageFromUrl = function() {
  const urlInput = document.getElementById('door-new-img-url');
  const url = urlInput.value.trim();
  if (!url) return;

  const isFirst = currentEditingDoorImages.length === 0;
  currentEditingDoorImages.push({
    url,
    caption: 'Architectural Elevation',
    isPrimary: isFirst
  });
  urlInput.value = '';
  renderGalleryManager();
};

window.handleImageFileUpload = function(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const isFirst = currentEditingDoorImages.length === 0;
      currentEditingDoorImages.push({
        url: e.target.result,
        caption: file.name,
        isPrimary: isFirst
      });
      renderGalleryManager();
    };
    reader.readAsDataURL(file);
  }
};

window.setPrimaryImage = function(index) {
  currentEditingDoorImages.forEach((img, idx) => {
    img.isPrimary = (idx === index);
  });
  renderGalleryManager();
};

window.removeGalleryImage = function(index) {
  const wasPrimary = currentEditingDoorImages[index]?.isPrimary;
  currentEditingDoorImages.splice(index, 1);
  if (wasPrimary && currentEditingDoorImages.length > 0) {
    currentEditingDoorImages[0].isPrimary = true;
  }
  renderGalleryManager();
};

function renderGalleryManager() {
  const container = document.getElementById('door-gallery-container');
  if (!container) return;

  if (currentEditingDoorImages.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; font-size:12px; color:var(--color-secondary); padding:12px 0;">
        No images uploaded yet. Primary architectural portal placeholder will be used.
      </div>
    `;
    return;
  }

  container.innerHTML = currentEditingDoorImages.map((img, idx) => `
    <div class="gallery-item ${img.isPrimary ? 'is-primary' : ''}">
      <img src="${img.url}" class="gallery-thumb" alt="Preview">
      ${img.isPrimary ? '<span class="gallery-primary-badge">★ PRIMARY COVER</span>' : ''}
      <input type="text" class="form-control" style="font-size:10px; padding:4px;" value="${Utils.escapeHtml(img.caption || '')}" onchange="updateImageCaption(${idx}, this.value)" placeholder="Caption">
      <div class="gallery-actions">
        ${!img.isPrimary ? `<button type="button" class="btn btn-secondary btn-sm" style="font-size:8px; padding:3px 6px;" onclick="setPrimaryImage(${idx})">Set Primary</button>` : '<span></span>'}
        <button type="button" class="btn btn-danger btn-sm" style="font-size:8px; padding:3px 6px;" onclick="removeGalleryImage(${idx})">Remove</button>
      </div>
    </div>
  `).join('');
}

window.updateImageCaption = function(idx, val) {
  if (currentEditingDoorImages[idx]) {
    currentEditingDoorImages[idx].caption = val;
  }
};

window.handleDoorSubmit = function(e) {
  e.preventDefault();

  const id = document.getElementById('door-id').value;
  const name = document.getElementById('door-name').value.trim();
  const sku = document.getElementById('door-sku').value.trim();
  const basePrice = Number(document.getElementById('door-basePrice').value) || 0;
  const brandId = document.getElementById('door-brandId').value;
  const systemId = document.getElementById('door-systemId').value;
  const slug = document.getElementById('door-slug').value.trim();
  const shortDescription = document.getElementById('door-shortDescription').value.trim();
  const isActive = document.getElementById('door-isActive').value === 'true';

  // Tags
  const tags = [];
  if (document.getElementById('door-tag-newarrival').checked) tags.push('New Arrival');
  if (document.getElementById('door-tag-bestseller').checked) tags.push('Best Seller');

  // Categories
  const categoryIds = [];
  document.querySelectorAll('input[name="door-cat"]:checked').forEach(cb => {
    categoryIds.push(cb.value);
  });

  // Specs
  const finishes = document.getElementById('door-spec-finishes').value
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const specs = {
    acoustic: document.getElementById('door-spec-acoustic').value.trim(),
    maxHeight: document.getElementById('door-spec-maxHeight').value.trim(),
    frame: document.getElementById('door-spec-frame').value.trim(),
    latches: document.getElementById('door-spec-latches').value.trim(),
    coreMaterial: document.getElementById('door-spec-core').value.trim(),
    finishes: finishes.length > 0 ? finishes : ['Standard Millwork'],
    leadTime: document.getElementById('door-spec-lead').value.trim()
  };

  const doorPayload = {
    id: id || undefined,
    name,
    sku,
    basePrice,
    brandId,
    mechanicalSystemId: systemId,
    categoryIds,
    tags,
    shortDescription,
    images: currentEditingDoorImages,
    specs,
    isActive
  };
  if (slug) doorPayload.slug = slug;

  store.saveDoor(doorPayload);
  closeModal('modal-door');
  renderDoorsTable();
  updateBadgeCounts();
  showToast(`Door "${name}" saved successfully.`);
};

/* ================= 5. BRANDS MANAGEMENT ================= */
function renderBrandsTable() {
  const tbody = document.getElementById('brands-table-body');
  if (!tbody) return;

  const brands = store.getBrands();
  const doors = store.getDoors();

  tbody.innerHTML = brands.map(brand => {
    const attachedDoors = doors.filter(d => d.brandId === brand.id);
    return `
      <tr>
        <td>
          <strong>${Utils.escapeHtml(brand.name)}</strong>
        </td>
        <td style="font-family:var(--font-mono); font-size:11px;">${brand.slug}</td>
        <td><span class="status-pill status-active">${Utils.escapeHtml(brand.originCountry)}</span></td>
        <td style="max-width:320px; font-size:12px; color:var(--color-secondary);">${Utils.truncate(brand.bio, 120)}</td>
        <td>
          <a href="../front/brand.html?slug=${brand.slug}" target="_blank" style="text-decoration:underline; font-weight:600;">
            ${attachedDoors.length} Doors ↗
          </a>
        </td>
        <td>
          <span class="status-pill ${brand.isActive ? 'status-active' : 'status-inactive'}">
            ${brand.isActive ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-secondary btn-sm" onclick="editBrand('${brand.id}')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="promptDeleteBrand('${brand.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.openBrandModal = function(brandId = null) {
  const modal = document.getElementById('modal-brand');
  const form = document.getElementById('brand-form');
  form.reset();

  if (brandId) {
    const brand = store.getBrandById(brandId);
    if (!brand) return;
    document.getElementById('brand-modal-title').textContent = `Edit Brand: ${brand.name}`;
    document.getElementById('brand-id').value = brand.id;
    document.getElementById('brand-name').value = brand.name || '';
    document.getElementById('brand-slug').value = brand.slug || '';
    document.getElementById('brand-originCountry').value = brand.originCountry || '';
    document.getElementById('brand-heroBanner').value = brand.heroBanner || '';
    document.getElementById('brand-bio').value = brand.bio || '';
    document.getElementById('brand-isActive').value = brand.isActive !== false ? 'true' : 'false';
  } else {
    document.getElementById('brand-modal-title').textContent = 'Add Partner Brand';
    document.getElementById('brand-id').value = '';
    document.getElementById('brand-isActive').value = 'true';
  }
  modal.classList.add('open');
};

window.editBrand = function(id) {
  openBrandModal(id);
};

window.handleBrandSubmit = function(e) {
  e.preventDefault();
  const id = document.getElementById('brand-id').value;
  const name = document.getElementById('brand-name').value.trim();
  const slug = document.getElementById('brand-slug').value.trim();
  const originCountry = document.getElementById('brand-originCountry').value.trim();
  const heroBanner = document.getElementById('brand-heroBanner').value.trim();
  const bio = document.getElementById('brand-bio').value.trim();
  const isActive = document.getElementById('brand-isActive').value === 'true';

  store.saveBrand({
    id: id || undefined,
    name,
    slug: slug || undefined,
    originCountry,
    heroBanner,
    bio,
    isActive
  });

  closeModal('modal-brand');
  renderBrandsTable();
  updateBadgeCounts();
  showToast(`Brand "${name}" saved.`);
};

// Safe Brand Deletion Reassignment
window.promptDeleteBrand = function(brandId) {
  const brand = store.getBrandById(brandId);
  if (!brand) return;

  const doors = store.getDoors().filter(d => d.brandId === brandId);
  pendingDeleteBrandId = brandId;

  if (doors.length > 0) {
    const modal = document.getElementById('modal-brand-reassign');
    const warning = document.getElementById('brand-reassign-warning');
    const targetSelect = document.getElementById('brand-reassign-target');

    warning.innerHTML = `
      Brand <strong>${Utils.escapeHtml(brand.name)}</strong> has <strong>${doors.length} attached door(s)</strong>.
      To preserve architectural specification integrity, reassign these doors or set them to inactive.
    `;

    const otherBrands = store.getBrands().filter(b => b.id !== brandId);
    targetSelect.innerHTML = '<option value="">Deactivate doors (Do not reassign)</option>' +
      otherBrands.map(b => `<option value="${b.id}">Reassign to: ${b.name}</option>`).join('');

    modal.classList.add('open');

    document.getElementById('brand-confirm-delete-btn').onclick = () => {
      const reassignId = targetSelect.value || null;
      store.deleteBrand(brandId, reassignId);
      closeModal('modal-brand-reassign');
      renderBrandsTable();
      renderDoorsTable();
      updateBadgeCounts();
      showToast(`Brand deleted with door reassignment.`);
    };
  } else {
    if (confirm(`Delete brand "${brand.name}"?`)) {
      store.deleteBrand(brandId);
      renderBrandsTable();
      updateBadgeCounts();
      showToast('Brand deleted.');
    }
  }
};

/* ================= 6. CATEGORIES MANAGEMENT ================= */
function renderCategoriesTable() {
  const tbody = document.getElementById('categories-table-body');
  if (!tbody) return;

  const categories = store.getCategories();
  const doors = store.getDoors();

  tbody.innerHTML = categories.map(cat => {
    const attachedDoors = doors.filter(d => (d.categoryIds || []).includes(cat.id));
    return `
      <tr>
        <td style="font-family:var(--font-mono); font-weight:600;">${cat.sortOrder || 1}</td>
        <td><strong>${Utils.escapeHtml(cat.name)}</strong></td>
        <td style="font-family:var(--font-mono); font-size:11px;">${cat.slug}</td>
        <td style="max-width:300px; font-size:12px; color:var(--color-secondary);">${Utils.truncate(cat.description, 100)}</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="openCategoryDoorsModal('${cat.id}')">
            ${attachedDoors.length} Doors (Assign)
          </button>
        </td>
        <td>
          <span class="status-pill ${cat.isActive ? 'status-active' : 'status-inactive'}">
            ${cat.isActive ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-secondary btn-sm" onclick="editCategory('${cat.id}')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="promptDeleteCategory('${cat.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.openCategoryModal = function(catId = null) {
  const modal = document.getElementById('modal-category');
  const form = document.getElementById('category-form');
  form.reset();

  if (catId) {
    const cat = store.getCategoryById(catId);
    if (!cat) return;
    document.getElementById('cat-modal-title').textContent = `Edit Category: ${cat.name}`;
    document.getElementById('category-id').value = cat.id;
    document.getElementById('category-name').value = cat.name || '';
    document.getElementById('category-slug').value = cat.slug || '';
    document.getElementById('category-sortOrder').value = cat.sortOrder || 1;
    document.getElementById('category-coverImage').value = cat.coverImage || '';
    document.getElementById('category-description').value = cat.description || '';
    document.getElementById('category-isActive').value = cat.isActive !== false ? 'true' : 'false';
  } else {
    document.getElementById('cat-modal-title').textContent = 'Add Category';
    document.getElementById('category-id').value = '';
    document.getElementById('category-sortOrder').value = (store.getCategories().length + 1);
    document.getElementById('category-isActive').value = 'true';
  }
  modal.classList.add('open');
};

window.editCategory = function(id) {
  openCategoryModal(id);
};

window.handleCategorySubmit = function(e) {
  e.preventDefault();
  const id = document.getElementById('category-id').value;
  const name = document.getElementById('category-name').value.trim();
  const slug = document.getElementById('category-slug').value.trim();
  const sortOrder = Number(document.getElementById('category-sortOrder').value) || 1;
  const coverImage = document.getElementById('category-coverImage').value.trim();
  const description = document.getElementById('category-description').value.trim();
  const isActive = document.getElementById('category-isActive').value === 'true';

  store.saveCategory({
    id: id || undefined,
    name,
    slug: slug || undefined,
    sortOrder,
    coverImage,
    description,
    isActive
  });

  closeModal('modal-category');
  renderCategoriesTable();
  updateBadgeCounts();
  showToast(`Category "${name}" saved.`);
};

// Bidirectional door picker
window.openCategoryDoorsModal = function(catId) {
  const cat = store.getCategoryById(catId);
  if (!cat) return;

  const modal = document.getElementById('modal-category-doors');
  document.getElementById('cat-doors-modal-title').textContent = `Assign Doors: ${cat.name}`;
  const checklist = document.getElementById('cat-doors-checklist');

  const doors = store.getDoors();
  checklist.innerHTML = doors.map(d => {
    const isAssigned = (d.categoryIds || []).includes(catId);
    return `
      <label style="display:flex; align-items:center; gap:10px; padding:8px; background:var(--color-surface-low); cursor:pointer;">
        <input type="checkbox" name="cat-assign-door" value="${d.id}" ${isAssigned ? 'checked' : ''}>
        <div>
          <strong>${Utils.escapeHtml(d.name)}</strong>
          <span style="font-size:11px; color:var(--color-secondary); font-family:var(--font-mono);">(${d.sku})</span>
        </div>
      </label>
    `;
  }).join('');

  document.getElementById('cat-doors-save-btn').onclick = () => {
    const selectedDoorIds = [];
    document.querySelectorAll('input[name="cat-assign-door"]:checked').forEach(cb => {
      selectedDoorIds.push(cb.value);
    });
    store.assignDoorsToCategory(catId, selectedDoorIds);
    closeModal('modal-category-doors');
    renderCategoriesTable();
    renderDoorsTable();
    showToast(`Updated door assignments for "${cat.name}".`);
  };

  modal.classList.add('open');
};

// Safe Category Deletion Reassignment
window.promptDeleteCategory = function(catId) {
  const cat = store.getCategoryById(catId);
  if (!cat) return;

  const doors = store.getDoors().filter(d => (d.categoryIds || []).includes(catId));
  pendingDeleteCategoryId = catId;

  if (doors.length > 0) {
    const modal = document.getElementById('modal-category-reassign');
    const warning = document.getElementById('cat-reassign-warning');
    const targetSelect = document.getElementById('cat-reassign-target');

    warning.innerHTML = `
      Category <strong>${Utils.escapeHtml(cat.name)}</strong> is assigned to <strong>${doors.length} door(s)</strong>.
      Choose whether to reassign these doors to another category or unassign them safely.
    `;

    const otherCats = store.getCategories().filter(c => c.id !== catId);
    targetSelect.innerHTML = '<option value="">Unassign category from doors</option>' +
      otherCats.map(c => `<option value="${c.id}">Reassign to: ${c.name}</option>`).join('');

    modal.classList.add('open');

    document.getElementById('cat-confirm-delete-btn').onclick = () => {
      const reassignId = targetSelect.value || null;
      store.deleteCategory(catId, reassignId);
      closeModal('modal-category-reassign');
      renderCategoriesTable();
      renderDoorsTable();
      updateBadgeCounts();
      showToast(`Category deleted with door reassignment.`);
    };
  } else {
    if (confirm(`Delete category "${cat.name}"?`)) {
      store.deleteCategory(catId);
      renderCategoriesTable();
      updateBadgeCounts();
      showToast('Category deleted.');
    }
  }
};

/* ================= 7. STRICT 8 SYSTEMS ================= */
function renderSystemsTable() {
  const tbody = document.getElementById('systems-table-body');
  if (!tbody) return;

  const systems = store.getMechanicalSystems();
  tbody.innerHTML = systems.map(sys => `
    <tr>
      <td style="font-family:var(--font-mono); font-weight:600;">${sys.code}</td>
      <td style="width:70px; padding:10px;">
        <div style="width:50px; height:36px; display:flex; align-items:center; justify-content:center; background:var(--color-surface-low);">
          ${sys.svg || ''}
        </div>
      </td>
      <td><strong>${Utils.escapeHtml(sys.name)}</strong></td>
      <td style="font-family:var(--font-mono); font-size:12px;">${Utils.escapeHtml(sys.capacity)}</td>
      <td style="font-family:var(--font-mono); font-size:12px;">${Utils.escapeHtml(sys.maxHeight)}</td>
      <td style="font-size:12px;">${Utils.escapeHtml(sys.frameType || 'Concealed Subframe')}</td>
      <td style="max-width:260px; font-size:12px; color:var(--color-secondary);">${Utils.truncate(sys.description, 90)}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="editSystemPrompt('${sys.id}')">Edit Specs</button>
      </td>
    </tr>
  `).join('');
}

window.editSystemPrompt = function(sysId) {
  const sys = store.getMechanicalSystemById(sysId);
  if (!sys) return;
  const newCap = prompt(`Update load capacity for ${sys.name}:`, sys.capacity);
  if (newCap !== null) {
    const newMaxH = prompt(`Update Max Height / Span for ${sys.name}:`, sys.maxHeight);
    if (newMaxH !== null) {
      sys.capacity = newCap;
      sys.maxHeight = newMaxH;
      store.saveMechanicalSystem(sys);
      renderSystemsTable();
      showToast(`System ${sys.name} specifications updated.`);
    }
  }
};

/* ================= 8. PROMOTIONS & PRODUCT GROUPS ================= */
function renderGroupsTable() {
  const tbody = document.getElementById('groups-table-body');
  if (!tbody) return;

  const groups = store.getProductGroups();
  const doors = store.getDoors();

  if (groups.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:24px; color:var(--color-secondary);">No product groups defined.</td></tr>';
    return;
  }

  tbody.innerHTML = groups.map(grp => {
    const assignedDoors = doors.filter(d => (grp.doorIds || []).includes(d.id));
    return `
      <tr>
        <td><strong>${Utils.escapeHtml(grp.name)}</strong></td>
        <td style="font-size:12px; color:var(--color-secondary);">${Utils.truncate(grp.description, 100)}</td>
        <td>
          <span class="status-pill status-active">${assignedDoors.length} Doors</span>
          <span style="font-size:11px; color:var(--color-secondary); margin-left:6px;">(${assignedDoors.map(d => d.sku).join(', ')})</span>
        </td>
        <td>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-secondary btn-sm" onclick="openGroupModal('${grp.id}')">Edit Group</button>
            <button class="btn btn-danger btn-sm" onclick="deleteGroup('${grp.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.openGroupModal = function(groupId = null) {
  const modal = document.getElementById('modal-group');
  const form = document.getElementById('group-form');
  form.reset();

  const checklist = document.getElementById('group-doors-checklist');
  const doors = store.getDoors();

  if (groupId) {
    const grp = store.getProductGroupById(groupId);
    if (!grp) return;
    document.getElementById('group-modal-title').textContent = `Edit Group: ${grp.name}`;
    document.getElementById('group-id').value = grp.id;
    document.getElementById('group-name').value = grp.name || '';
    document.getElementById('group-description').value = grp.description || '';

    checklist.innerHTML = doors.map(d => {
      const isChecked = (grp.doorIds || []).includes(d.id);
      return `
        <label style="display:flex; align-items:center; gap:8px; font-size:12px; cursor:pointer;">
          <input type="checkbox" name="group-door-item" value="${d.id}" ${isChecked ? 'checked' : ''}>
          <span><strong>${Utils.escapeHtml(d.name)}</strong> (${d.sku}) — ${Utils.formatCurrency(d.basePrice)}</span>
        </label>
      `;
    }).join('');
  } else {
    document.getElementById('group-modal-title').textContent = 'Create Product Group';
    document.getElementById('group-id').value = '';
    checklist.innerHTML = doors.map(d => `
      <label style="display:flex; align-items:center; gap:8px; font-size:12px; cursor:pointer;">
        <input type="checkbox" name="group-door-item" value="${d.id}">
        <span><strong>${Utils.escapeHtml(d.name)}</strong> (${d.sku}) — ${Utils.formatCurrency(d.basePrice)}</span>
      </label>
    `).join('');
  }
  modal.classList.add('open');
};

window.handleGroupSubmit = function(e) {
  e.preventDefault();
  const id = document.getElementById('group-id').value;
  const name = document.getElementById('group-name').value.trim();
  const description = document.getElementById('group-description').value.trim();

  const doorIds = [];
  document.querySelectorAll('input[name="group-door-item"]:checked').forEach(cb => {
    doorIds.push(cb.value);
  });

  store.saveProductGroup({
    id: id || undefined,
    name,
    description,
    doorIds
  });

  closeModal('modal-group');
  renderGroupsTable();
  renderDoorsTable();
  showToast(`Product Group "${name}" saved.`);
};

window.deleteGroup = function(id) {
  const grp = store.getProductGroupById(id);
  if (!grp) return;
  if (confirm(`Delete group "${grp.name}"?`)) {
    store.deleteProductGroup(id);
    renderGroupsTable();
    renderDoorsTable();
    showToast('Group deleted.');
  }
};

/* Promotions */
function renderPromosTable() {
  const tbody = document.getElementById('promos-table-body');
  if (!tbody) return;

  const promos = store.getPromotions();
  if (promos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:24px; color:var(--color-secondary);">No promotional campaigns configured.</td></tr>';
    return;
  }

  tbody.innerHTML = promos.map(promo => {
    let targetNames = [];
    if (promo.targetType === 'category') {
      targetNames = (promo.targetIds || []).map(id => store.getCategoryById(id)?.name || id);
    } else if (promo.targetType === 'group') {
      targetNames = (promo.targetIds || []).map(id => store.getProductGroupById(id)?.name || id);
    }

    const discountText = promo.discountType === 'percentage' 
      ? `${promo.discountValue}% OFF` 
      : `-$${promo.discountValue} FLAT`;

    const validity = (promo.startDate || promo.endDate) 
      ? `${promo.startDate || 'Now'} to ${promo.endDate || 'Ongoing'}` 
      : 'Permanent';

    return `
      <tr>
        <td><strong>${Utils.escapeHtml(promo.name)}</strong></td>
        <td><span class="status-pill status-tag">${discountText}</span></td>
        <td style="text-transform:uppercase; font-size:11px;">${promo.targetType}</td>
        <td style="font-size:12px;">${targetNames.join(', ') || 'None selected'}</td>
        <td style="font-family:var(--font-mono); font-size:11px;">${validity}</td>
        <td>
          <span class="status-pill ${promo.isActive ? 'status-active' : 'status-inactive'}">
            ${promo.isActive ? 'Active' : 'Paused'}
          </span>
        </td>
        <td>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-secondary btn-sm" onclick="openPromoModal('${promo.id}')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deletePromo('${promo.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.renderPromoTargetChecklist = function(selectedTargetIds = []) {
  const targetType = document.getElementById('promo-targetType').value;
  const container = document.getElementById('promo-target-checklist');
  if (!container) return;

  if (targetType === 'group') {
    const groups = store.getProductGroups();
    container.innerHTML = groups.length > 0 ? groups.map(g => `
      <label style="display:flex; align-items:center; gap:6px; font-size:12px; cursor:pointer;">
        <input type="checkbox" name="promo-target-item" value="${g.id}" ${selectedTargetIds.includes(g.id) ? 'checked' : ''}>
        ${Utils.escapeHtml(g.name)}
      </label>
    `).join('') : '<span style="font-size:12px; color:var(--color-secondary);">No groups created yet.</span>';
  } else {
    const cats = store.getCategories();
    container.innerHTML = cats.map(c => `
      <label style="display:flex; align-items:center; gap:6px; font-size:12px; cursor:pointer;">
        <input type="checkbox" name="promo-target-item" value="${c.id}" ${selectedTargetIds.includes(c.id) ? 'checked' : ''}>
        ${Utils.escapeHtml(c.name)}
      </label>
    `).join('');
  }
};

window.openPromoModal = function(promoId = null) {
  const modal = document.getElementById('modal-promo');
  const form = document.getElementById('promo-form');
  form.reset();

  if (promoId) {
    const promo = store.getPromotionById(promoId);
    if (!promo) return;
    document.getElementById('promo-modal-title').textContent = `Edit Campaign: ${promo.name}`;
    document.getElementById('promo-id').value = promo.id;
    document.getElementById('promo-name').value = promo.name || '';
    document.getElementById('promo-discountType').value = promo.discountType || 'percentage';
    document.getElementById('promo-discountValue').value = promo.discountValue || 10;
    document.getElementById('promo-targetType').value = promo.targetType || 'group';
    document.getElementById('promo-isActive').value = promo.isActive !== false ? 'true' : 'false';
    document.getElementById('promo-startDate').value = promo.startDate || '';
    document.getElementById('promo-endDate').value = promo.endDate || '';

    renderPromoTargetChecklist(promo.targetIds || []);
  } else {
    document.getElementById('promo-modal-title').textContent = 'Create Promotional Action';
    document.getElementById('promo-id').value = '';
    document.getElementById('promo-discountType').value = 'percentage';
    document.getElementById('promo-targetType').value = 'group';
    document.getElementById('promo-isActive').value = 'true';
    renderPromoTargetChecklist([]);
  }
  modal.classList.add('open');
};

window.handlePromoSubmit = function(e) {
  e.preventDefault();
  const id = document.getElementById('promo-id').value;
  const name = document.getElementById('promo-name').value.trim();
  const discountType = document.getElementById('promo-discountType').value;
  const discountValue = Number(document.getElementById('promo-discountValue').value) || 0;
  const targetType = document.getElementById('promo-targetType').value;
  const isActive = document.getElementById('promo-isActive').value === 'true';
  const startDate = document.getElementById('promo-startDate').value;
  const endDate = document.getElementById('promo-endDate').value;

  const targetIds = [];
  document.querySelectorAll('input[name="promo-target-item"]:checked').forEach(cb => {
    targetIds.push(cb.value);
  });

  store.savePromotion({
    id: id || undefined,
    name,
    discountType,
    discountValue,
    targetType,
    targetIds,
    isActive,
    startDate,
    endDate
  });

  closeModal('modal-promo');
  renderPromosTable();
  renderDoorsTable();
  updateBadgeCounts();
  showToast(`Promotion "${name}" applied.`);
};

window.deletePromo = function(id) {
  const promo = store.getPromotionById(id);
  if (!promo) return;
  if (confirm(`Delete promotion "${promo.name}"?`)) {
    store.deletePromotion(id);
    renderPromosTable();
    renderDoorsTable();
    updateBadgeCounts();
    showToast('Promotion removed.');
  }
};

/* ================= 9. COMPLETED CASE STUDIES ================= */
function renderProjectsTable() {
  const tbody = document.getElementById('projects-table-body');
  if (!tbody) return;

  const projects = store.getProjects();
  if (projects.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:24px; color:var(--color-secondary);">No completed projects added.</td></tr>';
    return;
  }

  tbody.innerHTML = projects.map(p => {
    const primaryImg = (p.images || [])[0]?.url || Utils.getArchitecturalPlaceholderSvg();
    const systemNames = (p.installedSystemIds || []).map(sid => store.getMechanicalSystemById(sid)?.name || sid);

    return `
      <tr>
        <td><img src="${primaryImg}" class="table-thumb" alt="${Utils.escapeHtml(p.title)}"></td>
        <td><strong>${Utils.escapeHtml(p.title)}</strong></td>
        <td>${Utils.escapeHtml(p.architectStudio || '—')}</td>
        <td>${Utils.escapeHtml(p.location)}</td>
        <td><span class="status-pill status-active">${p.clientType || 'Architect'}</span></td>
        <td style="font-size:11px;">${systemNames.join(', ') || 'Custom Flush'}</td>
        <td style="max-width:240px; font-size:12px; font-style:italic;">${Utils.truncate(p.clientQuote, 80)}</td>
        <td>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-secondary btn-sm" onclick="openProjectModal('${p.id}')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteProject('${p.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.openProjectModal = function(projId = null) {
  const modal = document.getElementById('modal-project');
  const form = document.getElementById('project-form');
  form.reset();

  const systemsChecklist = document.getElementById('project-systems-checklist');
  const allSystems = store.getMechanicalSystems();

  if (projId) {
    const proj = store.getProjectById(projId);
    if (!proj) return;
    document.getElementById('project-modal-title').textContent = `Edit Case Study: ${proj.title}`;
    document.getElementById('project-id').value = proj.id;
    document.getElementById('project-title').value = proj.title || '';
    document.getElementById('project-architectStudio').value = proj.architectStudio || '';
    document.getElementById('project-location').value = proj.location || '';
    document.getElementById('project-clientType').value = proj.clientType || 'Architect';
    document.getElementById('project-scale').value = proj.scale || '';
    document.getElementById('project-imageUrl').value = proj.images?.[0]?.url || '';
    document.getElementById('project-clientQuote').value = proj.clientQuote || '';
    document.getElementById('project-clientName').value = proj.clientName || '';

    systemsChecklist.innerHTML = allSystems.map(s => {
      const isChecked = (proj.installedSystemIds || []).includes(s.id);
      return `
        <label style="display:flex; align-items:center; gap:6px; font-size:12px; cursor:pointer;">
          <input type="checkbox" name="proj-sys-item" value="${s.id}" ${isChecked ? 'checked' : ''}>
          ${s.name}
        </label>
      `;
    }).join('');
  } else {
    document.getElementById('project-modal-title').textContent = 'Add Architectural Case Study';
    document.getElementById('project-id').value = '';
    systemsChecklist.innerHTML = allSystems.map(s => `
      <label style="display:flex; align-items:center; gap:6px; font-size:12px; cursor:pointer;">
        <input type="checkbox" name="proj-sys-item" value="${s.id}">
        ${s.name}
      </label>
    `).join('');
  }
  modal.classList.add('open');
};

window.handleProjectSubmit = function(e) {
  e.preventDefault();
  const id = document.getElementById('project-id').value;
  const title = document.getElementById('project-title').value.trim();
  const architectStudio = document.getElementById('project-architectStudio').value.trim();
  const location = document.getElementById('project-location').value.trim();
  const clientType = document.getElementById('project-clientType').value;
  const scale = document.getElementById('project-scale').value.trim();
  const imageUrl = document.getElementById('project-imageUrl').value.trim();
  const clientQuote = document.getElementById('project-clientQuote').value.trim();
  const clientName = document.getElementById('project-clientName').value.trim();

  const installedSystemIds = [];
  document.querySelectorAll('input[name="proj-sys-item"]:checked').forEach(cb => {
    installedSystemIds.push(cb.value);
  });

  store.saveProject({
    id: id || undefined,
    title,
    architectStudio,
    location,
    clientType,
    scale,
    clientQuote,
    clientName,
    installedSystemIds,
    images: [{ url: imageUrl, caption: title, isPrimary: true }]
  });

  closeModal('modal-project');
  renderProjectsTable();
  updateBadgeCounts();
  showToast(`Case study "${title}" saved.`);
};

window.deleteProject = function(id) {
  const proj = store.getProjectById(id);
  if (!proj) return;
  if (confirm(`Delete case study "${proj.title}"?`)) {
    store.deleteProject(id);
    renderProjectsTable();
    updateBadgeCounts();
    showToast('Case study deleted.');
  }
};

/* ================= 10. ORDER REQUESTS & DEAL PIPELINE ================= */
const PIPELINE_STAGES = [
  { key: 'new', label: 'New Request' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'quoted', label: 'Quote Sent' },
  { key: 'negotiation', label: 'Negotiation' },
  { key: 'won', label: 'Deal Won ✓' },
  { key: 'lost', label: 'Closed Lost' }
];

let activePipelineFilter = 'all';

function getStageLabel(status) {
  return PIPELINE_STAGES.find(s => s.key === status)?.label || (status || 'new').toUpperCase();
}

function renderStageBadge(status) {
  const st = status || 'new';
  return `<span class="stage-badge stage-${Utils.escapeHtml(st)}">${Utils.escapeHtml(getStageLabel(st))}</span>`;
}

window.filterPipelineStage = function(stageKey) {
  activePipelineFilter = stageKey;
  document.querySelectorAll('#pipeline-stage-filters .pipeline-filter-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.stage === stageKey);
  });
  renderInquiriesTable();
};

function computeInquiryValue(inq) {
  if (inq.dealValue !== undefined && inq.dealValue !== null) return Number(inq.dealValue) || 0;
  if (inq.totalEstimate !== undefined && inq.totalEstimate !== null) return Number(inq.totalEstimate) || 0;
  return (inq.items || []).reduce((sum, it) => sum + ((Number(it.effectivePrice || it.basePrice) || 0) * (Number(it.quantity) || 1)), 0);
}

function updatePipelineKpis(allInquiries) {
  const newCount = allInquiries.filter(i => (i.status || 'new') === 'new').length;
  const activeStages = ['contacted', 'quoted', 'negotiation'];
  const activeList = allInquiries.filter(i => activeStages.includes(i.status));
  const openDeals = allInquiries.filter(i => !['won', 'lost'].includes(i.status || 'new'));
  const wonDeals = allInquiries.filter(i => i.status === 'won');

  const openVal = openDeals.reduce((s, i) => s + computeInquiryValue(i), 0);
  const wonVal = wonDeals.reduce((s, i) => s + computeInquiryValue(i), 0);

  const setEl = (id, txt) => {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
  };
  setEl('pipe-kpi-new', newCount);
  setEl('pipe-kpi-active', activeList.length);
  setEl('pipe-kpi-open-val', Utils.formatCurrency(openVal));
  setEl('pipe-kpi-won-val', `${Utils.formatCurrency(wonVal)} (${wonDeals.length})`);
}

function renderInquiriesTable() {
  const tbody = document.getElementById('inquiries-table-body');
  if (!tbody) return;

  const allInquiries = store.getInquiries();
  updatePipelineKpis(allInquiries);

  const searchQ = (document.getElementById('pipeline-search-input')?.value || '').toLowerCase().trim();

  const filtered = allInquiries.filter(inq => {
    const st = inq.status || 'new';
    if (activePipelineFilter !== 'all' && st !== activePipelineFilter) return false;
    if (searchQ) {
      const itemSkus = (inq.items || []).map(it => `${it.sku || ''} ${it.doorName || it.name || ''}`).join(' ').toLowerCase();
      const hay = `${inq.id} ${inq.contactName || ''} ${inq.contactEmail || ''} ${inq.contactPhone || ''} ${inq.projectLocation || ''} ${itemSkus}`.toLowerCase();
      if (!hay.includes(searchQ)) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:28px; color:var(--color-secondary);">No order requests found in this pipeline stage.</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(inq => {
    const dealVal = computeInquiryValue(inq);
    const totalDoors = (inq.items || []).reduce((s, it) => s + (Number(it.quantity) || 1), 0);
    const firstItem = (inq.items || [])[0];
    const itemsSummary = firstItem
      ? `<strong>${Utils.escapeHtml(firstItem.doorName || firstItem.name)}</strong> ${inq.items.length > 1 ? `+${inq.items.length - 1} more` : ''}<div style="font-size:10px; color:var(--color-secondary);">${totalDoors} door(s) ${firstItem.dimensions ? `• ${Utils.escapeHtml(firstItem.dimensions)}` : ''}</div>`
      : `<span style="color:var(--color-secondary); font-size:11px;">Custom Spec (${Utils.escapeHtml(inq.openingsCount || 'TBD')})</span>`;

    return `
      <tr>
        <td>
          <div style="font-family:var(--font-mono); font-weight:600; color:var(--color-primary);">${Utils.escapeHtml(inq.id)}</div>
          <span class="stage-badge stage-${Utils.escapeHtml(inq.status || 'new')}" style="margin-top:3px;">${Utils.escapeHtml(getStageLabel(inq.status || 'new'))}</span>
        </td>
        <td style="font-family:var(--font-mono); font-size:11px;">${Utils.formatDate(inq.createdAt)}</td>
        <td>
          <strong>${Utils.escapeHtml(inq.contactName || 'Customer')}</strong>
          <div style="font-size:11px; color:var(--color-secondary);">${Utils.escapeHtml(inq.contactPhone || '')} ${inq.contactPhone && inq.contactEmail ? '•' : ''} ${Utils.escapeHtml(inq.contactEmail || '')}</div>
        </td>
        <td>
          <div>${Utils.escapeHtml(inq.projectLocation || '—')}</div>
          <div style="font-size:10px; color:var(--color-secondary);">${Utils.escapeHtml(inq.deliveryMethod || inq.projectType || 'Standard')}</div>
        </td>
        <td>${itemsSummary}</td>
        <td style="font-family:var(--font-mono); font-weight:600; color:var(--color-gold-dark);">
          ${Utils.formatCurrency(dealVal)}
        </td>
        <td>
          <select class="pipeline-select" onchange="quickChangePipelineStage('${inq.id}', this.value)">
            ${PIPELINE_STAGES.map(st => `<option value="${st.key}" ${(inq.status || 'new') === st.key ? 'selected' : ''}>${st.label}</option>`).join('')}
          </select>
        </td>
        <td>
          <div style="display:flex; gap:5px; flex-wrap:wrap;">
            <button class="btn btn-secondary btn-sm" onclick="viewInquiryDossier('${inq.id}')">Manage Deal</button>
            ${inq.status !== 'won' ? `<button class="btn btn-primary btn-sm" onclick="quickChangePipelineStage('${inq.id}', 'won')" title="Mark Deal Closed Won">✓ Win</button>` : ''}
            <button class="btn btn-danger btn-sm" onclick="deleteInquiry('${inq.id}')" title="Delete">✕</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.quickChangePipelineStage = function(id, newStatus) {
  store.updateInquiryStatus(id, newStatus, `Stage changed to ${getStageLabel(newStatus)}`);
  renderInquiriesTable();
  updateDashboardKpis();
  updateBadgeCounts();
  showToast(`Order ${id} moved to "${getStageLabel(newStatus)}"`);
};

window.viewInquiryDossier = function(id) {
  const inq = store.getInquiries().find(i => i.id === id);
  if (!inq) return;

  const modal = document.getElementById('modal-inquiry');
  const titleEl = document.getElementById('inquiry-modal-title');
  const body = document.getElementById('inquiry-modal-body');
  if (titleEl) titleEl.textContent = `Order Request & Deal Dossier — ${inq.id}`;

  const dealVal = computeInquiryValue(inq);

  const itemsHtml = (inq.items || []).map(item => {
    const unitPrice = Number(item.effectivePrice || item.basePrice) || 0;
    const qty = Number(item.quantity) || 1;
    return `
      <div style="display:flex; gap:12px; justify-content:space-between; padding:10px; background:var(--color-surface-low); border:1px solid var(--color-outline-variant); margin-bottom:8px;">
        <div style="display:flex; gap:10px; align-items:flex-start;">
          ${item.primaryImage ? `<img src="${item.primaryImage}" style="width:42px; height:52px; object-fit:cover; border:1px solid var(--color-outline-variant);">` : ''}
          <div>
            <strong>${Utils.escapeHtml(item.doorName || item.name || 'Door Model')}</strong>
            <span style="font-family:var(--font-mono); font-size:11px; color:var(--color-secondary);">(${Utils.escapeHtml(item.sku || 'SKU')})</span>
            <div style="font-size:11px; color:var(--color-on-surface-variant); margin-top:2px;">
              Qty: <strong>${qty}</strong> × ${Utils.formatCurrency(unitPrice)}
              ${item.dimensions ? ` • Size: <strong>${Utils.escapeHtml(item.dimensions)}</strong>` : ''}
              • Finish: <strong>${Utils.escapeHtml(item.finish || 'Standard')}</strong>
            </div>
            ${(item.systemName || item.frameOption || item.handing) ? `
              <div style="font-size:10px; color:var(--color-secondary); margin-top:2px;">
                ${item.systemName ? `System: ${Utils.escapeHtml(item.systemName)}` : ''}
                ${item.frameOption ? ` | ${Utils.escapeHtml(item.frameOption)}` : ''}
                ${item.handing ? ` | ${Utils.escapeHtml(item.handing)}` : ''}
              </div>
            ` : ''}
          </div>
        </div>
        <div style="font-family:var(--font-mono); font-weight:600; color:var(--color-gold-dark); white-space:nowrap;">
          ${Utils.formatCurrency(unitPrice * qty)}
        </div>
      </div>
    `;
  }).join('');

  const historyHtml = (inq.stageHistory || []).map(h => `
    <div style="display:flex; justify-content:space-between; font-size:11px; padding:4px 0; border-bottom:1px dashed var(--color-outline-variant);">
      <span><strong>${Utils.escapeHtml(getStageLabel(h.status))}</strong> — ${Utils.escapeHtml(h.note || '')}</span>
      <span style="font-family:var(--font-mono); color:var(--color-secondary);">${Utils.formatDate(h.timestamp)}</span>
    </div>
  `).join('');

  body.innerHTML = `
    <div class="form-grid" style="margin-bottom:16px;">
      <div style="padding:12px; background:var(--color-surface-low); border:1px solid var(--color-outline-variant);">
        <label class="form-label">Customer Details</label>
        <div style="font-size:14px; font-weight:600; color:var(--color-primary); margin-top:3px;">${Utils.escapeHtml(inq.contactName || 'Customer')}</div>
        <div style="font-size:12px; margin-top:3px;">
          ${inq.contactPhone ? `<a href="tel:${inq.contactPhone}" style="color:var(--color-gold-dark); font-weight:600;">${Utils.escapeHtml(inq.contactPhone)}</a> • ` : ''}
          <a href="mailto:${Utils.escapeHtml(inq.contactEmail || '')}" style="text-decoration:underline;">${Utils.escapeHtml(inq.contactEmail || '')}</a>
        </div>
        <div style="font-size:11px; color:var(--color-secondary); margin-top:3px;">Role: ${Utils.escapeHtml(inq.clientRole || inq.projectType || 'Direct Client')}</div>
      </div>

      <div style="padding:12px; background:var(--color-surface-low); border:1px solid var(--color-outline-variant);">
        <label class="form-label">Fulfillment & Location</label>
        <div style="font-size:13px; font-weight:600; margin-top:3px;">${Utils.escapeHtml(inq.projectLocation || 'Unspecified')}</div>
        <div style="font-size:12px; color:var(--color-on-surface-variant); margin-top:3px;">Method: ${Utils.escapeHtml(inq.deliveryMethod || 'Standard Delivery')}</div>
        <div style="font-size:11px; color:var(--color-secondary); margin-top:3px;">Submitted: ${Utils.formatDate(inq.createdAt)} ${inq.source ? `(${Utils.escapeHtml(inq.source)})` : ''}</div>
      </div>
    </div>

    ${inq.fileName ? `
      <div style="padding:8px 12px; background:var(--color-gold-tint); border:1px solid var(--color-gold); margin-bottom:14px; font-size:12px;">
        <strong>Attached Schedule:</strong> <code>${Utils.escapeHtml(inq.fileName)}</code>
      </div>
    ` : ''}

    <div style="margin-bottom:16px;">
      <label class="form-label">Configured Door Items</label>
      <div style="margin-top:6px;">${itemsHtml || '<div style="color:var(--color-secondary); font-size:12px;">General quote inquiry (no specific slab pre-selected).</div>'}</div>
    </div>

    <div style="margin-bottom:16px;">
      <label class="form-label">Customer Request Notes</label>
      <div style="font-size:12px; line-height:1.5; padding:10px; background:var(--color-surface-low); border:1px solid var(--color-outline-variant);">
        ${Utils.escapeHtml(inq.notes || 'No custom notes provided.')}
      </div>
    </div>

    <!-- Deal Pipeline Controls -->
    <div style="padding:14px; background:var(--color-gold-tint); border:1px solid var(--color-gold); margin-bottom:14px;">
      <div style="font-family:var(--font-headline); font-size:12px; font-weight:600; text-transform:uppercase; color:var(--color-primary); margin-bottom:10px;">
        Process Deal Pipeline
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Pipeline Status</label>
          <select id="dossier-stage-select" class="form-control">
            ${PIPELINE_STAGES.map(st => `<option value="${st.key}" ${(inq.status || 'new') === st.key ? 'selected' : ''}>${st.label}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Confirmed Deal Value ($)</label>
          <input type="number" id="dossier-deal-value" class="form-control" min="0" value="${dealVal}">
        </div>
        <div class="form-group form-full">
          <label class="form-label">Internal Sales / Closing Notes</label>
          <textarea id="dossier-admin-notes" class="form-control" rows="2" placeholder="Add quote follow-up notes, rough opening verification, deposit or invoice ref...">${Utils.escapeHtml(inq.adminNotes || '')}</textarea>
        </div>
      </div>
    </div>

    ${historyHtml ? `
      <div>
        <label class="form-label">Pipeline History</label>
        <div style="margin-top:4px; max-height:110px; overflow-y:auto;">${historyHtml}</div>
      </div>
    ` : ''}
  `;

  const saveDossier = (forcedStatus = null) => {
    const selectedStatus = forcedStatus || document.getElementById('dossier-stage-select').value;
    const updatedVal = Number(document.getElementById('dossier-deal-value').value) || 0;
    const adminNotes = document.getElementById('dossier-admin-notes').value.trim();

    store.updateInquiryDetails(id, {
      status: selectedStatus,
      dealValue: updatedVal,
      adminNotes,
      stageNote: forcedStatus === 'won'
        ? `Deal closed WON at ${Utils.formatCurrency(updatedVal)}`
        : `Updated stage to ${getStageLabel(selectedStatus)} (${Utils.formatCurrency(updatedVal)})`
    });

    closeModal('modal-inquiry');
    renderInquiriesTable();
    updateDashboardKpis();
    updateBadgeCounts();
    showToast(forcedStatus === 'won' ? `Deal ${id} Closed WON!` : `Order ${id} pipeline updated.`);
  };

  document.getElementById('inquiry-save-btn').onclick = () => saveDossier(null);
  const winBtn = document.getElementById('inquiry-win-btn');
  if (winBtn) {
    winBtn.style.display = inq.status === 'won' ? 'none' : 'inline-flex';
    winBtn.onclick = () => saveDossier('won');
  }

  modal.classList.add('open');
};

window.deleteInquiry = function(id) {
  if (confirm(`Remove order request ${id}?`)) {
    store.deleteInquiry(id);
    renderInquiriesTable();
    updateDashboardKpis();
    updateBadgeCounts();
    showToast('Order request removed.');
  }
};

/* ================= 11. SETTINGS, 3 HERO BANNERS & ACCOUNT ================= */
window.toggleAdminSidebar = function(forceState) {
  const sidebar = document.getElementById('admin-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!sidebar) return;
  const shouldOpen = forceState !== undefined ? forceState : !sidebar.classList.contains('open');
  sidebar.classList.toggle('open', shouldOpen);
  if (overlay) overlay.classList.toggle('open', shouldOpen);
};

window.handleLogoFileUpload = function(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const logoField = document.getElementById('setting-logoUrl');
      if (logoField) logoField.value = e.target.result;
      showToast('Logo image loaded — click Save All Settings to apply.');
    };
    reader.readAsDataURL(input.files[0]);
  }
};

function loadSettingsForm() {
  const settings = store.getSettings();

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val ?? '';
  };

  setVal('setting-companyName', settings.companyName);
  setVal('setting-tagline', settings.tagline);
  setVal('setting-phone', settings.phone);
  setVal('setting-email', settings.email);
  setVal('setting-logoUrl', settings.logoUrl || '../shared/assets/logo-mark.png');
  setVal('setting-certifications', settings.certifications);
  setVal('setting-heroAutoplayMs', settings.heroAutoplayMs || 5000);

  const sidebarLogo = document.getElementById('admin-sidebar-logo');
  if (sidebarLogo && settings.logoUrl) sidebarLogo.src = settings.logoUrl;

  // Render 3 Rotating Hero Banners Editor
  const bannersEditor = document.getElementById('admin-hero-banners-editor');
  const banners = Array.isArray(settings.heroBanners) && settings.heroBanners.length === 3
    ? settings.heroBanners
    : [
        settings.heroBanners?.[0] || { id: 'banner-1', badge: 'SERIES 01', headline: settings.hero?.headline || 'Frameless & Flush Doors', subheadline: settings.hero?.subheadline || '', imageUrl: settings.hero?.imageUrl || '', ctaText: 'Explore Doors', ctaLink: 'catalog.html' },
        settings.heroBanners?.[1] || { id: 'banner-2', badge: 'SERIES 02', headline: 'Precision Sliding & Pocket Systems', subheadline: 'Acoustic wood and fluted glass doors.', imageUrl: '', ctaText: 'Best Sellers', ctaLink: '#bestsellers' },
        settings.heroBanners?.[2] || { id: 'banner-3', badge: 'SERIES 03', headline: 'Custom Millwork & Trade Pricing', subheadline: 'Direct specification schedules.', imageUrl: '', ctaText: 'Request Quote', ctaLink: '#inquiry' }
      ];

  if (bannersEditor) {
    bannersEditor.innerHTML = banners.map((b, idx) => `
      <div class="banner-editor-card">
        <div style="font-family:var(--font-headline); font-size:12px; font-weight:600; text-transform:uppercase; color:var(--color-gold-dark); margin-bottom:10px;">
          Banner Slide ${idx + 1} of 3
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Top Badge Text</label>
            <input type="text" id="banner-${idx}-badge" class="form-control" value="${Utils.escapeHtml(b.badge || '')}">
          </div>
          <div class="form-group">
            <label class="form-label">Banner Image URL</label>
            <input type="text" id="banner-${idx}-imageUrl" class="form-control" value="${Utils.escapeHtml(b.imageUrl || '')}">
          </div>
          <div class="form-group form-full">
            <label class="form-label">Headline</label>
            <input type="text" id="banner-${idx}-headline" class="form-control" value="${Utils.escapeHtml(b.headline || '')}">
          </div>
          <div class="form-group form-full">
            <label class="form-label">Subheadline</label>
            <input type="text" id="banner-${idx}-subheadline" class="form-control" value="${Utils.escapeHtml(b.subheadline || '')}">
          </div>
          <div class="form-group">
            <label class="form-label">Primary CTA Button Text</label>
            <input type="text" id="banner-${idx}-ctaText" class="form-control" value="${Utils.escapeHtml(b.ctaText || 'Explore Catalog')}">
          </div>
          <div class="form-group">
            <label class="form-label">Primary CTA Link</label>
            <input type="text" id="banner-${idx}-ctaLink" class="form-control" value="${Utils.escapeHtml(b.ctaLink || 'catalog.html')}">
          </div>
        </div>
      </div>
    `).join('');
  }

  // Section configs
  setVal('setting-sec-categories-title', settings.sectionConfigs?.categories?.title || 'Product Categories');
  setVal('setting-sec-categories-enabled', settings.sectionConfigs?.categories?.enabled !== false ? 'true' : 'false');
  setVal('setting-sec-arrivals-title', settings.sectionConfigs?.newArrivals?.title);
  setVal('setting-sec-arrivals-enabled', settings.sectionConfigs?.newArrivals?.enabled !== false ? 'true' : 'false');
  setVal('setting-sec-bestsellers-title', settings.sectionConfigs?.bestSellers?.title);
  setVal('setting-sec-bestsellers-enabled', settings.sectionConfigs?.bestSellers?.enabled !== false ? 'true' : 'false');
  setVal('setting-sec-systems-title', settings.sectionConfigs?.mechanicalSystems?.title);
  setVal('setting-sec-systems-enabled', settings.sectionConfigs?.mechanicalSystems?.enabled !== false ? 'true' : 'false');
  setVal('setting-sec-projects-title', settings.sectionConfigs?.projects?.title);
  setVal('setting-sec-projects-enabled', settings.sectionConfigs?.projects?.enabled !== false ? 'true' : 'false');
}

window.saveGlobalSettings = function() {
  const current = store.getSettings();

  const heroBanners = [0, 1, 2].map(idx => {
    const existing = current.heroBanners?.[idx] || {};
    return {
      ...existing,
      id: existing.id || `banner-${idx + 1}`,
      badge: document.getElementById(`banner-${idx}-badge`)?.value.trim() || '',
      imageUrl: document.getElementById(`banner-${idx}-imageUrl`)?.value.trim() || '',
      headline: document.getElementById(`banner-${idx}-headline`)?.value.trim() || '',
      subheadline: document.getElementById(`banner-${idx}-subheadline`)?.value.trim() || '',
      ctaText: document.getElementById(`banner-${idx}-ctaText`)?.value.trim() || 'Explore Catalog',
      ctaLink: document.getElementById(`banner-${idx}-ctaLink`)?.value.trim() || 'catalog.html'
    };
  });

  const updated = {
    ...current,
    companyName: document.getElementById('setting-companyName').value.trim(),
    tagline: document.getElementById('setting-tagline').value.trim(),
    phone: document.getElementById('setting-phone').value.trim(),
    email: document.getElementById('setting-email').value.trim(),
    logoUrl: document.getElementById('setting-logoUrl').value.trim() || '../shared/assets/logo-mark.png',
    certifications: document.getElementById('setting-certifications').value.trim(),
    heroAutoplayMs: Number(document.getElementById('setting-heroAutoplayMs').value) || 5000,
    heroBanners,
    hero: {
      ...current.hero,
      headline: heroBanners[0].headline,
      subheadline: heroBanners[0].subheadline,
      imageUrl: heroBanners[0].imageUrl
    },
    sectionConfigs: {
      ...current.sectionConfigs,
      categories: {
        ...current.sectionConfigs?.categories,
        title: document.getElementById('setting-sec-categories-title').value.trim(),
        enabled: document.getElementById('setting-sec-categories-enabled').value === 'true'
      },
      newArrivals: {
        ...current.sectionConfigs?.newArrivals,
        title: document.getElementById('setting-sec-arrivals-title').value.trim(),
        enabled: document.getElementById('setting-sec-arrivals-enabled').value === 'true'
      },
      bestSellers: {
        ...current.sectionConfigs?.bestSellers,
        title: document.getElementById('setting-sec-bestsellers-title').value.trim(),
        enabled: document.getElementById('setting-sec-bestsellers-enabled').value === 'true'
      },
      mechanicalSystems: {
        ...current.sectionConfigs?.mechanicalSystems,
        title: document.getElementById('setting-sec-systems-title').value.trim(),
        enabled: document.getElementById('setting-sec-systems-enabled').value === 'true'
      },
      projects: {
        ...current.sectionConfigs?.projects,
        title: document.getElementById('setting-sec-projects-title').value.trim(),
        enabled: document.getElementById('setting-sec-projects-enabled').value === 'true'
      }
    }
  };

  store.saveSettings(updated);
  loadSettingsForm();
  showToast('Showroom settings & 3 rotating banners saved.');
};

window.updateAdminPassword = function() {
  const currentPw = document.getElementById('pw-current').value;
  const newPw = document.getElementById('pw-new').value;
  const confirmPw = document.getElementById('pw-confirm').value;

  if (newPw !== confirmPw) {
    alert('New passwords do not match.');
    return;
  }

  const res = store.updateAdminPassword(currentSession.adminId, currentPw, newPw);
  if (res.success) {
    alert('Password updated successfully. Please keep your new credentials secure.');
    document.getElementById('pw-current').value = '';
    document.getElementById('pw-new').value = '';
    document.getElementById('pw-confirm').value = '';
    showToast('Admin password changed.');
  } else {
    alert(res.error || 'Failed to update password.');
  }
};

window.exportDataJson = function() {
  const jsonStr = store.exportDatabase();
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `doors_gallery_database_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

window.resetToInitialSeed = function() {
  if (confirm('CAUTION: This will reset all doors, brands, promotions, and settings to the initial Doors Gallery seed data. Continue?')) {
    store.resetToDefaults();
    loadAllViews();
    showToast('Database reset to factory seed.');
  }
};

/* ================= 12. MODAL UTILITIES ================= */
window.closeModal = function(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.remove('open');
};
