/**
 * PORTA Architectural Doors - Minimalist Utility Library
 */

export const Utils = {
  /**
   * Generate a unique ID with an optional entity prefix
   */
  generateId(prefix = 'id') {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `${prefix}-${timestamp}-${random}`;
  },

  /**
   * Slugify a string for clean URL paths
   */
  slugify(text) {
    if (!text) return '';
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start
      .replace(/-+$/, '');            // Trim - from end
  },

  /**
   * Format numbers as USD currency
   */
  formatCurrency(value) {
    if (value === null || value === undefined || isNaN(value)) {
      return '$0.00';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  },

  /**
   * Escape HTML to prevent XSS in dynamic renders
   */
  escapeHtml(str) {
    if (!str) return '';
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return str.toString().replace(/[&<>"']/g, m => map[m]);
  },

  /**
   * Truncate text with ellipsis
   */
  truncate(text, maxChars = 100) {
    if (!text) return '';
    if (text.length <= maxChars) return text;
    return text.substring(0, maxChars).trim() + '…';
  },

  /**
   * Format ISO date string into readable architectural date
   */
  formatDate(isoString) {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return isoString;
    }
  },

  /**
   * Architectural Portal SVG Placeholder (used when door image is missing)
   */
  getArchitecturalPlaceholderSvg() {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%" fill="%23f3f4f3"><rect width="600" height="800" fill="%23eeeeed"/><rect x="120" y="80" width="360" height="640" fill="none" stroke="%23747878" stroke-width="2"/><line x1="120" y1="80" x2="480" y2="80" stroke="%231a1c1c" stroke-width="4"/><line x1="440" y1="400" x2="440" y2="440" stroke="%231a1c1c" stroke-width="3"/><text x="300" y="760" font-family="sans-serif" font-size="14" letter-spacing="4" fill="%23747878" text-anchor="middle" font-weight="500">PORTA ARCHITECTURAL PORTAL</text></svg>`;
  }
};
