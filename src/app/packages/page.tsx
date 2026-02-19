import { PackageCard } from "@/components/packages/PackageCard";
import { Search, ArrowRight } from "lucide-react";
import dbConnect from "@/lib/db";
import Package from "@/models/Package";
import Link from "next/link";

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    destination?: string;
    minPrice?: string;
    maxPrice?: string;
    duration?: string;
  }>
}

async function getPackages(params: any) {
  await dbConnect();
  const query: any = {};
  if (params.destination) {
    query.destination = { $regex: params.destination, $options: 'i' };
  }
  if (params.minPrice || params.maxPrice) {
    query.price = {};
    if (params.minPrice) query.price.$gte = Number(params.minPrice);
    if (params.maxPrice) query.price.$lte = Number(params.maxPrice);
  }
  const packages = await Package.find(query).lean();
  return packages.map((pkg: any) => ({
    ...pkg,
    _id: pkg._id.toString(),
    createdAt: pkg.createdAt?.toISOString(),
    updatedAt: pkg.updatedAt?.toISOString(),
  }));
}

export default async function PackagesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const packages = await getPackages(params);

  return (
    <div className="flex flex-col min-h-screen">
      {/* ══ HERO BANNER ══ */}
      <section className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=2070&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-black mb-3">Packages</h1>
          <p className="text-white/60 text-sm flex items-center justify-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <span>Packages</span>
          </p>
        </div>
      </section>

      {/* ══ PACKAGES GRID (dark background matching Figma) ══ */}
      <section className="bg-gray-950 py-16 flex-1">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <p className="text-gray-400 max-w-xs leading-relaxed text-sm">
                Explore some of the world's most famous tourist destinations, each unique and full of adventure.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search destinations..."
                  className="pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-gray-500 w-56"
                />
              </div>
              <Link
                href="/packages"
                className="text-white font-bold text-sm hover:text-gray-300 transition-colors flex items-center gap-1 group"
              >
                All Packages
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {packages.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">🌍</p>
              <h2 className="text-2xl font-bold text-white mb-2">No packages found</h2>
              <p className="text-gray-400">Check back later or contact us to plan a custom trip.</p>
              <Link href="/contact" className="mt-6 inline-block px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-all">
                Contact Us
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg: any) => (
                <PackageCard
                  key={pkg._id}
                  id={pkg._id}
                  title={pkg.title}
                  slug={pkg.slug}
                  image={pkg.image}
                  price={pkg.price}
                  duration={pkg.duration}
                  destination={pkg.destination}
                  rating={pkg.rating}
                  reviewsCount={pkg.reviewsCount}
                  maxPeople={pkg.maxPeople}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
