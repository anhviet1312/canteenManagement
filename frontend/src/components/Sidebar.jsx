import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  ShoppingCart,
  UtensilsCrossed,
  BrainCircuit,
  ClipboardList,
  FileCheck2,
  Boxes,
  Calendar,
  Users2,
  BarChart3,
  Building,
  History,
  ShieldCheck,
  UserCog,
  DollarSign,
  PackageCheck,
  AlertTriangle,
  Receipt
} from 'lucide-react';

export default function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    ROLES,
    purchaseRequests,
    materials
  } = useApp();

  const roleConfig = ROLES[currentUser.role] || ROLES.CHEF;
  const allowedTabs = roleConfig.allowedTabs || [];

  // Badges calculations
  const pendingL2 = purchaseRequests.filter(p => p.status === 'PENDING_TCHC').length;
  const pendingL3 = purchaseRequests.filter(p => p.status === 'PENDING_ACCOUNTANT').length;
  const pendingL4 = purchaseRequests.filter(p => p.status === 'PENDING_CHAIRMAN').length;
  const pendingReceivePOs = purchaseRequests.filter(
    p => p.status === 'APPROVED' && p.warehouse_status === 'PENDING_RECEIPT'
  ).length;
  const lowStockCount = materials.filter(m => m.current_stock <= m.safety_stock).length;

  // Master definition of all possible navigation tabs
  const allNavItems = [
    // 1. CASHIER
    { id: 'pos', label: 'Quầy Bán Hàng POS', icon: ShoppingCart },
    { id: 'cashier_history', label: 'Lịch Sử Đơn Của Ca', icon: Receipt },

    // 2. CHEF
    { id: 'menu_bom', label: 'Thực Đơn & Định Mức BOM', icon: UtensilsCrossed },
    { id: 'dss', label: 'Hỗ Trợ Ra Quyết Định (DSS)', icon: BrainCircuit, extraBadge: 'MIS' },
    { id: 'chef_pr', label: 'Đề Xuất Mua Hàng (PR)', icon: ClipboardList },

    // 3. TCHC
    { id: 'approval_l2', label: 'Phê Duyệt Nhu Cầu (Cấp 2)', icon: FileCheck2, badge: pendingL2 },

    // 4. ACCOUNTANT
    { id: 'approval_l3', label: 'Thẩm Định Giá & NS (Cấp 3)', icon: DollarSign, badge: pendingL3 },
    { id: 'suppliers', label: 'Nhà Cung Cấp & Báo Giá', icon: Building },
    { id: 'financial_reports', label: 'Báo Cáo Tài Chính & Đối Soát', icon: BarChart3 },

    // 5. CHAIRMAN
    { id: 'executive_dashboard', label: 'Dashboard Lãnh Đạo', icon: LayoutDashboard },
    { id: 'approval_l4', label: 'Ký Duyệt Chi (Cấp 4 - PO)', icon: FileCheck2, badge: pendingL4 },

    // 6. STOREKEEPER
    { id: 'inventory_receive', label: 'Tiếp Nhận PO Đã Duyệt', icon: PackageCheck, badge: pendingReceivePOs },
    { id: 'inventory_stock', label: 'Tồn Kho Nguyên Vật Liệu', icon: Boxes, badge: lowStockCount > 0 ? `${lowStockCount} thiếu` : null },
    { id: 'inventory_fefo', label: 'Quản Lý Lô & Hạn Dùng (FEFO)', icon: Calendar },

    // Shared / Monitoring
    { id: 'ctool_monitor', label: 'Kế Hoạch Suất Ăn Ctool', icon: Users2 },
    { id: 'general_reports', label: 'Báo Cáo Tổng Hợp Vận Hành', icon: BarChart3 },

    // ADMIN ONLY
    { id: 'admin_dashboard', label: 'Tổng Quan Hệ Thống', icon: LayoutDashboard },
    { id: 'admin_users', label: 'Quản Trị Người Dùng & RBAC', icon: UserCog },
    { id: 'audit_logs', label: 'Nhật Ký Kiểm Toán (Audit)', icon: History }
  ];

  // STRICT RBAC FILTER: ONLY RENDER ITEMS IN ALLOWED TABS!
  const visibleNavItems = allNavItems.filter(item => allowedTabs.includes(item.id));

  return (
    <aside className="w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col justify-between h-[calc(100vh-65px)] sticky top-[65px] select-none">
      <div className="p-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
          <span>Chức Năng Được Phép</span>
          <span className="text-slate-600 font-mono text-[9px]">{visibleNavItems.length} mục</span>
        </div>

        {visibleNavItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex items-center space-x-1.5">
                {item.extraBadge && (
                  <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30">
                    {item.extraBadge}
                  </span>
                )}
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white text-blue-700' : 'bg-amber-500 text-slate-950'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* User Info footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{currentUser.full_name}</p>
            <p className="text-[10px] text-slate-400 truncate">{currentUser.department}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
