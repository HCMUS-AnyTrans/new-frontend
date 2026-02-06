"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
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
import { useResetPassword } from "@/features/authentication"

export interface ResetPasswordFormProps {
  onSubmit?: (data: ResetPasswordFormValues) => Promise<void> | void
  isLoading?: boolean
  className?: string
  token?: string
  email?: string
}

export function ResetPasswordForm({
  onSubmit: onSubmitProp,
  isLoading: isLoadingProp,
  className,
  token: tokenProp,
  email: emailProp,
}: ResetPasswordFormProps) {
  const searchParams = useSearchParams()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  // Get token and email from props or URL params
  const token = tokenProp || searchParams.get("token") || ""
  const email = emailProp || searchParams.get("email") || ""

  // Use the reset password hook
  const {
    resetPassword,
    isLoading: isResetPasswordLoading,
    error: resetPasswordError,
    isSuccess: hookSuccess,
  } = useResetPassword({
    onSuccess: () => {
      setIsSuccess(true)
    },
    onError: (error) => setServerError(error),
  })

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema) as any,
    defaultValues: {
      password: "",
      confirmPassword: "",
      token: token,
    },
  })

  // Sync hook error with local state
  useEffect(() => {
    if (resetPasswordError) {
      setServerError(resetPasswordError)
    }
  }, [resetPasswordError])

  // Sync hook success with local state
  useEffect(() => {
    if (hookSuccess) {
      setIsSuccess(true)
    }
  }, [hookSuccess])

  const isLoading = isLoadingProp ?? isResetPasswordLoading

  async function handleSubmit(data: ResetPasswordFormValues) {
    setServerError(null)
    setIsSuccess(false)

    // Include token in submission
    const submitData = { ...data, token: token || data.token }

    if (onSubmitProp) {
      try {
        await onSubmitProp(submitData)
        setIsSuccess(true)
      } catch (error) {
        setServerError(
          error instanceof Error
            ? error.message
            : authValidationMessages.resetPasswordFailed
        )
      }
    } else {
      // Validate token and email
      if (!token || !email) {
        setServerError("Invalid reset link. Please request a new password reset.")
        return
      }

      // Use the reset password hook
      resetPassword({
        email,
        token,
        newPassword: data.password,
      })
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
          <Link
            href="/login"
            className="inline-block mt-2 text-primary hover:text-primary/80 transition-colors font-semibold"
          >
            Đi đến trang đăng nhập →
          </Link>
        </div>
      </div>
    )
  }

  // Show error if no token provided
  if (!token && !tokenProp) {
    return (
      <div className={cn("w-full max-w-[512px]", className)}>
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md text-sm space-y-2">
          <p className="font-semibold">Invalid Reset Link</p>
          <p className="text-muted-foreground">
            The password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link
            href="/forgot-password"
            className="inline-block mt-2 text-primary hover:text-primary/80 transition-colors font-semibold"
          >
            Request new reset link →
          </Link>
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
