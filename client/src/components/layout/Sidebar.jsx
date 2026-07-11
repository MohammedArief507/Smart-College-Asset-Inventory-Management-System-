// src/components/layout/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { NAV_ITEMS } from "@/constants/navigation";

// ── IMS Logo ─────────────────────────────────
const ImsLogo = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sidebarLogo" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#818cf8" />
      </linearGradient>
    </defs>
    <rect width="56" height="56" rx="16" fill="white" fillOpacity="0.15" />
    <path d="M28 10L46 22H10L28 10Z" fill="white" fillOpacity="0.95" />
    <rect x="14" y="22" width="28" height="22" rx="2" fill="white" fillOpacity="0.80" />
    <rect x="23" y="32" width="10" height="12" rx="2" fill="url(#sidebarLogo)" />
    <rect x="17" y="26" width="6" height="5" rx="1" fill="url(#sidebarLogo)" fillOpacity="0.8" />
    <rect x="33" y="26" width="6" height="5" rx="1" fill="url(#sidebarLogo)" fillOpacity="0.8" />
    <rect x="10" y="46" width="4" height="3" rx="0.5" fill="white" fillOpacity="0.4" />
    <rect x="16" y="46" width="2" height="3" rx="0.5" fill="white" fillOpacity="0.4" />
    <rect x="20" y="46" width="6" height="3" rx="0.5" fill="white" fillOpacity="0.4" />
    <rect x="28" y="46" width="2" height="3" rx="0.5" fill="white" fillOpacity="0.4" />
    <rect x="32" y="46" width="4" height="3" rx="0.5" fill="white" fillOpacity="0.4" />
    <rect x="38" y="46" width="2" height="3" rx="0.5" fill="white" fillOpacity="0.4" />
    <rect x="42" y="46" width="4" height="3" rx="0.5" fill="white" fillOpacity="0.4" />
  </svg>
);

const Sidebar = ({ isOpen, onToggle }) => {
  const { user } = useAuth();

  const allowedItems = NAV_ITEMS.filter(item => item.roles.includes(user?.role));

  const initials = user?.name
    ?.split(" ")
    .map(n => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.aside
      animate={{ width: isOpen ? 256 : 72 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="h-screen flex flex-col flex-shrink-0 overflow-hidden
        bg-[#020b56] dark:bg-gray-900
        border-r border-blue-900/50 dark:border-gray-800
        shadow-xl"
    >
      {/* ── Logo header ── */}
      <div className="h-16 flex items-center px-4 flex-shrink-0 border-b border-white/10 dark:border-gray-800">
        <div className="flex-shrink-0">
          <ImsLogo size={36} />
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="ml-3 overflow-hidden"
            >
              <p className="font-bold text-white text-sm leading-tight whitespace-nowrap">
                Smart Asset
              </p>
              <p className="text-blue-300/60 text-[10px] leading-tight whitespace-nowrap">
                IMS Portal
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isOpen && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
              className="ml-auto p-1.5 rounded-lg text-blue-300/60 hover:text-white
                hover:bg-white/10 transition-all duration-150"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>

        {!isOpen && (
          <button
            onClick={onToggle}
            className="ml-auto p-1 text-blue-300/40 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4 rotate-180" />
          </button>
        )}
      </div>

      {/* ── Nav items ── */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5 scrollbar-thin">
        {allowedItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={!isOpen ? item.label : undefined}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl
              text-sm font-medium transition-all duration-150 group relative
              ${isActive
                ? "bg-white/15 text-white shadow-sm border border-white/15"
                : "text-blue-200/70 hover:bg-white/8 hover:text-white"
              }
            `}
          >
            {({ isActive }) => (
              <>
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-400 rounded-r-full"
                  />
                )}

                <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-150
                  ${isActive ? "text-blue-300" : "text-blue-300/60 group-hover:text-blue-200 group-hover:scale-110"}`}
                />

                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip when collapsed */}
                {!isOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs
                    rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
                    whitespace-nowrap z-50 shadow-lg border border-gray-700">
                    {item.label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── User profile at bottom ── */}
      <div className="p-3 border-t border-white/10 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500
            flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-xs font-bold text-white">{initials}</span>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="overflow-hidden min-w-0"
              >
                <p className="text-xs font-semibold text-white truncate leading-tight">
                  {user?.name}
                </p>
                <p className="text-xs text-blue-300/60 truncate leading-tight">
                  {user?.role}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
