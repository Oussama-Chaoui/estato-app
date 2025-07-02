"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import type { ObjectSchema } from "yup";
import { parsePhoneNumberFromString } from "libphonenumber-js/max";
import useAuth, { RegisterInput } from "@/modules/auth/hooks/api/useAuth";
import Routes from "@/common/defs/routes";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Phone,
  Info
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput, Country, countries } from "@/components/ui/phone-input";
import { Any } from "@/common/defs/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string | null;
};

const PasswordField = ({
  label,
  registerProps,
  error,
}: {
  label: string;
  registerProps: Any;
  error?: string;
}) => {
  const [show, setShow] = useState(false);
  return (
    <Input
      {...registerProps}
      label={label}
      type={show ? "text" : "password"}
      startAdornment={<Lock className="w-4 h-4 text-muted-foreground" />}
      endAdornment={
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="p-1 text-muted-foreground hover:text-foreground"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      }
      error={error}
      className="h-12 rounded-xl"
    />
  );
}

const RegisterForm = () => {
  const { register: doRegister } = useAuth();
  const [country, setCountry] = useState<Country>(countries[0]);

  const schema: ObjectSchema<FormValues> = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm your password"),
    phone: Yup.string()
      .notRequired()
      .test(
        "is-valid-phone",
        `Invalid phone number for ${country.name}`,
        (local) => {
          if (!local) return true;
          const full = `${country.dialCode}${local}`;
          const parsed = parsePhoneNumberFromString(full);
          return parsed?.isValid() ?? false;
        }
      ),
  });

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: ""
    }
  });

  const onSubmit = async (data: FormValues) => {
    const fullPhone = data.phone
      ? `${country.dialCode}${data.phone}`
      : undefined;

    const payload: RegisterInput = {
      name: data.name,
      email: data.email,
      password: data.password,
      phone: fullPhone,
    };

    await doRegister(payload, {
      displayProgress: true,
      displaySuccess: true,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex items-center justify-center bg-[#faf8f5]"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative w-full max-w-lg px-8 py-12 space-y-10 bg-white/95 backdrop-blur-lg rounded-xl shadow-soft-xl"
      >
        {/* HEADER */}
        <div className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 110 }}
            className="inline-block p-4 rounded-full bg-primaryLight/50"
          >
            <Lock className="w-10 h-10 text-primarySite/80" />
          </motion.div>
          <h1 className="text-3xl font-light text-gray-700">Create account</h1>
          <p className="text-gray-400">Sign up to get started</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            {...register("name")}
            label="Name"
            startAdornment={<User className="w-4 h-4 text-muted-foreground" />}
            error={errors.name?.message}
            className="h-12 rounded-xl"
          />

          <Input
            {...register("email")}
            label="Email"
            startAdornment={<Mail className="w-4 h-4 text-muted-foreground" />}
            error={errors.email?.message}
            className="h-12 rounded-xl"
          />

          <PasswordField
            label="Password"
            registerProps={register("password")}
            error={errors.password?.message}
          />

          <PasswordField
            label="Confirm password"
            registerProps={register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <div className="space-y-1">
                <div className="flex items-center gap-1 mb-1">
                  <PhoneInput
                    {...field}
                    value={field.value ?? ""}
                    selectedCountry={country}
                    onCountryChange={(c: Country) => setCountry(c)}
                    error={errors.phone?.message}
                  />
                  <TooltipProvider>
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger type="button" className="focus:outline-none">
                        <Info className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[260px]">
                        <p className="text-sm text-center">
                          Phone number is optional for registration, but will be required
                          when making reservations or submitting inquiries.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-xl bg-primarySite hover:bg-primarySite/90 text-white font-medium"
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
              <ArrowRight className="w-4 h-4 ml-2" />
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground/90">
          Already have an account?{" "}
          <Link
            href={Routes.Auth.Login}
            className="text-primarySite font-medium hover:text-primarySite/90"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default RegisterForm;
