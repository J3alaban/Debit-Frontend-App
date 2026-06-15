import { FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// NOT: Bu import yolları yerel projenizdeki dosya yapısına göredir.
// Canvas ortamında bu dosyalar bulunmadığı için derleme hatası verebilir,
// ancak kendi projenize kopyaladığınızda sorunsuz çalışacaktır.
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Product } from "../models/Product";
import RatingStar from "../components/RatingStar";
import PriceSection from "../components/PriceSection";
import toast from "react-hot-toast";
import { AiOutlineShoppingCart } from "react-icons/ai";

import ProductList from "../components/ProductList";
 // import Reviews from "../components/Reviews";
import useAuth from "../hooks/useAuth";
import { MdFavoriteBorder } from "react-icons/md";
import { addToWishlist } from "../redux/features/productSlice";
import { updateLoading } from "../redux/features/homeSlice";
import { Config } from "../helpers/Config";

/**
 * SingleProduct Bileşeni
 * Ürün detaylarını ve resim galerisini yönetir.
 */
const SingleProduct: FC = () => {
  const dispatch = useAppDispatch();
  const { productID } = useParams();
  const navigate = useNavigate();
  const { requireAuth } = useAuth();

  const wishlist = useAppSelector((state) => state.productReducer.wishlist);

  const [product, setProduct] = useState<Product>();
  const [imgs, setImgs] = useState<string[]>([]);
  const [selectedImg, setSelectedImg] = useState<string>();
  const [sCategory, setScategory] = useState<string>();
  const [similar, setSimilar] = useState<Product[]>([]);

  const isLoading = useAppSelector((state) => state.homeReducer.isLoading);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!productID) return;

    dispatch(updateLoading(true));

    fetch(`${Config.api.baseUrl}/api/v1/products/${productID}`)
      .then((res) => res.json())
      .then((data: Product) => {
        setProduct(data);
        const productImages = data.images || [];
        setImgs(productImages);
        setScategory(data.category);
        setSelectedImg(productImages[0] || data.thumbnail);
        localStorage.setItem("singleProductId", String(data.id));
      })
      .catch((err) => {
        console.error("Veri çekme hatası:", err);
        toast.error("Ürün bilgileri yüklenemedi.");
      })
      .finally(() => {
        dispatch(updateLoading(false));
      });
  }, [productID, dispatch]);

  useEffect(() => {
    if (!sCategory) return;

    fetch(`${Config.api.baseUrl}/api/v1/products?category=${encodeURIComponent(sCategory)}`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.content.filter((p: Product) => p.id !== Number(productID));
        setSimilar(filtered);
      });
  }, [sCategory, productID]);

    const addCart = () => {
        requireAuth(async () => {
            if (!product) return;

            const userId = localStorage.getItem("userId");
            if (!userId) return;

            await fetch(`${Config.api.baseUrl}/api/v1/carts/${userId}/items`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: product.id,
                    quantity: 1
                }),
            });

            toast.success("Ürün sepete eklendi");
        });
    };

  const addWishlist = async () => {
    requireAuth(async () => {
      if (!product) return;

      const userId = localStorage.getItem("userId");
      if (!userId) return;

      // Zaten wishlist'te var mı kontrol et
      if (wishlist.some((p) => p.id === product.id)) {
        toast("Ürün zaten favorilerinizde.");
        return;
      }

      try {
        await fetch(`${Config.api.baseUrl}/api/v1/wishlist/${userId}/${product.id}`, { method: "POST" });
        dispatch(addToWishlist(product));
        toast.success("Ürün favorilere eklendi.");
      } catch (error) {
        toast.error("İşlem sırasında bir hata oluştu.");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[83vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-8 dark:text-white px-4 md:px-0">
      <button
        onClick={() => navigate(-1)}
        className="hover:text-pink-600 mb-6 transition-colors flex items-center gap-2 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span> Geri Dön
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 font-karla">
        <div className="space-y-4">
          {selectedImg && (
            <div className="border rounded-2xl overflow-hidden bg-white shadow-sm flex justify-center items-center h-[450px] p-4">
              <img
                src={selectedImg}
                alt={product?.title}
                className="max-h-full max-w-full object-contain transition-all duration-500"
              />
            </div>
          )}

          <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
            {imgs.map((img, idx) => (
              <button
                key={`${img}-${idx}`}
                onClick={() => setSelectedImg(img)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all duration-200 ${
                  img === selectedImg
                    ? "border-pink-500 ring-2 ring-pink-100 scale-105"
                    : "border-gray-100 hover:border-gray-300"
                }`}
              >
                <img
                  src={img}
                  alt={`Galeri ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <span className="text-pink-600 font-bold text-sm uppercase tracking-widest">{product?.brand}</span>
            <h1 className="text-3xl font-bold mt-1 text-gray-800 dark:text-gray-100 leading-tight">{product?.title}</h1>
            {product?.rating && <div className="mt-2"><RatingStar rating={product.rating} /></div>}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700">
{product?.discountPercentage !== undefined && (
  <PriceSection discountPercentage={product.discountPercentage} price={product.price} />
)}
          </div>

          <div className="space-y-3 border-b border-gray-100 dark:border-gray-800 pb-5 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Kategori</span>
              <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">{product?.category}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Stok Bilgisi</span>
              <span className={`font-semibold ${(product?.stock || 0) < 10 ? "text-orange-500" : "text-green-600"}`}>
                {product?.stock} adet mevcut
              </span>
            </div>
            <div className="flex justify-between items-center">
  <span className="text-gray-500 dark:text-gray-400 font-medium">Beden</span>
  <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
    {product?.size && product.size.trim() !== "" ? product.size : "-"}
  </span>
</div>
          </div>







          <div>
            <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200">Ürün Detayı</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed italic">{product?.description}</p>
          </div>

          <div className="flex gap-4 mt-auto pt-6">

            <button
              onClick={addCart}
              className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-pink-200 dark:shadow-none"
            >
              <AiOutlineShoppingCart size={24} />
              Sepete Ekle
            </button>


            <button
              onClick={addWishlist}
              className="w-14 h-14 border-2 border-gray-200 dark:border-gray-700 hover:border-pink-500 hover:text-pink-500 rounded-xl flex items-center justify-center transition-all active:scale-95 text-gray-400"
              title="Favorilere Ekle"
            >
              <MdFavoriteBorder size={28} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <hr className="mb-12 border-gray-100 dark:border-gray-800" />
        <ProductList title="Benzer Ürünler" products={similar} />
      </div>
    </div>
  );
};

export default SingleProduct;

