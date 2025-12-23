"use client";

import { Property as PropertyType } from "@/modules/properties/defs/types";
import { getAmenityIcon } from "@/modules/properties/defs/utils";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { getTranslatedAmenityName } from "@/modules/properties/utils/amenities";

interface PropertyAmenitiesProps {
  property: PropertyType;
}

const PropertyAmenities = ({ property }: PropertyAmenitiesProps) => {
  const { t } = useTranslation(['properties', 'amenities']);

  return (
    <div className="grid grid-cols-2 gap-3 mb-8">
      {property.amenities.map((amenity, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="p-1.5 bg-primary-100 rounded-lg text-primary-500">
            {getAmenityIcon(amenity.icon)}
          </div>
          <span className="font-medium text-sm">{getTranslatedAmenityName(amenity.name, t)}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default PropertyAmenities; 