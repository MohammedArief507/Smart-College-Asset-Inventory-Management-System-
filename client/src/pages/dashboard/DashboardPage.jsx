// src/pages/dashboard/DashboardPage.jsx
import { motion } from "framer-motion";
import { Package, Users, ClipboardList, AlertTriangle, CheckCircle, Clock, TrendingUp, Building2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import StatCard from "@/components/ui/StatCard";
import { useAuth } from "@/contexts/AuthContext";

const monthlyData = [
  { month: "Jul", requests: 12, issued: 10 },
  { month: "Aug", requests: 19, issued: 16 },
  { month: "Sep", requests: 15, issued: 13 },
  { month: "Oct", requests: 25, issued: 22 },
  { month: "Nov", requests: 30, issued: 27 },
  { month: "Dec", requests: 22, issued: 20 },
];

const categoryData = [
  { name: "Laptop",    value: 35, color: "#3b82f6" },
  { name: "Desktop",   value: 20, color: "#10b981" },
  { name: "Projector", value: 15, color: "#f59e0b" },
  { name: "Furniture", value: 20, color: "#8b5cf6" },
  { name: "Others",    value: 10, color: "#ef4444" },
];

const recentRequests = [
  { id: "REQ-2024-00001", asset: "Dell Laptop",   requestedBy: "John Doe",   status: "Pending",  date: "2024-12-01" },
  { id: "REQ-2024-00002", asset: "HP Projector",  requestedBy: "Jane Smith", status: "Approved", date: "2024-12-02" },
  { id: "REQ-2024-00003", asset: "Office Chair",  requestedBy: "Bob Wilson", status: "Issued",   date: "2024-12-03" },
  { id: "REQ-2024-00004", asset: "Dell Monitor",  requestedBy: "Alice Brown",status: "Rejected", date: "2024-12-04" },
];

const statusBadge = {
  Pending:  "bg-amber-100 text-amber-800",
  Approved: "bg-blue-100 text-blue-800",
  Issued:   "bg-emerald-100 text-emerald-800",
  Rejected: "bg-red-100 text-red-800",
};

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Assets"     value="248" icon={Package}       color="blue"   trend="up"   trendValue="+12 this month" delay={0}    />
        <StatCard title="Available Assets" value="186" icon={CheckCircle}   color="green"  trend="up"   trendValue="+5 this week"   delay={0.05} />
        <StatCard title="Pending Requests" value="14"  icon={Clock}         color="orange" trend="up"   trendValue="4 need review"  delay={0.1}  />
        <StatCard title="Damaged Assets"   value="8"   icon={AlertTriangle} color="red"    trend="down" trendValue="-2 last month"  delay={0.15} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Users"       value="52" icon={Users}      color="purple" delay={0.2}  />
        <StatCard title="Departments"       value="8"  icon={Building2}  color="blue"   delay={0.25} />
        <StatCard title="Issued This Month" value="27" icon={TrendingUp} color="green"  delay={0.3}  />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Monthly Requests vs Issued</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Legend />
              <Bar dataKey="requests" fill="#3b82f6" radius={[6,6,0,0]} name="Requests" />
              <Bar dataKey="issued"   fill="#10b981" radius={[6,6,0,0]} name="Issued" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Asset by Category</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none" }} />
              <Legend iconType="circle" iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Recent Requests</h2>
          <a href="/requests" className="text-sm text-primary-600 hover:text-primary-700 font-medium">View all →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                {["Request ID","Asset","Requested By","Date","Status"].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {recentRequests.map(req => (
                <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gray-600 dark:text-gray-400">{req.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{req.asset}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{req.requestedBy}</td>
                  <td className="px-6 py-4 text-gray-500">{req.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge[req.status]}`}>
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
