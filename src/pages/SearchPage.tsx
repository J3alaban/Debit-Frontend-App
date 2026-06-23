import { FC, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

const SearchPage: FC = () => {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") || "").trim();

  const [userResults, setUserResults] = useState<User[]>([]);
  const [notFound, setNotFound] = useState(false);

  const isLoading = useAppSelector((state) => state.homeReducer.isLoading);

  useEffect(() => {
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");

    if (!query) {
      setUserResults([]);
      setNotFound(true);
      return;
    }

    setNotFound(false);

    // Arama girdisini boşluklardan ayırarak bağımsız kelime grupları (token) oluşturuyoruz
    const searchTerms = query.toLowerCase().split(/\s+/).filter(Boolean);

    const matchedUsers = users.filter((u) => {
      const fullNameLower = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
      const emailLower = (u.email || "").toLowerCase();

      // Akıllı Filtrasyon Protokolü: Girdi sayısı arttıkça (örn: "kemal" -> "kemal yıl")
      // girilen TÜM kelime parçalarının personelin ad+soyad kombinasyonunda veya mailinde bulunması şart koşulur.
      return searchTerms.every((term) =>
        fullNameLower.includes(term) || emailLower.includes(term)
      );
    });

    setUserResults(matchedUsers);
    setNotFound(matchedUsers.length === 0);

  }, [searchParams, query]); // URL parametre değişimlerini eksiksiz yakalar

  return (
    <div className="container mx-auto min-h-[83vh] p-4 font-sans antialiased bg-zinc-50 dark:bg-zinc-950">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 mb-6">
        <span className="text-sm font-bold uppercase">
          PERSONEL ARAMA:{" "}
          <span className="font-mono text-red-600">"{query || "..."}"</span>
        </span>
      </div>

      {/* LOADING */}
      {isLoading ? (
        <div className="flex justify-center mt-32">
          <div className="animate-spin h-10 w-10 border-4 border-t-black dark:border-t-white" />
        </div>
      ) : notFound ? (
        <div className="text-center mt-32 text-xs uppercase font-bold text-zinc-500">
          Eşleşen personel bulunamadı
        </div>
      ) : (
        <div className="space-y-6">
          {/* USERS / PERSONEL LIST */}
          {userResults.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 p-4 rounded-sm shadow-sm">
              <p className="font-bold text-sm uppercase tracking-wider mb-4 border-b pb-2 border-zinc-100 dark:border-zinc-800">
                Arama Sonuçları ({userResults.length})
              </p>

              <div className="space-y-2">
                {userResults.map((u) => (
                  <div
                    key={u.id}
                    className="p-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 rounded-sm flex justify-between items-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <span className="font-medium text-sm text-zinc-800 dark:text-zinc-200">
                      {u.firstName} {u.lastName}
                    </span>
                    <span className="text-xs font-mono opacity-60 text-zinc-600 dark:text-zinc-400">
                      {u.email}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;