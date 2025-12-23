"use client";

import { motion } from "framer-motion";
import { BedDouble, Bath, Ruler, Warehouse, Calendar, TreePine } from "lucide-react";
import { Property as PropertyType } from "@/modules/properties/defs/types";
import { useTranslation } from "next-i18next";

interface PropertyFeaturesProps {
  property: PropertyType;
}

const PropertyFeatures = ({ property }: PropertyFeaturesProps) => {
  const { t } = useTranslation(['properties', 'common']);

  const features = [
    {
      icon: <BedDouble className="w-5 h-5" />,
      label: `${property.features[0].bedrooms} ${t('showcase.features.bedrooms')}`,
    },
    {
      icon: <Bath className="w-5 h-5" />,
      label: `${property.features[0].bathrooms} ${t('showcase.features.bathrooms')}`,
    },
    {
      icon: <Ruler className="w-5 h-5" />,
      label: `${property.features[0].area} ${t('common:area_unit')}`,
    },
    {
      icon: <Warehouse className="w-5 h-5" />,
      label: `${property.features[0].garages} ${t('showcase.features.garages')}`,
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: `${t('showcase.features.built')} ${property.yearBuilt}`,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mb-8">
      {features.map((feat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="p-1.5 bg-primary-100 rounded-lg text-primary-500">{feat.icon}</div>
          <span className="font-medium text-sm">{feat.label}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default PropertyFeatures; 