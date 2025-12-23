"use client";

import { Poppins } from "next/font/google";
import { useTranslation } from "next-i18next";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const PropertyLoading = () => {
  const { t } = useTranslation(['properties']);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#fafafa]">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
      <h2 className={`${poppins.className} text-2xl font-semibold text-gray-700`}>
        {t('showcase.loading.title')}
      </h2>
      <p className="text-gray-500">{t('showcase.loading.description')}</p>
    </div>
  );
};

export default PropertyLoading; 