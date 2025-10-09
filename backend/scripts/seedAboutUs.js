const mongoose = require('mongoose');
const { AboutUs } = require('../dist/models');
require('dotenv').config();

const aboutUsData = {
  aboutDescription: "Kazakhstan is vast and diverse — and so are the ways to experience it. Whether you're chasing breathtaking landscapes, rich cultural heritage, thrilling adventures, or profound spiritual meaning, there's a perfect route for every type of traveler. Our country spans 2.7 million square kilometers, making it the world's largest landlocked country, with landscapes ranging from the snow-capped peaks of the Tian Shan mountains to the mystical deserts of Mangystau. We are passionate about sharing the hidden gems and authentic experiences that make Kazakhstan truly special.",

  stats: [
    {
      value: "2010",
      description: "Year our tourism initiative was founded to showcase Kazakhstan's incredible beauty to the world",
      order: 1
    },
    {
      value: "50+",
      description: "Unique destinations and attractions across all regions of Kazakhstan that we feature",
      order: 2
    },
    {
      value: "1000+",
      description: "Happy travelers who have discovered Kazakhstan's wonders through our recommendations",
      order: 3
    },
    {
      value: "20",
      description: "Expert local guides and cultural ambassadors working with us nationwide",
      order: 4
    }
  ],

  teamMembers: [
    {
      name: "Aigerim Nazarbayeva",
      position: "Cultural Heritage Coordinator",
      image: "/team/4838ebf99f5d3b04e54d4bda4b727af5ea1e799c.png",
      order: 1
    },
    {
      name: "Daniyar Sultanov",
      position: "Adventure Tourism Director",
      image: "/team/0d57fbe1ccda59febd767fcdce533d97448fc201.png",
      order: 2
    },
    {
      name: "Madina Orazova",
      position: "Guest Experience Manager",
      image: "/team/772ad5a28014d2afa8904da5a2b103415f00c620.png",
      order: 3
    },
    {
      name: "Arman Tokayev",
      position: "Regional Development Specialist",
      image: "/team/87c4fa29ccd407339492099a0753c544ac923c3d.png",
      order: 4
    },
    {
      name: "Zhanel Kassymova",
      position: "Digital Marketing Strategist",
      image: "/team/ac3097d85855fb2e2d9ee42dceff5f098abc3b17.png",
      order: 5
    }
  ],

  teamDescription: "Kazakhstan is vast and diverse — and so are the ways to experience it. Whether you're chasing landscapes, culture, adventure, or spiritual meaning, there's a route for every traveler. Our passionate team of local experts brings decades of combined experience in tourism, cultural preservation, and sustainable travel. We are dedicated to connecting visitors with authentic Kazakh experiences while supporting local communities and preserving our natural heritage for future generations.",

  contact: {
    address: {
      street: "Nazarbayev Avenue 123, Business Center Almaty Tower",
      city: "Almaty 050010",
      country: "Kazakhstan"
    },
    phone: "+77272505060",
    email: "info@visitkazakhstan.com",
    mapImage: "/map.png"
  },

  status: "PUBLISHED",
  version: 1,
  authorId: "68c961562756fecf06837266" // Default admin user ID
};

async function seedAboutUs() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/visit-kazakhstan');
    console.log('Connected to MongoDB');

    // Clear existing About Us content
    await AboutUs.deleteMany({});
    console.log('Cleared existing About Us content');

    // Insert About Us data
    const createdContent = await AboutUs.create(aboutUsData);
    console.log('Successfully created About Us content:');
    
    console.log(`📖 About Description: ${createdContent.aboutDescription.substring(0, 100)}...`);
    console.log(`📊 Stats: ${createdContent.stats.length} statistics`);
    createdContent.stats.forEach(stat => {
      console.log(`  - ${stat.value}: ${stat.description.substring(0, 60)}...`);
    });
    
    console.log(`👥 Team Members: ${createdContent.teamMembers.length} members`);
    createdContent.teamMembers.forEach(member => {
      console.log(`  - ${member.name}: ${member.position}`);
    });
    
    console.log(`📝 Team Description: ${createdContent.teamDescription.substring(0, 100)}...`);
    
    console.log(`📍 Contact Info:`);
    console.log(`  Address: ${createdContent.contact.address.street}, ${createdContent.contact.address.city}`);
    console.log(`  Phone: ${createdContent.contact.phone}`);
    console.log(`  Email: ${createdContent.contact.email}`);
    
    console.log(`📋 Status: ${createdContent.status}`);
    console.log(`🔢 Version: ${createdContent.version}`);

    console.log('\n✅ About Us content seeding completed successfully!');
    console.log('📁 About Us content is now stored in the "aboutus" collection');
    console.log('🎯 All dynamic content is ready for the About Us page');
    
  } catch (error) {
    console.error('Error seeding About Us content:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeding script
seedAboutUs();