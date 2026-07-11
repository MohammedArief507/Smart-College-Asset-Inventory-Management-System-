// src/components/ui/StatCard.jsx
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue, delay = 0 }) => {
  const colorMap = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      icon: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-100 dark:bg-blue-900/40",
      border: "border-blue-100 dark:border-blue-900/30",
      glow: "group-hover:shadow-blue-100 dark:group-hover:shadow-blue-900/20",
      accent: "bg-blue-600",
    },
    green: {
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      icon: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
      border: "border-emerald-100 dark:border-emerald-900/30",
      glow: "group-hover:shadow-emerald-100 dark:group-hover:shadow-emerald-900/20",
      accent: "bg-emerald-500",
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-900/20",
      icon: "text-orange-600 dark:text-orange-400",
      iconBg: "bg-orange-100 dark:bg-orange-900/40",
      border: "border-orange-100 dark:border-orange-900/30",
      glow: "group-hover:shadow-orange-100 dark:group-hover:shadow-orange-900/20",
      accent: "bg-orange-500",
    },
    red: {
      bg: "bg-red-50 dark:bg-red-900/20",
      icon: "text-red-600 dark:text-red-400",
      iconBg: "bg-red-100 dark:bg-red-900/40",
      border: "border-red-100 dark:border-red-900/30",
      glow: "group-hover:shadow-red-100 dark:group-hover:shadow-red-900/20",
      accent: "bg-red-500",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      icon: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-100 dark:bg-purple-900/40",
      border: "border-purple-100 dark:border-purple-900/30",
      glow: "group-hover:shadow-purple-100 dark:group-hover:shadow-purple-900/20",
      accent: "bg-purple-500",
    },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`group relative bg-white dark:bg-gray-900 rounded-2xl p-6
        border ${c.border} shadow-sm
        hover:shadow-lg ${c.glow}
        transition-all duration-250 cursor-default overflow-hidden`}
    >
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${c.accent} opacity-60 group-hover:opacity-100 transition-opacity`} />

      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2 tabular-nums">
            {value}
          </p>
          {trendValue && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-semibold
              ${trend === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
              {trend === "up"
                ? <TrendingUp className="w-3.5 h-3.5" />
                : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>

        {/* Icon */}
        <div className={`w-12 h-12 rounded-2xl ${c.iconBg} flex items-center justify-center
          flex-shrink-0 group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
          <Icon className={`w-6 h-6 ${c.icon}`} />
        </div>
      </div>

      {/* Hover background glow */}
      <div className={`absolute inset-0 ${c.bg} opacity-0 group-hover:opacity-30
        transition-opacity duration-200 pointer-events-none rounded-2xl`} />
    </motion.div>
  );
};

export default StatCard;
