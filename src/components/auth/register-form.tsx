"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
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
  registerFormSchema,
  type RegisterFormValues,
  authValidationMessages,
} from "@/data/auth"

export interface RegisterFormProps {
  onSubmit?: (data: RegisterFormValues) => Promise<void> | void
  isLoading?: boolean
  className?: string
}

export function RegisterForm({
  onSubmit: onSubmitProp,
  isLoading: isLoadingProp,
  className,
}: RegisterFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  })

  const isLoading = isLoadingProp ?? isSubmitting

  async function handleSubmit(data: RegisterFormValues) {
    setServerError(null)

    if (onSubmitProp) {
      try {
        setIsSubmitting(true)
        await onSubmitProp(data)
      } catch (error) {
        setServerError(
          error instanceof Error
            ? error.message
            : authValidationMessages.registerFailed
        )
      } finally {
        setIsSubmitting(false)
      }
    } else {
      // Default behavior for development/preview
      console.log("Register form data:", data)
      setIsSubmitting(true)
      setTimeout(() => {
        setIsSubmitting(false)
        alert("Register functionality not yet connected to API")
      }, 1000)
    }
  }

  return (
    <div className={cn("w-full max-w-[640px]", className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Server Error Display */}
          {serverError && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md text-sm">
              {serverError}
            </div>
          )}

          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      {...field}
                      label="First Name"
                      error={!!fieldState.error}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      {...field}
                      label="Last Name"
                      error={!!fieldState.error}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <FormField
              control={form.control}
              name="phone"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      {...field}
                      type="tel"
                      label="Phone Number"
                      error={!!fieldState.error}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    {...field}
                    label="Password"
                    error={!!fieldState.error}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    {...field}
                    label="Confirm Password"
                    error={!!fieldState.error}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Agree to Terms */}
          <FormField
            control={form.control}
            name="agreeToTerms"
            render={({ field }) => (
              <FormItem className="flex items-start gap-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                    className="mt-0.5"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <Label
                    htmlFor={field.name}
                    className="text-sm font-medium text-foreground cursor-pointer"
                  >
                    I agree to all the{" "}
                    <Link
                      href="/terms"
                      className="font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      Privacy Policies
                    </Link>
                  </Label>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Create Account Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full h-12 text-base font-semibold"
            disabled={isLoading}
          >
            {isLoading ? "Đang tạo tài khoản..." : "Create account"}
          </Button>

          {/* Login Link */}
          <p className="text-center text-sm text-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Login
            </Link>
          </p>
        </form>
      </Form>
    </div>
  )
}
