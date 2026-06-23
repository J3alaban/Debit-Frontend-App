import { FC, useRef } from "react";
import { Product } from "../models/Product";

interface Props {
    products: Product[];
    onChange: (sorted: Product[]) => void;
}

const SortProducts: FC<Props> = ({ products, onChange }) => {
    const sortRef = useRef<HTMLSelectElement>(null);

    const sortProducts = (sortValue: string) => {
        let sorted: Product[] = [...products];

        if (sortValue === "asc") {
            sorted = sorted.sort((a, b) => {
                const aPrice = a.price - (a.price * (a.discountPercentage ?? 0)) / 100;
                const bPrice = b.price - (b.price * (b.discountPercentage ?? 0)) / 100;
                return aPrice - bPrice;
            });
        } else if (sortValue === "desc") {
            sorted = sorted.sort((a, b) => {
                const aPrice = a.price - (a.price * (a.discountPercentage ?? 0)) / 100;
                const bPrice = b.price - (b.price * (b.discountPercentage ?? 0)) / 100;
                return bPrice - aPrice;
            });
        } else {
            sorted = sorted.sort((a, b) => a.id - b.id);
        }

        onChange(sorted);
    };

    return (
        <select
            ref={sortRef}
            className="border-2 border-black bg-white text-black text-xs uppercase tracking-wider font-bold py-2 px-3 rounded-none outline-none focus:border-red-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-red-500 cursor-pointer transition-colors duration-150"
            onChange={(e) => sortProducts(e.target.value)}
        >
            <option value="default" className="font-sans">Sıralama: Varsayılan (Kayıt No)</option>
            <option value="asc" className="font-sans">Demirbaş Değeri: Düşükten Yükseğe</option>
            <option value="desc" className="font-sans">Demirbaş Değeri: Yüksekten Düşüğe</option>
        </select>
    );
};

export default SortProducts;