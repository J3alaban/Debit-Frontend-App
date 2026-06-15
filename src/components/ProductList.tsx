import { FC } from "react";
import { Product } from "../models/Product";
import ProductCard from "./ProductCard";


type Props = {
  title: string;
  products: Product[];
  isWishlist?: boolean;
  onDelete?: (productId: number) => void;
};

const ProductList: FC<Props> = ({
  title,
  products,
  isWishlist = false,
  onDelete,
}) => (
  <div className="container mt-8 mx-auto px-4 dark:bg-slate-800">
    <div className="sm:flex items-center justify-between">
      <h2 className="text-4xl font-medium font-lora dark:text-white">
        {title}
      </h2>
    </div>

    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
      {products?.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          category={product.category}
          title={product.title}
          price={product.price}
          thumbnail={product.images?.[0] || ""}
          rating={product.rating}
          discountPercentage={product.discountPercentage}
          showDelete={isWishlist}
          onDelete={() => onDelete?.(product.id)}
        />
      ))}
    </div>
  </div>
);

export default ProductList;
