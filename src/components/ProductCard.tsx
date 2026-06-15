import { FC } from "react";
import { Product } from "../models/Product";
import RatingStar from "./RatingStar";
import { useAppDispatch } from "../redux/hooks";
import toast from "react-hot-toast";
import { HiOutlineBriefcase, HiOutlineTrash } from "react-icons/hi"; // Daha kurumsal ikonlar
import { Link } from "react-router-dom";
import { Config } from "../helpers/Config";
import { addToCart } from "../redux/features/cartSlice";

type ProductCardProps = Product & {
  showDelete?: boolean;
  onDelete?: () => void;
};

interface CartItem {
  productId: number;
  productTitle: string;
  price: number;
  quantity: number;
}

const ProductCard: FC<ProductCardProps> = ({
                                             id,
                                             price,
                                             thumbnail,
                                             title,
                                             category,
                                             rating,
                                             images,
                                             showDelete = false,
                                             onDelete,
                                           }) => {
  const dispatch = useAppDispatch();

  // Arka plandaki sepet mantığını bozmadan zimmet atama gibi çalıştırıyoruz
  const handleAssignAsset = async () => {
    let storedUserId = localStorage.getItem("userId");

    if (!storedUserId) {
      storedUserId = localStorage.getItem("guestId") || crypto.randomUUID();
      localStorage.setItem("guestId", storedUserId);
    }

    try {
      const res = await fetch(
          `${Config.api.baseUrl}/api/v1/carts/${storedUserId}/items`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: id, quantity: 1 }),
          }
      );

      if (!res.ok) throw new Error();

      const cart = (await res.json()) as { items: CartItem[] };
      const addedItem = cart.items.find((i) => i.productId === id);

      if (!addedItem) throw new Error("Zimmet listesine eklenemedi");

      dispatch(
          addToCart({
            id: addedItem.productId,
            title: addedItem.productTitle,
            price: addedItem.price,
            quantity: addedItem.quantity,
            thumbnail: thumbnail || images?.[0],
            category,
            rating,
            discountPercentage: 0,
          })
      );

      toast.success("Demirbaş işlem listesine eklendi");
    } catch {
      toast.error("İşlem gerçekleştirilemedi");
    }
  };

  // Barkod / Seri No simülasyonu (Kurumsal görünüm katmak için id'den benzersiz bir SN üretiyoruz)
  const serialNumber = `SN-${100000 + id}`;

  return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between font-karla">

        {/* Ürün Görseli ve Durum Rozeti */}
        <div className="relative bg-zinc-50 dark:bg-zinc-950 p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-center min-h-[180px]">
          <Link to={`/product/${id}`} className="block w-full">
            <img
                src={thumbnail || images?.[0]}
                alt={title}
                className="h-40 object-contain mx-auto mix-blend-multiply dark:mix-blend-normal transition-transform duration-200 hover:scale-102"
            />
          </Link>

          {/* Durum Rozeti (Örn: Stokta/Mevcut) */}
          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wide uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/40 dark:border-emerald-800/30">
          Mevcut
        </span>
        </div>

        {/* İçerik Alanı */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div>
            {/* Kategori ve Seri Numarası */}
            <div className="flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500 font-medium mb-1">
              <span className="uppercase tracking-wider">{category}</span>
              <span className="font-mono">{serialNumber}</span>
            </div>

            {/* Demirbaş Başlığı */}
            <Link
                to={`/product/${id}`}
                className="font-bold text-zinc-800 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 text-base block truncate"
                title={title}
            >
              {title}
            </Link>

            {/* Kondisyon Puanı (Eski Rating alanı) */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-zinc-400 dark:text-zinc-500">Cihaz Durumu:</span>
              <RatingStar rating={rating ?? 0} />
            </div>
          </div>

          {/* Alt Bilgi ve Aksiyon Butonları */}
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between gap-2">
            {/* Değer / Maliyet Bilgisi */}
            <div>
              <span className="text-[10px] text-zinc-400 block uppercase font-medium">Kayıtlı Değeri</span>
              <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
              {price?.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
            </span>
            </div>

            {/* İşlem Butonları */}
            <div className="flex items-center gap-1.5">
              <button
                  onClick={handleAssignAsset}
                  className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors duration-150 shadow-sm"
                  title="Zimmet İşlemlerine Ekle"
              >
                <HiOutlineBriefcase className="text-sm" />
                <span>Zimmetle</span>
              </button>

              {showDelete && (
                  <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onDelete?.();
                      }}
                      className="p-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 dark:text-red-400 transition-colors duration-150"
                      title="Sistemden Kaldır"
                  >
                    <HiOutlineTrash className="text-base" />
                  </button>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProductCard;