import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Config } from "../helpers/Config";
import { FaCheckCircle, FaSpinner, FaTimesCircle } from "react-icons/fa";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    // useRef tanımlaması burada kalabilir
    const hasRequested = useRef(false);

    useEffect(() => {
        // Token yoksa veya zaten istek atıldıysa fonksiyondan çık
        if (!token || hasRequested.current) return;

        // İstek atıldığını işaretle (Strict Mode'un 2. kez çalışmasını engeller)
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
        <div className="min-h-[60vh] flex items-center justify-center p-6 font-karla">
            <div className="max-w-md w-full text-center bg-white p-10 rounded-3xl shadow-xl border border-gray-50">

                {status === "loading" && (
                    <div className="flex flex-col items-center gap-4">
                        <FaSpinner className="animate-spin text-4xl text-blue-600" />
                        <h2 className="text-xl font-bold text-gray-700">Hesabınız Onaylanıyor...</h2>
                    </div>
                )}

                {status === "success" && (
                    <div className="animate-in fade-in zoom-in duration-500">
                        <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
                        <h1 className="text-2xl font-black text-gray-800 mb-4">E-POSTA ADRESİNİZ ONAYLANDI!</h1>
                        <p className="text-gray-600 leading-relaxed mb-8">
                            Artık Demiray Hidrolik dünyasında tam yetkiye sahipsiniz.
                            Hemen alışveriş yapabilir, ürünleri favorilerinize ekleyebilir ve sepetinizi yönetebilirsiniz.
                        </p>
                        <Link
                            to="/login"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg hover:shadow-blue-200"
                        >
                            Hemen Giriş Yap
                        </Link>
                    </div>
                )}

                {status === "error" && (
                    <div className="animate-in fade-in zoom-in duration-500">
                        <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-6" />
                        <h1 className="text-2xl font-black text-gray-800 mb-4">ONAY BAŞARISIZ</h1>
                        <p className="text-gray-600 mb-8">
                            Doğrulama linki geçersiz olabilir veya süresi dolmuş olabilir.
                            Lütfen tekrar kayıt olmayı deneyin veya destek ile iletişime geçin.
                        </p>
                        <Link to="/" className="text-blue-600 font-bold hover:underline">
                            Ana Sayfaya Dön
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
};

export default VerifyEmail;