import dbConnect from "@/lib/db";
import Destination from "@/models/Destination";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function DestinationsPage() {
    await dbConnect();
    const destinations = await Destination.find({}).sort({ featured: -1, name: 1 }).lean();

    return (
        <div className="flex flex-col min-h-screen">
            {/* ══ HERO BANNER ══ */}
            <section className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop')",
                    }}
                >
                    <div className="absolute inset-0 bg-black/60" />
                </div>
                <div className="relative z-10 text-center text-white px-4">
                    <h1 className="text-5xl md:text-7xl font-black mb-3">Destinations</h1>
                    <p className="text-white/60 text-sm flex items-center justify-center gap-2">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <span>›</span>
                        <span>Destinations</span>
                    </p>
                </div>
            </section>

            {/* ══ SECTION INTRO ══ */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <span className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                            Explore The World
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2 mb-4 leading-tight">
                            Explore new worlds with<br />exotic natural scenery
                        </h2>
                        <p className="text-gray-500 max-w-xl mx-auto text-base">
                            Discover breathtaking destinations around the world. Each location has been handpicked for its unique beauty and experiences.
                        </p>
                    </div>

                    {destinations.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-6xl mb-5">🌍</p>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">No destinations yet</h2>
                            <p className="text-gray-500 mt-2">Check back soon — we're adding amazing places!</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {destinations.map((dest: any) => (
                                <div
                                    key={dest._id.toString()}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                                >
                                    <div className="relative h-60 overflow-hidden">
                                        <img
                                            src={dest.image}
                                            alt={dest.name}
                                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        {dest.featured && (
                                            <span className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full">
                                                Featured
                                            </span>
                                        )}
                                        {/* Gradient overlay at bottom */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                            <div>
                                                <h2 className="text-xl font-black text-white">{dest.name}</h2>
                                                <div className="flex items-center gap-1 text-white/70 text-xs mt-0.5">
                                                    <MapPin className="h-3 w-3" />
                                                    {dest.country}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                                            {dest.description}
                                        </p>
                                        <Link
                                            href={`/packages?destination=${encodeURIComponent(dest.name)}`}
                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-all group/btn"
                                        >
                                            View packages
                                            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
