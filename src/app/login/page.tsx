"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
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

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
  role: z.enum(["user", "admin"]),
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // Show role mismatch error if redirected back from NextAuth
  useEffect(() => {
    if (searchParams.get("error") === "RoleMismatch") {
      toast.error("Wrong role selected. Please pick the role that matches your account.");
    }
  }, [searchParams]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "", role: "user" },
  });

  const selectedRole = form.watch("role");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        role: values.role,
      });

      if (result?.error) {
        toast.error("Invalid email or password. Please check your credentials.");
      } else {
        toast.success(`Signed in as ${values.role === "admin" ? "Admin 🛠️" : "Traveler 🧳"}`);
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 min-h-screen">
      {/* Left panel */}
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/">TravelNest</Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "TravelNest helped me find the perfect vacation spot. The booking process was seamless and the support was excellent."
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>

      {/* Right panel */}
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-5 sm:w-[420px]">
          <div className="flex flex-col space-y-1 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Select your role, then sign in</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

              {/* ── Role Picker ── */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">I am signing in as a…</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-3 mt-1">

                        {/* Traveler card */}
                        <button
                          type="button"
                          onClick={() => field.onChange("user")}
                          className={`relative flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-5 text-center transition-all cursor-pointer select-none focus:outline-none ${
                            field.value === "user"
                              ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary/20"
                              : "border-border hover:border-primary/40 hover:bg-muted/50"
                          }`}
                        >
                          {field.value === "user" && (
                            <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white font-bold">✓</span>
                          )}
                          <span className="text-3xl">🧳</span>
                          <div>
                            <p className="font-bold text-sm">Traveler</p>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-tight">Browse &amp; book trips</p>
                          </div>
                        </button>

                        {/* Admin card */}
                        <button
                          type="button"
                          onClick={() => field.onChange("admin")}
                          className={`relative flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-5 text-center transition-all cursor-pointer select-none focus:outline-none ${
                            field.value === "admin"
                              ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20 shadow-md ring-2 ring-orange-500/20"
                              : "border-border hover:border-orange-400/40 hover:bg-muted/50"
                          }`}
                        >
                          {field.value === "admin" && (
                            <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs text-white font-bold">✓</span>
                          )}
                          <span className="text-3xl">🛠️</span>
                          <div>
                            <p className="font-bold text-sm">Admin</p>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-tight">Manage the platform</p>
                          </div>
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Live confirmation banner */}
              <div className={`rounded-lg px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${
                selectedRole === "admin"
                  ? "bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300"
                  : "bg-primary/10 text-primary"
              }`}>
                <span>{selectedRole === "admin" ? "🛠️" : "🧳"}</span>
                <span>
                  Signing in as <strong>{selectedRole === "admin" ? "Admin" : "Traveler"}</strong>
                  {selectedRole === "admin"
                    ? " — must match your registered admin account."
                    : " — must match your registered traveler account."}
                </span>
              </div>

              {/* Email & Password */}
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dynamic submit button */}
              <Button
                className={`w-full font-semibold ${
                  selectedRole === "admin"
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : ""
                }`}
                type="submit"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {selectedRole === "admin" ? "Sign In as Admin 🛠️" : "Sign In as Traveler 🧳"}
              </Button>
            </form>
          </Form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button variant="outline" type="button" disabled={isLoading} onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
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
            Google
          </Button>

          <div className="px-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="underline underline-offset-4 hover:text-primary">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
