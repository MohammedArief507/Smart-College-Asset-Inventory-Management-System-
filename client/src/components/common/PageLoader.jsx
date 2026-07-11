// src/components/common/PageLoader.jsx
import { motion } from "framer-motion";

const ImsLogo = () => (
  <svg width="52" height="52" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="loaderGrad" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1e40af" />
        <stop offset="100%" stopColor="#4f46e5" />
      </linearGradient>
    </defs>
    <rect width="56" height="56" rx="16" fill="url(#loaderGrad)" />
    <path d="M28 10L46 22H10L28 10Z" fill="white" fillOpacity="0.95" />
    <rect x="14" y="22" width="28" height="22" rx="2" fill="white" fillOpacity="0.85" />
    <rect x="23" y="32" width="10" height="12" rx="2" fill="url(#loaderGrad)" />
    <rect x="17" y="26" width="6" height="5" rx="1" fill="url(#loaderGrad)" fillOpacity="0.7" />
    <rect x="33" y="26" width="6" height="5" rx="1" fill="url(#loaderGrad)" fillOpacity="0.7" />
    <rect x="10" y="46" width="4" height="3" rx="0.5" fill="white" fillOpacity="0.4" />
    <rect x="16" y="46" width="2" height="3" rx="0.5" fill="white" fillOpacity="0.4" />
    <rect x="20" y="46" width="6" height="3" rx="0.5" fill="white" fillOpacity="0.4" />
    <rect x="28" y="46" width="2" height="3" rx="0.5" fill="white" fillOpacity="0.4" />
    <rect x="32" y="46" width="4" height="3" rx="0.5" fill="white" fillOpacity="0.4" />
    <rect x="38" y="46" width="2" height="3" rx="0.5" fill="white" fillOpacity="0.4" />
    <rect x="42" y="46" width="4" height="3" rx="0.5" fill="white" fillOpacity="0.4" />
  </svg>
);

const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-950 z-50">
    <div className="flex flex-col items-center gap-5">
      {/* Animated logo */}
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <ImsLogo />
        <div className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-xl -z-10 scale-150" />
      </motion.div>

      {/* Loading bar */}
      <div className="w-40 h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-blue-600"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>

      <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">
        Loading Smart Asset IMS...
      </p>
    </div>
  </div>
);

export default PageLoader;
