import React from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, Database, Users, Boxes, ClipboardCheck, History } from 'lucide-react';

export default function AdminDashboardView() {
  const { users, materials, purchaseRequests, orders, auditLogs, ctoolMeals } = useApp();

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 border border-purple-500/30 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500 text-white shadow">
              Quản Trị Hệ Thống (System Admin)
            </span>
            <span className="text-xs text-slate-400">Trạng Thái Hệ Thống: Trực Tuyến</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Bảng Điều Khiển Quản Trị Hệ Thống Toàn Diện</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Giám sát hoạt động vận hành, phân quyền người dùng và luồng dữ liệu 7 phân hệ.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-slate-400">Tài khoản & Phân quyền:</span>
          <div className="text-2xl font-bold text-white font-mono">{users.length} users</div>
          <p className="text-[11px] text-slate-500">7 vai trò nghiệp vụ (RBAC)</p>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-slate-400">Nguyên vật liệu kho:</span>
          <div className="text-2xl font-bold text-cyan-400 font-mono">{materials.length} mặt hàng</div>
          <p className="text-[11px] text-slate-500">Danh mục định mức quản lý</p>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-slate-400">Hồ sơ duyệt 4 cấp:</span>
          <div className="text-2xl font-bold text-amber-400 font-mono">{purchaseRequests.length} phiếu</div>
          <p className="text-[11px] text-slate-500">Workflow Purchase Requisitions</p>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-slate-400">Nhật ký Audit Log:</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono">{auditLogs.length} sự kiện</div>
          <p className="text-[11px] text-slate-500">Lưu vết bất biến (Immutable)</p>
        </div>
      </div>
    </div>
  );
}
