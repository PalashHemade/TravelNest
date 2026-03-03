import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import Booking from "@/models/Booking";
import Package from "@/models/Package";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { CalendarIcon, MapPinIcon, UsersIcon, ArrowLeft } from "lucide-react";

interface BookingDetailsPageProps {
    params: {
        id: string;
    }
}

export default async function BookingDetailsPage({ params }: BookingDetailsPageProps) {
    const session = await auth();
    if (!session?.user?.email) {
        redirect("/login");
    }

    await dbConnect();

    const User = (await import("@/models/User")).default;
    const user = await User.findOne({ email: session.user.email }).select("_id p");
    
    if (!user) return <div>User not found</div>;

    let booking;
    try {
        booking = await Booking.findOne({ 
            _id: params.id,
            user: user._id 
        })
        .populate("package")
        .lean();
    } catch (e) {
        return <div>Invalid Booking ID</div>;
    }

    if (!booking) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-semibold">Booking not found</h2>
                <p className="text-muted-foreground mt-2">The booking you are looking for does not exist or you do not have permission to view it.</p>
                <Button asChild className="mt-4">
                    <Link href="/dashboard/bookings">Back to Bookings</Link>
                </Button>
            </div>
        );
    }

    const pkg: any = booking.package;

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                 <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/bookings">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                 </Button>
                 <h1 className="text-3xl font-bold tracking-tight">Booking Details</h1>
                 <div className="flex-1" />
                 <Badge variant={
                    booking.status === 'confirmed' ? 'default' : 
                    booking.status === 'completed' ? 'secondary' :
                    booking.status === 'cancelled' ? 'destructive' : 'outline'
                } className="text-sm px-3 py-1">
                    {booking.status.toUpperCase()}
                </Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
                <div className="md:col-span-2 lg:col-span-3 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Package Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="relative h-64 w-full overflow-hidden rounded-lg">
                                {pkg?.image ? (
                                    <Image
                                        src={pkg.image}
                                        alt={pkg?.title || 'Package Image'}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center bg-muted">
                                        No Image Available
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">{pkg?.title || "Unknown Package"}</h3>
                                <div className="flex items-center text-muted-foreground mt-2">
                                    <MapPinIcon className="mr-2 h-4 w-4" />
                                    {pkg?.destination || "Unknown Destination"}
                                </div>
                            </div>
                            <p className="text-muted-foreground">
                                {pkg?.description || "No description available."}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Trip Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <CalendarIcon className="mt-0.5 h-5 w-5 text-primary" />
                                <div>
                                    <p className="font-medium text-sm">Dates</p>
                                    <p className="text-sm text-muted-foreground">
                                        {format(new Date((booking as any).startDate), "PPP")} - {((booking as any).endDate) ? format(new Date(((booking as any).endDate)), "PPP") : 'TBD'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <UsersIcon className="mt-0.5 h-5 w-5 text-primary" />
                                <div>
                                    <p className="font-medium text-sm">Travelers</p>
                                    <p className="text-sm text-muted-foreground">{booking.travelers} Guests</p>
                                </div>
                            </div>
                             <div className="pt-4 border-t">
                                <div className="flex justify-between items-center font-medium">
                                    <span>Total Price</span>
                                    <span className="text-xl">${booking.totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-muted-foreground mt-2">
                                    <span>Payment Status</span>
                                    <span className="uppercase">{booking.paymentStatus}</span>
                                </div>
                            </div>
                            <div className="pt-4 space-y-3">
                                <Button className="w-full" asChild>
                                    <Link href={`/dashboard/bookings/${booking._id.toString()}/invoice`}>
                                        View Invoice
                                    </Link>
                                </Button>
                                {booking.status === 'pending' && (
                                     <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10">
                                         Cancel Booking
                                     </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
