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
import { PasswordInput } from "./password-input"
import {
  resetPasswordFormSchema,
  type ResetPasswordFormValues,
  authValidationMessages,
} from "@/data/auth"

export interface ResetPasswordFormProps {
  onSubmit?: (data: ResetPasswordFormValues) => Promise<void> | void
  isLoading?: boolean
  className?: string
  token?: string
}

export function ResetPasswordForm({
  onSubmit: onSubmitProp,
  isLoading: isLoadingProp,
  className,
  token,
}: ResetPasswordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema) as any,
    defaultValues: {
      password: "",
      confirmPassword: "",
      token: token || "",
    },
  })

  const isLoading = isLoadingProp ?? isSubmitting

  async function handleSubmit(data: ResetPasswordFormValues) {
    setServerError(null)
    setIsSuccess(false)

    // Include token in submission if provided
    const submitData = { ...data, token: token || data.token }

    if (onSubmitProp) {
      try {
        setIsSubmitting(true)
        await onSubmitProp(submitData)
        setIsSuccess(true)
      } catch (error) {
        setServerError(
          error instanceof Error
            ? error.message
            : authValidationMessages.resetPasswordFailed
        )
      } finally {
        setIsSubmitting(false)
      }
    } else {
      // Default behavior for development/preview
      console.log("Reset password form data:", submitData)
      setIsSubmitting(true)
      setTimeout(() => {
        setIsSubmitting(false)
        setIsSuccess(true)
        alert("Mật khẩu đã được đặt lại thành công (Demo mode)")
      }, 1500)
    }
  }

  if (isSuccess) {
    return (
      <div className={cn("w-full max-w-[512px]", className)}>
        <div className="bg-success/10 border border-success text-success px-4 py-3 rounded-md text-sm space-y-2">
          <p className="font-semibold">
            {authValidationMessages.resetPasswordSuccess}
          </p>
          <p className="text-muted-foreground">
            Bạn có thể đăng nhập bằng mật khẩu mới của mình.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("w-full max-w-[512px]", className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Server Error Display */}
          {serverError && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md text-sm">
              {serverError}
            </div>
          )}

          {/* Create Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    {...field}
                    label="Create Password"
                    error={!!fieldState.error}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Re-enter Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    {...field}
                    label="Re-enter Password"
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
            {isLoading ? "Đang đặt lại..." : "Set password"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
