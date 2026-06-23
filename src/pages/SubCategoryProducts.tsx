import { FC, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { updateLoading } from "../redux/features/homeSlice";
import { Config } from "../helpers/Config";

interface Product {
    id: number;
    name: string;
    description?: string;
    price?: number; // Backend model uyumluluğu için tutuluyor
}

const SubCategoryProducts: FC = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();

    const subCategoryId = location.state?.subCategoryId;

    const isLoading = useAppSelector(
        (state) => state.homeReducer.isLoading
    );

    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        if (!subCategoryId) return;

        dispatch(updateLoading(true));

        fetch(
            `${Config.api.baseUrl}/api/v1/products/sub-category/${subCategoryId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
            .then((res) => res.json())
            .then((data) => {
                setProducts(data.content || []);
            })
            .catch((err) => {
                console.error("Product fetch error:", err);
            })
            .finally(() => {
                dispatch(updateLoading(false));
            });
    }, [subCategoryId, dispatch]);

    return (
        <div className="container mx-auto min-h-[83vh] p-4 md:p-8 font-sans antialiased bg-zinc-50 dark:bg-zinc-950 transition-colors">

            {/* Sol Kırmızı Çizgili Kurumsal Başlık Paneli */}
            <div className="border-l-4 border-red-600 pl-4 mb-8">
                <h2 className="text-xl font-bold text-black dark:text-white uppercase tracking-widest">
                    Kayıtlı Varlık ve Envanter Listesi
                </h2>
                <p className="text-zinc-500 font-mono text-xs uppercase mt-1">
                    Seçilen alt sınıfa bağlı aktif zimmet / hizmet varlıkları
                </p>
            </div>

            {/* Yükleniyor Göstergesi */}
            {isLoading ? (
                <div className="flex items-center justify-center py-24 w-full bg-white dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                    <div className="relative flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-zinc-200 dark:border-zinc-800 border-t-red-600 dark:border-t-red-500"></div>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-black dark:text-zinc-400 mt-4 animate-pulse">
                        Varlık Kayıtları Yükleniyor...
                    </span>
                </div>
            ) : (
                /* Kurumsal Liste Düzeni (Tablo Görünümü) */
                <div className="w-full overflow-x-auto border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono font-bold">
                                <th className="p-4 w-32">Sistem No</th>
                                <th className="p-4">EMS / Varlık Adı</th>
                                <th className="p-4 hidden md:table-cell">Açıklama / Detaylar</th>
                                <th className="p-4 text-right w-24">Durum</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 font-medium">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-zinc-400 dark:text-zinc-500 font-mono uppercase tracking-wider">
                                        Bu alt sınıfa ait kayıtlı varlık bulunamadı.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-black dark:text-zinc-300 transition-colors"
                                    >
                                        {/* Barkod / Sistem No */}
                                        <td className="p-4 font-mono font-bold text-red-600 dark:text-red-500 whitespace-nowrap">
                                            EMS-{product.id}
                                        </td>

                                        {/* Varlık Adı */}
                                        <td className="p-4 font-bold uppercase tracking-wide">
                                            {product.name}
                                        </td>

                                        {/* Açıklama (Mobil ekranlarda gizlenir, md ve sonrasında görünür) */}
                                        <td className="p-4 text-zinc-500 dark:text-zinc-400 font-normal max-w-md hidden md:table-cell line-clamp-2">
                                            {product.description || <span className="italic text-zinc-300 dark:text-zinc-600">Tanımlama yapılmamış.</span>}
                                        </td>

                                        {/* Durum Etiketi */}
                                        <td className="p-4 text-right whitespace-nowrap">
                                            <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700">
                                                Aktif
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SubCategoryProducts;