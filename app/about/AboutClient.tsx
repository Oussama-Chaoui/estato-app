"use client";
import { cn } from "@/components/lib/utils/twMerge";
import { Poppins } from "next/font/google";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import {
  Crown,
  Shield,
  Star,
  Heart,
  Users,
  MapPin,
  TrendingUp,
  Award,
  Building2,
  Home,
  Zap,
  Globe,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Target,
  Rocket,
  Diamond
} from "lucide-react";
import { useTranslation } from "next-i18next";
import Footer from "@/components/common/layout/footer";
import { useRef } from "react";
import Link from "next/link";
import { WEBSITE_FOCUS } from "@/modules/settings/defs/types";
import Routes from "@/common/defs/routes";
import { useSettingsContext } from "@/common/contexts/SettingsContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"]
});

const AboutClient = () => {
  const { t, i18n } = useTranslation(['about']);
  const { websiteFocus } = useSettingsContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const getListingRoute = () => {
    switch (websiteFocus) {
      case WEBSITE_FOCUS.DAILY_RENT:
        return Routes.Properties.DailyRent.ReadAll;
      case WEBSITE_FOCUS.RENT:
        return Routes.Properties.MonthlyRent.ReadAll;
      case WEBSITE_FOCUS.SELLING:
        return Routes.Properties.HomeSale.ReadAll;
      case WEBSITE_FOCUS.ALL:
        return Routes.Properties.DailyRent.ReadAll;
      default:
        return Routes.Properties.DailyRent.ReadAll;
    }
  };

  const visionPoints = [
    {
      icon: <Crown className="w-12 h-12" />,
      title: t('about:vision.points.excellence.title'),
      description: t('about:vision.points.excellence.description'),
      color: "from-amber-400 to-orange-500",
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-50"
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: t('about:vision.points.trust.title'),
      description: t('about:vision.points.trust.description'),
      color: "from-primary-400 to-primary-600",
      bgColor: "bg-gradient-to-br from-primary-50 to-primary-100"
    },
    {
      icon: <Star className="w-12 h-12" />,
      title: t('about:vision.points.service.title'),
      description: t('about:vision.points.service.description'),
      color: "from-yellow-400 to-yellow-600",
      bgColor: "bg-gradient-to-br from-yellow-50 to-yellow-100"
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: t('about:vision.points.leadership.title'),
      description: t('about:vision.points.leadership.description'),
      color: "from-green-400 to-green-600",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100"
    }
  ];

  const values = [
    {
      icon: <Heart className="w-16 h-16" />,
      title: t('about:values.points.passion.title'),
      description: t('about:values.points.passion.description'),
      color: "from-red-400 to-pink-500",
      bgColor: "bg-gradient-to-br from-red-50 to-pink-50"
    },
    {
      icon: <Users className="w-16 h-16" />,
      title: t('about:values.points.community.title'),
      description: t('about:values.points.community.description'),
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100"
    },
    {
      icon: <Award className="w-16 h-16" />,
      title: t('about:values.points.excellence.title'),
      description: t('about:values.points.excellence.description'),
      color: "from-purple-400 to-purple-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100"
    },
    {
      icon: <Zap className="w-16 h-16" />,
      title: t('about:values.points.innovation.title'),
      description: t('about:values.points.innovation.description'),
      color: "from-orange-400 to-orange-600",
      bgColor: "bg-gradient-to-br from-orange-50 to-orange-100"
    }
  ];

  const services = [
    {
      icon: <Home className="w-14 h-14" />,
      title: t('about:services.points.sales.title'),
      description: t('about:services.points.sales.description'),
      image: "/real-estate-villa.jpg",
      stats: t('about:services.points.sales.stats')
    },
    {
      icon: <Building2 className="w-14 h-14" />,
      title: t('about:services.points.rentals.title'),
      description: t('about:services.points.rentals.description'),
      image: "/real-estate-apartment.jpg",
      stats: t('about:services.points.rentals.stats')
    },
    {
      icon: <Globe className="w-14 h-14" />,
      title: t('about:services.points.global.title'),
      description: t('about:services.points.global.description'),
      image: "/real-estate-studio.jpg",
      stats: t('about:services.points.global.stats')
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
      {/* Hero Section */}
      <section className="relative py-32 flex items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            style={{ y, opacity }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary-200/30 to-primary-400/20 rounded-full blur-3xl"
          />
          <motion.div
            style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]), opacity }}
            className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-amber-200/30 to-orange-400/20 rounded-full blur-3xl"
          />
          <motion.div
            style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "30%"]), opacity }}
            className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-purple-200/30 to-pink-400/20 rounded-full blur-3xl"
          />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-primary-400/20 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm text-primary-700 px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg border border-primary-200/50"
            >
              <Sparkles className="w-5 h-5" />
              {t('about:hero.badge')}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className={cn(
                poppins.className,
                "text-6xl md:text-8xl lg:text-9xl font-black text-gray-900 mb-8 leading-[0.9]"
              )}
            >
              <motion.span
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="block"
              >
                {t('about:hero.title').split(' ')[0]}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="block bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 bg-clip-text text-transparent"
              >
                {t('about:hero.title').split(' ')[1]}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="block bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent"
              >
                {t('about:hero.title').split(' ').slice(2).join(' ')}
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              className={cn(
                poppins.className,
                "text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12"
              )}
            >
              {t('about:hero.subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href={getListingRoute()}>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    poppins.className,
                    "group relative inline-flex items-center gap-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">{t('about:ui.explore_properties')}</span>
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
                </motion.button>
              </Link>

              {/* <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  poppins.className,
                  "inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm text-primary-700 px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl border border-primary-200/50 transition-all duration-300"
                )}
              >
                <Eye className="w-5 h-5" />
                {t('about:ui.watch_story')}
              </motion.button> */}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-primary-400 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-primary-400 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Vision Section */}
      <section className="py-32 bg-gradient-to-br from-white via-primary-50/30 to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-primary-200/40 to-primary-400/20 rounded-full blur-2xl" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-amber-200/40 to-orange-400/20 rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg"
            >
              <Target className="w-5 h-5" />
              {t('about:ui.vision_badge')}
            </motion.div>

            <h2 className={cn(
              poppins.className,
              "text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight"
            )}>
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {t('about:vision.title').split(' ')[0]}
              </span>
              <span className="block bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                {t('about:vision.title').split(' ')[1]}
              </span>
            </h2>
            <p className={cn(
              poppins.className,
              "text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
            )}>
              {t('about:vision.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {visionPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  className={`relative ${point.bgColor} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 h-full flex flex-col`}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="pattern-dots pattern-primary-500 pattern-opacity-20 pattern-size-4 w-full h-full" />
                  </div>

                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${point.color} rounded-2xl mb-6 shadow-lg`}
                  >
                    <div className="text-white">
                      {point.icon}
                    </div>
                  </motion.div>

                  <h3 className={cn(
                    poppins.className,
                    "text-2xl font-bold text-gray-900 mb-4 relative z-10"
                  )}>
                    {point.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed relative z-10 flex-grow">
                    {point.description}
                  </p>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-transparent to-amber-600/10"
          />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary-500/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-amber-500/20 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg border border-white/20"
            >
              <Diamond className="w-5 h-5" />
              {t('about:ui.values_badge')}
            </motion.div>

            <h2 className={cn(
              poppins.className,
              "text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight"
            )}>
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {t('about:values.title').split(' ')[0]}
              </span>
              <span className="block bg-gradient-to-r from-primary-400 to-amber-400 bg-clip-text text-transparent">
                {t('about:values.title').split(' ').slice(1).join(' ')}
              </span>
            </h2>
            <p className={cn(
              poppins.className,
              "text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
            )}>
              {t('about:values.subtitle')}
            </p>
          </motion.div>

          {/* Innovative Grid Layout */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Values */}
            <div className="space-y-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <motion.div
                    whileHover={{ x: 10, scale: 1.02 }}
                    className={`relative ${value.bgColor} rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden border border-white/10`}
                  >
                    <div className="flex items-start gap-6">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`flex-shrink-0 w-20 h-20 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center shadow-lg`}
                      >
                        <div className="text-white">
                          {value.icon}
                        </div>
                      </motion.div>

                      <div className="flex-1">
                        <h3 className={cn(
                          poppins.className,
                          "text-2xl font-bold text-gray-900 mb-3"
                        )}>
                          {value.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>

                    {/* Animated Border */}
                    <motion.div
                      className="absolute inset-0 rounded-3xl border-2 border-gradient-to-r from-primary-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      initial={{ scale: 0.95 }}
                      whileHover={{ scale: 1 }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Right Side - Visual Element */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative w-full h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                {/* Background Image */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800">
                  <Image
                    src="/real-estate-villa.jpg"
                    alt={t('about:ui.luxury_real_estate')}
                    fill
                    className="object-cover opacity-60"
                  />
                </div>

                {/* Overlay Content */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
                  <div className="text-white">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      viewport={{ once: true }}
                      className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4"
                    >
                      <Rocket className="w-4 h-4" />
                      {t('about:ui.transforming_dreams')}
                    </motion.div>
                    <h3 className={cn(
                      poppins.className,
                      "text-3xl font-bold mb-2"
                    )}>
                      {t('about:ui.into_reality')}
                    </h3>
                    <p className="text-gray-200">
                      {t('about:ui.property_story')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 bg-gradient-to-br from-white via-primary-50/30 to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-primary-200/30 to-primary-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-amber-200/30 to-orange-400/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg"
            >
              <Building2 className="w-5 h-5" />
              {t('about:ui.services_badge')}
            </motion.div>

            <h2 className={cn(
              poppins.className,
              "text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight"
            )}>
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {t('about:services.title').split(' ')[0]}
              </span>
              <span className="block bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                {t('about:ui.solutions')}
              </span>
            </h2>
            <p className={cn(
              poppins.className,
              "text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
            )}>
              {t('about:services.subtitle')}
            </p>
          </motion.div>

          {/* Stunning Image Gallery Layout */}
          <div className="grid lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500"
                >
                  {/* Image Container */}
                  <div className="relative h-80 lg:h-96 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />


                    {/* Stats Badge */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                      viewport={{ once: true }}
                      className="absolute top-6 left-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
                    >
                      {service.stats}
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                      viewport={{ once: true }}
                      className={cn(
                        poppins.className,
                        "text-2xl font-bold mb-3"
                      )}
                    >
                      {service.title}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                      viewport={{ once: true }}
                      className="text-gray-200 leading-relaxed mb-4"
                    >
                      {service.description}
                    </motion.p>

                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-32 bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-transparent to-amber-600/20"
          />

          {/* Floating Elements */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 4) * 20}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg border border-white/20"
            >
              <Sparkles className="w-5 h-5" />
              {t('about:cta.badge')}
            </motion.div>

            {/* Main Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className={cn(
                poppins.className,
                "text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight"
              )}
            >
              <span className="block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {t('about:cta.title').split('?')[0]}
              </span>
              <span className="block bg-gradient-to-r from-primary-400 to-amber-400 bg-clip-text text-transparent">
                {t('about:cta.dream_property')}
              </span>
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className={cn(
                poppins.className,
                "text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto"
              )}
            >
              {t('about:cta.subtitle')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            >
              <Link href={getListingRoute()}>
                <motion.button
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    poppins.className,
                    "group relative inline-flex items-center gap-3 bg-gradient-to-r from-white to-gray-100 text-gray-900 px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden"
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">{t('about:ui.explore_properties')}</span>
                  <motion.div
                    className="relative z-10"
                    animate={{ x: i18n.language === 'ar' ? [0, -5, 0] : [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {i18n.language === 'ar' ? (
                      <ArrowLeft className="w-6 h-6" />
                    ) : (
                      <ArrowRight className="w-6 h-6" />
                    )}
                  </motion.div>
                </motion.button>
              </Link>

              <Link href={Routes.Common.Contact}>
                <motion.button
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    poppins.className,
                    "inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl border border-white/30 transition-all duration-300"
                  )}
                >
                  <MapPin className="w-6 h-6" />
                  {t('about:cta.contact_us')}
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center items-center gap-8 text-gray-400"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary-400" />
                <span className="text-sm font-medium">{t('about:cta.trust_indicators.secure_platform')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-medium">{t('about:cta.trust_indicators.premium_quality')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium">{t('about:cta.trust_indicators.expert_support')}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutClient;
