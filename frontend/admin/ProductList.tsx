import React, { useEffect } from "react";
import { useState } from "react";
import { api } from "../api/axios";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Task {
  _id: string;
  title: string;
  description: string;
  complete: boolean;
}

interface FormValues {
  title: string;
  description: string;
  complete: boolean;
}

interface FormErrors {
  title?: string;
  description?: string;
}

type FilterType = "all" | "pending" | "done";
type ModalMode = "create" | "edit";

interface ModalState {
  mode: ModalMode;
  task?: Task;
}



// ─── Validation ───────────────────────────────────────────────────────────────
function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const title = values.title.trim();
  const desc = values.description.trim();
  if (title.length === 0) errors.title = "Title is required";
  else if (title.length < 3) errors.title = "Title must be at least 3 characters";
  else if (title.length > 100) errors.title = "Title cannot exceed 100 characters";
  if (desc.length > 500) errors.description = "Description cannot exceed 500 characters";
  return errors;
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 14.65z" />
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

const CheckIcon = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

// ─── Toggle ───────────────────────────────────────────────────────────────────
interface ToggleProps {
  checked: boolean;
  onChange: () => void;
}

const Toggle = ({ checked, onChange }: ToggleProps) => (
  <div
    className={`flex items-center justify-between border rounded-xl px-4 py-3.5 cursor-pointer transition select-none ${
      checked ? "bg-indigo-50/40 border-indigo-300" : "bg-gray-50 border-gray-200 hover:border-indigo-300"
    }`}
    onClick={onChange}
  >
    <div>
      <p className="text-sm font-medium text-gray-700">Mark as complete</p>
      <p className="text-xs text-gray-400 mt-0.5">{checked ? "Task is done" : "Task is in progress"}</p>
    </div>
    <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${checked ? "bg-indigo-500" : "bg-gray-200"}`}>
      <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </div>
  </div>
);

// ─── Task Modal ───────────────────────────────────────────────────────────────
interface TaskModalProps {
  mode: ModalMode;
  task?: Task;
  onClose: () => void;
  onSave: (values: FormValues) => void;
}

const TaskModal = ({ mode, task, onClose, onSave }: TaskModalProps) => {
  const initial: FormValues = mode === "edit" && task
    ? { title: task.title, description: task.description || "", complete: task.complete }
    : { title: "", description: "", complete: false };

  const [values, setValues] = useState<FormValues>(initial);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});

  const isDirty =
    mode === "edit"
      ? values.title !== initial.title || values.description !== initial.description || values.complete !== initial.complete
      : true;

  const handleChange = <K extends keyof FormValues>(field: K, val: FormValues[K]) => {
    const next = { ...values, [field]: val };
    setValues(next);
    if (touched[field]) setErrors(validate(next));
  };

  const handleBlur = (field: keyof FormValues) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(values));
  };

  const handleSubmit = () => {
    setTouched({ title: true, description: true });
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      onSave(values);
      onClose();
    }
  };

  const titleLen = values.title.length;
  const descLen = values.description.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-200 p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition text-2xl leading-none">&times;</button>

        <div className="mb-7">
          <span className="text-xs font-semibold tracking-widest text-indigo-500 uppercase">{mode === "edit" ? "Edit Task" : "New Task"}</span>
          <h2 className="mt-1 text-xl font-bold text-gray-900">
            {mode === "edit" ? `Editing #${task?.id}` : "Create a Task"}
          </h2>
        </div>

        {mode === "edit" && isDirty && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-5 text-xs text-amber-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
            You have unsaved changes
          </div>
        )}

        {/* Title */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Title <span className="text-red-400">*</span>
            </label>
            <span className={`text-xs tabular-nums ${titleLen > 90 ? (titleLen > 100 ? "text-red-500" : "text-amber-500") : "text-gray-300"}`}>
              {titleLen}/100
            </span>
          </div>
          <input
            type="text"
            placeholder="e.g. Fix login bug"
            value={values.title}
            onChange={(e) => handleChange("title", e.target.value)}
            onBlur={() => handleBlur("title")}
            maxLength={120}
            className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-800 placeholder-gray-300 outline-none transition focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 ${
              touched.title && errors.title ? "border-red-400 ring-2 ring-red-100" : "border-gray-200"
            }`}
          />
          {touched.title && errors.title && (
            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
              {errors.title}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Description</label>
            <span className={`text-xs tabular-nums ${descLen > 450 ? (descLen > 500 ? "text-red-500" : "text-amber-500") : "text-gray-300"}`}>
              {descLen}/500
            </span>
          </div>
          <textarea
            rows={3}
            placeholder="Add more details..."
            value={values.description}
            onChange={(e) => handleChange("description", e.target.value)}
            onBlur={() => handleBlur("description")}
            maxLength={520}
            className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-800 placeholder-gray-300 outline-none resize-none transition focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 ${
              touched.description && errors.description ? "border-red-400 ring-2 ring-red-100" : "border-gray-200"
            }`}
          />
          {touched.description && errors.description && (
            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
              {errors.description}
            </p>
          )}
        </div>

        <div className="mb-7">
          <Toggle checked={values.complete} onChange={() => handleChange("complete", !values.complete)} />
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold text-sm rounded-xl py-3 transition">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={mode === "edit" && !isDirty}
            className="flex-[2] bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl py-3 transition-all shadow-sm hover:shadow-indigo-200 hover:shadow-md"
          >
            {mode === "edit" ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

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

// ─── Task Row ─────────────────────────────────────────────────────────────────
interface TaskRowProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const TaskRow = ({ task, onToggle, onEdit, onDelete }: TaskRowProps) => (
  <div className={`group flex items-start gap-4 p-4 rounded-xl border transition-all duration-150 ${
    task.complete ? "bg-gray-50 border-gray-100" : "bg-white border-gray-200 hover:border-indigo-200 hover:shadow-sm"
  }`}>
    <button
      onClick={() => onToggle(task.id)}
      className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
        task.complete ? "bg-indigo-500 border-indigo-500 text-white" : "border-gray-300 hover:border-indigo-400"
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

    <span className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
      task.complete ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
    }`}>
      {task.complete ? "Done" : "Pending"}
    </span>

    <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button onClick={() => onEdit(task)} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 transition" title="Edit">
        <EditIcon />
      </button>
      <button onClick={() => onDelete(task)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition" title="Delete">
        <TrashIcon />
      </button>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [modal, setModal] = useState<ModalState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null | string>(null);

  const total = tasks.length;
  const doneCount = tasks.filter((t) => t.complete).length;
  const pendingCount = total - doneCount;
  const progress = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  const filtered = tasks.filter((t) => {
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "done" && t.complete) ||
      (filter === "pending" && !t.complete);
    return matchSearch && matchFilter;
  });

  const handleToggle = (id: string) =>
    setTasks((ts) => ts.map((t) => (t._id === id ? { ...t, complete: !t.complete } : t)));

  const handleSave = (values: FormValues) => {
    if (modal?.mode === "edit" && modal.task) {
      setTasks((ts) => ts.map((t) => (t._id === modal.task!._id ? { ...t, ...values } : t)));
    } else {
      const newTask: Task = { _id: `task-${Date.now()}`, ...values };
      setTasks((ts) => [newTask, ...ts]);
    }
  };

  const handleDelete = async(id: string) =>{
    try{
      const deletetask=await api.delete(`/v1/task/:${id}`);
      alert("delete task");

    }catch(err){
console.error(err);
    }
  }

  const stats: { label: string; value: number; color: string; bg: string }[] = [
    { label: "Total", value: total, color: "text-gray-800", bg: "bg-gray-50 border-gray-200" },
    { label: "Pending", value: pendingCount, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
    { label: "Completed", value: doneCount, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  ];

  useEffect(()=>{
    const fetchtask=async()=>{
       const res= await api.get("/v1/task/get");
       setTasks(res.data);
    }
    fetchtask();
  },[])

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-semibold tracking-widest text-indigo-500 uppercase">Task Manager</span>
          <h1 className="mt-1 text-3xl font-bold text-gray-900">My Tasks</h1>
          <p className="mt-1 text-sm text-gray-400">Manage and track your work in one place.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {stats.map((s) => (
            <div key={s.label} className={`${s.bg} border rounded-xl px-4 py-3 text-center`}>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span>Overall progress</span>
            <span className="font-semibold text-indigo-500">{progress}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"><SearchIcon /></span>
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 placeholder-gray-300 text-gray-700"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-600 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </select>
          <button
            onClick={() => setModal({ mode: "create" })}
            className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-sm rounded-xl px-4 py-2.5 transition-all shadow-sm hover:shadow-indigo-200 hover:shadow-md whitespace-nowrap"
          >
            + New Task
          </button>
        </div>

        {/* Task List */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-300">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-sm font-medium">No tasks found</p>
              <p className="text-xs mt-1">Try adjusting your search or filter</p>
            </div>
          ) : (
            filtered.map((task) => (
              <TaskRow
                key={task._id}
                task={task}
                onToggle={handleToggle}
                onEdit={(t) => setModal({ mode: "edit", task: t })}
                onDelete={() => setDeleteTarget(task._id)}
              />
            ))
          )}
        </div>

        {filtered.length > 0 && (
          <p className="text-xs text-gray-300 text-center mt-6">
            Showing {filtered.length} of {total} tasks
          </p>
        )}
      </div>

      {/* Modals */}
      {modal && (
        <TaskModal
          mode={modal.mode}
          task={modal.task}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
      {deleteTarget && (
        <DeleteConfirm
          task={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}