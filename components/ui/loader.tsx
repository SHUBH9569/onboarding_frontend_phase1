import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const loaderVariants = cva("loading loading-spinner", {
  variants: {
    size: {
      xs: "loading-xs",
      sm: "loading-sm",
      md: "loading-md",
      lg: "loading-lg",
      xl: "loading-xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

function Loader({
  className,
  size,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof loaderVariants>) {
  return (
    <span
      data-slot="loader"
      aria-label="Loading"
      className={cn(loaderVariants({ size, className }))}
      {...props}
    />
  )
}

export { Loader, loaderVariants }