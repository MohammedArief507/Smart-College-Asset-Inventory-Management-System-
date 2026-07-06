// src/pages/assets/AssetDetail.jsx
import StatusBadge from "@/components/ui/StatusBadge";
import { Package, Calendar, MapPin, Tag, Hash, Building2 } from "lucide-react";

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between py-2.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
    <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
    <span className="text-sm font-medium text-gray-900 dark:text-white text-right max-w-[60%]">
      {value || <span className="text-gray-400">—</span>}
    </span>
  </div>
);

const AssetDetail = ({ asset }) => (
  <div className="space-y-6">
    {/* Header card */}
    <div className="flex items-center gap-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-2xl">
      <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
        <Package className="w-8 h-8 text-primary-600" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{asset.name}</h3>
        <p className="text-sm font-mono text-gray-500">{asset.assetId}</p>
        <div className="flex gap-2 mt-1">
          <StatusBadge status={asset.status} />
          <StatusBadge status={asset.condition} />
        </div>
      </div>
    </div>

    {/* Quantity summary */}
    <div className="grid grid-cols-3 gap-3">
      {[
        { label: "Total", value: asset.quantity, color: "bg-blue-50 text-blue-700" },
        { label: "Available", value: asset.availableQuantity, color: "bg-emerald-50 text-emerald-700" },
        { label: "Issued", value: asset.issuedQuantity, color: "bg-amber-50 text-amber-700" },
      ].map(({ label, value, color }) => (
        <div key={label} className={`${color} rounded-xl p-3 text-center`}>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs font-medium mt-0.5">{label}</p>
        </div>
      ))}
    </div>

    {/* Details */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Asset Info
        </p>
        <DetailRow label="Category" value={asset.category?.name} />
        <DetailRow label="Brand" value={asset.brand} />
        <DetailRow label="Model" value={asset.model} />
        <DetailRow label="Serial Number" value={asset.serialNumber} />
        <DetailRow label="Supplier" value={asset.supplier} />
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Purchase & Warranty
        </p>
        <DetailRow
          label="Purchase Date"
          value={asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString("en-IN") : null}
        />
        <DetailRow
          label="Purchase Price"
          value={asset.purchasePrice ? `₹${asset.purchasePrice.toLocaleString("en-IN")}` : null}
        />
        <DetailRow
          label="Warranty Expiry"
          value={asset.warrantyExpiry ? new Date(asset.warrantyExpiry).toLocaleDateString("en-IN") : null}
        />
        <DetailRow label="Warranty Status" value={asset.warrantyStatus} />
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Location
        </p>
        <DetailRow label="Department" value={asset.department?.name} />
        <DetailRow label="Laboratory" value={asset.laboratory?.name} />
        <DetailRow label="Location" value={asset.location} />
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Other
        </p>
        <DetailRow label="Added By" value={asset.addedBy?.name} />
        <DetailRow
          label="Added On"
          value={new Date(asset.createdAt).toLocaleDateString("en-IN")}
        />
        <DetailRow label="Remarks" value={asset.remarks} />
      </div>
    </div>
  </div>
);

export default AssetDetail;
