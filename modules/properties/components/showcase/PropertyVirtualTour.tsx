"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";
import Image from "next/image";
import { Property as PropertyType } from "@/modules/properties/defs/types";
import { useTranslation } from "next-i18next";

interface PropertyVirtualTourProps {
  property: PropertyType;
}

const PropertyVirtualTour = ({ property }: PropertyVirtualTourProps) => {
  const { t } = useTranslation(['properties']);

  if (property.hasVr !== 1) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      whileInView={{ opacity: 1, scale: 1 }} 
      className="relative aspect-video rounded-xl overflow-hidden shadow-xl mb-8"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      <Image src="/virtual-tour.jpg" alt="Virtual Tour" fill className="object-cover" />
      <button className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 hover:bg-white transition-all">
        <Users className="w-5 h-5 text-primary-500" />
        <span className="font-semibold text-sm">{t('showcase.virtual_tour.explore')}</span>
      </button>
    </motion.div>
  );
};

export default PropertyVirtualTour; 