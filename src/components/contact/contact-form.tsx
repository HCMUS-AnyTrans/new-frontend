"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { cn } from "@/lib/utils"
import {
  contactTopics,
  contactFormConfig,
  contactValidationMessages,
  contactFormSchema,
  type ContactFormValues,
} from "@/data/contact"

// ============================================================================
// TYPES
// ============================================================================

type FormState = "idle" | "loading" | "success"

// ============================================================================
// TOPIC SELECTOR
// ============================================================================

interface TopicSelectorProps {
  value: string
  onChange: (topicId: string) => void
}

function TopicSelector({ value, onChange }: TopicSelectorProps) {
  return (
    <div className="mb-5">
      <label className="block text-foreground text-sm font-medium mb-2">
        Chủ đề
      </label>
      <div className="flex flex-wrap gap-2">
        {contactTopics.map((topic) => (
          <button
            key={topic.id}
            type="button"
            onClick={() => onChange(topic.id)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm transition-colors duration-200 cursor-pointer border",
              value === topic.id
                ? "bg-primary/10 border-primary/50 text-foreground"
                : "bg-muted/50 border-border text-muted-foreground hover:border-primary/30"
            )}
          >
            {topic.icon} {topic.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// SUCCESS STATE (giữ animation vì đây là feedback UI)
// ============================================================================

interface SuccessStateProps {
  ticketId: string
  onReset: () => void
}

function SuccessState({ ticketId, onReset }: SuccessStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      {/* Animated Checkmark */}
      <div className="relative">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          className="overflow-visible"
        >
          <motion.circle
            cx="40"
            cy="40"
            r="36"
            fill="transparent"
            className="stroke-primary"
            strokeWidth="3"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
          <motion.polyline
            points="25,42 35,52 55,32"
            fill="transparent"
            className="stroke-primary"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
          />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-foreground mt-6">
        {contactValidationMessages.successTitle}
      </h2>
      <p className="text-muted-foreground text-sm mt-2 max-w-xs">
        {contactValidationMessages.successMessage}
      </p>

      <div className="mt-4 px-3 py-1.5 rounded-full text-sm font-mono bg-primary/10 border border-primary/25 text-primary">
        Mã phiếu: #{ticketId}
      </div>

      <Button variant="outline" className="mt-6" onClick={onReset}>
        Gửi tin nhắn khác
      </Button>
    </div>
  )
}

// ============================================================================
// MAIN CONTACT FORM
// ============================================================================

export interface ContactFormProps {
  className?: string
}

export function ContactForm({ className }: ContactFormProps) {
  const [formState, setFormState] = useState<FormState>("idle")
  const [ticketId, setTicketId] = useState("")

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      topic: "support",
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  })

  const messageValue = form.watch("message")

  function onSubmit(data: ContactFormValues) {
    setFormState("loading")

    // Mock submit - simulate API call
    setTimeout(() => {
      const newTicketId = `${contactFormConfig.ticketPrefix}-${Math.floor(10000 + Math.random() * 90000)}`
      setTicketId(newTicketId)
      setFormState("success")
      console.log("Form submitted:", data)
    }, 1800)
  }

  function resetForm() {
    form.reset()
    setFormState("idle")
  }

  return (
    <Card
      className={cn("bg-card/80 backdrop-blur-sm border-primary/20", className)}
    >
      <CardContent className="p-6 lg:p-8">
        {formState === "success" ? (
          <SuccessState ticketId={ticketId} onReset={resetForm} />
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              {/* Topic Selector */}
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <TopicSelector
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên của bạn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Field */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Số điện thoại{" "}
                      <span className="text-muted-foreground text-xs">
                        (không bắt buộc)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+84 xxx xxx xxx"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Message Field */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-between">
                      <span>Tin nhắn</span>
                      <span
                        className={cn(
                          "text-xs font-normal",
                          messageValue.length >
                            contactFormConfig.maxMessageLength
                            ? "text-destructive"
                            : messageValue.length >
                                contactFormConfig.maxMessageLength * 0.8
                              ? "text-primary"
                              : "text-muted-foreground"
                        )}
                      >
                        {messageValue.length} /{" "}
                        {contactFormConfig.maxMessageLength}
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả yêu cầu của bạn..."
                        rows={4}
                        className="resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={formState === "loading"}
                className="w-full"
                size="lg"
              >
                {formState === "loading" ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Gửi tin nhắn"
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  )
}
