import { auth } from "@/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Booking from "@/models/Booking";
import User from "@/models/User";
import Package from "@/models/Package";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Calendar, Users, Package as PackageIcon } from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'admin') {
    redirect("/"); // Or unauth page
  }

  await dbConnect();

  const totalRevenue = await Booking.aggregate([
    { $match: { paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } }
  ]);
  
  const revenue = totalRevenue[0]?.total || 0;
  
  const bookingsCount = await Booking.countDocuments();
  const usersCount = await User.countDocuments();
  const packagesCount = await Package.countDocuments();

  // Recent Bookings
  const recentBookings = await Booking.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name email')
    .populate('package', 'title')
    .lean();

  return (
    <div className="flex-col md:flex space-y-8 pb-10">
        <div className="flex justify-between items-center">
             <h2 className="text-3xl font-bold tracking-tight">Admin Overview</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${revenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookingsCount}</div>
               <p className="text-xs text-muted-foreground">+180 since last hour</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usersCount}</div>
               <p className="text-xs text-muted-foreground">+12 since yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Packages</CardTitle>
              <PackageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{packagesCount}</div>
               <p className="text-xs text-muted-foreground">Active destinations</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
           <Card className="col-span-4">
             <CardHeader>
               <CardTitle>Overview</CardTitle>
             </CardHeader>
             <CardContent className="pl-2">
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                   Chart Placeholder (Recharts)
                </div>
             </CardContent>
           </Card>
            <Card className="col-span-3">
             <CardHeader>
               <CardTitle>Recent Sales</CardTitle>
                <div className="space-y-8 mt-4">
                  {recentBookings.map((booking: any) => (
                    <div key={booking._id.toString()} className="flex items-center">
                      <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {booking.user?.name?.[0] || 'U'}
                      </div>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{booking.user?.name}</p>
                        <p className="text-sm text-muted-foreground">{booking.user?.email}</p>
                      </div>
                      <div className="ml-auto font-medium">+${booking.totalPrice.toLocaleString()}</div>
                    </div>
                  ))}
                   {recentBookings.length === 0 && <p className="text-sm text-muted-foreground">No recent bookings.</p>}
                </div>
             </CardHeader>
           </Card>
        </div>
    </div>
  );
}
