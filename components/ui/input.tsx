// components/ui/input.tsx
"use client"

import * as React from "react"
import { cn } from "@/components/lib/utils/twMerge"
import { motion } from "framer-motion"

export interface InputProps extends React.ComponentProps<"input"> {
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
  label?: string
  error?: string
  /**
   * How far from the left edge the label sits when at rest (e.g. "0.75rem" or "135px")
   */
  labelLeftRest?: string
  /**
   * How far from the left edge the label sits when floated (e.g. "1rem")
   */
  labelLeftFloat?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      startAdornment,
      endAdornment,
      label,
      error,
      id,
      value,
      onChange,
      onBlur,
      labelLeftRest,
      labelLeftFloat,
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(
      value !== undefined && value !== null && value !== ""
    )
    const inputId = id || React.useId()

    React.useEffect(() => {
      setHasValue(value !== undefined && value !== null && value !== "")
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0)
      onChange?.(e)
    }
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    }

    // fallback defaults
    const leftRest = labelLeftRest ?? (startAdornment ? "2.25rem" : "0.75rem")
    const leftFloat = labelLeftFloat ?? "1rem"

    const variants = {
      rest: {
        top: "50%",
        y: "-50%",
        fontSize: "1rem",
        left: leftRest,
      },
      float: {
        top: "-0.6rem",
        y: "0%",
        fontSize: "0.7rem",
        left: leftFloat,
      },
    }

    return (
      <div className="flex flex-col gap-0 w-full">
        <div className="relative w-full">
          {label && (
            <motion.label
              htmlFor={inputId}
              initial="rest"
              animate={isFocused || hasValue ? "float" : "rest"}
              variants={variants}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                bounce: 0,
              }}
              style={{ originX: 0, originY: 0 }}
              className="absolute pointer-events-none bg-white px-2 text-gray-500 rounded z-10"
            >
              {label}
            </motion.label>
          )}

          {startAdornment && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              {startAdornment}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            type={type}
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            className={cn(
              "w-full h-12 rounded-md border bg-transparent placeholder-transparent text-base focus:outline-none",
              error
                ? "border-destructive focus:ring-destructive/80"
                : "border-input focus:ring-primarySite/80",
              startAdornment ? "pl-11" : "pl-4",
              endAdornment ? "pr-10" : "pr-3",
              className
            )}
            {...rest}
          />

          {endAdornment && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {endAdornment}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-xs text-destructive flex items-center gap-1">
            <span>•</span>
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
