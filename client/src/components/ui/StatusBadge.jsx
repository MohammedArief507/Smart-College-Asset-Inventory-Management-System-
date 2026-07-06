// src/components/ui/StatusBadge.jsx

const STATUS_STYLES = {
  Available:    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  Issued:       "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Damaged:      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  "Under Repair": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  Scrapped:     "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  Lost:         "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  Pending:      "bg-amber-100 text-amber-800",
  Approved:     "bg-blue-100 text-blue-800",
  Rejected:     "bg-red-100 text-red-800",
  Returned:     "bg-gray-100 text-gray-700",
  Cancelled:    "bg-gray-100 text-gray-700",
  New:          "bg-emerald-100 text-emerald-800",
  Good:         "bg-blue-100 text-blue-800",
  Fair:         "bg-amber-100 text-amber-800",
  Poor:         "bg-orange-100 text-orange-800",
};

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status] || "bg-gray-100 text-gray-700"}`}>
    {status}
  </span>
);

export default StatusBadge;
