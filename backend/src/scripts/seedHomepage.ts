import mongoose from 'mongoose';
import { connectDB } from '../config/database';

// Import the HomepageContent model (we need to create it in TypeScript)
const HomepageContent = require('../../models/HomepageContent');

const homepageData = {
  hero: {
    title: "Your Next Best Trip,",
    subtitle: "Return Inspired",
    backgroundImage: "/image.png"
  },
  whyVisit: {
    title: "Why Visit Kazakhstan",
    features: [
      {
        title: "Silk Road History",
        description: "Explore ancient trade routes and historical significance that shaped Central Asia for centuries. Walk through the same paths where merchants, scholars, and travelers once journeyed between East and West.",
        image: "/desert.jpg",
        bgColor: "from-blue-400 to-blue-600",
        order: 1
      },
      {
        title: "Nomadic Soul",
        description: "Experience traditional nomadic culture and lifestyle that has been preserved for generations. Stay in authentic yurts, learn traditional crafts, and discover the wisdom of the steppe people.",
        image: "/shanyrak.jpg",
        bgColor: "from-amber-600 to-amber-800",
        order: 2
      },
      {
        title: "Modern Meets Traditional",
        description: "Witness the blend of contemporary and ancient cultures in Kazakhstan's dynamic cities. From futuristic Nur-Sultan to historic Almaty, see how tradition and innovation coexist beautifully.",
        image: "/baiterek.jpg",
        bgColor: "from-orange-400 to-orange-600",
        order: 3
      },
      {
        title: "No Crowds, Just Space",
        description: "Enjoy vast landscapes and peaceful environments away from mass tourism. Kazakhstan offers authentic experiences in pristine wilderness where you can truly connect with nature and yourself.",
        image: "/kanatnaya_doroga.jpg",
        bgColor: "from-red-400 to-red-600",
        order: 4
      },
      {
        title: "Unspoiled Nature",
        description: "Discover pristine natural beauty and wildlife in one of the world's largest countries. From snow-capped peaks to endless steppes, Kazakhstan's landscapes remain largely untouched and spectacular.",
        image: "/yurta.jpg",
        bgColor: "from-green-400 to-green-600",
        order: 5
      }
    ]
  },
  tourThemes: {
    title: "Top Tour Themes",
    description: "Kazakhstan is vast and diverse — and so are the ways to experience it. Whether you're chasing landscapes, culture, adventure, or spiritual meaning, there's a route for every traveler.",
    tours: [
      {
        title: "Charyn Canyon & Kolsai Lakes Tour",
        description: "A classic multi-day trip from Almaty into the Tian Shan mountains — explore canyons, alpine lakes, and mountain villages.",
        image: "/bao_contras.jpg",
        date: "20 may 2025",
        location: "Almaty",
        rating: 5,
        order: 1
      },
      {
        title: "Mangystau Desert Expedition",
        description: "Visit Bozzhyra, Sherkala, and Torysh with local guides. Sleep in a yurt under the stars, explore sacred places.",
        image: "/mangystau.jpg",
        date: "20 may 2025",
        location: "",
        rating: 5,
        order: 2
      },
      {
        title: "Turkestan - Taraz - Otrar Route",
        description: "A historical journey across mausoleums, caravanserais, and ruins — with stories of poets, traders, and pilgrims.",
        image: "/kozha_akhmet_yassaui.jpg",
        date: "20 may 2025",
        location: "",
        rating: 5,
        order: 3
      },
      {
        title: "Almaty Creative Tour",
        description: "Street art, fashion studios, coffee culture, and live music — explore Almaty's youthful soul.",
        image: "/almaty.jpg",
        date: "20 may 2025",
        location: "",
        rating: 5,
        order: 4
      }
    ]
  },
  instagram: {
    handle: "@into.kazakhstan",
    title: "@into.kazakhstan",
    description: "Kazakhstan is vast and diverse — and so are the ways to experience it. Whether you're chasing landscapes, culture, adventure, or spiritual meaning, there's a route for every traveler.",
    posts: [
      { image: "/nomad_girls.png", alt: "Nomad girls", order: 1 },
      { image: "/desert.jpg", alt: "Desert landscape", order: 2 },
      { image: "/yurta.jpg", alt: "Traditional yurt", order: 3 }
    ]
  },
  events: {
    title: "Explore Events",
    description: "Kazakhstan is vast and diverse — and so are the ways to experience it. Whether you're chasing landscapes, culture, adventure, or spiritual meaning, there's a route for every traveler.",
    eventList: [
      { name: "Kolsay & Kayindy", image: "/bao_contras.jpg", date: "20 may 2025", category: "Nature", order: 1 },
      { name: "Charyn Canyon", image: "/charyn.jpg", date: "20 may 2025", category: "Nature", order: 2 },
      { name: "Shymbulak", image: "/kanatnaya_doroga.jpg", date: "20 may 2025", category: "Nature", order: 3 }
    ]
  },
  isActive: true,
  version: 1
};

async function seedHomepage() {
  try {
    console.log('🌱 Starting homepage content seeding...');
    
    // Connect to database
    await connectDB();
    
    // Delete existing homepage content
    console.log('🗑️ Clearing existing homepage content...');
    await HomepageContent.deleteMany({});
    
    // Create new homepage content
    console.log('📝 Creating new homepage content...');
    const homepage = new HomepageContent(homepageData);
    await homepage.save();
    
    console.log('✅ Homepage content seeded successfully!');
    console.log('📊 Content includes:');
    console.log(`   - ${homepageData.whyVisit.features.length} Why Visit features`);
    console.log(`   - ${homepageData.tourThemes.tours.length} tour themes`);
    console.log(`   - ${homepageData.instagram.posts.length} Instagram posts`);
    console.log(`   - ${homepageData.events.eventList.length} events`);
    console.log('');
    console.log('🎉 You can now:');
    console.log('   1. Login to admin panel: http://localhost:3000/admin/login');
    console.log('   2. Edit homepage: http://localhost:3000/admin/homepage');
    console.log('   3. View changes on: http://localhost:3000');
    console.log('');
    console.log('🔑 Admin credentials:');
    console.log('   Email: admin@visitkazakhstan.com');
    console.log('   Password: Admin123!');
    
  } catch (error) {
    console.error('❌ Error seeding homepage content:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the seed function
if (require.main === module) {
  seedHomepage();
}

export default seedHomepage;