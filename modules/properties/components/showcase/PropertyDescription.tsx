"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { Property as PropertyType } from "@/modules/properties/defs/types";
import { useTranslatedText } from "@/modules/properties/utils/translations";

interface PropertyDescriptionProps {
  property: PropertyType;
}

const PropertyDescription = ({ property }: PropertyDescriptionProps) => {
  const getTranslatedText = useTranslatedText();

  return (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="prose max-w-none mb-8">
      <p className="text-gray-600 leading-relaxed mb-4 text-sm">{getTranslatedText(property.description)}</p>
      <div className="grid gap-3">
        {property.descriptions.map((desc, i) => {
          let translatedContent = '';
          try {
            // Parse the content string into a JSON object
            const contentObject = JSON.parse(desc.content);
            translatedContent = getTranslatedText(contentObject);
          } catch (error) {
            console.error("Failed to parse description content:", error);
            translatedContent = desc.content; // Fallback to raw string if parsing fails
          }

          return (
            <div key={i} className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary-500 flex-shrink-0" />
              <span className="text-gray-600 text-sm">{translatedContent}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default PropertyDescription; 