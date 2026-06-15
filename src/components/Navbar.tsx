import { FC, useState, useContext } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { updateModal, doLogout } from "../redux/features/authSlice";
import { Link } from "react-router-dom";
import { updateDarkMode } from "../redux/features/homeSlice";
import {
    MdOutlineDarkMode,
    MdOutlineLightMode,
    MdFavoriteBorder,
    MdOutlineAccountCircle,
    MdOutlineLogout
} from "react-icons/md";
import SearchBar from "./SearchBar";
import { AuthContext } from "../redux/AuthContext";

const Navbar: FC = () => {
    const dispatch = useAppDispatch();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const { username, role } = useAppSelector(
        (state) => state.authReducer
    );

    const isDarkMode = useAppSelector(
        (state) => state.homeReducer.isDarkMode
    );

    const { setToken } = useContext(AuthContext)!;

    const handleLogout = () => {
        localStorage.clear();
        setToken(null);
        dispatch(doLogout());
        setIsMenuOpen(false);
        setShowLogoutConfirm(false);
    };

    const toggleTheme = () => {
        dispatch(updateDarkMode(!isDarkMode));
        document.body.classList.toggle("dark");
    };

    return (
        <div className="py-4 bg-white dark:bg-slate-800 top-0 sticky z-50 shadow-lg font-karla">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center gap-2">
                    <Link
                        to="/categories"
                        className="text-xl md:text-2xl font-bold dark:text-white shrink-0"
                    >
                        EMS Mobil Hizmetler
                    </Link>

                    {/* Desktop Arama */}
                    <div className="hidden lg:block flex-1 max-w-md mx-4">
                        <SearchBar
                            onSearch={() => setIsMenuOpen(false)}
                        />
                    </div>

                    <div className="flex items-center gap-3 md:gap-5 dark:text-white">
                        {/* Desktop Menü */}
                        <div className="hidden lg:flex items-center gap-4 border-r pr-4 border-gray-200 dark:border-slate-600">
                            <Link
                                to="/categories"
                                className="hover:text-blue-500 font-semibold"
                            >
                                Envanter
                            </Link>

                            <Link
                                to="/allusers"
                                className="hover:text-blue-500 font-semibold"
                            >
                                Personel Listesi
                            </Link>


                            {role === "ADMIN" && (
                                <Link
                                    to="/admin"
                                    className="text-red-500 font-semibold"
                                >
                                    Admin Paneli
                                </Link>
                            )}
                        </div>

                        {username !== "" ? (
                            <div className="flex items-center gap-3 md:gap-4 border-r pr-3 md:pr-5 border-gray-200 dark:border-slate-600">
                                <Link
                                    to="/wishlist"
                                    className="hover:text-blue-500 flex flex-col items-center"
                                >
                                    <MdFavoriteBorder
                                        size={22}
                                        className="text-red-500"
                                    />
                                    <span className="text-[10px] hidden md:block">
                                        Favoriler
                                    </span>
                                </Link>

                                <Link
                                    to="/account"
                                    className="hover:text-blue-500 flex flex-col items-center"
                                >
                                    <MdOutlineAccountCircle
                                        size={22}
                                        className="text-blue-500"
                                    />
                                    <span className="text-[10px] hidden md:block">
                                        {username.split(" ")[0]}
                                    </span>
                                </Link>

                                <button
                                    onClick={() =>
                                        setShowLogoutConfirm(true)
                                    }
                                    className="hover:text-red-500 flex flex-col items-center"
                                >
                                    <MdOutlineLogout
                                        size={22}
                                        className="text-gray-500 dark:text-gray-400"
                                    />
                                    <span className="text-[10px] hidden md:block">
                                        Çıkış
                                    </span>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() =>
                                    dispatch(updateModal(true))
                                }
                                className="text-sm md:text-base font-bold hover:text-blue-500 border-r pr-4 border-gray-200"
                            >
                                Giriş Yap
                            </button>
                        )}

                        <div
                            onClick={toggleTheme}
                            className="hidden sm:block cursor-pointer"
                        >
                            {isDarkMode ? (
                                <MdOutlineLightMode size={24} />
                            ) : (
                                <MdOutlineDarkMode size={24} />
                            )}
                        </div>

                        <button
                            className="sm:hidden text-2xl"
                            onClick={() =>
                                setIsMenuOpen(!isMenuOpen)
                            }
                        >
                            {isMenuOpen ? "✕" : "☰"}
                        </button>
                    </div>
                </div>

                {/* Mobil Arama */}
                <div className="lg:hidden mt-4">
                    <SearchBar
                        onSearch={() => setIsMenuOpen(false)}
                    />
                </div>

                {/* Mobil Menü */}
                {isMenuOpen && (
                    <div className="sm:hidden fixed inset-0 top-0 bg-white dark:bg-slate-900 z-40 pt-24">
                        <div className="flex flex-col items-center gap-8 text-2xl font-bold dark:text-white">
                            <Link
                                to="/categories"
                                onClick={() =>
                                    setIsMenuOpen(false)
                                }
                            >
                                Kategoriler
                            </Link>

                            {role === "ADMIN" && (
                                <Link
                                    to="/admin"
                                    onClick={() =>
                                        setIsMenuOpen(false)
                                    }
                                    className="text-red-500"
                                >
                                    Admin Paneli
                                </Link>
                            )}

                            <div
                                onClick={() => {
                                    toggleTheme();
                                    setIsMenuOpen(false);
                                }}
                                className="flex items-center gap-2 text-lg font-normal border-t pt-4 w-full justify-center"
                            >
                                {isDarkMode ? (
                                    <MdOutlineLightMode />
                                ) : (
                                    <MdOutlineDarkMode />
                                )}

                                {isDarkMode
                                    ? "Aydınlık Mod"
                                    : "Karanlık Mod"}
                            </div>

                            <button
                                onClick={() =>
                                    setIsMenuOpen(false)
                                }
                                className="text-gray-400 text-sm font-normal"
                            >
                                Kapat
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Çıkış Onay Modalı */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm px-4">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full border border-gray-100 dark:border-slate-700">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                            Çıkış Yapılıyor
                        </h3>

                        <p className="text-gray-500 dark:text-gray-400 mb-6 text-center">
                            Çıkış yapmak istediğinize emin misiniz?
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() =>
                                    setShowLogoutConfirm(false)
                                }
                                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-white rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-slate-600"
                            >
                                Vazgeç
                            </button>

                            <button
                                onClick={handleLogout}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700"
                            >
                                Evet, Çıkış Yap
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;