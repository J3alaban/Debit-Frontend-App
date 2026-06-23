import { FC, useEffect, useState } from "react";
import { Config } from "../helpers/Config";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { updateLoading } from "../redux/features/homeSlice";
import { useNavigate } from "react-router-dom";

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    tcNo: string;
}

const AllUsers: FC = () => {
    const dispatch = useAppDispatch();

    const [users, setUsers] = useState<User[]>([]);

    const navigate = useNavigate();

    const handleViewProducts = (userId: number) => {
        localStorage.setItem("selectedUserId", userId.toString());
        navigate("/userproducts");
    };

    const isLoading = useAppSelector(
        (state) => state.homeReducer.isLoading
    );

    useEffect(() => {
        dispatch(updateLoading(true));

        fetch(`${Config.api.baseUrl}/api/v1/auth`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setUsers(data);
                localStorage.setItem(
                    "users",
                    JSON.stringify(data)
                );
            })
            .finally(() => {
                dispatch(updateLoading(false));
            });
    }, [dispatch]);

    return (
        <div className="mx-auto min-h-[83vh] p-4 md:p-8 font-sans antialiased bg-zinc-50 dark:bg-zinc-950 transition-colors">
            {/* Sol Kırmızı Çizgili Kurumsal Başlık Alanı */}
            <div className="border-l-4 border-red-600 pl-4 mb-8">
                <h2 className="text-2xl font-bold text-black dark:text-white uppercase tracking-wider">
                    Personel Listesi
                </h2>
                <p className="text-zinc-500 font-mono text-xs mt-1 uppercase tracking-tight">
                    Sistemde Kayıtlı / Zimmet Yetkilisi Personel Veritabanı
                </p>
            </div>

            {/* Kurumsal Loading Alanı */}
            {isLoading ? (
                <div className="flex items-center justify-center py-32">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-zinc-200 dark:border-zinc-800 border-t-red-600 dark:border-t-red-500"></div>
                </div>
            ) : (
                /* Keskin Çizgili ve Veri Odaklı Tablo Alanı */
                <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 rounded-none overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-black text-white dark:bg-zinc-800 dark:text-zinc-200">
                            <tr>
                                <th className="p-4 text-left text-xs uppercase tracking-wider font-bold">ID</th>
                                <th className="p-4 text-left text-xs uppercase tracking-wider font-bold">Ad</th>
                                <th className="p-4 text-left text-xs uppercase tracking-wider font-bold">Soyad</th>
                                <th className="p-4 text-left text-xs uppercase tracking-wider font-bold">E-Posta</th>
                                <th className="p-4 text-left text-xs uppercase tracking-wider font-bold">Telefon</th>
                                <th className="p-4 text-left text-xs uppercase tracking-wider font-bold">TC Kimlik No</th>
                                <th className="p-4 text-center text-xs uppercase tracking-wider font-bold">İşlemler</th>
                            </tr>
                            </thead>

                            <tbody className="text-sm font-medium">
                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-t-2 border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                                >
                                    <td className="p-4 font-mono text-zinc-500 dark:text-zinc-400">
                                        #{user.id}
                                    </td>

                                    <td className="p-4 text-black dark:text-white">
                                        {user.firstName}
                                    </td>

                                    <td className="p-4 text-black dark:text-white uppercase">
                                        {user.lastName}
                                    </td>

                                    <td className="p-4 text-zinc-600 dark:text-zinc-300">
                                        {user.email}
                                    </td>

                                    <td className="p-4 font-mono text-zinc-600 dark:text-zinc-300">
                                        {user.phone}
                                    </td>

                                    <td className="p-4 font-mono tracking-wider text-zinc-600 dark:text-zinc-300">
                                        {user.tcNo}
                                    </td>

                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => handleViewProducts(user.id)}
                                            className="px-4 py-2 bg-black text-white hover:bg-red-600 dark:bg-zinc-800 dark:hover:bg-red-600 rounded-none text-xs font-bold uppercase tracking-wider border border-transparent transition-colors duration-150"
                                        >
                                            Zimmetleri Gör
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        {users.length === 0 && (
                            <div className="p-8 text-center text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">
                                Sistemde kayıtlı kullanıcı bulunamadı.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllUsers;