import * as DialogPrimitive from "@radix-ui/react-dialog"
import React from "react"

export const Sheet: typeof DialogPrimitive.Root
export const SheetTrigger: typeof DialogPrimitive.Trigger
export const SheetContent: React.ForwardRefExoticComponent<
  DialogPrimitive.DialogContentProps & React.RefAttributes<HTMLDivElement> & {
    side?: 'left' | 'right' | 'top' | 'bottom'
  }
>
