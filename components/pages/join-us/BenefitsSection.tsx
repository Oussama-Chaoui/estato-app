"use client";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { cn } from "@/components/lib/utils/twMerge";
import { Poppins } from "next/font/google";
import {
  Users,
  Building2,
  TrendingUp,
  Shield
} from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const BenefitsSection = () => {
  const { t } = useTranslation(['joinUs']);

  const benefits = [
    {
      icon: <Users className="h-8 w-8" />,
      title: t('joinUs:benefits.network.title'),
      description: t('joinUs:benefits.network.description'),
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Building2 className="h-8 w-8" />,
      title: t('joinUs:benefits.platform.title'),
      description: t('joinUs:benefits.platform.description'),
      color: "from-green-500 to-green-600"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: t('joinUs:benefits.growth.title'),
      description: t('joinUs:benefits.growth.description'),
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: t('joinUs:benefits.support.title'),
      description: t('joinUs:benefits.support.description'),
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className={cn(
            poppins.className,
            "text-4xl lg:text-5xl font-bold text-slate-900 mb-6"
          )}>
            {t('joinUs:benefits.title')}
          </h2>
          <p className={cn(
            poppins.className,
            "text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
          )}>
            {t('joinUs:benefits.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 * index }}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
            >
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-r text-white group-hover:scale-110 transition-transform duration-300",
                benefit.color
              )}>
                {benefit.icon}
              </div>
              <h3 className={cn(
                poppins.className,
                "text-xl font-bold text-slate-900 mb-4"
              )}>
                {benefit.title}
              </h3>
              <p className={cn(
                poppins.className,
                "text-slate-600 leading-relaxed"
              )}>
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
