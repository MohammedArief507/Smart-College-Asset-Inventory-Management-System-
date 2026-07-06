// src/pages/assets/AssetsPage.jsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus, Search, Filter, Download, Edit2, Trash2,
  Package, Eye, RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import DataTable from "@/components/ui/DataTable";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import StatusBadge from "@/components/ui/StatusBadge";
import AssetForm from "./AssetForm";
import AssetDetail from "./AssetDetail";
import assetService from "@/services/assetService";

const STATUSES = ["Available", "Issued", "Damaged", "Under Repair", "Scrapped", "Lost"];
const CONDITIONS = ["New", "Good", "Fair", "Poor", "Damaged"];

const AssetsPage = () => {
  const queryClient = useQueryClient();

  // Filters
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ status: "", condition: "", category: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Modals
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState({ open: false, asset: null });
  const [viewModal, setViewModal] = useState({ open: false, asset: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, asset: null });

  // Fetch assets
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["assets", page, search, filters, sortBy, sortOrder],
    queryFn: () => assetService.getAll({
      page, limit: 10, search, sortBy, sortOrder, ...filters,
    }),
    select: (res) => res.data,
  });

  // Fetch categories for filter dropdown
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => assetService.getCategories(),
    select: (res) => res.data?.data || [],
  });

  // Create
  const createMutation = useMutation({
    mutationFn: (data) => assetService.create(data),
    onSuccess: () => {
      toast.success("Asset added successfully!");
      queryClient.invalidateQueries(["assets"]);
      setAddModal(false);
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to create asset"),
  });

  // Update
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => assetService.update(id, data),
    onSuccess: () => {
      toast.success("Asset updated successfully!");
      queryClient.invalidateQueries(["assets"]);
      setEditModal({ open: false, asset: null });
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to update asset"),
  });

  // Delete
  const deleteMutation = useMutation({
    mutationFn: (id) => assetService.delete(id),
    onSuccess: () => {
      toast.success("Asset deleted");
      queryClient.invalidateQueries(["assets"]);
      setDeleteDialog({ open: false, asset: null });
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to delete"),
  });

  // Export CSV
  const handleExport = async () => {
    try {
      const response = await assetService.export(filters);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `assets-${Date.now()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Assets exported successfully!");
    } catch {
      toast.error("Export failed");
    }
  };

  const columns = [
    {
      key: "assetId",
      label: "Asset ID",
      render: (val) => (
        <span className="font-mono text-xs text-gray-500 dark:text-gray-400">{val}</span>
      ),
    },
    {
      key: "name",
      label: "Asset",
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white text-sm">{val}</p>
            <p className="text-xs text-gray-500">
              {row.brand} {row.model}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (val) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{val?.name}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: "condition",
      label: "Condition",
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: "quantity",
      label: "Qty",
      render: (val, row) => (
        <div className="text-sm">
          <span className="font-semibold text-gray-900 dark:text-white">{row.availableQuantity}</span>
          <span className="text-gray-400"> / {val}</span>
        </div>
      ),
    },
    {
      key: "department",
      label: "Department",
      render: (val) => val?.name || <span className="text-gray-400">—</span>,
    },
    {
      key: "_id",
      label: "Actions",
      render: (id, row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewModal({ open: true, asset: row })}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setEditModal({ open: true, asset: row })}
            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteDialog({ open: true, asset: row })}
            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="page-title">Asset Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            {data?.meta?.pagination?.totalItems || 0} total assets
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExport} className="btn-secondary gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => setAddModal(true)} className="btn-primary">
            <Plus className="w-4 h-4" /> Add Asset
          </button>
        </div>
      </motion.div>

      {/* Search + Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, brand, model, asset ID..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="form-input pl-10"
            />
          </div>
          <button
            onClick={() => setShowFilters((p) => !p)}
            className={`btn-secondary gap-2 ${showFilters ? "bg-primary-50 text-primary-600 border-primary-200" : ""}`}
          >
            <Filter className="w-4 h-4" /> Filters
          </button>
          <button onClick={() => refetch()} className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700"
          >
            <div>
              <label className="form-label text-xs">Status</label>
              <select
                value={filters.status}
                onChange={(e) => { setFilters(p => ({ ...p, status: e.target.value })); setPage(1); }}
                className="form-input text-sm py-2"
              >
                <option value="">All Status</option>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label text-xs">Condition</label>
              <select
                value={filters.condition}
                onChange={(e) => { setFilters(p => ({ ...p, condition: e.target.value })); setPage(1); }}
                className="form-input text-sm py-2"
              >
                <option value="">All Conditions</option>
                {CONDITIONS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label text-xs">Category</label>
              <select
                value={filters.category}
                onChange={(e) => { setFilters(p => ({ ...p, category: e.target.value })); setPage(1); }}
                className="form-input text-sm py-2"
              >
                <option value="">All Categories</option>
                {categories?.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label text-xs">Sort By</label>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [by, order] = e.target.value.split("-");
                  setSortBy(by); setSortOrder(order);
                }}
                className="form-input text-sm py-2"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="quantity-desc">Highest Qty</option>
              </select>
            </div>

            <div className="col-span-2 sm:col-span-4 flex justify-end">
              <button
                onClick={() => { setFilters({ status: "", condition: "", category: "" }); setSearch(""); setPage(1); }}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear all filters
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={data?.data || []}
        pagination={data?.meta?.pagination}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyMessage="No assets found. Add your first asset!"
      />

      {/* Add Asset Modal */}
      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Add New Asset" size="lg">
        <AssetForm
          onSubmit={(data) => createMutation.mutate(data)}
          isLoading={createMutation.isPending}
          onCancel={() => setAddModal(false)}
        />
      </Modal>

      {/* Edit Asset Modal */}
      <Modal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, asset: null })}
        title="Edit Asset"
        size="lg"
      >
        {editModal.asset && (
          <AssetForm
            defaultValues={{
              ...editModal.asset,
              category: editModal.asset.category?._id,
              department: editModal.asset.department?._id,
              laboratory: editModal.asset.laboratory?._id,
              purchaseDate: editModal.asset.purchaseDate?.slice(0, 10),
              warrantyExpiry: editModal.asset.warrantyExpiry?.slice(0, 10),
            }}
            onSubmit={(data) => updateMutation.mutate({ id: editModal.asset._id, data })}
            isLoading={updateMutation.isPending}
            onCancel={() => setEditModal({ open: false, asset: null })}
          />
        )}
      </Modal>

      {/* View Asset Modal */}
      <Modal
        isOpen={viewModal.open}
        onClose={() => setViewModal({ open: false, asset: null })}
        title="Asset Details"
        size="lg"
      >
        {viewModal.asset && <AssetDetail asset={viewModal.asset} />}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, asset: null })}
        onConfirm={() => deleteMutation.mutate(deleteDialog.asset?._id)}
        title="Delete Asset"
        message={`Delete "${deleteDialog.asset?.name}"? This cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default AssetsPage;
