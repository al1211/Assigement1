"use client";

import React,  { useState,  } from "react";
import type {ChangeEvent, FormEvent,} from "react"
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";





interface ProductForm {
  title: string;
  description: string;
  price: string;
  category: string;
  image: string;
  stock: number;
}

interface FormErrors {
  title?: string;
  price?: string;
}

const AddProduct: React.FC = () => {
  const [form, setForm] = useState<ProductForm>({
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: 0,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const navigate = useNavigate();

  const categories: string[] = [
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Sports",
    "Books",
    "Toys",
    "Beauty",
    "Automotive",
    "Other",
  ];

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};


    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) {
      newErrors.price = "Enter a valid price";
    }

    return newErrors;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "stock" ? Number(value) : value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "image") {
      setPreview(value);
    }
  };

  const handleStockChange = (delta: number) => {
    setForm((prev) => ({
      ...prev,
      stock: Math.max(0, prev.stock + delta),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // const validationErrors = validate();
    // if (Object.keys(validationErrors).length > 0) {
    //   setErrors(validationErrors);
    //   return;
    // }

    try {
      setLoading(true);

      await api.post("/product/create", {
        ...form,
        price: Number(form.price),
      });
      alert("product is succesfull created")
      setSubmitted(true);
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      title: "",
      description: "",
      price: "",
      category: "",
      image: "",
      stock: 0,
    });

    setPreview(null);
    setSubmitted(false);
    setErrors({});
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md w-full text-center border border-stone-100">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-stone-800 mb-2" style={{ fontFamily: "'Lora', serif" }}>
            Product Added!
          </h2>
          <p className="text-stone-400 text-sm mb-2">
            <span className="font-semibold text-stone-600">{form.title}</span> has been saved successfully.
          </p>
          {preview && (
            <img
              src={preview}
              alt="product"
              className="w-24 h-24 object-cover rounded-2xl mx-auto my-4 border border-stone-100"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
          <button
            onClick={handleReset}
            className="mt-4 bg-stone-900 text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-stone-700 transition-colors"
          >
            Add Another Product
          </button>
        </div>
      </div>
    );
  }

  return (
    <>

      <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {/* Top bar */}
        <div className="bg-white border-b border-stone-100 px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" />
            </svg>
          </div>
          <span className="text-stone-800 font-semibold text-sm">Product Manager</span>
          <span className="ml-auto text-xs text-stone-400">Dashboard / Products /</span>
          <span className="text-xs text-stone-700 font-medium">Add New</span>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-10">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-stone-900 mb-1" style={{ fontFamily: "'Lora', serif" }}>
              Add New Product
            </h1>
            <p className="text-stone-400 text-sm">Fill in the details below to list a new product in your store.</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column — main fields */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Title */}
              <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
                <label className="block text-xs font-semibold text-stone-400 uppercase tracking-widest mb-2">
                  Product Title <span className="text-red-400">*</span>
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Wireless Noise-Cancelling Headphones"
                  className={`w-full bg-stone-50 border rounded-xl px-4 py-3 text-stone-800 text-sm placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-800 transition ${errors.title ? "border-red-300 bg-red-50" : "border-stone-200"
                    }`}
                />
                {errors.title && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
                <label className="block text-xs font-semibold text-stone-400 uppercase tracking-widest mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe your product — features, materials, use cases..."
                  rows={5}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-800 text-sm placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-800 transition resize-none"
                />
                <p className="text-right text-xs text-stone-300 mt-1">{form.description.length} chars</p>
              </div>

              {/* Price + Category row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
                  <label className="block text-xs font-semibold text-stone-400 uppercase tracking-widest mb-2">
                    Price (USD) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-medium">$</span>
                    <input
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      className={`w-full bg-stone-50 border rounded-xl pl-7 pr-4 py-3 text-stone-800 text-sm placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-800 transition ${errors.price ? "border-red-300 bg-red-50" : "border-stone-200"
                        }`}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-red-400 text-xs mt-1.5">{errors.price}</p>
                  )}
                </div>

                <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
                  <label className="block text-xs font-semibold text-stone-400 uppercase tracking-widest mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-stone-800 transition appearance-none cursor-pointer"
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Right column — image + stock + submit */}
            <div className="flex flex-col gap-5">

              {/* Image */}
              <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
                <label className="block text-xs font-semibold text-stone-400 uppercase tracking-widest mb-2">
                  Image URL
                </label>
                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-800 text-sm placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-800 transition"
                />

                {/* Preview box */}
                <div className="mt-3 w-full h-44 rounded-xl bg-stone-50 border-2 border-dashed border-stone-200 overflow-hidden flex items-center justify-center">
                  {preview ? (
                    <img
                      src={preview}
                      alt="preview"
                      className="w-full h-full object-cover"
                      onError={() => setPreview(null)}
                    />
                  ) : (
                    <div className="text-center">
                      <svg className="w-8 h-8 text-stone-200 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-xs text-stone-300">Image preview</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Stock */}
              <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
                <label className="block text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">
                  Stock Quantity
                </label>
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => handleStockChange(-1)}
                    className="w-10 h-10 rounded-xl bg-stone-100 text-stone-600 text-lg font-bold hover:bg-stone-200 transition flex items-center justify-center"
                  >
                    −
                  </button>
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={handleChange}
                    className="flex-1 text-center bg-stone-50 border border-stone-200 rounded-xl py-3 text-stone-800 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-stone-800"
                  />
                  <button
                    type="button"
                    onClick={() => handleStockChange(1)}
                    className="w-10 h-10 rounded-xl bg-stone-900 text-white text-lg font-bold hover:bg-stone-700 transition flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-stone-300 text-center mt-2">Default: 0 units</p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-stone-900 text-white py-4 rounded-2xl text-sm font-semibold hover:bg-stone-700 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-stone-900/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Product
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="w-full text-stone-400 text-sm py-2 hover:text-stone-600 transition"
              >
                Clear all fields
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProduct;