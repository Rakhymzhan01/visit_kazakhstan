const mongoose = require('mongoose');
const { Event } = require('../dist/models');
require('dotenv').config();

const sampleEvents = [
  {
    title: "Almaty International Music Festival 2025",
    slug: "almaty-international-music-festival-2025",
    description: "Join us for Kazakhstan's premier music festival featuring international and local artists in the heart of Almaty. Experience traditional Kazakh music alongside contemporary performances in stunning outdoor venues. This three-day celebration of music brings together artists from across Central Asia and beyond.",
    excerpt: "Join us for Kazakhstan's premier music festival featuring international and local artists in the heart of Almaty.",
    image: "/expo.jpg",
    category: "Music",
    date: new Date("2025-06-15"),
    time: "18:00",
    location: "Almaty, Kazakhstan",
    featured: true,
    status: "PUBLISHED",
    price: "5000 KZT - 15000 KZT",
    duration: "3 days",
    organizer: "Almaty Cultural Foundation",
    website: "https://almaty-music-fest.kz",
    tags: ["music", "festival", "almaty", "culture", "international"],
    authorId: "68c961562756fecf06837266"
  },
  {
    title: "Astana Cultural Heritage Exhibition",
    slug: "astana-cultural-heritage-exhibition",
    description: "Explore Kazakhstan's rich cultural heritage through traditional art, crafts, and performances. Discover the stories of nomadic traditions and modern Kazakh culture in this comprehensive exhibition featuring artifacts, interactive displays, and live demonstrations.",
    excerpt: "Explore Kazakhstan's rich cultural heritage through traditional art, crafts, and performances.",
    image: "/baiterek.jpg",
    category: "Culture",
    date: new Date("2025-07-20"),
    time: "10:00",
    location: "Astana, Kazakhstan",
    featured: false,
    status: "PUBLISHED",
    price: "Free",
    duration: "1 week",
    organizer: "Ministry of Culture and Sports",
    website: "https://culture.gov.kz",
    tags: ["culture", "heritage", "astana", "exhibition", "traditional"],
    authorId: "68c961562756fecf06837266"
  },
  {
    title: "Mangystau Desert Adventure Rally",
    slug: "mangystau-desert-adventure-rally",
    description: "Experience the mystical landscapes of Mangystau region with an exciting desert rally. Navigate through ancient underground mosques and dramatic canyons in this two-day adventure through one of Kazakhstan's most unique regions.",
    excerpt: "Experience the mystical landscapes of Mangystau region with an exciting desert rally.",
    image: "/mangystau.jpg",
    category: "Sports",
    date: new Date("2025-08-10"),
    time: "08:00",
    location: "Mangystau Region, Kazakhstan",
    featured: false,
    status: "PUBLISHED",
    price: "25000 KZT",
    duration: "2 days",
    organizer: "Kazakhstan Adventure Sports",
    website: "https://adventure.kz",
    tags: ["sports", "desert", "rally", "mangystau", "adventure"],
    authorId: "68c961562756fecf06837266"
  },
  {
    title: "Almaty Tech Innovation Conference 2025",
    slug: "almaty-tech-innovation-conference-2025",
    description: "Kazakhstan's leading technology conference bringing together innovators, entrepreneurs, and tech leaders to discuss the future of digital transformation in Central Asia. Features keynote speakers, workshops, and networking opportunities.",
    excerpt: "Kazakhstan's leading technology conference bringing together innovators and entrepreneurs.",
    image: "/almaty.jpg",
    category: "Conference",
    date: new Date("2025-09-05"),
    time: "09:00",
    location: "Almaty, Kazakhstan",
    featured: false,
    status: "PUBLISHED",
    price: "12000 KZT",
    duration: "2 days",
    organizer: "Tech Kazakhstan Association",
    website: "https://techconf.kz",
    tags: ["technology", "conference", "innovation", "business", "almaty"],
    authorId: "68c961562756fecf06837266"
  },
  {
    title: "Kolsai Lakes Nature Photography Workshop",
    slug: "kolsai-lakes-nature-photography-workshop",
    description: "Join professional photographers for an immersive workshop in the stunning Kolsai Lakes. Learn landscape photography techniques while exploring Kazakhstan's alpine paradise. This three-day workshop includes guided tours and hands-on instruction.",
    excerpt: "Join professional photographers for an immersive workshop in the stunning Kolsai Lakes.",
    image: "/bao_contras.jpg",
    category: "Workshop",
    date: new Date("2025-09-22"),
    time: "07:00",
    location: "Kolsai Lakes, Kazakhstan",
    featured: false,
    status: "PUBLISHED",
    price: "18000 KZT",
    duration: "3 days",
    organizer: "Kazakhstan Photography Society",
    website: "https://photo.kz",
    tags: ["photography", "nature", "kolsai", "workshop", "mountains"],
    authorId: "68c961562756fecf06837266"
  },
  {
    title: "Turkestan Historical Festival",
    slug: "turkestan-historical-festival",
    description: "Step back in time at the ancient city of Turkestan. Experience medieval traditions, crafts, and performances in the shadow of the magnificent Khoja Ahmed Yasawi Mausoleum. This festival celebrates the rich history of the Silk Road.",
    excerpt: "Step back in time at the ancient city of Turkestan with medieval traditions and performances.",
    image: "/kozha_akhmet_yassaui.jpg",
    category: "Festival",
    date: new Date("2025-10-15"),
    time: "11:00",
    location: "Turkestan, Kazakhstan",
    featured: true,
    status: "PUBLISHED",
    price: "3000 KZT",
    duration: "1 day",
    organizer: "Turkestan Regional Administration",
    website: "https://turkestan.gov.kz",
    tags: ["history", "festival", "turkestan", "medieval", "culture"],
    authorId: "68c961562756fecf06837266"
  },
  {
    title: "Charyn Canyon Hiking Expedition",
    slug: "charyn-canyon-hiking-expedition",
    description: "Explore the magnificent Charyn Canyon, often called Kazakhstan's Grand Canyon. Guided hiking tours through the Valley of Castles and surrounding red rock formations. Experience the natural wonder of this geological masterpiece.",
    excerpt: "Explore the magnificent Charyn Canyon, often called Kazakhstan's Grand Canyon.",
    image: "/charyn.jpg",
    category: "Adventure",
    date: new Date("2025-11-08"),
    time: "06:00",
    location: "Charyn Canyon, Kazakhstan",
    featured: false,
    status: "PUBLISHED",
    price: "8000 KZT",
    duration: "1 day",
    organizer: "Kazakhstan Eco Tourism",
    website: "https://ecotour.kz",
    tags: ["hiking", "canyon", "nature", "adventure", "charyn"],
    authorId: "68c961562756fecf06837266"
  },
  {
    title: "Winter Nomad Games",
    slug: "winter-nomad-games",
    description: "Traditional winter sports competition featuring kokpar, archery on horseback, and other nomadic games. Celebrate Kazakhstan's equestrian heritage in a spectacular winter setting with athletes from across Central Asia.",
    excerpt: "Traditional winter sports competition featuring kokpar, archery on horseback, and nomadic games.",
    image: "/famile.jpg",
    category: "Sports",
    date: new Date("2025-12-20"),
    time: "10:00",
    location: "Almaty Region, Kazakhstan",
    featured: false,
    status: "PUBLISHED",
    price: "Free",
    duration: "3 days",
    organizer: "Kazakhstan Equestrian Federation",
    website: "https://nomadgames.kz",
    tags: ["sports", "nomad", "winter", "traditional", "horses"],
    authorId: "68c961562756fecf06837266"
  }
];

async function seedEvents() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/visit-kazakhstan');
    console.log('Connected to MongoDB');

    // Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events');

    // Insert sample events
    const createdEvents = await Event.insertMany(sampleEvents);
    console.log(`Successfully created ${createdEvents.length} events:`);
    
    createdEvents.forEach(event => {
      console.log(`- ${event.title} (${event.category}) ${event.featured ? '[FEATURED]' : ''}`);
    });

    console.log('\n✅ Events seeding completed successfully!');
    console.log('📁 Events are now stored in the "events" collection');
    
  } catch (error) {
    console.error('Error seeding events:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeding script
seedEvents();