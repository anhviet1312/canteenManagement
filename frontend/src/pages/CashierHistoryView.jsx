import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Receipt, Search, DollarSign, CreditCard, Banknote, Sparkles } from 'lucide-react';

export default function CashierHistoryView() {
  const { orders, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter orders by cashier if not admin
  const cashierOrders = currentUser.role === 'ADMIN'
    ? orders
    : orders.filter(o => o.cashier_name.includes(currentUser.full_name) || o.cashier_name.includes('Linh'));

  const filteredOrders = cashierOrders.filter(o =>
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.payment_method.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalShiftRevenue = cashierOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const cashTotal = cashierOrders.filter(o => o.payment_method === 'CASH').reduce((s, o) => s + o.total_amount, 0);
  const qrTotal = cashierOrders.filter(o => o.payment_method === 'VIETQR').reduce((s, o) => s + o.total_amount, 0);
  const ctoolTotal = cashierOrders.filter(o => o.payment_method === 'CTOOL_VOUCHER').length;

  return (
    <div className="p-6 space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Phân Hệ Thu Ngân
            </span>
            <span className="text-xs text-slate-400">Cashier Shift Sales History</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Lịch Sử Giao Dịch Bán Hàng Trong Ca</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Thu ngân: <strong className="text-white">{currentUser.full_name}</strong> • Lịch sử giao dịch lưu trữ trên hệ thống
          </p>
        </div>
      </div>

      {/* KPI Cards for cashier */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-slate-400">Tổng Tiền Thu Về Trong Ca:</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono">{totalShiftRevenue.toLocaleString()} đ</div>
          <p className="text-[11px] text-slate-500">{cashierOrders.length} hóa đơn đã hoàn tất</p>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-slate-400">Phân Loại Tiền Mặt / VietQR:</span>
          <div className="text-sm font-bold text-white flex items-center gap-2 pt-1 font-mono">
            <span className="text-emerald-400">{cashTotal.toLocaleString()}đ TM</span>
            <span className="text-slate-600">•</span>
            <span className="text-blue-400">{qrTotal.toLocaleString()}đ QR</span>
          </div>
          <p className="text-[11px] text-slate-500">Khớp số liệu bàn giao két tiền</p>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-slate-400">Suất Ăn CBNV Ctool Đã Cấp:</span>
          <div className="text-2xl font-bold text-cyan-400 font-mono">{ctoolTotal} suất</div>
          <p className="text-[11px] text-slate-500">Đối soát voucher trường học</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center text-xs">
          <div className="relative w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo mã đơn, tên khách..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <span className="text-slate-400">Đơn hàng trong cơ sở dữ liệu: <strong className="text-white">{filteredOrders.length}</strong></span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Mã Đơn Hàng</th>
                <th className="p-3">Thời Gian</th>
                <th className="p-3">Khách Hàng</th>
                <th className="p-3 text-right">Tổng Tiền</th>
                <th className="p-3 text-center">Hình Thức</th>
                <th className="p-3">Chi Tiết Món</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredOrders.map(ord => (
                <tr key={ord.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-blue-400">{ord.id}</td>
                  <td className="p-3 text-slate-400 font-mono">{ord.time}</td>
                  <td className="p-3 font-semibold text-white">{ord.customer_name}</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-400">
                    {ord.total_amount.toLocaleString()} đ
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {ord.payment_method}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">
                    {ord.items?.map(it => `${it.product_name || it.name} (x${it.quantity})`).join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
