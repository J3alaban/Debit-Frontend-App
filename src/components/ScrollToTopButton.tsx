import React, { useState, useEffect } from "react";
import { IoIosArrowUp } from "react-icons/io";

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-10 right-8 z-50">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="bg-black text-white hover:bg-red-600 dark:bg-zinc-800 dark:hover:bg-red-600 rounded-none h-10 w-10 border border-black dark:border-zinc-700 transition-all duration-200 flex items-center justify-center shadow-2xl"
          title="Yukarı Kaydır"
        >
          <IoIosArrowUp size={24} className="transform hover:-translate-y-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default ScrollToTopButton;