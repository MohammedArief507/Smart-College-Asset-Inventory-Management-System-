// src/pages/users/UsersPage.jsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Search, Edit2, Trash2, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import DataTable from "@/components/ui/DataTable";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import userService from "@/services/userService";
import { ROLES, ROLE_COLORS } from "@/constants/roles";

const userSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters").optional().or(z.literal("")),
  role: z.string().min(1, "Role required"),
  phone: z.string().optional(),
});

const UsersPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(userSchema),
  });

  // Fetch users
  const { data, isLoading } = useQuery({
    queryKey: ["users", page, search, roleFilter],
    queryFn: () => userService.getAll({ page, limit: 10, search, role: roleFilter }),
    select: (res) => res.data,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data) => userService.create(data),
    onSuccess: () => {
      toast.success("User created successfully");
      queryClient.invalidateQueries(["users"]);
      closeModal();
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to create user"),
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => userService.update(id, data),
    onSuccess: () => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries(["users"]);
      closeModal();
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to update user"),
  });

  // Toggle status mutation
  const toggleMutation = useMutation({
    mutationFn: (id) => userService.toggleStatus(id),
    onSuccess: () => {
      toast.success("User status updated");
      queryClient.invalidateQueries(["users"]);
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed"),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => userService.delete(id),
    onSuccess: () => {
      toast.success("User deleted");
      queryClient.invalidateQueries(["users"]);
      setDeleteDialog({ open: false, user: null });
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to delete"),
  });

  const openCreate = () => { setEditUser(null); reset({}); setModalOpen(true); };
  const openEdit = (user) => { setEditUser(user); reset({ name: user.name, email: user.email, role: user.role, phone: user.phone || "" }); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditUser(null); reset({}); };

  const onSubmit = (formData) => {
    if (!formData.password) delete formData.password;
    if (editUser) {
      updateMutation.mutate({ id: editUser._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-primary-700 dark:text-primary-400">
              {val?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{val}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (val) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[val] || ""}`}>
          {val}
        </span>
      ),
    },
    {
      key: "department",
      label: "Department",
      render: (val) => val?.name || <span className="text-gray-400">—</span>,
    },
    {
      key: "isActive",
      label: "Status",
      render: (val) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${val ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
          {val ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "_id",
      label: "Actions",
      render: (id, row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors" title="Edit">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => toggleMutation.mutate(id)} className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors" title="Toggle Status">
            {row.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
          </button>
          <button onClick={() => setDeleteDialog({ open: true, user: row })} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all system users and their roles</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="form-input pl-10"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="form-input w-full sm:w-48"
        >
          <option value="">All Roles</option>
          {Object.values(ROLES).map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </motion.div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={data?.data || []}
        pagination={data?.meta?.pagination}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyMessage="No users found"
      />

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={editUser ? "Edit User" : "Add New User"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="form-label">Full Name</label>
              <input {...register("name")} className={`form-input ${errors.name ? "border-red-400" : ""}`} placeholder="John Doe" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="form-label">Email</label>
              <input {...register("email")} type="email" className={`form-input ${errors.email ? "border-red-400" : ""}`} placeholder="john@example.com" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="form-label">Phone</label>
              <input {...register("phone")} className="form-input" placeholder="+91 9876543210" />
            </div>
            <div>
              <label className="form-label">{editUser ? "New Password (optional)" : "Password"}</label>
              <input {...register("password")} type="password" className={`form-input ${errors.password ? "border-red-400" : ""}`} placeholder="Min 6 characters" />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="form-label">Role</label>
              <select {...register("role")} className={`form-input ${errors.role ? "border-red-400" : ""}`}>
                <option value="">Select Role</option>
                {Object.values(ROLES).map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="btn-primary flex-1"
            >
              {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
              {editUser ? "Update User" : "Create User"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, user: null })}
        onConfirm={() => deleteMutation.mutate(deleteDialog.user?._id)}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteDialog.user?.name}"? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default UsersPage;
