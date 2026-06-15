import { FC } from "react";
import {
  ShieldCheck,
  Truck,
  Headphones,
  Settings,
  Wrench,
  Droplets
}
from "lucide-react";

const features = [
  {
    title: "Yüksek Güvenlik",
    desc: "Ağır yük operasyonlarında uluslararası emniyet standartları.",
    icon: <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-orange-500" />,
  },
  {
    title: "Hızlı Kurulum",
    desc: "Modüler hidrolik ünitelerle sahada en hızlı devreye alma süreci.",
    icon: <Truck className="w-8 h-8 md:w-10 md:h-10 text-orange-500" />,
  },
  {
    title: "Hassas Kontrol", // Yeni Eleman
    desc: "Oransal valf teknolojisi ile milimetrik hareket kabiliyeti.",
    icon: <Settings className="w-8 h-8 md:w-10 md:h-10 text-orange-500" />,
  },
  {
    title: "Uzman Servis",
    desc: "Vinç hidroliği konusunda uzman mobil teknik destek ekibi.",
    icon: <Headphones className="w-8 h-8 md:w-10 md:h-10 text-orange-500" />,
  },
  {
    title: "Yedek Parça",
    desc: "Sızdırmazlık elemanları ve valf grupları için geniş stok.",
    icon: <Wrench className="w-8 h-8 md:w-10 md:h-10 text-orange-500" />,
  },
  {
    title: "Yağ Analizi", // Yeni Eleman
    desc: "Sistem ömrünü uzatan periyodik filtrasyon ve yağ kontrolü.",
    icon: <Droplets className="w-8 h-8 md:w-10 md:h-10 text-orange-500" />,
  },
];

const Features: FC = () => {
  return (
      <section className="py-16 bg-gray-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-2 md:px-4">
          {/* grid-cols-3: Mobilde 3 sütun (2 satır oluşturur)
            lg:grid-cols-6: Masaüstünde tümü yan yana
        */}
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 md:gap-8 max-w-[1400px] mx-auto">
            {features.map((f, i) => (
                <div
                    key={i}
                    className="group flex flex-col items-center text-center p-3 md:p-8 rounded-2xl md:rounded-3xl transition-all duration-300 hover:bg-black hover:text-white dark:hover:bg-slate-800 hover:shadow-xl hover:-translate-y-2 cursor-default"
                >
                  {/* İkon Konteynırı */}
                  <div className="mb-4 md:mb-6 p-3 md:p-5 bg-white dark:bg-slate-800 rounded-xl md:rounded-2xl shadow-sm group-hover:shadow-orange-500/20 group-hover:scale-110 transition-all duration-300 border border-gray-100 dark:border-slate-700">
                    {f.icon}
                  </div>

                  {/* Başlık - Mobilde yazı boyutunu küçülttük */}
                  <h3 className="text-[10px] sm:text-xs md:text-xl font-bold mb-1 md:mb-3 dark:text-white tracking-tight leading-tight">
                    {f.title}
                  </h3>

                  {/* Açıklama - Mobilde çok yer kaplamaması için md:block yapıldı veya text-xs kullanıldı */}
                  <p className="hidden md:block text-gray-500 dark:text-gray-400 text-sm leading-relaxed group-hover:text-gray-300">
                    {f.desc}
                  </p>

                  {/* Mobil için çok kısa açıklama alternatifi (opsiyonel) */}
                  <p className="md:hidden text-gray-400 text-[8px] leading-none opacity-0 group-hover:opacity-100 transition-opacity">
                    Detaylı Bilgi
                  </p>
                </div>
            ))}
          </div>
        </div>
      </section>
  );
};

export default Features;
