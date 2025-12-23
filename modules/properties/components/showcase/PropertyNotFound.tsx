"use client";

import { Home } from "lucide-react";
import { Poppins } from "next/font/google";
import { useTranslation } from "next-i18next";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const PropertyNotFound = () => {
  const { t } = useTranslation(['properties']);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#fafafa] px-4 text-center">
      <div className="bg-primary-100 p-6 rounded-full">
        <Home className="w-16 h-16 text-primary-500" strokeWidth={1.5} />
      </div>
      <h2 className={`${poppins.className} text-3xl font-semibold text-gray-800`}>
        {t('showcase.not_found.title')}
      </h2>
      <p className="text-gray-600 max-w-md">
        {t('showcase.not_found.description')}
      </p>
      <a
        href="/properties"
        className="mt-4 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
      >
        {t('showcase.not_found.browse_button')}
      </a>
    </div>
  );
};

export default PropertyNotFound; 