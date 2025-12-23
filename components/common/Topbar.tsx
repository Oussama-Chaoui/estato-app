"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { Poppins } from "next/font/google";
import { cn } from "../lib/utils/twMerge";
import { Heart, MenuIcon, Phone, Mail, BookOpen, Check } from "lucide-react";
import Image from "next/image";
import Routes from "@/common/defs/routes";
import PropertyRoutes from "@/modules/properties/defs/routes";
import { WEBSITE_FOCUS } from "@/modules/settings/defs/types";
import { useTranslation } from "react-i18next";
import { setUserLanguage } from "@/common/components/lib/utils/language";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import SVG from "./svg";
import FavoritesSidebar from "./partials/FavoritesSidebar";
import { useFavorites } from "@/modules/properties/hooks/useFavorites";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useI18n } from "@/common/providers/I18nProvider";
import { useRTLFont } from "@/common/utils/rtl";
import { useDirection } from "@/common/contexts/DirectionContext";

const poppins = Poppins({ subsets: ['latin'], weight: ["300", "400", "500", "600", "700"] });

const languages = [
  { code: 'en', name: 'English', countryCode: 'us' },
  { code: 'fr', name: 'Français', countryCode: 'fr' },
  { code: 'es', name: 'Español', countryCode: 'es' },
  { code: 'ar', name: 'العربية', countryCode: 'ma' },
];

interface TopbarProps {
  focus?: WEBSITE_FOCUS;
}

const Topbar = ({ focus = WEBSITE_FOCUS.DAILY_RENT }: TopbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const { count: favoritesCount } = useFavorites();
  const pathname = usePathname();
  const { t } = useTranslation(['topbar']);
  const { currentLocale, changeLocale } = useI18n();
  const { getFontClass } = useRTLFont();
  const { isRTL } = useDirection();

  const handleLanguageChange = async (locale: string) => {
    await changeLocale(locale);
    setUserLanguage(locale);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update activeLink when pathname changes
  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  // Define navigation items based on focus
  const getNavigationLinks = () => {
    const items = [
      { href: PropertyRoutes.DailyRent.ReadAll, label: t('topbar:navigation.daily_rentals') },
      { href: PropertyRoutes.MonthlyRent.ReadAll, label: t('topbar:navigation.monthly_rentals') },
      { href: PropertyRoutes.HomeSale.ReadAll, label: t('topbar:navigation.home_sales') },
    ];

    // Reorder based on focus
    switch (focus) {
      case WEBSITE_FOCUS.DAILY_RENT:
        return [
          items[0], // Daily Rentals first
          items[1], // Monthly Rentals
          items[2], // Home Sales
        ];
      case WEBSITE_FOCUS.RENT:
        return [
          items[1], // Monthly Rentals first
          items[0], // Daily Rentals
          items[2], // Home Sales
        ];
      case WEBSITE_FOCUS.SELLING:
        return [
          items[2], // Home Sales first
          items[1], // Monthly Rentals
          items[0], // Daily Rentals
        ];
      default:
        return items;
    }
  };

  const navigationLinks = getNavigationLinks();

  const blogButton = {
    icon: BookOpen,
    label: t('topbar:navigation.blog'),
    href: Routes.Posts.ReadAll,
    count: null,
  };

  const mobileMenuLinks = [
    { href: "/", label: t('topbar:navigation.home'), icon: "🏠" },
    ...navigationLinks.map(({ href, label }) => ({ href, label, icon: "📋" })),
    { href: Routes.Posts.ReadAll, label: t('topbar:navigation.blog'), icon: "📝" },
    { href: "/join-us", label: t('topbar:navigation.join_team'), icon: "🤝" },
    // { href: "/profile", label: "Profile", icon: "👤" },
  ];

  const Logo = () => (
    <div className="flex items-center gap-3">
      <div className="md:block hidden">
        <SVG name="logo" />
      </div>
      <div className="block md:hidden">
        <SVG name="logo" height={28} width={35} />
      </div>
      <div className="hidden sm:block">
        <h1 className={cn("text-xl xl:text-xl lg:text-lg font-bold text-gray-900", getFontClass(poppins.className))}>
          YAKOUT
        </h1>
        <p className="text-xs lg:text-xs xl:text-xs text-gray-500 font-medium tracking-wider">IMMOBILIER</p>
      </div>
    </div>
  );

  const Navigation = () => (
    <nav className="flex items-center space-x-1">
      {navigationLinks.map(({ href, label }, index) => (
        <div key={index} className="flex items-center">
          <Link href={href} onClick={() => setActiveLink(href)}>
            <Button
              className={cn(
                getFontClass(poppins.className),
                "relative text-gray-700 font-medium text-sm lg:text-xs xl:text-sm px-4 lg:px-3 xl:px-4 py-3 lg:py-2 xl:py-3 h-auto bg-transparent hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700 transition-all duration-300 rounded-xl group",
                activeLink === href && "text-primary-600 bg-gradient-to-r from-primary-50 to-primary-100"
              )}
              variant="ghost"
            >
              {label}
              <div
                className={cn(
                  "absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full transition-all duration-200",
                  activeLink === href ? "scale-100 opacity-100" : "scale-0 opacity-0"
                )}
              />
            </Button>
          </Link>
          {index < navigationLinks.length - 1 && (
            <div className="w-px h-6 lg:h-5 xl:h-6 bg-gray-300 mx-2 lg:mx-1 xl:mx-2"></div>
          )}
        </div>
      ))}
    </nav>
  );



  const NavActions = () => (
    <div className="flex items-center space-x-2 lg:space-x-1 xl:space-x-2">
      {/* Divider before Blog button */}
      <div className="w-px h-6 lg:h-5 xl:h-6 bg-gray-300"></div>

      {/* Blog button */}
      <div className="flex items-center space-x-2 lg:space-x-1 xl:space-x-2">
        <Link href={blogButton.href} passHref>
          <Button
            className={cn(
              getFontClass(poppins.className),
              "relative text-gray-700 font-medium text-sm lg:text-xs xl:text-sm px-4 lg:px-3 xl:px-4 py-3 lg:py-2 xl:py-3 h-auto bg-transparent hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700 transition-all duration-300 rounded-xl group",
              activeLink === blogButton.href && "text-primary-600 bg-gradient-to-r from-primary-50 to-primary-100"
            )}
            variant="ghost"
          >
            {blogButton.label}
            <div
              className={cn(
                "absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full transition-all duration-200",
                activeLink === blogButton.href ? "scale-100 opacity-100" : "scale-0 opacity-0"
              )}
            />
          </Button>
        </Link>
        <div className="w-px h-6 lg:h-5 xl:h-6 bg-gray-300"></div>
      </div>

      {/* Favorites Button */}
      <div className="flex items-center space-x-2 lg:space-x-1 xl:space-x-2">
        <FavoritesSidebar
          trigger={
            <Button
              variant="ghost"
              className={cn(
                "relative w-11 h-11 lg:w-10 lg:h-10 xl:w-11 xl:h-11 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-105 active:scale-95",
                "bg-white/80 hover:bg-white text-gray-600 hover:text-primary-600 border border-transparent hover:border-gray-100"
              )}
              aria-label={t('topbar:navigation.favorites')}
            >
              <Heart className="w-5 h-5 lg:w-4 lg:h-4 xl:w-5 xl:h-5" />
              {favoritesCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 lg:w-4 lg:h-4 xl:w-5 xl:h-5 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xs lg:text-xs xl:text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                  {favoritesCount}
                </div>
              )}
            </Button>
          }
          navigationLinks={navigationLinks}
        />
        <div className="w-px h-6 lg:h-5 xl:h-6 bg-gray-300"></div>
      </div>

      {/* Language Switcher */}
      <div className="flex items-center space-x-2 lg:space-x-1 xl:space-x-2">
        <LanguageSwitcher />
        <div className="w-px h-6 lg:h-5 xl:h-6 bg-gray-300"></div>
      </div>

      {/* Join Team Button */}
      <div className="flex items-center space-x-2 lg:space-x-1 xl:space-x-2">
        <Link href="/join-us" passHref>
          <Button
            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-4 lg:px-3 xl:px-4 py-2 lg:py-1.5 xl:py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 font-medium text-sm lg:text-xs xl:text-sm"
            aria-label={t('topbar:navigation.join_team')}
          >
            {t('topbar:navigation.join_team')}
          </Button>
        </Link>
      </div>
    </div>
  );

  const MobileFavorites = () => (
    <FavoritesSidebar
      trigger={
        <Button
          variant="ghost"
          className="w-11 h-11 rounded-xl bg-white/80 hover:bg-white hover:shadow-lg text-gray-600 hover:text-primary-600 transition-all duration-300 relative border border-transparent hover:border-gray-100 hover:scale-105 active:scale-95"
        >
          <Heart className="w-5 h-5" />
          {favoritesCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
              {favoritesCount}
            </div>
          )}
        </Button>
      }
      navigationLinks={navigationLinks}
    />
  );

  const MobileMenu = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="w-11 h-11 rounded-xl bg-gray-50/80 hover:bg-white hover:shadow-lg text-gray-600 hover:text-primary-600 transition-all duration-300 border border-transparent hover:border-gray-100 hover:scale-105 active:scale-95"
        >
          <MenuIcon className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side={isRTL ? "left" : "right"} isRTL={isRTL} className="w-80 bg-white border-l border-gray-200">
        <div className="w-full h-full flex flex-col pt-8 overflow-hidden">
          <SheetHeader className="mb-8 flex-shrink-0">
            <div className="flex items-center gap-3">
              <SVG name="logo" height={28} width={35} />
              <div>
                <SheetTitle className={cn("text-xl font-bold text-gray-900", getFontClass(poppins.className))}>
                  YAKOUT
                </SheetTitle>
                <p className="text-xs text-gray-500 font-medium">IMMOBILIER</p>
              </div>
            </div>
          </SheetHeader>

          <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 pr-2">
            <div className="space-y-2 pb-4">
              {mobileMenuLinks.map(({ href, label, icon }, index) => (
                <div key={index} className="animate-in slide-in-from-right-2 duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                  <Link href={href}>
                    <Button
                      className={cn(
                        getFontClass(poppins.className),
                        "w-full justify-start text-left text-gray-700 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 font-medium text-base py-4 px-4 rounded-xl transition-all duration-300 group"
                      )}
                      variant="ghost"
                    >
                      <span className="text-lg mr-3">{icon}</span>
                      {label}
                      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {isRTL ? '←' : '→'}
                      </div>
                    </Button>
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl">
              <h4 className="font-semibold text-primary-700 mb-2">{t('topbar:contact.title')}</h4>
              <div className="space-y-2 text-sm text-primary-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{t('topbar:contact.phone')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{t('topbar:contact.email')}</span>
                </div>
              </div>
            </div>

            {/* Language Switcher for Mobile */}
            <div className="mt-4 p-4 bg-gray-50 rounded-xl mb-4">
              <h4 className="font-semibold text-gray-700 mb-3">{t('topbar:mobile.language')}</h4>
              <div className="space-y-2">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                      currentLocale === language.code
                        ? "bg-primary-100 text-primary-700"
                        : "hover:bg-gray-100 text-gray-700"
                    )}
                  >
                    <Image
                      src={`https://flagcdn.com/w20/${language.countryCode}.png`}
                      alt={`${language.name} flag`}
                      width={20}
                      height={15}
                      className="rounded-sm"
                    />
                    <span className="flex-1 text-left">{t(`common:languages.${language.code}`)}</span>
                    {currentLocale === language.code && (
                      <Check className="w-4 h-4 text-primary-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          <SheetFooter className="mt-auto pb-8 flex-shrink-0">
            <div className="w-full text-center">
              <p className="text-xs text-gray-500 mb-2">
                © 2024 YAKOUT. All rights reserved.
              </p>
              <div className="flex justify-center space-x-4 text-xs text-gray-400">
                <a href="#" className="hover:text-primary-600 transition-colors">{t('topbar:footer.privacy')}</a>
                <a href="#" className="hover:text-primary-600 transition-colors">{t('topbar:footer.terms')}</a>
                <a href="#" className="hover:text-primary-600 transition-colors">{t('topbar:footer.support')}</a>
              </div>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-out",
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-xl border-b border-gray-100/50 h-16"
          : "bg-gradient-to-b from-white via-white/95 to-white/90 backdrop-blur-sm h-20"
      )}
    >
      <div className="mx-auto h-full flex items-center justify-between px-4 sm:px-6 lg:px-8 relative">
        {/* Logo */}
        <div className="flex-shrink-0 z-10">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center space-x-3 lg:space-x-2 xl:space-x-3">
          <Navigation />
          <NavActions />
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center space-x-2 lg:hidden">
          <MobileFavorites />
          <MobileMenu />
        </div>
      </div>

      {/* Subtle gradient line at bottom */}
      {isScrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent" />
      )}
    </div>
  );
};

export default Topbar;