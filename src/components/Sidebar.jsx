import { NavLink } from "react-router-dom";
import { logoutUser } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { FiHome, FiCreditCard, FiSettings, FiLogOut } from "react-icons/fi";
import { TbCurrencyRupee } from "react-icons/tb"; // ✅ Slim rupee symbol

const Sidebar = ({ user }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  // -------------- Handling logout ---------------
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  useEffect(() => {
    const handler = () => setIsOpen((prev) => !prev);
    window.addEventListener("toggleSidebar", handler);
    return () => window.removeEventListener("toggleSidebar", handler);
  }, []);

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/30 z-30 md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        className={`fixed flex flex-col items-center md:static inset-y-0 left-0 z-40 w-64 md:w-52 bg-gray-200 min-h-screen p-2 pt-20 transform transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="w-full p-2 flex flex-col items-center md:fixed">
          <h2 className="font-semibold text-2xl text-green-700 mb-6">{user.name}</h2>

          <div className="flex flex-col p-1 w-full gap-3">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl p-2 font-semibold text-sm bg-white hover:bg-green-100 transition ${
                  isActive ? "active-link" : ""
                }`
              }
            >
              <FiHome className="text-lg" /> Dashboard
            </NavLink>

            <NavLink
              to="/earnings"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl p-2 font-semibold text-sm bg-white hover:bg-green-100 transition ${
                  isActive ? "active-link" : ""
                }`
              }
            >
              <TbCurrencyRupee className="text-lg" /> Earnings
            </NavLink>

            <NavLink
              to="/expenses"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl p-2 font-semibold text-sm bg-white hover:bg-green-100 transition ${
                  isActive ? "active-link" : ""
                }`
              }
            >
              <FiCreditCard className="text-lg" /> Expenses
            </NavLink>

            <NavLink
              to="/userprofile"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl p-2 font-semibold text-sm bg-white hover:bg-green-100 transition ${
                  isActive ? "active-link" : ""
                }`
              }
            >
              <FiSettings className="text-lg" /> Settings
            </NavLink>
          </div>

          <button
            className="flex items-center justify-center gap-2 bg-red-50 text-red-800 border border-red-200 px-3 py-2 w-full rounded-lg hover:bg-red-200 transition mt-10"
            onClick={handleLogout}
          >
            <FiLogOut className="text-lg" /> Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
