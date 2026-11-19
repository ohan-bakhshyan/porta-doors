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
    inquiries: 'Specification Inquiries',
    settings: 'Showroom Settings & Security'
  };
  if (titleEl) titleEl.textContent = titles[tabName] || 'Overview';
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

  tbody.innerHTML = recent.map(i => `
    <tr>
      <td style="font-family:var(--font-mono); font-weight:600;">${Utils.escapeHtml(i.id)}</td>
      <td><strong>${Utils.escapeHtml(i.contactName || 'Trade Client')}</strong></td>
      <td>${Utils.escapeHtml(i.projectType || 'Residential')}</td>
      <td>${Utils.escapeHtml(i.projectLocation || 'Unspecified')}</td>
      <td>${i.items?.length || 0} Doors</td>
      <td><span class="status-pill ${i.status === 'new' ? 'status-active' : 'status-inactive'}">${i.status.toUpperCase()}</span></td>
      <td style="font-family:var(--font-mono); font-size:11px;">${Utils.formatDate(i.createdAt)}</td>
    </tr>
  `).join('');
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
          <strong>${Utils.escapeHtml(door.name)}</strong>
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
            <span style="color:#ba1a1a; font-weight:600;">${Utils.formatCurrency(priceInfo.effectivePrice)}</span>
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
        <td><span class="status-pill status-tag" style="background:#ba1a1a;">${discountText}</span></td>
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

/* ================= 10. SPEC INQUIRIES ================= */
function renderInquiriesTable() {
  const tbody = document.getElementById('inquiries-table-body');
  if (!tbody) return;

  const inquiries = store.getInquiries();
  if (inquiries.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding:24px; color:var(--color-secondary);">No specification inquiries received.</td></tr>';
    return;
  }

  tbody.innerHTML = inquiries.map(inq => `
    <tr>
      <td style="font-family:var(--font-mono); font-weight:600;">${inq.id}</td>
      <td style="font-family:var(--font-mono); font-size:11px;">${Utils.formatDate(inq.createdAt)}</td>
      <td>
        <strong>${Utils.escapeHtml(inq.contactName)}</strong>
        <div style="font-size:11px; color:var(--color-secondary);">${Utils.escapeHtml(inq.contactEmail)}</div>
      </td>
      <td>${Utils.escapeHtml(inq.projectLocation || '—')}</td>
      <td><span class="status-pill status-active">${inq.projectType || 'Residential'}</span></td>
      <td>${inq.items?.length || 0} Model(s)</td>
      <td style="font-size:11px; font-family:var(--font-mono);">${inq.fileName ? `📎 ${Utils.escapeHtml(inq.fileName)}` : 'None'}</td>
      <td>
        <span class="status-pill ${inq.status === 'new' ? 'status-active' : 'status-inactive'}">
          ${inq.status.toUpperCase()}
        </span>
      </td>
      <td>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-secondary btn-sm" onclick="viewInquiryDossier('${inq.id}')">View Dossier</button>
          <button class="btn btn-danger btn-sm" onclick="deleteInquiry('${inq.id}')">✕</button>
        </div>
      </td>
    </tr>
  `).join('');
}

window.viewInquiryDossier = function(id) {
  const inq = store.getInquiries().find(i => i.id === id);
  if (!inq) return;

  const modal = document.getElementById('modal-inquiry');
  const body = document.getElementById('inquiry-modal-body');

  const itemsHtml = (inq.items || []).map(item => `
    <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--color-surface-container);">
      <div>
        <strong>${Utils.escapeHtml(item.doorName || item.name || 'Door Model')}</strong> 
        <span style="font-family:var(--font-mono); color:var(--color-secondary);">(${item.sku || 'SKU'})</span>
        <div style="font-size:11px; color:var(--color-secondary);">Qty: ${item.quantity} | Finish: ${Utils.escapeHtml(item.finish || 'Standard')}</div>
      </div>
      <div style="font-family:var(--font-mono); font-weight:600;">
        ${Utils.formatCurrency((item.effectivePrice || item.basePrice || 0) * item.quantity)}
      </div>
    </div>
  `).join('');

  body.innerHTML = `
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:20px;">
      <div>
        <label class="form-label">Contact / Studio</label>
        <div style="font-size:14px; font-weight:600;">${Utils.escapeHtml(inq.contactName)}</div>
        <div style="font-size:12px; color:var(--color-secondary);">${Utils.escapeHtml(inq.contactEmail)} | ${Utils.escapeHtml(inq.contactPhone || 'No Phone')}</div>
      </div>
      <div>
        <label class="form-label">Project Typology & Location</label>
        <div style="font-size:13px;">${Utils.escapeHtml(inq.projectType || 'Standard')} • ${Utils.escapeHtml(inq.projectLocation || 'Unspecified')}</div>
        <div style="font-size:11px; color:var(--color-secondary);">Openings: ${Utils.escapeHtml(inq.openingsCount || 'Not specified')}</div>
      </div>
    </div>

    ${inq.fileName ? `
      <div style="padding:10px; background:var(--color-surface-low); margin-bottom:16px; font-size:12px;">
        <strong>Attached Architectural Schedule:</strong> <code>${Utils.escapeHtml(inq.fileName)}</code>
      </div>
    ` : ''}

    <div style="margin-bottom:16px;">
      <label class="form-label">Client Notes & Directives</label>
      <div style="font-size:13px; line-height:1.5; padding:10px; background:var(--color-surface-low);">
        ${Utils.escapeHtml(inq.notes || 'No custom notes provided.')}
      </div>
    </div>

    <div>
      <label class="form-label">Scheduled Door Leaves</label>
      <div style="margin-top:6px;">${itemsHtml || '<div style="color:var(--color-secondary); font-size:12px;">No specific doors pre-selected. General specification request.</div>'}</div>
    </div>
  `;

  document.getElementById('inquiry-toggle-status-btn').onclick = () => {
    const nextStatus = inq.status === 'new' ? 'contacted' : inq.status === 'contacted' ? 'quoted' : 'new';
    store.updateInquiryStatus(id, nextStatus);
    closeModal('modal-inquiry');
    renderInquiriesTable();
    updateDashboardKpis();
    updateBadgeCounts();
    showToast(`Inquiry ${id} status set to ${nextStatus.toUpperCase()}`);
  };

  modal.classList.add('open');
};

window.deleteInquiry = function(id) {
  if (confirm(`Remove inquiry ${id}?`)) {
    store.deleteInquiry(id);
    renderInquiriesTable();
    updateDashboardKpis();
    updateBadgeCounts();
    showToast('Inquiry removed.');
  }
};

/* ================= 11. SETTINGS & ACCOUNT ================= */
function loadSettingsForm() {
  const settings = store.getSettings();

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  };

  setVal('setting-companyName', settings.companyName);
  setVal('setting-tagline', settings.tagline);
  setVal('setting-phone', settings.phone);
  setVal('setting-email', settings.email);
  setVal('setting-certifications', settings.certifications);

  // Hero
  setVal('setting-hero-headline', settings.hero?.headline);
  setVal('setting-hero-subheadline', settings.hero?.subheadline);
  setVal('setting-hero-directive', settings.hero?.directive);
  setVal('setting-hero-modelBadge', settings.hero?.modelBadge);
  setVal('setting-hero-imageUrl', settings.hero?.imageUrl);
  setVal('setting-hero-metricsPill', settings.hero?.metricsPill);

  // Section configs
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

  const updated = {
    ...current,
    companyName: document.getElementById('setting-companyName').value.trim(),
    tagline: document.getElementById('setting-tagline').value.trim(),
    phone: document.getElementById('setting-phone').value.trim(),
    email: document.getElementById('setting-email').value.trim(),
    certifications: document.getElementById('setting-certifications').value.trim(),
    hero: {
      ...current.hero,
      headline: document.getElementById('setting-hero-headline').value.trim(),
      subheadline: document.getElementById('setting-hero-subheadline').value.trim(),
      directive: document.getElementById('setting-hero-directive').value.trim(),
      modelBadge: document.getElementById('setting-hero-modelBadge').value.trim(),
      imageUrl: document.getElementById('setting-hero-imageUrl').value.trim(),
      metricsPill: document.getElementById('setting-hero-metricsPill').value.trim()
    },
    sectionConfigs: {
      ...current.sectionConfigs,
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
  showToast('Global showroom settings updated.');
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
  a.download = `porta_architectural_database_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

window.resetToInitialSeed = function() {
  if (confirm('CAUTION: This will reset all doors, brands, promotions, and settings to the initial PORTA seed data. Continue?')) {
    store.resetToDefaults();
    loadAllViews();
    showToast('Database reset to factory architectural seed.');
  }
};

/* ================= 12. MODAL UTILITIES ================= */
window.closeModal = function(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.remove('open');
};
