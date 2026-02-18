import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Calendar, Users, ArrowRight, Star } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-black/40 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center text-white space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            Discover Your Next <br/> <span className="text-primary-foreground">Adventure</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            Premium travel experiences curated just for you. Explore the world's most beautiful destinations.
          </p>

          {/* Search Bar */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl max-w-4xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 border border-white/20 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-300" />
                <Input 
                  placeholder="Where to?" 
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-white h-12"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-300" />
                <Input 
                  type="date"
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-white h-12"
                />
              </div>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-5 w-5 text-gray-300" />
                <Input 
                  type="number" 
                  placeholder="Guests" 
                  min={1}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-white h-12"
                />
              </div>
              <Button size="lg" className="h-12 text-lg font-semibold w-full">
                <Search className="mr-2 h-5 w-5" /> Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">Trending Destinations</h2>
              <p className="text-muted-foreground text-lg">Most popular places to visit this season</p>
            </div>
            <Button variant="outline" className="hidden md:flex">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-[4/5] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" /> {/* Placeholder/Skeleton */}
                   <img 
                    src={`https://images.unsplash.com/photo-${item === 1 ? '1506929562872-bb421503ef21' : item === 2 ? '1502602898657-3e91760cbb34' : item === 3 ? '1523906834658-6e24ef2386f9' : '1499678329028-101435549a4e'}?q=80&w=600&auto=format&fit=crop`}
                    alt="Destination"
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1 text-sm font-semibold shadow-sm">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    4.9
                  </div>
                </div>
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg mb-1">Destination Name</h3>
                      <p className="text-muted-foreground text-sm flex items-center">
                        <MapPin className="h-3 w-3 mr-1" /> Country
                      </p>
                    </div>
                    <p className="font-semibold text-primary">$1,200</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
           <div className="mt-8 text-center md:hidden">
            <Button variant="outline" size="lg" className="w-full">
              View All Destinations
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
