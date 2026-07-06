// src/pages/activity/ActivityLogsPage.jsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { History, Search } from "lucide-react";
import { motion } from "framer-motion";
import DataTable from "@/components/ui/DataTable";
import activityService from "@/services/activityService";

const ACTION_COLORS = {
  LOGIN:              "bg-emerald-100 text-emerald-700",
  LOGOUT:             "bg-gray-100 text-gray-600",
  USER_CREATED:       "bg-blue-100 text-blue-700",
  USER_UPDATED:       "bg-blue-100 text-blue-700",
  USER_DELETED:       "bg-red-100 text-red-700",
  USER_ACTIVATED:     "bg-emerald-100 text-emerald-700",
  USER_DEACTIVATED:   "bg-red-100 text-red-700",
  ASSET_CREATED:      "bg-purple-100 text-purple-700",
  ASSET_UPDATED:      "bg-purple-100 text-purple-700",
  ASSET_DELETED:      "bg-red-100 text-red-700",
  REQUEST_SUBMITTED:  "bg-amber-100 text-amber-700",
  REQUEST_APPROVED:   "bg-emerald-100 text-emerald-700",
  REQUEST_REJECTED:   "bg-red-100 text-red-700",
  REQUEST_CANCELLED:  "bg-gray-100 text-gray-600",
  ASSET_ISSUED:       "bg-blue-100 text-blue-700",
  ASSET_RETURNED:     "bg-teal-100 text-teal-700",
  DEPARTMENT_CREATED: "bg-indigo-100 text-indigo-700",
  LAB_CREATED:        "bg-cyan-100 text-cyan-700",
  PASSWORD_CHANGED:   "bg-orange-100 text-orange-700",
};

const ALL_ACTIONS = [
  "LOGIN", "LOGOUT", "USER_CREATED", "USER_UPDATED", "USER_DELETED",
  "ASSET_CREATED", "ASSET_UPDATED", "ASSET_DELETED",
  "REQUEST_SUBMITTED", "REQUEST_APPROVED", "REQUEST_REJECTED",
  "ASSET_ISSUED", "ASSET_RETURNED",
  "DEPARTMENT_CREATED", "LAB_CREATED",
];

const ActivityLogsPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["activity-logs", page, search, actionFilter],
    queryFn: () => activityService.getLogs({ page, limit: 20, action: actionFilter }),
    select: (res) => res.data,
  });

  const columns = [
    {
      key: "action", label: "Action",
      render: (val) => (
        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${ACTION_COLORS[val] || "bg-gray-100 text-gray-600"}`}>
          {val?.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      key: "performedBy", label: "Performed By",
      render: (val) => (
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{val?.name}</p>
          <p className="text-xs text-gray-400">{val?.role}</p>
        </div>
      ),
    },
    {
      key: "description", label: "Description",
      render: (val) => <span className="text-sm text-gray-600 dark:text-gray-400">{val}</span>,
    },
    {
      key: "target", label: "Target",
      render: (val) => val?.name
        ? <span className="text-xs font-mono text-gray-500">{val.name}</span>
        : <span className="text-gray-400">—</span>,
    },
    {
      key: "ipAddress", label: "IP Address",
      render: (val) => <span className="text-xs text-gray-400 font-mono">{val || "—"}</span>,
    },
    {
      key: "createdAt", label: "Time",
      render: (val) => (
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {new Date(val).toLocaleDateString("en-IN")}
          </p>
          <p className="text-xs text-gray-400">
            {new Date(val).toLocaleTimeString("en-IN")}
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <History className="w-6 h-6 text-gray-400" />
            Activity Logs
          </h1>
          <p className="text-sm text-gray-500 mt-1">Track every action performed in the system</p>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search logs..."
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="form-input pl-10" />
        </div>
        <select value={actionFilter}
          onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
          className="form-input w-52">
          <option value="">All Actions</option>
          {ALL_ACTIONS.map(a => (
            <option key={a} value={a}>{a.replace(/_/g, " ")}</option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        pagination={data?.meta?.pagination}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyMessage="No activity logs found"
      />
    </div>
  );
};

export default ActivityLogsPage;
