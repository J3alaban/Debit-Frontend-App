import { FC, FormEvent, useContext, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { doLogin, updateModal } from "../redux/features/authSlice";
import { AuthContext } from "../redux/AuthContext";
import { FaUnlock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { RiLockPasswordFill, RiUser3Fill } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";
import { Config } from "../helpers/Config";
import { Link, useNavigate } from "react-router-dom";

const LoginModal: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Mesaj ve Durum yönetimi için yeni state'ler
  const [status, setStatus] = useState<{ type: "success" | "error" | null; msg: string }>({
    type: null,
    msg: "",
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate(); // Yönlendirme için
  const open = useAppSelector(state => state.authReducer.modalOpen);
  const { setToken } = useContext(AuthContext)!;

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      setStatus({ type: null, msg: "" }); // Her denemede mesajı temizle

      const API_URL = Config.api.baseUrl;

      const res = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        // Hata Durumu
        setStatus({
          type: "error",
          msg: "Giriş başarısız! E-posta veya şifre hatalı."
        });
        return;
      }

      const data = await res.json();

      // Başarı Durumu
      setStatus({
        type: "success",
        msg: "Giriş başarılı! Anasayfaya yönlendiriliyorsunuz..."
      });

      // Token ve localStorage işlemleri
      setToken(data.token);
      if (data.id) localStorage.setItem("userId", data.id);
      if (data.role) localStorage.setItem("role", data.role);
      if (data.token) localStorage.setItem("token", data.token);

      // 2 saniye bekle ki kullanıcı başarı mesajını okuyabilsin
      setTimeout(() => {
        dispatch(doLogin({ email: data.email || email, role: data.role }));
        dispatch(updateModal(false));
        navigate("/"); // Anasayfaya yönlendir
      }, 2000);

    } catch (err) {
      console.error("Login Error:", err);
      setStatus({
        type: "error",
        msg: "Bir bağlantı hatası oluştu. Lütfen tekrar deneyin."
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
      <div className="bg-[#0000007d] w-full min-h-screen fixed inset-0 z-[100] flex items-center justify-center font-karla backdrop-blur-sm">
        <div className="relative border shadow-2xl rounded-2xl p-8 bg-white max-w-md w-[90%] sm:w-full z-40 dark:bg-slate-800 dark:text-white transition-all">
          <RxCross1
              className="absolute cursor-pointer right-5 top-5 hover:rotate-90 transition-transform text-gray-400"
              onClick={() => dispatch(updateModal(false))}
          />

          <div className="flex mb-6 justify-center items-center gap-2">
            <FaUnlock className="text-blue-500" />
            <h3 className="font-bold text-2xl uppercase tracking-tighter">Personel Girişi</h3>
          </div>

          {/* Dinamik Mesaj Kutusu */}
          {status.msg && (
              <div className={`mb-4 p-3 rounded-lg flex items-center gap-3 text-sm font-medium animate-pulse ${
                  status.type === "success"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-red-100 text-red-700 border border-red-200"
              }`}>
                {status.type === "success" ? <FaCheckCircle /> : <FaExclamationCircle />}
                {status.msg}
              </div>
          )}

          <form onSubmit={submitForm} className="flex flex-col space-y-4">
            <div className="relative">
              <input
                  type="email"
                  placeholder="E-posta Adresi"
                  className="border w-full border-gray-300 py-3 px-10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:border-slate-600"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
              />
              <RiUser3Fill className="absolute top-4 left-3 text-gray-400 text-lg" />
            </div>

            <div className="relative">
              <input
                  type="password"
                  placeholder="Şifre"
                  className="border w-full border-gray-300 py-3 px-10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:border-slate-600"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
              />
              <RiLockPasswordFill className="absolute top-4 left-3 text-gray-400 text-lg" />
            </div>

            <button
                type="submit"
                disabled={loading || status.type === "success"}
                className="bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200 dark:shadow-none"
            >
              {loading ? "Kontrol ediliyor..." : "Giriş Yap"}
            </button>

            <div className="flex flex-col gap-2 mt-2">
              <button
                  type="button"
                  onClick={() => {
                    dispatch(updateModal(false));
                    navigate("/forgotpassword");
                  }}
                  className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                Şifremi Unuttum?
              </button>

              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                Hesabınız yok mu?{" "}
                <Link
                    to="/register"
                    onClick={() => dispatch(updateModal(false))}
                    className="text-blue-600 hover:underline font-bold"
                >
                  Kayıt Ol
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
  );
};

export default LoginModal;