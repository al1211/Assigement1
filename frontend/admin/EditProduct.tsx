import React from "react";

import type  {  ChangeEvent } from "react";
import { useState } from "react";

// Task type
interface Task {
  id: string;
  title: string;
  description?: string;
  complete: boolean;
}

// Form errors type
interface TaskErrors {
  title?: string;
  description?: string;
}

// Props type
interface EditTaskFormProps {
  task?: Task;
  onSave?: (updatedTask: Task) => void;
  onCancel?: () => void;
}

// Mock existing task (fallback)
const existingTask: Task = {
  id: "task-001",
  title: "Design new landing page",
  description: "Create a modern and responsive landing page for the product launch campaign.",
  complete: false,
};

// Validation function
function validate(values: Task): TaskErrors {
  const errors: TaskErrors = {};
  const title = values.title.trim();
  const desc = values.description?.trim() || "";

  if (title.length === 0) errors.title = "Title is required";
  else if (title.length < 3) errors.title = "Title must be at least 3 characters";
  else if (title.length > 100) errors.title = "Title cannot exceed 100 characters";

  if (desc.length > 500) errors.description = "Description cannot exceed 500 characters";

  return errors;
}

export default function EditTaskForm({
  task = existingTask,
  onSave,
  onCancel,
}: EditTaskFormProps) {
  const [values, setValues] = useState<Task>({
    title: task.title,
    description: task.description || "",
    complete: task.complete,
    id: task.id,
  });

  const [errors, setErrors] = useState<TaskErrors>({});
  const [touched, setTouched] = useState<{ [K in keyof Task]?: boolean }>({});
  const [saved, setSaved] = useState(false);

  const isDirty =
    values.title !== task.title ||
    values.description !== (task.description || "") ||
    values.complete !== task.complete;

  const handleChange = (field: keyof Task, val: string | boolean) => {
    const next = { ...values, [field]: val };
    setValues(next);
    if (touched[field]) setErrors(validate(next));
  };

  const handleBlur = (field: keyof Task) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(values));
  };

  const handleReset = () => {
    setValues({
      title: task.title,
      description: task.description || "",
      complete: task.complete,
      id: task.id,
    });
    setErrors({});
    setTouched({});
  };

  const handleSubmit = async() => {
    setTouched({ title: true, description: true });
    const errs = validate(values);
    setErrors(errs);
   
  };

  const titleLen = values.title.length;
  const descLen = values.description?.length || 0;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-lg">

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">

          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <span className="text-xs font-semibold tracking-widest text-indigo-500 uppercase">
                Task Manager
              </span>
              <h1 className="mt-1 text-2xl font-bold text-gray-900">Edit Task</h1>
              <p className="mt-1 text-sm text-gray-400">
                Update the details and save your changes.
              </p>
            </div>
            <span className="text-xs text-gray-300 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1 font-mono mt-1">
              #{task.id}
            </span>
          </div>

          {/* Changed indicator */}
          {isDirty && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-5 text-xs text-amber-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
              You have unsaved changes
            </div>
          )}

          {/* Title Field */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Title <span className="text-red-400">*</span>
              </label>
              <span
                className={`text-xs tabular-nums ${
                  titleLen > 90
                    ? titleLen > 100
                      ? "text-red-500"
                      : "text-amber-500"
                    : "text-gray-300"
                }`}
              >
                {titleLen}/100
              </span>
            </div>
            <input
              type="text"
              placeholder="e.g. Design new landing page"
              value={values.title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("title", e.target.value)}
              onBlur={() => handleBlur("title")}
              maxLength={120}
              className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-800 placeholder-gray-300 outline-none transition focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 ${
                touched.title && errors.title
                  ? "border-red-400 ring-2 ring-red-100"
                  : values.title !== task.title
                  ? "border-indigo-300 bg-indigo-50/30"
                  : "border-gray-200"
              }`}
            />
            {touched.title && errors.title && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Description
              </label>
              <span
                className={`text-xs tabular-nums ${
                  descLen > 450
                    ? descLen > 500
                      ? "text-red-500"
                      : "text-amber-500"
                    : "text-gray-300"
                }`}
              >
                {descLen}/500
              </span>
            </div>
            <textarea
              rows={4}
              placeholder="Add more details about this task..."
              value={values.description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleChange("description", e.target.value)}
              onBlur={() => handleBlur("description")}
              maxLength={520}
              className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-800 placeholder-gray-300 outline-none resize-none transition focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 ${
                touched.description && errors.description
                  ? "border-red-400 ring-2 ring-red-100"
                  : values.description !== (task.description || "")
                  ? "border-indigo-300 bg-indigo-50/30"
                  : "border-gray-200"
              }`}
            />
            {touched.description && errors.description && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-6" />

          {/* Complete Toggle */}
          <div
            className={`flex items-center justify-between border rounded-xl px-4 py-3.5 mb-7 cursor-pointer transition select-none ${
              values.complete !== task.complete
                ? "bg-indigo-50/40 border-indigo-300"
                : "bg-gray-50 border-gray-200 hover:border-indigo-300"
            }`}
            onClick={() => handleChange("complete", !values.complete)}
          >
            <div>
              <p className="text-sm font-medium text-gray-700">Mark as complete</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {values.complete ? "This task is marked as done" : "This task is still in progress"}
              </p>
            </div>
            <div
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                values.complete ? "bg-indigo-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                  values.complete ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              disabled={!isDirty}
              className="flex-1 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 font-semibold text-sm rounded-xl py-3.5 transition-all duration-150"
            >
              Reset
            </button>

            <button
              onClick={handleSubmit}
              disabled={saved || !isDirty}
              className="flex-[2] bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl py-3.5 transition-all duration-150 shadow-sm hover:shadow-indigo-200 hover:shadow-md"
            >
              {saved ? "✓ Changes Saved!" : "Save Changes"}
            </button>
          </div>

          {/* Success Message */}
          {saved && (
            <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-600 text-center">
              Task updated successfully!
            </div>
          )}
        </div>

        {/* Footer hint */}
        <p className="text-center text-xs text-gray-300 mt-4">
          Fields marked with <span className="text-red-400">*</span> are required
        </p>
      </div>
    </div>
  );
}