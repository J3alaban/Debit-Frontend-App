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

    // const API_URL = Config.api.baseUrl;
    const handleSort = (sortedProducts: Product[]) => {
        dispatch(addProducts(sortedProducts));
    };
    // localStorage.setItem("userId", data.id);
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

                localStorage.setItem("productIds", JSON.stringify(productIds));  // başka bir bileşende kullanılmak üzere productIds'yi localStorage a kaydettik
                localStorage.setItem("products", JSON.stringify(data.content)); // başka bir bileşende kullanılmak üzere products'ı localStorage a kaydettik



                dispatch(addProducts(data.content));
            })
            .finally(() => {
                dispatch(updateLoading(false));
            });

    }, [dispatch]);


    /*

    useEffect(() => {
      if (!token) return;

      dispatch(updateLoading(true));

      fetch(`${Config.api.baseUrl}/api/v1/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then((data: { content: Product[] }) => {
          dispatch(addProducts(data.content));
        })
        .finally(() => {
          dispatch(updateLoading(false));
        });
    }, [dispatch, token]);

    */


    return (
        <div className="container mx-auto min-h-[83vh] p-4 font-karla">
            <div className="grid grid-cols-4 gap-1">
                <div className="col-span-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-lg dark:text-white">Ürünler</span>
                        <SortProducts
                            products={allProducts}
                            onChange={handleSort}/>
                    </div>

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






































/*
import { FC, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { addProducts } from "../redux/features/productSlice";
import { Product } from "../models/Product";
import { updateLoading } from "../redux/features/homeSlice";
import SortProducts from "../components/SortProducts"
import PaginatedProducts from "../components/PaginatedProducts";

const AllProducts: FC = () => {
  const dispatch = useAppDispatch();
  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
  const allProducts = useAppSelector(
    (state) => state.productReducer.allProducts
  );
  const isLoading = useAppSelector((state) => state.homeReducer.isLoading);

  useEffect(() => {
    const fetchProducts = () => {
      dispatch(updateLoading(true));
      fetch("https://dummyjson.com/products?limit=500")  // https://dummyjson.com/products?limit=500 
        .then((res) => res.json())
        .then(({ products }) => {
          dispatch(addProducts(products));
          dispatch(updateLoading(false));
        });
    };

    if (allProducts.length === 0) fetchProducts();
  }, [allProducts, dispatch]);

  useEffect(() => {
    setCurrentProducts(allProducts);
  }, [allProducts]);

  return (
    <div className="container mx-auto min-h-[83vh] p-4 font-karla">
      <div className="grid grid-cols-4 gap-1">
        <div className="col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg dark:text-white">Products</span>
            <SortProducts products={currentProducts} onChange={setCurrentProducts} />
          </div>

          <PaginatedProducts products={currentProducts} isLoading={isLoading} initialRows={5} />
        </div>
      </div>
    </div>
  );
};

export default AllProducts;  */ 

































 /*   Local api ile bağlantıya geçer 
 
 import { FC, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { addProducts } from "../redux/features/productSlice";
import { Product } from "../models/Product";
import { updateLoading } from "../redux/features/homeSlice";
import SortProducts from "../components/SortProducts";
import PaginatedProducts from "../components/PaginatedProducts";

const AllProducts: FC = () => {
  const token =
    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBkb21haW4uY29tIiwiaWF0IjoxNzY1OTA4NTcwLCJleHAiOjE3NjU5MTIxNzB9.7gnq0M8PwrQuqXsDNjd7VrHCNe9sTWE_GjPKHpiXFRw";

  const dispatch = useAppDispatch();

  const allProducts = useAppSelector(
    state => state.productReducer.allProducts ?? []
  );

  const isLoading = useAppSelector(
    state => state.homeReducer.isLoading
  );
useEffect(() => {
  dispatch(updateLoading(true));

  fetch("http://localhost:8080/api/v1/products", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then((data: { content: Product[] }) => {
      dispatch(addProducts(data.content));
    })
    .finally(() => {
      dispatch(updateLoading(false));
    });
}, [dispatch]);
  return (
    <div className="container mx-auto min-h-[83vh] p-4 font-karla">
      <div className="grid grid-cols-4 gap-1">
        <div className="col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg dark:text-white">Products</span>
            <SortProducts products={allProducts} />
          </div>

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
*/