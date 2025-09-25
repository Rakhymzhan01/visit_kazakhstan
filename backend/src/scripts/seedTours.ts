import mongoose from 'mongoose';
import { Tour } from '../models/Tour';
import { Category } from '../models/Category';
import { User } from '../models/User';
import { connectDB } from '../config/database';

const sampleCategories = [
  {
    name: "Nature Escapes",
    slug: "nature-escapes",
    description: "Explore Kazakhstan's stunning natural landscapes and outdoor adventures",
    featured: true,
    status: "ACTIVE",
    displayOrder: 1
  },
  {
    name: "Silk Road Heritage Tours",
    slug: "silk-road-heritage-tours",
    description: "Journey through ancient Silk Road routes and historical sites",
    featured: true,
    status: "ACTIVE",
    displayOrder: 2
  },
  {
    name: "Nomadic Life & Ethno Tours",
    slug: "nomadic-life-ethno-tours",
    description: "Experience traditional nomadic culture and ethnic heritage",
    featured: true,
    status: "ACTIVE",
    displayOrder: 3
  },
  {
    name: "Modern Culture & City Life",
    slug: "modern-culture-city-life",
    description: "Discover Kazakhstan's vibrant modern cities and urban culture",
    featured: true,
    status: "ACTIVE",
    displayOrder: 4
  },
  {
    name: "Weekend Getaways",
    slug: "weekend-getaways",
    description: "Perfect short trips for weekend adventures",
    featured: true,
    status: "ACTIVE",
    displayOrder: 5
  }
];

const sampleTours = [
  {
    title: "Charyn Canyon & Kolsai Lakes Tour",
    slug: "charyn-canyon-kolsai-lakes-tour",
    description: "A classic multi-day trip from Almaty into the Tian Shan mountains — explore canyons, alpine lakes, and mountain villages.",
    image: "/charyn-canyon.jpg",
    category: "Nature Escapes",
    rating: 5,
    date: "20 may 2025",
    location: "Almaty",
    price: 450,
    duration: "3 days",
    featured: true,
    status: "PUBLISHED",
    tags: ["nature", "mountains", "lakes", "canyon", "hiking"]
  },
  {
    title: "Mangystau Desert Expedition",
    slug: "mangystau-desert-expedition",
    description: "Visit Bozzhyra, Sherkala, and Torysh with local guides. Sleep in a yurt under the stars, explore sacred places, and enjoy Mars-like scenery.",
    image: "/mangystau-desert.jpg",
    category: "Nature Escapes",
    rating: 4,
    date: "20 may 2025",
    location: "Mangystau",
    price: 650,
    duration: "4 days",
    featured: true,
    status: "PUBLISHED",
    tags: ["desert", "yurt", "adventure", "landscape", "remote"]
  },
  {
    title: "Turkestan - Taraz - Otrar Route",
    slug: "turkestan-taraz-otrar-route",
    description: "A historical journey across mausoleums, caravanserais, and ruins — with stories of poets, traders, and pilgrims.",
    image: "/turkestan-route.jpg",
    category: "Silk Road Heritage Tours",
    rating: 5,
    date: "20 may 2025",
    location: "Turkestan",
    price: 380,
    duration: "2 days",
    featured: true,
    status: "PUBLISHED",
    tags: ["history", "silk road", "culture", "architecture", "heritage"]
  },
  {
    title: "Nomadic Heritage Experience",
    slug: "nomadic-heritage-experience",
    description: "Live like a nomad for a week, learn traditional crafts, ride horses, and understand the ancient ways of the steppes.",
    image: "/nomadic-life.jpg",
    category: "Nomadic Life & Ethno Tours",
    rating: 5,
    date: "15 june 2025",
    location: "Steppes",
    price: 520,
    duration: "5 days",
    featured: true,
    status: "PUBLISHED",
    tags: ["nomadic", "traditional", "horses", "culture", "authentic"]
  },
  {
    title: "Almaty Modern City Tour",
    slug: "almaty-modern-city-tour",
    description: "Explore Kazakhstan's cultural capital with its modern skyline, traditional bazaars, and mountain backdrop.",
    image: "/almaty-city.jpg",
    category: "Modern Culture & City Life",
    rating: 4,
    date: "weekly",
    location: "Almaty",
    price: 120,
    duration: "1 day",
    featured: false,
    status: "PUBLISHED",
    tags: ["city", "modern", "culture", "urban", "mountains"]
  },
  {
    title: "Big Almaty Lake Weekend",
    slug: "big-almaty-lake-weekend",
    description: "Perfect weekend escape to the stunning turquoise alpine lake nestled high in the mountains above Almaty.",
    image: "/big-almaty-lake.jpg",
    category: "Weekend Getaways",
    rating: 5,
    date: "weekends",
    location: "Almaty",
    price: 180,
    duration: "2 days",
    featured: false,
    status: "PUBLISHED",
    tags: ["lake", "weekend", "hiking", "nature", "photography"]
  }
];

async function seedTours() {
  try {
    console.log('Connecting to database...');
    await connectDB();

    // Get admin user for authorId
    const adminUser = await User.findOne({ email: 'admin@visitkazakhstan.com' });
    if (!adminUser) {
      console.error('Admin user not found. Please run createAdmin.ts first');
      process.exit(1);
    }

    console.log('Clearing existing categories and tours...');
    await Category.deleteMany({});
    await Tour.deleteMany({});

    console.log('Creating categories...');
    const createdCategories = await Category.insertMany(sampleCategories.map(cat => ({
      ...cat,
      createdBy: adminUser._id,
      createdAt: new Date(),
      updatedAt: new Date()
    })));

    console.log(`Created ${createdCategories.length} categories`);

    console.log('Creating tours...');
    const toursWithAuthor = sampleTours.map(tour => ({
      ...tour,
      createdBy: adminUser._id,
      views: Math.floor(Math.random() * 1000) + 100,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: new Date()
    }));

    const createdTours = await Tour.insertMany(toursWithAuthor);
    console.log(`Created ${createdTours.length} tours`);

    console.log('Tours and categories seeded successfully!');
    console.log('\nCategories created:');
    createdCategories.forEach(cat => console.log(`- ${cat.name}`));
    
    console.log('\nTours created:');
    createdTours.forEach(tour => console.log(`- ${tour.title} (${tour.category})`));

  } catch (error) {
    console.error('Error seeding tours:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeder
if (require.main === module) {
  seedTours();
}

export default seedTours;