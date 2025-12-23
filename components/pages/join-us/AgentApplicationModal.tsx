"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Loader2 } from "lucide-react";
import { Poppins } from "next/font/google";
import { cn } from "@/components/lib/utils/twMerge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput, countries, Country } from "@/components/ui/phone-input";
import { useTranslation } from "react-i18next";
import useAgents from "@/modules/agents/hooks/api/useAgents";
import { ApplyAsAgentInput } from "@/modules/agents/hooks/api/useAgents";
import { parsePhoneNumberFromString } from "libphonenumber-js/max";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

interface AgentApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function normalizePhoneToParsed(input: string, dialCode: string) {
  const raw = (input || "").trim();
  const dc = (dialCode || "").replace("+", "");
  const digits = raw.replace(/[^\d]/g, "");
  const candidates: string[] = [];

  if (raw.startsWith("+")) candidates.push(raw);
  if (dc && digits) candidates.push(`+${dc}${digits}`);
  if (dc && digits) candidates.push(`+${dc}${digits.replace(/^0+/, "")}`);

  for (const c of candidates) {
    const p = parsePhoneNumberFromString(c);
    if (p && p.isValid()) return p;
  }
  return null;
}

const AgentApplicationModal = ({ isOpen, onClose }: AgentApplicationModalProps) => {
  const { t } = useTranslation(['joinUs']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [autoCloseProgress, setAutoCloseProgress] = useState(0);

  const { applyAsAgent } = useAgents();

  const schema = yup.object().shape({
    name: yup.string().required(t('joinUs:modal.form.name.error')),
    email: yup.string().email(t('joinUs:modal.form.email.error')).optional(),
    phone: yup
      .string()
      .required(t('joinUs:modal.form.phone.error'))
      .test(
        "is-valid-phone",
        `Invalid phone number for ${selectedCountry.name}`,
        (val) => {
          if (!val) return false;
          const parsed = normalizePhoneToParsed(val, selectedCountry.dialCode);
          return !!parsed;
        }
      ),
  }) as yup.ObjectSchema<ApplyAsAgentInput>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ApplyAsAgentInput>({
    resolver: yupResolver(schema),
  });

  const phoneValue = watch("phone");

  useEffect(() => {
    if (submitSuccess && isOpen) {
      const duration = 10000;
      const interval = 100;
      const increment = (interval / duration) * 100;
      const timer = setInterval(() => {
        setAutoCloseProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            onClose();
            return 100;
          }
          return prev + increment;
        });
      }, interval);
      return () => clearInterval(timer);
    } else {
      setAutoCloseProgress(0);
    }
  }, [submitSuccess, isOpen, onClose]);

  const onSubmit = async (data: ApplyAsAgentInput) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const parsed = normalizePhoneToParsed(data.phone, selectedCountry.dialCode);
      if (!parsed) {
        setSubmitError(t('joinUs:modal.error.default'));
        setIsSubmitting(false);
        return;
      }
      const e164 = parsed.number;
      const response = await applyAsAgent({ ...data, phone: e164 });
      if (response.success) {
        setSubmitSuccess(true);
        reset();
      } else {
        setSubmitError(response.message || t('joinUs:modal.error.default'));
      }
    } catch {
      setSubmitError(t('joinUs:modal.error.network'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setSubmitError(null);
      setSubmitSuccess(false);
      setAutoCloseProgress(0);
      onClose();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      reset();
      setSubmitError(null);
      setSubmitSuccess(false);
      setAutoCloseProgress(0);
    }
  }, [isOpen, reset]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("phone", e.target.value);
  };

  const handlePhoneBlur = () => {
    const parsed = normalizePhoneToParsed(phoneValue || "", selectedCountry.dialCode);
    if (parsed) {
      setValue("phone", parsed.formatInternational(), { shouldValidate: true, shouldDirty: true });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative p-6 border-b border-gray-100">
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="text-center">
                <h2 className={cn(poppins.className, "text-2xl font-bold text-gray-900 mb-2")}>
                  {submitSuccess ? t('joinUs:modal.success.title') : t('joinUs:modal.title')}
                </h2>
                <p className="text-gray-600 text-sm">
                  {submitSuccess ? t('joinUs:modal.success.subtitle') : t('joinUs:modal.subtitle')}
                </p>
              </div>
            </div>

            <div className="p-6">
              {submitSuccess && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                  <motion.div
                    className="h-full bg-primary-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${autoCloseProgress}%` }}
                    transition={{ duration: 0.1, ease: "linear" }}
                  />
                </div>
              )}
              {submitSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className={cn(poppins.className, "text-lg font-semibold text-gray-900 mb-2")}>
                    {t('joinUs:modal.success.thank_you')}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {t('joinUs:modal.success.message')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t('joinUs:modal.success.auto_close', { seconds: Math.ceil((100 - autoCloseProgress) / 100 * 10) })}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <Input
                    id="name"
                    type="text"
                    label={t('joinUs:modal.form.name.label')}
                    placeholder={t('joinUs:modal.form.name.placeholder')}
                    startAdornment={<User className="h-4 w-4 text-gray-400" />}
                    error={errors.name?.message}
                    {...register("name")}
                    disabled={isSubmitting}
                  />
                  <Input
                    id="email"
                    type="email"
                    label={t('joinUs:modal.form.email.label')}
                    placeholder={t('joinUs:modal.form.email.placeholder')}
                    startAdornment={<Mail className="h-4 w-4 text-gray-400" />}
                    error={errors.email?.message}
                    {...register("email")}
                    disabled={isSubmitting}
                  />
                  <PhoneInput
                    selectedCountry={selectedCountry}
                    onCountryChange={setSelectedCountry}
                    label={t('joinUs:modal.form.phone.label')}
                    placeholder={t('joinUs:modal.form.phone.placeholder')}
                    error={errors.phone?.message}
                    onChange={handlePhoneChange}
                    onBlur={handlePhoneBlur}
                    value={phoneValue}
                    disabled={isSubmitting}
                  />
                  {submitError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                      <p className="text-sm text-red-600">{submitError}</p>
                    </div>
                  )}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('joinUs:modal.form.submitting')}
                      </>
                    ) : (
                      t('joinUs:modal.form.submit')
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    {t('joinUs:modal.form.privacy_notice')}
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AgentApplicationModal;
