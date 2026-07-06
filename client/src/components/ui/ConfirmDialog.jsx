// src/components/ui/ConfirmDialog.jsx
import Modal from "./Modal";
import { AlertTriangle, Loader2 } from "lucide-react";

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
    <div className="flex flex-col items-center text-center py-2">
      <div className="w-14 h-14 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-7 h-7 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{message}</p>
      <div className="flex gap-3 w-full">
        <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm bg-red-600 hover:bg-red-700 text-white transition-all disabled:opacity-60"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Delete
        </button>
      </div>
    </div>
  </Modal>
);

export default ConfirmDialog;
