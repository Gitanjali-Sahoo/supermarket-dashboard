import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";

export default function ProfileDetail() {
  const { user } = useContext(GlobalContext);

  if (!user) return <p className="text-gray-500">No user data</p>;

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-black py-10 px-4">
      <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
          Profile Details
        </h2>

        {/* Top section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10">
          <div
            className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-600 to-purple-600
                          flex items-center justify-center shadow-lg
                          text-white text-5xl font-bold shrink-0"
          >
            {user.name.charAt(0)}
          </div>

          <div className="text-center sm:text-left">
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
          {/* Detail Item Component */}
          {[
            { label: "Full Name", icon: "N", value: user.name },
            { label: "Email", icon: "E", value: user.email },
            { label: "Role", icon: "R", value: user.role },
            {
              label: "Supermarket",
              icon: "S",
              value: user.supermarket_name ?? "Coop, Willys, Ika & Lidl",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4
                         bg-gray-100 dark:bg-gray-800
                         rounded-xl shadow-sm"
            >
              <div
                className="w-12 h-12 rounded-full
                              bg-gray-200 dark:bg-gray-700
                              flex items-center justify-center
                              text-gray-700 dark:text-gray-300
                              text-lg font-bold shrink-0"
              >
                {item.icon}
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.label}
                </p>
                <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
