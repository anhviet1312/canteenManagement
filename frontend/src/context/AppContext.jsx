import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ROLES } from '../data/roles';
import { apiClient } from '../api/apiClient';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('ctech_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState(() => {
    if (!currentUser) return 'pos';
    const roleConfig = ROLES[currentUser?.role] || ROLES.CHEF;
    return roleConfig.defaultTab;
  });

  // Data state loaded from PostgreSQL via FastAPI
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [inventoryBatches, setInventoryBatches] = useState([]);
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [ctoolMeals, setCtoolMeals] = useState([]);
  const [orders, setOrders] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [dashboardMetrics, setDashboardMetrics] = useState(null);

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Sync current user to localStorage & ensure activeTab is permitted
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ctech_current_user', JSON.stringify(currentUser));
      const roleConfig = ROLES[currentUser.role] || ROLES.CHEF;
      if (!roleConfig.allowedTabs.includes(activeTab)) {
        setActiveTab(roleConfig.defaultTab);
      }
    } else {
      localStorage.removeItem('ctech_current_user');
    }
  }, [currentUser, activeTab]);

  // Refresh all state from PostgreSQL
  const refreshAll = useCallback(async () => {
    try {
      setLoading(true);
      const [uList, cats, prods, mats, batches, prs, meals, ords, logs, metrics] = await Promise.all([
        apiClient.getUsers().catch(() => []),
        apiClient.getCategories().catch(() => []),
        apiClient.getProducts().catch(() => []),
        apiClient.getMaterials().catch(() => []),
        apiClient.getBatches().catch(() => []),
        apiClient.getPurchaseRequests().catch(() => []),
        apiClient.getCtoolMeals().catch(() => []),
        apiClient.getOrders().catch(() => []),
        apiClient.getAuditLogs().catch(() => []),
        apiClient.getDashboardMetrics().catch(() => null)
      ]);

      if (uList.length > 0) setUsers(uList);
      setCategories(cats);
      setProducts(prods);
      setMaterials(mats);
      setInventoryBatches(batches);
      setPurchaseRequests(prs);
      setCtoolMeals(meals);
      setOrders(ords);
      setAuditLogs(logs);
      setDashboardMetrics(metrics);
    } catch (err) {
      console.error("Lỗi đồng bộ dữ liệu từ PostgreSQL:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Login action
  const login = async (username, password) => {
    try {
      setLoading(true);
      const res = await apiClient.login(username, password);
      setCurrentUser(res.user);
      const roleConfig = ROLES[res.user.role] || ROLES.CHEF;
      setActiveTab(roleConfig.defaultTab);
      showNotification(res.message, 'success');
      await refreshAll();
      return { success: true };
    } catch (err) {
      showNotification(err.message || 'Đăng nhập không thành công', 'error');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout action
  const logout = async () => {
    try {
      await apiClient.logout().catch(() => {});
    } finally {
      setCurrentUser(null);
      localStorage.removeItem('ctech_current_user');
      showNotification('Đã đăng xuất khỏi hệ thống', 'info');
    }
  };

  // Switch role action
  const switchUser = async (userId) => {
    try {
      const res = await apiClient.switchUser(userId);
      const user = res.user;
      setCurrentUser(user);
      const roleConfig = ROLES[user.role] || ROLES.CHEF;
      setActiveTab(roleConfig.defaultTab);
      showNotification(`Đã chuyển vai trò sang: ${user.full_name} (${ROLES[user.role]?.name})`, 'info');
      refreshAll();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // POS Checkout action
  const completeOrder = async (orderData) => {
    try {
      const res = await apiClient.checkout(orderData);
      showNotification(res.message, 'success');
      refreshAll();
      return res.order;
    } catch (err) {
      showNotification(`Lỗi thanh toán: ${err.message}`, 'error');
      throw err;
    }
  };

  // Create PR action
  const createPurchaseRequest = async (prData) => {
    try {
      const res = await apiClient.createPurchaseRequest(prData);
      showNotification(res.message, 'success');
      refreshAll();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // Approval actions
  const approveRequest = async (prId, note) => {
    try {
      const res = await apiClient.approveRequest(prId, note);
      showNotification(res.message, 'success');
      refreshAll();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const rejectRequest = async (prId, reason) => {
    try {
      const res = await apiClient.rejectRequest(prId, reason);
      showNotification(res.message, 'info');
      refreshAll();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // Inventory actions
  const receiveGoodsIntoWarehouse = async (prId, batches) => {
    try {
      const res = await apiClient.receiveGoods(prId, batches);
      showNotification(res.message, 'success');
      refreshAll();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const adjustStock = async (materialId, actualCount, reason) => {
    try {
      const res = await apiClient.adjustStock(materialId, actualCount, reason);
      showNotification(res.message, 'info');
      refreshAll();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // Ctool actions
  const toggleMealServed = async (mealId) => {
    try {
      await apiClient.toggleServeMeal(mealId);
      refreshAll();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const syncWithCtool = async () => {
    try {
      showNotification('Đang kết nối API Ctool & Máy chấm công CTECH...', 'info');
      const res = await apiClient.syncCtool();
      showNotification(res.message, 'success');
      refreshAll();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  return (
    <AppContext.Provider
      value={{
        ROLES,
        users,
        currentUser,
        login,
        logout,
        switchUser,
        activeTab,
        setActiveTab,
        categories,
        products,
        materials,
        inventoryBatches,
        purchaseRequests,
        ctoolMeals,
        orders,
        auditLogs,
        dashboardMetrics,
        completeOrder,
        createPurchaseRequest,
        approveRequest,
        rejectRequest,
        receiveGoodsIntoWarehouse,
        adjustStock,
        toggleMealServed,
        syncWithCtool,
        refreshAll,
        notification,
        showNotification,
        loading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
