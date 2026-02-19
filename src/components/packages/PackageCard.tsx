import Link from "next/link";
import { Star } from "lucide-react";

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

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

export function PackageCard({
  id,
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
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title + Price */}
        <div className="flex items-start justify-between mb-3 gap-2">
          <h3 className="font-bold text-lg text-gray-900 leading-tight line-clamp-1">
            {destination}
          </h3>
          <span className="text-sm font-bold text-gray-900 whitespace-nowrap shrink-0">
            ${price.toLocaleString()}/{duration}days
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
          {title} — an amazing journey to {destination}. Explore beautiful scenery, local culture, and unforgettable experiences.
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto">
          <StarRating rating={rating} />
          <Link
            href={`/packages/${slug}`}
            className="px-5 py-2 bg-black text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-all duration-200"
          >
            Booking now
          </Link>
        </div>
      </div>
    </div>
  );
}
