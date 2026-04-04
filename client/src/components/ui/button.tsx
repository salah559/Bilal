import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-bold uppercase tracking-widest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 transition-all duration-300 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white shadow-xl shadow-primary/20 hover:bg-secondary hover:shadow-secondary/30 border border-primary/20",
        destructive:
          "bg-destructive text-destructive-foreground shadow-lg hover:bg-destructive/90",
        outline:
          "border-2 border-white/10 bg-transparent hover:bg-white hover:text-brand-dark hover:border-white shadow-lg",
        secondary: 
          "bg-secondary text-white shadow-xl shadow-secondary/20 hover:bg-primary hover:shadow-primary/30 border border-secondary/20",
        ghost: "hover:bg-primary/10 hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-14 px-8 py-4",
        sm: "h-10 rounded-xl px-4 text-xs",
        lg: "h-16 rounded-[2rem] px-12 text-base",
        icon: "h-12 w-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
