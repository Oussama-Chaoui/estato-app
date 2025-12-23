"use client";

import { motion } from "framer-motion";
import { cn } from "@/components/lib/utils/twMerge";
import { Poppins } from "next/font/google";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import {
  Shield,
  Lock,
  User,
  Mail,
  FileText,
  Database,
  Eye,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import Footer from "@/components/common/layout/footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"]
});

const PrivacyPolicyClient = () => {
  const { t } = useTranslation(['privacy']);
  const [activeSection, setActiveSection] = useState('introduction');

  const sections = [
    {
      id: 'introduction',
      title: t('privacy:sections.introduction.title'),
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: 'data_collection',
      title: t('privacy:sections.data_collection.title'),
      icon: <Database className="w-5 h-5" />
    },
    {
      id: 'data_usage',
      title: t('privacy:sections.data_usage.title'),
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 'user_rights',
      title: t('privacy:sections.user_rights.title'),
      icon: <User className="w-5 h-5" />
    },
    {
      id: 'contact_us',
      title: t('privacy:sections.contact_us.title'),
      icon: <Mail className="w-5 h-5" />
    },
    {
      id: 'last_updated',
      title: t('privacy:sections.last_updated.title'),
      icon: <AlertCircle className="w-5 h-5" />
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'introduction':
        return (
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed">
              {t('privacy:sections.introduction.content')}
            </p>
          </div>
        );

      case 'data_collection':
        return (
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed mb-8">
              {t('privacy:sections.data_collection.content')}
            </p>

            <div className="space-y-6">
              {/* Personal Info */}
              <div className="border-s-4 border-primary-500 ps-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-600" />
                  {t('privacy:sections.data_collection.points.user_account.title')}
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {t('privacy:sections.data_collection.points.user_account.description')}
                </p>
              </div>

              {/* Client Specific */}
              <div className="border-s-4 border-primary-500 ps-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-600" />
                  {t('privacy:sections.data_collection.points.client_specific.title')}
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {t('privacy:sections.data_collection.points.client_specific.description')}
                </p>
              </div>

              {/* Agent Specific */}
              <div className="border-s-4 border-primary-500 ps-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-600" />
                  {t('privacy:sections.data_collection.points.agent_specific.title')}
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {t('privacy:sections.data_collection.points.agent_specific.description')}
                </p>
              </div>

              {/* Agent Applications */}
              <div className="border-s-4 border-primary-500 ps-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-600" />
                  {t('privacy:sections.data_collection.points.agent_applications.title')}
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {t('privacy:sections.data_collection.points.agent_applications.description')}
                </p>
              </div>

              {/* Property Rental */}
              <div className="border-s-4 border-primary-500 ps-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary-600" />
                  {t('privacy:sections.data_collection.points.property_rental.title')}
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {t('privacy:sections.data_collection.points.property_rental.description')}
                </p>
              </div>

              {/* Property Inquiries */}
              <div className="border-s-4 border-primary-500 ps-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary-600" />
                  {t('privacy:sections.data_collection.points.property_inquiries.title')}
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {t('privacy:sections.data_collection.points.property_inquiries.description')}
                </p>
              </div>

              {/* Session & Technical */}
              <div className="border-s-4 border-primary-500 ps-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary-600" />
                  {t('privacy:sections.data_collection.points.session_technical.title')}
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {t('privacy:sections.data_collection.points.session_technical.description')}
                </p>
              </div>
            </div>
          </div>
        );

      case 'data_usage':
        return (
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed mb-8">
              {t('privacy:sections.data_usage.content')}
            </p>

            <div className="space-y-4">
              {[
                t('privacy:sections.data_usage.purposes.property_services'),
                t('privacy:sections.data_usage.purposes.communication'),
                t('privacy:sections.data_usage.purposes.legal_requirements'),
                t('privacy:sections.data_usage.purposes.account_management')
              ].map((purpose, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{purpose}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'user_rights':
        return (
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed mb-8">
              {t('privacy:sections.user_rights.content')}
            </p>

            <div className="space-y-4">
              {[
                t('privacy:sections.user_rights.rights.access'),
                t('privacy:sections.user_rights.rights.rectification'),
                t('privacy:sections.user_rights.rights.deletion'),
                t('privacy:sections.user_rights.rights.data_portability')
              ].map((right, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Eye className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{right}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'contact_us':
        return (
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {t('privacy:sections.contact_us.content')}
            </p>
          </div>
        );

      case 'last_updated':
        return (
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed">
              {t('privacy:sections.last_updated.content')}
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
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className={cn(poppins.className, "text-4xl md:text-5xl font-bold text-gray-900 mb-4")}>
              {t('privacy:hero.title')}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('privacy:hero.subtitle')}
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
                  {t('privacy:sidebar.title')}
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

export default PrivacyPolicyClient;