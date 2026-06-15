import { FC } from "react";
import useDiscount from "../hooks/useDiscount";

const PriceSection: FC<{ price: number; discountPercentage: number }> = ({
  price,
  discountPercentage = 0,
}) => {
  const result = useDiscount({ price, discount: discountPercentage });
  const discount = parseFloat(discountPercentage.toString());

  // TL Simgesi Değişkeni
  const currencySymbol = "₺";

  if (Math.floor(discount) === 0) {
    return (
      <h2 className="font-medium text-blue-500 text-xl">
        {currencySymbol}{price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
      </h2>
    );
  }

  return (
    <div className="leading-3">
      {/* İndirimli Fiyat */}
      <h2 className="font-medium text-blue-500 text-xl">
        {currencySymbol}{result.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </h2>
      
      <div className="flex items-center gap-2 mt-1">
        {/* Eski Fiyat (Üstü Çizili) */}
        <span className="text-sm line-through opacity-70 dark:text-white">
          {currencySymbol}{price.toLocaleString("tr-TR")}
        </span>
        
        {/* İndirim Oranı */}
        <span className="text-sm font-semibold text-red-500 dark:text-red-400">
          -{discountPercentage}%
        </span>
      </div>
    </div>
  );
};

export default PriceSection;