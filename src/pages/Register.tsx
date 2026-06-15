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
    tcNo: "", // eklendi
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
            text: "Kayıt başarılı, email adresinizi doğrulayın",
          });
        })
        .catch(() => {
          setMessage({
            type: "error",
            text: "İşlem başarısız, bilgilerinizi kontrol edin",
          });
        })
        .finally(() => {
          setLoading(false);
          setSubmit(false);
        });
  }, [submit, form]);

  return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-900 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-800">Hesap Oluştur</h1>
                <p className="text-gray-500 mt-2">Hemen aramıza katılın</p>
              </div>

              <form onSubmit={submitForm} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                    <input
                        name="firstName"
                        type="text"
                        required
                        placeholder="Ahmet"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
                    <input
                        name="lastName"
                        type="text"
                        required
                        placeholder="Yılmaz"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                  <input
                      type="email"
                      name="email"
                      required
                      placeholder="ornek@mail.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
                  <input
                      type="password"
                      name="password"
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon <span className="text-gray-400 font-normal"></span>
                  </label>
                  <input
                      type="tel"
                      name="phone"
                      placeholder="05xx xxx xx xx"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    TC No <span className="text-gray-400 font-normal"></span>
                  </label>
                  <input
                      type="text"
                      name="tcNo"
                      placeholder="12345678901"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      onChange={handleChange}
                  />
                </div>

                <button
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  {loading ? (
                      <>
                        <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                        İşleniyor...
                      </>
                  ) : (
                      "Kayıt Ol"
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Zaten hesabınız var mı?{" "}
                  <button
                      onClick={() => navigate("/login")}
                      className="text-blue-600 font-bold hover:underline"
                  >
                    Giriş Yap
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL */}
        {message && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm text-center shadow-2xl">
                <p
                    className={`text-lg font-semibold ${
                        message.type === "success" ? "text-green-600" : "text-red-600"
                    }`}
                >
                  {message.text}
                </p>

                <button
                    onClick={() => {
                      setMessage(null);
                      if (message.type === "success") navigate("/login");
                    }}
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
                >
                  Tamam
                </button>
              </div>
            </div>
        )}
      </>
  );
};

export default Register;
