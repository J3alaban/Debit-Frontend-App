import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addCategories } from "../redux/features/productSlice";
import { Link } from "react-router-dom";
import { updateLoading } from "../redux/features/homeSlice";
import { Config } from "../helpers/Config";

interface SubCategory {
    id: number;
    name: string;
    categoryId: number;
    categoryName: string;
}

const AllCategories: FC = () => {
    const dispatch = useAppDispatch();

    // Aktif seçili olan kategorinin index'ini tutan state
    const [activeTab, setActiveTab] = useState<number>(0);
    // Seçili kategoriye ait alt sınıfları tutan state
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    // Alt kategorilerin yüklenme durumunu kontrol etmek için lokal loading
    const [isSubLoading, setIsSubLoading] = useState<boolean>(false);

    const allCategories = useAppSelector(
        (state) => state.productReducer.categories
    );

    const isMainLoading = useAppSelector(
        (state) => state.homeReducer.isLoading
    );

    // 1. ADIM: Ana Kategorileri Çek
    useEffect(() => {
        if (allCategories.length > 0) return;

        dispatch(updateLoading(true));

        fetch(`${Config.api.baseUrl}/api/v1/categories`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                dispatch(addCategories(data));
                localStorage.setItem("categories", JSON.stringify(data));
            })
            .finally(() => {
                dispatch(updateLoading(false));
            });
    }, [dispatch, allCategories.length]);

    // Seçili olan kategorinin verisi
    const currentCategory = allCategories?.[activeTab];

    // 2. ADIM: Seçili Kategori Değiştikçe Alt Kategorileri Çek
    useEffect(() => {
        if (!currentCategory?.id) return;

        setIsSubLoading(true);
        setSubCategories([]); // Her sekme değişiminde eski veriyi temizle (akıcı animasyon için)

        fetch(`${Config.api.baseUrl}/api/v1/subcategories/${currentCategory.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setSubCategories(data);
            })
            .catch((err) => {
                console.error("SubCategories fetch error:", err);
            })
            .finally(() => {
                setIsSubLoading(false);
            });
    }, [currentCategory?.id]);

    return (
        <div className="mx-auto min-h-[83vh] p-4 md:p-8 font-sans antialiased bg-zinc-50 dark:bg-zinc-950 transition-colors">
            {/* Sol Kırmızı Çizgili Kurumsal Başlık Alanı */}
            <div className="border-l-4 border-red-600 pl-4 mb-10">
                <h2 className="text-2xl font-bold text-black dark:text-white uppercase tracking-wider">
                    EMS Personel Envanteri
                </h2>
                <p className="text-zinc-500 font-mono text-xs mt-1 uppercase tracking-tight">
                    EMS Mobil Sistemler / Sekmeli Envanter Yönetimi
                </p>
            </div>

            {/* Ana Kategori Yükleniyor Göstergesi */}
            {isMainLoading ? (
                <div className="flex items-center justify-center py-32">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-zinc-200 dark:border-zinc-800 border-t-red-600 dark:border-t-red-500"></div>
                </div>
            ) : (
                <div className="w-full flex flex-col gap-6">
                    {/* SEKMELER (TABS) ALANI */}
                    <div className="flex flex-wrap gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-px">
                        {allCategories?.map((category, index) => {
                            const isActive = activeTab === index;
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveTab(index)}
                                    className={`px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-150 rounded-none border-t-2 border-x
                                    ${
                                        isActive
                                            ? "bg-white dark:bg-zinc-900 text-red-600 dark:text-red-500 border-t-red-600 dark:border-t-red-500 border-x-zinc-200 dark:border-x-zinc-800 -mb-px relative z-10"
                                            : "bg-zinc-100/70 dark:bg-zinc-900/40 text-zinc-500 border-t-transparent border-x-transparent hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900/80"
                                    }`}
                                >
                                    {category.name}
                                </button>
                            );
                        })}
                    </div>

                    {/* ANIMASYONLU DETAY VE ALT KATEGORİ PANELİ */}
                    {currentCategory && (
                        <div
                            key={currentCategory.id} // Sekme değiştikçe animasyonu tetikler
                            className="animate-[fadeInUp_0.25s_ease-out] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 space-y-6"
                        >
                            {/* Üst Bilgi Başlığı */}
                            <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <span className="text-[10px] font-mono font-bold uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 border border-zinc-300 dark:border-zinc-700">
                                        Sistem Sınıfı: #{currentCategory.id}
                                    </span>
                                    <h3 className="text-xl font-black text-black dark:text-white uppercase tracking-wide mt-1">
                                        {currentCategory.name} Alt Grupları
                                    </h3>
                                </div>
                                <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
                                    Toplam {subCategories.length} alt sınıf listelendi
                                </span>
                            </div>

                            {/* Alt Kategoriler İçin Durum Kontrolleri */}
                            {isSubLoading ? (
                                <div className="flex items-center justify-center py-16">
                                    <div className="animate-spin rounded-none h-8 w-8 border-4 border-zinc-200 dark:border-zinc-800 border-t-red-600 dark:border-t-red-500"></div>
                                </div>
                            ) : subCategories.length === 0 ? (
                                <div className="text-center py-12 text-zinc-400 dark:text-zinc-500 font-mono text-xs uppercase tracking-wider">
                                    Bu kategoriye ait tanımlı alt sınıf bulunamadı.
                                </div>
                            ) : (
                                /* Alt Sınıf Kartları Grid Yapısı */
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {subCategories.map((item) => (
                                        <div
                                            key={item.id}
                                            className="group relative bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800
                                            transition-all duration-150 hover:border-black dark:hover:border-red-600 hover:bg-white dark:hover:bg-zinc-900
                                            p-5 flex flex-col justify-between min-h-[140px] rounded-none shadow-xs"
                                        >
                                            <span className="absolute top-2 right-4 text-zinc-200 dark:text-zinc-800 font-mono font-bold text-xl select-none">
                                                //
                                            </span>

                                            <div className="relative z-10 space-y-1">
                                                <h4 className="text-sm font-bold text-black dark:text-white uppercase tracking-tight group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                                                    {item.name}
                                                </h4>
                                                <p className="text-[10px] font-bold font-mono uppercase text-zinc-400 dark:text-zinc-500">
                                                    Kod: SC-{item.id}
                                                </p>
                                            </div>

                                            <Link
                                                to="/subcategory-products"
                                                state={{ subCategoryId: item.id }}
                                                className="text-xs font-bold uppercase tracking-wider text-black dark:text-white hover:text-red-600 dark:hover:text-red-500 border-b border-black dark:border-zinc-600 pb-0.5 self-start mt-4 transition-colors"
                                            >
                                                Envanteri Listele &rarr;
                                            </Link>

                                            {/* Kurumsal Çizgi Efekti */}
                                            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-200"></div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Panel Animasyon Sınıfı */}
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default AllCategories;