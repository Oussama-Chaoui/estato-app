"use client";
import { cn } from "@/components/lib/utils/twMerge";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { motion } from "framer-motion";
import { Instagram, Facebook, Linkedin, MapPin } from "lucide-react";
import { useTranslation } from "next-i18next";
import { useRTLFont } from "@/common/utils/rtl";
import { useDirection } from "@/common/contexts/DirectionContext";
import { WEBSITE_FOCUS } from "@/modules/settings/defs/types";
import Routes from "@/common/defs/routes";
import { useSettingsContext } from "@/common/contexts/SettingsContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const Footer = () => {
  const { t } = useTranslation('footer');
  const { getFontClass } = useRTLFont();
  const { isRTL } = useDirection();
  const { websiteFocus } = useSettingsContext();

  const getListingRoute = () => {
    switch (websiteFocus) {
      case WEBSITE_FOCUS.DAILY_RENT:
        return Routes.Properties.DailyRent.ReadAll;
      case WEBSITE_FOCUS.RENT:
        return Routes.Properties.MonthlyRent.ReadAll;
      case WEBSITE_FOCUS.SELLING:
        return Routes.Properties.HomeSale.ReadAll;
      case WEBSITE_FOCUS.ALL:
        return Routes.Properties.DailyRent.ReadAll;
      default:
        return Routes.Properties.DailyRent.ReadAll;
    }
  };

  const getLuxuryVillasUrl = () => {
    const baseRoute = getListingRoute();
    const params = new URLSearchParams();
    params.append('propertyType', 'VILLA');
    return `${baseRoute}?${params.toString()}`;
  };

  const links = [
    { href: Routes.Common.Home, label: t('links.home') },
    { href: getLuxuryVillasUrl(), label: t('links.luxury_villas') },
    { href: Routes.Common.About, label: t('links.our_agents') },
    { href: Routes.Common.Contact, label: t('links.consultation') },
  ];

  const helps = [
    { href: Routes.Common.PrivacyPolicy, label: t('links.privacy_policy') },
    { href: Routes.Common.TermsOfService, label: t('links.investment_guide') },
    { href: Routes.Common.FAQ, label: t('links.vip_services') },
  ];

  return (
    <footer
      className={cn(
        getFontClass(poppins.className),
        "w-full md:px-12 px-8 md:py-10 py-5 flex items-center justify-center bg-gray-50 border-t border-primary-200 relative overflow-hidden"
      )}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5 z-0">
        <div className="pattern-dots pattern-primary-500 pattern-opacity-20 pattern-size-4 w-full h-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-screen-2xl w-full flex flex-col gap-y-8 relative z-10"
      >
        {/* Top Section */}
        <div className="w-full grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Brand Section */}
          <div className="flex flex-col gap-y-5">
            <motion.h1
              whileHover={{ scale: 1.05 }}
              className={cn(
                "text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent",
                isRTL ? "origin-right" : "origin-left"
              )}
            >
              Yakout.
            </motion.h1>
            <p className="text-gray-600 text-xs leading-relaxed max-w-xs">
              {t('brand.description')}
            </p>
            <div className="flex items-center gap-2 text-gray-500">
              <MapPin className="w-3 h-3 text-primary-500" />
              <p className="text-xs">{t('brand.address')}</p>
            </div>
            <div className="flex gap-3 mt-3">
              <motion.button whileHover={{ y: -2 }} className="p-1.5 rounded-full bg-primary-100 hover:bg-primary-200 transition">
                <Instagram className="w-4 h-4 text-primary-500" />
              </motion.button>
              <motion.button whileHover={{ y: -2 }} className="p-1.5 rounded-full bg-primary-100 hover:bg-primary-200 transition">
                <Facebook className="w-4 h-4 text-primary-500" />
              </motion.button>
              <motion.button whileHover={{ y: -2 }} className="p-1.5 rounded-full bg-primary-100 hover:bg-primary-200 transition">
                <Linkedin className="w-4 h-4 text-primary-500" />
              </motion.button>
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-y-3">
              <h3 className="text-base font-semibold text-gray-800 border-l-4 border-primary-500 pl-3">{t('sections.discover')}</h3>
              {links.map(({ href, label }, index) => (
                <motion.div key={index} whileHover={{ x: isRTL ? -5 : 5 }}>
                  <Link href={href}>
                    <Button
                      className={cn(
                        "text-gray-700 font-medium text-xs pl-0 hover:text-primary-500 transition-all justify-start"
                      )}
                      variant={"link"}
                    >
                      {label}
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col gap-y-3">
              <h3 className="text-base font-semibold text-gray-800 border-l-4 border-primary-500 pl-3">{t('sections.services')}</h3>
              {helps.map(({ href, label }, index) => (
                <motion.div key={index} whileHover={{ x: isRTL ? -5 : 5 }}>
                  <Link href={href}>
                    <Button
                      className={cn(
                        "text-gray-700 font-medium text-xs pl-0 hover:text-primary-500 transition-all justify-start"
                      )}
                      variant={"link"}
                    >
                      {label}
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="flex flex-col gap-y-3">
            <h3 className="text-base font-semibold text-gray-800 border-l-4 border-primary-500 pl-3">{t('sections.insights')}</h3>
            <p className="text-xs text-gray-600">
              {t('newsletter.description')}
            </p>
            <div className="flex flex-col w-full gap-2">
              <Input
                type="email"
                placeholder={t('newsletter.placeholder')}
                className="text-xs border-gray-300 bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:opacity-90 transition-all text-xs">
                  {t('newsletter.subscribe')}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          className="w-full flex flex-col md:flex-row justify-between items-center pt-5 border-t border-primary-200 text-xs text-gray-600"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <p>{t('legal.copyright', { year: new Date().getFullYear() })}</p>
          <div className="flex gap-3">
            <Link href="/terms-of-service">
              <motion.span whileHover={{ color: "rgb(33 128 125)" }} className="cursor-pointer">
                {t('legal.terms_of_service')}
              </motion.span>
            </Link>
            <Link href="/privacy-policy">
              <motion.span whileHover={{ color: "rgb(33 128 125)" }} className="cursor-pointer">
                {t('legal.privacy_policy')}
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;