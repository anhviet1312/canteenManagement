import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { History, ShieldCheck, Search, Clock, User } from 'lucide-react';

export default function AuditLogsView() {
  const { auditLogs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter(log =>
    log.user_info.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getActionBadge = (action) => {
    if (action.includes('PHÊ_DUYỆT')) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    if (action.includes('TỪ_CHỐI')) return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
    if (action.includes('TẠO_ĐỀ_XUẤT')) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    if (action.includes('NHẬP_KHO') || action.includes('KIỂM_KÊ')) return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
    if (action.includes('BÁN') || action.includes('TRỪ_TỒN')) return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              An Toàn & Kiểm Toán Hệ Thống (Audit Trail)
            </span>
            <span className="text-xs text-slate-400">Dữ liệu ghi vết tự động</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Lịch Sử Thao Tác & Nhật Ký Kiểm Toán Toàn Hệ Thống</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Lưu vết tự động mọi hành vi: bán hàng, trừ kho định mức BOM, luồng phê duyệt 4 cấp và đồng bộ Ctool.
          </p>
        </div>

        <span className="text-xs font-mono font-bold text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          Tổng số logs: {auditLogs.length}
        </span>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center text-xs">
          <div className="relative w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo người dùng, hành động, chi tiết..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <span className="text-slate-400">Bảng `audit_logs` ({filteredLogs.length} bản ghi)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3 w-40">Thời Gian</th>
                <th className="p-3">Người Thực Hiện</th>
                <th className="p-3">Hành Vi / Sự Kiện</th>
                <th className="p-3">Đối Tượng Tác Động</th>
                <th className="p-3">Chi Tiết Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono text-slate-400 whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {log.timestamp}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-white whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-400" />
                      {log.user_info}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getActionBadge(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-slate-200 whitespace-nowrap">{log.target}</td>
                  <td className="p-3 text-slate-400 font-mono text-[11px]">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
