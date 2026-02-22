"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { FloatingLabelInput } from "./floating-label-input"
import { PasswordInput } from "./password-input"
import {
  loginFormSchema,
  type LoginFormValues,
  authValidationMessages,
} from "../data"
import { useLogin } from "../hooks"

export interface LoginFormProps {
  onSubmit?: (data: LoginFormValues) => Promise<void> | void
  isLoading?: boolean
  className?: string
  /** Custom redirect path after login */
  redirectTo?: string
}

export function LoginForm({
  onSubmit: onSubmitProp,
  isLoading: isLoadingProp,
  className,
  redirectTo,
}: LoginFormProps) {
  const t = useTranslations("auth.login")
  const searchParams = useSearchParams()
  const [serverError, setServerError] = useState<string | null>(null)

  // Get redirect URL from query params or prop
  const redirectUrl = redirectTo || searchParams.get("redirect") || "/dashboard"

  // Get OAuth error from query params (set by callback page)
  const oauthError = searchParams.get("error")

  // Use the login hook
  const { login, isLoading: isLoginLoading, error: loginError } = useLogin({
    redirectTo: redirectUrl,
    onError: (error) => setServerError(error),
  })

  const form = useForm<LoginFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(loginFormSchema) as any,
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  // Derive error state from hook or local state or OAuth callback
  const displayError = serverError || loginError || oauthError

  const isLoading = isLoadingProp ?? isLoginLoading

  async function handleSubmit(data: LoginFormValues) {
    setServerError(null)

    // If custom onSubmit is provided, use it (for testing/custom handling)
    if (onSubmitProp) {
      try {
        await onSubmitProp(data)
      } catch (error) {
        setServerError(
          error instanceof Error
            ? error.message
            : authValidationMessages.loginFailed
        )
      }
    } else {
      // Use the login hook
      login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      })
    }
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
                    label={t("email")}
                    error={!!fieldState.error}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    {...field}
                    label={t("password")}
                    error={!!fieldState.error}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <Label
                    htmlFor={field.name}
                    className="text-sm font-medium text-foreground cursor-pointer"
                  >
                    {t("rememberMe")}
                  </Label>
                </FormItem>
              )}
            />
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              {t("forgotPassword")}
            </Link>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full h-12 text-base font-semibold"
            disabled={isLoading}
          >
            {isLoading ? t("submitting") : t("submit")}
          </Button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-foreground">
            {t("noAccount")}{" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              {t("signUp")}
            </Link>
          </p>
        </form>
      </Form>
    </div>
  )
}
