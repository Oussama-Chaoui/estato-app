"use client";

import { motion } from "framer-motion";
import { cn } from "@/components/lib/utils/twMerge";
import { Poppins } from "next/font/google";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import {
  FileText,
  ShoppingCart,
  Copyright,
  AlertTriangle,
  XCircle,
  Scale,
  Mail,
  CheckCircle,
  Home
} from "lucide-react";
import Footer from "@/components/common/layout/footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"]
});

const TermsOfServiceClient = () => {
  const { t } = useTranslation(['terms']);
  const [activeSection, setActiveSection] = useState('acceptance');

  const sections = [
    {
      id: 'acceptance',
      title: t('terms:sections.acceptance.title'),
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      id: 'platform',
      title: t('terms:sections.platform.title'),
      icon: <Home className="w-5 h-5" />
    },
    {
      id: 'inquiries_bookings',
      title: t('terms:sections.inquiries_bookings.title'),
      icon: <ShoppingCart className="w-5 h-5" />
    },
    {
      id: 'prohibited_conduct',
      title: t('terms:sections.prohibited_conduct.title'),
      icon: <XCircle className="w-5 h-5" />
    },
    {
      id: 'intellectual_property',
      title: t('terms:sections.intellectual_property.title'),
      icon: <Copyright className="w-5 h-5" />
    },
    {
      id: 'liability',
      title: t('terms:sections.liability.title'),
      icon: <AlertTriangle className="w-5 h-5" />
    },
    {
      id: 'legal',
      title: t('terms:sections.legal.title'),
      icon: <Scale className="w-5 h-5" />
    },
    {
      id: 'contact',
      title: t('terms:sections.contact.title'),
      icon: <Mail className="w-5 h-5" />
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'acceptance':
        return (
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {t('terms:sections.acceptance.content')}
            </p>
          </div>
        );

      case 'platform':
        return (
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {t('terms:sections.platform.content')}
            </p>
          </div>
        );

      case 'inquiries_bookings':
        return (
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {t('terms:sections.inquiries_bookings.content')}
            </p>
          </div>
        );

      case 'prohibited_conduct':
        return (
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed mb-8">
              {t('terms:sections.prohibited_conduct.content')}
            </p>

            <div className="space-y-4">
              {[
                t('terms:sections.prohibited_conduct.prohibitions.scraping'),
                t('terms:sections.prohibited_conduct.prohibitions.fraud'),
                t('terms:sections.prohibited_conduct.prohibitions.harassment'),
                t('terms:sections.prohibited_conduct.prohibitions.spam'),
                t('terms:sections.prohibited_conduct.prohibitions.illegal'),
                t('terms:sections.prohibited_conduct.prohibitions.interference')
              ].map((prohibition, index) => (
                <div key={index} className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{prohibition}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'intellectual_property':
        return (
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {t('terms:sections.intellectual_property.content')}
            </p>
          </div>
        );

      case 'liability':
        return (
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {t('terms:sections.liability.content')}
            </p>
          </div>
        );

      case 'legal':
        return (
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {t('terms:sections.legal.content')}
            </p>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {t('terms:sections.contact.content')}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-gray-50 to-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className={cn(poppins.className, "text-4xl md:text-5xl font-bold text-gray-900 mb-4")}>
              {t('terms:hero.title')}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('terms:hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Left Sidebar - Navigation */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  {t('terms:sidebar.title')}
                </h3>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        "w-full text-start px-4 py-3 rounded-lg transition-colors duration-200 flex items-center gap-3",
                        activeSection === section.id
                          ? "bg-primary-50 text-primary-700 border-s-4 border-primary-500"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      {section.icon}
                      <span className="font-medium">{section.title}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-3">
              <div className="prose prose-lg max-w-none">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 text-start">
                    {sections.find(s => s.id === activeSection)?.title}
                  </h2>
                </div>

                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderContent()}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsOfServiceClient;



