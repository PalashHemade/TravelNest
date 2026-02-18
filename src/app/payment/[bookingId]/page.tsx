'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Need to create Tabs component or just use buttons
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CheckCircle2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

// Mock Tabs component for now if not present, but I should create it properly
// Or just implement simple state based tabs here to save time/files if complexity is low
// But better to use shadcn tabs for "Premium SaaS Level"
// I will assume I need to creat src/components/ui/tabs.tsx

export default function PaymentPage({ params }: { params: { bookingId: string } }) {
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'manual'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleRazorpay = async () => {
    setIsProcessing(true);
    // Simulate Razorpay opening
    setTimeout(() => {
      toast.success("Payment Received! (Test Mode)");
      setIsProcessing(false);
      // Call API to update booking status
      // router.push('/dashboard');
    }, 2000);
  };

  const handleManualUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate upload
    setTimeout(() => {
      toast.success("Screenshot uploaded. Awaiting admin approval.");
      setIsProcessing(false);
      // router.push('/dashboard');
    }, 2000);
  };

  return (
    <div className="container py-12 md:py-20 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
           <CardTitle>Complete Payment</CardTitle>
           <CardDescription>Booking ID: {params.bookingId}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="flex gap-4 mb-6">
             <Button 
               variant={paymentMethod === 'razorpay' ? 'default' : 'outline'} 
               onClick={() => setPaymentMethod('razorpay')}
               className="flex-1"
             >
               Pay Online
             </Button>
             <Button 
               variant={paymentMethod === 'manual' ? 'default' : 'outline'} 
               onClick={() => setPaymentMethod('manual')}
               className="flex-1"
             >
               Manual Transfer
             </Button>
           </div>

           {paymentMethod === 'razorpay' && (
             <div className="space-y-4 text-center py-8">
               <p className="text-muted-foreground">Secure payment via Razorpay</p>
               <Button size="lg" onClick={handleRazorpay} disabled={isProcessing}>
                 {isProcessing ? "Processing..." : "Pay Now"}
               </Button>
             </div>
           )}

           {paymentMethod === 'manual' && (
             <form onSubmit={handleManualUpload} className="space-y-4">
               <div className="space-y-2">
                 <Label>Bank Details</Label>
                 <div className="bg-secondary p-4 rounded-md text-sm">
                   <p>Bank: TravelNest Bank</p>
                   <p>Account: 1234567890</p>
                   <p>IFSC: TNB0001234</p>
                 </div>
               </div>
               
               <div className="space-y-2">
                 <Label htmlFor="proof">Upload Payment Proof</Label>
                 <Input id="proof" type="file" accept="image/*" required />
               </div>
               
               <Button type="submit" className="w-full" disabled={isProcessing}>
                 {isProcessing ? "Uploading..." : "Submit Proof"}
               </Button>
             </form>
           )}
        </CardContent>
      </Card>
    </div>
  )
}
