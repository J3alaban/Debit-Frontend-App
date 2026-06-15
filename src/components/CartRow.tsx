import { FC } from "react";
import { IoIosAddCircleOutline, IoIosRemoveCircleOutline } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";

interface CartRowProps {
    productId: number;
    productTitle: string;
    price: number;
    quantity: number;
    onUpdateQuantity: (productId: number, newQuantity: number) => void;
    onDelete: (productId: number) => void;
}

const CartRow: FC<CartRowProps> = ({
                                       productId,
                                       productTitle,
                                       price,
                                       quantity,
                                       onUpdateQuantity,
                                       onDelete,
                                   }) => {
    // Para birimi formatlama
    const formatPrice = (num: number) =>
        new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(num);

    return (
        <div className="grid grid-cols-7 gap-3 border p-4 items-center rounded-lg shadow-sm bg-white">
            <div className="col-span-3">
                <h3 className="font-bold text-gray-800">{productTitle}</h3>
                <p className="text-sm text-gray-500">Birim: {formatPrice(price)}</p>
            </div>

            <div className="col-span-2 flex items-center space-x-3">
                <IoIosRemoveCircleOutline
                    className="text-2xl cursor-pointer hover:text-red-500 transition-colors"
                    onClick={() => quantity > 1 && onUpdateQuantity(productId, quantity - 1)}
                />
                <span className="font-bold text-lg min-w-[20px] text-center">{quantity}</span>
                <IoIosAddCircleOutline
                    className="text-2xl cursor-pointer hover:text-blue-500 transition-colors"
                    onClick={() => onUpdateQuantity(productId, quantity + 1)}
                />
            </div>

            <div className="col-span-2 flex justify-between items-center">
        <span className="font-bold text-green-600">
          {formatPrice(price * quantity)}
        </span>
                <RiDeleteBin6Line
                    className="text-red-500 cursor-pointer text-2xl hover:scale-110 transition-transform"
                    onClick={() => onDelete(productId)}
                />
            </div>
        </div>
    );
};

export default CartRow;












/* import { FC } from "react";
import { CartItem } from "../models/CartItem";
import {
  IoIosAddCircleOutline,
  IoIosRemoveCircleOutline,
} from "react-icons/io";
import { useAppDispatch } from "../redux/hooks";
import {
  addToCart,
  reduceFromCart,
  removeFromCart,
} from "../redux/features/cartSlice";
import { RiDeleteBin6Line } from "react-icons/ri";
import useDiscount from "../hooks/useDiscount";

*/



