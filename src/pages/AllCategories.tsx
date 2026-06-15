import { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addCategories } from "../redux/features/productSlice";
import { Link } from "react-router-dom";
import { updateLoading } from "../redux/features/homeSlice";
import { Config } from "../helpers/Config";

const AllCategories: FC = () => {
  const dispatch = useAppDispatch();

  const allCategories = useAppSelector(
      (state) => state.productReducer.categories
  );
  const isLoading = useAppSelector((state) => state.homeReducer.isLoading);

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

  return (
      <div className="container mx-auto min-h-[83vh] p-4 md:p-8 font-karla">
        {/* Başlık - Köşeli ve Çizgili Tasarım */}
        <div className="border-l-4 border-indigo-600 pl-4 mb-10">
          <h2 className="text-3xl font-black text-gray-800 dark:text-white uppercase tracking-tighter">
            Envanter
          </h2>
          <p className="text-gray-500 text-sm mt-1">EMS Mobil Sistemler Zimmet Envanteri</p>
        </div>

        {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin mt-32 rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600 dark:border-indigo-300"></div>
            </div>
        ) : (
            /* Responsive Grid: Mobilde 2, Tablette 3, Masaüstünde 4-6 arası */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-0">
              {allCategories &&
                  allCategories.map((category) => (
                      <div
                          key={category.slug}
                          className="group relative bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700
                           transition-all duration-300 hover:z-10 hover:border-indigo-500
                           p-6 flex flex-col justify-between aspect-square md:aspect-auto md:h-48"
                      >
                        {/* Numara efekti (Opsiyonel estetik) */}
                        <span className="absolute top-2 right-4 text-gray-100 dark:text-slate-700 font-black text-4xl group-hover:text-indigo-50 transition-colors">
                  /
                </span>

                        <div className="relative z-10">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {category.name}
                          </h3>
                        </div>

                        <Link
                            to={{ pathname: `/category/${category.slug}` }}
                            className="relative z-10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-all"
                        >
                          Ürünleri Gör
                          <span className="transform group-hover:translate-x-2 transition-transform duration-300">
                    →
                  </span>
                        </Link>

                        {/* Hover alt çizgi efekti */}
                        <div className="absolute bottom-0 left-0 w-0 h-1 bg-indigo-600 group-hover:w-full transition-all duration-300"></div>
                      </div>
                  ))}
            </div>
        )}
      </div>
  );
};

export default AllCategories;
