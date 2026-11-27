// Strict RBAC Definitions for CTECH Canteen MIS
export const ROLES = {
  CASHIER: {
    id: 'CASHIER',
    name: 'Thu ngân / Bán hàng',
    userTitle: 'Đặng Thùy Linh',
    badge: 'bg-indigo-900/60 text-indigo-300 border-indigo-700',
    description: 'Thao tác bán hàng tại quầy POS, quét voucher CBNV Ctool, in bill.',
    defaultTab: 'pos',
    allowedTabs: ['pos', 'cashier_history']
  },
  CHEF: {
    id: 'CHEF',
    name: 'Bếp trưởng',
    userTitle: 'Nguyễn Văn Đạt',
    badge: 'bg-emerald-900/60 text-emerald-300 border-emerald-700',
    description: 'Quản lý định mức BOM, xem suất ăn Ctool, lập đề xuất mua hàng (PR), chạy DSS.',
    defaultTab: 'menu_bom',
    allowedTabs: ['menu_bom', 'dss', 'chef_pr', 'ctool_monitor']
  },
  TCHC: {
    id: 'TCHC',
    name: 'Trưởng phòng TCHC',
    userTitle: 'Trần Thị Mai',
    badge: 'bg-blue-900/60 text-blue-300 border-blue-700',
    description: 'Thẩm định nhu cầu & phê duyệt đề xuất mua hàng Cấp 2, giám sát suất ăn Ctool.',
    defaultTab: 'approval_l2',
    allowedTabs: ['approval_l2', 'ctool_monitor', 'general_reports']
  },
  ACCOUNTANT: {
    id: 'ACCOUNTANT',
    name: 'Kế toán trưởng',
    userTitle: 'Lê Hoàng Long',
    badge: 'bg-amber-900/60 text-amber-300 border-amber-700',
    description: 'Thẩm định đơn giá NCC, ngân sách & phê duyệt Cấp 3, báo cáo tài chính đối soát.',
    defaultTab: 'approval_l3',
    allowedTabs: ['approval_l3', 'suppliers', 'financial_reports']
  },
  CHAIRMAN: {
    id: 'CHAIRMAN',
    name: 'Chủ tịch Hội đồng trường',
    userTitle: 'TS. Phạm Minh Tuấn',
    badge: 'bg-rose-900/60 text-rose-300 border-rose-700',
    description: 'Executive Dashboard, thẩm quyền ký phê duyệt chi Cấp 4 (ban hành PO chính thức).',
    defaultTab: 'executive_dashboard',
    allowedTabs: ['executive_dashboard', 'approval_l4']
  },
  STOREKEEPER: {
    id: 'STOREKEEPER',
    name: 'Thủ kho',
    userTitle: 'Bùi Đức Thắng',
    badge: 'bg-cyan-900/60 text-cyan-300 border-cyan-700',
    description: 'Tiếp nhận hàng theo PO đã duyệt, ghi nhận Lô & HSD (FEFO), kiểm kê chênh lệch BM03.',
    defaultTab: 'inventory_receive',
    allowedTabs: ['inventory_receive', 'inventory_stock', 'inventory_fefo', 'inventory_audit']
  },
  ADMIN: {
    id: 'ADMIN',
    name: 'Quản trị viên HTTT',
    userTitle: 'Ban Quản trị',
    badge: 'bg-purple-900/60 text-purple-300 border-purple-700',
    description: 'Toàn quyền quản trị hệ thống, tài khoản và giám sát toàn bộ hoạt động vận hành.',
    defaultTab: 'admin_dashboard',
    allowedTabs: [
      'admin_dashboard',
      'pos',
      'menu_bom',
      'dss',
      'chef_pr',
      'approval_l2',
      'approval_l3',
      'approval_l4',
      'inventory_receive',
      'inventory_stock',
      'inventory_fefo',
      'inventory_audit',
      'ctool_monitor',
      'financial_reports',
      'general_reports',
      'suppliers',
      'cashier_history',
      'admin_users',
      'audit_logs'
    ]
  }
};
