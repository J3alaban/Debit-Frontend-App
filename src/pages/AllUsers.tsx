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
        <div className="container mx-auto min-h-[83vh] p-4 md:p-8 font-karla">
            <div className="border-l-4 border-blue-600 pl-4 mb-8">
                <h2 className="text-3xl font-black text-gray-800 dark:text-white uppercase tracking-tighter">
                    Personel Listesi
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                    Sistemde kayıtlı personel listesi
                </p>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center">
                    <div className="animate-spin mt-32 rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-100 dark:bg-slate-700">
                            <tr>
                                <th className="p-4 text-left">ID</th>
                                <th className="p-4 text-left">Ad</th>
                                <th className="p-4 text-left">Soyad</th>
                                <th className="p-4 text-left">Email</th>
                                <th className="p-4 text-left">Telefon</th>
                                <th className="p-4 text-left">TC No</th>
                                <th className="p-4 text-left">İşlemler</th>
                            </tr>
                            </thead>

                            <tbody>
                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-t border-gray-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                                >
                                    <td className="p-4">
                                        {user.id}
                                    </td>

                                    <td className="p-4">
                                        {user.firstName}
                                    </td>

                                    <td className="p-4">
                                        {user.lastName}
                                    </td>

                                    <td className="p-4">
                                        {user.email}
                                    </td>

                                    <td className="p-4">
                                        {user.phone}
                                    </td>

                                    <td className="p-4">
                                        {user.tcNo}
                                    </td>

                                    <td className="p-4">
                                        <button
                                            onClick={() =>
                                                handleViewProducts(user.id)
                                            }
                                            className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                                        >
                                            Görüntüle
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        {users.length === 0 && (
                            <div className="p-8 text-center text-gray-500">
                                Kullanıcı bulunamadı.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllUsers;