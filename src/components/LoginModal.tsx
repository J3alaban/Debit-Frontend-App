import { FC, FormEvent, useContext, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { doLogin, updateModal } from "../redux/features/authSlice";
import { AuthContext } from "../redux/AuthContext";
import { FaUnlock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { RiLockPasswordFill, RiUser3Fill } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";
import { Config } from "../helpers/Config";
import { useNavigate } from "react-router-dom";

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
      <div className="bg-black/70 w-full min-h-screen fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-xs">
        <div className="relative border-2 border-black shadow-2xl rounded-none p-8 bg-white max-w-md w-[90%] sm:w-full z-40 dark:bg-zinc-900 dark:border-zinc-700 dark:text-white transition-all">
          <RxCross1
              className="absolute cursor-pointer right-5 top-5 hover:rotate-90 transition-transform text-zinc-500 hover:text-red-600"
              onClick={() => dispatch(updateModal(false))}
          />

          <div className="flex mb-6 justify-center items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <FaUnlock className="text-red-600 text-xl" />
            <h3 className="font-bold text-xl uppercase tracking-wider text-black dark:text-white">
              Zimmet Takip Sistemi
            </h3>
          </div>

          {/* Dinamik Mesaj Kutusu */}
          {status.msg && (
              <div className={`mb-4 p-3 rounded-none flex items-center gap-3 text-sm font-semibold border ${
                  status.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800"
                      : "bg-red-50 text-red-800 border-red-300 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900"
              }`}>
                {status.type === "success" ? <FaCheckCircle className="text-emerald-600 dark:text-emerald-400" /> : <FaExclamationCircle className="text-red-600" />}
                {status.msg}
              </div>
          )}

          <form onSubmit={submitForm} className="flex flex-col space-y-4">
            <div className="relative">
              <input
                  type="email"
                  placeholder="Kurumsal E-posta Adresi"
                  className="border-2 w-full border-zinc-300 py-3 px-10 rounded-none bg-zinc-50 text-black placeholder-zinc-400 focus:border-black focus:bg-white outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:focus:border-red-600 transition-colors"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
              />
              <RiUser3Fill className="absolute top-4 left-3 text-zinc-500 text-lg" />
            </div>

            <div className="relative">
              <input
                  type="password"
                  placeholder="Şifre"
                  className="border-2 w-full border-zinc-300 py-3 px-10 rounded-none bg-zinc-50 text-black placeholder-zinc-400 focus:border-black focus:bg-white outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:focus:border-red-600 transition-colors"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
              />
              <RiLockPasswordFill className="absolute top-4 left-3 text-zinc-500 text-lg" />
            </div>

            <button
                type="submit"
                disabled={loading || status.type === "success"}
                className="bg-black text-white hover:bg-red-600 disabled:bg-zinc-400 font-bold py-3 px-4 rounded-none tracking-wide transition-all uppercase text-sm border border-transparent active:bg-zinc-900"
            >
              {loading ? "Doğrulanıyor..." : "Sisteme Giriş Yap"}
            </button>

            <div className="flex flex-col gap-3 mt-2 border-t border-zinc-100 dark:border-zinc-800 pt-4">
              <button
                  type="button"
                  onClick={() => {
                    dispatch(updateModal(false));
                    navigate("/forgotpassword");
                  }}
                  className="text-xs text-zinc-500 hover:text-red-600 transition-colors font-medium text-left sm:text-center"
              >
                Şifremi Unuttum?
              </button>
{/*
<p className="text-xs text-center text-zinc-600 dark:text-zinc-400">
  Sistemde kaydınız yok mu?{" "}
  <Link
      to="/register"
      onClick={() => dispatch(updateModal(false))}
      className="text-black dark:text-white hover:text-red-600 dark:hover:text-red-500 underline font-bold"
  >
    Yönetici/Personel Kaydı
  </Link>
</p>
*/}
            </div>
          </form>
        </div>
      </div>
  );
};

export default LoginModal;