import { useState } from "react";
import { Config } from "../helpers/Config";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch(`${Config.api.baseUrl}/api/v1/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("success");
      setMessage("Şifre sıfırlama linki e-posta adresinize gönderildi.");
    } catch (err) {
      setStatus("error");
      setMessage("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      {/* İçerik Alanı */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 rounded-none shadow-2xl">

          {/* Kurumsal Başlık Yapısı */}
          <div className="flex flex-col items-center mb-6">
            <span className="w-8 h-1 bg-red-600 mb-2"></span>
            <h2 className="text-xl font-bold uppercase tracking-widest text-black dark:text-white text-center">
              Kimlik Doğrulama / Şifre Sıfırlama
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                Kurumsal E-Posta Adresi
              </label>
              <input
                type="email"
                placeholder="Örn: personel@firma.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border-2 border-zinc-200 text-sm font-medium rounded-none text-black bg-white focus:outline-none focus:border-red-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:focus:border-red-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-black text-white hover:bg-red-600 dark:bg-zinc-800 dark:hover:bg-red-600 py-3 rounded-none text-xs font-bold uppercase tracking-wider border border-transparent transition-colors duration-150 shadow-md disabled:opacity-50"
            >
              {status === "loading" ? "Kayıt Sorgulanıyor..." : "Doğrulama Bağlantısı Gönder"}
            </button>
          </form>

          {/* Durum Bildirimleri */}
          {status === "success" && (
            <div className="mt-4 p-3 bg-zinc-50 border-l-4 border-emerald-600 dark:bg-zinc-800">
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                {message}
              </p>
            </div>
          )}
          {status === "error" && (
            <div className="mt-4 p-3 bg-zinc-50 border-l-4 border-red-600 dark:bg-zinc-800">
              <p className="text-xs font-bold uppercase tracking-wide text-red-600 dark:text-red-400">
                {message}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;