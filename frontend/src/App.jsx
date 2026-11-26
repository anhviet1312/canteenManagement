import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// Views
import CashierPOSView from './pages/CashierPOSView';
import CashierHistoryView from './pages/CashierHistoryView';
import ChefMenuBOMView from './pages/ChefMenuBOMView';
import ChefDSSView from './pages/ChefDSSView';
import ChefPRView from './pages/ChefPRView';
import ApprovalLevel2View from './pages/ApprovalLevel2View';
import ApprovalLevel3View from './pages/ApprovalLevel3View';
import ApprovalLevel4View from './pages/ApprovalLevel4View';
import StorekeeperReceiveView from './pages/StorekeeperReceiveView';
import StorekeeperStockView from './pages/StorekeeperStockView';
import StorekeeperFEFOView from './pages/StorekeeperFEFOView';
import CtoolMonitorView from './pages/CtoolMonitorView';
import SuppliersView from './pages/SuppliersView';
import FinancialReportsView from './pages/FinancialReportsView';
import GeneralReportsView from './pages/GeneralReportsView';
import ExecutiveDashboardView from './pages/ExecutiveDashboardView';
import AdminDashboardView from './pages/AdminDashboardView';
import AdminUsersView from './pages/AdminUsersView';
import AuditLogsView from './pages/AuditLogsView';
import LoginView from './pages/LoginView';

import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

function MainLayout() {
  const { activeTab, notification } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      // CASHIER
      case 'pos':
        return <CashierPOSView />;
      case 'cashier_history':
        return <CashierHistoryView />;

      // CHEF
      case 'menu_bom':
        return <ChefMenuBOMView />;
      case 'dss':
        return <ChefDSSView />;
      case 'chef_pr':
        return <ChefPRView />;

      // TCHC
      case 'approval_l2':
        return <ApprovalLevel2View />;
      case 'general_reports':
        return <GeneralReportsView />;

      // ACCOUNTANT
      case 'approval_l3':
        return <ApprovalLevel3View />;
      case 'suppliers':
        return <SuppliersView />;
      case 'financial_reports':
        return <FinancialReportsView />;

      // CHAIRMAN
      case 'executive_dashboard':
        return <ExecutiveDashboardView />;
      case 'approval_l4':
        return <ApprovalLevel4View />;

      // STOREKEEPER
      case 'inventory_receive':
        return <StorekeeperReceiveView />;
      case 'inventory_stock':
        return <StorekeeperStockView />;
      case 'inventory_fefo':
        return <StorekeeperFEFOView />;

      // SHARED / MONITORING
      case 'ctool_monitor':
        return <CtoolMonitorView />;

      // ADMIN
      case 'admin_dashboard':
        return <AdminDashboardView />;
      case 'admin_users':
        return <AdminUsersView />;
      case 'audit_logs':
        return <AuditLogsView />;

      default:
        return <CashierPOSView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Header />

      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-slate-950/70">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Notification Toast */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce">
          <div
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-semibold backdrop-blur-md ${
              notification.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-200 border-emerald-600'
                : notification.type === 'error'
                ? 'bg-rose-950/90 text-rose-200 border-rose-600'
                : 'bg-blue-950/90 text-blue-200 border-blue-600'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : notification.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            ) : (
              <Info className="w-4 h-4 text-blue-400" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function AppContent() {
  const { currentUser, notification } = useApp();

  if (!currentUser) {
    return (
      <>
        <LoginView />
        {notification && (
          <div className="fixed bottom-5 right-5 z-50 animate-bounce">
            <div
              className={`flex items-center space-x-2.5 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-semibold backdrop-blur-md ${
                notification.type === 'success'
                  ? 'bg-emerald-950/90 text-emerald-200 border-emerald-600'
                  : notification.type === 'error'
                  ? 'bg-rose-950/90 text-rose-200 border-rose-600'
                  : 'bg-blue-950/90 text-blue-200 border-blue-600'
              }`}
            >
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : notification.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-400" />
              ) : (
                <Info className="w-4 h-4 text-blue-400" />
              )}
              <span>{notification.message}</span>
            </div>
          </div>
        )}
      </>
    );
  }

  return <MainLayout />;
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
