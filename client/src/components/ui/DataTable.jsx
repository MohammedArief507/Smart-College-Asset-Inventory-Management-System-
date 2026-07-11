// src/components/ui/DataTable.jsx
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const DataTable = ({ columns, data, pagination, onPageChange, isLoading, emptyMessage = "No records found" }) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="p-6 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-12 skeleton rounded-xl flex-1" style={{ animationDelay: `${i * 0.1}s` }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#020b56]/5 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
              {columns.map((col) => (
                <th key={col.key}
                  className="px-5 py-3.5 text-left text-xs font-bold text-[#020b56]/70 dark:text-gray-400
                    uppercase tracking-wider whitespace-nowrap">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <span className="text-2xl">📭</span>
                    </div>
                    <p className="font-semibold text-gray-500 dark:text-gray-400">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <motion.tr
                  key={row._id || rowIndex}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: rowIndex * 0.03 }}
                  className="border-b border-gray-100 dark:border-gray-800 last:border-0
                    hover:bg-blue-50/50 dark:hover:bg-gray-800/50
                    transition-colors duration-150 group"
                >
                  {columns.map((col) => (
                    <td key={col.key}
                      className="px-5 py-4 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-800
          flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/30">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}
            </span>{" "}
            –{" "}
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {pagination.totalItems}
            </span>
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-700
                disabled:opacity-40 disabled:cursor-not-allowed
                hover:bg-[#020b56] hover:text-white hover:border-[#020b56]
                dark:hover:bg-blue-600 dark:hover:border-blue-600
                text-gray-600 dark:text-gray-400
                transition-all duration-150"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page numbers */}
            {[...Array(pagination.totalPages)].map((_, i) => {
              const pageNum = i + 1;
              const isActive = pageNum === pagination.currentPage;
              if (pagination.totalPages > 5 && Math.abs(pageNum - pagination.currentPage) > 2) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all duration-150
                    ${isActive
                      ? "bg-[#020b56] text-white shadow-md shadow-blue-900/20 dark:bg-blue-600"
                      : "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-700
                disabled:opacity-40 disabled:cursor-not-allowed
                hover:bg-[#020b56] hover:text-white hover:border-[#020b56]
                dark:hover:bg-blue-600 dark:hover:border-blue-600
                text-gray-600 dark:text-gray-400
                transition-all duration-150"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
