// src/pages/reports/ReportsPage.jsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FileText, Download, Package, Users,
  ClipboardList, Building2, TrendingUp, Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import toast from "react-hot-toast";
import reportService from "@/services/reportService";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];

const ReportCard = ({ title, description, icon: Icon, color, onDownload, isLoading }) => {
  const colorMap = {
    blue:   "bg-blue-50 text-blue-600 border-blue-100",
    green:  "bg-emerald-50 text-emerald-600 border-emerald-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    amber:  "bg-amber-50 text-amber-600 border-amber-100",
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorMap[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <button
          onClick={onDownload}
          disabled={isLoading}
          className="btn-secondary text-xs gap-1.5 py-1.5 px-3"
        >
          {isLoading
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <Download className="w-3.5 h-3.5" />}
          Export CSV
        </button>
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
    </div>
  );
};

const ReportsPage = () => {
  const [downloading, setDownloading] = useState({});
  const [filters, setFilters] = useState({
    startDate: "", endDate: "", status: "",
  });

  const { data: summary, isLoading } = useQuery({
    queryKey: ["report-summary"],
    queryFn: () => reportService.getSummary(),
    select: (res) => res.data?.data,
  });

  const download = async (key, fn) => {
    setDownloading((p) => ({ ...p, [key]: true }));
    try {
      const response = await fn();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${key}-report-${Date.now()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Report downloaded!");
    } catch {
      toast.error("Download failed");
    } finally {
      setDownloading((p) => ({ ...p, [key]: false }));
    }
  };

  const statsCards = [
    { label: "Total Assets",      value: summary?.assets?.total     ?? "—", color: "text-blue-600",   bg: "bg-blue-50" },
    { label: "Available Assets",  value: summary?.assets?.available  ?? "—", color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Issued Assets",     value: summary?.assets?.issued     ?? "—", color: "text-amber-600",  bg: "bg-amber-50" },
    { label: "Damaged Assets",    value: summary?.assets?.damaged    ?? "—", color: "text-red-600",    bg: "bg-red-50" },
    { label: "Total Requests",    value: summary?.requests?.total    ?? "—", color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Pending Requests",  value: summary?.requests?.pending  ?? "—", color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Active Users",      value: summary?.users              ?? "—", color: "text-cyan-600",   bg: "bg-cyan-50" },
    { label: "Departments",       value: summary?.departments        ?? "—", color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">Reports & Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Generate and download reports</p>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statsCards.map(({ label, value, color, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm"
          >
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <span className={`text-lg font-bold ${color}`}>{isLoading ? "…" : value}</span>
            </div>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Date Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm"
      >
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Filter by Date Range
        </p>
        <div className="flex flex-wrap gap-3">
          <div>
            <label className="form-label text-xs">Start Date</label>
            <input type="date" value={filters.startDate}
              onChange={(e) => setFilters(p => ({ ...p, startDate: e.target.value }))}
              className="form-input text-sm py-2" />
          </div>
          <div>
            <label className="form-label text-xs">End Date</label>
            <input type="date" value={filters.endDate}
              onChange={(e) => setFilters(p => ({ ...p, endDate: e.target.value }))}
              className="form-input text-sm py-2" />
          </div>
          <div className="flex items-end">
            <button onClick={() => setFilters({ startDate: "", endDate: "", status: "" })}
              className="btn-secondary text-xs py-2">
              Clear
            </button>
          </div>
        </div>
      </motion.div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportCard
          title="Asset Report"
          description="All assets with status, condition, location"
          icon={Package} color="blue"
          isLoading={downloading.assets}
          onDownload={() => download("assets", () => reportService.downloadAssets(filters))}
        />
        <ReportCard
          title="Request Report"
          description="All asset requests with approval status"
          icon={ClipboardList} color="purple"
          isLoading={downloading.requests}
          onDownload={() => download("requests", () => reportService.downloadRequests(filters))}
        />
        <ReportCard
          title="Issue Report"
          description="Issued and returned assets with details"
          icon={TrendingUp} color="green"
          isLoading={downloading.issues}
          onDownload={() => download("issues", () => reportService.downloadIssues(filters))}
        />
        <ReportCard
          title="Department Report"
          description="Assets and users per department"
          icon={Building2} color="amber"
          isLoading={downloading.departments}
          onDownload={() => download("departments", () => reportService.downloadDepartments())}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm"
        >
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Request Trend
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={summary?.monthlyTrend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="requests" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Requests" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Assets by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm"
        >
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
            Assets by Category
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={summary?.assetsByCategory || []}
                dataKey="count"
                nameKey="name"
                cx="50%" cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                {(summary?.assetsByCategory || []).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none" }} />
              <Legend iconType="circle" iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Requests Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Recent Requests
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                {["Asset", "Requested By", "Date", "Status"].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {(summary?.recentRequests || []).map((r) => (
                <tr key={r._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{r.asset?.name}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{r.requestedBy?.name}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(r.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      r.status === "Approved" ? "bg-blue-100 text-blue-800"
                      : r.status === "Pending" ? "bg-amber-100 text-amber-800"
                      : r.status === "Issued" ? "bg-emerald-100 text-emerald-800"
                      : "bg-gray-100 text-gray-600"
                    }`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!summary?.recentRequests?.length && (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">No recent requests</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default ReportsPage;
