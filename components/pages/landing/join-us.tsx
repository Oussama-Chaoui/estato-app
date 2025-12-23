"use client";
import { cn } from "@/components/lib/utils/twMerge";
import { ArrowRight, ArrowLeft, Users, Home, Building2, Handshake, Star } from "lucide-react";
import { Poppins } from "next/font/google";
import { motion } from "framer-motion";
import { Button } from "../../ui/button";
import { useTranslation } from "next-i18next";
import { useDirection } from "@/common/contexts/DirectionContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const JoinUs = () => {
  const { t } = useTranslation('landing');
  const { isRTL } = useDirection();

  const benefits = [
    {
      icon: <Users className="h-6 w-6" />,
      title: t('join_us.benefits.network.title'),
      description: t('join_us.benefits.network.description')
    },
    {
      icon: <Home className="h-6 w-6" />,
      title: t('join_us.benefits.list_properties.title'),
      description: t('join_us.benefits.list_properties.description')
    },
    {
      icon: <Building2 className="h-6 w-6" />,
      title: t('join_us.benefits.professional_support.title'),
      description: t('join_us.benefits.professional_support.description')
    },
    {
      icon: <Handshake className="h-6 w-6" />,
      title: t('join_us.benefits.trusted_platform.title'),
      description: t('join_us.benefits.trusted_platform.description')
    }
  ];



  return (
    <section className="w-full bg-primary-50 py-16 px-4 sm:px-6">
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Star className="h-4 w-4" />
              {t('join_us.badge')}
            </div>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className={cn(
              poppins.className,
              "text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6",
              "bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent"
            )}
          >
            {t('join_us.title')}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={cn(
              poppins.className,
              "text-slate-600 text-lg font-medium leading-relaxed max-w-3xl mx-auto"
            )}
          >
            {t('join_us.subtitle')}
          </motion.p>
        </div>



        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 * index }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center text-primary-600 mb-4">
                {benefit.icon}
              </div>
              <h3 className={cn(
                poppins.className,
                "text-lg font-semibold text-slate-900 mb-2"
              )}>
                {benefit.title}
              </h3>
              <p className={cn(
                poppins.className,
                "text-slate-600 text-sm leading-relaxed"
              )}>
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white rounded-2xl p-8 md:p-12 shadow-xl"
        >
          <div className="text-center mb-8">
            <h3 className={cn(
              poppins.className,
              "text-2xl md:text-3xl font-bold text-slate-900 mb-4"
            )}>
              {t('join_us.cta.title')}
            </h3>
            <p className={cn(
              poppins.className,
              "text-slate-600 text-lg max-w-2xl mx-auto"
            )}>
              {t('join_us.cta.subtitle')}
            </p>
          </div>

                     <div className="flex justify-center">
             <Button
               onClick={() => {
                 console.log('Join Now button clicked');
               }}
               className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 font-medium flex items-center gap-2"
             >
               {t('join_us.cta.button')}
               {isRTL ? (
                 <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
               ) : (
                 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
               )}
             </Button>
           </div>
        </motion.div>
      </div>
    </section>
  );
};

export default JoinUs; 