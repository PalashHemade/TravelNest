"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Mail, MapPin, Phone, Send } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
})

export default function ContactPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    toast.success("Message sent successfully!", {
      description: "We'll get back to you within 24 hours.",
    })
    form.reset()
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* ══ HERO BANNER ══ */}
      <section className="relative h-72 md:h-96 flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-black/55" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-black mb-3">Contact</h1>
          <p className="text-white/60 text-sm flex items-center justify-center gap-2">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span>›</span>
            <span>Contact</span>
          </p>
        </div>
      </section>

      {/* ══ CONTACT SECTION ══ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: Info */}
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                Get in Touch
              </span>
              <h2 className="text-4xl font-black text-gray-900 mt-2 mb-4">
                Have Any Question?
              </h2>
              <p className="text-gray-500 leading-relaxed mb-10 text-base">
                Do not hesitate to give us a call. We are an expert team and we are happy to talk to you. Our travel specialists are available 7 days a week.
              </p>

              {/* Contact Cards */}
              <div className="space-y-5">
                {[
                  {
                    icon: Phone,
                    label: "Phone",
                    value: "+62 6943 6956",
                    sub: "Mon-Fri from 8am to 6pm",
                    color: "bg-black",
                  },
                  {
                    icon: Mail,
                    label: "Email",
                    value: "hello@travelnest.com",
                    sub: "We reply within 24 hours",
                    color: "bg-black",
                  },
                  {
                    icon: MapPin,
                    label: "Address",
                    value: "123 Travel Lane, Adventure City",
                    sub: "AC 12345, United States",
                    color: "bg-black",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                  >
                    <div className={`h-12 w-12 rounded-xl ${item.color} flex items-center justify-center shrink-0`}>
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-0.5">
                        {item.label}
                      </p>
                      <p className="font-bold text-gray-900">{item.value}</p>
                      <p className="text-sm text-gray-400">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dark Contact Box (matching Figma "Have Any Question?") */}
              <div className="mt-8 bg-gray-950 rounded-2xl p-7 text-white">
                <h3 className="text-xl font-bold mb-2">Have Any Question?</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  Do not hesitate to give us a call. We are an expert team and we are happy to talk to you.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                    <span className="text-gray-300">+62 6943 6956</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                    <span className="text-gray-300">contact@travelnest.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
              <h3 className="text-2xl font-black text-gray-900 mb-2">Send a Message</h3>
              <p className="text-gray-400 text-sm mb-8">
                Fill out the form below and we'll respond within 24 hours.
              </p>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-semibold text-sm">Your Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              className="rounded-xl border-gray-200 focus-visible:ring-gray-900 h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-semibold text-sm">Email Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="name@example.com"
                              className="rounded-xl border-gray-200 focus-visible:ring-gray-900 h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold text-sm">Subject</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Inquiry about packages..."
                            className="rounded-xl border-gray-200 focus-visible:ring-gray-900 h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold text-sm">Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your travel plans..."
                            className="rounded-xl border-gray-200 focus-visible:ring-gray-900 min-h-[140px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full h-12 rounded-full bg-black hover:bg-gray-800 text-white font-bold text-base"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>

      {/* ══ MAP / DECORATIVE BOTTOM ══ */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "12K+", label: "Happy Travelers" },
              { value: "50+", label: "Destinations" },
              { value: "4.9★", label: "Average Rating" },
              { value: "8+", label: "Years Experience" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-black text-gray-900 mb-1">{stat.value}</p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
