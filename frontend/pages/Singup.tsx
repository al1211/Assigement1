import React, { useState } from "react";
import { api } from "../api/axios";
import Spinner from "../components/UI/Spinner";
import { useNavigate } from "react-router";

type Role = "user" | "admin";
interface FormData {
  name: string;
  email: string;
  password: string;
  role: Role
}

export default function Signup() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [focused, setFocused] = useState<string>("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post("/v1/auth/singup", formData);
      if (response) {
        alert(response.data.message);
      }
      setLoading(false);
      console.log(response);
      navigate("/login")
    } catch (err: any) {
      console.error(err?.response?.data?.error?.details[0].message);
      setError(err?.response?.data?.error?.details[0].message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const inputBase =
    "w-full bg-slate-50 border text-slate-800 text-sm rounded-xl px-4 py-3 pl-11 placeholder-slate-300 transition-all duration-200 focus:outline-none focus:bg-white";
  const inputFocus = (field: string) =>
    focused === field
      ? "border-violet-400 ring-2 ring-violet-100 shadow-sm"
      : "border-slate-200 hover:border-slate-300";

  return (
    <>


      <div className="signup-root min-h-screen  flex items-center justify-center p-4 relative overflow-hidden">


        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="card-animate w-full max-w-md relative z-10">
          {/* Card */}
          <div className="bg-white/6 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/40">

            {/* Logo mark */}
            <div className="flex justify-center mb-7">
              <div className="w-14 h-14 bg-linear-to-br from-violet-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-1.5 tracking-tight">
                Create your account
              </h2>
              <p className="text-black text-sm">
                Join us today — it's completely free
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-5 flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 5a7 7 0 100 14A7 7 0 0012 5z" />
                </svg>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-gray-900 uppercase tracking-widest mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className={`w-4 h-4 transition-colors ${focused === "name" ? "text-violet-400" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused("")}
                    required
                    className={`${inputBase} ${inputFocus("name")}`}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-gray-900 uppercase tracking-widest mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className={`w-4 h-4 transition-colors ${focused === "email" ? "text-violet-400" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    name="email"
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused("")}
                    required
                    className={`${inputBase} ${inputFocus("email")}`}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-gray-900 uppercase tracking-widest mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className={`w-4 h-4 transition-colors ${focused === "password" ? "text-violet-400" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Min. 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused("")}
                    required
                    className={`${inputBase} pr-11 ${inputFocus("password")}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.02 0 2 .16 2.92.46M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {/* Password strength dots */}
                {formData.password.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${formData.password.length >= i * 2
                            ? formData.password.length < 5
                              ? "bg-red-400"
                              : formData.password.length < 8
                                ? "bg-amber-400"
                                : "bg-emerald-400"
                            : "bg-slate-200"
                          }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-medium text-gray-900 uppercase tracking-widest mb-1.5">
                  Select Role
                </label>

                <div className="relative">
                     <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className={`w-4 h-4 transition-colors ${focused === "name" ? "text-violet-400" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    onFocus={() => setFocused("role")}
                    onBlur={() => setFocused("")}
                    required
                    className={`${inputBase} ${inputFocus("role")} appearance-none`}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-linear-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-sm"
              >
                {loading ? (
                  <Spinner color="white" size={20} />
                ) : (
                  <>
                    Create Account
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>

          

         

            {/* Login link */}
            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-violet-400 font-medium cursor-pointer hover:text-violet-300 transition-colors"
              >
                Sign in
              </span>
            </p>
          </div>

          {/* Bottom note */}
          <p className="text-center text-xs text-slate-600 mt-4">
            By creating an account, you agree to our{" "}
            <span className="text-slate-400 cursor-pointer hover:text-slate-300">Terms</span> &{" "}
            <span className="text-slate-400 cursor-pointer hover:text-slate-300">Privacy Policy</span>
          </p>
        </div>
      </div>
    </>
  );
}