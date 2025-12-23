"use client";

import React, { useState, useEffect, useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import useProperties, {
  AvailabilityEntry,
} from "@/modules/properties/hooks/api/useProperties";
import { cn } from "@/components/lib/utils/twMerge";
import { useTranslation } from "next-i18next";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const TZ = "Africa/Casablanca";

interface AvailabilityCalendarProps {
  propertyId: number;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  propertyId,
}) => {
  const { t } = useTranslation(['properties']);
  const [viewDate, setViewDate] = useState<Dayjs>(() => dayjs().tz(TZ));
  const [slots, setSlots] = useState<AvailabilityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { getAvailability } = useProperties();

  // Get translated month names
  const monthNames = [
    t('showcase.availability.calendar.months.january'),
    t('showcase.availability.calendar.months.february'),
    t('showcase.availability.calendar.months.march'),
    t('showcase.availability.calendar.months.april'),
    t('showcase.availability.calendar.months.may'),
    t('showcase.availability.calendar.months.june'),
    t('showcase.availability.calendar.months.july'),
    t('showcase.availability.calendar.months.august'),
    t('showcase.availability.calendar.months.september'),
    t('showcase.availability.calendar.months.october'),
    t('showcase.availability.calendar.months.november'),
    t('showcase.availability.calendar.months.december'),
  ];

  // Get translated day names
  const dayNames = [
    t('showcase.availability.calendar.days.sun'),
    t('showcase.availability.calendar.days.mon'),
    t('showcase.availability.calendar.days.tue'),
    t('showcase.availability.calendar.days.wed'),
    t('showcase.availability.calendar.days.thu'),
    t('showcase.availability.calendar.days.fri'),
    t('showcase.availability.calendar.days.sat'),
  ];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await getAvailability(
          propertyId,
          viewDate.year(),
          viewDate.month() + 1
        );
        if (!cancelled && res.success && res.data) {
          setSlots(res.data.availability);
        }
      } catch (err) {
        console.error("Error fetching availability", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [propertyId, viewDate]);

  const monthStart = viewDate.startOf("month");
  const monthEnd = viewDate.endOf("month");
  const padStart = monthStart.day();
  const daysInMonth = monthEnd.date();

  const calendarDays = useMemo<(Dayjs | null)[]>(() => {
    const list: (Dayjs | null)[] = [];
    for (let i = 0; i < padStart; i++) list.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      list.push(monthStart.date(d));
    }
    while (list.length % 7 !== 0) list.push(null);
    return list;
  }, [padStart, daysInMonth, monthStart]);

  const toLocal = (iso: string) =>
    dayjs.tz(iso.replace(/Z$/, ""), TZ);

  const bookingsOn = (d: Dayjs) => {
    const cellStart = d.startOf("day");
    const cellEnd = d.endOf("day");
    return slots.filter((s) => {
      const startLocal = toLocal(s.startDate).startOf("day");
      const endLocal = toLocal(s.endDate).endOf("day");
      return startLocal.isSameOrBefore(cellEnd) && endLocal.isSameOrAfter(cellStart);
    });
  };

  const prevMonth = () => setViewDate((v) => v.subtract(1, "month").tz(TZ));
  const nextMonth = () => setViewDate((v) => v.add(1, "month").tz(TZ));

  const moroccoOffset = dayjs().tz(TZ).format("Z");


  return (
    <div className="w-full bg-card rounded-lg border border-input shadow-md overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-primaryLight border-b border-input">
        <button
          onClick={prevMonth}
          className="p-1.5 rounded-full hover:bg-primarySite/20 transition-colors"
        >
          <ChevronLeft className="text-primarySite w-4 h-4" />
        </button>
        <h4 className="text-base font-bold text-foreground">
          {monthNames[viewDate.month()]} {viewDate.year()}
        </h4>
        <button
          onClick={nextMonth}
          className="p-1.5 rounded-full hover:bg-primarySite/20 transition-colors"
        >
          <ChevronRight className="text-primarySite w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 bg-accent">
        {dayNames.map((w) => (
          <div
            key={w}
            className="text-xs font-medium text-center py-2 text-muted-foreground"
          >
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 p-1.5">
        {loading ?
          [...Array(calendarDays.length)].map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-lg" />
          ))
          : calendarDays.map((d, i) => {
            if (!d) {
              return (
                <div
                  key={i}
                  className="h-12 bg-transparent rounded-lg"
                />
              );
            }

            const today = dayjs().tz(TZ).isSame(d, "day");
            const inMonth = d.month() === viewDate.month();
            const weekend = d.day() === 0 || d.day() === 6;
            const bookings = bookingsOn(d);
            const hasBookings = bookings.length > 0;

            return (
              <TooltipProvider key={d.toString()}>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "h-12 flex flex-col items-center justify-center rounded-lg transition-all",
                        weekend ? "bg-accent" : "bg-card",
                        inMonth ? "opacity-100" : "opacity-40",
                        today && "ring-2 ring-primary-500",
                        hasBookings
                          ? "bg-primarySite/20 cursor-pointer hover:bg-primaryLight/60"
                          : ""
                      )}
                    >
                      <span
                        className={cn(
                          "text-xs font-medium",
                          today ? "text-primarySite font-bold" : "text-foreground",
                          hasBookings && "text-primarySite"
                        )}
                      >
                        {d.date()}
                      </span>
                      {hasBookings && (
                        <div className="flex gap-0.5 mt-0.5">
                          {bookings.slice(0, 3).map((_, idx) => (
                            <div
                              key={idx}
                              className="w-0.5 h-0.5 rounded-full bg-primarySite"
                            />
                          ))}
                          {bookings.length > 3 && (
                            <span className="text-xs text-primarySite font-bold">
                              +{bookings.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>

                  <TooltipContent
                    side="top"
                    className="bg-popover border border-input shadow-lg p-2"
                  >
                    <div className="text-xs font-medium text-black text-center mb-1">
                      {d.format("MMMM D, YYYY")}
                    </div>

                    {bookings.length === 0 ? (
                      <div className="text-xs text-muted-foreground">
                        {t('showcase.availability.calendar.available_all_day')}
                      </div>
                    ) : (
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {bookings.map((b, idx) => {
                          const start = toLocal(b.startDate).format("h:mm A");
                          const end = toLocal(b.endDate).format("h:mm A");
                          return (
                            <div
                              key={idx}
                              className="bg-primaryLight/30 p-1.5 rounded-md border-l-4 border-primarySite"
                            >
                              <div className="flex justify-between gap-3">
                                <span className="font-medium text-primarySite text-xs">
                                  {start}
                                </span>
                                <span className="text-muted-foreground text-xs">{t('showcase.availability.calendar.to')}</span>
                                <span className="font-medium text-primarySite text-xs">
                                  {end}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
      </div>

      <div className="p-2 border-t border-input bg-accent flex justify-end">
        <span className="text-xs text-muted-foreground text-right">
          {t('showcase.availability.calendar.timezone_info', { timezone: TZ, offset: moroccoOffset })}
        </span>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
