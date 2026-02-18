
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { updateProfile } from "@/app/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import { Shield, User as UserIcon, Lock } from "lucide-react";

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user?.email) {
        redirect("/login");
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email }).lean() as any;

    if (!user) {
        return <div>User not found</div>;
    }

    const isAdmin = session.user.role === 'admin';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <Badge
                    variant={isAdmin ? "default" : "secondary"}
                    className={`flex items-center gap-1.5 px-3 py-1 text-sm ${isAdmin ? "bg-orange-500 hover:bg-orange-600" : ""}`}
                >
                    {isAdmin ? <Shield className="h-3.5 w-3.5" /> : <UserIcon className="h-3.5 w-3.5" />}
                    {isAdmin ? "Admin" : "Traveler"}
                </Badge>
            </div>

            {/* Role info banner */}
            <div className={`rounded-lg border px-4 py-3 text-sm flex items-start gap-3 ${
                isAdmin
                    ? "border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-900 dark:bg-orange-950/30 dark:text-orange-300"
                    : "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300"
            }`}>
                {isAdmin ? <Shield className="h-4 w-4 mt-0.5 shrink-0" /> : <Lock className="h-4 w-4 mt-0.5 shrink-0" />}
                <div>
                    {isAdmin ? (
                        <><strong>Admin account</strong> — You can edit your name and password below.</>
                    ) : (
                        <><strong>Traveler account</strong> — Your profile is read-only. Only admins can modify account settings.</>
                    )}
                </div>
            </div>

            {/* Profile card */}
            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                        {isAdmin ? "Update your personal details." : "Your account information (read-only)."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isAdmin ? (
                        /* ── Admin: editable form ── */
                        <form action={async (formData) => { await updateProfile(formData); }} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    defaultValue={user.email}
                                    disabled
                                    className="bg-muted"
                                />
                                <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    defaultValue={user.name || ''}
                                    placeholder="Your Name"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Leave blank to keep current password"
                                />
                            </div>

                            <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                                <Shield className="mr-2 h-4 w-4" />
                                Save Changes
                            </Button>
                        </form>
                    ) : (
                        /* ── Regular user: read-only view ── */
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-muted-foreground text-xs uppercase tracking-wide">Email</Label>
                                <div className="flex items-center h-10 px-3 rounded-md border bg-muted text-sm">
                                    {user.email}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-muted-foreground text-xs uppercase tracking-wide">Name</Label>
                                <div className="flex items-center h-10 px-3 rounded-md border bg-muted text-sm">
                                    {user.name || '—'}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-muted-foreground text-xs uppercase tracking-wide">Account Type</Label>
                                <div className="flex items-center h-10 px-3 rounded-md border bg-muted text-sm">
                                    Traveler
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-muted-foreground text-xs uppercase tracking-wide">Sign-in Method</Label>
                                <div className="flex items-center h-10 px-3 rounded-md border bg-muted text-sm capitalize">
                                    {user.provider || 'credentials'}
                                </div>
                            </div>
                            <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground flex items-center gap-2">
                                <Lock className="h-4 w-4 shrink-0" />
                                Settings editing is restricted to Admin accounts.
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
