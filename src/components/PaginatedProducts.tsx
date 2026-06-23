import { FC, useEffect, useMemo, useState } from "react";
import { Product } from "../models/Product";

interface Props {
    products: Product[];
    isLoading: boolean;
    initialRows?: number;
}

const getColumnsForWidth = (width: number) => {
    if (width >= 1280) return 1;
    if (width >= 1024) return 1;
    if (width >= 768) return 1;
    return 1;
};

const PaginatedProducts: FC<Props> = ({
    products,
    isLoading,
    initialRows = 10
}) => {

    const [rowsToShow, setRowsToShow] = useState<number>(initialRows);

    const [columns] = useState<number>(() =>
        typeof window !== "undefined" ? getColumnsForWidth(window.innerWidth) : 1
    );

    useEffect(() => {
        const handleResize = () => {
            // tek kolon liste olduğu için sabit
        };

        if (typeof window !== "undefined") {
            window.addEventListener("resize", handleResize);
        }

        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("resize", handleResize);
            }
        };
    }, []);

    const itemsPerPage = useMemo(
        () => rowsToShow * columns,
        [rowsToShow, columns]
    );

    const visibleProducts = products.slice(0, itemsPerPage);
    const allShown = visibleProducts.length >= products.length;

    return (
        <>
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 w-full bg-white dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                    <div className="animate-spin h-10 w-10 border-4 border-t-red-600 border-zinc-300 rounded-full"></div>
                    <span className="text-xs font-bold uppercase mt-4">
                        Yükleniyor...
                    </span>
                </div>
            ) : (
                <>
                    {/* LIST VIEW */}
                    <div className="flex flex-col gap-2">

                        {visibleProducts.map((product) => (
                            <div
                                key={product.id}
                                className="flex items-center justify-between border-2 border-zinc-200 dark:border-zinc-800 p-3 bg-white dark:bg-zinc-900 hover:border-black dark:hover:border-red-600 transition-colors"
                            >

                                {/* LEFT: PRODUCT INFO */}
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm text-black dark:text-white">
                                        {product.title}
                                    </span>

                                    <span className="text-xs text-zinc-500">
                                        {product.description}
                                    </span>
                                </div>

                                {/* RIGHT: META */}
                                <div className="text-xs font-mono text-zinc-500">
                                    ID: {product.id}
                                </div>

                            </div>
                        ))}

                    </div>

                    {/* LOAD MORE */}
                    {!allShown && (
                        <div className="flex flex-col items-center mt-6 pt-4 border-t-2 border-black dark:border-zinc-800">
                            <p className="text-xs font-bold mb-2">
                                {visibleProducts.length} / {products.length}
                            </p>

                            <button
                                onClick={() => setRowsToShow(r => r + initialRows)}
                                className="px-5 py-2 border-2 border-black text-xs font-bold uppercase hover:bg-black hover:text-white transition"
                            >
                                Daha Fazla
                            </button>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default PaginatedProducts;