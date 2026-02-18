import { auth } from "@/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Package from "@/models/Package";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Package as PackageIcon } from "lucide-react";
import { DeletePackageButton } from "@/components/admin/DeletePackageButton";

export const dynamic = 'force-dynamic';

export default async function AdminPackagesPage() {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') redirect("/");

    await dbConnect();
    const packages = await Package.find({}).sort({ createdAt: -1 }).lean();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Packages</h1>
                <Button asChild>
                    <Link href="/admin/packages/new">
                        <Plus className="mr-2 h-4 w-4" /> Add Package
                    </Link>
                </Button>
            </div>

            {packages.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <PackageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                        <h2 className="text-xl font-semibold">No packages yet</h2>
                        <p className="text-muted-foreground mt-1">Create your first travel package.</p>
                        <Button asChild className="mt-4">
                            <Link href="/admin/packages/new">Add Package</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="rounded-md border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="p-3 text-left font-medium">Title</th>
                                <th className="p-3 text-left font-medium">Destination</th>
                                <th className="p-3 text-left font-medium">Duration</th>
                                <th className="p-3 text-left font-medium">Price</th>
                                <th className="p-3 text-left font-medium">Featured</th>
                                <th className="p-3 text-left font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {packages.map((pkg: any) => (
                                <tr key={pkg._id.toString()} className="border-b hover:bg-muted/30 transition-colors">
                                    <td className="p-3 font-medium">{pkg.title}</td>
                                    <td className="p-3 text-muted-foreground">{pkg.destination}, {pkg.country}</td>
                                    <td className="p-3">{pkg.duration} days</td>
                                    <td className="p-3">${pkg.price.toLocaleString()}</td>
                                    <td className="p-3">
                                        {pkg.featured ? <Badge>Yes</Badge> : <Badge variant="outline">No</Badge>}
                                    </td>
                                    <td className="p-3">
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/admin/packages/${pkg._id.toString()}/edit`}>
                                                    <Pencil className="h-3 w-3" />
                                                </Link>
                                            </Button>
                                            <DeletePackageButton id={pkg._id.toString()} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
