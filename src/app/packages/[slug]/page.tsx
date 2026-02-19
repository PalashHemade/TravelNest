import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Clock,
  Star,
  CheckCircle2,
  Share2,
  Heart
} from "lucide-react";
import dbConnect from "@/lib/db";
import Package from "@/models/Package";
import { BookNowButton } from "@/components/packages/BookNowButton";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getPackage(slug: string) {
  await dbConnect();
  const pkg = await Package.findOne({ slug }).lean();
  if (!pkg) return null;
  
  return {
    ...pkg,
    _id: pkg._id.toString(),
    createdAt: pkg.createdAt?.toISOString(),
    updatedAt: pkg.updatedAt?.toISOString(),
  };
}

export default async function PackageDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const pkg: any = await getPackage(slug);

  if (!pkg) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Image */}
      <div className="relative h-[60vh] w-full">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 container mx-auto text-white">
          <div className="flex items-center gap-2 mb-4 text-sm font-medium bg-primary/20 backdrop-blur w-fit px-3 py-1 rounded-full border border-primary/30 text-primary-foreground">
             <MapPin className="h-4 w-4" /> {pkg.country}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{pkg.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-lg">
             <div className="flex items-center gap-2">
               <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
               <span className="font-semibold">{pkg.rating}</span> 
               <span className="text-gray-300">({pkg.reviewsCount} reviews)</span>
             </div>
             <div className="flex items-center gap-2">
               <Clock className="h-5 w-5" />
               <span>{pkg.duration} Days</span>
             </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-lg">
              {pkg.description}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">What's Included</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {pkg.amenities?.map((item: string, index: number) => (
                 <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                   <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                   <span className="font-medium">{item}</span>
                 </div>
               ))}
             </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
               {pkg.images?.map((img: string, idx: number) => (
                 <div key={idx} className="aspect-square relative rounded-xl overflow-hidden group cursor-pointer">
                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                 </div>
               ))}
            </div>
          </section>
        </div>

        {/* Sidebar Booking Card */}
        <div className="lg:col-span-1">
           <div className="sticky top-24">
             <Card className="shadow-xl border-t-4 border-t-primary">
               <CardContent className="p-6 space-y-6">
                 <div className="flex justify-between items-end border-b pb-6">
                   <div>
                     <p className="text-sm text-muted-foreground">Starting from</p>
                     <p className="text-3xl font-bold text-primary">${pkg.price.toLocaleString()}</p>
                   </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline" className="rounded-full">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" className="rounded-full">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                 </div>

                 <div className="space-y-4">
                   <div className="bg-secondary/50 p-4 rounded-lg flex items-center justify-between">
                      <span className="text-sm font-medium">Duration</span>
                      <span className="font-bold">{pkg.duration} Days / {pkg.duration - 1} Nights</span>
                   </div>
                   <div className="bg-secondary/50 p-4 rounded-lg flex items-center justify-between">
                      <span className="text-sm font-medium">Max People</span>
                      <span className="font-bold">{pkg.maxPeople} Guests</span>
                   </div>
                 </div>
                 
                  <BookNowButton packageId={pkg._id} slug={slug} />
                 
                 <p className="text-xs text-center text-muted-foreground">
                   Free cancellation up to 48 hours before the trip.
                 </p>
               </CardContent>
             </Card>
           </div>
        </div>
      </div>
    </div>
  );
}
