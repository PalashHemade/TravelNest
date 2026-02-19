import { auth } from "@/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ShieldCheck, User as UserIcon } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') redirect("/");

    await dbConnect();
    const users = await User.find({})
        .sort({ createdAt: -1 })
        .select('name email role provider createdAt')
        .lean();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{users.length} total users</span>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                </CardHeader>
                <CardContent>
                    {users.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Users className="h-12 w-12 text-muted-foreground mb-4" />
                            <h2 className="text-xl font-semibold">No users yet</h2>
                            <p className="text-muted-foreground mt-1">Users will appear here after registration.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left text-muted-foreground">
                                        <th className="pb-3 font-medium">User</th>
                                        <th className="pb-3 font-medium">Email</th>
                                        <th className="pb-3 font-medium">Role</th>
                                        <th className="pb-3 font-medium">Provider</th>
                                        <th className="pb-3 font-medium">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {users.map((user: any) => (
                                        <tr key={user._id.toString()} className="py-3 hover:bg-muted/50 transition-colors">
                                            <td className="py-3 pr-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                                                        {user.name?.[0]?.toUpperCase() || '?'}
                                                    </div>
                                                    <span className="font-medium">{user.name || '—'}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 pr-4 text-muted-foreground">{user.email}</td>
                                            <td className="py-3 pr-4">
                                                {user.role === 'admin' ? (
                                                    <Badge className="bg-orange-500 hover:bg-orange-600 flex items-center gap-1 w-fit">
                                                        <ShieldCheck className="h-3 w-3" />
                                                        Admin
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                                                        <UserIcon className="h-3 w-3" />
                                                        {user.role === 'guest' ? 'Guest' : 'Traveler'}
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="py-3 pr-4">
                                                <span className="capitalize text-muted-foreground">{user.provider || 'credentials'}</span>
                                            </td>
                                            <td className="py-3 text-muted-foreground">
                                                {user.createdAt
                                                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric', month: 'short', day: 'numeric'
                                                    })
                                                    : '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
