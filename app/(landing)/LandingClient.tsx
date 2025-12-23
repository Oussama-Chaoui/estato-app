"use client";
import { useEffect, useState } from "react";
import CategoriesBanner from "@/components/pages/landing/categories-banner";
import Footer from "@/components/common/layout/footer";
import Mosaic from "@/components/pages/landing/mosaic";
import ProductsGrid from "@/components/pages/landing/products-grid";
import JoinUs from "@/components/pages/landing/join-us";
import { useSettingsContext } from "@/common/contexts/SettingsContext";
import { WEBSITE_FOCUS } from "@/modules/settings/defs/types";
import HeroForSell from "@/components/pages/landing/sell/HeroForSell";
import HeroForRent from "@/components/pages/landing/rent/HeroForRent";
import HeroForDaily from "@/components/pages/landing/daily-rent/HeroForDaily";
import HeroForAll from "@/components/pages/landing/all/HeroForAll";
import FeaturesForSell from "@/components/pages/landing/sell/FeaturesForSell";
import FeaturesForRent from "@/components/pages/landing/rent/FeaturesForRent";
import FeaturesForDaily from "@/components/pages/landing/daily-rent/FeaturesForDaily";
import FeaturesForAll from "@/components/pages/landing/all/FeaturesForAll";
import useProperties from "@/modules/properties/hooks/api/useProperties";
import { Property } from "@/modules/properties/defs/types";

const LandingClient = () => {
  const { websiteFocus } = useSettingsContext();
  const { readAllFeatured } = useProperties();
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);

  useEffect(() => {
    if (websiteFocus) {
      fetchFeaturedProperties();
    }
  }, [websiteFocus]);

  const fetchFeaturedProperties = async () => {
    try {
      const response = await readAllFeatured(websiteFocus);
      if (response.data?.items) {
        setFeaturedProperties(response.data.items);
      }
    } catch (error) {
      console.error('Error fetching featured properties:', error);
    }
  };

  return (
    <div className="bg-slate-200 min-h-screen w-full">
      {websiteFocus === WEBSITE_FOCUS.SELLING && (
        <>
          <HeroForSell />
          <CategoriesBanner websiteFocus={websiteFocus} />
          <FeaturesForSell />
        </>
      )}
      {websiteFocus === WEBSITE_FOCUS.RENT && (
        <>
          <HeroForRent />
          <CategoriesBanner websiteFocus={websiteFocus} />
          <FeaturesForRent />
        </>
      )}
      {websiteFocus === WEBSITE_FOCUS.DAILY_RENT && (
        <>
          <HeroForDaily />
          <CategoriesBanner websiteFocus={websiteFocus} />
          <FeaturesForDaily />
        </>
      )}
      {websiteFocus === WEBSITE_FOCUS.ALL && (
        <>
          <HeroForAll />
          <CategoriesBanner websiteFocus={websiteFocus} />
          <FeaturesForAll />
        </>
      )}
      <ProductsGrid properties={featuredProperties} websiteFocus={websiteFocus || undefined} />
      {/* <Designs /> */}
      <JoinUs />
      <Mosaic />
      <Footer />
    </div>
  );
};

export default LandingClient;


