"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { FloatingLabelInput } from "./floating-label-input"
import {
  forgotPasswordFormSchema,
  type ForgotPasswordFormValues,
  authValidationMessages,
} from "@/data/auth"

export interface ForgotPasswordFormProps {
  onSubmit?: (data: ForgotPasswordFormValues) => Promise<void> | void
  isLoading?: boolean
  className?: string
}

export function ForgotPasswordForm({
  onSubmit: onSubmitProp,
  isLoading: isLoadingProp,
  className,
}: ForgotPasswordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema) as any,
    defaultValues: {
      email: "",
    },
  })

  const isLoading = isLoadingProp ?? isSubmitting

  async function handleSubmit(data: ForgotPasswordFormValues) {
    setServerError(null)
    setIsSuccess(false)

    if (onSubmitProp) {
      try {
        setIsSubmitting(true)
        await onSubmitProp(data)
        setIsSuccess(true)
      } catch (error) {
        setServerError(
          error instanceof Error
            ? error.message
            : authValidationMessages.forgotPasswordFailed
        )
      } finally {
        setIsSubmitting(false)
      }
    } else {
      // Default behavior for development/preview
      console.log("Forgot password form data:", data)
      setIsSubmitting(true)
      setTimeout(() => {
        setIsSubmitting(false)
        setIsSuccess(true)
        alert("Email khôi phục mật khẩu đã được gửi (Demo mode)")
      }, 1500)
    }
  }

  if (isSuccess) {
    return (
      <div className={cn("w-full max-w-[512px]", className)}>
        <div className="bg-success/10 border border-success text-success px-4 py-3 rounded-md text-sm space-y-2">
          <p className="font-semibold">{authValidationMessages.forgotPasswordSuccess}</p>
          <p className="text-muted-foreground">
            Vui lòng kiểm tra hộp thư email của bạn để nhận link khôi phục mật khẩu.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("w-full max-w-[512px]", className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Server Error Display */}
          {serverError && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md text-sm">
              {serverError}
            </div>
          )}

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <FloatingLabelInput
                    {...field}
                    type="email"
                    label="Email"
                    error={!!fieldState.error}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full h-12 text-base font-semibold"
            disabled={isLoading}
          >
            {isLoading ? "Đang gửi..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
