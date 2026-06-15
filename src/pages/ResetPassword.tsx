import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Config } from "../helpers/Config";

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Şifreler eşleşmiyor");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch(`${Config.api.baseUrl}/api/v1/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("success");
      setMessage("Şifreniz başarıyla sıfırlandı.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setStatus("error");
      setMessage("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl border border-gray-200">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            🔒 Şifre Sıfırlama
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              type="password"
              placeholder="Yeni şifrenizi girin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <input
              type="password"
              placeholder="Şifreyi tekrar girin"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {status === "loading" ? "Gönderiliyor..." : "Şifreyi Sıfırla"}
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

     
    </div>
  );
};

export default ResetPassword;
















































 /* 

import { useState } from "react";
import { useSearchParams , useNavigate  } from "react-router-dom";
import { Config } from "../helpers/Config";


const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || ""; // Linkten token alınıyor
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const navigate = useNavigate() ; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Şifreler eşleşmiyor");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch(`${Config.api.baseUrl}/api/v1/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password })
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("success");
      setMessage("Şifreniz başarıyla sıfırlandı.");

              setTimeout(() => {
        navigate("/login"); // ✅ başarılı sonrası login sayfasına yönlendir
      }, 1500); // 1.5 saniye bekleyip mesajı gösterir
    

    } 


      catch (err) {
      setStatus("error");
      setMessage("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Şifre Sıfırlama</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          placeholder="Yeni şifrenizi girin"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Şifreyi tekrar girin"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {status === "loading" ? "Gönderiliyor..." : "Şifreyi Sıfırla"}
        </button>
      </form>

      {status === "success" && <p className="mt-4 text-green-600">{message}</p>}
      {status === "error" && <p className="mt-4 text-red-600">{message}</p>}
    </div>
  );
};

export default ResetPassword; 

*/