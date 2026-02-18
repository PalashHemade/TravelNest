import { auth } from "@/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import CustomPackageRequest from "@/models/CustomPackageRequest";
import User from "@/models/User";
import { Badge } from "@/components/ui/badge";
import { CustomRequestActions } from "@/components/admin/CustomRequestActions";

export const dynamic = 'force-dynamic';

export default async function AdminCustomRequestsPage() {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') redirect("/");

    await dbConnect();
    void User;
    const requests = await CustomPackageRequest.find({})
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .lean();

    const statusColors: Record<string, any> = {
        pending: 'outline',
        reviewed: 'secondary',
        quoted: 'default',
        closed: 'destructive',
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Custom Package Requests</h1>
            <div className="space-y-4">
                {requests.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">No custom requests yet.</div>
                )}
                {requests.map((req: any) => (
                    <div key={req._id.toString()} className="rounded-lg border p-4 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="font-semibold">{req.user?.name} <span className="text-muted-foreground font-normal text-sm">({req.user?.email})</span></div>
                                <div className="text-sm text-muted-foreground mt-1">
                                    {req.destinations.join(', ')} • {req.days} days • {req.travelers} travelers
                                    {req.budget && ` • Budget: $${req.budget.toLocaleString()}`}
                                </div>
                                {req.notes && <p className="text-sm mt-2 italic">"{req.notes}"</p>}
                                {req.adminNote && (
                                    <div className="mt-2 p-2 bg-muted rounded text-sm">
                                        <span className="font-medium">Admin Note:</span> {req.adminNote}
                                    </div>
                                )}
                                <div className="text-xs text-muted-foreground mt-1">
                                    Contact: {req.contactEmail} | {req.contactPhone}
                                </div>
                            </div>
                            <Badge variant={statusColors[req.status]}>{req.status}</Badge>
                        </div>
                        <CustomRequestActions id={req._id.toString()} currentStatus={req.status} currentNote={req.adminNote || ''} />
                    </div>
                ))}
            </div>
        </div>
    );
}
