"use client";

import Link from "next/link";
import { useState } from "react";
import { MapPin, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const DESTINATIONS = [
  {
    id: 1,
    name: "Bali, Indonesia",
    description: "Bali is a beautiful tourist spot and is visited by many travelers.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop",
    country: "Indonesia",
  },
  {
    id: 2,
    name: "Swiss Alps",
    description: "Experience the breathtaking beauty of the Swiss Alps and pristine mountain villages.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop",
    country: "Switzerland",
  },
  {
    id: 3,
    name: "New York City",
    description: "The city that never sleeps. Iconic skyline, world-class culture, and endless energy.",
    image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=800&auto=format&fit=crop",
    country: "USA",
  },
  {
    id: 4,
    name: "Paris, France",
    description: "The city of love and lights. Visit the Eiffel Tower, the Louvre, and romantic cafés.",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800&auto=format&fit=crop",
    country: "France",
  },
  {
    id: 5,
    name: "Thailand",
    description: "Stunning temples, tropical beaches, and vibrant street food culture await.",
    image: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?q=80&w=800&auto=format&fit=crop",
    country: "Thailand",
  },
];

const FEATURED_PACKAGES = [
  {
    name: "Paris",
    price: "$299.00",
    duration: "2days",
    description: "Experience the magic of Paris — the city of love and lights with iconic landmarks.",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=700&auto=format&fit=crop",
    rating: 5,
    href: "/packages",
  },
  {
    name: "Swiss Alps",
    price: "$299.00",
    duration: "3days",
    description: "Breathtaking mountain landscapes, pristine ski slopes, and charming alpine villages.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=700&auto=format&fit=crop",
    rating: 5,
    href: "/packages",
  },
  {
    name: "Thailand",
    price: "$299.00",
    duration: "3days",
    description: "Stunning temples, tropical beaches, and vibrant street food await in Thailand.",
    image: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?q=80&w=700&auto=format&fit=crop",
    rating: 5,
    href: "/packages",
  },
  {
    name: "Taiwan",
    price: "$299.00",
    duration: "3days",
    description: "Discover the Golden Bridge, stunning gorges, and vibrant night markets of Taiwan.",
    image: "https://images.unsplash.com/photo-1470004914212-05527e49370b?q=80&w=700&auto=format&fit=crop",
    rating: 5,
    href: "/packages",
  },
  {
    name: "Indonesia",
    price: "$299.00",
    duration: "3days",
    description: "Lush rainforests, hidden waterfalls, and pristine rivers in the heart of Indonesia.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=700&auto=format&fit=crop",
    rating: 5,
    href: "/packages",
  },
  {
    name: "Singapore",
    price: "$299.00",
    duration: "3days",
    description: "The iconic Merlion, futuristic skyline, and world-renowned food paradise.",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=700&auto=format&fit=crop",
    rating: 5,
    href: "/packages",
  },
];

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-amber-400 text-base">★</span>
      ))}
    </div>
  );
}

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () => setActiveIndex((i) => (i - 1 + DESTINATIONS.length) % DESTINATIONS.length);
  const next = () => setActiveIndex((i) => (i + 1) % DESTINATIONS.length);

  const visibleDestinations = [
    DESTINATIONS[(activeIndex) % DESTINATIONS.length],
    DESTINATIONS[(activeIndex + 1) % DESTINATIONS.length],
    DESTINATIONS[(activeIndex + 2) % DESTINATIONS.length],
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* ═══════════════════════════════════════════ */}
      {/* HERO SECTION                                */}
      {/* ═══════════════════════════════════════════ */}
      <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2035&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl text-white">
            <h1 className="text-6xl md:text-8xl font-black leading-none tracking-tight mb-6 animate-fade-up">
              Make in<br />
              your journey.
            </h1>
            <p className="text-lg text-white/80 mb-10 leading-relaxed animate-fade-up-delay-1">
              Explore the world with what you love beautiful<br className="hidden md:block" />
              natural beauty.
            </p>

            {/* Search Bar — pill style matching Figma */}
            <div className="bg-white rounded-full shadow-2xl flex flex-wrap md:flex-nowrap items-center gap-0 overflow-hidden w-full max-w-xl animate-fade-up-delay-2">
              <SearchPill label="Location" icon="📍" />
              <div className="w-px h-8 bg-gray-200 hidden md:block" />
              <SearchPill label="Date" icon="📅" />
              <div className="w-px h-8 bg-gray-200 hidden md:block" />
              <SearchPill label="People" icon="👥" />
              <Link
                href="/packages"
                className="ml-auto px-6 py-4 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-all whitespace-nowrap text-sm"
              >
                Explore now
              </Link>
            </div>

            <p className="mt-6 text-sm text-white/60 animate-fade-up-delay-3">
              <span className="font-semibold text-white/80">Popular Place :</span>{" "}
              Bali, Istanbul, Rome, Paris.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* EXPLORE DESTINATIONS CAROUSEL              */}
      {/* ═══════════════════════════════════════════ */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          {/* Heading */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
              Explore new worlds with<br />exotic natural scenery
            </h2>
            <p className="text-gray-500 text-base">
              Explore the world with what you love beautiful natural beauty.
            </p>
          </div>

          {/* Carousel */}
          <div className="relative flex items-center gap-4">
            {/* Prev */}
            <button
              onClick={prev}
              className="hidden md:flex absolute -left-6 z-10 h-12 w-12 rounded-full border border-gray-200 bg-white shadow-md items-center justify-center hover:bg-gray-50 transition-all shrink-0"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>

            {/* Cards Grid */}
            <div className="flex gap-5 w-full overflow-hidden justify-center">
              {visibleDestinations.map((dest, i) => (
                <div
                  key={dest.id}
                  className={`relative rounded-2xl overflow-hidden flex-shrink-0 transition-all duration-500 cursor-pointer group ${
                    i === 1
                      ? "w-full md:w-80 shadow-xl ring-2 ring-gray-900/10"
                      : "w-60 md:w-64 opacity-80"
                  }`}
                >
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className={`object-cover w-full transition-transform duration-500 group-hover:scale-105 ${
                      i === 1 ? "h-96" : "h-60 md:h-72"
                    }`}
                  />
                  {i === 1 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-b-2xl p-5">
                      <div className="absolute -top-5 right-4 h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-900 font-bold text-lg">
                        "
                      </div>
                      <h3 className="text-xl font-black text-gray-900 mb-1">{dest.name}.</h3>
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                        {dest.description}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Next */}
            <button
              onClick={next}
              className="hidden md:flex absolute -right-6 z-10 h-12 w-12 rounded-full border border-gray-200 bg-white shadow-md items-center justify-center hover:bg-gray-50 transition-all shrink-0"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {DESTINATIONS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "w-8 bg-gray-900" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* FEATURED PACKAGES — Dark Section           */}
      {/* ═══════════════════════════════════════════ */}
      <section className="py-20 bg-gray-950 text-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <p className="text-gray-300 max-w-xs leading-relaxed text-sm">
              Explore some of the world's most famous tourist destinations. Each is unique, beautiful, and full of adventure.
            </p>
            <Link
              href="/packages"
              className="text-white font-bold text-lg hover:text-gray-300 transition-colors flex items-center gap-2 group"
            >
              Discover more
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                className="bg-white rounded-2xl overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image */}
                <div className="h-52 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Info */}
                <div className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-black text-gray-900">{pkg.name}</h3>
                    <span className="text-sm font-bold text-gray-700">
                      {pkg.price}/{pkg.duration}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-5 line-clamp-2 leading-relaxed">
                    {pkg.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <StarRating count={pkg.rating} />
                    <Link
                      href={pkg.href}
                      className="px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-all"
                    >
                      Booking now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* WHY CHOOSE US                              */}
      {/* ═══════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Image collage */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=600&auto=format&fit=crop"
                  alt="Nature"
                  className="rounded-2xl h-64 w-full object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=600&auto=format&fit=crop"
                  alt="Travel"
                  className="rounded-2xl h-64 w-full object-cover mt-8"
                />
                <img
                  src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600&auto=format&fit=crop"
                  alt="Adventure"
                  className="rounded-2xl h-48 w-full object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600&auto=format&fit=crop"
                  alt="World"
                  className="rounded-2xl h-48 w-full object-cover mt-4"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-black text-white rounded-2xl px-6 py-4 shadow-xl">
                <p className="text-3xl font-black">12K+</p>
                <p className="text-xs text-gray-400">Happy Travelers</p>
              </div>
            </div>

            {/* Right: Content */}
            <div className="space-y-6">
              <span className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                Why TravelNest
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                Your Journey,<br />Our Passion.
              </h2>
              <p className="text-gray-500 leading-relaxed text-base">
                We craft unforgettable travel experiences tailored just for you. From exotic beaches to majestic mountains — every trip is curated with care, safety, and adventure in mind.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: "🌍", title: "50+ Destinations", subtitle: "Worldwide coverage" },
                  { icon: "⭐", title: "4.9 Rating", subtitle: "From 12,000+ reviews" },
                  { icon: "🛡️", title: "Safe Travel", subtitle: "100% verified guides" },
                  { icon: "💎", title: "Best Prices", subtitle: "No hidden charges" },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center text-xl shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/packages"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-all"
              >
                Start Exploring
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* TESTIMONIALS                               */}
      {/* ═══════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold uppercase tracking-widest text-gray-400">Testimonials</span>
            <h2 className="text-4xl font-black text-gray-900 mt-2">What Our Travelers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Mitchell",
                location: "New York, USA",
                text: "TravelNest made our Bali trip absolutely magical. The service was impeccable, the itinerary was perfect, and every detail was taken care of!",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
              },
              {
                name: "James Rowland",
                location: "London, UK",
                text: "The Swiss Alps package was the best travel decision I've ever made. Breathtaking views, spotless accommodations, and a genuinely caring team.",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
              },
              {
                name: "Yuki Tanaka",
                location: "Tokyo, Japan",
                text: "I've traveled with many agencies but TravelNest stands above them all. The Singapore trip was flawlessly organized. Already booking my next adventure!",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
              },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(s => <span key={s} className="text-amber-400">★</span>)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* CTA BANNER                                 */}
      {/* ═══════════════════════════════════════════ */}
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-black/65" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <h2 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
            Ready for Your Next<br />Adventure?
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
            Join over 12,000 happy travelers and start planning your dream trip today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/packages"
              className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition-all text-base"
            >
              Browse Packages
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all text-base"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

function SearchPill({ label, icon }: { label: string; icon: string }) {
  return (
    <button className="flex items-center gap-2 px-5 py-4 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors rounded-full">
      <span className="text-base">{icon}</span>
      <span>{label}</span>
      <span className="text-gray-400 text-xs">▾</span>
    </button>
  );
}
