"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { cn } from "@/components/lib/utils/twMerge";
import { Poppins } from "next/font/google";
import {
  Trophy,
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

const FinalCTASection = () => {
  const { t } = useTranslation(['joinUs']);
  const { isRTL } = useDirection();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openApplicationModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-full text-sm font-semibold mb-6">
            <Trophy className="h-5 w-5" />
            {t('joinUs:final_cta.badge')}
          </div>

          <h2 className={cn(
            poppins.className,
            "text-4xl lg:text-6xl font-bold text-white mb-6"
          )}>
            {t('joinUs:final_cta.title')}
          </h2>

          <p className={cn(
            poppins.className,
            "text-xl text-primary-100 mb-8 leading-relaxed"
          )}>
            {t('joinUs:final_cta.subtitle')}
          </p>

          <div className="flex justify-center">
            <Button 
              onClick={openApplicationModal}
              className="bg-white text-primary-600 hover:bg-gray-50 px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 font-semibold text-lg flex items-center gap-2"
            >
              {t('joinUs:final_cta.primary_button')}
              {isRTL ? (
                <ArrowLeft className="h-5 w-5" />
              ) : (
                <ArrowRight className="h-5 w-5" />
              )}
            </Button>
          </div>
        </motion.div>
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

export default FinalCTASection;
