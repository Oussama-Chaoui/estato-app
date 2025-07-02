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

export interface Country {
  code: string
  name: string
  dialCode: string
  flagUrl: string
}

const countries: Country[] = [
  { code: "MA", name: "Morocco", dialCode: "+212", flagUrl: "https://flagcdn.com/ma.svg" },
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
    const triggerBorder = error
      ? "border border-destructive focus:ring-2 focus:ring-destructive/80"
      : "border border-input focus:ring-2 focus:ring-primarySite/80"

    const CountrySelector = (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "h-12 min-w-[110px] justify-between rounded-lg pr-2 pl-3",
              triggerBorder
            )}
          >
            <span className="flex items-center gap-2">
              <img
                src={selectedCountry.flagUrl}
                alt={selectedCountry.name}
                className="w-6 h-4 rounded-sm object-cover"
              />
              <span className="text-sm font-medium">
                {selectedCountry.dialCode}
              </span>
            </span>
            <ChevronDown className="w-4 h-4 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-60 w-72 overflow-y-auto">
          {countries.map((c) => (
            <DropdownMenuItem
              key={c.code}
              onClick={() => onCountryChange(c)}
              className="flex items-center gap-3"
            >
              <img
                src={c.flagUrl}
                alt={c.name}
                className="w-6 h-4 rounded-sm object-cover"
              />
              <span className="flex-1">{c.name}</span>
              <span className="text-muted-foreground">{c.dialCode}</span>
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
        className={cn("pl-[135px] py-8", className)}
      />
    )
  }
)
PhoneInput.displayName = "PhoneInput"

export { PhoneInput, countries }
