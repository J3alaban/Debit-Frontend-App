import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { updateLoading } from "../redux/features/homeSlice";
import { Config } from "../helpers/Config";

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
}

interface ProductResponse {
    content: Product[];
    totalPages: number;
    totalElements: number;
}

const UserProducts: FC = () => {
    const dispatch = useAppDispatch();

    const isLoading = useAppSelector(
        (state) => state.homeReducer.isLoading
    );

    const [products, setProducts] = useState<Product[]>([]);

    const storedUserId =
        localStorage.getItem("selectedUserId") ||
        localStorage.getItem("userId");

    useEffect(() => {
        if (!storedUserId) return;

        dispatch(updateLoading(true));

        fetch(`${Config.api.baseUrl}/api/v1/auth/${storedUserId}/products`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data: ProductResponse) => {
                setProducts(data.content);
            })
            .catch((err) => console.error(err))
            .finally(() => {
                dispatch(updateLoading(false));
            });
    }, [dispatch, storedUserId]);
    

    return (
        <div className="container mx-auto min-h-[83vh] p-4 md:p-8 font-karla">
            <div className="border-l-4 border-indigo-600 pl-4 mb-10">
                <h2 className="text-3xl font-black text-gray-800 dark:text-white uppercase tracking-tighter">
                    Ürünlerim
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                    Kullanıcıya ait ürün listesi
                </p>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center">
                    <div className="animate-spin mt-32 rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600 dark:border-indigo-300"></div>
                </div>
            ) : (
                <>
                    <div className="mb-6 text-sm text-gray-600 dark:text-gray-300">
                        Toplam Ürün:{" "}
                        <span className="font-bold">{products.length}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                            >
                                <div className="h-56 overflow-hidden bg-gray-100">
                                    <img
                                        src={
                                            product.images?.length > 0
                                                ? product.images[0]
                                                : "https://via.placeholder.com/400x300"
                                        }
                                        alt={product.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                <div className="p-4">
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                                        {product.title}
                                    </h3>

                                    <p className="text-sm text-gray-500 dark:text-gray-300 mb-3 line-clamp-2">
                                        {product.description}
                                    </p>

                                    <div className="space-y-1 text-sm">
                                        <p>
                                            <span className="font-semibold">Marka:</span>{" "}
                                            {product.brand}
                                        </p>

                                        <p>
                                            <span className="font-semibold">Kategori:</span>{" "}
                                            {product.categoryName}
                                        </p>

                                        <p>
                                            <span className="font-semibold">Alt Kategori:</span>{" "}
                                            {product.subCategoryName}
                                        </p>

                                        <p>
                                            <span className="font-semibold">SKU:</span>{" "}
                                            {product.sku}
                                        </p>

                                        <p>
                                            <span className="font-semibold">Boyut:</span>{" "}
                                            {product.size}
                                        </p>

                                        <p>
                                            <span className="font-semibold">Stok:</span>{" "}
                                            {product.stock}
                                        </p>
                                    </div>

                                    <div className="mt-4 flex justify-between items-center">
                                        <div>
                                            <p className="text-xl font-bold text-indigo-600">
                                                ₺{product.price.toLocaleString("tr-TR")}
                                            </p>

                                            {product.discountPercentage > 0 && (
                                                <p className="text-xs text-green-600 font-semibold">
                                                    %{product.discountPercentage} İndirim
                                                </p>
                                            )}
                                        </div>

                                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                      Aktif
                    </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {products.length === 0 && (
                            <div className="col-span-full text-center text-gray-500 py-20">
                                Kullanıcıya ait ürün bulunamadı.
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default UserProducts;