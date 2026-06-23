import { FormEvent, useEffect, useState } from "react";
import { Config } from "../helpers/Config";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    tcNo: "",
  });

  const [submit, setSubmit] = useState(false);

  const [message, setMessage] = useState<null | {
    type: "success" | "error";
    text: string;
  }>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitForm = (e: FormEvent) => {
    e.preventDefault();
    setSubmit(true);
  };

  useEffect(() => {
    if (!submit) return;

    setLoading(true);

    fetch(`${Config.api.baseUrl}/api/v1/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
        .then((res) => {
          if (!res.ok) throw new Error("fail");
          return res.json();
        })
        .then(() => {
          setMessage({
            type: "success",
            text: "Kayıt başarılı, kurumsal e-posta adresinizi doğrulayın.",
          });
        })
        .catch(() => {
          setMessage({
            type: "error",
            text: "İşlem başarısız, girilen bilgileri kontrol edin.",
          });
        })
        .finally(() => {
          setLoading(false);
          setSubmit(false);
        });
  }, [submit, form]);

  return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 font-sans antialiased transition-colors">
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 rounded-none shadow-2xl overflow-hidden">
          <div className="p-8">

            {/* Kurumsal Başlık Alanı */}
            <div className="flex flex-col items-center text-center mb-8">
              <span className="w-12 h-1 bg-red-600 mb-3"></span>
              <h1 className="text-xl font-bold uppercase tracking-widest text-black dark:text-white">
                Personel Kayıt Sistemi
              </h1>
              <p className="text-zinc-500 font-mono text-xs uppercase tracking-tight mt-1">
                EMS Mobil Sistemler / Yetki Talebi
              </p>
            </div>

            <form onSubmit={submitForm} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Ad</label>
                  <input
                      name="firstName"
                      type="text"
                      required
                      placeholder="Ahmet"
                      className="w-full px-3 py-2 border-2 border-zinc-200 rounded-none font-medium text-sm text-black focus:outline-none focus:border-red-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white transition-colors"
                      onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Soyad</label>
                  <input
                      name="lastName"
                      type="text"
                      required
                      placeholder="Yılmaz"
                      className="w-full px-3 py-2 border-2 border-zinc-200 rounded-none font-medium text-sm text-black focus:outline-none focus:border-red-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white transition-colors"
                      onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Kurumsal E-posta</label>
                <input
                    type="email"
                    name="email"
                    required
                    placeholder="personel@ems.com"
                    className="w-full px-3 py-2 border-2 border-zinc-200 rounded-none font-medium text-sm text-black focus:outline-none focus:border-red-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white transition-colors"
                    onChange={handleChange}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Şifre Belirleme</label>
                <input
                    type="password"
                    name="password"
                    required
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border-2 border-zinc-200 rounded-none font-medium text-sm text-black focus:outline-none focus:border-red-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white transition-colors"
                    onChange={handleChange}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">İletişim Numarası</label>
                <input
                    type="tel"
                    name="phone"
                    placeholder="05xx xxx xx xx"
                    className="w-full px-3 py-2 border-2 border-zinc-200 rounded-none font-mono text-sm text-black focus:outline-none focus:border-red-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white transition-colors"
                    onChange={handleChange}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">T.C. Kimlik No</label>
                <input
                    type="text"
                    name="tcNo"
                    placeholder="11 Haneli Kimlik No"
                    className="w-full px-3 py-2 border-2 border-zinc-200 rounded-none font-mono text-sm text-black focus:outline-none focus:border-red-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white transition-colors"
                    onChange={handleChange}
                />
              </div>

              <button
                  disabled={loading}
                  className="w-full bg-black text-white hover:bg-red-600 dark:bg-zinc-800 dark:hover:bg-red-600 py-3 rounded-none text-xs font-bold uppercase tracking-wider border border-transparent transition-colors duration-150 shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {loading ? (
                    <>
                      <svg
                          className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                      >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      SİSTEME KAYDEDİLİYOR...
                    </>
                ) : (
                    "KAYIT TALEBİNİ GÖNDER"
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center">
              <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-tight">
                Zaten bir hesabınız var mı?{" "}
                <button
                    onClick={() => navigate("/login")}
                    className="text-black dark:text-white font-bold hover:text-red-600 dark:hover:text-red-500 ml-1 transition-colors"
                >
                  GİRİŞ YAP
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* BİLGİLENDİRME MODALI (POPUP) */}
        {message && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-xs">
              <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 rounded-none p-6 w-[90%] max-w-sm text-center shadow-2xl">
                <div className={`w-8 h-1 mx-auto mb-3 ${message.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}></div>
                <p
                    className={`text-sm font-bold uppercase tracking-wide ${
                        message.type === "success" ? "text-emerald-600" : "text-red-600"
                    }`}
                >
                  {message.text}
                </p>

                <button
                    onClick={() => {
                      setMessage(null);
                      if (message.type === "success") navigate("/login");
                    }}
                    className="mt-6 w-full bg-black hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-none transition-colors duration-150"
                >
                  Tamam
                </button>
              </div>
            </div>
        )}
      </div>
  );
};

export default Register;