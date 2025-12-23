// components/ui/phone-input.tsx
"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/components/lib/utils/twMerge"
import { useDirection } from "@/common/contexts/DirectionContext"

export interface Country {
  code: string
  name: string
  dialCode: string
  flagUrl: string
}

const countries: Country[] = [
  { code: "MA", name: "Morocco", dialCode: "+212", flagUrl: "https://flagcdn.com/ma.svg" },
  { code: "ES", name: "Spain", dialCode: "+34", flagUrl: "https://flagcdn.com/es.svg" },
  { code: "FR", name: "France", dialCode: "+33", flagUrl: "https://flagcdn.com/fr.svg" },
  { code: "US", name: "United States", dialCode: "+1", flagUrl: "https://flagcdn.com/us.svg" },
]

export interface PhoneInputProps extends Omit<React.ComponentProps<typeof Input>, "onChange"> {
  selectedCountry: Country
  onCountryChange: (c: Country) => void
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      selectedCountry,
      onCountryChange,
      placeholder = "Phone number",
      error,
      onChange,
      className,
      ...rest
    },
    ref
  ) => {
    const { isRTL } = useDirection()

    const CountrySelector = (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className={cn(
              "h-12 min-w-[110px] justify-between rounded-lg border-none shadow-none hover:bg-gray-50 transition-colors ltr"
            )}
            style={{
              paddingLeft: isRTL ? '0.75rem' : '0.75rem',
              paddingRight: isRTL ? '0.5rem' : '0.5rem',
            }}
            dir="ltr"
          >
            <span className="flex items-center gap-2">
              <img
                src={selectedCountry.flagUrl}
                alt={selectedCountry.name}
                className="w-5 h-4 rounded-sm object-cover shadow-sm"
              />
              <span className="text-sm font-medium text-gray-700">
                {selectedCountry.dialCode}
              </span>
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500 transition-transform duration-200" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-60 w-[140px] overflow-y-auto p-1">
          {countries.map((c) => (
            <DropdownMenuItem
              key={c.code}
              onClick={() => onCountryChange(c)}
              className="flex items-center justify-between w-full px-3 py-2.5 rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={c.flagUrl}
                  alt={c.name}
                  className="w-5 h-4 rounded-sm object-cover shadow-sm"
                />
                <span className="text-sm font-medium text-gray-700">{c.dialCode}</span>
              </div>
              {selectedCountry.code === c.code && (
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )

    return (
      <Input
        ref={ref}
        type="tel"
        inputMode="tel"
        label={placeholder}
        startAdornment={CountrySelector}
        error={error}
        onChange={onChange}
        labelLeftRest="135px"
        {...rest}
        className={cn("py-8 ltr", className)}
        style={{
          paddingLeft: '135px',
          paddingRight: '0.75rem',
        }}
        dir="ltr"
      />
    )
  }
)
PhoneInput.displayName = "PhoneInput"

export { PhoneInput, countries }
