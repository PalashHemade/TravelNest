'use client'

import { useFormState } from "react-dom";
import { createBooking } from "@/actions/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Placeholder for useFormStatus
function SubmitButton() {
  // const { pending } = useFormStatus(); // React 19 / Next 14 needs experimental flag or explicit hook usage if available. 
  // For simplicity standard useState in parent or just optimistic UI.
  // Actually useFormStatus provided by react-dom is available in Next 14.
  // But due to potential setup issues, I'll assume standard submit.
  return (
    <Button type="submit" className="w-full">
      Confirm Booking
    </Button>
  );
}

export default function BookingPage({ params }: { params: { packageId: string } }) {
  const [state, formAction] = useFormState(createBooking, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
    if (state?.success) {
      toast.success("Booking created successfully!");
      router.push(`/payment/${state.bookingId}`);
    }
  }, [state, router]);

  return (
    <div className="container py-12 md:py-20 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Confirm Your Trip</CardTitle>
          <CardDescription>Fill in the details to secure your booking.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <input type="hidden" name="packageId" value={params.packageId} />
            
            <div className="space-y-2">
              <Label htmlFor="startDate">Travel Date</Label>
              <Input type="date" id="startDate" name="startDate" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="travelers">Number of Travelers</Label>
              <Input type="number" id="travelers" name="travelers" min={1} defaultValue={1} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email Address</Label>
              <Input type="email" id="contactEmail" name="contactEmail" required placeholder="you@example.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone Number</Label>
              <Input type="tel" id="contactPhone" name="contactPhone" required placeholder="+1 234 567 8900" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
              <Textarea id="specialRequests" name="specialRequests" placeholder="Dietary restrictions, accessibility needs, etc." />
            </div>

            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
