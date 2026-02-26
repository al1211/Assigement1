import { Task } from "../admin/ProductList";

// ─── Delete Confirm ───────────────────────────────────────────────────────────
interface DeleteConfirmProps {
  task: Task;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

const DeleteConfirm = ({ task, onClose, onConfirm }: DeleteConfirmProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/30 backdrop-blur-sm">
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-200 p-7 text-center">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 text-xl">🗑</div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">Delete Task?</h3>
      <p className="text-sm text-gray-400 mb-6">
        "<span className="text-gray-600 font-medium">{task.title}</span>" will be permanently removed.
      </p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold text-sm rounded-xl py-3 transition">Cancel</button>
        <button onClick={() => { onConfirm(task._id); onClose(); }} className="flex-1 bg-red-500 hover:bg-red-600 active:scale-95 text-white font-semibold text-sm rounded-xl py-3 transition-all">
          Delete
        </button>
      </div>
    </div>
  </div>
);

export default DeleteConfirm