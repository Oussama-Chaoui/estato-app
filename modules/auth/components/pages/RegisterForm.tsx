"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useAuth, { RegisterInput } from "@/modules/auth/hooks/api/useAuth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import * as Yup from "yup";
import Routes from "@/common/defs/routes";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useState } from "react";

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterForm = () => {
  const { register: registerUser } = useAuth();

  const schema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Please confirm your password"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(schema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = async (data: RegisterFormValues) => {
    await registerUser(
      {
        name: data.name,
        email: data.email,
        password: data.password
      } as RegisterInput,
      { displayProgress: true, displaySuccess: true }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-[#faf8f5]"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="relative w-full max-w-lg px-8 py-12 space-y-10 bg-white/95 backdrop-blur-lg rounded-xl shadow-soft-xl transition-all duration-300 hover:shadow-soft-2xl"
        style={{
          boxShadow: "0 8px 32px rgba(184, 142, 47, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <div className="space-y-10">
          {/* Header */}
          <div className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="inline-block p-4 rounded-full bg-primaryLight/50"
            >
              <svg
                className="w-12 h-12 text-primarySite/80"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </motion.div>
            <h1 className="text-3xl font-light text-gray-700">Create Account</h1>
            <p className="text-gray-400 font-light">Sign up to get started</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              {...register("name")}
              label="Name"
              startAdornment={<User className="w-4 h-4 text-muted-foreground" />}
              error={errors.name?.message}
              className="h-12 rounded-xl text-base"
            />

            <Input
              {...register("email")}
              label="Email"
              startAdornment={<Mail className="w-4 h-4 text-muted-foreground" />}
              error={errors.email?.message}
              className="h-12 rounded-xl text-base"
            />

            <Input
              {...register("password")}
              label="Password"
              type={showPassword ? "text" : "password"}
              startAdornment={<Lock className="w-4 h-4 text-muted-foreground" />}
              endAdornment={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="p-1 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              error={errors.password?.message}
              className="h-12 rounded-xl text-base"
            />

            <Input
              {...register("confirmPassword")}
              label="Confirm Password"
              type={showConfirm ? "text" : "password"}
              startAdornment={<Lock className="w-4 h-4 text-muted-foreground" />}
              endAdornment={
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="p-1 text-muted-foreground hover:text-foreground"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              error={errors.confirmPassword?.message}
              className="h-12 rounded-xl text-base"
            />

            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-primarySite hover:bg-primarySite/90 text-white text-base font-medium shadow-sm hover:shadow-md transition-all"
              disabled={isSubmitting}
            >
              Sign up
              {isSubmitting ? (
                <motion.span
                  className="ml-2"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  ↻
                </motion.span>
              ) : (
                <ArrowRight className="ml-2 w-4 h-4" />
              )}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="flex flex-col gap-2 mt-8">
            <p className="text-center text-sm text-muted-foreground/90">
              Already have an account?{" "}
              <Link
                href={Routes.Auth.Login}
                className="text-primarySite font-medium hover:text-primarySite/90 inline-flex items-center gap-1"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default RegisterForm;
