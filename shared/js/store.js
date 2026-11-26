/**
 * PORTA Architectural Doors - Unified Reactive Data Store
 * Persists to LocalStorage and synchronizes state across Admin & Front.
 */

import { INITIAL_SEED_DATA } from './seed-data.js';
import { Utils } from './utils.js';

const STORAGE_KEY = 'dg_store_v3';
const SPEC_LIST_KEY = 'dg_spec_list_v3';
const ADMIN_SESSION_KEY = 'porta_admin_session';

class Store {
  constructor() {
    this.data = this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          // Ensure schema integrity
          if (parsed.doors && parsed.brands && parsed.categories && parsed.admins) {
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('Failed to parse store from localStorage, re-seeding:', e);
    }
    // Auto-seed on first launch or version migration
    const clone = JSON.parse(JSON.stringify(INITIAL_SEED_DATA));
    this.saveToStorage(clone);
    return clone;
  }

  saveToStorage(dataToSave = this.data) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      }
      this.data = dataToSave;
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('porta-store-updated', { detail: this.data }));
      }
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  /* ================= 1. ADMIN AUTH & ACCESS CONTROL ================= */

  authenticate(username, password) {
    const admins = this.data.admins || [];
    const target = admins.find(a => 
      a.username.trim().toLowerCase() === username.trim().toLowerCase() && 
      a.passwordHash === password &&
      a.isActive !== false
    );

    if (target) {
      const session = {
        token: `token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        adminId: target.id,
        username: target.username,
        name: target.name,
        role: target.role,
        timestamp: Date.now()
      };
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
      }
      return { success: true, session, admin: target };
    }
    return { success: false, error: 'Invalid username or password.' };
  }

  getCurrentSession() {
    try {
      if (typeof sessionStorage !== 'undefined') {
        const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
      }
      return null;
    } catch {
      return null;
    }
  }

  logout() {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    }
  }

  getAdmins() {
    return this.data.admins || [];
  }

  getAdminById(id) {
    return (this.data.admins || []).find(a => a.id === id);
  }

  saveAdmin(adminData) {
    const admins = this.data.admins || [];
    if (!adminData.id) {
      adminData.id = Utils.generateId('admin');
      adminData.createdAt = new Date().toISOString();
      adminData.isActive = adminData.isActive !== false;
      admins.push(adminData);
    } else {
      const idx = admins.findIndex(a => a.id === adminData.id);
      if (idx >= 0) {
        admins[idx] = { ...admins[idx], ...adminData };
      } else {
        admins.push(adminData);
      }
    }
    this.data.admins = admins;
    this.saveToStorage();
    return adminData;
  }

  updateAdminPassword(adminId, oldPassword, newPassword) {
    const admins = this.data.admins || [];
    const admin = admins.find(a => a.id === adminId);
    if (!admin) {
      return { success: false, error: 'Admin account not found.' };
    }
    if (admin.passwordHash !== oldPassword) {
      return { success: false, error: 'Current password does not match.' };
    }
    if (!newPassword || newPassword.length < 4) {
      return { success: false, error: 'New password must be at least 4 characters.' };
    }
    admin.passwordHash = newPassword;
    this.saveToStorage();
    return { success: true };
  }

  deleteAdmin(adminId) {
    const admins = this.data.admins || [];
    const activeAdmins = admins.filter(a => a.isActive !== false);
    const target = admins.find(a => a.id === adminId);

    if (target && target.isActive !== false && activeAdmins.length <= 1) {
      throw new Error('Security Guard: Cannot delete the last remaining active admin account.');
    }

    this.data.admins = admins.filter(a => a.id !== adminId);
    this.saveToStorage();
  }

  /* ================= 2. GLOBAL SETTINGS & HOMEPAGE ================= */

  getSettings() {
    return this.data.settings || INITIAL_SEED_DATA.settings;
  }

  saveSettings(newSettings) {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.saveToStorage();
    return this.data.settings;
  }

  /* ================= 3. BRANDS MANAGEMENT ================= */

  getBrands() {
    return this.data.brands || [];
  }

  getBrandById(id) {
    return (this.data.brands || []).find(b => b.id === id);
  }

  getBrandBySlug(slug) {
    return (this.data.brands || []).find(b => b.slug === slug);
  }

  saveBrand(brandData) {
    const brands = this.data.brands || [];
    if (!brandData.id) {
      brandData.id = Utils.generateId('brand');
      if (!brandData.slug) brandData.slug = Utils.slugify(brandData.name);
      brands.push(brandData);
    } else {
      const idx = brands.findIndex(b => b.id === brandData.id);
      if (idx >= 0) {
        brands[idx] = { ...brands[idx], ...brandData };
      } else {
        brands.push(brandData);
      }
    }
    this.data.brands = brands;
    this.saveToStorage();
    return brandData;
  }

  deleteBrand(id, reassignBrandId = null) {
    const doors = this.data.doors || [];
    // Safe reassignment rule: update doors pointing to this brand
    doors.forEach(d => {
      if (d.brandId === id) {
        if (reassignBrandId) {
          d.brandId = reassignBrandId;
        } else {
          d.isActive = false; // Gracefully deactivate if unassigned
        }
      }
    });

    this.data.doors = doors;
    this.data.brands = (this.data.brands || []).filter(b => b.id !== id);
    this.saveToStorage();
  }

  /* ================= 4. CATEGORIES MANAGEMENT ================= */

  getCategories() {
    return (this.data.categories || []).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }

  getCategoryById(id) {
    return (this.data.categories || []).find(c => c.id === id);
  }

  getCategoryBySlug(slug) {
    return (this.data.categories || []).find(c => c.slug === slug);
  }

  saveCategory(catData) {
    const categories = this.data.categories || [];
    if (!catData.id) {
      catData.id = Utils.generateId('cat');
      if (!catData.slug) catData.slug = Utils.slugify(catData.name);
      categories.push(catData);
    } else {
      const idx = categories.findIndex(c => c.id === catData.id);
      if (idx >= 0) {
        categories[idx] = { ...categories[idx], ...catData };
      } else {
        categories.push(catData);
      }
    }
    this.data.categories = categories;
    this.saveToStorage();
    return catData;
  }

  deleteCategory(id, reassignCatId = null) {
    const doors = this.data.doors || [];
    // Safe reassignment rule
    doors.forEach(d => {
      if (d.categoryIds && d.categoryIds.includes(id)) {
        if (reassignCatId) {
          d.categoryIds = d.categoryIds.map(cid => cid === id ? reassignCatId : cid);
          d.categoryIds = [...new Set(d.categoryIds)];
        } else {
          d.categoryIds = d.categoryIds.filter(cid => cid !== id);
        }
      }
    });

    this.data.doors = doors;
    this.data.categories = (this.data.categories || []).filter(c => c.id !== id);
    this.saveToStorage();
  }

  assignDoorsToCategory(categoryId, selectedDoorIds = []) {
    const doors = this.data.doors || [];
    doors.forEach(d => {
      d.categoryIds = d.categoryIds || [];
      const isSelected = selectedDoorIds.includes(d.id);
      const hasCategory = d.categoryIds.includes(categoryId);

      if (isSelected && !hasCategory) {
        d.categoryIds.push(categoryId);
      } else if (!isSelected && hasCategory) {
        d.categoryIds = d.categoryIds.filter(cid => cid !== categoryId);
      }
    });
    this.data.doors = doors;
    this.saveToStorage();
  }

  /* ================= 5. MECHANICAL SYSTEMS ================= */

  getMechanicalSystems() {
    return this.data.mechanicalSystems || INITIAL_SEED_DATA.mechanicalSystems;
  }

  getMechanicalSystemById(id) {
    return (this.data.mechanicalSystems || []).find(s => s.id === id);
  }

  saveMechanicalSystem(systemData) {
    const systems = this.data.mechanicalSystems || [];
    const idx = systems.findIndex(s => s.id === systemData.id);
    if (idx >= 0) {
      systems[idx] = { ...systems[idx], ...systemData };
    } else {
      systems.push(systemData);
    }
    this.data.mechanicalSystems = systems;
    this.saveToStorage();
    return systemData;
  }

  /* ================= 6. PRODUCT GROUPS ================= */

  getProductGroups() {
    return this.data.productGroups || [];
  }

  getProductGroupById(id) {
    return (this.data.productGroups || []).find(g => g.id === id);
  }

  saveProductGroup(groupData) {
    const groups = this.data.productGroups || [];
    if (!groupData.id) {
      groupData.id = Utils.generateId('grp');
      groups.push(groupData);
    } else {
      const idx = groups.findIndex(g => g.id === groupData.id);
      if (idx >= 0) {
        groups[idx] = { ...groups[idx], ...groupData };
      } else {
        groups.push(groupData);
      }
    }
    this.data.productGroups = groups;
    
    // Bidirectional sync with doors
    const doors = this.data.doors || [];
    const targetDoorIds = groupData.doorIds || [];
    doors.forEach(d => {
      d.groupIds = d.groupIds || [];
      const shouldHave = targetDoorIds.includes(d.id);
      const currentlyHas = d.groupIds.includes(groupData.id);
      if (shouldHave && !currentlyHas) {
        d.groupIds.push(groupData.id);
      } else if (!shouldHave && currentlyHas) {
        d.groupIds = d.groupIds.filter(gid => gid !== groupData.id);
      }
    });

    this.saveToStorage();
    return groupData;
  }

  deleteProductGroup(id) {
    this.data.productGroups = (this.data.productGroups || []).filter(g => g.id !== id);
    // Remove group reference from doors
    (this.data.doors || []).forEach(d => {
      if (d.groupIds) {
        d.groupIds = d.groupIds.filter(gid => gid !== id);
      }
    });
    // Remove group reference from promotions
    (this.data.promotions || []).forEach(p => {
      if (p.targetType === 'group' && p.targetIds) {
        p.targetIds = p.targetIds.filter(tid => tid !== id);
      }
    });
    this.saveToStorage();
  }

  /* ================= 7. PROMOTIONS & PRICE CALCULATION ================= */

  getPromotions() {
    return this.data.promotions || [];
  }

  getPromotionById(id) {
    return (this.data.promotions || []).find(p => p.id === id);
  }

  savePromotion(promoData) {
    const promos = this.data.promotions || [];
    if (!promoData.id) {
      promoData.id = Utils.generateId('promo');
      promos.push(promoData);
    } else {
      const idx = promos.findIndex(p => p.id === promoData.id);
      if (idx >= 0) {
        promos[idx] = { ...promos[idx], ...promoData };
      } else {
        promos.push(promoData);
      }
    }
    this.data.promotions = promos;
    this.saveToStorage();
    return promoData;
  }

  deletePromotion(id) {
    this.data.promotions = (this.data.promotions || []).filter(p => p.id !== id);
    this.saveToStorage();
  }

  /**
   * Pricing Precedence Rule:
   * Dynamic non-stackable "Highest Discount Wins", floored at $0.00.
   */
  calculateEffectivePrice(door) {
    const basePrice = Number(door.basePrice) || 0;
    const now = new Date();
    const promotions = (this.data.promotions || []).filter(p => {
      if (!p.isActive) return false;
      if (p.startDate && new Date(p.startDate) > now) return false;
      if (p.endDate && new Date(p.endDate) < now) return false;

      // Check if applies to door
      if (p.targetType === 'category') {
        const doorCats = door.categoryIds || [];
        return (p.targetIds || []).some(cid => doorCats.includes(cid));
      }
      if (p.targetType === 'group') {
        const doorGroups = door.groupIds || [];
        return (p.targetIds || []).some(gid => doorGroups.includes(gid));
      }
      return false;
    });

    if (promotions.length === 0) {
      return {
        basePrice,
        effectivePrice: basePrice,
        discountAmount: 0,
        discountPercent: 0,
        activePromo: null,
        hasDiscount: false
      };
    }

    // Evaluate each promo and pick the one with highest savings
    let bestDiscount = 0;
    let winningPromo = null;

    promotions.forEach(promo => {
      let discount = 0;
      if (promo.discountType === 'percentage') {
        discount = basePrice * (Number(promo.discountValue) / 100);
      } else if (promo.discountType === 'fixed') {
        discount = Number(promo.discountValue);
      }

      if (discount > bestDiscount) {
        bestDiscount = discount;
        winningPromo = promo;
      }
    });

    const effectivePrice = Math.max(0, Math.round(basePrice - bestDiscount));
    const actualDiscount = basePrice - effectivePrice;
    const discountPercent = basePrice > 0 ? Math.round((actualDiscount / basePrice) * 100) : 0;

    return {
      basePrice,
      effectivePrice,
      discountAmount: actualDiscount,
      discountPercent,
      activePromo: winningPromo,
      hasDiscount: actualDiscount > 0
    };
  }

  /* ================= 8. DOORS CATALOG ================= */

  getDoors(filters = {}) {
    let doors = this.data.doors || [];

    if (filters.isActive !== undefined) {
      doors = doors.filter(d => d.isActive === filters.isActive);
    }
    if (filters.categoryId && filters.categoryId !== 'all') {
      doors = doors.filter(d => (d.categoryIds || []).includes(filters.categoryId));
    }
    if (filters.brandId && filters.brandId !== 'all') {
      doors = doors.filter(d => d.brandId === filters.brandId);
    }
    if (filters.systemId && filters.systemId !== 'all') {
      doors = doors.filter(d => d.mechanicalSystemId === filters.systemId);
    }
    if (filters.tag && filters.tag !== 'all') {
      doors = doors.filter(d => (d.tags || []).includes(filters.tag));
    }
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      doors = doors.filter(d => 
        (d.name || '').toLowerCase().includes(q) ||
        (d.sku || '').toLowerCase().includes(q) ||
        (d.shortDescription || '').toLowerCase().includes(q)
      );
    }

    return doors;
  }

  getDoorById(id) {
    return (this.data.doors || []).find(d => d.id === id);
  }

  getDoorBySlug(slug) {
    return (this.data.doors || []).find(d => d.slug === slug);
  }

  /**
   * Generate an auto-unique slug
   */
  generateUniqueDoorSlug(baseSlug, doorId = null) {
    let slug = baseSlug;
    let counter = 1;
    const doors = this.data.doors || [];
    while (doors.some(d => d.slug === slug && d.id !== doorId)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    return slug;
  }

  saveDoor(doorData) {
    const doors = this.data.doors || [];
    
    // Auto-slug
    const baseSlug = doorData.slug ? Utils.slugify(doorData.slug) : Utils.slugify(doorData.name);
    doorData.slug = this.generateUniqueDoorSlug(baseSlug, doorData.id);

    // Multi-image gallery primary image rule:
    doorData.images = doorData.images || [];
    if (doorData.images.length > 0) {
      const hasPrimary = doorData.images.some(img => img.isPrimary);
      if (!hasPrimary) {
        doorData.images[0].isPrimary = true;
      }
    }

    if (!doorData.id) {
      doorData.id = Utils.generateId('door');
      doors.unshift(doorData);
    } else {
      const idx = doors.findIndex(d => d.id === doorData.id);
      if (idx >= 0) {
        doors[idx] = { ...doors[idx], ...doorData };
      } else {
        doors.unshift(doorData);
      }
    }

    this.data.doors = doors;
    this.saveToStorage();
    return doorData;
  }

  deleteDoor(id) {
    this.data.doors = (this.data.doors || []).filter(d => d.id !== id);
    // Clean up groups referencing this door
    (this.data.productGroups || []).forEach(g => {
      if (g.doorIds) g.doorIds = g.doorIds.filter(did => did !== id);
    });
    this.saveToStorage();
  }

  toggleDoorTag(id, tag) {
    const door = this.getDoorById(id);
    if (!door) return;
    door.tags = door.tags || [];
    const idx = door.tags.indexOf(tag);
    if (idx >= 0) {
      door.tags.splice(idx, 1);
    } else {
      door.tags.push(tag);
    }
    this.saveToStorage();
    return door.tags;
  }

  toggleDoorActive(id) {
    const door = this.getDoorById(id);
    if (!door) return;
    door.isActive = !door.isActive;
    this.saveToStorage();
    return door.isActive;
  }

  /* ================= 9. COMPLETED PROJECTS & TESTIMONIALS ================= */

  getProjects() {
    return this.data.projects || [];
  }

  getProjectById(id) {
    return (this.data.projects || []).find(p => p.id === id);
  }

  saveProject(projectData) {
    const projects = this.data.projects || [];
    if (!projectData.id) {
      projectData.id = Utils.generateId('proj');
      if (!projectData.slug) projectData.slug = Utils.slugify(projectData.title);
      projects.push(projectData);
    } else {
      const idx = projects.findIndex(p => p.id === projectData.id);
      if (idx >= 0) {
        projects[idx] = { ...projects[idx], ...projectData };
      } else {
        projects.push(projectData);
      }
    }
    this.data.projects = projects;
    this.saveToStorage();
    return projectData;
  }

  deleteProject(id) {
    this.data.projects = (this.data.projects || []).filter(p => p.id !== id);
    this.saveToStorage();
  }

  getTestimonials() {
    return this.data.testimonials || [];
  }

  /* ================= 10. SPEC LIST (QUOTE CART) ================= */

  getSpecList() {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(SPEC_LIST_KEY);
        return raw ? JSON.parse(raw) : (this.inMemorySpecList || []);
      }
      return this.inMemorySpecList || [];
    } catch {
      return this.inMemorySpecList || [];
    }
  }

  addToSpecList(doorId, options = {}) {
    const door = this.getDoorById(doorId);
    if (!door) return null;

    const priceInfo = this.calculateEffectivePrice(door);
    const list = this.getSpecList();
    const existingIndex = list.findIndex(item => item.doorId === doorId);

    if (existingIndex >= 0) {
      list[existingIndex].quantity += (options.quantity || 1);
    } else {
      const primaryImage = (door.images || []).find(img => img.isPrimary)?.url || 
                           door.images?.[0]?.url || 
                           Utils.getArchitecturalPlaceholderSvg();

      const brand = this.getBrandById(door.brandId);
      const system = this.getMechanicalSystemById(door.mechanicalSystemId);

      list.push({
        id: Utils.generateId('spec-item'),
        doorId: door.id,
        name: door.name,
        sku: door.sku,
        slug: door.slug,
        brandName: brand ? brand.name : 'PORTA',
        systemName: system ? system.name : 'Architectural System',
        primaryImage,
        basePrice: priceInfo.basePrice,
        effectivePrice: priceInfo.effectivePrice,
        hasDiscount: priceInfo.hasDiscount,
        quantity: options.quantity || 1,
        finish: options.finish || (door.specs?.finishes?.[0] || 'Standard Millwork')
      });
    }

    this.inMemorySpecList = list;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(SPEC_LIST_KEY, JSON.stringify(list));
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('porta-spec-list-updated', { detail: list }));
    }
    return list;
  }

  updateSpecListQuantity(itemId, quantity) {
    let list = this.getSpecList();
    if (quantity <= 0) {
      list = list.filter(item => item.id !== itemId);
    } else {
      const item = list.find(item => item.id === itemId);
      if (item) item.quantity = quantity;
    }
    this.inMemorySpecList = list;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(SPEC_LIST_KEY, JSON.stringify(list));
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('porta-spec-list-updated', { detail: list }));
    }
    return list;
  }

  removeFromSpecList(itemId) {
    const list = this.getSpecList().filter(item => item.id !== itemId);
    this.inMemorySpecList = list;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(SPEC_LIST_KEY, JSON.stringify(list));
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('porta-spec-list-updated', { detail: list }));
    }
    return list;
  }

  clearSpecList() {
    this.inMemorySpecList = [];
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(SPEC_LIST_KEY);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('porta-spec-list-updated', { detail: [] }));
    }
  }

  /* ================= 11. INQUIRIES & TRADE SPECIFICATIONS ================= */

  getInquiries() {
    return (this.data.inquiries || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  submitInquiry(inquiryData) {
    const inquiries = this.data.inquiries || [];
    const newInquiry = {
      id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: 'new',
      ...inquiryData
    };
    inquiries.unshift(newInquiry);
    this.data.inquiries = inquiries;
    this.saveToStorage();
    return newInquiry;
  }

  updateInquiryStatus(id, newStatus) {
    const inquiries = this.data.inquiries || [];
    const item = inquiries.find(i => i.id === id);
    if (item) {
      item.status = newStatus;
      this.saveToStorage();
    }
    return item;
  }

  deleteInquiry(id) {
    this.data.inquiries = (this.data.inquiries || []).filter(i => i.id !== id);
    this.saveToStorage();
  }

  /* ================= 12. BACKUP & SYSTEM RECOVERY ================= */

  exportDatabase() {
    return JSON.stringify(this.data, null, 2);
  }

  importDatabase(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.doors && parsed.brands && parsed.categories && parsed.admins) {
        this.saveToStorage(parsed);
        return true;
      }
    } catch (e) {
      console.error('Invalid import JSON structure:', e);
    }
    return false;
  }

  resetToDefaults() {
    const clone = JSON.parse(JSON.stringify(INITIAL_SEED_DATA));
    this.saveToStorage(clone);
    this.clearSpecList();
    return clone;
  }
}

export const store = new Store();
