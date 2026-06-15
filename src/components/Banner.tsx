import { FC } from "react";

const Banner: FC = () => (
  <div className="container mt-12 mx-auto px-4 lg:px-8 font-lora">
    <div className="flex flex-col md:flex-row shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700">
 
      <div className="md:w-1/2 relative min-h-[300px] md:min-h-full">
        <img 
          src="/banner.jpg" 
          alt="about" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
        />
      </div>


      <div className="bg-[#f0f7ff] dark:bg-slate-800 dark:text-white md:w-1/2 flex flex-col justify-center p-8 lg:p-12">
        <span className="text-blue-600 dark:text-blue-400 font-bold tracking-widest uppercase text-sm mb-2">
          Biz Kimiz?
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-800 dark:text-white leading-tight">
          Hakkımızda
        </h1>
        
       
        <div className="space-y-4 mb-8">
          {[
            "1999'dan beri bu sektörde hizmet vermekteyiz",
            "Hidroliğe daha iyi bir soluk getirmek için buradayız",
            "Ek işimiz değil tek işimiz"
          ].map((text, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
              <h2 className="text-lg md:text-xl font-medium text-slate-700 dark:text-slate-200">
                {text}
              </h2>
            </div>
          ))}
        </div>


        <div className="w-16 h-1 bg-blue-500 mb-6 rounded-full" />
        <p className="text-base md:text-lg leading-relaxed text-slate-600 dark:text-slate-400 font-sans italic">
          Kaliteli ürünleri, güvenli ödeme altyapısı ve hızlı teslimat anlayışıyla
          kullanıcılarımıza en iyi alışveriş deneyimini sunmayı hedefliyoruz.
          Müşteri memnuniyeti bizim için önceliktir.
        </p>
      </div>

    </div>
  </div>
);

export default Banner;