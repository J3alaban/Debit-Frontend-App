import { FC } from "react";

const Footer: FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-neutral-950 text-neutral-400 py-3 px-6 mt-auto border-t border-red-600/30 font-sans antialiased select-none">
            <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">

                {/* Sol Kısım: Şirket Telif Hakkı ve Uygulama Adı */}
                <div className="flex items-center gap-2 text-center sm:text-left">
                    {/* EMS ve Şirket Adı Beyaz ve Kırmızı Vurguyla Öne Çıkarıldı */}
                    <span className="font-black text-white tracking-wider">
                        <span className="text-red-600">EMS</span> MOBİL SİSTEMLER
                    </span>
                    <span className="text-neutral-700">|</span>
                    <span className="text-neutral-300 font-medium">
                        Zimmet Takip Sistemi © {currentYear}
                    </span>
                </div>

                {/* Sağ Kısım: Sistem Durumu ve Versiyon Bilgisi */}
                <div className="flex items-center gap-4 text-neutral-400">

                    <span className="text-neutral-800">/</span>
                    <span className="font-mono text-[11px] bg-red-950/20 border border-red-900/40 px-2 py-1 rounded text-red-400 font-semibold">
                        v1.0.0
                    </span>
                </div>

            </div>
        </footer>
    );
};

export default Footer;