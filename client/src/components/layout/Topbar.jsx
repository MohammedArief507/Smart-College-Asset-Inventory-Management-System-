// src/components/layout/Topbar.jsx
import { Menu, Bell, Sun, Moon, LogOut, User, ChevronDown, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ROLE_COLORS } from "@/constants/roles";

const Topbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = user?.name
    ?.split(" ")
    .map(n => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="h-16 flex-shrink-0 flex items-center px-6 gap-4
      bg-white dark:bg-gray-900
      border-b border-gray-200/80 dark:border-gray-800
      shadow-sm">

      {/* Menu toggle */}
      <button
        onClick={onMenuClick}
        className="p-2 rounded-xl text-gray-500 hover:text-[#020b56] dark:hover:text-white
          hover:bg-blue-50 dark:hover:bg-gray-800
          transition-all duration-150 group"
      >
        <Menu className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
      </button>

      {/* Breadcrumb / title area */}
      <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
        <span className="font-semibold text-[#020b56] dark:text-blue-400">Smart Asset</span>
        <span>/</span>
        <span>IMS Portal</span>
      </div>

      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-1.5">

        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-gray-500 dark:text-gray-400
            hover:text-[#020b56] dark:hover:text-yellow-400
            hover:bg-blue-50 dark:hover:bg-gray-800
            transition-all duration-150 group"
          title="Toggle theme"
        >
          <motion.div
            key={isDark ? "sun" : "moon"}
            initial={{ rotate: -30, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {isDark
              ? <Sun className="w-5 h-5 group-hover:scale-110 transition-transform" />
              : <Moon className="w-5 h-5 group-hover:scale-110 transition-transform" />}
          </motion.div>
        </button>

        {/* Notifications */}
        <Link
          to="/notifications"
          className="relative p-2 rounded-xl text-gray-500 dark:text-gray-400
            hover:text-[#020b56] dark:hover:text-blue-400
            hover:bg-blue-50 dark:hover:bg-gray-800
            transition-all duration-150 group"
        >
          <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full
            ring-2 ring-white dark:ring-gray-900 animate-pulse" />
        </Link>

        {/* User dropdown */}
        <div className="relative ml-1" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(p => !p)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl
              hover:bg-blue-50 dark:hover:bg-gray-800
              border border-transparent hover:border-blue-100 dark:hover:border-gray-700
              transition-all duration-150 group"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#020b56] to-indigo-600
              flex items-center justify-center shadow-sm">
              <span className="text-xs font-bold text-white">{initials}</span>
            </div>

            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                {user?.name}
              </p>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${ROLE_COLORS[user?.role] || ""}`}>
                {user?.role}
              </span>
            </div>

            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200
              ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-52
                  bg-white dark:bg-gray-800 rounded-2xl
                  shadow-xl shadow-gray-200/60 dark:shadow-black/30
                  border border-gray-100 dark:border-gray-700
                  py-2 z-50"
              >
                {/* User info header */}
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>

                <div className="py-1.5">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700
                      dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700
                      hover:text-[#020b56] dark:hover:text-blue-400
                      transition-colors duration-150 group"
                  >
                    <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    My Profile
                  </Link>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 pt-1.5">
                  <button
                    onClick={() => { setDropdownOpen(false); logout(); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm
                      text-red-600 dark:text-red-400
                      hover:bg-red-50 dark:hover:bg-red-900/20
                      transition-colors duration-150 group"
                  >
                    <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
