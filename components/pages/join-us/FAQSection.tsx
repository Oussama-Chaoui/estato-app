"use client";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { cn } from "@/components/lib/utils/twMerge";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const FAQSection = () => {
  const { t } = useTranslation(['joinUs']);

  const faqs = [
    {
      question: t('joinUs:faq.items.0.question'),
      answer: t('joinUs:faq.items.0.answer')
    },
    {
      question: t('joinUs:faq.items.1.question'),
      answer: t('joinUs:faq.items.1.answer')
    },
    {
      question: t('joinUs:faq.items.2.question'),
      answer: t('joinUs:faq.items.2.answer')
    },
    {
      question: t('joinUs:faq.items.3.question'),
      answer: t('joinUs:faq.items.3.answer')
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            {t('joinUs:faq.title')}
          </h2>
          <p className={cn(
            poppins.className,
            "text-xl text-slate-600 leading-relaxed"
          )}>
            {t('joinUs:faq.subtitle')}
          </p>
        </motion.div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <h3 className={cn(
                poppins.className,
                "text-xl font-semibold text-slate-900 mb-4"
              )}>
                {faq.question}
              </h3>
              <p className={cn(
                poppins.className,
                "text-slate-600 leading-relaxed"
              )}>
                {faq.answer}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
