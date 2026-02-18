import dbConnect from "@/lib/db";
import Destination from "@/models/Destination";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function DestinationsPage() {
    await dbConnect();
    const destinations = await Destination.find({}).sort({ featured: -1, name: 1 }).lean();

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Explore Destinations</h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Discover breathtaking destinations around the world. Each location has been handpicked for its unique beauty and experiences.
                </p>
            </div>

            {destinations.length === 0 ? (
                <div className="text-center py-20">
                    <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold">No destinations yet</h2>
                    <p className="text-muted-foreground mt-2">Check back soon — we're adding amazing places!</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {destinations.map((dest: any) => (
                        <Card key={dest._id.toString()} className="overflow-hidden group hover:shadow-lg transition-shadow">
                            <div className="relative h-52 overflow-hidden">
                                <img
                                    src={dest.image}
                                    alt={dest.name}
                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {dest.featured && (
                                    <Badge className="absolute top-3 right-3">Featured</Badge>
                                )}
                            </div>
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between mb-2">
                                    <h2 className="text-xl font-bold">{dest.name}</h2>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        {dest.country}
                                    </div>
                                </div>
                                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{dest.description}</p>
                                <Link
                                    href={`/packages?destination=${encodeURIComponent(dest.name)}`}
                                    className="text-sm font-medium text-primary hover:underline"
                                >
                                    View packages →
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
