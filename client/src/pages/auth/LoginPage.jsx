// src/pages/auth/LoginPage.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, ShieldCheck, Lock, Mail } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

// ── Unique IMS Logo SVG ───────────────────────
const ImsLogo = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lg1" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1e40af" />
        <stop offset="100%" stopColor="#4f46e5" />
      </linearGradient>
    </defs>
    <rect width="56" height="56" rx="16" fill="url(#lg1)" />
    {/* Roof / triangle */}
    <path d="M28 10L46 22H10L28 10Z" fill="white" fillOpacity="0.95" />
    {/* Building body */}
    <rect x="14" y="22" width="28" height="22" rx="2" fill="white" fillOpacity="0.85" />
    {/* Door */}
    <rect x="23" y="32" width="10" height="12" rx="2" fill="url(#lg1)" />
    {/* Windows */}
    <rect x="17" y="26" width="6" height="5" rx="1" fill="url(#lg1)" fillOpacity="0.7" />
    <rect x="33" y="26" width="6" height="5" rx="1" fill="url(#lg1)" fillOpacity="0.7" />
    {/* Barcode bottom accent */}
    <rect x="10" y="46" width="4" height="3" rx="0.5" fill="white" fillOpacity="0.5" />
    <rect x="16" y="46" width="2" height="3" rx="0.5" fill="white" fillOpacity="0.5" />
    <rect x="20" y="46" width="6" height="3" rx="0.5" fill="white" fillOpacity="0.5" />
    <rect x="28" y="46" width="2" height="3" rx="0.5" fill="white" fillOpacity="0.5" />
    <rect x="32" y="46" width="4" height="3" rx="0.5" fill="white" fillOpacity="0.5" />
    <rect x="38" y="46" width="2" height="3" rx="0.5" fill="white" fillOpacity="0.5" />
    <rect x="42" y="46" width="4" height="3" rx="0.5" fill="white" fillOpacity="0.5" />
  </svg>
);

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data);
      toast.success("Welcome back!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1920&q=80')`,
        }}
      />
      {/* Blur + dark overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-br from-[#020b56]/88 via-[#020b56]/72 to-indigo-900/82" />

      {/* Animated circles */}
      {[
        { size: 300, x: "-10%", y: "10%", delay: 0 },
        { size: 200, x: "80%", y: "5%", delay: 1 },
        { size: 150, x: "70%", y: "70%", delay: 2 },
        { size: 250, x: "5%", y: "60%", delay: 1.5 },
      ].map((c, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-white/5 bg-white/3"
          style={{ width: c.size, height: c.size, left: c.x, top: c.y }}
          animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: c.delay }}
        />
      ))}

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          {/* Top gradient bar */}
          <div className="h-1.5 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500" />

          <div className="p-8 sm:p-10">
            {/* Logo section */}
            <div className="flex flex-col items-center mb-8">
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 180 }}
                className="relative mb-4"
              >
                <ImsLogo size={68} />
                <div className="absolute inset-0 rounded-2xl bg-blue-500/25 blur-2xl -z-10 scale-150" />
              </motion.div>

              <h1 className="text-2xl font-bold text-white tracking-tight text-center">
                Smart Asset IMS
              </h1>
              <p className="text-blue-200/75 text-sm mt-1 text-center">
                College Inventory Management System
              </p>

              <div className="flex items-center gap-3 mt-5 w-full">
                <div className="flex-1 h-px bg-white/10" />
                <ShieldCheck className="w-4 h-4 text-blue-300/50 flex-shrink-0" />
                <div className="flex-1 h-px bg-white/10" />
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-blue-100/90 mb-1.5">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/60 group-focus-within:text-blue-300 transition-colors" />
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="admin@smartasset.com"
                    disabled={isLoading}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm
                      bg-white/8 border text-white placeholder-blue-300/40
                      focus:outline-none focus:ring-2 focus:ring-blue-400/70 focus:border-transparent
                      hover:bg-white/12 hover:border-blue-400/40
                      transition-all duration-200
                      ${errors.email ? "border-red-400/60 bg-red-500/5" : "border-white/15"}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-300 text-xs mt-1.5">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-blue-100/90 mb-1.5">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/60 group-focus-within:text-blue-300 transition-colors" />
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className={`w-full pl-10 pr-12 py-3 rounded-xl text-sm
                      bg-white/8 border text-white placeholder-blue-300/40
                      focus:outline-none focus:ring-2 focus:ring-blue-400/70 focus:border-transparent
                      hover:bg-white/12 hover:border-blue-400/40
                      transition-all duration-200
                      ${errors.password ? "border-red-400/60 bg-red-500/5" : "border-white/15"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-300/60 hover:text-white transition-colors p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-300 text-xs mt-1.5">{errors.password.message}</p>
                )}
              </div>

              {/* Forgot */}
              <div className="flex justify-end -mt-1">
                <Link to="/forgot-password"
                  className="text-xs text-blue-300/80 hover:text-white transition-colors font-medium">
                  Forgot password?
                </Link>
              </div>

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl font-bold text-sm
                  bg-gradient-to-r from-blue-500 to-indigo-600
                  hover:from-blue-400 hover:to-indigo-500
                  text-white shadow-lg shadow-blue-500/25
                  hover:shadow-blue-500/40 hover:shadow-xl
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-blue-400
                  disabled:opacity-60 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2"
              >
                {isLoading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
                  : "Sign In"}
              </motion.button>
            </form>

            {/* Credentials hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6 p-4 bg-white/5 border border-white/10 rounded-2xl"
            >
              <p className="text-xs text-blue-200/80 font-semibold mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Default Admin Credentials
              </p>
              <div className="space-y-1">
                <p className="text-xs text-blue-300/70 font-mono">📧 admin@smartasset.com</p>
                <p className="text-xs text-blue-300/70 font-mono">🔑 Admin@123</p>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="px-8 py-3.5 border-t border-white/10 bg-black/10">
            <p className="text-center text-xs text-blue-300/40 font-medium">
              Smart Asset IMS © 2024 · Secure Access
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
