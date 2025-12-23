"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { useTranslation } from "react-i18next"
import { useI18n } from "@/common/providers/I18nProvider"
import useUtils from "@/common/hooks/useUtils"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "../lib/utils/twMerge"

export interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  date?: DateRange
  onDateChange?: (date: DateRange | undefined) => void
  placeholder?: string
  hideIcon?: boolean
}

export function DatePickerWithRange({
  className,
  date,
  onDateChange,
  placeholder,
  hideIcon = false,
}: DatePickerWithRangeProps) {
  const { t } = useTranslation(['common'])
  const { currentLocale } = useI18n()
  const { getDateFnsLocale } = useUtils()
  
  // Use provided placeholder or fallback to translation
  const displayPlaceholder = placeholder || t('common:date_picker.pick_date_range')

  // Format date with proper locale
  const formatDate = (date: Date, formatString: string) => {
    return format(date, formatString, { locale: getDateFnsLocale() })
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal min-h-[40px] h-auto py-2 text-sm border-0 bg-white/80 hover:bg-white focus:bg-white transition-all duration-300 rounded-xl shadow-sm text-gray-700 break-words",
              !date && "text-gray-500"
            )}
          >
            {!hideIcon && <CalendarIcon className="mr-2 h-4 w-4 text-gray-600 flex-shrink-0" />}
            <span className="truncate sm:whitespace-normal sm:break-words">
              {date?.from ? (
                date.to ? (
                  <>
                    {formatDate(date.from, "LLL dd, y")} -{" "}
                    {formatDate(date.to, "LLL dd, y")}
                  </>
                ) : (
                  formatDate(date.from, "LLL dd, y")
                )
              ) : (
                <span className="text-gray-500">{displayPlaceholder}</span>
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
            showOutsideDays={false}
            locale={getDateFnsLocale()}
            formatters={{
              formatMonthDropdown: (date) =>
                date.toLocaleString(currentLocale, { month: "short" }),
              formatWeekdayName: (date) =>
                date.toLocaleString(currentLocale, { weekday: "short" }),
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
