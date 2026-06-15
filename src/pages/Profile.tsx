import ProfileUser from "../components/ProfileUser";
import ProfileAddress from "../components/ProfileAddress";

export default function Profile() {
  return (
    <div className="min-h-screen p-6 bg-gray-100 flex justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProfileUser />
        <ProfileAddress />
      </div>
    </div>
  );
}

