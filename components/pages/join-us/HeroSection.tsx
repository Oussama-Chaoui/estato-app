"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { cn } from "@/components/lib/utils/twMerge";
import { Poppins } from "next/font/google";
import Image from "next/image";
import {
  TrendingUp,
  Building2,
  Star,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDirection } from "@/common/contexts/DirectionContext";
import AgentApplicationModal from "./AgentApplicationModal";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const HeroSection = () => {
  const { t } = useTranslation(['joinUs']);
  const { isRTL } = useDirection();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scrollToMission = () => {
    const missionSection = document.getElementById('mission-section');
    if (missionSection) {
      const targetPosition = missionSection.offsetTop - 80; // Offset for better positioning
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 1500; // 1.5 seconds for premium feel
      let start: number | null = null;

      const easeInOutCubic = (t: number): number => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const animation = (currentTime: number) => {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);
        const easedProgress = easeInOutCubic(progress);
        
        window.scrollTo(0, startPosition + distance * easedProgress);
        
        if (progress < 1) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
    }
  };

  const openApplicationModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-100">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary-100/10 to-primary-200/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content Column */}
            <div className={cn(
              "flex flex-col",
              "lg:items-start"
            )}>
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-primary-200 text-primary-700 px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg"
              >
                <Star className="h-5 w-5" />
                {t('joinUs:hero.badge')}
              </motion.div>

              {/* Main Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className={cn(
                  poppins.className,
                  "text-5xl lg:text-7xl font-bold leading-tight mb-6",
                  isRTL ? "text-right" : "text-left"
                )}
              >
                <span className="text-slate-900">{t('joinUs:hero.title.part1')}</span>
                <br />
                <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                  {t('joinUs:hero.title.part2')}
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className={cn(
                  poppins.className,
                  "text-xl text-slate-600 mb-8 max-w-2xl leading-relaxed",
                  isRTL ? "text-right" : "text-left"
                )}
              >
                {t('joinUs:hero.subtitle')}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className={cn(
                  "flex flex-col sm:flex-row gap-4",
                  isRTL ? "lg:justify-end" : "lg:justify-start"
                )}
              >
                <Button 
                  onClick={openApplicationModal}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 font-semibold text-lg"
                >
                  {t('joinUs:hero.cta.primary')}
                  {isRTL ? (
                    <ArrowLeft className="ml-2 h-5 w-5" />
                  ) : (
                    <ArrowRight className="ml-2 h-5 w-5" />
                  )}
                </Button>
                <Button 
                  onClick={scrollToMission}
                  variant="outline" 
                  className="border-2 border-primary-300 text-primary-700 hover:bg-primary-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105"
                >
                  {t('joinUs:hero.cta.secondary')}
                </Button>
              </motion.div>
            </div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <Image
                  src="/illustration.svg"
                  alt="Join Yakout Real Estate"
                  width={600}
                  height={500}
                  className="rounded-3xl object-contain"
                />

                {/* Floating Stats Cards */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="absolute -top-4 -left-4 bg-white rounded-2xl p-4 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">2000+</p>
                      <p className="text-sm text-slate-600">{t('joinUs:hero.stats.agents')}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">50K+</p>
                      <p className="text-sm text-slate-600">{t('joinUs:hero.stats.properties')}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Agent Application Modal */}
      <AgentApplicationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default HeroSection;
