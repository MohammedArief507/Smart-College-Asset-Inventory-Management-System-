// src/pages/departments/DepartmentsPage.jsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Plus, Search, Edit2, Trash2, Loader2, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import DataTable from "@/components/ui/DataTable";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { departmentService } from "@/services/departmentService";

const DepartmentsPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editDept, setEditDept] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, dept: null });

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const { data, isLoading } = useQuery({
    queryKey: ["departments", page, search],
    queryFn: () => departmentService.getAll({ page, limit: 10, search }),
    select: (res) => res.data,
  });

  const createMutation = useMutation({
    mutationFn: (data) => departmentService.create(data),
    onSuccess: () => { toast.success("Department created"); queryClient.invalidateQueries(["departments"]); closeModal(); },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => departmentService.update(id, data),
    onSuccess: () => { toast.success("Department updated"); queryClient.invalidateQueries(["departments"]); closeModal(); },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => departmentService.delete(id),
    onSuccess: () => { toast.success("Department deleted"); queryClient.invalidateQueries(["departments"]); setDeleteDialog({ open: false, dept: null }); },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed"),
  });

  const openCreate = () => { setEditDept(null); reset({}); setModalOpen(true); };
  const openEdit = (dept) => { setEditDept(dept); reset({ name: dept.name, code: dept.code, description: dept.description }); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditDept(null); reset({}); };

  const onSubmit = (formData) => {
    if (editDept) updateMutation.mutate({ id: editDept._id, data: formData });
    else createMutation.mutate(formData);
  };

  const columns = [
    {
      key: "name", label: "Department",
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{val}</p>
            <p className="text-xs text-gray-500 font-mono">{row.code}</p>
          </div>
        </div>
      ),
    },
    {
      key: "hod", label: "HOD",
      render: (val) => val?.name || <span className="text-gray-400">Not assigned</span>,
    },
    {
      key: "description", label: "Description",
      render: (val) => val || <span className="text-gray-400">—</span>,
    },
    {
      key: "isActive", label: "Status",
      render: (val) => (
        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${val ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
          {val ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "_id", label: "Actions",
      render: (id, row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"><Edit2 className="w-4 h-4" /></button>
          <button onClick={() => setDeleteDialog({ open: true, dept: row })} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Departments</h1>
          <p className="text-sm text-gray-500 mt-1">Manage college departments</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus className="w-4 h-4" /> Add Department</button>
      </motion.div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Search departments..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="form-input pl-10" />
      </div>

      <DataTable columns={columns} data={data?.data || []} pagination={data?.meta?.pagination}
        onPageChange={setPage} isLoading={isLoading} emptyMessage="No departments found" />

      <Modal isOpen={modalOpen} onClose={closeModal} title={editDept ? "Edit Department" : "Add Department"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="form-label">Department Name</label>
            <input {...register("name", { required: "Name is required" })} className={`form-input ${errors.name ? "border-red-400" : ""}`} placeholder="Computer Science" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="form-label">Department Code</label>
            <input {...register("code", { required: "Code is required" })} className={`form-input ${errors.code ? "border-red-400" : ""}`} placeholder="CSE" />
            {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
          </div>
          <div>
            <label className="form-label">Description (optional)</label>
            <textarea {...register("description")} rows={3} className="form-input resize-none" placeholder="Department description..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="btn-primary flex-1">
              {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
              {editDept ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, dept: null })}
        onConfirm={() => deleteMutation.mutate(deleteDialog.dept?._id)}
        title="Delete Department"
        message={`Delete "${deleteDialog.dept?.name}"? This cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default DepartmentsPage;
