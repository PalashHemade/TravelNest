
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

const PackageSchema = new mongoose.Schema(
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
        description: "Experience the ultimate luxury in the Maldives. Stay in overwater bungalows, enjoy private dining on the beach, and explore vibrant coral reefs.",
        price: 2499,
        duration: 5,
        image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2065&auto=format&fit=crop",
        images: [],
        destination: "Malé",
        country: "Maldives",
        rating: 4.9,
        reviewsCount: 128,
        amenities: ["All Inclusive", "Free Wi-Fi", "Spa Access"],
        maxPeople: 2,
        featured: true
    },
    {
        title: "Swiss Alps Adventure",
        slug: "swiss-alps-adventure",
        description: "Discover the breathtaking beauty of the Swiss Alps. Hike through lush green valleys, witness majestic peaks, and enjoy Swiss chocolate.",
        price: 1899,
        duration: 7,
        image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=2070&auto=format&fit=crop",
        images: [],
        destination: "Interlaken",
        country: "Switzerland",
        rating: 4.8,
        reviewsCount: 95,
        amenities: ["Guided Hiking", "Breakfast Included"],
        maxPeople: 4,
        featured: true
    },
    {
        title: "Kyoto Cultural Immersion",
        slug: "kyoto-cultural-immersion",
        description: "Immerse yourself in the rich history and culture of Kyoto. Visit ancient temples and participate in a traditional tea ceremony.",
        price: 1599,
        duration: 6,
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop",
        images: [],
        destination: "Kyoto",
        country: "Japan",
        rating: 4.7,
        reviewsCount: 210,
        amenities: ["Tea Ceremony", "Temple Pass"],
        maxPeople: 2,
        featured: false
    }
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if packages exist
        const count = await Package.countDocuments();
        if (count === 0) {
            await Package.insertMany(samplePackages);
            console.log('Seeded sample packages');
        } else {
            console.log('Packages already exist, skipping seed.');
        }

        console.log('Database check complete.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();
