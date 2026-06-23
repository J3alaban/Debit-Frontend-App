import { FC, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { addProducts } from "../redux/features/productSlice";
import { updateLoading } from "../redux/features/homeSlice";
import { Product } from "../models/Product";

import SortProducts from "../components/SortProducts";
import PaginatedProducts from "../components/PaginatedProducts";
import { Config } from "../helpers/Config";

const AllProducts: FC = () => {
    const dispatch = useAppDispatch();

    const handleSort = (sortedProducts: Product[]) => {
        dispatch(addProducts(sortedProducts));
    };

    const allProducts = useAppSelector(
        state => state.productReducer.allProducts ?? []
    );

    const isLoading = useAppSelector(
        state => state.homeReducer.isLoading
    );

    useEffect(() => {
        dispatch(updateLoading(true));

        fetch(`${Config.api.baseUrl}/api/v1/products`)
            .then(res => res.json())
            .then((data: { content: Product[] }) => {
                const productIds = data.content.map(p => p.id);
                localStorage.setItem("productIds", JSON.stringify(productIds));
                localStorage.setItem("products", JSON.stringify(data.content));
                dispatch(addProducts(data.content));
            })
            .finally(() => {
                dispatch(updateLoading(false));
            });
    }, [dispatch]);

    return (
        <div className="mx-auto min-h-[83vh] p-4 md:p-6 font-sans antialiased bg-zinc-50 dark:bg-zinc-950 transition-colors">
            <div className="grid grid-cols-4 gap-4">
                <div className="col-span-4 space-y-6">

                    {/* Üst Kontrol ve Filtreleme Paneli */}
                    <div className="flex items-center justify-between border-b-2 border-black dark:border-zinc-800 pb-4">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-5 bg-red-600 inline-block"></span>
                            <span className="text-base font-bold uppercase tracking-wider text-black dark:text-white">
                                Demirbaş & Malzeme Envanteri
                            </span>
                        </div>

                        {/* Sıralama Bileşeni */}
                        <div className="flex items-center">
                            <SortProducts
                                products={allProducts}
                                onChange={handleSort}
                            />
                        </div>
                    </div>

                    {/* Paginated Listeleme Alanı */}
                    <PaginatedProducts
                        products={allProducts}
                        isLoading={isLoading}
                        initialRows={5}
                    />
                </div>
            </div>
        </div>
    );
};

export default AllProducts;