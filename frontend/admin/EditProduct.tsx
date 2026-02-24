"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { api } from "../api/axios";
// import { api } from "../api/axios";

// ── Mock data — replace with real API fetch ──────────────────────────────────
const mockProduct = {
  _id: "1",
  title: "Wireless Headphones Pro",
  description: "Premium noise-cancelling over-ear headphones with 30-hour battery life and multi-device pairing support.",
  price: 129.99,
  category: "Electronics",
  image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
  stock: 42,
};

const CATEGORIES = [
  "Electronics", "Clothing", "Home & Garden",
  "Sports", "Books", "Toys", "Beauty", "Automotive", "Other",
];

interface ProductForm {
  _id:number,
  title: string;
  description: string;
  price: string;
  category: string;
  image: string;
  stock: number;
}

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<ProductForm>({
    _id:0,
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: 0,
  });

  const [originalForm, setOriginalForm] = useState<ProductForm | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focused, setFocused] = useState<string>("");
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(()=>{
     const fetchProducts=async()=>{
       try{
         setFetching(true)
         const respnse=await api.get("/product/get");
         const product =  respnse.data.find((p:any)=>p._id===id)
           setForm(product)
           setFetching(false);
      }catch(err){
          console.error(err);
      }
     }
     fetchProducts();
  },[])
 

  const isDirty = JSON.stringify(form) !== JSON.stringify(originalForm);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      newErrors.price = "Enter a valid price";
    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "image") setPreview(value);
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleStockChange = (delta: number) => {
    setForm((prev) => ({ ...prev, stock: Math.max(0, prev.stock + delta) }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
        setLoading(true);

await api.put(`/product/${id}`,{...form , price:Number(form.price)})
    setLoading(false);
    setSaved(true);
      navigate("/admin/product/list")
    }catch(err){
       console.error(err);
       setLoading(false);
    }
  
  };

  const handleReset = () => {
    if (originalForm) {
      setForm(originalForm);
      setPreview(originalForm.image);
      setErrors({});
    }
  };
 console.log(form);
  const inputBase =
    "w-full bg-white/[0.06] border  text-slate-600 text-sm rounded-xl px-4 py-3 placeholder-slate-600 transition-all duration-200 focus:outline-none focus:bg-white/[0.08]";
  const inputFocus = (field: string) =>
    focused === field
      ? "border-violet-400 ring-2 ring-violet-500/20"
      : errors[field]
      ? "border-red-500/50 ring-2 ring-red-500/10"
      : "border-white/10 hover:border-white/20";

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (fetching) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap'); .ep-root * { font-family: 'Sora', sans-serif; } @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.8} } .skeleton { animation: pulse 1.5s ease-in-out infinite; background: rgba(255,255,255,0.07); border-radius: 12px; }`}</style>
        <div className="ep-root min-h-screen  p-6 flex items-center justify-center">
          <div className="w-full max-w-5xl space-y-5">
            <div className="skeleton h-8 w-48" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3].map((i) => <div key={i} className="skeleton h-28" />)}
              </div>
              <div className="space-y-4">
                {[1, 2].map((i) => <div key={i} className="skeleton h-44" />)}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
     

      <div className="ep-root min-h-screen relative overflow-hidden">

        {/* Background blobs */}
        <div className="blob absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="blob2 absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "48px 48px" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-8 fade-up">

          {/* Top bar */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-white/[0.06] border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-white tracking-tight">Edit Product</h1>
              <p className="text-slate-500 text-xs mt-0.5">ID: {id || mockProduct._id}</p>
            </div>

            {/* Unsaved indicator */}
            {isDirty && !saved && (
              <span className="slide-down ml-auto inline-flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Unsaved changes
              </span>
            )}

            {/* Saved confirmation */}
            {saved && (
              <span className="slide-down ml-auto inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Saved successfully
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Left column ─────────────────────────────────────────────── */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Title */}
              <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  Product Title <span className="text-red-400">*</span>
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  onFocus={() => setFocused("title")}
                  onBlur={() => setFocused("")}
                  placeholder="e.g. Wireless Noise-Cancelling Headphones"
                  className={`${inputBase} ${inputFocus("title")}`}
                />
                {errors.title && <p className="text-red-400 text-xs mt-1.5">{errors.title}</p>}
              </div>

              {/* Description */}
              <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  onFocus={() => setFocused("description")}
                  onBlur={() => setFocused("")}
                  placeholder="Describe your product — features, materials, use cases..."
                  rows={5}
                  className={`${inputBase} ${inputFocus("description")}`}
                />
                <p className="text-right text-xs text-slate-600 mt-1">{form.description} chars</p>
              </div>

              {/* Price + Category */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    Price (USD) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">$</span>
                    <input
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={handleChange}
                      onFocus={() => setFocused("price")}
                      onBlur={() => setFocused("")}
                      placeholder="0.00"
                      className={`${inputBase} pl-7 ${inputFocus("price")}`}
                    />
                  </div>
                  {errors.price && <p className="text-red-400 text-xs mt-1.5">{errors.price}</p>}
                </div>

                <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={`${inputBase} ${inputFocus("category")} appearance-none cursor-pointer`}
                  >
                    <option value="" className="bg-slate-900">Select category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-slate-900">{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Danger zone */}
              <div className="bg-red-500/[0.04] border border-red-500/20 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-red-400 mb-1">Danger Zone</h3>
                <p className="text-xs text-slate-500 mb-4">Permanently delete this product. This action cannot be undone.</p>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/20 transition"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Product
                </button>
              </div>
            </div>

            {/* ── Right column ────────────────────────────────────────────── */}
            <div className="flex flex-col gap-5">

              {/* Image */}
              <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  Image URL
                </label>
                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  onFocus={() => setFocused("image")}
                  onBlur={() => setFocused("")}
                  placeholder="https://..."
                  className={`${inputBase} ${inputFocus("image")}`}
                />

                {/* Preview */}
                <div className="mt-3 w-full h-44 rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.07] flex items-center justify-center relative group">
                  {preview ? (
                    <>
                      <img
                        src={preview}
                        alt="preview"
                        className="w-full h-full object-cover"
                        onError={() => setPreview("")}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <span className="text-xs text-white font-medium">Image Preview</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <svg className="w-8 h-8 text-slate-700 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-xs text-slate-600">No image</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Stock stepper */}
              <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
                  Stock Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleStockChange(-1)}
                    className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 text-slate-300 text-xl font-bold hover:bg-white/10 transition flex items-center justify-center"
                  >
                    −
                  </button>
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm((p) => ({ ...p, stock: Math.max(0, Number(e.target.value)) }))}
                    className="flex-1 text-center bg-white/[0.06] border border-white/10 rounded-xl py-2.5 text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                  />
                  <button
                    type="button"
                    onClick={() => handleStockChange(1)}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-white text-xl font-bold hover:opacity-90 transition flex items-center justify-center"
                  >
                    +
                  </button>
                </div>

                {/* Stock status pill */}
                <div className="mt-3 flex justify-center">
                  {form.stock === 0 ? (
                    <span className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full">Out of Stock</span>
                  ) : form.stock <= 10 ? (
                    <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">Low Stock</span>
                  ) : (
                    <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">In Stock</span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <button
                type="submit"
                disabled={loading || !isDirty}
                className="w-full bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={!isDirty}
                className="w-full bg-white/[0.04] border border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/[0.08] font-medium py-3 rounded-xl transition text-sm disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Discard Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProduct;