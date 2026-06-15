import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Config } from "../helpers/Config.tsx";

interface CartItem {
  id: number;
  productId: number;
  productTitle: string;
  price: number;
  quantity: number;
}

interface CartResponse {
  cartId: number;
  userId: number;
  items: CartItem[];
  totalPrice: number;
}

const ITEMS_PER_PAGE = 5;

const Cart = () => {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  // ✅ userId yoksa guestId ile devam et
  const storedUserId =
    localStorage.getItem("userId") || localStorage.getItem("guestId");

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 2,
    }).format(value);

  useEffect(() => {
    if (!storedUserId) return;
    fetch(`${Config.api.baseUrl}/api/v1/carts/${storedUserId}`)
      .then((res) => res.json())
      .then((data) => setCart(data))
      .catch((err) => console.error("Sepet getirme hatası:", err));
  }, [storedUserId]);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (!cart || newQuantity < 1) return;

    const updatedItems = cart.items.map((item) =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );

    const newTotal = updatedItems.reduce(
      (acc, curr) => acc + curr.price * curr.quantity,
      0
    );

    setCart({ ...cart, items: updatedItems, totalPrice: newTotal });
  };

  const handleDelete = (productId: number) => {
    if (!storedUserId) return; // ✅ misafir için de çalışır

    fetch(
      `${Config.api.baseUrl}/api/v1/carts/${storedUserId}/items/${productId}`,
      { method: "DELETE" }
    ).then(() => {
      if (!cart) return;
      const updatedItems = cart.items.filter(
        (item) => item.productId !== productId
      );
      const newTotal = updatedItems.reduce(
        (acc, curr) => acc + curr.price * curr.quantity,
        0
      );
      setCart({ ...cart, items: updatedItems, totalPrice: newTotal });
    });
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <ShoppingBag className="h-24 w-24 text-blue-100 mb-6 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Sepetiniz Boş
          </h2>
          <p className="text-gray-500 mb-8 text-center">
            Henüz ürün eklememişsiniz.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 mx-auto"
          >
            Alışverişe Başla <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    );
  }

  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginatedItems = cart.items.slice(start, start + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(cart.items.length / ITEMS_PER_PAGE) || 1;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 font-karla">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
          <span className="text-blue-600">🛒</span> SEPETİM
        </h1>
        <p className="text-gray-500 mt-2 font-medium">
          Toplam {cart.items.length} ürün bulundu.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {paginatedItems.map((item, index) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center gap-6"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-lg uppercase">
                    {item.productTitle}
                  </h3>
                  <p className="text-sm font-bold text-blue-500">
                    {formatCurrency(item.price)}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center border rounded-xl p-1">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.productId, item.quantity - 1)
                      }
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      min={1}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.productId,
                          Number(e.target.value)
                        )
                      }
                      className="w-12 text-center"
                    />
                    <button
                      onClick={() =>
                        handleQuantityChange(item.productId, item.quantity + 1)
                      }
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button onClick={() => handleDelete(item.productId)}>
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {totalPages > 1 && (
            <div className="flex justify-center gap-4">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                <ArrowRight className="rotate-180" />
              </button>
              <span>
                {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ArrowRight />
              </button>
            </div>
          )}
        </div>

        <div>
          <div className="bg-slate-900 text-white p-8 rounded-2xl sticky top-24">
            <p className="text-sm uppercase mb-2">Ödenecek Tutar</p>
            <p className="text-3xl font-black mb-6">
              {formatCurrency(cart.totalPrice)}
            </p>

            <button
              onClick={() => navigate("/order", { state: { cart } })}
              className="w-full py-4 bg-blue-600 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              SEPETİ ONAYLA <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;