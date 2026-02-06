"use client"

import { useState, useEffect } from "react"
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
import { useRegister } from "@/features/authentication"

export interface RegisterFormProps {
  onSubmit?: (data: RegisterFormValues) => Promise<void> | void
  isLoading?: boolean
  className?: string
  /** Custom redirect path after registration */
  redirectTo?: string
}

export function RegisterForm({
  onSubmit: onSubmitProp,
  isLoading: isLoadingProp,
  className,
  redirectTo = "/login",
}: RegisterFormProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Use the register hook
  const {
    register: registerUser,
    isLoading: isRegisterLoading,
    error: registerError,
    isSuccess,
  } = useRegister({
    redirectTo,
    onSuccess: () => {
      setSuccessMessage(authValidationMessages.registerSuccess)
    },
    onError: (error) => setServerError(error),
  })

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

  // Sync hook error with local state
  useEffect(() => {
    if (registerError) {
      setServerError(registerError)
    }
  }, [registerError])

  const isLoading = isLoadingProp ?? isRegisterLoading

  async function handleSubmit(data: RegisterFormValues) {
    setServerError(null)
    setSuccessMessage(null)

    // If custom onSubmit is provided, use it
    if (onSubmitProp) {
      try {
        await onSubmitProp(data)
      } catch (error) {
        setServerError(
          error instanceof Error
            ? error.message
            : authValidationMessages.registerFailed
        )
      }
    } else {
      // Transform form data to API format and use the register hook
      registerUser({
        email: data.email,
        password: data.password,
        fullName: `${data.firstName} ${data.lastName}`.trim(),
        phone: data.phone || undefined,
      })
    }
  }

  // Show success message after registration
  if (isSuccess && successMessage) {
    return (
      <div className={cn("w-full max-w-[640px]", className)}>
        <div className="bg-success/10 border border-success text-success px-4 py-3 rounded-md text-sm space-y-2">
          <p className="font-semibold">{successMessage}</p>
          <p className="text-muted-foreground">
            Vui lòng kiểm tra email để xác thực tài khoản của bạn.
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
