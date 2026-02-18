import { auth } from "@/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Booking from "@/models/Booking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Calendar, Activity } from "lucide-react";
import Package from "@/models/Package"; // To ensure model compilation

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  await dbConnect();
  
  // Ensure Package is registered
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = Package; 

  const bookings = await Booking.find({ user: session.user.id })
    .populate('package', 'title image')
    .sort({ createdAt: -1 })
    .lean();

  const totalSpent = bookings.reduce((acc: number, curr: any) => acc + (curr.paymentStatus === 'paid' ? curr.totalPrice : 0), 0);
  const activeBookings = bookings.filter((b: any) => b.status === 'confirmed' || b.status === 'pending').length;

  return (
    <div className="flex-col md:flex">
        <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Hi, {session.user.name} 👋</h2>
            
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Bookings
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bookings.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Trips
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeBookings}</div>
                </CardContent>
              </Card>
               <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Spent
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalSpent.toLocaleString()}</div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8">
               <h3 className="text-xl font-semibold mb-4">Recent Bookings</h3>
               {bookings.length === 0 ? (
                 <p className="text-muted-foreground">You haven't booked any trips yet.</p>
               ) : (
                 <div className="grid gap-4">
                   {bookings.map((booking: any) => (
                     <Card key={booking._id.toString()}>
                       <CardContent className="p-6 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             {booking.package.image && (
                               <img src={booking.package.image} alt="Trip" className="h-16 w-16 rounded-md object-cover" />
                             )}
                             <div>
                               <h4 className="font-bold">{booking.package.title}</h4>
                               <p className="text-sm text-muted-foreground">
                                 {new Date(booking.startDate).toLocaleDateString()} • {booking.travelers} Travelers
                               </p>
                             </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${booking.totalPrice.toLocaleString()}</p>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold 
                              ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}`}>
                              {booking.status.toUpperCase()}
                            </span>
                          </div>
                       </CardContent>
                     </Card>
                   ))}
                 </div>
               )}
            </div>
        </div>
    </div>
  );
}
