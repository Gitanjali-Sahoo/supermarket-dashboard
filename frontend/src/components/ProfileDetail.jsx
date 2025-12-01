import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";

export default function ProfileDetail() {
  const { user } = useContext(GlobalContext);

  if (!user) return <p className="text-gray-500">No user data</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 shadow-lg rounded-2xl border dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Profile Details
      </h2>

      {/* Top section */}
      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg text-white text-4xl font-bold">
          {user.name.charAt(0)}
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {user.name}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 capitalize">
            {user.role}
          </p>
        </div>
      </div>

      {/* Details Box */}
      <div className="space-y-4">
        {/* Name */}
        <div className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold">
            N
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Full Name
            </p>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {user.name}
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 flex items-center justify-center font-bold">
            E
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {user.email}
            </p>
          </div>
        </div>

        {/* Role */}
        <div className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold">
            R
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
            <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">
              {user.role}
            </p>
          </div>
        </div>

        {/* Supermarket ID */}
        <div className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 flex items-center justify-center font-bold">
            S
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supermarket ID
            </p>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {user.supermarket_id ?? "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
