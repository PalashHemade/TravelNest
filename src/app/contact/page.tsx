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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MapPin, Phone } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
})

export default function ContactPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Ideally call API here
    console.log(values)
    toast.success("Message sent successfully!", {
        description: "We'll get back to you effectively immediately.",
    })
    form.reset()
  }

  return (
    <div className="container py-12 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
           <h1 className="text-4xl font-bold tracking-tight mb-6">Get in Touch</h1>
           <p className="text-muted-foreground text-lg mb-8">
             Have questions about a package? Want to customize your trip? Our travel experts are here to help.
           </p>
           
           <div className="space-y-6">
             <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                 <MapPin className="h-6 w-6" />
               </div>
               <div>
                 <h3 className="font-semibold">Visit Us</h3>
                 <p className="text-muted-foreground">123 Travel Lane, Adventure City, AC 12345</p>
               </div>
             </div>
             
             <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                 <Mail className="h-6 w-6" />
               </div>
               <div>
                 <h3 className="font-semibold">Email Us</h3>
                 <p className="text-muted-foreground">hello@travelnest.com</p>
               </div>
             </div>

             <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                 <Phone className="h-6 w-6" />
               </div>
               <div>
                 <h3 className="font-semibold">Call Us</h3>
                 <p className="text-muted-foreground">+1 (555) 123-4567</p>
               </div>
             </div>
           </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Send a Message</CardTitle>
            <CardDescription>
              Fill out the form below and we'll respond within 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Inquiry about..." {...field} />
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
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tell us about your travel plans..." className="min-h-[120px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
