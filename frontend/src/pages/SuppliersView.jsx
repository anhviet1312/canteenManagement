import React from 'react';
import { Building, Phone, MapPin } from 'lucide-react';

export default function SuppliersView() {
  const suppliers = [
    { id: 'sup-1', name: 'Công ty CP Chăn nuôi C.P. Việt Nam', contact: '0912.345.678 (Mr. Tuấn)', address: 'KCN Biên Hòa 2, Đồng Nai', category: 'Thực phẩm tươi sống (Thịt sườn, gà, tôm)', contract: 'HĐK-2026/CP-CTECH', status: 'Đang hiệu lực' },
    { id: 'sup-2', name: 'Đại siêu thị Metro Thăng Long (MM Mega Market)', contact: '0988.765.432 (Ms. Lan)', address: 'Phạm Văn Đồng, Hà Nội', category: 'Lương thực khô, dầu ăn, cà phê', contract: 'HĐK-2026/METRO-01', status: 'Đang hiệu lực' },
    { id: 'sup-3', name: 'Hợp tác xã Rau sạch Công nghệ cao Ba Vì', contact: '0904.556.778 (Mr. Hưng)', address: 'Huyện Ba Vì, Hà Nội', category: 'Rau củ quả tươi tiêu chuẩn VietGAP, trứng gà sạch', contract: 'HĐK-2026/BAVI-GAP', status: 'Đang hiệu lực' },
    { id: 'sup-4', name: 'Công ty Thực phẩm Thực Dưỡng CTECH Food', contact: '024.3322.1100', address: 'Khu công nghệ cao Hòa Lạc', category: 'Gia vị, bột nêm, thực phẩm đóng gói', contract: 'HĐK-2026/CTECH-FD', status: 'Đang hiệu lực' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Phân Hệ Kế Toán Trưởng
            </span>
            <span className="text-xs text-slate-400">Supplier & Framework Contract Management</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Danh Mục Nhà Cung Cấp & Hợp Đồng Khung Báo Giá</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Phòng Kế toán quản lý thông tin nhà cung ứng, thẩm định đơn giá niêm yết và theo dõi công nợ mua hàng thực phẩm.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suppliers.map(s => (
          <div key={s.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{s.name}</h3>
                  <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                    {s.contract}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                {s.status}
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Mặt hàng cung cấp: <strong className="text-white">{s.category}</strong>
            </p>

            <div className="text-xs text-slate-400 space-y-1 pt-1 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>Liên hệ: <strong className="text-slate-200">{s.contact}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>Địa chỉ: {s.address}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
