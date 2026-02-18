import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Star, Users } from "lucide-react";

interface PackageCardProps {
  id: string;
  title: string;
  slug: string;
  image: string;
  price: number;
  duration: number;
  destination: string;
  rating: number;
  reviewsCount: number;
  maxPeople: number;
}

export function PackageCard({
  title,
  slug,
  image,
  price,
  duration,
  destination,
  rating,
  reviewsCount,
  maxPeople,
}: PackageCardProps) {
  return (
    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
      <div className="aspect-[4/3] relative overflow-hidden">
        <Link href={`/packages/${slug}`}>
           <img
            src={image}
            alt={title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1 text-sm font-semibold shadow-sm">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          {rating.toFixed(1)} <span className="text-gray-500 font-normal">({reviewsCount})</span>
        </div>
      </div>
      <CardContent className="p-5 flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg mb-1 line-clamp-1">
              <Link href={`/packages/${slug}`} className="hover:text-primary transition-colors">
                {title}
              </Link>
            </h3>
            <p className="text-muted-foreground text-sm flex items-center">
              <MapPin className="h-3 w-3 mr-1" /> {destination}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {duration} Days
          </div>
          <div className="flex items-center gap-1">
             <Users className="h-4 w-4" />
             Max {maxPeople}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-gray-100 mt-auto bg-gray-50/50">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">From</span>
          <span className="text-xl font-bold text-primary">${price.toLocaleString()}</span>
        </div>
        <Link href={`/packages/${slug}`}>
          <Button>View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
