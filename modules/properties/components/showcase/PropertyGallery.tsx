"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Property as PropertyType } from "@/modules/properties/defs/types";

interface PropertyGalleryProps {
  property: PropertyType;
}

const PropertyGallery = ({ property }: PropertyGalleryProps) => {
  const galleryImages = property.images.map((img) => img.upload.url);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
      {galleryImages.map((img, index) => (
        <motion.div 
          key={index} 
          whileHover={{ scale: 1.02 }} 
          className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
        >
          <Image src={img} alt="Property" fill className="object-cover" />
        </motion.div>
      ))}
    </div>
  );
};

export default PropertyGallery; 