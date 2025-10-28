

"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      {/* This is the change:
        - Replaced 'top-0' with 'bottom-0'
        - Replaced 'top-1' with 'bottom-1'
      */}
      <ToastViewport className="[--viewport-padding:_25px] flex flex-col-reverse p-6 fixed bottom-0 z-[100] right-0" />
    </ToastProvider>
  )
}