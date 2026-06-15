import { FC, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Product } from "../models/Product";
import { /*useAppDispatch,*/ useAppSelector } from "../redux/hooks";
 // import { updateLoading } from "../redux/features/homeSlice";
import SortProducts from "../components/SortProducts";
import PaginatedProducts from "../components/PaginatedProducts";


interface Category {
  id: number;
  name: string;
  slug: string;
}

const SearchPage: FC = () => {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") || "").toLowerCase();

  const [products, setProducts] = useState<Product[]>([]);
  const [categoryResults, setCategoryResults] = useState<Category[]>([]);
  const [notFound, setNotFound] = useState(false);

  //  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.homeReducer.isLoading);
  const navigate = useNavigate();

useEffect(() => {
  const products: Product[] =
    JSON.parse(localStorage.getItem("products") || "[]");

  const categories: Category[] =
    JSON.parse(localStorage.getItem("categories") || "[]");

  if (!query) {
    setProducts([]);
    setCategoryResults([]);
    setNotFound(true);
    return;
  }

  const q = query.toLowerCase();
  setNotFound(false);

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(q)
  );

  if (filteredProducts.length > 0) {
    setProducts(filteredProducts);
    setCategoryResults([]);
    return;
  }

  const matchedCategories = categories.filter(
    c =>
      c.name.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q)
  );

  if (matchedCategories.length > 0) {
    setCategoryResults(matchedCategories);
    setProducts([]);
  } else {
    setNotFound(true);
  }
}, [query]);
  return (
    <div className="container mx-auto min-h-[83vh] p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-lg">
            Search results for: <b>"{query}"</b>
          </span>

          {products.length > 0 && (
            <SortProducts products={products} onChange={setProducts} />
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center mt-32">
            <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-gray-900 rounded-full" />
          </div>
        ) : notFound ? (
          <div className="text-center mt-32 text-2xl">
            Sonuç bulunamadı.
          </div>
        ) : categoryResults.length > 0 ? (
          <div>
            <p className="mb-4 text-lg">Eşleşen kategoriler:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categoryResults.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => navigate(`/category/${cat.slug}`)}
                  className="cursor-pointer bg-gray-100 p-4 hover:bg-gray-200 rounded"
                >
                  <div className="font-semibold">{cat.name}</div>
                  <span className="text-blue-500 text-sm">Ürünleri gör</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <PaginatedProducts
            products={products}
            isLoading={isLoading}
            initialRows={5}
          />
        )}
      </div>
    </div>
  );
};

export default SearchPage;
