"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/components/lib/utils/twMerge";
import { Poppins } from "next/font/google";
import { useTranslation } from "next-i18next";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import type { ObjectSchema } from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PhoneInput, countries, Country } from "@/components/ui/phone-input";
import { parsePhoneNumberFromString } from "libphonenumber-js/max";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  User
} from "lucide-react";
import Footer from "@/components/common/layout/footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"]
});

type FormData = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

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

const ContactClient = () => {
  const { t, i18n } = useTranslation(['contact']);
  const containerRef = useRef<HTMLDivElement>(null);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);

  const schema: ObjectSchema<FormData> = Yup.object().shape({
    name: Yup.string()
      .required(t('contact:form.validation.name_required'))
      .min(2, t('contact:form.validation.name_min')),
    email: Yup.string()
      .email(t('contact:form.validation.email_invalid'))
      .required(t('contact:form.validation.email_required')),
    phone: Yup.string()
      .optional()
      .test('is-valid-phone', t('contact:form.validation.phone_invalid'), (value) => {
        if (!value) return true;
        const parsed = normalizePhoneToParsed(value, selectedCountry.dialCode);
        return !!parsed;
      }),
    subject: Yup.string()
      .required(t('contact:form.validation.subject_required'))
      .min(5, t('contact:form.validation.subject_min')),
    message: Yup.string()
      .required(t('contact:form.validation.message_required'))
      .min(10, t('contact:form.validation.message_min'))
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: undefined,
      subject: '',
      message: ''
    }
  });

  const phoneValue = watch("phone");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setValue("phone", value || undefined);
  };

  const handlePhoneBlur = () => {
    if (phoneValue) {
      const parsed = normalizePhoneToParsed(phoneValue, selectedCountry.dialCode);
      if (parsed) {
        setValue("phone", parsed.formatInternational(), { shouldValidate: true, shouldDirty: true });
      }
    }
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const onSubmit = async () => {
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSubmitStatus('success');
      reset();

      // Reset status after 3 seconds
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: t('contact:info.address.title'),
      details: t('contact:info.address.details'),
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: t('contact:info.phone.title'),
      details: t('contact:info.phone.details'),
      bgColor: "bg-gradient-to-br from-green-500 to-green-600"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: t('contact:info.email.title'),
      details: t('contact:info.email.details'),
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-600"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: t('contact:info.hours.title'),
      details: t('contact:info.hours.details'),
      bgColor: "bg-gradient-to-br from-orange-500 to-orange-600"
    }
  ];

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: "#", label: "Facebook" },
    { icon: <Instagram className="w-5 h-5" />, href: "#", label: "Instagram" },
    { icon: <Linkedin className="w-5 h-5" />, href: "#", label: "LinkedIn" },
    { icon: <Twitter className="w-5 h-5" />, href: "#", label: "Twitter" }
  ];


  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <section className="relative py-32 flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-amber-50" />
        <motion.div
          style={{ y, opacity }}
          className="absolute inset-0 bg-gradient-to-r from-primary-600/5 to-amber-600/5"
        />

        {/* Floating Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full opacity-60"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-amber-200 to-orange-300 rounded-full opacity-60"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-amber-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold border border-primary-200/50"
            >
              <MessageCircle className="w-4 h-4" />
              {t('contact:hero.badge')}
            </motion.span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={cn(
              poppins.className,
              "text-5xl md:text-7xl font-bold text-gray-900 mb-6 !leading-tight"
            )}
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="block"
            >
              {t('contact:hero.title').split(' ')[0]}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="block bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 bg-clip-text text-transparent"
            >
              {t('contact:hero.title').split(' ')[1]}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="block bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent"
            >
              {t('contact:hero.title').split(' ').slice(2).join(' ')}
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            {t('contact:hero.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={cn(poppins.className, "text-4xl font-bold text-gray-900 mb-4")}>
              {t('contact:info.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('contact:info.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group h-full flex flex-col"
              >
                <div className={`${info.bgColor} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 text-white text-center h-full flex flex-col`}>
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    {info.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{info.title}</h3>
                  <p className="text-white/90 leading-relaxed flex-1 whitespace-pre-line">{info.details}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 h-full flex flex-col"
            >
              <div className="mb-8">
                <h3 className={cn(poppins.className, "text-3xl font-bold text-gray-900 mb-4")}>
                  {t('contact:form.title')}
                </h3>
                <p className="text-gray-600">
                  {t('contact:form.subtitle')}
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex-1 flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    type="text"
                    {...register('name')}
                    label={`${t('contact:form.fields.name')} *`}
                    placeholder={t('contact:form.placeholders.name')}
                    startAdornment={<User className="h-4 w-4 text-gray-400" />}
                    disabled={isSubmitting}
                    error={errors.name?.message}
                  />
                  <Input
                    type="email"
                    {...register('email')}
                    label={`${t('contact:form.fields.email')} *`}
                    placeholder={t('contact:form.placeholders.email')}
                    startAdornment={<Mail className="h-4 w-4 text-gray-400" />}
                    disabled={isSubmitting}
                    error={errors.email?.message}
                  />
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <PhoneInput
                    selectedCountry={selectedCountry}
                    onCountryChange={setSelectedCountry}
                    label={t('contact:form.fields.phone')}
                    placeholder={t('contact:form.placeholders.phone')}
                    error={errors.phone?.message}
                    onChange={handlePhoneChange}
                    onBlur={handlePhoneBlur}
                    value={phoneValue || ''}
                    disabled={isSubmitting}
                  />
                </div>

                <Input
                  type="text"
                  {...register('subject')}
                  label={`${t('contact:form.fields.subject')} *`}
                  placeholder={t('contact:form.placeholders.subject')}
                  startAdornment={<MessageCircle className="h-4 w-4 text-gray-400" />}
                  disabled={isSubmitting}
                  error={errors.subject?.message}
                />

                <div className="flex-1 flex flex-col">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('contact:form.fields.message')} *
                  </label>
                  <Textarea
                    {...register('message')}
                    rows={6}
                    placeholder={t('contact:form.placeholders.message')}
                    disabled={isSubmitting}
                    className="resize-none flex-1"
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                      <span>•</span>
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-auto"
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    className={cn(
                      poppins.className,
                      "w-full group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10">
                      {isSubmitting ? t('contact:form.submitting') : t('contact:form.submit')}
                    </span>
                    <motion.div
                      className="relative z-10"
                      animate={{ x: i18n.language === 'ar' ? [0, -5, 0] : [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      {i18n.language === 'ar' ? (
                        <ArrowLeft className="w-5 h-5" />
                      ) : (
                        <ArrowRight className="w-5 h-5" />
                      )}
                    </motion.div>
                  </Button>
                </motion.div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-xl"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">{t('contact:form.success_message')}</span>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">{t('contact:form.error_message')}</span>
                  </motion.div>
                )}
              </form>
            </motion.div>

            {/* Map and Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="h-full flex flex-col space-y-8"
            >
              {/* Map */}
              <div className="bg-white rounded-3xl flex-1 shadow-xl min-h-[320px] overflow-hidden">
                <div className="h-full">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3213.1234567890!2d-5.8096!3d35.7595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sBoulevard%20Pasteur%2C%20Tangier%2C%20Morocco!5e0!3m2!1sen!2sma!4v1234567890123!5m2!1sen!2sma"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-3xl"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <h4 className={cn(poppins.className, "text-2xl font-bold text-gray-900 mb-6")}>
                  {t('contact:social.title')}
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        asChild
                        className="flex items-center justify-center gap-3 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-primary-50 hover:to-primary-100 transition-all duration-300 border border-gray-200 h-auto w-full min-h-[60px]"
                      >
                        <a href={social.href} className="flex items-center gap-3 w-full justify-center">
                          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 flex-shrink-0">
                            {social.icon}
                          </div>
                          <span className="font-medium text-gray-700 text-center flex-1 min-w-0">{social.label}</span>
                        </a>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactClient;
