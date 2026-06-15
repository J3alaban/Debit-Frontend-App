import { FC, useState, useEffect } from "react";
import { Config } from "../helpers/Config";
import { useAppDispatch } from "../redux/hooks";
import { updateLoading } from "../redux/features/homeSlice";

type ProductBody = {
  id?: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  categorySlug: string;
  brand: string;
  sku: string;
  discountPercentage: number;
  weight: number;
  dimensions: { width: number; height: number; depth: number };
  images: string[];
  size: string;
};

interface Category {
  id: number;
  name: string;
  slug: string;
}

const ProductManagement: FC = () => {
  const [products, setProducts] = useState<ProductBody[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const dispatch = useAppDispatch();

  const emptyForm: ProductBody = {
    title: "", description: "", price: 0, stock: 0,
    categorySlug: "", brand: "", sku: "", discountPercentage: 0,
    weight: 0, dimensions: { width: 0, height: 0, depth: 0 },
    images: [], size: ""
  };

  const [form, setForm] = useState<ProductBody>(emptyForm);

  // Kategori Yükleme
  useEffect(() => {
    dispatch(updateLoading(true));
    fetch(`${Config.api.baseUrl}/api/v1/categories`)
        .then(res => res.json())
        .then((data: Category[]) => {
          setCategories(data);
          localStorage.setItem("categories", JSON.stringify(data));
        })
        .catch(err => console.error("Kategoriler yüklenirken hata:", err))
        .finally(() => dispatch(updateLoading(false)));
  }, [dispatch]);

  // Ürün Yükleme
  useEffect(() => {
    dispatch(updateLoading(true));
    fetch(`${Config.api.baseUrl}/api/v1/products`)
        .then(res => res.json())
        .then((data: { content: ProductBody[] }) => {
          setProducts(data.content);
          localStorage.setItem("products", JSON.stringify(data.content));
        })
        .finally(() => dispatch(updateLoading(false)));
  }, [dispatch]);

  const openModal = (product?: ProductBody) => {
    if (product) {
      setForm({ ...product, categorySlug: product.categorySlug || "" });
      setIsEditing(true);
    } else {
      setForm(emptyForm);
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const deleteProduct = async (id: number) => {
    if (!window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    await fetch(`${Config.api.baseUrl}/api/v1/products/${id}`, { method: "DELETE" });
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
  };

  const handleSave = async () => {
    const url = isEditing
        ? `${Config.api.baseUrl}/api/v1/products/${form.id}`
        : `${Config.api.baseUrl}/api/v1/products`;

    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const savedProduct = await res.json();
      const updatedList = isEditing
          ? products.map(p => p.id === form.id ? form : p)
          : [...products, savedProduct];

      setProducts(updatedList);
      setIsModalOpen(false);
    }
  };

  return (
      <div className="min-h-screen bg-gray-50 p-2 md:p-8">
        <div className="max-w-7xl mx-auto">

          {/* Header Kartı */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Ürün Yönetim Paneli</h1>
              <p className="text-gray-500 text-xs md:text-sm">Toplam {products.length} kayıtlı ürün bulundu.</p>
            </div>
            <button
                onClick={() => openModal()}
                className="w-full md:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span className="text-xl">+</span> Yeni Ürün Ekle
            </button>
          </div>

          {/* Tablo Konteynırı */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <div className="max-h-[720px] overflow-y-auto text-sm">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                  <tr className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                    <th className="px-4 md:px-6 py-4">Ürün</th>
                    <th className="px-6 py-4 hidden lg:table-cell">Kategori/Marka</th>
                    <th className="px-4 md:px-6 py-4 text-center">Fiyat & Stok</th>
                    <th className="px-4 md:px-6 py-4 text-right">İşlemler</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-[13px] md:text-sm">
                  {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-4 md:px-6 py-4 max-w-[150px] md:max-w-none">
                          <div className="font-semibold text-gray-800 truncate">{p.title}</div>
                          <div className="text-[10px] text-gray-500 lg:hidden">{p.brand}</div>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <div className="text-gray-700">{p.categorySlug}</div>
                          <div className="text-xs text-gray-400">{p.brand}</div>
                        </td>
                        <td className="px-4 md:px-6 py-4 text-center">
                          <div className="font-bold text-indigo-600 whitespace-nowrap">{p.price} TL</div>
                          <div className={`text-[10px] font-bold ${p.stock < 5 ? 'text-red-500' : 'text-gray-400'}`}>
                            Stok: {p.stock}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 text-right">
                          <div className="flex justify-end gap-1 md:gap-2">
                            <button onClick={() => openModal(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">Düzenle</button>
                            <button onClick={() => p.id && deleteProduct(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">Sil</button>
                          </div>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Dinamik Responsive Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-none sm:rounded-3xl shadow-2xl w-full max-w-2xl h-full sm:h-auto max-h-screen sm:max-h-[90vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                  <h2 className="text-lg font-bold text-gray-800">{isEditing ? 'Ürünü Güncelle' : 'Yeni Ürün Ekle'}</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2">✕</button>
                </div>

                {/* Form Gövdesi */}
                <div className="p-6 overflow-y-auto grow grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="col-span-1 sm:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Ürün Başlığı</label>
                    <input className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Fiyat</label>
                    <input type="number" className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={form.price} onChange={e => setForm({...form, price: +e.target.value})} />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Stok</label>
                    <input type="number" className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={form.stock} onChange={e => setForm({...form, stock: +e.target.value})} />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Beden / Özellik</label>
                    <input className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={form.size} onChange={e => setForm({...form, size: e.target.value})} placeholder="Örn: 50L, XL, 10 bar" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Kategori</label>
                    <select
                        className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white cursor-pointer"
                        value={form.categorySlug}
                        onChange={(e) => setForm({ ...form, categorySlug: e.target.value })}
                    >
                      <option value="">Seçiniz</option>
                      {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
                    </select>
                  </div>

                  {/* Görsel Yükleme Alanı */}
                  <div className="col-span-1 sm:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Görseller ({form.images?.length || 0} / 5)</label>
                    <div className="flex flex-wrap gap-2 border border-gray-200 p-3 rounded-xl bg-gray-50/50">
                      {form.images?.map((img, index) => (
                          <div key={index} className="relative w-16 h-16 rounded-lg overflow-hidden border border-indigo-200 shadow-sm">
                            <img src={img} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, images: form.images.filter((_, i) => i !== index) })}
                                className="absolute top-0 right-0 bg-red-500 text-white text-[10px] p-0.5 rounded-bl-lg"
                            >✕</button>
                          </div>
                      ))}
                      {(!form.images || form.images.length < 5) && (
                          <label className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white hover:border-indigo-500 transition-all">
                            <span className="text-gray-400 text-xl">+</span>
                            <input
                                type="file" multiple accept="image/*" className="hidden"
                                onChange={(e) => {
                                  const files = Array.from(e.target.files || []);
                                  const limit = 5 - (form.images?.length || 0);
                                  files.slice(0, limit).forEach(file => {
                                    const reader = new FileReader();
                                    reader.onloadend = () => setForm(prev => ({ ...prev, images: [...(prev.images || []), reader.result as string] }));
                                    reader.readAsDataURL(file);
                                  });
                                }}
                            />
                          </label>
                      )}
                    </div>
                  </div>

                  <div className="col-span-1 sm:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Marka</label>
                    <input className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} />
                  </div>

                  <div className="col-span-1 sm:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Açıklama</label>
                    <textarea rows={3} className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3 sticky bottom-0">
                  <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 font-semibold text-gray-500 order-2 sm:order-1">Vazgeç</button>
                  <button onClick={handleSave} className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg order-1 sm:order-2 active:scale-95 transition-all">
                    {isEditing ? 'Kaydet' : 'Ürünü Oluştur'}
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default ProductManagement;