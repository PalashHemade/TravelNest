"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(["user", "admin"]),
});

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "", role: "user" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");
      toast.success("Account created successfully! Please log in.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const selectedRole = form.watch("role");

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel — photo */}
      <div className="relative hidden lg:flex flex-col justify-between p-10 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1935&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-black/55" />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2 text-white">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <span className="text-sm">🌍</span>
          </div>
          <Link href="/" className="text-lg font-black">TravelNest</Link>
        </div>

        {/* Quote */}
        <div className="relative z-10 text-white">
          <p className="text-xl font-medium leading-relaxed mb-4 max-w-sm">
            "TravelNest helped me find the perfect vacation spot. The booking process was seamless and the support was excellent."
          </p>
          <p className="text-sm text-white/60">— Sofia Davis, Frequent Traveler</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-[420px] space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-black text-foreground">Create an account</h1>
            <p className="text-muted-foreground text-sm mt-1">First, choose how you want to use TravelNest</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

              {/* ── Role Picker ── */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground">I am signing up as a…</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-3 mt-1">
                        <button
                          type="button"
                          onClick={() => field.onChange("user")}
                          className={`relative flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-5 text-center transition-all cursor-pointer select-none focus:outline-none ${
                            field.value === "user"
                              ? "border-foreground bg-accent shadow-md"
                              : "border-border hover:border-foreground/40 hover:bg-accent/50"
                          }`}
                        >
                          {field.value === "user" && (
                            <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-xs text-background font-bold">✓</span>
                          )}
                          <span className="text-3xl">🧳</span>
                          <div>
                            <p className="font-bold text-sm text-foreground">Traveler</p>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-tight">Browse &amp; book travel packages</p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => field.onChange("admin")}
                          className={`relative flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-5 text-center transition-all cursor-pointer select-none focus:outline-none ${
                            field.value === "admin"
                              ? "border-orange-500 bg-orange-500/10 shadow-md"
                              : "border-border hover:border-orange-400/40 hover:bg-orange-500/5"
                          }`}
                        >
                          {field.value === "admin" && (
                            <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs text-white font-bold">✓</span>
                          )}
                          <span className="text-3xl">🛠️</span>
                          <div>
                            <p className="font-bold text-sm text-foreground">Admin</p>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-tight">Manage destinations &amp; packages</p>
                          </div>
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirmation banner */}
              <div className={`rounded-xl px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${
                selectedRole === "admin"
                  ? "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                  : "bg-accent text-foreground border border-border"
              }`}>
                <span>{selectedRole === "admin" ? "🛠️" : "🧳"}</span>
                <span>
                  Registering as <strong>{selectedRole === "admin" ? "Admin" : "Traveler"}</strong>
                  {selectedRole === "admin"
                    ? " — full platform management access."
                    : " — browse & book amazing trips."}
                </span>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-semibold text-sm">Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" className="rounded-xl border-border h-11" {...field} />
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
                    <FormLabel className="text-foreground font-semibold text-sm">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" className="rounded-xl border-border h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-semibold text-sm">Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" className="rounded-xl border-border h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className={`w-full h-12 font-bold text-base ${
                  selectedRole === "admin"
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "bg-foreground text-background hover:bg-foreground/85"
                }`}
                type="submit"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {selectedRole === "admin" ? "Create Admin Account 🛠️" : "Create Traveler Account 🧳"}
              </Button>
            </form>
          </Form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground font-medium">Or continue with</span>
            </div>
          </div>

          <Button
            variant="outline"
            type="button"
            disabled={isLoading}
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full h-12 font-medium"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            Continue with Google
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-foreground hover:underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
