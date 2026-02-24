import React from "react";
import  type {  ChangeEvent, FocusEvent } from "react";
import { useState } from "react";
import { api } from "../api/axios";

// Types
interface TaskValues {
  title: string;
  description: string;
  complete: boolean;
}

interface TaskErrors {
  title?: string;
  description?: string;
}

// Validation function
function validate(values: TaskValues): TaskErrors {
  const errors: TaskErrors = {};
  const title = values.title.trim();
  const desc = values.description.trim();

  if (title.length === 0) errors.title = "Title is required";
  else if (title.length < 3) errors.title = "Title must be at least 3 characters";
  else if (title.length > 100) errors.title = "Title cannot exceed 100 characters";

  if (desc.length > 500) errors.description = "Description cannot exceed 500 characters";

  return errors;
}

// Component
export default function AddProduct() {
  const [values, setValues] = useState<TaskValues>({
    title: "",
    description: "",
    complete: false,
  });
  const [errors, setErrors] = useState<TaskErrors>({});
  const [touched, setTouched] = useState<{ [K in keyof TaskValues]?: boolean }>({});
  const [submitted, setSubmitted] = useState(false);

  // Handle input changes
  const handleChange = (field: keyof TaskValues, val: string | boolean) => {
    const next = { ...values, [field]: val };
    setValues(next);
    if (touched[field]) setErrors(validate(next));
  };

  // Handle blur for validation
  const handleBlur = (field: keyof TaskValues) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(values));
  };

  // Handle form submission
  const handleSubmit = async() => {
    try{

  const response = await api.post("/v1/task/create",values)
  if(response ){
    alert("task create succesfull");
  }
  const err = "something";
  setErrors(err);
    }catch(err){
      console.error(err);
    }
    
  };

  const titleLen = values.title.length;
  const descLen = values.description.length;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          {/* Header */}
          <div className="mb-8">
            <span className="text-xs font-semibold tracking-widest text-indigo-500 uppercase">
              Task Manager
            </span>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">Create a New Task</h1>
            <p className="mt-1 text-sm text-gray-400">Fill in the details below to add a task.</p>
          </div>

          {/* Title Field */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Title <span className="text-red-400">*</span>
              </label>
              <span
                className={`text-xs tabular-nums ${
                  titleLen > 90 ? (titleLen > 100 ? "text-red-500" : "text-amber-500") : "text-gray-300"
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

          {/* Description Field */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Description
              </label>
              <span
                className={`text-xs tabular-nums ${
                  descLen > 450 ? (descLen > 500 ? "text-red-500" : "text-amber-500") : "text-gray-300"
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

          {/* Divider */}
          <div className="border-t border-gray-100 my-6" />

          {/* Complete Toggle */}
          <div
            className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 mb-7 cursor-pointer hover:border-indigo-300 transition select-none"
            onClick={() => handleChange("complete", !values.complete)}
          >
            <div>
              <p className="text-sm font-medium text-gray-700">Mark as complete</p>
              <p className="text-xs text-gray-400 mt-0.5">Task will be created in a completed state</p>
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

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={submitted}
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl py-3.5 transition-all duration-150 shadow-sm hover:shadow-indigo-200 hover:shadow-md"
          >
            {submitted ? "✓ Task Created!" : "Create Task"}
          </button>

          {/* Success Message */}
          {submitted && (
            <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-600 text-center animate-pulse">
              Task has been created successfully!
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