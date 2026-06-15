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
      setMessage("Şifre sıfırlama linki email adresinize gönderildi.");
    } catch (err) {
      setStatus("error");
      setMessage("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* İçerik */}
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl border border-gray-200">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            🔑 Şifremi Unuttum
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Şifrenizi sıfırlamak için email adresinizi girin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {status === "loading" ? "Gönderiliyor..." : "Gönder"}
            </button>
          </form>

          {status === "success" && (
            <p className="mt-4 text-green-600 text-center font-medium">{message}</p>
          )}
          {status === "error" && (
            <p className="mt-4 text-red-600 text-center font-medium">{message}</p>
          )}
        </div>
      </main>

      {/* Footer */}
 
    </div>
  );
};

export default ForgotPassword;



/*
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
      const res = await fetch(`${Config.api.baseUrl}/api/v1/auth/forgot-password`, {  ///reset-password
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("success");
      setMessage("Şifre sıfırlama linki email adresinize gönderildi.");
    } catch (err) {
      setStatus("error");
      setMessage("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Şifremi Unuttum</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email adresinizi girin"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {status === "loading" ? "Gönderiliyor..." : "Gönder"}
        </button>
      </form>

      {status === "success" && <p className="mt-4 text-green-600">{message}</p>}
      {status === "error" && <p className="mt-4 text-red-600">{message}</p>}
    </div>
  );
};

export default ForgotPassword; 

*/ 