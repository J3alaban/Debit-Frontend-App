import { FC, useState, useEffect } from "react";

const images = [
  { url: "/hero1.png", title: "Hidrolik Güç Üniteleri", desc: "Endüstriyel tesisler için yüksek verimli, özel tasarım güç paketleri." },
  { url: "/hero2.png", title: "Silindir Teknolojileri", desc: "Ağır hizmet tipi, sızdırmazlık garantili özel üretim hidrolik silindirler." },
  { url: "/hero3.png", title: "Valf Blokları", desc: "Hassas kontrol sağlayan, yüksek basınç dayanımlı manifold çözümleri." },
  { url: "/hero4.png", title: "Mobil Hidrolik", desc: "İş makineleri ve araç üstü ekipmanlar için dayanıklı mobil sistemler." },
  { url: "/hero5.png", title: "Filtrasyon Sistemleri", desc: "Sistem ömrünü uzatan, yüksek verimli yağ temizleme çözümleri." },
  { url: "/hero6.png", title: "Hortum ve Bağlantı", desc: "Sızdırmazlık odaklı, yüksek basınca dayanıklı bağlantı elemanları." },
  { url: "/hero7.png", title: "Oransal Kontrol", desc: "Elektronik kontrollü hidrolik sistemler ile maksimum hassasiyet." },
  { url: "/hero8.png", title: "Teknik Bakım", desc: "Yerinde arıza tespiti ve periyodik hidrolik sistem revizyonu." },
];

const HeroSection: FC = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
      <section className="bg-[#f0f4f8] dark:bg-slate-950 py-12 px-4 overflow-hidden">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row gap-2 h-[800px] md:h-[650px]">
            {images.map((img, idx) => (
                <div
                    key={idx}
                    onClick={() => setActive(idx)}
                    className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-lg ${
                        active === idx
                            ? "flex-[12] md:flex-[8]"
                            : "flex-[2] md:flex-1 opacity-70 hover:opacity-100"
                    }`}
                >
                  <img
                      src={img.url}
                      alt={img.title}
                      className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ${
                          active === idx ? "scale-110" : "scale-100"
                      }`}
                  />

                  <div
                      className={`absolute inset-0 transition-all duration-500 ${
                          active === idx
                              ? "bg-gradient-to-t from-blue-900/90 via-black/20 to-transparent"
                              : "bg-gray-900/40"
                      }`}
                  />

                  <div
                      className={`absolute bottom-12 left-8 right-8 transition-all duration-500 ${
                          active === idx
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-10 pointer-events-none"
                      }`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-[2px] w-8 bg-blue-500"></div>
                      <span className="text-blue-400 font-semibold uppercase tracking-tighter text-xs">
                    Hidrolik Mühendislik
                  </span>
                    </div>
                    <h2 className="text-white text-2xl md:text-4xl font-bold mb-3 uppercase tracking-tight">
                      {img.title}
                    </h2>
                    <p className="text-gray-300 text-sm md:text-lg max-w-lg leading-relaxed mb-6 font-light">
                      {img.desc}
                    </p>
                  </div>

                  <div
                      className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                          active === idx ? "opacity-0" : "opacity-100"
                      }`}
                  >
                    <div className="[writing-mode:vertical-lr] rotate-180 flex items-center gap-4">
                      <span className="text-white/20 text-4xl font-black">0{idx + 1}</span>
                      <span className="text-white/80 font-bold uppercase tracking-widest text-[10px] md:text-xs whitespace-nowrap">
                    {img.title}
                  </span>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </section>
  );
};

export default HeroSection;
