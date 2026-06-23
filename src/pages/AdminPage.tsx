import { useNavigate } from "react-router-dom";
import ProductManagement from "./ProductManagement";
import CategoryManagement from "./CategoryManagement";

const AdminPage = () => {


  return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 md:p-10 transition-colors">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">


          <div className="lg:col-span-8">
            <ProductManagement />
          </div>

          {/* Sağ Sütun - Kategori/Departman Yönetimi ve Hızlı Aksiyonlar */}
          <div className="lg:col-span-4 space-y-6">
            <CategoryManagement />



          </div>

        </div>
      </div>
  );
};

export default AdminPage;