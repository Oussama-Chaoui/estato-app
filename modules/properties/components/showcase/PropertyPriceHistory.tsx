"use client";

import { motion } from "framer-motion";
import { Poppins } from "next/font/google";
import { Property as PropertyType } from "@/modules/properties/defs/types";
import { useTranslation } from "next-i18next";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface PropertyPriceHistoryProps {
  property: PropertyType;
}

const PropertyPriceHistory = ({ property }: PropertyPriceHistoryProps) => {
  const { t } = useTranslation(['properties']);

  return (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="bg-white p-4 rounded-lg shadow-sm mb-8">
      <h3 className={`${poppins.className} text-lg font-bold mb-3`}>{t('showcase.price_history.title')}</h3>
      <div className="flex gap-6 overflow-x-auto pb-3">
        {property.priceHistory.map((entry: any, i: number) => {
          const pct = (Number(entry.price) / Number(property.salePrice)) * 80;
          return (
            <div key={i} className="flex flex-col items-center min-w-[80px]">
              <div className="h-20 w-1 bg-primary-200 relative">
                <div
                  className="absolute bottom-0 w-full bg-primary-500 transition-all duration-500"
                  style={{ height: `${pct}%` }}
                />
              </div>
              <div className="mt-2 text-xs font-medium">{entry.recordedAt.slice(0, 4)}</div>
              <div className="text-xs text-primary-500">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: property.currency,
                  maximumFractionDigits: 0,
                }).format(Number(entry.price))}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default PropertyPriceHistory; 