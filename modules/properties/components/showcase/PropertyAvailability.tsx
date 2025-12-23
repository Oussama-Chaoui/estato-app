"use client";

import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { Poppins } from "next/font/google";
import { useTranslation } from "next-i18next";
import AvailabilityCalendar from "../partials/AvailabilityCalendar";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface PropertyAvailabilityProps {
  propertyId: number;
}

const PropertyAvailability = ({ propertyId }: PropertyAvailabilityProps) => {
  const { t } = useTranslation(['properties']);

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative mb-12"
    >
      <div className=" rounded-lg shadow-sm">
        <h3 className={`${poppins.className} flex items-center gap-2 text-xl font-bold mb-3`}>
          <CalendarDays className="w-5 h-5 text-primary-500" />
          {t('showcase.availability.title')}
        </h3>
        <AvailabilityCalendar propertyId={propertyId} />
      </div>
    </motion.section>
  );
};

export default PropertyAvailability; 