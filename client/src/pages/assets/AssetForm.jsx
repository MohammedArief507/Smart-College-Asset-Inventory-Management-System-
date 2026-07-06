// src/pages/assets/AssetForm.jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import assetService from "@/services/assetService";
import { departmentService, laboratoryService } from "@/services/departmentService";

const assetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  brand: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  purchaseDate: z.string().optional(),
  purchasePrice: z.coerce.number().min(0).optional(),
  warrantyExpiry: z.string().optional(),
  supplier: z.string().optional(),
  department: z.string().optional(),
  laboratory: z.string().optional(),
  location: z.string().optional(),
  condition: z.string().optional(),
  remarks: z.string().optional(),
});

const AssetForm = ({ defaultValues, onSubmit, isLoading, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(assetSchema),
    defaultValues: defaultValues || { condition: "New", quantity: 1 },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => assetService.getCategories(),
    select: (res) => res.data?.data || [],
  });

  const { data: departments } = useQuery({
    queryKey: ["departments-all"],
    queryFn: () => departmentService.getAll({ limit: 100 }),
    select: (res) => res.data?.data || [],
  });

  const { data: laboratories } = useQuery({
    queryKey: ["labs-all"],
    queryFn: () => laboratoryService.getAll({ limit: 100 }),
    select: (res) => res.data?.data || [],
  });

  const Field = ({ label, error, children }) => (
    <div>
      <label className="form-label">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Basic Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Field label="Asset Name *" error={errors.name?.message}>
            <input {...register("name")} className={`form-input ${errors.name ? "border-red-400" : ""}`} placeholder="e.g. Dell Laptop Inspiron" />
          </Field>
        </div>

        <Field label="Category *" error={errors.category?.message}>
          <select {...register("category")} className={`form-input ${errors.category ? "border-red-400" : ""}`}>
            <option value="">Select Category</option>
            {categories?.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </Field>

        <Field label="Quantity *" error={errors.quantity?.message}>
          <input {...register("quantity")} type="number" min="1" className={`form-input ${errors.quantity ? "border-red-400" : ""}`} placeholder="1" />
        </Field>

        <Field label="Brand">
          <input {...register("brand")} className="form-input" placeholder="Dell, HP, Samsung..." />
        </Field>

        <Field label="Model">
          <input {...register("model")} className="form-input" placeholder="Model number" />
        </Field>

        <Field label="Serial Number">
          <input {...register("serialNumber")} className="form-input" placeholder="SN-XXXXXXXX" />
        </Field>

        <Field label="Condition">
          <select {...register("condition")} className="form-input">
            {["New", "Good", "Fair", "Poor", "Damaged"].map(c => <option key={c}>{c}</option>)}
          </select>
        </Field>
      </div>

      {/* Purchase Info */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Purchase Details</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Purchase Date">
            <input {...register("purchaseDate")} type="date" className="form-input" />
          </Field>

          <Field label="Purchase Price (₹)">
            <input {...register("purchasePrice")} type="number" min="0" className="form-input" placeholder="0" />
          </Field>

          <Field label="Warranty Expiry">
            <input {...register("warrantyExpiry")} type="date" className="form-input" />
          </Field>

          <Field label="Supplier">
            <input {...register("supplier")} className="form-input" placeholder="Supplier name" />
          </Field>
        </div>
      </div>

      {/* Location */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Location</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Department">
            <select {...register("department")} className="form-input">
              <option value="">Select Department</option>
              {departments?.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
            </select>
          </Field>

          <Field label="Laboratory">
            <select {...register("laboratory")} className="form-input">
              <option value="">Select Laboratory</option>
              {laboratories?.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
            </select>
          </Field>

          <Field label="Location">
            <input {...register("location")} className="form-input" placeholder="Block A, Room 101" />
          </Field>
        </div>
      </div>

      {/* Remarks */}
      <Field label="Remarks">
        <textarea {...register("remarks")} rows={2} className="form-input resize-none" placeholder="Additional notes..." />
      </Field>

      {/* Actions */}
      <div className="flex gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
        <button type="submit" disabled={isLoading} className="btn-primary flex-1">
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {defaultValues ? "Update Asset" : "Add Asset"}
        </button>
      </div>
    </form>
  );
};

export default AssetForm;
