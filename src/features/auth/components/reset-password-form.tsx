"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
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
import { PasswordStrengthIndicator } from "./password-strength-indicator"
import {
  resetPasswordFormSchema,
  type ResetPasswordFormValues,
  authValidationMessages,
} from "../data"
import { useResetPassword } from "../hooks"

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
  token: tokenProp,
}: ResetPasswordFormProps) {
  const t = useTranslations("auth.resetPassword")
  const searchParams = useSearchParams()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  // Get token from props or URL params
  const token = tokenProp || searchParams.get("token") || ""

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(resetPasswordFormSchema) as any,
    defaultValues: {
      password: "",
      confirmPassword: "",
      token: token,
    },
  })

  // Derive error state from hook or local state
  const displayError = serverError || resetPasswordError

  // Derive success state from hook or local state
  const displaySuccess = isSuccess || hookSuccess

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
      // Validate token
      if (!token) {
        setServerError(t("invalidResetLink"))
        return
      }

      // Use the reset password hook
      resetPassword({
        token,
        newPassword: data.password,
      })
    }
  }

  if (displaySuccess) {
    return (
      <div className={cn("w-full max-w-[512px]", className)}>
        <div className="bg-success/10 border border-success text-success px-4 py-3 rounded-md text-sm space-y-2">
          <p className="font-semibold">
            {authValidationMessages.resetPasswordSuccess}
          </p>
          <p className="text-muted-foreground">
            {t("successMessage")}
          </p>
          <Link
            href="/login"
            className="inline-block mt-2 text-primary hover:text-primary/80 transition-colors font-semibold"
          >
            {t("goToLogin")}
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
          <p className="font-semibold">{t("invalidLinkTitle")}</p>
          <p className="text-muted-foreground">
            {t("invalidLinkMessage")}
          </p>
          <Link
            href="/forgot-password"
            className="inline-block mt-2 text-primary hover:text-primary/80 transition-colors font-semibold"
          >
            {t("requestNewLink")}
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
          {displayError && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md text-sm">
              {displayError}
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
                    label={t("createPassword")}
                    error={!!fieldState.error}
                    disabled={isLoading}
                  />
                </FormControl>
                <PasswordStrengthIndicator password={field.value} />
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
                    label={t("reenterPassword")}
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
            {isLoading ? t("submitting") : t("submit")}
          </Button>
        </form>
      </Form>
    </div>
  )
}
