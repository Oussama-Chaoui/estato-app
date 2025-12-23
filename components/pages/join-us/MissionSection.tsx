"use client";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { cn } from "@/components/lib/utils/twMerge";
import { Poppins } from "next/font/google";
import {
  Target,
  Zap,
  Heart
} from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const MissionSection = () => {
  const { t } = useTranslation(['joinUs']);

  return (
    <section id="mission-section" className="py-20 bg-white">
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
            {t('joinUs:mission.title')}
          </h2>
          <p className={cn(
            poppins.className,
            "text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
          )}>
            {t('joinUs:mission.subtitle')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300"
          >
            <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h3 className={cn(poppins.className, "text-2xl font-bold text-slate-900 mb-4")}>
              {t('joinUs:mission.cards.mission.title')}
            </h3>
            <p className={cn(poppins.className, "text-slate-600 leading-relaxed")}>
              {t('joinUs:mission.cards.mission.description')}
            </p>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300"
          >
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className={cn(poppins.className, "text-2xl font-bold text-slate-900 mb-4")}>
              {t('joinUs:mission.cards.vision.title')}
            </h3>
            <p className={cn(poppins.className, "text-slate-600 leading-relaxed")}>
              {t('joinUs:mission.cards.vision.description')}
            </p>
          </motion.div>

          {/* Values Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300"
          >
            <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h3 className={cn(poppins.className, "text-2xl font-bold text-slate-900 mb-4")}>
              {t('joinUs:mission.cards.values.title')}
            </h3>
            <p className={cn(poppins.className, "text-slate-600 leading-relaxed")}>
              {t('joinUs:mission.cards.values.description')}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
