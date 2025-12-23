"use client";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { cn } from "@/components/lib/utils/twMerge";
import { Poppins } from "next/font/google";
import {
  Star,
  User
} from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const TestimonialsSection = () => {
  const { t } = useTranslation(['joinUs']);

  const testimonials = [
    {
      name: t('joinUs:testimonials.items.0.name'),
      role: t('joinUs:testimonials.items.0.role'),
      content: t('joinUs:testimonials.items.0.content'),
      avatar: "/avatar-1.jpg"
    },
    {
      name: t('joinUs:testimonials.items.1.name'),
      role: t('joinUs:testimonials.items.1.role'),
      content: t('joinUs:testimonials.items.1.content'),
      avatar: "/avatar-2.jpg"
    },
    {
      name: t('joinUs:testimonials.items.2.name'),
      role: t('joinUs:testimonials.items.2.role'),
      content: t('joinUs:testimonials.items.2.content'),
      avatar: "/avatar-3.jpg"
    }
  ];

  return (
    <section className="py-20 bg-white">
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
            {t('joinUs:testimonials.title')}
          </h2>
          <p className={cn(
            poppins.className,
            "text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
          )}>
            {t('joinUs:testimonials.subtitle')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 * index }}
              className="bg-gradient-to-br from-primary-50 to-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className={cn(
                poppins.className,
                "text-slate-700 leading-relaxed mb-6 text-lg"
              )}>
                &quot;{testimonial.content}&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <h4 className={cn(poppins.className, "font-semibold text-slate-900")}>
                    {testimonial.name}
                  </h4>
                  <p className={cn(poppins.className, "text-sm text-slate-600")}>
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
