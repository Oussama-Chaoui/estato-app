"use client";
import LogoLoading from "@/common/components/lib/feedbacks/LogoLoading";
import { useSettingsContext } from "@/common/contexts/SettingsContext";
import { useI18n } from "@/common/providers/I18nProvider";
import Topbar from "@/components/common/Topbar";
import { WEBSITE_FOCUS } from "@/modules/settings/defs/types";

interface LayoutContentProps {
  children: React.ReactNode;
}

export default function LayoutContent({ children }: LayoutContentProps) {
  const { isLoading: isSettingsLoading } = useSettingsContext();
  const { isI18nLoading } = useI18n();

  const isLoading = isI18nLoading || isSettingsLoading;

  if (isLoading) {
    return (
      <>
        <LogoLoading />
      </>
    );
  }

  return (
    <>
      <Topbar focus={WEBSITE_FOCUS.DAILY_RENT} />
      <main className="min-h-screen w-full">{children}</main>
    </>
  );
} 