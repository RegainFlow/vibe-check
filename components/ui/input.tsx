"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "w-full rounded-lg border bg-transparent text-foreground placeholder:text-muted-foreground transition-all outline-hidden disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-border bg-card/50 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:shadow-[0_0_20px_rgba(124,58,237,0.15)]",
        ghost: "border-transparent hover:bg-muted focus:bg-muted",
      },
      inputSize: {
        default: "h-10 px-3 text-sm",
        sm: "h-8 px-2.5 text-xs",
        lg: "h-12 px-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
)

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(inputVariants({ variant, inputSize, className }))}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
