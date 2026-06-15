import { useNavigate } from "react-router-dom";
import ProductManagement from "./ProductManagement";
import CategoryManagement from "./CategoryManagement";

const AdminPage = () => {
  const navigate = useNavigate();

  return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Sol Sütun */}
          <div className="lg:col-span-8">
            <ProductManagement />
          </div>

          {/* Sağ Sütun */}
          <div className="lg:col-span-4 space-y-6">
            <CategoryManagement />

            {/* Tüm Siparişler Butonu */}
            <button
                onClick={() => navigate("/orders")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
            >
              Tüm Siparişleri Gör
            </button>

          </div>

        </div>
      </div>
  );
};

export default AdminPage;
