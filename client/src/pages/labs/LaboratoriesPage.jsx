// src/pages/labs/LaboratoriesPage.jsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Plus, Search, Edit2, Trash2, Loader2, FlaskConical } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import DataTable from "@/components/ui/DataTable";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { laboratoryService, departmentService } from "@/services/departmentService";

const LaboratoriesPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editLab, setEditLab] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, lab: null });

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const { data, isLoading } = useQuery({
    queryKey: ["laboratories", page, search],
    queryFn: () => laboratoryService.getAll({ page, limit: 10, search }),
    select: (res) => res.data,
  });

  const { data: deptData } = useQuery({
    queryKey: ["departments-all"],
    queryFn: () => departmentService.getAll({ limit: 100 }),
    select: (res) => res.data?.data || [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => laboratoryService.create(data),
    onSuccess: () => { toast.success("Laboratory created"); queryClient.invalidateQueries(["laboratories"]); closeModal(); },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => laboratoryService.update(id, data),
    onSuccess: () => { toast.success("Laboratory updated"); queryClient.invalidateQueries(["laboratories"]); closeModal(); },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => laboratoryService.delete(id),
    onSuccess: () => { toast.success("Laboratory deleted"); queryClient.invalidateQueries(["laboratories"]); setDeleteDialog({ open: false, lab: null }); },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed"),
  });

  const openCreate = () => { setEditLab(null); reset({}); setModalOpen(true); };
  const openEdit = (lab) => {
    setEditLab(lab);
    reset({ name: lab.name, code: lab.code, department: lab.department?._id, location: lab.location, capacity: lab.capacity });
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditLab(null); reset({}); };
  const onSubmit = (formData) => {
    if (editLab) updateMutation.mutate({ id: editLab._id, data: formData });
    else createMutation.mutate(formData);
  };

  const columns = [
    {
      key: "name", label: "Laboratory",
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
            <FlaskConical className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{val}</p>
            <p className="text-xs text-gray-500 font-mono">{row.code}</p>
          </div>
        </div>
      ),
    },
    { key: "department", label: "Department", render: (val) => val?.name || <span className="text-gray-400">—</span> },
    { key: "labIncharge", label: "Lab Incharge", render: (val) => val?.name || <span className="text-gray-400">Not assigned</span> },
    { key: "location", label: "Location", render: (val) => val || <span className="text-gray-400">—</span> },
    {
      key: "_id", label: "Actions",
      render: (id, row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"><Edit2 className="w-4 h-4" /></button>
          <button onClick={() => setDeleteDialog({ open: true, lab: row })} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Laboratories</h1>
          <p className="text-sm text-gray-500 mt-1">Manage college laboratories</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus className="w-4 h-4" /> Add Laboratory</button>
      </motion.div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Search labs..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="form-input pl-10" />
      </div>

      <DataTable columns={columns} data={data?.data || []} pagination={data?.meta?.pagination}
        onPageChange={setPage} isLoading={isLoading} emptyMessage="No laboratories found" />

      <Modal isOpen={modalOpen} onClose={closeModal} title={editLab ? "Edit Laboratory" : "Add Laboratory"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Lab Name</label>
              <input {...register("name", { required: "Required" })} className={`form-input ${errors.name ? "border-red-400" : ""}`} placeholder="Computer Lab 1" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="form-label">Lab Code</label>
              <input {...register("code", { required: "Required" })} className={`form-input ${errors.code ? "border-red-400" : ""}`} placeholder="CL01" />
              {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
            </div>
            <div>
              <label className="form-label">Department</label>
              <select {...register("department", { required: "Required" })} className={`form-input ${errors.department ? "border-red-400" : ""}`}>
                <option value="">Select Department</option>
                {deptData?.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
              {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>}
            </div>
            <div>
              <label className="form-label">Location</label>
              <input {...register("location")} className="form-input" placeholder="Block A, Room 101" />
            </div>
            <div>
              <label className="form-label">Capacity</label>
              <input {...register("capacity")} type="number" className="form-input" placeholder="30" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="btn-primary flex-1">
              {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
              {editLab ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, lab: null })}
        onConfirm={() => deleteMutation.mutate(deleteDialog.lab?._id)}
        title="Delete Laboratory"
        message={`Delete "${deleteDialog.lab?.name}"? This cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default LaboratoriesPage;
