import { FC, useState, useEffect } from "react";
import { Config } from "../helpers/Config";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { updateLoading } from "../redux/features/homeSlice";

type ProductBody = {
  id?: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  subCategoryId?: number;
  brand: string;
  sku: string;
  discountPercentage: number;
  weight: number;
  dimensions: { width: number; height: number; depth: number };
  images: string[];
  size: string;
  categoryName?: string;
  subCategoryName?: string;
};

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface SubCategory {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  tcNo?: string;
}

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  tcNo: string;
}

interface ProductResponse {
  content: ProductBody[];
  totalPages: number;
  totalElements: number;
}

const ProductManagement: FC = () => {
  const dispatch = useAppDispatch();


  const [products, setProducts] = useState<ProductBody[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  // Personel State Yönetimi
  const [users, setUsers] = useState<User[]>([]);
  const [globalUserSearchTerm, setGlobalUserSearchTerm] = useState("");
  const [matchedGlobalUsers, setMatchedGlobalUsers] = useState<User[]>([]);

  // Seçili Personel Zimmet İzleme State'leri (UserProducts Entegrasyonu)
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [userProducts, setUserProducts] = useState<ProductBody[]>([]);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 5;

  // Modal içi personel arama state'leri (Yeni Kayıt İçin)
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | "">("");

  const emptyForm: ProductBody = {
    title: "", description: "", price: 0, stock: 0,
    categoryId: 0, subCategoryId: undefined,
    brand: "", sku: "", discountPercentage: 0,
    weight: 0, dimensions: { width: 0, height: 0, depth: 0 },
    images: [], size: ""
  };

  const [form, setForm] = useState<ProductBody>(emptyForm);

  // 1. Personel İsimlerini Fetch Etme (İstediğin useEffect Yapısı)
  useEffect(() => {
    dispatch(updateLoading(true));
    fetch(`${Config.api.baseUrl}/api/v1/auth`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data: User[]) => {
        setUsers(data);
        localStorage.setItem("users", JSON.stringify(data));
      })
      .catch((err) => console.error("Personel yüklenirken hata:", err))
      .finally(() => dispatch(updateLoading(false)));
  }, [dispatch]);

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

  // Alt Kategori Yükleme
  useEffect(() => {
    if (!form.categoryId) {
      setSubCategories([]);
      return;
    }
    dispatch(updateLoading(true));
    fetch(`${Config.api.baseUrl}/api/v1/subcategories`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data: SubCategory[]) => {
        const filtered = data.filter(sub => sub.categoryId === form.categoryId || !sub.categoryId);
        setSubCategories(filtered.length > 0 ? filtered : data);
      })
      .catch((err) => console.error("SubCategories fetch error:", err))
      .finally(() => dispatch(updateLoading(false)));
  }, [form.categoryId, dispatch]);

  // Tüm Ürünleri / Genel Envanteri Yükleme
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

  // ANA PANEL: Personel İsmi Arama Mantığı
  useEffect(() => {
    if (!globalUserSearchTerm.trim()) {
      setMatchedGlobalUsers([]);
      return;
    }
    const q = globalUserSearchTerm.toLowerCase();
    const matched = users.filter(u =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
    setMatchedGlobalUsers(matched);
  }, [globalUserSearchTerm, users]);

  // MODAL İÇİ: Personel Arama Mantığı (Yeni Kayıt)
  useEffect(() => {
    if (!userSearchTerm.trim()) {
      setFilteredUsers([]);
      return;
    }
    const q = userSearchTerm.toLowerCase();
    const matched = users.filter(u =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
    setFilteredUsers(matched);
  }, [userSearchTerm, users]);


  // SEÇİLİ PERSONELİN ZİMMETLERİNİ BACKEND'DEN FETCH ETME (UserProducts Yapısı)
  const handleViewUserProducts = (userId: number) => {
    localStorage.setItem("selectedUserId", String(userId));
    setCurrentPage(0);
    fetchUserProfileAndProducts(String(userId), 0);
  };

  const fetchUserProfileAndProducts = async (targetUserId: string, page: number) => {
    try {
      dispatch(updateLoading(true));
      // Zimmetli ürün havuzunu çekme
      const productsResponse = await fetch(
        `${Config.api.baseUrl}/api/v1/auth/${targetUserId}/products?page=${page}&size=${pageSize}`
      );
      const productsData: ProductResponse = await productsResponse.json();

      setUserProducts(productsData.content || []);
      setTotalPages(productsData.totalPages || 0);
      setTotalElements(productsData.totalElements || 0);

      // Profil bilgilerini çekme
      const userResponse = await fetch(
        `${Config.api.baseUrl}/api/v1/auth/${targetUserId}/profile`
      );
      const userData: UserProfile = await userResponse.json();
      setSelectedProfile(userData);
    } catch (error) {
      console.error("Zimmet verileri çekilirken hata oluştu:", error);
    } finally {
      dispatch(updateLoading(false));
    }
  };

  // Sayfa Değişiminde Tetiklenme
  useEffect(() => {
    const storedId = localStorage.getItem("selectedUserId");
    if (storedId && selectedProfile) {
      fetchUserProfileAndProducts(storedId, currentPage);
    }
  }, [currentPage]);

  // Rapor Çıktısı Alma / Yazdırma Fonksiyonu
  const handlePrint = (includeImages: boolean) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow || !selectedProfile) return;

    const userInfo = `
      <div style="margin-bottom:20px;padding:15px;border:2px solid #000;background-color:#fafafa;">
          <h3 style="margin-top:0;margin-bottom:12px;text-transform:uppercase;font-size:14px;letter-spacing:1px;border-bottom:1px solid #000;padding-bottom:4px;">Personel Bilgileri</h3>
          <p style="margin:4px 0;font-size:12px;"><strong>PERSONEL ID:</strong> ${selectedProfile.id}</p>
          <p style="margin:4px 0;font-size:12px;"><strong>AD SOYAD:</strong> ${selectedProfile.firstName} ${selectedProfile.lastName}</p>
          <p style="margin:4px 0;font-size:12px;"><strong>KURUMSAL E-POSTA:</strong> ${selectedProfile.email}</p>
          <p style="margin:4px 0;font-size:12px;"><strong>TELEFON:</strong> ${selectedProfile.phone || "-"}</p>
          <p style="margin:4px 0;font-size:12px;"><strong>T.C. KİMLİK NO:</strong> ${selectedProfile.tcNo || "-"}</p>
      </div>
    `;

    const rows = userProducts
      .map(
        (product) => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="font-weight:bold;">${product.title}</td>
            <td>${product.brand || "-"}</td>
            <td>${product.categoryName || "-"}</td>
            <td>${product.subCategoryName || "-"}</td>
            <td style="font-family:monospace;font-size:11px;">${product.sku || "-"}</td>
            <td style="font-family:monospace;font-weight:bold;">${product.stock}</td>
            <td>${product.size || "-"}</td>
            ${includeImages ? `<td>${product.images?.length ? `<img src="${product.images[0]}" style="width:60px;height:60px;object-fit:cover;border:1px solid #000;" />` : "-"}</td>` : ""}
        </tr>
      `
      )
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>Zimmet Envanter Raporu</title>
          <style>
              body { font-family: sans-serif; padding: 30px; color: #000; line-height:1.4; }
              h2 { text-transform: uppercase; letter-spacing: 1px; font-size: 20px; margin-bottom: 5px; }
              .meta-p { margin: 3px 0; font-size: 12px; color: #555; }
              table { width: 100%; border-collapse: collapse; margin-top: 25px; font-size:12px; }
              th, td { border: 1px solid #000; padding: 10px; text-align: left; }
              th { background: #000; color: #fff; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
          </style>
      </head>
      <body>
          <div style="border-left: 5px solid #dc2626; padding-left: 12px; margin-bottom: 25px;">
              <h2>EMS Mobil Sistemler / Zimmet Envanter Raporu</h2>
              <p class="meta-p"><strong>Rapor Tarihi:</strong> ${new Date().toLocaleString("tr-TR")}</p>
              <p class="meta-p"><strong>Toplam Kayıtlı Varlık:</strong> ${totalElements} Adet</p>
          </div>
          ${userInfo}
          <table>
              <thead>
                  <tr>
                      <th>Zimmetli Varlık</th>
                      <th>Marka</th>
                      <th>Üst Grup</th>
                      <th>Alt Sınıf</th>
                      <th>SKU Kodu</th>
                      <th>Miktar</th>
                      <th>Boyut</th>
                      ${includeImages ? "<th>Görsel Kayıt</th>" : ""}
                  </tr>
              </thead>
              <tbody>
                  ${rows}
              </tbody>
          </table>
      </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
  };

  const openModal = (product?: ProductBody) => {
    if (product) {
      const deepCopiedProduct = JSON.parse(JSON.stringify(product));
      if (!deepCopiedProduct.dimensions) {
        deepCopiedProduct.dimensions = { width: 0, height: 0, depth: 0 };
      }
      setForm(deepCopiedProduct);
      setIsEditing(true);
      setSelectedUserId("");
    } else {
      setForm(JSON.parse(JSON.stringify(emptyForm)));
      setIsEditing(false);
      setSelectedUserId("");
    }
    setUserSearchTerm("");
    setFilteredUsers([]);
    setIsModalOpen(true);
  };

  const deleteProduct = async (id: number) => {
    if (!window.confirm("Bu EMS kaydını silmek istediğinize emin misiniz?")) return;
    await fetch(`${Config.api.baseUrl}/api/v1/products/${id}`, { method: "DELETE" });
    setProducts(products.filter((p) => p.id !== id));
    setUserProducts(userProducts.filter((p) => p.id !== id));
  };

  const handleSave = async () => {
    if (!isEditing && !selectedUserId) {
      alert("Lütfen zimmetlenecek personeli seçiniz.");
      return;
    }
    const url = isEditing
      ? `${Config.api.baseUrl}/api/v1/products/${form.id}`
      : `${Config.api.baseUrl}/api/v1/products/${selectedUserId}`;

    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const savedProduct = await res.json();
        const updatedList = isEditing
          ? products.map(p => p.id === form.id ? savedProduct : p)
          : [...products, savedProduct];

        setProducts(updatedList);
        setIsModalOpen(false);
        setIsEditing(false);
        setSelectedUserId("");
        setUserSearchTerm("");
        setFilteredUsers([]);
        setForm(JSON.parse(JSON.stringify(emptyForm)));

        // Eğer o esnada aktif görüntülenen personelin zimmeti ise güncelle
        const storedId = localStorage.getItem("selectedUserId");
        if (storedId) fetchUserProfileAndProducts(storedId, currentPage);
      } else {
        alert("Kayıt sırasında bir hata oluştu.");
      }
    } catch (error) {
      console.error("Ağ Hatası:", error);
      alert("Sunucuya bağlanılamadı.");
    }
  };

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 p-2 md:p-4 font-sans antialiased transition-colors">
      <div className="max-w-7xl mx-auto">

        {/* Kurumsal Header Paneli */}
        <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 p-4 md:p-6 mb-4 flex flex-col md:flex-row justify-between items-center gap-4 rounded-none shadow-xl">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="w-2 h-10 bg-red-600 inline-block shrink-0"></span>
            <div>
              <h1 className="text-lg md:text-xl font-bold uppercase tracking-wider text-black dark:text-white">EMS & Envanter Kontrolü</h1>
              <p className="text-zinc-500 font-mono text-xs mt-0.5 uppercase tracking-tight">Sistemde Toplam {products.length} Envanter Kartı Kayıtlıdır</p>
            </div>
          </div>
          <button
            onClick={() => openModal()}
            className="w-full md:w-auto px-6 py-3 bg-black hover:bg-red-600 dark:bg-zinc-800 dark:hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-none transition-colors duration-150 shadow-md flex items-center justify-center gap-2 border border-transparent"
          >
            + Zimmet Ekle
          </button>
        </div>

        {/* ANA PANEL PERSONEL ARAMA INPUTU */}
        <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 p-4 mb-4 shadow-md">
          <div className="w-full space-y-1.5">
            <label className="text-[10px] font-bold text-black dark:text-zinc-400 uppercase tracking-wider block">
              👤 Sorumlu Personel Adı veya E-Posta ile Filtrele
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                className="w-full border-2 border-black p-2.5 rounded-none text-xs text-black outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:border-red-600 font-medium font-mono"
                placeholder="Arama yapmak için personel ismi veya e-posta adresi giriniz..."
                value={globalUserSearchTerm}
                onChange={(e) => setGlobalUserSearchTerm(e.target.value)}
              />
              {globalUserSearchTerm && (
                <button
                  onClick={() => { setGlobalUserSearchTerm(""); setMatchedGlobalUsers([]); }}
                  className="absolute right-3 text-xs font-bold text-zinc-400 hover:text-black dark:hover:text-white font-mono"
                >
                  TEMİZLE
                </button>
              )}
            </div>
          </div>

          {/* Personel Arama Sonuç Listesi ve "Zimmetleri Görüntüle" Butonları */}
          {matchedGlobalUsers.length > 0 && (
            <div className="mt-3 border-t border-zinc-200 dark:border-zinc-800 pt-3 space-y-2 max-h-48 overflow-y-auto">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Eşleşen Personel Listesi ({matchedGlobalUsers.length})</p>
              {matchedGlobalUsers.map((u) => (
                <div key={u.id} className="p-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-black dark:text-white uppercase">{u.firstName} {u.lastName}</span>
                    <span className="text-zinc-400 font-mono ml-2">({u.email})</span>
                  </div>
                  <button
                    onClick={() => handleViewUserProducts(u.id)}
                    className="px-3 py-1.5 bg-black hover:bg-red-600 text-white font-bold text-[10px] uppercase tracking-wider rounded-none transition-colors"
                  >
                    Zimmetleri Görüntüle ➔
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SEÇİLİ PERSONEL DETAY VE AKTİF ZİMMET HAVUZU (UserProducts Bileşeni Modülü) */}
        {selectedProfile && (
          <div className="mb-6 animate-fadeIn">
            {/* Personel Bilgileri Kartı */}
            <div className="bg-white dark:bg-zinc-900 rounded-none border-2 border-black dark:border-zinc-800 p-6 shadow-lg relative mb-4">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
              <div className="flex items-center justify-between mb-4 border-b pb-2 border-zinc-100 dark:border-zinc-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-red-600 font-mono">
                  Zimmet Sorumlusu Aktif Personel Profili
                </h3>
                <div className="flex gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white border border-zinc-300 dark:border-zinc-700">
                    P-ID: {selectedProfile.id}
                  </span>
                  <button
                    onClick={() => setShowPrintModal(true)}
                    className="px-3 py-0.5 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider font-mono hover:bg-black transition-colors"
                  >
                    DÖKÜM AL / YAZDIR 🖨️
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Ad Soyad</p>
                  <p className="font-bold text-black dark:text-white uppercase mt-0.5">{selectedProfile.firstName} {selectedProfile.lastName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Kurumsal E-Posta</p>
                  <p className="font-medium text-zinc-600 dark:text-zinc-300 mt-0.5 font-mono">{selectedProfile.email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">İletişim</p>
                  <p className="font-mono mt-0.5">{selectedProfile.phone || "-"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">T.C. Kimlik No</p>
                  <p className="font-mono mt-0.5">{selectedProfile.tcNo || "-"}</p>
                </div>
              </div>
            </div>

            {/* Sadece O Personele Ait Sayfalanmış Zimmet Tablosu */}
            <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 overflow-hidden shadow-xl mb-4">
              <div className="bg-zinc-900 text-white p-3 font-mono text-xs uppercase tracking-wider flex justify-between">
                <span>👤 {selectedProfile.firstName} {selectedProfile.lastName} Üzerindeki Varlıklar</span>
                <span className="text-red-400">Toplam: {totalElements} Kalem</span>
              </div>
              <div className="overflow-x-auto text-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold uppercase border-b border-black">
                      <th className="py-3 px-4 pl-6">Sınıflandırma</th>
                      <th className="py-3 px-4">Kodlar / SKU</th>
                      <th className="py-3 px-4 text-center">Miktar</th>
                      <th className="py-3 px-6">Varlık Açıklaması / Detay</th>
                      <th className="py-3 px-4 text-center">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {userProducts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-xs font-mono text-zinc-400 uppercase">Bu personele atanmış aktif zimmet kaydı bulunmamaktadır.</td>
                      </tr>
                    ) : (
                      userProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors text-xs">
                          <td className="py-3 px-4 pl-6">
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-zinc-900 text-white dark:bg-zinc-700 border w-fit">{product.brand || "Markasız"}</span>
                              <span className="font-bold text-zinc-600 dark:text-zinc-400 uppercase">{product.categoryName || `Kat: ${product.categoryId}`}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono text-zinc-500">
                            <div>SKU: {product.sku || "-"}</div>
                            <div>Boyut: {product.size || "-"}</div>
                          </td>
                          <td className="py-3 px-4 text-center font-bold font-mono text-sm">{product.stock} Adet</td>
                          <td className="py-3 px-6">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 border overflow-hidden bg-zinc-50 shrink-0">
                                <img src={product.images?.length > 0 ? product.images[0] : "https://via.placeholder.com/150"} className="w-full h-full object-cover grayscale" />
                              </div>
                              <div>
                                <div className="font-bold uppercase text-black dark:text-white">{product.title}</div>
                                <div className="text-[11px] text-zinc-400 line-clamp-1">{product.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex justify-center gap-1">
                              <button onClick={() => openModal(product)} className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white font-bold uppercase text-[10px]">Düzenle</button>
                              <button onClick={() => product.id && deleteProduct(product.id)} className="px-2 py-1 text-red-600 font-bold uppercase text-[10px]">Sil</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Sayfalama Kontrolleri */}
              {totalPages > 1 && (
                <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border-t border-black flex justify-between items-center text-xs font-mono">
                  <span>S. {currentPage + 1} / {totalPages}</span>
                  <div className="flex gap-1">
                    <button onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} disabled={currentPage === 0} className="px-2 py-1 border disabled:opacity-40">◀ Geri</button>
                    <button onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))} disabled={currentPage === totalPages - 1} className="px-2 py-1 border disabled:opacity-40">İleri ▶</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Kurumsal Genel Envanter Veri Tablosu */}
        <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 overflow-hidden rounded-none shadow-xl">
          <div className="bg-black text-white p-3 font-mono text-xs uppercase tracking-wider">
            📦 Genel Varlık ve Envanter Havuzu Listesi
          </div>
          <div className="overflow-x-auto">
            <div className="max-h-[500px] overflow-y-auto text-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-zinc-100 text-black dark:bg-zinc-800 dark:text-white sticky top-0 z-10 border-b-2 border-black">
                  <tr className="text-[10px] md:text-xs font-bold uppercase tracking-wider">
                    <th className="px-4 md:px-6 py-4">EMS / Malzeme Tanımı</th>
                    <th className="px-6 py-4 hidden lg:table-cell">Sınıflandırma / Marka</th>
                    <th className="px-4 md:px-6 py-4 text-center">Maliyet Değeri & Stok Miktarı</th>
                    <th className="px-4 md:px-6 py-4 text-center">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-zinc-100 dark:divide-zinc-800 text-[13px] md:text-sm font-medium">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                      <td className="px-4 md:px-6 py-4 max-w-[150px] md:max-w-none">
                        <div className="font-bold text-black dark:text-white uppercase tracking-tight truncate">{p.title}</div>
                        <div className="text-[10px] text-zinc-400 font-mono lg:hidden">Üretici: {p.brand}</div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="text-zinc-700 dark:text-zinc-300 font-mono text-xs">Ana Kategori ID: {p.categoryId} {p.subCategoryId && `| Alt Kategori ID: ${p.subCategoryId}`}</div>
                        <div className="text-xs text-zinc-400">Üretici: {p.brand}</div>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-center">
                        <div className="font-black font-mono text-black dark:text-white whitespace-nowrap">{p.price} TL</div>
                        <div className={`text-[10px] font-bold uppercase tracking-wider font-mono ${p.stock < 5 ? 'text-red-600 bg-red-50 dark:bg-red-950/20 px-1 py-0.5 inline-block' : 'text-zinc-400'}`}>
                          Miktarı: {p.stock} Adet
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex justify-center gap-1">
                          <button onClick={() => openModal(p)} className="px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-800 transition-colors">Düzenle</button>
                          <button onClick={() => p.id && deleteProduct(p.id)} className="px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">Sil</button>
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

      {/* Raporlama Modalı */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs">
            <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 p-6 w-[400px] relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
                <h3 className="text-base font-bold text-black dark:text-white uppercase tracking-wider mb-1 font-mono">Rapor Yazdırma Protokolü</h3>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-tight mb-6">Rapor çıktısı için görsel tercihini belirleyin.</p>
                <div className="flex flex-col gap-3">
                    <button onClick={() => { handlePrint(true); setShowPrintModal(false); }} className="w-full py-3 bg-black hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider transition-colors duration-150 shadow-md">Görsel Kayıtları Dahil Et</button>
                    <button onClick={() => { handlePrint(false); setShowPrintModal(false); }} className="w-full py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-black dark:text-white border border-zinc-300 font-bold text-xs uppercase tracking-wider transition-colors duration-150">Sadece Metin Raporu Yazdır</button>
                    <button onClick={() => setShowPrintModal(false)} className="w-full py-2 bg-transparent text-zinc-400 text-xs font-bold uppercase mt-1">İptal Et</button>
                </div>
            </div>
        </div>
      )}

      {/* Kayıt / Düzenleme Modali */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 rounded-none shadow-2xl w-full max-w-2xl h-full sm:h-auto max-h-screen sm:max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b-2 border-black dark:border-zinc-700 flex justify-between items-center sticky top-0 bg-white dark:bg-zinc-900 z-10">
              <h2 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white">
                {isEditing ? 'EMS Kartını Güncelle' : 'Yeni Envanter Kartı Kaydı'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-black dark:hover:text-white p-2 font-bold">✕</button>
            </div>

            <div className="p-6 overflow-y-auto grow grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white dark:bg-zinc-900">
              <div className="col-span-1 sm:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">EMS / Malzeme Adı</label>
                <input
                  className="w-full border-2 border-black p-2.5 rounded-none font-medium text-sm text-black focus:border-red-600 outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:focus:border-red-500"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Örn: EMS-400 Mobil Sunucu Kabini"
                />
              </div>

              {!isEditing && (
                <div className="col-span-1 sm:col-span-2 space-y-2 border-2 border-dashed border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-900/50">
                  <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block">Zimmetlenecek Personel Seçimi</span>
                  <div className="space-y-1">
                    <input
                      type="text"
                      className="w-full border-2 border-black p-2.5 rounded-none text-xs text-black outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:border-red-600"
                      placeholder=" İsim, Soyisim veya E-posta yazarak arayın..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <select
                      className="w-full border-2 border-black p-2.5 rounded-none text-sm font-medium text-black focus:border-red-600 outline-none bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:focus:border-red-500 cursor-pointer"
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : "")}
                    >
                      {filteredUsers.length === 0 ? (
                        <option value="">{userSearchTerm.trim() ? "❌ Eşleşen Personel Bulunamadı" : "✍️ Arama yapmak için yazmaya başlayın..."}</option>
                      ) : (
                        <>
                          <option value="">👤 Personel Seçiniz ({filteredUsers.length} Sonuç Bulundu)</option>
                          {filteredUsers.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.firstName} {user.lastName} ({user.email})
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Sorumlu Ana Kategori</label>
                <select
                  className="w-full border-2 border-black p-2.5 rounded-none text-sm font-medium text-black focus:border-red-600 outline-none bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:focus:border-red-500 cursor-pointer"
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value), subCategoryId: undefined })}
                >
                  <option value={0}>Seçiniz</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Alt Kategori / Departman</label>
                <select
                  className="w-full border-2 border-black p-2.5 rounded-none text-sm font-medium text-black focus:border-red-600 outline-none bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:focus:border-red-500 cursor-pointer disabled:bg-zinc-100 dark:disabled:bg-zinc-800 disabled:cursor-not-allowed"
                  value={form.subCategoryId || ""}
                  onChange={(e) => setForm({ ...form, subCategoryId: e.target.value ? Number(e.target.value) : undefined })}
                  disabled={!form.categoryId}
                >
                  <option value="">{form.categoryId ? "Alt Kategori Seçiniz" : "Önce Ana Kategori Seçin"}</option>
                  {subCategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Mevcut Stok Miktarı</label>
                <input
                  type="number"
                  className="w-full border-2 border-black p-2.5 rounded-none font-medium text-sm text-black focus:border-red-600 outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:focus:border-red-500 font-mono"
                  value={form.stock}
                  onChange={e => setForm({ ...form, stock: +e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Spesifikasyon / Beden</label>
                <input
                  className="w-full border-2 border-black p-2.5 rounded-none font-medium text-sm text-black focus:border-red-600 outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:focus:border-red-500"
                  value={form.size}
                  onChange={e => setForm({ ...form, size: e.target.value })}
                  placeholder="Örn: 50L, XL, 10 bar"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Maliyet Değeri (TL)</label>
                <input
                  type="number"
                  className="w-full border-2 border-black p-2.5 rounded-none font-medium text-sm text-black focus:border-red-600 outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:focus:border-red-500 font-mono"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: +e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">SKU / Stok Kodu</label>
                <input
                  className="w-full border-2 border-black p-2.5 rounded-none font-medium text-sm text-black focus:border-red-600 outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:focus:border-red-500 font-mono"
                  value={form.sku}
                  onChange={e => setForm({ ...form, sku: e.target.value })}
                  placeholder="Örn: DELL-LAT-5520"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Ağırlık (gr)</label>
                <input
                  type="number"
                  className="w-full border-2 border-black p-2.5 rounded-none font-medium text-sm text-black focus:border-red-600 outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:focus:border-red-500 font-mono"
                  value={form.weight}
                  onChange={e => setForm({ ...form, weight: +e.target.value })}
                />
              </div>

              <div className="col-span-1 sm:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Boyutlar (cm) — Genişlik / Yükseklik / Derinlik</label>
                <div className="grid grid-cols-3 gap-2">
                  <input type="number" placeholder="Genişlik" className="border-2 border-black p-2.5 rounded-none font-medium text-sm text-black focus:border-red-600 outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-white font-mono" value={form.dimensions?.width ?? 0} onChange={e => setForm({ ...form, dimensions: { ...form.dimensions, width: +e.target.value } })} />
                  <input type="number" placeholder="Yükseklik" className="border-2 border-black p-2.5 rounded-none font-medium text-sm text-black focus:border-red-600 outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-white font-mono" value={form.dimensions?.height ?? 0} onChange={e => setForm({ ...form, dimensions: { ...form.dimensions, height: +e.target.value } })} />
                  <input type="number" placeholder="Derinlik" className="border-2 border-black p-2.5 rounded-none font-medium text-sm text-black focus:border-red-600 outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-white font-mono" value={form.dimensions?.depth ?? 0} onChange={e => setForm({ ...form, dimensions: { ...form.dimensions, depth: +e.target.value } })} />
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Teknik Görsel Ekleri ({form.images?.length || 0} / 5)</label>
                <div className="flex flex-wrap gap-2 border-2 border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-950">
                  {form.images?.map((img, index) => (
                    <div key={index} className="relative w-16 h-16 border-2 border-black shadow-sm">
                      <img src={img} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setForm({ ...form, images: form.images.filter((_, i) => i !== index) })} className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold p-1">✕</button>
                    </div>
                  ))}
                  {(!form.images || form.images.length < 5) && (
                    <label className="w-16 h-16 border-2 border-dashed border-zinc-400 flex items-center justify-center cursor-pointer bg-white dark:bg-zinc-800 hover:border-black transition-colors">
                      <span className="text-zinc-400 font-bold text-xl">+</span>
                      <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const limit = 5 - (form.images?.length || 0);
                        files.slice(0, limit).forEach(file => {
                          const reader = new FileReader();
                          reader.onloadend = () => setForm(prev => ({ ...prev, images: [...(prev.images || []), reader.result as string] }));
                          reader.readAsDataURL(file);
                        });
                      }} />
                    </label>
                  )}
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Üretici Firma / Marka</label>
                <input className="w-full border-2 border-black p-2.5 rounded-none font-medium text-sm text-black focus:border-red-600 outline-none dark:bg-zinc-800 dark:border-zinc-700" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} />
              </div>

              <div className="col-span-1 sm:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Kayıt Açıklaması / Teknik Detaylar</label>
                <textarea rows={3} className="w-full border-2 border-black p-2.5 rounded-none font-medium text-sm text-black focus:border-red-600 outline-none resize-none dark:bg-zinc-800 dark:border-zinc-700" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-t-2 border-zinc-100 flex justify-end gap-2 sticky bottom-0">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-black dark:hover:text-white order-2 sm:order-1 transition-colors">Vazgeç</button>
              <button onClick={handleSave} className="px-8 py-2.5 bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-red-600 dark:bg-zinc-800 dark:hover:bg-red-600 order-1 sm:order-2 transition-colors">
                {isEditing ? 'DEĞİŞİKLİKLERİ KAYDET' : 'OLUŞTUR'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;