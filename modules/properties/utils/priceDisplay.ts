import { WEBSITE_FOCUS } from "@/modules/settings/defs/types";
import { useDirection } from "@/common/contexts/DirectionContext";

interface PriceDisplayProps {
  websiteFocus: WEBSITE_FOCUS;
  salePrice: number;
  monthlyPrice: number;
  dailyPrice: number;
  monthlyPriceEnabled: boolean;
  dailyPriceEnabled: boolean;
  currency?: string;
  t?: (key: string) => string;
}

export const getPriceDisplay = ({
  websiteFocus,
  salePrice,
  monthlyPrice,
  dailyPrice,
  monthlyPriceEnabled,
  dailyPriceEnabled,
  currency = 'MAD',
  t
}: PriceDisplayProps): { price: string; timeUnit?: string } => {
  // Use Arabic currency abbreviation only for RTL languages (Arabic)
  const { isRTL } = useDirection();
  const displayCurrency = currency === 'MAD' && isRTL ? 'د.م' : currency;
  
  switch (websiteFocus) {
    case WEBSITE_FOCUS.DAILY_RENT:
      const dailyPriceValue = dailyPriceEnabled ? dailyPrice : monthlyPrice;
      const dailyLabel = dailyPriceEnabled ? " / night" : " / month";
      return {
        price: `${Number(dailyPriceValue).toLocaleString()} ${displayCurrency}`,
        timeUnit: t ? ` ${dailyPriceEnabled ? t('common:price.per_night') : t('common:price.per_month')}` : dailyLabel
      };

    case WEBSITE_FOCUS.RENT:
      const monthlyPriceValue = monthlyPriceEnabled ? monthlyPrice : dailyPrice;
      const monthlyLabel = monthlyPriceEnabled ? " / month" : " / night";
      return {
        price: `${Number(monthlyPriceValue).toLocaleString()} ${displayCurrency}`,
        timeUnit: t ? ` ${monthlyPriceEnabled ? t('common:price.per_month') : t('common:price.per_night')}` : monthlyLabel
      };

    case WEBSITE_FOCUS.SELLING:
    case WEBSITE_FOCUS.ALL:
    default:
      return {
        price: `${Number(salePrice).toLocaleString()} ${displayCurrency}`
      };
  }
}; 