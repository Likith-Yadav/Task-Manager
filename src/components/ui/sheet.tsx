  import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"

const Sheet = DialogPrimitive.Root
const SheetTrigger = DialogPrimitive.Trigger

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    side?: 'left' | 'right' | 'top' | 'bottom'
  }
>(({ className, children, side = 'right', ...props }, ref) => {
  const sideAnimations = {
    left: {
      animateIn: 'data-[state=open]:slide-in-from-left',
      animateOut: 'data-[state=closed]:slide-out-to-left'
    },
    right: {
      animateIn: 'data-[state=open]:slide-in-from-right',
      animateOut: 'data-[state=closed]:slide-out-to-right'
    },
    top: {
      animateIn: 'data-[state=open]:slide-in-from-top',
      animateOut: 'data-[state=closed]:slide-out-to-top'
    },
    bottom: {
      animateIn: 'data-[state=open]:slide-in-from-bottom',
      animateOut: 'data-[state=closed]:slide-out-to-bottom'
    }
  }

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80" />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          `fixed z-50 gap-4 bg-white p-6 shadow-lg transition ease-in-out 
          ${sideAnimations[side].animateIn} ${sideAnimations[side].animateOut}`,
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
})

SheetContent.displayName = DialogPrimitive.Content.displayName

export { Sheet, SheetContent, SheetTrigger }
