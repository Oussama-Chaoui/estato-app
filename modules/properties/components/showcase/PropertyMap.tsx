"use client";

import { Property as PropertyType } from "@/modules/properties/defs/types";
import { useTranslation } from "next-i18next";

interface PropertyMapProps {
  property: PropertyType;
}

const PropertyMap = ({ property }: PropertyMapProps) => {
  const { t } = useTranslation(['properties']);

  return (
    <section className="h-[600px] bg-gray-100 relative">
      {property.location?.latitude && property.location?.longitude ? (
        <iframe
          width="100%"
          height="600"
          loading="lazy"
          className="border-0"
          src={`https://maps.google.com/maps?q=${property.location.latitude},${property.location.longitude
            }&z=15&output=embed`}
          allowFullScreen
        />
      ) : (
        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">{t('showcase.map.not_available')}</span>
        </div>
      )}
    </section>
  );
};

export default PropertyMap; 