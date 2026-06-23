import { FC } from "react";
import { Product } from "../models/Product";


type Props = {
  title: string;
  products: Product[];
  isWishlist?: boolean;
  onDelete?: (productId: number) => void;
};

const ProductList: FC<Props> = ({
  title,
  products,
}) => (
  <div className="mt-8 mx-auto px-4 dark:bg-zinc-900 transition-colors">
    {/* Kurumsal Başlık Alanı */}
    <div className="flex items-center justify-between border-b-2 border-black dark:border-zinc-700 pb-3 mb-6">
      <h2 className="text-xl font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-2">
        <span className="w-2 h-5 bg-red-600 inline-block"></span>
        {title}
      </h2>
      <span className="text-xs font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-1 uppercase tracking-tight">
        Kayıt Sayısı: {products?.length || 0}
      </span>
    </div>
  </div>
);

export default ProductList;