"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Eye, EyeOff } from "lucide-react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { cn } from "@/components/lib/utils/twMerge";
import { Property as PropertyType } from "@/modules/properties/defs/types";
import { Agent } from "@/modules/agents/defs/types";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useTranslation } from "next-i18next";


const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface PropertyBookingModalProps {
  property: PropertyType;
  children: React.ReactNode;
}

const PropertyBookingModal = ({ property, children }: PropertyBookingModalProps) => {
  const { t } = useTranslation(['properties']);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showPhone, setShowPhone] = useState(false);

  // Get the first agent as default
  const defaultAgent = property.agents[0];

  const handleOpen = () => {
    setSelectedAgent(defaultAgent);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowPhone(false);
    setSelectedAgent(null);
  };

  const togglePhone = () => {
    setShowPhone(!showPhone);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div onClick={handleOpen}>
          {children}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-md p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className={cn(poppins.className, "text-2xl font-bold text-gray-900 mb-2")}>
            {t('showcase.booking_modal.title')}
          </h2>
          <p className="text-gray-600 text-sm">
            {t('showcase.booking_modal.subtitle')}
          </p>
        </div>

        {/* Agent Info */}
        {selectedAgent && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm">
                <Image
                  src={selectedAgent.user.photo ?? "/agent_placeholder.webp"}
                  alt={selectedAgent.user.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className={cn(poppins.className, "font-semibold text-gray-900 text-lg")}>
                  {selectedAgent.user.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedAgent.agencyName && `${selectedAgent.agencyName} • `}
                  {selectedAgent.experience} {t('showcase.booking_modal.years_experience')}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {t('showcase.booking_modal.speaks')}: {selectedAgent.languages.map(l => l.name).join(', ')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Phone Number Section */}
        <div className="space-y-4">
          <div className="text-center">
            <h4 className="font-medium text-gray-900 mb-2">{t('showcase.booking_modal.contact_information')}</h4>
          </div>

          <div className="bg-primary-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-500" />
                <span className="font-medium text-gray-900">{t('showcase.booking_modal.phone_number')}</span>
              </div>
              <button
                onClick={togglePhone}
                className="flex items-center gap-2 px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
              >
                {showPhone ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    {t('showcase.booking_modal.hide')}
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    {t('showcase.booking_modal.show_number')}
                  </>
                )}
              </button>
            </div>

            <AnimatePresence>
              {showPhone && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 pt-3 border-t border-primary-200"
                >
                  <a
                    href={`tel:${selectedAgent?.user.phone}`}
                    className="text-lg font-bold text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    {selectedAgent?.user.phone}
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>


      </DialogContent>
    </Dialog>
  );
};

export default PropertyBookingModal; 