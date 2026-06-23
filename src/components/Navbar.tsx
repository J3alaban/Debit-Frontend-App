import { FC, useState, useContext, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { updateModal, doLogout } from "../redux/features/authSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { updateDarkMode } from "../redux/features/homeSlice";
import {
    MdOutlineDarkMode,
    MdOutlineLightMode,
    MdOutlineAccountCircle,
    MdOutlineLogout,
    MdMenu,
    MdClose
} from "react-icons/md";
import { AuthContext } from "../redux/AuthContext";
import { Config } from "../helpers/Config";

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

const Navbar: FC = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    // ==========================================
    // 👤 PRODUCTMANAGEMENT ARAMA STATE'LERİ
    // ==========================================
    const [users, setUsers] = useState<User[]>([]);
    const [globalUserSearchTerm, setGlobalUserSearchTerm] = useState("");
    const [matchedGlobalUsers, setMatchedGlobalUsers] = useState<User[]>([]);

    const { username, role } = useAppSelector((state) => state.authReducer);
    const isDarkMode = useAppSelector((state) => state.homeReducer.isDarkMode);
    const { setToken } = useContext(AuthContext)!;

    // =========================
    // 🔥 BACKEND DATA CACHE & INITIALIZATION
    // =========================
    useEffect(() => {
        // PRODUCTS - Düzeltilen Satır 🚀
        fetch(`${Config.api.baseUrl}/api/v1/products`)
            .then(res => res.json())
            .then(data => {
                const rawProducts = data.content || data;
                localStorage.setItem("products", JSON.stringify(rawProducts));
            })
            .catch(err => console.error("Ürün önbellekleme hatası:", err));

        // USERS (PERSONEL)
        fetch (`${Config.api.baseUrl}/api/v1/auth`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => res.json())
            .then((data: User[]) => {
                setUsers(data);
                localStorage.setItem("users", JSON.stringify(data));
            })
            .catch((err) => console.error("Personel önbellekleme hatası:", err));
    }, []);

    // ==========================================
    // 🔍 PRODUCTMANAGEMENT ANLIK FILTRELEME MANTIĞI
    // ==========================================
    useEffect(() => {
        if (!globalUserSearchTerm.trim()) {
            setMatchedGlobalUsers([]);
            return;
        }
        const q = globalUserSearchTerm.toLowerCase();
        const matched = users.filter(u =>
            `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q)
        );
        setMatchedGlobalUsers(matched);
    }, [globalUserSearchTerm, users]);

    // ==========================================
    // ➔ ZİMMETLERİ GÖRÜNTÜLEME TETİKLEYİCİSİ
    // ==========================================
    const handleViewUserProducts = (userId: number) => {
        localStorage.setItem("selectedUserId", String(userId));
        setGlobalUserSearchTerm("");
        setMatchedGlobalUsers([]);
        setIsMenuOpen(false);

        // URL parametresi (?id=...) eklenerek ardışık tıklamalarda tetiklenme sorunu çözüldü
        navigate(`/userproducts?id=${userId}`);
    };

    // =========================
    // LOGOUT
    // =========================
    const handleLogout = () => {
        localStorage.clear();
        setToken(null);
        dispatch(doLogout());
        setIsMenuOpen(false);
        setShowLogoutConfirm(false);
    };

    // =========================
    // THEME
    // =========================
    const toggleTheme = () => {
        dispatch(updateDarkMode(!isDarkMode));
        document.body.classList.toggle("dark");
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 w-full border-b-2 border-black bg-white dark:border-zinc-800 dark:bg-zinc-900 font-sans antialiased transition-colors duration-200">
            <div className="mx-auto px-4 lg:px-8">
                <div className="flex h-16 items-center justify-between gap-4">

                    {/* LEFT SECTION */}
                    <div className="flex items-center gap-6 flex-grow lg:flex-grow-0">
                        <Link to="/categories" className="flex items-center gap-2 text-xl font-bold tracking-wider text-black dark:text-white uppercase shrink-0">
                           <img
                               src="/ems-logo.png"
                               alt="EMS Logo"
                               className="h-8 w-auto"
                           />
                            <span className="text-black dark:text-zinc-300 font-bold text-sm tracking-widest border-l border-zinc-300 dark:border-zinc-700 pl-2 hidden sm:inline-block">ZİMMET</span>
                        </Link>

                        {/* DESKTOP TABS */}
                        <div className="hidden lg:flex items-center gap-1 h-16 shrink-0">
                            <Link
                                to="/categories"
                                className={`px-4 h-full flex items-center text-xs uppercase tracking-wider font-bold transition-all border-b-2 ${
                                    isActive("/categories")
                                        ? "border-red-600 text-red-600 dark:text-red-500 bg-zinc-50 dark:bg-zinc-800/30"
                                        : "border-transparent text-zinc-600 hover:text-black hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800/20"
                                }`}
                            >
                                Envanter
                            </Link>
                            <Link
                                to="/allusers"
                                className={`px-4 h-full flex items-center text-xs uppercase tracking-wider font-bold transition-all border-b-2 ${
                                    isActive("/allusers")
                                        ? "border-red-600 text-red-600 dark:text-red-500 bg-zinc-50 dark:bg-zinc-800/30"
                                        : "border-transparent text-zinc-600 hover:text-black hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800/20"
                                }`}
                            >
                                Personel Listesi
                            </Link>
                            {role === "ADMIN" && (
                                <Link
                                    to="/admin"
                                    className={`px-4 h-full flex items-center text-xs uppercase tracking-wider font-bold transition-all border-b-2 ${
                                        isActive("/admin")
                                            ? "border-black text-black dark:border-white dark:text-white bg-zinc-100 dark:bg-zinc-800"
                                            : "border-transparent text-red-600 hover:bg-red-50/50 dark:text-red-500 dark:hover:bg-red-950/10"
                                    }`}
                                >
                                    Admin
                                </Link>
                            )}
                        </div>

                        {/* MASAÜSTÜ: PERSONEL ARAMA KUTUSU */}
                        <div className="hidden md:block relative w-64 xl:w-80">
                            <input
                                type="text"
                                value={globalUserSearchTerm}
                                onChange={(e) => setGlobalUserSearchTerm(e.target.value)}
                                placeholder="PERSONEL ARA..."
                                className="w-full p-2 pr-12 border-2 border-zinc-200 text-[10px] font-mono font-bold uppercase rounded-none text-black bg-zinc-50 focus:outline-none focus:border-red-600 focus:bg-white dark:bg-zinc-800/40 dark:border-zinc-800 dark:text-white dark:focus:border-red-500 dark:focus:bg-zinc-900 transition-colors"
                            />
                            {globalUserSearchTerm && (
                                <button
                                    onClick={() => { setGlobalUserSearchTerm(""); setMatchedGlobalUsers([]); }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-zinc-400 hover:text-red-600 font-mono transition-colors"
                                >
                                    X
                                </button>
                            )}

                            {/* Açılır Eşleşen Personel Listesi */}
                            {matchedGlobalUsers.length > 0 && (
                                <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 shadow-2xl max-h-48 overflow-y-auto z-[60]">
                                    {matchedGlobalUsers.map((u) => (
                                        <div
                                            key={u.id}
                                            onClick={() => handleViewUserProducts(u.id)}
                                            className="p-2 border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer flex flex-col transition-colors text-left"
                                        >
                                            <span className="font-bold text-black dark:text-white text-[11px] uppercase truncate">{u.firstName} {u.lastName}</span>
                                            <span className="text-[9px] text-zinc-400 font-mono truncate">{u.email}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT SECTION */}
                    <div className="flex items-center gap-2 md:gap-4 text-zinc-800 dark:text-zinc-200 shrink-0">
                        {username ? (
                            <div className="flex items-center gap-1 md:gap-2">
                                <Link
                                    to="/allusers"
                                    className="flex items-center gap-1.5 px-3 py-2 border border-zinc-200 text-zinc-700 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300 rounded-none hover:border-black dark:hover:border-zinc-500 transition-colors"
                                >
                                    <MdOutlineAccountCircle size={18} className="text-red-600 dark:text-red-500" />
                                    <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline-block max-w-[90px] truncate">
                                        {username.split(" ")[0]}
                                    </span>
                                </Link>

                                <button
                                    onClick={() => setShowLogoutConfirm(true)}
                                    className="p-2 border border-zinc-200 text-zinc-400 hover:text-red-600 hover:border-red-600 dark:border-zinc-700 dark:text-zinc-500 dark:hover:text-red-500 dark:hover:border-red-500 rounded-none transition-colors"
                                    title="Güvenli Çıkış"
                                >
                                    <MdOutlineLogout size={18} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => dispatch(updateModal(true))}
                                className="px-4 py-2 text-xs uppercase tracking-wider font-bold bg-black text-white hover:bg-red-600 rounded-none transition-colors border border-transparent"
                            >
                                Giriş Yap
                            </button>
                        )}

                        {/* THEME BUTTON */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 border border-zinc-200 text-zinc-500 hover:text-black hover:border-black dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-500 rounded-none transition-colors"
                        >
                            {isDarkMode ? <MdOutlineLightMode size={18} /> : <MdOutlineDarkMode size={18} />}
                        </button>

                        {/* MOBILE HAMBURGER TOGGLE */}
                        <button
                            className="lg:hidden p-2 border border-zinc-200 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300 rounded-none transition-colors"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <MdClose size={20} /> : <MdMenu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* MOBILE MENU & SEARCH */}
            {isMenuOpen && (
                <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 bg-white dark:bg-zinc-900 z-40 border-t-2 border-black dark:border-zinc-800 p-6 flex flex-col justify-between overflow-y-auto">
                    <div className="flex flex-col gap-4">

                        {/* MOBİL: PERSONEL ARAMA KUTUSU */}
                        <div className="relative w-full mb-2">
                            <input
                                type="text"
                                value={globalUserSearchTerm}
                                onChange={(e) => setGlobalUserSearchTerm(e.target.value)}
                                placeholder="PERSONEL ARA..."
                                className="w-full p-3 pr-12 border-2 border-zinc-200 text-xs font-mono font-bold uppercase rounded-none text-black bg-zinc-50 focus:outline-none focus:border-red-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                            />
                            {globalUserSearchTerm && (
                                <button
                                    onClick={() => { setGlobalUserSearchTerm(""); setMatchedGlobalUsers([]); }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400 hover:text-red-600 font-mono"
                                >
                                    X
                                </button>
                            )}

                            {/* Mobil Açılır Eşleşen Personel Listesi */}
                            {matchedGlobalUsers.length > 0 && (
                                <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 shadow-xl max-h-40 overflow-y-auto z-[60]">
                                    {matchedGlobalUsers.map((u) => (
                                        <div
                                            key={u.id}
                                            onClick={() => handleViewUserProducts(u.id)}
                                            className="p-3 border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer flex flex-col transition-colors text-left"
                                        >
                                            <span className="font-bold text-black dark:text-white text-xs uppercase truncate">{u.firstName} {u.lastName}</span>
                                            <span className="text-[10px] text-zinc-400 font-mono truncate">{u.email}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Mobile Navigation Links */}
                        <div className="flex flex-col gap-2">
                            <Link
                                to="/categories"
                                onClick={() => setIsMenuOpen(false)}
                                className={`p-4 rounded-none border text-sm uppercase tracking-wider font-bold flex justify-between items-center ${
                                    isActive("/categories")
                                        ? "bg-black text-white border-black dark:bg-zinc-800 dark:border-zinc-700"
                                        : "text-zinc-800 border-zinc-200 dark:text-zinc-200 dark:border-zinc-800"
                                }`}
                            >
                                <span>Envanter</span>
                                <span className="text-xs opacity-50">→</span>
                            </Link>

                            <Link
                                to="/allusers"
                                onClick={() => setIsMenuOpen(false)}
                                className={`p-4 rounded-none border text-sm uppercase tracking-wider font-bold flex justify-between items-center ${
                                    isActive("/allusers")
                                        ? "bg-black text-white border-black dark:bg-zinc-800 dark:border-zinc-700"
                                        : "text-zinc-800 border-zinc-200 dark:text-zinc-200 dark:border-zinc-800"
                                }`}
                            >
                                <span>Personel Listesi</span>
                                <span className="text-xs opacity-50">→</span>
                            </Link>

                            {/* MOBİL ADMIN LİNKİ (Düzeltilen Kısım) 🚀 */}
                            {role === "ADMIN" && (
                                <Link
                                    to="/admin"
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`p-4 rounded-none border text-sm uppercase tracking-wider font-bold flex justify-between items-center ${
                                        isActive("/admin")
                                            ? "bg-black text-white border-black dark:bg-zinc-800 dark:border-zinc-700"
                                            : "text-red-600 bg-red-50/50 border-zinc-200 dark:text-red-500 dark:bg-red-950/10 dark:border-zinc-800"
                                    }`}
                                >
                                    <span>Admin</span>
                                    <span className="text-xs opacity-50">→</span>
                                </Link>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-none text-xs uppercase tracking-wider font-bold text-center border border-zinc-300 dark:border-zinc-700 mt-6"
                    >
                        Kapat
                    </button>
                </div>
            )}

            {/* LOGOUT CONFIRMATION MODAL */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs px-4">
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-none shadow-2xl max-w-sm w-full border-2 border-black dark:border-zinc-700">
                        <h3 className="text-lg font-bold uppercase tracking-wider text-black dark:text-white mb-2 text-center">
                            Oturumu Kapat
                        </h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6 text-center leading-relaxed">
                            Zimmet yönetim panelinden çıkış yapmak istediğinize emin misiniz?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="flex-1 px-4 py-2.5 bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 rounded-none font-bold text-xs uppercase tracking-wider border border-zinc-300 dark:border-zinc-600 transition-colors"
                            >
                                Vazgeç
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 px-4 py-2.5 bg-black text-white hover:bg-red-600 rounded-none font-bold text-xs uppercase tracking-wider transition-colors"
                            >
                                Çıkış Yap
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;