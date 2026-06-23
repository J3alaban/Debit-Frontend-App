import { FC, useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { updateLoading } from "../redux/features/homeSlice";
import { Config } from "../helpers/Config";

interface SubCategory {
    id: number;
    name: string;
    categoryId: number;
    categoryName: string;
}

const SubCategories: FC = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();

    const categoryId = location.state?.categoryId;

    const isLoading = useAppSelector(
        (state) => state.homeReducer.isLoading
    );

    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

    useEffect(() => {
        if (!categoryId) return;

        dispatch(updateLoading(true));

        fetch(
            `${Config.api.baseUrl}/api/v1/subcategories/${categoryId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
            .then((res) => res.json())
            .then((data) => {
                setSubCategories(data);
            })
            .catch((err) => {
                console.error("SubCategories fetch error:", err);
            })
            .finally(() => {
                dispatch(updateLoading(false));
            });
    }, [categoryId, dispatch]);

    return (
        <div className="container mx-auto min-h-[83vh] p-4 md:p-8 font-sans antialiased bg-zinc-50 dark:bg-zinc-950 transition-colors">

            {/* Kurumsal Başlık Paneli */}
            <div className="border-l-4 border-red-600 pl-4 mb-8 bg-white dark:bg-zinc-900 p-4 border-2 border-zinc-200 dark:border-zinc-800 rounded-none shadow-sm">
                <h2 className="text-xl font-bold text-black dark:text-white uppercase tracking-widest">
                    Zimmet Alt Sınıflandırmaları
                </h2>
                <p className="text-zinc-500 font-mono text-xs uppercase mt-1">
                    Bağlı Bulunan Alt Grup /  (Üst Grup: {subCategories[0]?.categoryName || "Seçilen Kategori"})
                </p>
            </div>

            {/* Yükleniyor Göstergesi */}
            {isLoading ? (
                <div className="flex items-center justify-center">
                    <div className="animate-spin mt-32 rounded-none h-10 w-10 border-4 border-zinc-200 border-t-black dark:border-zinc-800 dark:border-t-red-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                    {subCategories.map((item) => (
                        <div
                            key={item.id}
                            className="group relative bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800
                            transition-all duration-150 hover:border-black dark:hover:border-red-600
                            p-5 flex flex-col justify-between aspect-square md:aspect-auto md:min-h-48 rounded-none shadow-sm"
                        >
                            {/* Kurumsal Mimari Ayracı */}
                            <span className="absolute top-2 right-4 text-zinc-100 dark:text-zinc-800 font-mono font-bold text-2xl select-none">
                                //
                            </span>

                            <div className="relative z-10 space-y-1">
                                <h3 className="text-sm font-bold text-black dark:text-white uppercase tracking-tight group-hover:text-red-600 transition-colors">
                                    {item.name}
                                </h3>

                                <p className="text-[10px] font-bold font-mono uppercase text-zinc-400">
                                    Kod: SC-{item.id}
                                </p>
                            </div>

                            <Link
                                to="/subcategory-products"
                                state={{ subCategoryId: item.id }}
                                className="text-xs font-bold uppercase tracking-wider text-black dark:text-white hover:text-red-600 dark:hover:text-red-500 border-b border-black dark:border-white pb-0.5 self-start mt-6 transition-colors"
                            >
                                Envanteri Listele &rarr;
                            </Link>

                            {/* Alt Çizgi Efekti Kurumsal Kırmızıya Çevrildi */}
                            <div className="absolute bottom-0 left-0 w-0 h-1 bg-red-600 group-hover:w-full transition-all duration-200"></div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SubCategories;