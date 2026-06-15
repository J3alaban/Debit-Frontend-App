import { FC, useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { Product } from "../models/Product";

interface Props {
    products: Product[];
    isLoading: boolean;
    initialRows?: number;
}

const getColumnsForWidth = (width: number) => {
    if (width >= 1280) return 4; // xl
    if (width >= 1024) return 3; // lg
    if (width >= 768) return 2; // md
    return 1; // sm ve altı
};

const PaginatedProducts: FC<Props> = ({ products, isLoading, initialRows = 5 }) => {
    const [rowsToShow, setRowsToShow] = useState<number>(initialRows);
    const [columns, setColumns] = useState<number>(() =>
        typeof window !== "undefined" ? getColumnsForWidth(window.innerWidth) : 4
    );

    useEffect(() => {
        const handleResize = () => {
            setColumns(getColumnsForWidth(window.innerWidth));
        };
        if (typeof window !== "undefined") {
            window.addEventListener("resize", handleResize);
            handleResize();
        }
        return () => {
            if (typeof window !== "undefined") window.removeEventListener("resize", handleResize);
        };
    }, []);

    const itemsPerPage = useMemo(() => rowsToShow * columns, [rowsToShow, columns]);
    const visibleProducts = products.slice(0, itemsPerPage);
    const allShown = visibleProducts.length >= products.length;

    return (
        <>
            {isLoading ? (
                // Kurumsal, pürüzsüz loading alanı
                <div className="flex flex-col items-center justify-center py-24 w-full">
                    <div className="relative flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-zinc-200 dark:border-zinc-800 border-t-zinc-600 dark:border-t-zinc-400"></div>
                    </div>
                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-4 tracking-wide animate-pulse">
                        Envanter kayıtları yükleniyor...
                    </span>
                </div>
            ) : (
                <>
                    {/* Zimmet Kartları için Grid Düzeni */}
                    <div className="grid gap-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
                        {visibleProducts.map((product) => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </div>

                    {/* Daha Fazla Göster Paneli */}
                    {!allShown && (
                        <div className="flex flex-col items-center justify-center mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-900/60 w-full">
                            <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-3">
                                <span className="font-medium text-zinc-600 dark:text-zinc-400">{visibleProducts.length}</span> / {products.length} demirbaş gösteriliyor
                            </p>
                            <button
                                onClick={() => setRowsToShow((r) => r + initialRows)}
                                className="px-5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-sm font-medium shadow-sm transition-all duration-150 active:scale-[0.98]"
                            >
                                Daha Fazla Listele
                            </button>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default PaginatedProducts;