import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UtensilsCrossed, Layers, CheckCircle2, Edit2, Save, X, AlertCircle } from 'lucide-react';

export default function ChefMenuBOMView() {
  const { products, updateRecipe, currentUser } = useApp();
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [editModalData, setEditModalData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const isChefOrAdmin = currentUser?.role === 'CHEF' || currentUser?.role === 'ADMIN';

  // Automatically track updated product from context
  const activeProduct = products.find(p => p.id === (selectedProductId || products[0]?.id)) || products[0];

  const calculateCost = (prod) => {
    if (!prod || !prod.recipes) return 0;
    return prod.recipes.reduce((sum, r) => sum + (r.amount || r.quantity * (r.avg_cost || 0)), 0);
  };

  const cost = activeProduct ? calculateCost(activeProduct) : 0;
  const price = activeProduct ? activeProduct.price : 0;
  const profitMargin = price > 0 ? (((price - cost) / price) * 100).toFixed(1) : 0;

  const handleOpenEdit = (rec) => {
    setEditModalData({
      product: activeProduct,
      recipe: rec,
      newQty: rec.quantity
    });
  };

  const handleSaveRecipe = async (e) => {
    e.preventDefault();
    if (!editModalData || !editModalData.newQty) return;
    setIsSaving(true);
    const success = await updateRecipe(
      editModalData.product.id,
      editModalData.recipe.material_id,
      Number(editModalData.newQty)
    );
    setIsSaving(false);
    if (success) {
      setEditModalData(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Phân Hệ Bếp Trưởng
            </span>
            <span className="text-xs text-slate-400">Bill of Materials (BOM) & Recipe Formulation</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Quản Lý Thực Đơn & Bảng Định Mức Chế Biến</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Bếp trưởng thiết lập tỷ lệ tiêu hao nguyên vật liệu cho từng món. Hệ thống tự động bóc tách và trừ kho khi quầy POS bán món.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Product List */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-xs">
            <span className="font-bold text-white">Danh Mục Món Ăn ({products.length})</span>
            <span className="text-slate-500">Bấm để xem định mức</span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {products.map(prod => {
              const isSelected = activeProduct?.id === prod.id;
              const prodCost = calculateCost(prod);

              return (
                <div
                  key={prod.id}
                  onClick={() => setSelectedProductId(prod.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between text-xs ${
                    isSelected ? 'bg-blue-600/20 border-blue-500 shadow' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{prod.image}</span>
                    <div>
                      <h4 className="font-bold text-white">{prod.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">{prod.code}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-emerald-400 font-mono">{prod.price.toLocaleString()} đ</div>
                    <div className="text-[10px] text-slate-500">Cost: {prodCost.toLocaleString()} đ</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: BOM Breakdown */}
        {activeProduct && (
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <span className="text-4xl p-2 bg-slate-950 rounded-2xl border border-slate-800">
                  {activeProduct.image}
                </span>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-white">{activeProduct.name}</h3>
                    {activeProduct.is_meal_eligible && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Áp dụng Suất Ăn Ctool
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">Mã thành phẩm: {activeProduct.code}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-xs">
                <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-right">
                  <span className="text-slate-400 block text-[10px]">Giá bán lẻ HSSV:</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">{activeProduct.price.toLocaleString()} đ</span>
                </div>
                <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-right">
                  <span className="text-slate-400 block text-[10px]">Giá thành tiêu hao (Cost):</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">{cost.toLocaleString()} đ</span>
                </div>
                <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-right">
                  <span className="text-slate-400 block text-[10px]">Biên lợi nhuận gộp:</span>
                  <span className="font-mono font-bold text-cyan-400 text-sm">+{profitMargin}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-400" />
                  Bảng Định Mức Cấu Thành Nguyên Liệu (BOM Recipe)
                </h4>
                <span className="text-slate-400 text-[11px]">Định mức nguyên vật liệu tiêu chuẩn</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3">STT</th>
                      <th className="p-3">Tên Nguyên Vật Liệu</th>
                      <th className="p-3 text-right">Định Mức Tiêu Hao (1 suất)</th>
                      <th className="p-3 text-right">Đơn Giá Vốn TB</th>
                      <th className="p-3 text-right">Chi Phí Cấu Thành</th>
                      <th className="p-3 text-center">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {activeProduct.recipes && activeProduct.recipes.length > 0 ? (
                      activeProduct.recipes.map((rec, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/40">
                          <td className="p-3 text-slate-500 w-10">{idx + 1}</td>
                          <td className="p-3 font-semibold text-white">{rec.material_name}</td>
                          <td className="p-3 text-right font-mono font-bold text-blue-400">
                            {rec.quantity} {rec.unit}
                          </td>
                          <td className="p-3 text-right font-mono text-slate-400">
                            {rec.avg_cost.toLocaleString()} đ
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-emerald-400">
                            {rec.amount.toLocaleString()} đ
                          </td>
                          <td className="p-3 text-center">
                            {isChefOrAdmin ? (
                              <button
                                onClick={() => handleOpenEdit(rec)}
                                className="px-2.5 py-1 bg-slate-800 hover:bg-cyan-600 hover:text-white text-cyan-300 rounded-lg text-[11px] font-semibold border border-slate-700 transition flex items-center gap-1 mx-auto"
                                title="Chỉnh sửa định mức nguyên liệu"
                              >
                                <Edit2 className="w-3 h-3" />
                                <span>Sửa</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-500 italic">Chỉ xem</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="p-6 text-center text-slate-500">
                          Mặt hàng đồ uống / đóng gói sẵn không yêu cầu bóc tách nguyên liệu.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-blue-950/30 border border-blue-800/60 rounded-xl p-3.5 text-xs text-blue-200 flex items-start space-x-2.5">
              <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Tự động trừ kho theo định mức:</strong>
                Khi quầy POS thu ngân bán món này, hệ thống sẽ tự động bóc tách định mức BOM và khấu trừ trực tiếp khối lượng nguyên liệu tương ứng trong kho hàng.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Chỉnh Sửa Định Mức BOM */}
      {editModalData && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-cyan-400" />
                Chỉnh Sửa Định Mức BOM (1 Suất)
              </h3>
              <button
                onClick={() => setEditModalData(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕ Đóng
              </button>
            </div>

            <form onSubmit={handleSaveRecipe} className="space-y-4 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Món ăn:</span>
                  <span className="font-bold text-white">{editModalData.product.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Nguyên vật liệu:</span>
                  <span className="font-bold text-cyan-300">{editModalData.recipe.material_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Đơn giá vốn TB:</span>
                  <span className="font-mono text-slate-300">{editModalData.recipe.avg_cost.toLocaleString()} đ/{editModalData.recipe.unit}</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-2">
                  <span className="text-slate-400">Định mức hiện tại:</span>
                  <span className="font-mono font-bold text-slate-300">{editModalData.recipe.quantity} {editModalData.recipe.unit}</span>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1.5">
                  Định mức tiêu hao mới cho 1 suất ({editModalData.recipe.unit}):
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.001"
                  required
                  value={editModalData.newQty}
                  onChange={e => setEditModalData({ ...editModalData, newQty: e.target.value })}
                  className="w-full bg-slate-950 border border-cyan-500 rounded-xl px-3 py-2 text-white font-mono font-bold text-base focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Ví dụ: 150g = 0.15 kg, muốn tăng thành 180g nhập 0.18 kg.
                </p>
              </div>

              {/* Live Preview */}
              {editModalData.newQty && !isNaN(Number(editModalData.newQty)) && (
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span>Chi phí nguyên liệu mới:</span>
                    <span className="font-bold text-emerald-400">
                      {(Math.round(Number(editModalData.newQty) * editModalData.recipe.avg_cost)).toLocaleString()} đ
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Chênh lệch chi phí (Cost):</span>
                    <span className={Number(editModalData.newQty) >= editModalData.recipe.quantity ? 'text-amber-400 font-bold' : 'text-cyan-400 font-bold'}>
                      {Number(editModalData.newQty) >= editModalData.recipe.quantity ? '+' : ''}
                      {(Math.round((Number(editModalData.newQty) - editModalData.recipe.quantity) * editModalData.recipe.avg_cost)).toLocaleString()} đ
                    </span>
                  </div>
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalData(null)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold transition"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold shadow-md shadow-cyan-600/30 transition flex items-center justify-center space-x-1.5"
                >
                  {isSaving ? (
                    <span>Đang lưu...</span>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Lưu Định Mức Mới</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
