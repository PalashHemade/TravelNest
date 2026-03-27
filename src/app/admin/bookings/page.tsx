import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAllBookings } from "@/lib/db/bookingService";
import { getAllUsers } from "@/lib/db/userService";
import { getAllPackages } from "@/lib/db/packageService";
import { Badge } from "@/components/ui/badge";
import { BookingStatusSelect } from "@/components/admin/BookingStatusSelect";

export const dynamic = 'force-dynamic';

export default async function AdminBookingsPage() {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') redirect("/");

    const [rawBookings, users, packages] = await Promise.all([
        getAllBookings(),
        getAllUsers(),
        getAllPackages(),
    ]);

    const bookings = rawBookings.map((b: any) => ({
        ...b,
        user: users.find((u: any) => u.userId === b.userId),
        package: packages.find((p: any) => p.packageId === b.package)
    })).sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">All Bookings</h1>
            <div className="rounded-md border">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b bg-muted/50">
                            <th className="p-3 text-left font-medium">User</th>
                            <th className="p-3 text-left font-medium">Package</th>
                            <th className="p-3 text-left font-medium">Date</th>
                            <th className="p-3 text-left font-medium">Travelers</th>
                            <th className="p-3 text-left font-medium">Total</th>
                            <th className="p-3 text-left font-medium">Payment</th>
                            <th className="p-3 text-left font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.length === 0 && (
                            <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">No bookings yet.</td></tr>
                        )}
                        {bookings.map((booking: any) => (
                            <tr key={booking.bookingId} className="border-b hover:bg-muted/30 transition-colors">
                                <td className="p-3">
                                    <div className="font-medium">{booking.user?.name}</div>
                                    <div className="text-xs text-muted-foreground">{booking.user?.email}</div>
                                </td>
                                <td className="p-3">
                                    <div>{booking.package?.title}</div>
                                    <div className="text-xs text-muted-foreground">{booking.package?.destination}</div>
                                </td>
                                <td className="p-3">{new Date(booking.startDate).toLocaleDateString()}</td>
                                <td className="p-3">{booking.travelers}</td>
                                <td className="p-3 font-medium">${booking.totalPrice.toLocaleString()}</td>
                                <td className="p-3">
                                    <Badge variant={booking.paymentStatus === 'paid' ? 'default' : booking.paymentStatus === 'unpaid' ? 'destructive' : 'outline'}>
                                        {booking.paymentStatus}
                                    </Badge>
                                </td>
                                <td className="p-3">
                                    <BookingStatusSelect id={booking.bookingId} currentStatus={booking.status} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
