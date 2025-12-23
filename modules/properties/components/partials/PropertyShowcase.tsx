"use client";
import { useParams } from "next/navigation";
import { useMemo, useEffect, useState } from "react";
import { cn } from "@/components/lib/utils/twMerge";
import { Poppins } from "next/font/google";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import useProperties from "@/modules/properties/hooks/api/useProperties";
import { Property as PropertyType, PROPERTY_STATUS } from "@/modules/properties/defs/types";
import { WEBSITE_FOCUS } from "@/modules/settings/defs/types";
import { useTranslatedText } from "@/modules/properties/utils/translations";
import {
  PropertyHero,
  PropertyFeatures,
  PropertyDescription,
  PropertyPriceHistory,
  PropertyAmenities,
  PropertyVirtualTour,
  PropertyGallery,
  PropertyContactSidebar,
  PropertyMap,
  PropertyAvailability,
  PropertyLoading,
  PropertyNotFound,
} from "../showcase";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface PropertyShowcaseProps {
  websiteFocus: WEBSITE_FOCUS;
  initialProperty?: PropertyType | null;
}

const PropertyShowcase = ({ websiteFocus, initialProperty }: PropertyShowcaseProps) => {
  const { id } = useParams() as { id: string };
  const propertyId = Number(id);

  const { readOne } = useProperties();
  const [property, setProperty] = useState<PropertyType | null>(initialProperty ?? null);
  const [loading, setLoading] = useState(!initialProperty);
  const getTranslatedText = useTranslatedText();

  // fetch the property once on mount/id change
  useEffect(() => {
    if (initialProperty) return; // skip fetch if preloaded
    setLoading(true);
    readOne(propertyId)
      .then((res) => {
        if (res.success && res.data?.item) {
          setProperty(res.data.item);
        }
      })
      .finally(() => setLoading(false));
  }, [propertyId, initialProperty]);

  if (loading) {
    return <PropertyLoading />;
  }

  if (!property) {
    return <PropertyNotFound />;
  }

  return (
    <div className="bg-[#fafafa] min-h-screen mt-[75px]">
      {/* Hero Section */}
      <PropertyHero property={property} websiteFocus={websiteFocus} />

      {/* Details Section */}
      <section className="py-20 px-4 sm:px-8 lg:px-20 bg-[#faf8f5]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto"
        >
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Property Header */}
            <div className="mb-8">
              <h1 className={cn(poppins.className, "text-3xl font-bold text-gray-900 mb-2")}>
                {getTranslatedText(property.title)}
              </h1>

              {/* Location Badge */}
              <div className="inline-flex items-center gap-2 text-primary-700">
                <MapPin className="w-4 h-4" />
                <span className="font-medium text-sm">
                  {getTranslatedText(property.location.streetAddress)} • {getTranslatedText(property.location.city?.names)}
                </span>
              </div>
            </div>

            {/* Availability Section - Only for Daily Rent */}
            {websiteFocus === WEBSITE_FOCUS.DAILY_RENT && (
              <PropertyAvailability propertyId={propertyId} />
            )}

            {/* Features Grid */}
            <PropertyFeatures property={property} />

            {/* Description */}
            <PropertyDescription property={property} />

            {/* Price History - Only show for selling properties */}
            {websiteFocus !== WEBSITE_FOCUS.DAILY_RENT && (
              <PropertyPriceHistory property={property} />
            )}

            {/* Amenities Section */}
            <PropertyAmenities property={property} />

            {/* Virtual Tour - Only show for selling properties */}
            {property.hasVr === 1 && websiteFocus !== WEBSITE_FOCUS.DAILY_RENT && (
              <PropertyVirtualTour property={property} />
            )}

            {/* Image Gallery */}
            <PropertyGallery property={property} />
          </div>

          {/* Sidebar */}
          <PropertyContactSidebar property={property} websiteFocus={websiteFocus} />
        </motion.div>
      </section>

      {/* Map Section */}
      <PropertyMap property={property} />
    </div>
  );
};

export default PropertyShowcase;