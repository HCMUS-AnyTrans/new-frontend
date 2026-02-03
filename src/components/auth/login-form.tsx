"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import {
  loginFormSchema,
  type LoginFormValues,
  authValidationMessages,
} from "@/data/auth"

export interface LoginFormProps {
  onSubmit?: (data: LoginFormValues) => Promise<void> | void
  isLoading?: boolean
  className?: string
}

export function LoginForm({
  onSubmit: onSubmitProp,
  isLoading: isLoadingProp,
  className,
}: LoginFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema) as any,
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const isLoading = isLoadingProp ?? isSubmitting

  async function handleSubmit(data: LoginFormValues) {
    setServerError(null)
    
    if (onSubmitProp) {
      try {
        setIsSubmitting(true)
        await onSubmitProp(data)
      } catch (error) {
        setServerError(
          error instanceof Error
            ? error.message
            : authValidationMessages.loginFailed
        )
      } finally {
        setIsSubmitting(false)
      }
    } else {
      // Default behavior for development/preview
      console.log("Login form data:", data)
      setIsSubmitting(true)
      setTimeout(() => {
        setIsSubmitting(false)
        alert("Login functionality not yet connected to API")
      }, 1000)
    }
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

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="relative">
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder=" "
                      className={cn(
                        "h-14 pt-6 pb-2 px-4 peer",
                        "border-border focus-visible:border-primary"
                      )}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <Label
                    htmlFor={field.name}
                    className={cn(
                      "absolute left-4 top-1/2 -translate-y-1/2",
                      "text-muted-foreground pointer-events-none transition-all duration-200",
                      "peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary",
                      "peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs"
                    )}
                  >
                    Email
                  </Label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="relative">
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder=" "
                      className={cn(
                        "h-14 pt-6 pb-2 px-4 pr-12 peer",
                        "border-border focus-visible:border-primary"
                      )}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <Label
                    htmlFor={field.name}
                    className={cn(
                      "absolute left-4 top-1/2 -translate-y-1/2",
                      "text-muted-foreground pointer-events-none transition-all duration-200",
                      "peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary",
                      "peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs"
                    )}
                  >
                    Password
                  </Label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={cn(
                      "absolute right-4 top-1/2 -translate-y-1/2",
                      "text-muted-foreground hover:text-foreground",
                      "transition-colors p-1"
                    )}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
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
                    Remember me
                  </Label>
                </FormItem>
              )}
            />
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Forgot Password
            </Link>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full h-12 text-base font-semibold"
            disabled={isLoading}
          >
            {isLoading ? "Đang đăng nhập..." : "Login"}
          </Button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </form>
      </Form>
    </div>
  )
}
