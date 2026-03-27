
import { auth } from "@/auth";
import { getBookingsByUser } from "@/lib/db/bookingService";
import { getAllPackages } from "@/lib/db/packageService";
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

    const { getUserByEmail } = await import("@/lib/db/userService");
    const user: any = await getUserByEmail(session.user.email);
    
    if (!user) return <div>User not found</div>;

    const rawBookings = await getBookingsByUser(user.userId);
    const packages = await getAllPackages();
    
    const bookings = rawBookings.map((b: any) => ({
        ...b,
        _id: b.bookingId, // To keep the JSX below working seamlessly
        package: packages.find((p: any) => p.packageId === b.package)
    })).sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

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
