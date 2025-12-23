"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useI18n } from "@/common/providers/I18nProvider"
import useUtils from "@/common/hooks/useUtils"

import { cn } from "@/components/lib/utils/twMerge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function DatePicker({
  date,
  onDateChange,
  placeholder,
  className,
  disabled = false,
}: DatePickerProps) {
  const { t } = useTranslation(['common'])
  const { currentLocale } = useI18n()
  const { getDateFnsLocale } = useUtils()
  
  // Use provided placeholder or fallback to translation
  const displayPlaceholder = placeholder || t('common:date_picker.select_dates')

  // Format date with proper locale
  const formatDate = (date: Date, formatString: string) => {
    return format(date, formatString, { locale: getDateFnsLocale() })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            className,
            "w-full h-12 px-4 justify-start text-left font-normal bg-white/50 hover:bg-white focus:bg-white transition-all duration-300 rounded-xl min-w-0 hover:text-foreground focus:text-foreground",
            !date && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0 text-gray-500" />
          <span className="truncate">
            {date ? formatDate(date, "MMM dd, yyyy") : <span>{displayPlaceholder}</span>}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          initialFocus
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
  )
} 