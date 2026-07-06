// src/pages/auth/ResetPasswordPage.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useParams } from "react-router-dom";
import { Package, Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import authService from "@/services/authService";

const schema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  passwordConfirm: z.string().min(1, "Please confirm password"),
}).refine((d) => d.password === d.passwordConfirm, {
  message: "Passwords do not match",
  path: ["passwordConfirm"],
});

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authService.resetPassword(token, data.password);
      setDone(true);
      toast.success("Password reset successful!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-900 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h1>
            <p className="text-gray-500 text-sm mt-1">Enter your new password</p>
          </div>

          {done ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-700 font-medium">Password reset successful!</p>
              <Link to="/login" className="btn-primary mt-6 inline-flex">Go to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="form-label">New Password</label>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPass ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    className={`form-input pr-12 ${errors.password ? "border-red-400" : ""}`}
                  />
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <label className="form-label">Confirm Password</label>
                <input
                  {...register("passwordConfirm")}
                  type="password"
                  placeholder="Repeat your password"
                  className={`form-input ${errors.passwordConfirm ? "border-red-400" : ""}`}
                />
                {errors.passwordConfirm && <p className="text-red-500 text-xs mt-1">{errors.passwordConfirm.message}</p>}
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary w-full py-3">
                {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Resetting...</> : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
