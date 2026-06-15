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

const CategoryManagement: FC = () => {
  // --- YETKİ KONTROLÜ ---


  const { role, isLoggedIn } = useAppSelector((state) => state.authReducer);
  
  const [categories, setCategories] = useState<CategoryBody[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<CategoryBody>({ slug: "", name: "" });

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchCategories();
  }, []);

  // Eğer ADMIN değilse ana sayfaya yönlendir
  if (!isLoggedIn || role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  

  // --- VERİ ÇEKME ---
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${Config.api.baseUrl}/api/v1/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Kategoriler yüklenirken hata:", error);
    }
  };



  // --- KAYDETME / GÜNCELLEME ---
  const handleSave = async () => {
    if (!form.name.trim()) return alert("Kategori adı boş olamaz.");
    
    setLoading(true);
    const token = localStorage.getItem("token"); // Backend güvenliği için

    const url = isEditing 
      ? `${Config.api.baseUrl}/api/v1/categories/${form.id}`
      : `${Config.api.baseUrl}/api/v1/categories`;
    
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        await fetchCategories();
        closeModal();
      } else {
        const err = await res.json();
        alert(err.message || "İşlem başarısız.");
      }
    } catch (error) {
      console.error("Hata:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- SİLME ---
  const handleDelete = async (id: number) => {
    if (!window.confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;
    
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${Config.api.baseUrl}/api/v1/categories/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        setCategories(categories.filter((c) => c.id !== id));
      } else {
        alert("Silme işlemi başarısız. Bu kategoriye bağlı ürünler olabilir.");
      }
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  };

  // --- MODAL YÖNETİMİ ---
  const openModal = (cat?: CategoryBody) => {
    if (cat) {
      setForm({ ...cat });
      setIsEditing(true);
    } else {
      setForm({ slug: "", name: "" });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setForm({ slug: "", name: "" });
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
      {/* Üst Bilgi Paneli */}
      <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30 dark:bg-slate-700/30 dark:border-slate-600">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Kategori Yönetimi</h2>
          <p className="text-xs text-slate-500 font-medium">Sistemdeki kategorileri yönetin.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-indigo-200"
        >
          + Yeni Kategori
        </button>
      </div>

      {/* Kategori Listesi */}
      <div className="p-4 max-h-[500px] overflow-y-auto">
        <div className="grid grid-cols-1 gap-2">
          {categories.length === 0 ? (
            <p className="text-center py-10 text-slate-400">Henüz kategori bulunmuyor.</p>
          ) : (
            categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-indigo-200 transition-colors dark:bg-slate-700 dark:border-slate-600">
                <div>
                  <span className="text-sm font-bold text-slate-700 block dark:text-slate-200">{cat.name}</span>
                  <span className="text-[10px] text-slate-400 italic font-medium">{cat.slug}</span>
                </div>
                <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => openModal(cat)}
                    className="px-3 py-1 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg dark:hover:bg-slate-600"
                  >
                    Düzenle
                  </button>
                  <button 
                    onClick={() => cat.id && handleDelete(cat.id)}
                    className="px-3 py-1 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-lg dark:hover:bg-slate-600"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL BİLEŞENİ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-xl font-black text-slate-800 dark:text-white">
                {isEditing ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}
              </h3>
            </div>
            
            <div className="p-8 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Kategori Adı</label>
                <input 
                  autoFocus
                  className="w-full border-2 border-slate-100 p-3 rounded-xl focus:border-indigo-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  placeholder="Elektronik, Giyim vb."
                  value={form.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm({ 
                      ...form, 
                      name: val, 
                      slug: val.toLowerCase()
                               .replace(/[^a-z0-9]/g, "-") // Özel karakterleri "-" yapar
                               .replace(/-+/g, "-")        // Birden fazla "-" yan yana gelmez
                               .replace(/^-|-$/g, "")      // Başta ve sondaki "-" leri siler
                    });
                  }}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Slug (URL)</label>
                <input 
                  className="w-full border-2 border-slate-100 p-3 rounded-xl bg-slate-50 text-slate-400 cursor-not-allowed dark:bg-slate-900 dark:border-slate-800" 
                  value={form.slug} 
                  readOnly 
                />
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-700/50 flex justify-end gap-3">
              <button 
                onClick={closeModal} 
                className="px-6 py-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
              >
                İptal
              </button>
              <button 
                onClick={handleSave} 
                disabled={loading}
                className="px-8 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-indigo-700 disabled:opacity-50 transition-all"
              >
                {loading ? "İşleniyor..." : isEditing ? "Güncelle" : "Oluştur"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;