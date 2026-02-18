import { auth } from "@/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Destination from "@/models/Destination";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";
import { DeleteDestinationButton } from "@/components/admin/DeleteDestinationButton";

export const dynamic = 'force-dynamic';

export default async function AdminDestinationsPage() {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') redirect("/");

    await dbConnect();
    const destinations = await Destination.find({}).sort({ createdAt: -1 }).lean();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Destinations</h1>
                <Button asChild>
                    <Link href="/admin/destinations/new">
                        <Plus className="mr-2 h-4 w-4" /> Add Destination
                    </Link>
                </Button>
            </div>

            {destinations.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                        <h2 className="text-xl font-semibold">No destinations yet</h2>
                        <p className="text-muted-foreground mt-1">Add your first destination to get started.</p>
                        <Button asChild className="mt-4">
                            <Link href="/admin/destinations/new">Add Destination</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {destinations.map((dest: any) => (
                        <Card key={dest._id.toString()} className="overflow-hidden">
                            <div className="relative h-40 w-full">
                                <img src={dest.image} alt={dest.name} className="h-full w-full object-cover" />
                                {dest.featured && (
                                    <Badge className="absolute top-2 right-2">Featured</Badge>
                                )}
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center justify-between">
                                    <span>{dest.name}</span>
                                    <span className="text-sm font-normal text-muted-foreground">{dest.country}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{dest.description}</p>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" asChild className="flex-1">
                                        <Link href={`/admin/destinations/${dest._id.toString()}/edit`}>
                                            <Pencil className="mr-1 h-3 w-3" /> Edit
                                        </Link>
                                    </Button>
                                    <DeleteDestinationButton id={dest._id.toString()} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
