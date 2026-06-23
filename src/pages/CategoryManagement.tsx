import { useState, useEffect, FC } from "react";
import { Config } from "../helpers/Config";
import { useAppSelector } from "../redux/hooks";
import { Navigate } from "react-router-dom";

type CategoryBody = {
  id?: number;
  slug: string;
  name: string;
  url?: string;
};

type SubCategoryBody = {
  id?: number;
  name: string;
  categoryId: number;
  categoryName?: string;
};

const CategoryManagement: FC = () => {
  const { role, isLoggedIn } = useAppSelector((state) => state.authReducer);

  const [categories, setCategories] = useState<CategoryBody[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<CategoryBody>({ slug: "", name: "" });
  const [loading, setLoading] = useState(false);

  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(null);
  const [subCategories, setSubCategories] = useState<Record<number, SubCategoryBody[]>>({});
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isSubEditing, setIsSubEditing] = useState(false);
  const [subForm, setSubForm] = useState<SubCategoryBody>({ name: "", categoryId: 0 });
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  if (!isLoggedIn || role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${Config.api.baseUrl}/api/v1/categories`);
      if (res.ok) setCategories(await res.json());
    } catch (error) {
      console.error("Kategoriler yüklenirken hata:", error);
    }
  };

  const fetchSubCategories = async (categoryId: number) => {
    try {
      const res = await fetch(`${Config.api.baseUrl}/api/v1/subcategories/${categoryId}`);
      if (res.ok) {
        const data: SubCategoryBody[] = await res.json();
        setSubCategories(prev => ({ ...prev, [categoryId]: data }));
      }
    } catch (error) {
      console.error("Alt kategoriler yüklenirken hata:", error);
    }
  };

  const toggleExpand = (categoryId: number) => {
    if (expandedCategoryId === categoryId) {
      setExpandedCategoryId(null);
    } else {
      setExpandedCategoryId(categoryId);
      if (!subCategories[categoryId]) fetchSubCategories(categoryId);
    }
  };

  // --- Kategori CRUD ---
  const handleSave = async () => {
    if (!form.name.trim()) return alert("Sınıflandırma/Kategori adı boş olamaz.");
    setLoading(true);
    const token = localStorage.getItem("token");
    const url = isEditing
      ? `${Config.api.baseUrl}/api/v1/categories/${form.id}`
      : `${Config.api.baseUrl}/api/v1/categories`;

    try {
      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (res.ok) { await fetchCategories(); closeModal(); }
      else { const err = await res.json(); alert(err.message || "İşlem başarısız."); }
    } catch (error) {
      console.error("Hata:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bu kategori/departman kaydını silmek istediğinize emin misiniz?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${Config.api.baseUrl}/api/v1/categories/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) setCategories(categories.filter((c) => c.id !== id));
      else alert("Silme işlemi başarısız. Bu kategoriye bağlı alt sınıflar olabilir.");
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  };

  const openModal = (cat?: CategoryBody) => {
    if (cat) { setForm({ ...cat }); setIsEditing(true); }
    else { setForm({ slug: "", name: "" }); setIsEditing(false); }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setForm({ slug: "", name: "" });
  };

  // --- Alt Kategori CRUD ---
  const handleSubSave = async () => {
    if (!subForm.name.trim()) return alert("Alt kategori adı boş olamaz.");
    setSubLoading(true);
    const token = localStorage.getItem("token");
    const url = isSubEditing
      ? `${Config.api.baseUrl}/api/v1/subcategories/${subForm.id}`
      : `${Config.api.baseUrl}/api/v1/subcategories`;

    try {
      const res = await fetch(url, {
        method: isSubEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ name: subForm.name, categoryId: subForm.categoryId }),
      });
      if (res.ok) {
        await fetchSubCategories(subForm.categoryId);
        closeSubModal();
      } else {
        const err = await res.json();
        alert(err.message || "İşlem başarısız.");
      }
    } catch (error) {
      console.error("Alt kategori kayıt hatası:", error);
    } finally {
      setSubLoading(false);
    }
  };

  const handleSubDelete = async (sub: SubCategoryBody) => {
    if (!window.confirm("Bu alt kategori kaydını silmek istediğinize emin misiniz?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${Config.api.baseUrl}/api/v1/subcategories/${sub.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setSubCategories(prev => ({
          ...prev,
          [sub.categoryId]: prev[sub.categoryId].filter(s => s.id !== sub.id)
        }));
      } else {
        alert("Silme işlemi başarısız. Bu alt kategoriye bağlı ürünler olabilir.");
      }
    } catch (error) {
      console.error("Alt kategori silme hatası:", error);
    }
  };

  const openSubModal = (categoryId: number, sub?: SubCategoryBody) => {
    if (sub) { setSubForm({ ...sub }); setIsSubEditing(true); }
    else { setSubForm({ name: "", categoryId }); setIsSubEditing(false); }
    setIsSubModalOpen(true);
  };

  const closeSubModal = () => {
    setIsSubModalOpen(false);
    setIsSubEditing(false);
    setSubForm({ name: "", categoryId: 0 });
  };

  return (
    <div className="bg-white border-2 border-black overflow-hidden dark:bg-zinc-900 dark:border-zinc-800 shadow-xl rounded-none">

      {/* Üst Bilgi Paneli */}
      <div className="px-6 py-4 border-b-2 border-black dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50">
        <div>
          <h2 className="text-base font-bold text-black uppercase tracking-wider dark:text-white">Kategori & Departman Yönetimi</h2>
          <p className="text-[11px] text-zinc-500 font-mono uppercase tracking-tight mt-0.5">Sistem EMS sınıflandırma listesi</p>
        </div>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-black hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-none border border-transparent transition-colors duration-150 shadow-md"
        >
          + Yeni Kategori
        </button>
      </div>

      {/* Kategori Listesi */}
      <div className="p-4 max-h-[600px] overflow-y-auto">
        <div className="grid grid-cols-1 gap-2">
          {categories.length === 0 ? (
            <p className="text-center py-10 text-xs font-bold font-mono uppercase text-zinc-400">Henüz kategori kaydı bulunmuyor.</p>
          ) : (
            categories.map((cat) => (
              <div key={cat.id} className="rounded-none border-2 border-zinc-200 dark:border-zinc-800 overflow-hidden">

                {/* Kategori Satırı */}
                <div className="flex items-center justify-between p-3 bg-white dark:bg-zinc-900 group transition-colors">
                  <div
                    className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                    onClick={() => cat.id && toggleExpand(cat.id)}
                  >
                    <span className={`text-zinc-400 font-mono text-xs transition-transform duration-150 select-none ${expandedCategoryId === cat.id ? "rotate-90" : ""}`}>
                      ▶
                    </span>
                    <div className="min-w-0">
                      <span className="text-sm font-bold text-black block dark:text-white uppercase tracking-tight truncate">{cat.name}</span>
                      <span className="text-[10px] text-zinc-400 font-mono tracking-wide">Sistem Kodu: {cat.slug}</span>
                    </div>
                  </div>

                  {/* Kategori Butonları */}
                  <div className="flex gap-1.5 shrink-0 ml-2">
                    <button
                      onClick={() => cat.id && openSubModal(cat.id)}
                      className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 border border-emerald-700 rounded-none transition-colors"
                    >
                      + Alt
                    </button>
                    <button
                      onClick={() => openModal(cat)}
                      className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-white bg-zinc-800 hover:bg-black active:bg-zinc-900 border border-zinc-900 rounded-none dark:bg-zinc-700 dark:hover:bg-zinc-600 transition-colors"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => cat.id && handleDelete(cat.id)}
                      className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-red-600 bg-white border border-red-600 hover:bg-red-600 hover:text-white active:bg-red-700 rounded-none dark:bg-zinc-900 transition-all"
                    >
                      Sil
                    </button>
                  </div>
                </div>

                {/* Alt Kategori Paneli */}
                {expandedCategoryId === cat.id && (
                  <div className="border-t-2 border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 py-3 space-y-2">
                    <span className="text-[10px] font-bold font-mono uppercase text-zinc-400 tracking-wider block mb-1">
                      Alt Sınıflandırmalar
                    </span>

                    {!subCategories[cat.id!] ? (
                      <p className="text-[11px] font-mono text-zinc-400 py-2">Yükleniyor...</p>
                    ) : subCategories[cat.id!].length === 0 ? (
                      <p className="text-[11px] font-mono text-zinc-400 py-2">Bu kategoriye ait alt sınıflandırma bulunmuyor.</p>
                    ) : (
                      subCategories[cat.id!].map((sub) => (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-black dark:hover:border-red-600 transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-zinc-300 dark:text-zinc-700 font-mono text-xs select-none">└</span>
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-black dark:text-white uppercase tracking-tight truncate block">{sub.name}</span>
                              <span className="text-[10px] text-zinc-400 font-mono">Kod: SC-{sub.id}</span>
                            </div>
                          </div>

                          {/* Alt Kategori Butonları */}
                          <div className="flex gap-1.5 shrink-0 ml-2">
                            <button
                              onClick={() => openSubModal(cat.id!, sub)}
                              className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white bg-zinc-800 hover:bg-black border border-zinc-900 rounded-none dark:bg-zinc-700 dark:hover:bg-zinc-600 transition-colors"
                            >
                              Düzenle
                            </button>
                            <button
                              onClick={() => handleSubDelete(sub)}
                              className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-red-600 bg-white border border-red-600 hover:bg-red-600 hover:text-white rounded-none dark:bg-zinc-900 transition-all"
                            >
                              Sil
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Kategori Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-none shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b-2 border-black dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/30">
              <h3 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">
                {isEditing ? "Kategori Bilgilerini Güncelle" : "Yeni Sınıflandırma Ekle"}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Kategori / Departman Adı</label>
                <input
                  autoFocus
                  className="w-full border-2 border-black p-2.5 rounded-none focus:border-red-600 outline-none font-medium text-sm text-black dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:focus:border-red-500"
                  placeholder="Mobil Sistemler, Donanım, EMS vb."
                  value={form.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm({
                      ...form,
                      name: val,
                      slug: val.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
                    });
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Sistem Tanımlayıcı (Slug)</label>
                <input
                  className="w-full border-2 border-zinc-200 p-2.5 rounded-none bg-zinc-100 text-zinc-500 font-mono text-xs cursor-not-allowed dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-400"
                  value={form.slug}
                  readOnly
                />
              </div>
            </div>
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-t-2 border-zinc-100 dark:border-zinc-800 flex justify-end gap-2">
              <button onClick={closeModal} className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-black dark:hover:text-white transition-colors">İptal</button>
              <button onClick={handleSave} disabled={loading} className="px-6 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-none hover:bg-red-600 disabled:opacity-50 transition-colors duration-150">
                {loading ? "İşleniyor..." : isEditing ? "GÜNCELLE" : "OLUŞTUR"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alt Kategori Modal */}
      {isSubModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-none shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b-2 border-black dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/30">
              <h3 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">
                {isSubEditing ? "Alt Kategori Güncelle" : "Yeni Alt Sınıflandırma Ekle"}
              </h3>
              <p className="text-[10px] text-zinc-400 font-mono mt-0.5 uppercase">
                Üst Grup: {categories.find(c => c.id === subForm.categoryId)?.name}
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Alt Kategori Adı</label>
                <input
                  autoFocus
                  className="w-full border-2 border-black p-2.5 rounded-none focus:border-red-600 outline-none font-medium text-sm text-black dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:focus:border-red-500"
                  placeholder="Örn: Dizüstü Bilgisayar, Güç Kaynağı vb."
                  value={subForm.name}
                  onChange={(e) => setSubForm({ ...subForm, name: e.target.value })}
                />
              </div>
            </div>
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-t-2 border-zinc-100 dark:border-zinc-800 flex justify-end gap-2">
              <button onClick={closeSubModal} className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-black dark:hover:text-white transition-colors">İptal</button>
              <button onClick={handleSubSave} disabled={subLoading} className="px-6 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-none hover:bg-red-600 disabled:opacity-50 transition-colors duration-150">
                {subLoading ? "İşleniyor..." : isSubEditing ? "GÜNCELLE" : "OLUŞTUR"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;