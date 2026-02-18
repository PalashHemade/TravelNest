import { PackageCard } from "@/components/packages/PackageCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import dbConnect from "@/lib/db";
import Package from "@/models/Package";

// Force dynamic rendering if using searchParams that change
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
  
  // Example filter logic - expand as needed
  if (params.minPrice || params.maxPrice) {
    query.price = {};
    if (params.minPrice) query.price.$gte = Number(params.minPrice);
    if (params.maxPrice) query.price.$lte = Number(params.maxPrice);
  }

  // Use lean() for performance
  const packages = await Package.find(query).lean();
  
  // Serialize Mongoose docs to plain objects (handle _id, Date)
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
    <div className="container py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">Explore Packages</h1>
           <p className="text-muted-foreground mt-1">Find your perfect getaway from our curated selection.</p>
        </div>
        
        {/* Simple Search - could be a separate component */}
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-[300px]">
             <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
             <Input placeholder="Search destinations..." className="pl-9" />
          </div>
          <Button>Search</Button>
        </div>
      </div>

      {packages.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold">No packages found</h2>
          <p className="text-muted-foreground">Try adjusting your filters or search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
  );
}
