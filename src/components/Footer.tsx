import { FC } from "react";
import { Link } from "react-router-dom";
import {  FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Footer: FC = () => {
    return (
        <footer className="bg-black text-white py-4 px-6 mt-auto border-t border-gray-800">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">

                {/* Sol Kısım: İletişim ve Konum */}
                <div className="flex gap-3 order-2 md:order-1">
                    <a
                        href="mailto:demirayhidrolik06@gmail.com"
                        className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 hover:bg-white hover:text-black px-3 py-1.5 rounded-md transition-all text-xs"
                        title="Gmail ile iletişime geçin"
                    >
                        <FaEnvelope className="text-sm" />
                        <span>Gmail</span>
                    </a>

                    <a
                        href="https://maps.google.com" // Gerçek linki buraya ekleyebilirsiniz
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 hover:bg-white hover:text-black px-3 py-1.5 rounded-md transition-all text-xs"
                        title="Konumu görüntüle"
                    >
                        <FaMapMarkerAlt className="text-sm" />
                        <span>Konum</span>
                    </a>
                </div>

                {/* Orta Kısım: Telif Hakkı ve Tasarımcı */}
                <div className="text-center order-1 md:order-2">
                    <p className="text-[10px] md:text-xs text-gray-400 uppercase tracking-widest">
                        © {new Date().getFullYear()} Demiray Hidrolik | Tüm Hakları Saklıdır
                    </p>
                    <div className="mt-1">
                        <Link
                            to="https://www.linkedin.com/in/balaban58/"
                            className="text-[10px] text-gray-500 hover:text-white transition-colors"
                        >
                            Design by <span className="font-bold">Balaban</span>
                        </Link>
                    </div>
                </div>

                {/* Sağ Kısım: Boş (Hizalamayı dengeler) */}
                <div className="hidden md:block w-[150px] order-3"></div>
            </div>


        </footer>
    );
};

export default Footer;