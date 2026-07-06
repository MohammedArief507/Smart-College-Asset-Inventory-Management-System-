// src/components/ui/StatCard.jsx
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue, delay = 0 }) => {
  const colorMap = {
    blue:   { bg: "bg-blue-50 dark:bg-blue-900/20",   icon: "text-blue-600",   border: "border-blue-100 dark:border-blue-800" },
    green:  { bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: "text-emerald-600", border: "border-emerald-100 dark:border-emerald-800" },
    orange: { bg: "bg-orange-50 dark:bg-orange-900/20", icon: "text-orange-600", border: "border-orange-100 dark:border-orange-800" },
    red:    { bg: "bg-red-50 dark:bg-red-900/20",     icon: "text-red-600",    border: "border-red-100 dark:border-red-800" },
    purple: { bg: "bg-purple-50 dark:bg-purple-900/20", icon: "text-purple-600", border: "border-purple-100 dark:border-purple-800" },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={`bg-white dark:bg-gray-900 rounded-2xl p-6 border ${c.border} shadow-sm hover:shadow-md transition-shadow duration-200`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {trendValue && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend === "up" ? "text-emerald-600" : "text-red-500"}`}>
              {trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trendValue}
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${c.icon}`} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
