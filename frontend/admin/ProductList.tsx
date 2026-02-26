import React, { useEffect } from "react";
import { useState } from "react";
import { api } from "../api/axios";
import { useNavigate } from "react-router"
import TaskRow from "../components/TaskRow"
import DeleteConfirm from "../components/DeleteConfirm"

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Task {
  _id: string;
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




// ─── Icons ────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 14.65z" />
  </svg>
);


export default function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [modal, setModal] = useState<ModalState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null | string>(null);
  const navigate = useNavigate();

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
  

 

  const handleDelete = async () => {
    try {
      const deletetask = await api.delete(`/v1/task/${deleteTarget}`);
      alert("delete task");

    } catch (err) {
      console.error(err);
    }
  }

  const stats: { label: string; value: number; color: string; bg: string }[] = [
    { label: "Total", value: total, color: "text-gray-800", bg: "bg-gray-50 border-gray-200" },
    { label: "Pending", value: pendingCount, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
    { label: "Completed", value: doneCount, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  ];

  useEffect(() => {
    const fetchtask = async () => {
      const res = await api.get("/v1/task/get");
      setTasks(res.data);
    }
    fetchtask();
  }, [deleteTarget])

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
            onClick={() => navigate("/admin/products")}
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