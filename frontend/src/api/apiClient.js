// API Client connecting to Python FastAPI Backend (PostgreSQL)
// Supports Vercel deployment with VITE_API_URL or local proxy fallback to '/api'
const API_BASE = import.meta.env.VITE_API_URL
  ? (import.meta.env.VITE_API_URL.endsWith('/') ? import.meta.env.VITE_API_URL.slice(0, -1) : import.meta.env.VITE_API_URL)
  : '';
const BASE_URL = `${API_BASE}/api`;

export const apiClient = {
  getHeaders: () => {
    const savedUser = localStorage.getItem('ctech_current_user');
    const user = savedUser ? JSON.parse(savedUser) : null;
    return {
      'Content-Type': 'application/json',
      'x-user-role': user ? user.role : 'ANONYMOUS',
      'x-user-name': user ? encodeURIComponent(user.full_name || '') : '',
    };
  },

  async request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = { ...this.getHeaders(), ...(options.headers || {}) };
    
    try {
      const response = await fetch(url, { ...options, headers });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP Error ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`API Error on ${endpoint}:`, error);
      throw error;
    }
  },

  // Auth & Roles
  getUsers: () => apiClient.request('/auth/users'),
  getCurrentUser: () => apiClient.request('/auth/current'),
  login: (username, password) => apiClient.request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  }),
  logout: () => apiClient.request('/auth/logout', { method: 'POST' }),
  switchUser: (user_id) => apiClient.request('/auth/switch', {
    method: 'POST',
    body: JSON.stringify({ user_id })
  }),

  // Menu & BOM
  getCategories: () => apiClient.request('/menu/categories'),
  getProducts: () => apiClient.request('/menu/products'),
  updateRecipe: (productId, materialId, quantity) => apiClient.request(`/menu/recipes/${productId}/${materialId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity })
  }),

  // POS
  checkout: (orderData) => apiClient.request('/pos/checkout', {
    method: 'POST',
    body: JSON.stringify(orderData)
  }),
  getOrders: (cashier) => apiClient.request(`/pos/orders${cashier ? `?cashier=${encodeURIComponent(cashier)}` : ''}`),

  // 4-Stage Approval Workflow
  getPurchaseRequests: () => apiClient.request('/approval/requests'),
  createPurchaseRequest: (data) => apiClient.request('/approval/requests', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  approveRequest: (id, note) => apiClient.request(`/approval/requests/${id}/approve`, {
    method: 'POST',
    body: JSON.stringify({ note })
  }),
  rejectRequest: (id, reason) => apiClient.request(`/approval/requests/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason })
  }),

  // Inventory & FEFO
  getMaterials: () => apiClient.request('/inventory/materials'),
  getBatches: () => apiClient.request('/inventory/batches'),
  receiveGoods: (pr_id, batches) => apiClient.request(`/inventory/receive/${pr_id}`, {
    method: 'POST',
    body: JSON.stringify({ batches })
  }),
  adjustStock: (material_id, actual_count, reason) => apiClient.request('/inventory/adjust', {
    method: 'POST',
    body: JSON.stringify({ material_id, actual_count, reason })
  }),

  // DSS
  calculateDSS: (safety_factor, student_growth) => apiClient.request('/dss/calculate', {
    method: 'POST',
    body: JSON.stringify({ safety_factor, student_growth })
  }),

  // Ctool & Biometrics
  getCtoolMeals: () => apiClient.request('/ctool/meals'),
  searchCtoolStaff: (query = '') => apiClient.request(`/ctool/search${query ? `?query=${encodeURIComponent(query)}` : ''}`),
  toggleServeMeal: (id) => apiClient.request(`/ctool/serve/${id}`, { method: 'POST' }),
  syncCtool: () => apiClient.request('/ctool/sync', { method: 'POST' }),

  // Reports
  getDashboardMetrics: () => apiClient.request('/reports/dashboard'),
  getNXTReport: () => apiClient.request('/reports/nxt'),

  // Audit Logs
  getAuditLogs: () => apiClient.request('/audit/logs'),
};
