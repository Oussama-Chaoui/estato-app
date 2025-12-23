"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "../lib/utils/twMerge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useDirection } from "@/common/contexts/DirectionContext"

export interface ComboboxOption {
  value: string
  label: string
  group?: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  className?: string
  disabled?: boolean
  variant?: "default" | "input"
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  className,
  disabled = false,
  variant = "default",
  startIcon,
  endIcon,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const { isRTL } = useDirection()

  // Group options by group if specified
  const groupedOptions = React.useMemo(() => {
    const groups: Record<string, ComboboxOption[]> = {}
    
    options.forEach((option) => {
      const group = option.group || "default"
      if (!groups[group]) {
        groups[group] = []
      }
      groups[group].push(option)
    })
    
    return groups
  }, [options])

  const selectedOption = React.useMemo(() => {
    return options.find((option) => option.value === value)
  }, [options, value])

  if (variant === "input") {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            {/* Start Icon */}
            {startIcon && (
              <div className={cn(
                "absolute top-1/2 transform -translate-y-1/2 pointer-events-none",
                isRTL ? "right-3" : "left-3"
              )}>
                {startIcon}
              </div>
            )}
            
            {/* End Icon - Show custom endIcon or default chevron only if no startIcon */}
            {endIcon ? (
              <div className={cn(
                "absolute top-1/2 transform -translate-y-1/2 pointer-events-none",
                isRTL ? "left-3" : "right-3"
              )}>
                {endIcon}
              </div>
            ) : !startIcon && (
              <div className={cn(
                "absolute top-1/2 transform -translate-y-1/2 pointer-events-none",
                isRTL ? "left-3" : "right-3"
              )}>
                <ChevronsUpDown className="h-4 w-4 text-gray-500" />
              </div>
            )}
            
            <button
              role="combobox"
              aria-expanded={open}
              className={cn(
                "w-full h-12 text-base border-0 bg-white/50 focus:bg-white transition-all duration-300 rounded-xl placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50",
                isRTL ? "text-right" : "text-left",
                startIcon ? (isRTL ? "!pr-10" : "!pl-10") : (isRTL ? "!pr-4" : "!pl-4"),
                className
              )}
              disabled={disabled}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              {Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
                <CommandGroup key={groupName} heading={groupName !== "default" ? groupName : undefined}>
                  {groupOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={(currentValue) => {
                        onValueChange(currentValue === value ? "" : currentValue)
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          <div className="flex items-center gap-2">
            {startIcon && startIcon}
            <span>{selectedOption ? selectedOption.label : placeholder}</span>
          </div>
          {endIcon ? endIcon : !startIcon && <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            {Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
              <CommandGroup key={groupName} heading={groupName !== "default" ? groupName : undefined}>
                {groupOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      onValueChange(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 