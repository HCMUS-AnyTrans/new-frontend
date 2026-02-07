"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
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
} from "../data"
import { useForgotPassword } from "../hooks"

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
  const t = useTranslations("auth.forgotPassword")
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  // Use the forgot password hook
  const {
    forgotPassword,
    isLoading: isForgotPasswordLoading,
    error: forgotPasswordError,
    isSuccess: hookSuccess,
  } = useForgotPassword({
    onSuccess: () => {
      setIsSuccess(true)
    },
    onError: (error) => setServerError(error),
  })

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema) as any,
    defaultValues: {
      email: "",
    },
  })

  // Sync hook error with local state
  useEffect(() => {
    if (forgotPasswordError) {
      setServerError(forgotPasswordError)
    }
  }, [forgotPasswordError])

  // Sync hook success with local state
  useEffect(() => {
    if (hookSuccess) {
      setIsSuccess(true)
    }
  }, [hookSuccess])

  const isLoading = isLoadingProp ?? isForgotPasswordLoading

  async function handleSubmit(data: ForgotPasswordFormValues) {
    setServerError(null)
    setIsSuccess(false)

    if (onSubmitProp) {
      try {
        await onSubmitProp(data)
        setIsSuccess(true)
      } catch (error) {
        setServerError(
          error instanceof Error
            ? error.message
            : authValidationMessages.forgotPasswordFailed
        )
      }
    } else {
      // Use the forgot password hook
      forgotPassword({ email: data.email })
    }
  }

  if (isSuccess) {
    return (
      <div className={cn("w-full max-w-[512px]", className)}>
        <div className="bg-success/10 border border-success text-success px-4 py-3 rounded-md text-sm space-y-2">
          <p className="font-semibold">{authValidationMessages.forgotPasswordSuccess}</p>
          <p className="text-muted-foreground">
            {t("successMessage")}
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
                    label={t("email")}
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
