const mongoose = require('mongoose');

// Connect to MongoDB - use the same database as backend
mongoose.connect('mongodb://localhost:27017/visit_kazakhstan_db');

// Create schema
const HomepageContentSchema = new mongoose.Schema({}, { strict: false });
const HomepageContent = mongoose.model('HomepageContent', HomepageContentSchema);

// Create initial homepage content
const initialContent = {
  hero: {
    title: "Welcome to Kazakhstan",
    subtitle: "Discover the beauty and culture of Kazakhstan",
    backgroundImage: "/hero-bg.jpg"
  },
  whyVisit: {
    title: "Why Visit Kazakhstan?",
    features: [
      {
        title: "Rich Culture",
        description: "Experience the unique blend of nomadic traditions and modern life",
        image: "/culture.jpg",
        bgColor: "from-blue-400 to-blue-600",
        order: 1
      },
      {
        title: "Beautiful Nature",
        description: "From mountains to steppes, Kazakhstan offers stunning landscapes",
        image: "/nature.jpg", 
        bgColor: "from-green-400 to-green-600",
        order: 2
      }
    ]
  },
  tourThemes: {
    title: "Tour Themes",
    description: "Explore Kazakhstan through our curated tour themes",
    tours: [
      {
        title: "Cultural Heritage Tour",
        description: "Discover ancient Silk Road cities and traditional crafts",
        image: "/tour1.jpg",
        date: "2024-12-01",
        location: "Almaty",
        rating: 5,
        order: 1
      }
    ]
  },
  instagram: {
    handle: "@visit.kazakhstan",
    title: "Follow Us on Instagram",
    description: "See the latest from Kazakhstan through our lens",
    posts: [
      {
        image: "/insta1.jpg",
        alt: "Beautiful mountain landscape",
        order: 1
      }
    ]
  },
  events: {
    title: "Upcoming Events",
    description: "Don't miss these amazing events in Kazakhstan",
    eventList: [
      {
        name: "Nauryz Festival",
        image: "/event1.jpg", 
        date: "2024-03-21",
        category: "Cultural",
        order: 1
      }
    ]
  },
  isActive: true,
  version: 1,
  createdAt: new Date(),
  updatedAt: new Date()
};

async function createHomepage() {
  try {
    console.log('Creating initial homepage content...');
    
    // First, make sure no other content is active
    await HomepageContent.updateMany({}, { isActive: false });
    
    // Create new content
    const newContent = new HomepageContent(initialContent);
    const saved = await newContent.save();
    
    console.log('✅ Homepage content created successfully!');
    console.log('📝 Content ID:', saved._id);
    console.log('🎯 isActive:', saved.isActive);
    
    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error creating homepage content:', error);
    mongoose.disconnect();
  }
}

createHomepage();