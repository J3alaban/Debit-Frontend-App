import { Provider } from "react-redux";
import "./App.css";
import { store } from "./redux/store";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";

import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";

import LoginModal from "./components/LoginModal";
import ProtectedRoute from "./components/ProtectedRoute";

import AllProducts from "./pages/AllProducts";
import ScrollToTopButton from "./components/ScrollToTopButton";

import AllCategories from "./pages/AllCategories";

import SearchPage from "./pages/SearchPage";
import { AuthProvider } from "./redux/AuthContext";
import Login  from "./pages/Login";
import Register from "./pages/Register";

import AdminPage from "./pages/AdminPage";
import  ForgotPassword  from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";

import AllUsers  from "./pages/AllUsers.tsx";
import UserProducts from "./pages/UserProducts.tsx";
import SubCategories from "./pages/SubCategories.tsx";
import SubCategoryProducts from "./pages/SubCategoryProducts" ;


function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">

        <Navbar />
        <main className="flex-grow">
        <Routes>



          <Route path="/allusers" element={<AllUsers />} /> // Api den çekilmedi
          <Route path="/" element={<AllUsers />} /> // Api den çekilmedi
          <Route path="/userproducts" element={<UserProducts/>} />
          <Route path="/login" element={<Login />} />  // Api den çekildi
          <Route path="/search" element={<SearchPage />} /> Api den çekildi
          <Route path="/products" element={<AllProducts />} /> // Api den çekildi
          <Route path="/categories" element={<AllCategories />} /> // Api den çekildi


          <Route path="/register" element={<Register/>} /> // Api den çekildi

           <Route path="/subcategories" element={<SubCategories />} />
           <Route path="/subcategory-products" element={<SubCategoryProducts />} />


          <Route path="/admin" element={<AdminPage />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />





           <Route element={<ProtectedRoute />}>


          </Route>
        </Routes>
        </main>
        <Toaster position="bottom-center" reverseOrder={false} />
        <Footer />

        <LoginModal />
        <ScrollToTopButton />

        </div>
      </AuthProvider>
    </Provider>
  );
}

export default App;
