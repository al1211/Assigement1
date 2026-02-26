import { useNavigate } from "react-router";
import type { Task } from "../admin/ProductList";
import React from "react";

interface TaskRowProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const CheckIcon = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828A2 2 0 0110 16H8v-2a2 2 0 01.586-1.414z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3M3 7h18" />
  </svg>
);

const TaskRow = ({ task, onToggle,  onDelete }: TaskRowProps) => {
  const navigate=useNavigate();

return (  <div className={`group flex items-start gap-4 p-4 rounded-xl border transition-all duration-150 ${task.complete ? "bg-gray-50 border-gray-100" : "bg-white border-gray-200 hover:border-indigo-200 hover:shadow-sm"
    }`}>
    <button
      onClick={() => onToggle(task._id)}
      className={`mt-0.5 shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${task.complete ? "bg-indigo-500 border-indigo-500 text-white" : "border-gray-300 hover:border-indigo-400"
        }`}
    >
      {task.complete && <CheckIcon />}
    </button>

    <div className="flex-1 min-w-0">
      <p className={`text-sm font-semibold truncate ${task.complete ? "line-through text-gray-400" : "text-gray-800"}`}>
        {task.title}
      </p>
      {task.description ? (
        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{task.description}</p>
      ) : (
        <p className="text-xs text-gray-300 mt-0.5 italic">No description</p>
      )}
    </div>

    <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${task.complete ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
      }`}>
      {task.complete ? "Done" : "Pending"}
    </span>

    <div className="shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button onClick={() =>navigate(`/admin/product/edit/${task._id}`) } className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 transition" title="Edit">
        <EditIcon/>
      </button>
      <button onClick={() => onDelete(task)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition" title="Delete">
        <TrashIcon />
      </button>
    </div>
  </div>
)};



export default TaskRow