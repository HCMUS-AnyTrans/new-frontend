"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { contactFormSchema, type ContactFormValues } from "@/data/contact"

const subjects = [
  { id: "general", label: "General Inquiry" },
  { id: "support", label: "Support" },
  { id: "feedback", label: "Feedback" },
  { id: "other", label: "Other" },
]

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      topic: "general",
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  })

  function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true)
    console.log(data)
    setTimeout(() => {
      setIsSubmitting(false)
      form.reset()
    }, 1500)
  }

  // Custom Input style to match design (border-bottom only)
  const inputClass = "border-0 border-b border-border rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-primary placeholder:text-muted-foreground bg-transparent text-foreground transition-colors"
  const labelClass = "text-muted-foreground font-medium text-xs uppercase tracking-wide"

  return (
    <div className="p-10 bg-background h-full flex flex-col justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* First Name (mapped to name for simplicity or split if needed) */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClass}>Tên đầy đủ</FormLabel>
                  <FormControl>
                    <Input {...field} className={inputClass} placeholder="Nguyễn Văn A" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClass}>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input {...field} className={inputClass} placeholder="+84 123 456 789" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClass}>Email</FormLabel>
                  <FormControl>
                    <Input {...field} className={inputClass} placeholder="demo@gmail.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Subject (Topic) as Radio Group */}
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2 space-y-4">
                  <FormLabel className="text-foreground font-semibold text-sm capitalize">Select Subject?</FormLabel>
                  <div className="flex flex-wrap gap-6">
                    {subjects.map((subject) => (
                      <label
                        key={subject.id}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <div className="relative">
                          <input
                            type="radio"
                            className="peer sr-only"
                            {...field}
                            value={subject.id}
                            checked={field.value === subject.id}
                            onChange={() => field.onChange(subject.id)}
                          />
                          <div className="w-4 h-4 rounded-full border border-border peer-checked:bg-primary peer-checked:border-none flex items-center justify-center transition-colors">
                            {field.value === subject.id && (
                              <Check className="w-2.5 h-2.5 text-primary-foreground" />
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-foreground">{subject.label}</span>
                      </label>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Message */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Tin nhắn</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    className={cn(inputClass, "resize-none min-h-[40px]")} 
                    placeholder="Viết tin nhắn của bạn..." 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-[5px] px-10 py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
