import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { updateLoading } from "../redux/features/homeSlice";
import { Config } from "../helpers/Config";
import { useSearchParams } from "react-router-dom";

interface Product {
    id: number;
    title: string;
    description: string;
    subCategoryId: number;
    subCategoryName: string;
    categoryId: number;
    categoryName: string;
    price: number;
    discountPercentage: number;
    rating: number | null;
    stock: number;
    size: string;
    brand: string;
    sku: string;
    weight: number;
    availabilityStatus: string | null;
    images: string[];
    thumbnail: string | null;
    userId: number;
    userEmail: string;
    barcode: string;
}

interface ProductResponse {
    content: Product[];
    totalPages: number;
    totalElements: number;
}

interface UserProfile {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    token: string | null;
    phone: string;
    tcNo: string;
}

const UserProducts: FC = () => {
    const dispatch = useAppDispatch();
    const [searchParams] = useSearchParams();

    const isLoading = useAppSelector((state) => state.homeReducer.isLoading);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [showPrintModal, setShowPrintModal] = useState(false);


    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10;


    const urlUserId = searchParams.get("id");
    const targetUserId = urlUserId || localStorage.getItem("selectedUserId") || localStorage.getItem("userId");


    useEffect(() => {
        setCurrentPage(0);
    }, [urlUserId]);

    useEffect(() => {
        if (!targetUserId) return;

        const loadData = async () => {
            try {
                dispatch(updateLoading(true));

                // 🚀 Hem sayfa hem de targetUserId değişimine göre dinamik istek atılıyor
                const productsResponse = await fetch(
                    `${Config.api.baseUrl}/api/v1/auth/${targetUserId}/products?page=${currentPage}&size=${pageSize}`
                );
                const productsData: ProductResponse = await productsResponse.json();

                setProducts(productsData.content || []);
                setTotalPages(productsData.totalPages || 0);
                setTotalElements(productsData.totalElements || 0);


                const userResponse = await fetch(
                    `${Config.api.baseUrl}/api/v1/auth/${targetUserId}/profile`
                );
                const userData: UserProfile = await userResponse.json();
                setUser(userData);

            } catch (error) {
                console.error(error);
            } finally {
                dispatch(updateLoading(false));
            }
        };

        loadData();
    }, [dispatch, targetUserId, currentPage]);

    const handlePrint = (includeImages: boolean) => {
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        const userInfo = user
            ? `
            <div style="margin-bottom:20px;padding:15px;border:2px solid #000;background-color:#fafafa;">
                <h3 style="margin-top:0;margin-bottom:12px;text-transform:uppercase;font-size:14px;letter-spacing:1px;border-bottom:1px solid #000;padding-bottom:4px;">Personel Bilgileri</h3>
                <p style="margin:4px 0;font-size:12px;"><strong>PERSONEL ID:</strong> ${user.id}</p>
                <p style="margin:4px 0;font-size:12px;"><strong>AD SOYAD:</strong> ${user.firstName} ${user.lastName}</p>
                <p style="margin:4px 0;font-size:12px;"><strong>KURUMSAL E-POSTA:</strong> ${user.email}</p>
                <p style="margin:4px 0;font-size:12px;"><strong>TELEFON:</strong> ${user.phone}</p>
                <p style="margin:4px 0;font-size:12px;"><strong>T.C. KİMLİK NO:</strong> ${user.tcNo}</p>
            </div>
        `
            : "";

        const rows = products
            .map(
                (product) => `
                <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="font-weight:bold;">${product.title}</td>
                    <td>${product.brand || "-"}</td>
                    <td>${product.categoryName}</td>
                    <td>${product.subCategoryName}</td>
                    <td style="font-family:monospace;font-size:11px;">${product.barcode || "-"}</td>
                    <td style="font-family:monospace;font-weight:bold;">${product.stock}</td>
                    <td>${product.size || "-"}</td>
                    ${
                        includeImages
                            ? `
                        <td>
                            ${
                                product.images?.length
                                    ? `<img src="${product.images[0]}" style="width:60px;height:60px;object-fit:cover;border:1px solid #000;" />`
                                    : "-"
                            }
                        </td>
                    `
                            : ""
                    }
                </tr>
            `
            )
            .join("");

        printWindow.document.write  (`
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
                            <th>Barkod</th>
                            <th>Miktar</th>
                            <th>Boyut</th>
                            ${includeImages ? "<th>Görsel Kayıt</th>" : ""}
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                    <div style="position: fixed; bottom: 40px; right: 40px; text-align: right; font-size: 12px;">
                        <div style="border-top: 1px solid #000; width: 180px; margin-left: auto;"></div>
                        <p style="margin-top: 5px;">İmza</p>
                    </div>
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

    return (
        <div className="container mx-auto min-h-[83vh] p-4 md:p-8 font-sans antialiased bg-zinc-50 dark:bg-zinc-950 transition-colors">

            {/* Üst Başlık ve İstatistik Alanı */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-2 border-black dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 rounded-none shadow-md mb-8 gap-4">
                <div className="flex items-center gap-3">
                    <span className="w-1.5 h-10 bg-red-600 block"></span>
                    <div>
                        <h2 className="text-xl font-bold text-black dark:text-white uppercase tracking-widest">
                            Zimmet Kayıt Yönetimi
                        </h2>
                        <p className="text-zinc-400 text-xs font-mono uppercase mt-0.5">
                            Personele Atanmış Aktif Envanter Havuzu
                        </p>
                    </div>
                </div>

                {!isLoading && (
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                        <div className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-4 py-2.5 rounded-none flex items-center gap-3">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-none bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-none h-2 w-2 bg-red-600"></span>
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 font-mono">
                                Toplam Zimmet: <span className="text-black dark:text-white font-extrabold ml-1">{totalElements} ADET</span>
                            </span>
                        </div>

                        <button
                            onClick={() => setShowPrintModal(true)}
                            className="px-5 py-2.5 bg-black hover:bg-red-600 text-white rounded-none text-xs font-bold uppercase tracking-wider transition-colors duration-150 flex items-center gap-2 shadow-sm"
                        >
                            DÖKÜM AL / YAZDIR
                        </button>
                    </div>
                )}
            </div>

            {/* Personel Bilgileri Kartı */}
            {user && !isLoading && (
                <div className="mb-8 bg-white dark:bg-zinc-900 rounded-none border-2 border-black dark:border-zinc-800 p-6 shadow-lg relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
                    <div className="flex items-center justify-between mb-4 border-b pb-2 border-zinc-100 dark:border-zinc-800">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                            Zimmet Sorumlusu Personel Bilgileri
                        </h3>
                        <span className="font-mono text-xs font-bold px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white border border-zinc-300 dark:border-zinc-700">
                            P-ID: {user.id}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Ad Soyad</p>
                            <p className="font-bold text-sm text-black dark:text-white uppercase tracking-tight mt-0.5">
                                {user.firstName} {user.lastName}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Kurumsal E-Posta</p>
                            <p className="font-medium text-sm text-black dark:text-zinc-300 mt-0.5">
                                {user.email}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Sistem İletişim</p>
                            <p className="font-mono text-sm text-black dark:text-zinc-300 mt-0.5">
                                {user.phone}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">T.C. Kimlik No</p>
                            <p className="font-mono text-sm text-black dark:text-zinc-300 mt-0.5">
                                {user.tcNo}
                            </p>
                        </div>
                    </div>
                </div>
            )}


            {isLoading ? (
                <div className="flex flex-col items-center justify-center pt-32 gap-3">
                    <div className="animate-spin h-10 w-10 border-4 border-zinc-200 border-t-black dark:border-zinc-800 dark:border-t-red-600 rounded-none" />
                    <p className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 animate-pulse">
                        Sistem Veritabanı Okunuyor...
                    </p>
                </div>
            ) : (
                <div className="w-full bg-white dark:bg-zinc-900 rounded-none border-2 border-black dark:border-zinc-800 shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-black dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 select-none">
                                    <th className="py-4 px-4 w-[20%] pl-6">Sınıflandırma</th>
                                    <th className="py-4 px-4 w-[18%]">Envanter Kodları</th>
                                    <th className="py-4 px-4 w-[15%]">Kayıtlı Miktar</th>
                                    <th className="py-4 px-6 w-[47%]">Varlık Açıklaması / Detay</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {products.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                                    >
                                        <td className="py-4 px-4 whitespace-nowrap pl-6">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-none bg-zinc-900 text-white dark:bg-zinc-800 border border-transparent w-fit">
                                                    {product.brand || "Markasız"}
                                                </span>
                                                <span className="text-xs text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-tight">
                                                    {product.categoryName}{" "}
                                                    <span className="text-zinc-300 dark:text-zinc-700 font-normal">//</span>{" "}
                                                    <span className="text-zinc-400">{product.subCategoryName}</span>
                                                </span>
                                            </div>
                                        </td>

                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <div className="flex flex-col text-xs font-mono text-zinc-600 dark:text-zinc-400 gap-1">
                                                <span>
                                                    <span className="text-zinc-400 font-sans text-[10px] font-bold uppercase">barcode:</span>{" "}
                                                    {product.barcode || "-"}
                                                </span>
                                                <span>
                                                    <span className="text-zinc-400 font-sans text-[10px] font-bold uppercase">Boyut:</span>{" "}
                                                    {product.size || "-"}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-none bg-red-600"></div>
                                                <span className="text-sm font-bold font-mono text-black dark:text-white">
                                                    {product.stock}{" "}
                                                    <span className="text-xs font-sans font-bold text-zinc-400 uppercase">Adet</span>
                                                </span>
                                            </div>
                                        </td>

                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                <div className="relative h-14 w-14 min-w-[56px] rounded-none overflow-hidden bg-zinc-100 border-2 border-zinc-200 dark:border-zinc-700 shadow-sm">
                                                    <img
                                                        src={
                                                            product.images?.length > 0
                                                                ? product.images[0]
                                                                : "https://via.placeholder.com/400x300"
                                                        }
                                                        alt={product.title}
                                                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-150"
                                                    />
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="font-bold text-black dark:text-white text-sm uppercase tracking-tight line-clamp-1 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                                                        {product.title}
                                                    </span>
                                                    <span className="text-xs text-zinc-400 dark:text-zinc-400 mt-0.5 line-clamp-2 font-normal leading-normal max-w-sm">
                                                        {product.description}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {products.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                            <div className="w-12 h-1 bg-red-600 mb-3"></div>
                            <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-black dark:text-white">
                                KAYITLI ENVANTER BULUNMUYOR
                            </h3>
                            <p className="text-xs text-zinc-400 font-medium max-w-sm mt-1 uppercase tracking-tight">
                                İlgili personel hesabına atanmış aktif bir zimmet kaydı tespit edilemedi.
                            </p>
                        </div>
                    )}

                    {/* Kurumsal Sayfalama (Pagination) Alt Barı */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-900 border-t-2 border-black dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4 select-none">
                            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
                                Sayfa {currentPage + 1} / {totalPages} — Toplam {totalElements} Kayıt
                            </span>
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                    disabled={currentPage === 0}
                                    className="px-3 py-1.5 border border-black dark:border-zinc-700 font-mono text-xs font-bold uppercase bg-white dark:bg-zinc-800 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-red-600 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-black dark:disabled:hover:bg-zinc-800 cursor-pointer disabled:cursor-not-allowed transition-colors"
                                >
                                    ◀ ÖNCEKİ
                                </button>

                                <div className="flex gap-1">
                                    {Array.from({ length: totalPages }).map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentPage(idx)}
                                            className={`w-8 h-8 border text-xs font-mono font-bold transition-colors ${
                                                currentPage === idx
                                                    ? "bg-black text-white border-black dark:bg-red-600 dark:border-red-600"
                                                    : "bg-white text-black border-zinc-300 dark:bg-zinc-800 dark:text-white dark:border-zinc-700 hover:border-black"
                                            }`}
                                        >
                                            {idx + 1}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                    disabled={currentPage === totalPages - 1}
                                    className="px-3 py-1.5 border border-black dark:border-zinc-700 font-mono text-xs font-bold uppercase bg-white dark:bg-zinc-800 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-red-600 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-black dark:disabled:hover:bg-zinc-800 cursor-pointer disabled:cursor-not-allowed transition-colors"
                                >
                                    SONRAKİ ▶
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Yazdırma Seçenekleri Modalı */}
            {showPrintModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs">
                    <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 rounded-none shadow-2xl p-6 w-[400px] relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
                        <h3 className="text-base font-bold text-black dark:text-white uppercase tracking-wider mb-1">
                            Rapor Yazdırma Protokolü
                        </h3>
                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-tight mb-6">
                            Çıktı belgesi için görsel veri tercihini belirleyin.
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => {
                                    handlePrint(true);
                                    setShowPrintModal(false);
                                }}
                                className="w-full py-3 bg-black hover:bg-red-600 text-white rounded-none font-bold text-xs uppercase tracking-wider transition-colors duration-150 shadow-md"
                            >
                                Görsel Kayıtları Dahil Et
                            </button>

                            <button
                                onClick={() => {
                                    handlePrint(false);
                                    setShowPrintModal(false);
                                }}
                                className="w-full py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-black dark:text-white border border-zinc-300 dark:border-zinc-600 rounded-none font-bold text-xs uppercase tracking-wider transition-colors duration-150"
                            >
                                Sadece Metin Raporu Yazdır
                            </button>

                            <button
                                onClick={() => setShowPrintModal(false)}
                                className="w-full py-2.5 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-400 hover:text-black dark:hover:text-white rounded-none font-bold text-xs uppercase tracking-wider transition-colors duration-150 mt-1"
                            >
                                İptal Et
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProducts;