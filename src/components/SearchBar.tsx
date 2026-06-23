import { FC, useState, KeyboardEvent, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

interface SearchBarProps {
    onSearch?: (query: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    // URL'deki "q" değiştikçe input alanını besle (Geri/İleri butonları veya dış tetiklemeler için)
    useEffect(() => {
        const currentQuery = searchParams.get("q") || "";
        setSearchQuery(currentQuery);
    }, [searchParams]);

    // Anlık karakter girildikçe tetiklenen fonksiyon
    const handleInputChange = (value: string) => {
        setSearchQuery(value);

        // Eğer kullanıcı zaten arama sayfasındaysa, yazılan her karakterde URL parametresini güncelle
        if (location.pathname === "/search") {
            if (value.trim()) {
                setSearchParams({ q: value });
            } else {
                setSearchParams({});
            }
        }
    };

    const triggerSearch = () => {
        const q = searchQuery.trim();
        // Eğer kullanıcı arama sayfasında değilse, kelime olsun ya da olmasın sayfaya yönlendir
        if (location.pathname !== "/search") {
            navigate(`/search?q=${encodeURIComponent(q)}`);
        }
        if (onSearch) onSearch(q);
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            triggerSearch();
        }
    };

    return (
        <div className="flex w-full max-w-[450px] border-2 border-black dark:border-zinc-700 rounded-none overflow-hidden bg-white dark:bg-zinc-900 transition-colors">
            <input
                type="text"
                placeholder="Personel Ara..."
                className="px-4 py-2 w-full text-sm font-medium bg-transparent text-black dark:text-white placeholder-zinc-400 focus:outline-none"
                value={searchQuery}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyPress}
            />

            <button
                type="button"
                className="bg-black text-white text-[18px] grid place-items-center px-5 cursor-pointer hover:bg-red-600 dark:bg-zinc-800 dark:hover:bg-red-600 border-l border-black dark:border-zinc-700 transition-colors duration-150"
                onClick={triggerSearch}
                aria-label="Arama Yap"
            >
                <BsSearch />
            </button>
        </div>
    );
};

export default SearchBar;