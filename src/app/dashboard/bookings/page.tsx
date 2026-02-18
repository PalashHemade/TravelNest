
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import Booking from "@/models/Booking";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react";

export default async function BookingsPage() {
    const session = await auth();
    if (!session?.user?.email) {
        redirect("/login");
    }

    await dbConnect();

    // We need the user's ID. In `next-auth.d.ts` we added `id` to the session.
    // However, we need to make sure we have it. If not, we might need to fetch the user again.
    // Let's assume session.user.id is available as per our earlier fix.
    // If not, we'd look up by email.
    
    // Safer to look up by email to get the _id for the query if we aren't 100% sure the session ID is consistent with DB _id format (though it should be)
    // Actually, let's trust the session ID if it exists, or fall back to email lookup if needed.
    // But `Booking` model stores `user` as ObjectId.
    
    // Let's just do a quick lookup to be safe and avoid casting issues
    const User = (await import("@/models/User")).default;
    const user = await User.findOne({ email: session.user.email }).select("_id");
    
    if (!user) return <div>User not found</div>;

    const bookings = await Booking.find({ user: user._id })
        .populate("package")
        .sort({ createdAt: -1 })
        .lean();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>

            {bookings.length === 0 ? (
                <div className="text-center py-12">
                     <h2 className="text-xl font-semibold">No bookings found</h2>
                     <p className="text-muted-foreground mt-2">You haven't booked any trips yet.</p>
                     <Button asChild className="mt-4">
                        <Link href="/packages">Explore Packages</Link>
                     </Button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {bookings.map((booking: any) => {
                        const pkg = booking.package;
                        return (
                            <Card key={booking._id.toString()} className="flex flex-col">
                                <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                                    {pkg?.image ? (
                                        <Image
                                            src={pkg.image}
                                            alt={pkg.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center bg-muted">
                                            No Image
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2">
                                        <Badge variant={
                                            booking.status === 'confirmed' ? 'default' : 
                                            booking.status === 'completed' ? 'secondary' :
                                            booking.status === 'cancelled' ? 'destructive' : 'outline'
                                        }>
                                            {booking.status.toUpperCase()}
                                        </Badge>
                                    </div>
                                </div>
                                <CardHeader>
                                    <CardTitle className="line-clamp-1">{pkg?.title || "Unknown Package"}</CardTitle>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <MapPinIcon className="mr-1 h-3 w-3" />
                                        {pkg?.destination || "Unknown Destination"}
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 space-y-2 text-sm">
                                    <div className="flex items-center">
                                        <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                                        <span>{format(new Date(booking.startDate), "PPP")}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <UsersIcon className="mr-2 h-4 w-4 text-primary" />
                                        <span>{booking.travelers} Travelers</span>
                                    </div>
                                    <div className="flex justify-between font-medium pt-2 border-t mt-2">
                                        <span>Total Price:</span>
                                        <span>${booking.totalPrice}</span>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href={`/dashboard/bookings/${booking._id.toString()}`}>
                                            View Details
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
