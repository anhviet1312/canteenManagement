import React from 'react';
import { useApp } from '../context/AppContext';
import { UserCog, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AdminUsersView() {
  const { users, ROLES, switchUser, currentUser } = useApp();

  return (
    <div className="p-6 space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Quản Trị Người Dùng & Phân Quyền
            </span>
            <span className="text-xs text-slate-400">Role-Based Access Control (RBAC)</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Danh Sách Tài Khoản & Ma Trận Phân Quyền Nghiệp Vụ</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Quản trị viên cấu hình phân quyền theo đúng ma trận Use Case, ngăn chặn việc rò rỉ hành động sai thẩm quyền.
          </p>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center text-xs">
          <span className="font-semibold text-white">Danh Sách Tài Khoản Người Dùng & Phân Quyền</span>
          <span className="text-slate-400">Tổng số: {users.length} tài khoản</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Mã User</th>
                <th className="p-3">Username</th>
                <th className="p-3">Họ và Tên</th>
                <th className="p-3">Khoa / Phòng Ban</th>
                <th className="p-3">Vai Trò Nghiệp Vụ</th>
                <th className="p-3">Mô Tả Thẩm Quyền</th>
                <th className="p-3 text-center">Trải Nghiệm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {users.map(u => {
                const rConf = ROLES[u.role] || ROLES.CHEF;
                const isSelected = u.id === currentUser.id;

                return (
                  <tr key={u.id} className={`hover:bg-slate-800/40 ${isSelected ? 'bg-blue-950/20' : ''}`}>
                    <td className="p-3 font-mono text-slate-400">{u.id}</td>
                    <td className="p-3 font-mono font-semibold text-white">{u.username}</td>
                    <td className="p-3 font-semibold text-white">{u.full_name}</td>
                    <td className="p-3 text-slate-400">{u.department}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${rConf.badge}`}>
                        {rConf.name}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 text-[11px] max-w-xs">{rConf.description}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => switchUser(u.id)}
                        disabled={isSelected}
                        className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition ${
                          isSelected
                            ? 'bg-blue-600/30 text-blue-300 border border-blue-500 cursor-default'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                      >
                        {isSelected ? 'Đang chọn' : 'Đóng vai'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
