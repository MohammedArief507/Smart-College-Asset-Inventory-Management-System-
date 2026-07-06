// src/pages/requests/RequestsPage.jsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus, Search, Eye, CheckCircle, XCircle,
  Package, Loader2, Send, RotateCcw,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import DataTable from "@/components/ui/DataTable";
import Modal from "@/components/ui/Modal";
import StatusBadge from "@/components/ui/StatusBadge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import requestService from "@/services/requestService";
import assetService from "@/services/assetService";
import { useAuth } from "@/contexts/AuthContext";
import { ROLES } from "@/constants/roles";

// ── Schemas ──────────────────────────────────
const requestSchema = z.object({
  asset: z.string().min(1, "Asset is required"),
  quantityRequested: z.coerce.number().min(1, "Quantity must be at least 1"),
  purpose: z.string().min(1, "Purpose is required"),
  requiredFrom: z.string().optional(),
  requiredUntil: z.string().optional(),
});

const hodSchema = z.object({
  action: z.enum(["approve", "reject"]),
  remarks: z.string().optional(),
});

const issueSchema = z.object({
  expectedReturnDate: z.string().optional(),
  remarks: z.string().optional(),
});

const returnSchema = z.object({
  condition: z.enum(["Good", "Damaged", "Lost"]),
  damageNotes: z.string().optional(),
  fine: z.coerce.number().min(0).optional(),
  remarks: z.string().optional(),
});

// ── Main Component ────────────────────────────
const RequestsPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeTab, setActiveTab] = useState("requests"); // requests | issued

  // Modals
  const [createModal, setCreateModal] = useState(false);
  const [viewModal, setViewModal] = useState({ open: false, request: null });
  const [hodModal, setHodModal] = useState({ open: false, request: null });
  const [issueModal, setIssueModal] = useState({ open: false, request: null });
  const [returnModal, setReturnModal] = useState({ open: false, issued: null });
  const [cancelDialog, setCancelDialog] = useState({ open: false, request: null });

  const isAdmin = user?.role === ROLES.ADMIN;
  const isManager = user?.role === ROLES.ADMIN_MANAGER || isAdmin;
  const isHOD = user?.role === ROLES.HOD || isAdmin;

  // Fetch requests
  const { data, isLoading } = useQuery({
    queryKey: ["requests", page, search, statusFilter, activeTab],
    queryFn: () =>
      activeTab === "requests"
        ? requestService.getAll({ page, limit: 10, search, status: statusFilter })
        : requestService.getIssued({ page, limit: 10 }),
    select: (res) => res.data,
  });

  // Fetch assets for create form
  const { data: assets } = useQuery({
    queryKey: ["assets-dropdown"],
    queryFn: () => assetService.getAll({ limit: 100, status: "Available" }),
    select: (res) => res.data?.data || [],
  });

  // ── Forms ──
  const createForm = useForm({ resolver: zodResolver(requestSchema) });
  const hodForm = useForm({ resolver: zodResolver(hodSchema) });
  const issueForm = useForm({ resolver: zodResolver(issueSchema) });
  const returnForm = useForm({ resolver: zodResolver(returnSchema), defaultValues: { condition: "Good" } });

  // ── Mutations ──
  const createMutation = useMutation({
    mutationFn: (data) => requestService.create(data),
    onSuccess: () => {
      toast.success("Request submitted!");
      queryClient.invalidateQueries(["requests"]);
      setCreateModal(false);
      createForm.reset();
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed"),
  });

  const hodMutation = useMutation({
    mutationFn: ({ id, data }) => requestService.hodAction(id, data),
    onSuccess: (_, vars) => {
      toast.success(`Request ${vars.data.action}d successfully!`);
      queryClient.invalidateQueries(["requests"]);
      setHodModal({ open: false, request: null });
      hodForm.reset();
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed"),
  });

  const issueMutation = useMutation({
    mutationFn: ({ id, data }) => requestService.issue(id, data),
    onSuccess: () => {
      toast.success("Asset issued successfully!");
      queryClient.invalidateQueries(["requests"]);
      setIssueModal({ open: false, request: null });
      issueForm.reset();
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed"),
  });

  const returnMutation = useMutation({
    mutationFn: ({ id, data }) => requestService.returnAsset(id, data),
    onSuccess: () => {
      toast.success("Asset returned successfully!");
      queryClient.invalidateQueries(["requests"]);
      setReturnModal({ open: false, issued: null });
      returnForm.reset();
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed"),
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => requestService.cancel(id),
    onSuccess: () => {
      toast.success("Request cancelled");
      queryClient.invalidateQueries(["requests"]);
      setCancelDialog({ open: false, request: null });
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed"),
  });

  // ── Table Columns ──
  const requestColumns = [
    {
      key: "requestId", label: "Request ID",
      render: (val) => <span className="font-mono text-xs text-gray-500">{val}</span>,
    },
    {
      key: "asset", label: "Asset",
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-primary-500 flex-shrink-0" />
          <div>
            <p className="font-medium text-sm text-gray-900 dark:text-white">{val?.name}</p>
            <p className="text-xs text-gray-400 font-mono">{val?.assetId}</p>
          </div>
        </div>
      ),
    },
    {
      key: "requestedBy", label: "Requested By",
      render: (val) => (
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{val?.name}</p>
          <p className="text-xs text-gray-400">{val?.role}</p>
        </div>
      ),
    },
    {
      key: "quantityRequested", label: "Qty",
      render: (val) => <span className="font-semibold">{val}</span>,
    },
    {
      key: "status", label: "Status",
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: "createdAt", label: "Date",
      render: (val) => new Date(val).toLocaleDateString("en-IN"),
    },
    {
      key: "_id", label: "Actions",
      render: (id, row) => (
        <div className="flex items-center gap-1.5">
          {/* View */}
          <button onClick={() => setViewModal({ open: true, request: row })}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors" title="View">
            <Eye className="w-4 h-4" />
          </button>

          {/* HOD Approve/Reject */}
          {isHOD && row.status === "Pending" && (
            <button onClick={() => { setHodModal({ open: true, request: row }); hodForm.reset({ action: "approve" }); }}
              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors" title="Review">
              <CheckCircle className="w-4 h-4" />
            </button>
          )}

          {/* Issue Asset */}
          {isManager && row.status === "Approved" && (
            <button onClick={() => { setIssueModal({ open: true, request: row }); issueForm.reset(); }}
              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors" title="Issue Asset">
              <Send className="w-4 h-4" />
            </button>
          )}

          {/* Cancel (by requester, pending only) */}
          {row.requestedBy?._id === user?._id && row.status === "Pending" && (
            <button onClick={() => setCancelDialog({ open: true, request: row })}
              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors" title="Cancel">
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  const issuedColumns = [
    {
      key: "issueId", label: "Issue ID",
      render: (val) => <span className="font-mono text-xs text-gray-500">{val}</span>,
    },
    {
      key: "asset", label: "Asset",
      render: (val) => (
        <div>
          <p className="font-medium text-sm text-gray-900 dark:text-white">{val?.name}</p>
          <p className="text-xs text-gray-400 font-mono">{val?.assetId}</p>
        </div>
      ),
    },
    {
      key: "issuedTo", label: "Issued To",
      render: (val) => val?.name || "—",
    },
    {
      key: "quantityIssued", label: "Qty",
      render: (val) => <span className="font-semibold">{val}</span>,
    },
    {
      key: "issueDate", label: "Issue Date",
      render: (val) => new Date(val).toLocaleDateString("en-IN"),
    },
    {
      key: "expectedReturnDate", label: "Due Date",
      render: (val) => val ? new Date(val).toLocaleDateString("en-IN") : <span className="text-gray-400">—</span>,
    },
    {
      key: "isReturned", label: "Status",
      render: (val) => (
        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${val ? "bg-gray-100 text-gray-600" : "bg-blue-100 text-blue-800"}`}>
          {val ? "Returned" : "Active"}
        </span>
      ),
    },
    {
      key: "_id", label: "Actions",
      render: (id, row) => (
        !row.isReturned && isManager ? (
          <button
            onClick={() => { setReturnModal({ open: true, issued: row }); returnForm.reset({ condition: "Good" }); }}
            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
            title="Return Asset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        ) : <span className="text-gray-400 text-xs">—</span>
      ),
    },
  ];

  const STATUSES = ["Pending", "Approved", "Rejected", "Issued", "Cancelled", "Returned"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Requests & Workflow</h1>
          <p className="text-sm text-gray-500 mt-1">Manage asset requests and approvals</p>
        </div>
        <button onClick={() => setCreateModal(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> New Request
        </button>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
        {["requests", "issued"].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {tab === "requests" ? "All Requests" : "Issued Assets"}
          </button>
        ))}
      </div>

      {/* Filters */}
      {activeTab === "requests" && (
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search requests..."
              value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="form-input pl-10" />
          </div>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="form-input w-44">
            <option value="">All Status</option>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      )}

      {/* Table */}
      <DataTable
        columns={activeTab === "requests" ? requestColumns : issuedColumns}
        data={data?.data || []}
        pagination={data?.meta?.pagination}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyMessage={activeTab === "requests" ? "No requests found" : "No issued assets"}
      />

      {/* ── Create Request Modal ── */}
      <Modal isOpen={createModal} onClose={() => { setCreateModal(false); createForm.reset(); }} title="New Asset Request">
        <form onSubmit={createForm.handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
          <div>
            <label className="form-label">Asset *</label>
            <select {...createForm.register("asset")} className={`form-input ${createForm.formState.errors.asset ? "border-red-400" : ""}`}>
              <option value="">Select Asset</option>
              {assets?.map(a => (
                <option key={a._id} value={a._id}>
                  {a.name} — Available: {a.availableQuantity}
                </option>
              ))}
            </select>
            {createForm.formState.errors.asset && <p className="text-red-500 text-xs mt-1">{createForm.formState.errors.asset.message}</p>}
          </div>

          <div>
            <label className="form-label">Quantity *</label>
            <input {...createForm.register("quantityRequested")} type="number" min="1"
              className={`form-input ${createForm.formState.errors.quantityRequested ? "border-red-400" : ""}`}
              placeholder="1" />
            {createForm.formState.errors.quantityRequested && <p className="text-red-500 text-xs mt-1">{createForm.formState.errors.quantityRequested.message}</p>}
          </div>

          <div>
            <label className="form-label">Purpose *</label>
            <textarea {...createForm.register("purpose")} rows={3}
              className={`form-input resize-none ${createForm.formState.errors.purpose ? "border-red-400" : ""}`}
              placeholder="Why do you need this asset?" />
            {createForm.formState.errors.purpose && <p className="text-red-500 text-xs mt-1">{createForm.formState.errors.purpose.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Required From</label>
              <input {...createForm.register("requiredFrom")} type="date" className="form-input" />
            </div>
            <div>
              <label className="form-label">Required Until</label>
              <input {...createForm.register("requiredUntil")} type="date" className="form-input" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setCreateModal(false); createForm.reset(); }} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={createMutation.isPending} className="btn-primary flex-1">
              {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit Request
            </button>
          </div>
        </form>
      </Modal>

      {/* ── View Request Modal ── */}
      <Modal isOpen={viewModal.open} onClose={() => setViewModal({ open: false, request: null })} title="Request Details" size="lg">
        {viewModal.request && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                ["Request ID", viewModal.request.requestId],
                ["Status", <StatusBadge status={viewModal.request.status} />],
                ["Asset", viewModal.request.asset?.name],
                ["Asset ID", viewModal.request.asset?.assetId],
                ["Requested By", viewModal.request.requestedBy?.name],
                ["Role", viewModal.request.requestedBy?.role],
                ["Quantity", viewModal.request.quantityRequested],
                ["Department", viewModal.request.department?.name || "—"],
                ["Date", new Date(viewModal.request.createdAt).toLocaleDateString("en-IN")],
              ].map(([label, value]) => (
                <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">{label}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{value}</p>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Purpose</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{viewModal.request.purpose}</p>
            </div>

            {viewModal.request.hodAction?.actionBy && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <p className="text-xs font-semibold text-blue-600 mb-1">HOD Action</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  By: {viewModal.request.hodAction.actionBy?.name}
                </p>
                {viewModal.request.hodAction.remarks && (
                  <p className="text-sm text-gray-500 mt-1">Remarks: {viewModal.request.hodAction.remarks}</p>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ── HOD Action Modal ── */}
      <Modal isOpen={hodModal.open} onClose={() => setHodModal({ open: false, request: null })} title="Review Request">
        <form onSubmit={hodForm.handleSubmit((d) => hodMutation.mutate({ id: hodModal.request?._id, data: d }))} className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{hodModal.request?.asset?.name}</p>
            <p className="text-xs text-gray-500 mt-1">Qty: {hodModal.request?.quantityRequested}</p>
            <p className="text-xs text-gray-500 mt-1">Purpose: {hodModal.request?.purpose}</p>
          </div>

          <div>
            <label className="form-label">Action *</label>
            <div className="grid grid-cols-2 gap-3">
              {["approve", "reject"].map((a) => (
                <label key={a} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  hodForm.watch("action") === a
                    ? a === "approve" ? "border-emerald-500 bg-emerald-50" : "border-red-500 bg-red-50"
                    : "border-gray-200 dark:border-gray-700"
                }`}>
                  <input {...hodForm.register("action")} type="radio" value={a} className="sr-only" />
                  {a === "approve" ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                  <span className="font-medium capitalize text-sm">{a}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="form-label">Remarks (optional)</label>
            <textarea {...hodForm.register("remarks")} rows={2} className="form-input resize-none" placeholder="Add a note..." />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setHodModal({ open: false, request: null })} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={hodMutation.isPending} className="btn-primary flex-1">
              {hodMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Issue Asset Modal ── */}
      <Modal isOpen={issueModal.open} onClose={() => setIssueModal({ open: false, request: null })} title="Issue Asset">
        <form onSubmit={issueForm.handleSubmit((d) => issueMutation.mutate({ id: issueModal.request?._id, data: d }))} className="space-y-4">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{issueModal.request?.asset?.name}</p>
            <p className="text-xs text-gray-500 mt-1">Qty to issue: {issueModal.request?.quantityRequested}</p>
            <p className="text-xs text-gray-500">Requested by: {issueModal.request?.requestedBy?.name}</p>
          </div>

          <div>
            <label className="form-label">Expected Return Date</label>
            <input {...issueForm.register("expectedReturnDate")} type="date" className="form-input" />
          </div>

          <div>
            <label className="form-label">Remarks (optional)</label>
            <textarea {...issueForm.register("remarks")} rows={2} className="form-input resize-none" placeholder="Any notes about the issue..." />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setIssueModal({ open: false, request: null })} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={issueMutation.isPending} className="btn-primary flex-1">
              {issueMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Issue Asset
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Return Asset Modal ── */}
      <Modal isOpen={returnModal.open} onClose={() => setReturnModal({ open: false, issued: null })} title="Return Asset">
        <form onSubmit={returnForm.handleSubmit((d) => returnMutation.mutate({ id: returnModal.issued?._id, data: d }))} className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{returnModal.issued?.asset?.name}</p>
            <p className="text-xs text-gray-500 mt-1">Issued to: {returnModal.issued?.issuedTo?.name}</p>
            <p className="text-xs text-gray-500">Qty: {returnModal.issued?.quantityIssued}</p>
          </div>

          <div>
            <label className="form-label">Return Condition *</label>
            <div className="grid grid-cols-3 gap-2">
              {["Good", "Damaged", "Lost"].map((c) => (
                <label key={c} className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border-2 cursor-pointer text-sm font-medium transition-all ${
                  returnForm.watch("condition") === c
                    ? c === "Good" ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : c === "Damaged" ? "border-amber-500 bg-amber-50 text-amber-700"
                      : "border-red-500 bg-red-50 text-red-700"
                    : "border-gray-200 dark:border-gray-700 text-gray-600"
                }`}>
                  <input {...returnForm.register("condition")} type="radio" value={c} className="sr-only" />
                  {c}
                </label>
              ))}
            </div>
            {returnForm.formState.errors.condition && <p className="text-red-500 text-xs mt-1">{returnForm.formState.errors.condition.message}</p>}
          </div>

          {returnForm.watch("condition") === "Damaged" && (
            <div>
              <label className="form-label">Damage Notes</label>
              <textarea {...returnForm.register("damageNotes")} rows={2} className="form-input resize-none" placeholder="Describe the damage..." />
            </div>
          )}

          <div>
            <label className="form-label">Fine (₹)</label>
            <input {...returnForm.register("fine")} type="number" min="0" className="form-input" placeholder="0" />
          </div>

          <div>
            <label className="form-label">Remarks</label>
            <textarea {...returnForm.register("remarks")} rows={2} className="form-input resize-none" placeholder="Any additional notes..." />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setReturnModal({ open: false, issued: null })} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={returnMutation.isPending} className="btn-primary flex-1">
              {returnMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Confirm Return
            </button>
          </div>
        </form>
      </Modal>

      {/* Cancel Dialog */}
      <ConfirmDialog
        isOpen={cancelDialog.open}
        onClose={() => setCancelDialog({ open: false, request: null })}
        onConfirm={() => cancelMutation.mutate(cancelDialog.request?._id)}
        title="Cancel Request"
        message={`Cancel request "${cancelDialog.request?.requestId}"?`}
        isLoading={cancelMutation.isPending}
      />
    </div>
  );
};

export default RequestsPage;
