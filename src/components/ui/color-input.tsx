"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

export interface ColorInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    value: string
  }

const ColorInput = React.forwardRef<HTMLInputElement, ColorInputProps>(
  ({ className, value, ...props }, ref) => {
    return (
      <div className={cn("inline-flex h-10 items-center gap-2 rounded-md border border-input bg-transparent px-3 py-2", className)}>
        <input
          type="color"
          value={value}
          className="h-6 w-6 cursor-pointer appearance-none border-none bg-transparent p-0 focus:outline-none focus:ring-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-sm [&::-webkit-color-swatch]:border-none"
          {...props}
          ref={ref}
        />
         <span className="text-sm font-medium text-muted-foreground uppercase">{value}</span>
      </div>
    )
  }
)
ColorInput.displayName = "ColorInput"

export { ColorInput }
