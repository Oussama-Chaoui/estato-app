"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/components/lib/utils/twMerge";
import { Poppins } from "next/font/google";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  Search,
  Phone,
  Calendar,
  Shield,
  Settings,
  MapPin
} from "lucide-react";
import Footer from "@/components/common/layout/footer";
import Link from "next/link";
import Routes from "@/common/defs/routes";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"]
});

interface FAQItem {
  question: string;
  answer: string;
}

interface Category {
  title: string;
  icon: React.ReactNode;
  questions: FAQItem[];
}

const FAQClient = () => {
  const { t } = useTranslation(['faq']);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories: Record<string, Category> = {
    general: {
      title: t('faq:categories.general.title'),
      icon: <HelpCircle className="w-5 h-5" />,
      questions: t('faq:categories.general.questions', { returnObjects: true }) as FAQItem[]
    },
    searching: {
      title: t('faq:categories.searching.title'),
      icon: <Search className="w-5 h-5" />,
      questions: t('faq:categories.searching.questions', { returnObjects: true }) as FAQItem[]
    },
    contact: {
      title: t('faq:categories.contact.title'),
      icon: <Phone className="w-5 h-5" />,
      questions: t('faq:categories.contact.questions', { returnObjects: true }) as FAQItem[]
    },
    booking: {
      title: t('faq:categories.booking.title'),
      icon: <Calendar className="w-5 h-5" />,
      questions: t('faq:categories.booking.questions', { returnObjects: true }) as FAQItem[]
    },
    agents: {
      title: t('faq:categories.agents.title'),
      icon: <Shield className="w-5 h-5" />,
      questions: t('faq:categories.agents.questions', { returnObjects: true }) as FAQItem[]
    },
    technical: {
      title: t('faq:categories.technical.title'),
      icon: <Settings className="w-5 h-5" />,
      questions: t('faq:categories.technical.questions', { returnObjects: true }) as FAQItem[]
    }
  };

  const toggleQuestion = (questionId: string) => {
    setOpenQuestion(openQuestion === questionId ? null : questionId);
  };

  // Filter questions based on search and category
  const getFilteredQuestions = () => {
    const allQuestions: Array<{ categoryKey: string; question: FAQItem; index: number }> = [];

    Object.entries(categories).forEach(([categoryKey, category]) => {
      if (activeCategory === "all" || activeCategory === categoryKey) {
        category.questions.forEach((question, index) => {
          if (
            searchQuery === "" ||
            question.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            question.answer.toLowerCase().includes(searchQuery.toLowerCase())
          ) {
            allQuestions.push({ categoryKey, question, index });
          }
        });
      }
    });

    return allQuestions;
  };

  const filteredQuestions = getFilteredQuestions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary-50 to-white border-b border-primary-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
            >
              <HelpCircle className="w-10 h-10 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={cn(poppins.className, "text-4xl md:text-5xl font-bold text-gray-900 mb-4")}
            >
              {t('faq:hero.title')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto mb-8"
            >
              {t('faq:hero.subtitle')}
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative max-w-2xl mx-auto"
            >
              <Search className="absolute start-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('faq:search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full ps-12 pe-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all text-gray-700 placeholder-gray-400"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar - Categories */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  {t('faq:sidebar.title')}
                </h3>
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveCategory("all")}
                    className={cn(
                      "w-full text-start px-4 py-3 rounded-xl transition-all flex items-center gap-3 group",
                      activeCategory === "all"
                        ? "bg-primary-500 text-white shadow-lg shadow-primary-100"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <MapPin className={cn(
                      "w-5 h-5 flex-shrink-0",
                      activeCategory === "all" ? "text-white" : "text-gray-400 group-hover:text-primary-500"
                    )} />
                    <span className="font-medium">{t('faq:sidebar.all_questions')}</span>
                  </button>
                  {Object.entries(categories).map(([key, category]) => (
                    <button
                      key={key}
                      onClick={() => setActiveCategory(key)}
                      className={cn(
                        "w-full text-start px-4 py-3 rounded-xl transition-all flex items-center gap-3 group",
                        activeCategory === key
                          ? "bg-primary-500 text-white shadow-lg shadow-primary-100"
                          : "text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      <div className={cn(
                        "flex-shrink-0",
                        activeCategory === key ? "text-white" : "text-gray-400 group-hover:text-primary-500"
                      )}>
                        {category.icon}
                      </div>
                      <span className="font-medium">{category.title}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
          {filteredQuestions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('faq:search.no_results')}</h3>
              <p className="text-gray-600">{t('faq:search.no_results_description')}</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map(({ categoryKey, question, index }) => {
                const questionId = `${categoryKey}-${index}`;
                const isOpen = openQuestion === questionId;

                return (
                  <motion.div
                    key={questionId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl border-2 border-gray-100 hover:border-primary-200 transition-all overflow-hidden shadow-sm hover:shadow-md"
                  >
                    <button
                      onClick={() => toggleQuestion(questionId)}
                      className="w-full px-6 py-5 flex items-start justify-between gap-4 text-start group"
                    >
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {question.question}
                        </h3>
                      </div>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0 mt-1"
                      >
                        <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-primary-500" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-5 pt-0">
                            <div className="border-t border-gray-100 pt-4">
                              <p className="text-gray-700 leading-relaxed">
                                {question.answer}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}

            </div>
          </div>
          
          {/* Still Have Questions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mt-16 bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl p-8 md:p-12 text-center border-2 border-primary-200"
          >
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Phone className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className={cn(poppins.className, "text-2xl md:text-3xl font-bold text-gray-900 mb-4")}>
              {t('faq:cta.title')}
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              {t('faq:cta.description')}
            </p>
            <Link href={Routes.Common.Contact}>
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl">
                <Phone className="w-5 h-5" />
                {t('faq:cta.contact_button')}
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQClient;

