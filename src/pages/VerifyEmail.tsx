import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Config } from "../helpers/Config";
import { FaCheckCircle, FaSpinner, FaTimesCircle } from "react-icons/fa";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    const hasRequested = useRef(false);

    useEffect(() => {
        if (!token || hasRequested.current) return;

        hasRequested.current = true;

        fetch(`${Config.api.baseUrl}/api/v1/auth/verify?token=${token}`)
            .then((res) => {
                if (res.ok) {
                    setStatus("success");
                } else {
                    setStatus("error");
                }
            })
            .catch((err) => {
                console.error("Doğrulama hatası:", err);
                setStatus("error");
            });
    }, [token]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-6 font-sans antialiased bg-zinc-50 dark:bg-zinc-950 transition-colors">
            <div className="max-w-md w-full text-center bg-white dark:bg-zinc-900 p-10 border-2 border-black dark:border-zinc-800 rounded-none shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>

                {status === "loading" && (
                    <div className="flex flex-col items-center gap-4">
                        <FaSpinner className="animate-spin text-3xl text-black dark:text-white" />
                        <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-zinc-500">
                            Güvenlik Protokolü İşleniyor...
                        </h2>
                    </div>
                )}

                {status === "success" && (
                    <div>
                        <FaCheckCircle className="text-5xl text-emerald-600 mx-auto mb-5" />
                        <h1 className="text-xl font-bold text-black dark:text-white uppercase tracking-widest mb-3">
                            Hesap Doğrulandı
                        </h1>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-tight leading-relaxed mb-8">
                            Kurumsal e-posta adresiniz başarıyla onaylanmıştır. Sistem içi yetkilendirmeniz tamamlanmış olup aktif envanter, zimmet ve demirbaş havuzuna erişim hakkınız tanımlanmıştır.
                        </p>
                        <Link
                            to="/login"
                            className="inline-block bg-black hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider px-8 py-3 rounded-none transition-colors duration-150 shadow-md"
                        >
                            Sisteme Giriş Yap
                        </Link>
                    </div>
                )}

                {status === "error" && (
                    <div>
                        <FaTimesCircle className="text-5xl text-red-600 mx-auto mb-5" />
                        <h1 className="text-xl font-bold text-black dark:text-white uppercase tracking-widest mb-3">
                            Aktivasyon Başarısız
                        </h1>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-tight leading-relaxed mb-8">
                            Doğrulama belirteci (token) geçersiz veya süresi dolmuş. Lütfen kayıt işlemini tekrarlayın ya da sistem yöneticisi ile iletişime geçin.
                        </p>
                        <Link
                            to="/"
                            className="text-xs font-bold uppercase tracking-wider text-black dark:text-white hover:text-red-600 dark:hover:text-red-500 border-b border-black dark:border-white pb-0.5 transition-colors"
                        >
                            Ana Panele Dön
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
};

export default VerifyEmail;