const mongoose = require('mongoose');
const { Schema } = mongoose;
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

const PackageSchema = new Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        duration: { type: Number, required: true },
        image: { type: String, required: true },
        images: [{ type: String }],
        destination: { type: String, required: true },
        country: { type: String, required: true },
        rating: { type: Number, default: 0 },
        reviewsCount: { type: Number, default: 0 },
        amenities: [{ type: String }],
        maxPeople: { type: Number, required: true },
        featured: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Package = mongoose.models.Package || mongoose.model('Package', PackageSchema);

const samplePackages = [
    {
        title: "Magical Maldives Getaway",
        slug: "magical-maldives-getaway",
        description: "Experience the ultimate luxury in the Maldives. Stay in overwater bungalows, enjoy private dining on the beach, and explore vibrant coral reefs. This package includes return flights, 5-star accommodation, and daily excursions.",
        price: 2499,
        duration: 5,
        image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2065&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=1974&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?q=80&w=2064&auto=format&fit=crop"
        ],
        destination: "Malé",
        country: "Maldives",
        rating: 4.9,
        reviewsCount: 128,
        amenities: ["All Inclusive", "Free Wi-Fi", "Spa Access", "Airport Transfer", "Water Sports"],
        maxPeople: 2,
        featured: true
    },
    {
        title: "Swiss Alps Adventure",
        slug: "swiss-alps-adventure",
        description: "Discover the breathtaking beauty of the Swiss Alps. Hike through lush green valleys, witness majestic peaks, and enjoy Swiss chocolate and cheese fondue. Perfect for nature lovers and adventure seekers.",
        price: 1899,
        duration: 7,
        image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=2070&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1453227588063-bb302b62f50b?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"
        ],
        destination: "Interlaken",
        country: "Switzerland",
        rating: 4.8,
        reviewsCount: 95,
        amenities: ["Guided Hiking", "Breakfast Included", "Train Pass", "Photography Tour"],
        maxPeople: 4,
        featured: true
    },
    {
        title: "Kyoto Cultural Immersion",
        slug: "kyoto-cultural-immersion",
        description: "Immerse yourself in the rich history and culture of Kyoto. Visit ancient temples, participate in a traditional tea ceremony, and stroll through the Arashiyama Bamboo Grove.",
        price: 1599,
        duration: 6,
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1624823183492-f02787fc65df?q=80&w=1974&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1528360983277-13d9013200f9?q=80&w=2070&auto=format&fit=crop"
        ],
        destination: "Kyoto",
        country: "Japan",
        rating: 4.7,
        reviewsCount: 210,
        amenities: ["Tea Ceremony", "Temple Pass", "Local Guide", "Public Transport Card"],
        maxPeople: 2,
        featured: false
    },
    {
        title: "Safari in Serea",
        slug: "safari-in-serea",
        description: "Witness the Great Migration and see the Big Five in their natural habitat. Luxury tented camps and expert guides ensure an unforgettable experience.",
        price: 3200,
        duration: 8,
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1535591273668-578e31182c4f?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1547471080-7541f7e0255a?q=80&w=2070&auto=format&fit=crop"
        ],
        destination: "Serengeti",
        country: "Tanzania",
        rating: 5.0,
        reviewsCount: 65,
        amenities: ["Game Drives", "All Meals", "Park Fees", "Luxury Tent"],
        maxPeople: 6,
        featured: true
    }
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        await Package.deleteMany({});
        console.log('Cleared existing packages');

        await Package.insertMany(samplePackages);
        console.log('Seeded sample packages');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();
