"use client";

import React, { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useNavigate } from "react-router";

// ── Mock data matching the Product mongoose schema ──────────────────────────
const mockProducts = [
  { _id: "1", title: "Wireless Headphones Pro", description: "Noise-cancelling over-ear headphones", price: 129.99, category: "Electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop", stock: 42 },
  { _id: "2", title: "Running Sneakers X1", description: "Lightweight performance running shoes", price: 89.5, category: "Sports", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop", stock: 0 },
  { _id: "3", title: "Ceramic Coffee Mug", description: "Handcrafted 350ml ceramic mug", price: 18.0, category: "Home & Garden", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=80&h=80&fit=crop", stock: 120 },
  { _id: "4", title: "Slim Fit Chino Pants", description: "Cotton blend stretch chinos", price: 54.99, category: "Clothing", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=80&h=80&fit=crop", stock: 8 },
  { _id: "5", title: "JavaScript: The Good Parts", description: "Essential JS programming book", price: 29.99, category: "Books", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=80&h=80&fit=crop", stock: 35 },
  { _id: "6", title: "Mechanical Keyboard TKL", description: "Tenkeyless RGB mechanical keyboard", price: 149.0, category: "Electronics", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=80&h=80&fit=crop", stock: 15 },
  { _id: "7", title: "Yoga Mat Premium", description: "6mm non-slip eco-friendly yoga mat", price: 39.0, category: "Sports", image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=80&h=80&fit=crop", stock: 0 },
  { _id: "8", title: "Vitamin C Serum", description: "Brightening 20% Vitamin C facial serum", price: 24.99, category: "Beauty", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=80&h=80&fit=crop", stock: 67 },
];

const CATEGORIES = ["All", "Electronics", "Sports", "Home & Garden", "Clothing", "Books", "Beauty", "Automotive", "Other"];


interface Products{
  _id:number,
  title:string,
  description:string,
  price:number,
  category:string,
  image:string,
  stock:number
}

const StockBadge = ({ stock }: { stock: number }) => {
  if (stock === 0)
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">Out of Stock</span>;
  if (stock <= 10)
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">Low · {stock}</span>;
  return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">In Stock · {stock}</span>;
};

const ProductList = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"title" | "price" | "stock">("title");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [products,setProducts]=useState<Products[]>([])
  const PER_PAGE = 6;

  const navigate=useNavigate();

  // Filter + sort
  const filtered = mockProducts
    .filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || p.category === category;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortBy === "price") return (a.price - b.price) * dir;
      if (sortBy === "stock") return (a.stock - b.stock) * dir;
      return a.title.localeCompare(b.title) * dir;
    });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleSort = (col: "title" | "price" | "stock") => {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(col); setSortDir("asc"); }
    setPage(1);
  };

  const toggleSelect = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const toggleAll = () =>
    setSelected(selected.length === paginated.length ? [] : paginated.map((p) => p._id));

  const SortIcon = ({ col }: { col: string }) => (
    <svg className={`w-3 h-3 ml-1 inline-block transition-transform ${sortBy === col && sortDir === "desc" ? "rotate-180" : ""} ${sortBy === col ? "text-violet-400" : "text-slate-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  );
  const handleNavigate=(id:number)=>{
          navigate(`/admin/product/edit/${id}`)
  }

  const handleDelete=(e:number)=>{
    try{

    }catch(err){
      
    }
  }
  useEffect(()=>{
   const fetchProducts=async()=>{
     try{
       const respnse=await api.get("/product/get");
      setProducts(respnse.data);
    }catch(err){
        console.error(err);
    }
   }
   fetchProducts();
  },[])

  return (
    <>
     

      <div className="pl-root min-h-screen  p-6 relative overflow-hidden">

        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "48px 48px" }} />

        <div className="relative z-10 max-w-7xl mx-auto fade-up">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-white tracking-tight">Products</h1>
              <p className="text-slate-400 text-sm mt-0.5">{products.length} products found</p>
            </div>
            <button className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg shadow-violet-500/20 transition-all active:scale-95">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            {/* Search */}
            <div className="relative flex-1">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition"
              />
            </div>

            {/* Category filter */}
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition appearance-none cursor-pointer min-w-[160px]"
            >
              {CATEGORIES.map((c) => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
            </select>
          </div>

          {/* Bulk action bar */}
          {selected.length > 0 && (
            <div className="mb-4 flex items-center gap-3 bg-violet-500/10 border border-violet-500/20 rounded-xl px-4 py-2.5">
              <span className="text-sm text-violet-300 font-medium">{selected.length} selected</span>
              <div className="flex-1" />
              <button className="text-xs text-red-400 hover:text-red-300 font-medium transition flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete selected
              </button>
              <button onClick={() => setSelected([])} className="text-xs text-slate-400 hover:text-slate-300 transition">Cancel</button>
            </div>
          )}

          {/* Table card */}
          <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/30">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.07]">
                    <th className="px-5 py-4 text-left w-10">
                      <input
                        type="checkbox"
                        checked={selected.length === paginated.length && paginated.length > 0}
                        onChange={toggleAll}
                        className="w-3.5 h-3.5 accent-violet-500 cursor-pointer"
                      />
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-widest">Product</th>
                    <th
                      className="px-5 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-widest cursor-pointer select-none hover:text-slate-300 transition"
                      onClick={() => toggleSort("title")}
                    >
                      Title <SortIcon col="title" />
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-widest">Category</th>
                    <th
                      className="px-5 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-widest cursor-pointer select-none hover:text-slate-300 transition"
                      onClick={() => toggleSort("price")}
                    >
                      Price <SortIcon col="price" />
                    </th>
                    <th
                      className="px-5 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-widest cursor-pointer select-none hover:text-slate-300 transition"
                      onClick={() => toggleSort("stock")}
                    >
                      Stock <SortIcon col="stock" />
                    </th>
                    <th className="px-5 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {false ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-16 text-center">
                        <svg className="w-10 h-10 text-slate-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" />
                        </svg>
                        <p className="text-slate-500 text-sm">No products found</p>
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product._id} className="row-hover">
                        {/* Checkbox */}
                        <td className="px-5 py-4">
                          <input
                            type="checkbox"
                            checked={selected.includes(String(product._id))}
                            onChange={() => toggleSelect(String(product._id))}
                            className="w-3.5 h-3.5 accent-violet-500 cursor-pointer"
                          />
                        </td>
                      

                        {/* Image */}
                        <td className="px-5 py-4">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                           {product.image ? <img
                              src={product.image}
                              alt={product.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23334155'/%3E%3C/svg%3E";
                              }}
                            />:<img src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" className="w-full h-full object-cover"/>}
                          </div>
                        </td>

                        {/* Title + description */}
                        <td className="px-5 py-4 max-w-[220px]">
                          <p className="text-slate-200 font-medium truncate">{product.title}</p>
                          <p className="text-slate-500 text-xs truncate mt-0.5">{product.description}</p>
                        </td>

                        {/* Category */}
                        <td className="px-5 py-4">
                          <span className="inline-block px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-400">
                            {product.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-5 py-4">
                          <span className="text-slate-200 font-semibold">${product.price.toFixed(2)}</span>
                        </td>

                        {/* Stock */}
                        <td className="px-5 py-4">
                          <StockBadge stock={product.stock} />
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                          
                            {/* Edit */}
                            <button className="p-1.5 rounded-lg text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 transition" onClick={()=>handleNavigate( product._id )}>
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            {/* Delete */}
                            <button className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition" onClick={()=>handleDelete(product._id)}>
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-white/[0.07]">
                <p className="text-xs text-slate-500">
                  Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition ${
                        page === n
                          ? "bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-lg shadow-violet-500/25"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {n} 
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Stats footer */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { label: "Total Products", value: mockProducts.length, icon: "M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" },
              { label: "Out of Stock", value: mockProducts.filter((p) => p.stock === 0).length, icon: "M12 9v2m0 4h.01M12 5a7 7 0 100 14A7 7 0 0012 5z" },
              { label: "Low Stock", value: mockProducts.filter((p) => p.stock > 0 && p.stock <= 10).length, icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
            ].map(({ label, value, icon }) => (
              <div key={label} className="bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-violet-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-semibold text-white">{value}</p>
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default ProductList;