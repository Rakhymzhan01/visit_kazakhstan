import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { BlogPost } from '../models/BlogPost';
import { User } from '../models/User';
import { connectDB } from '../config/database';

const sampleBlogPosts = [
  {
    title: "Welcome to Kazakhstan: Your Ultimate Travel Guide",
    slug: "welcome-to-kazakhstan",
    excerpt: "Discover the hidden gems of Kazakhstan, from the bustling cities to breathtaking natural landscapes.",
    content: `
      <h2>Welcome to Kazakhstan: Your Ultimate Travel Guide</h2>
      
      <p>Kazakhstan, the world's ninth-largest country, is a land of incredible diversity and untouched beauty. From the modern skyline of Almaty to the ancient Silk Road cities, this Central Asian gem offers experiences that will leave you speechless.</p>
      
      <h3>Top Destinations to Explore</h3>
      
      <h4>Almaty - The Cultural Capital</h4>
      <p>Almaty, Kazakhstan's largest city and former capital, is the perfect starting point for your journey. Nestled at the foot of the Trans-Ili Alatau mountains, the city offers:</p>
      <ul>
        <li>Stunning mountain views from Kok-Tobe Hill</li>
        <li>Traditional markets at Green Bazaar</li>
        <li>Modern shopping and dining experiences</li>
        <li>Easy access to nearby natural attractions</li>
      </ul>
      
      <h4>Astana (Nur-Sultan) - The Futuristic Capital</h4>
      <p>The capital city showcases Kazakhstan's modern ambitions with its impressive architecture and urban planning:</p>
      <ul>
        <li>Bayterek Tower - the symbol of modern Kazakhstan</li>
        <li>Khan Shatyr Entertainment Center</li>
        <li>Astana Opera House</li>
        <li>Palace of Peace and Reconciliation</li>
      </ul>
      
      <h4>Natural Wonders</h4>
      <p>Kazakhstan's natural beauty is unparalleled:</p>
      <ul>
        <li><strong>Charyn Canyon</strong> - Often called Kazakhstan's Grand Canyon</li>
        <li><strong>Kolsai Lakes</strong> - Crystal clear mountain lakes perfect for hiking</li>
        <li><strong>Big Almaty Lake</strong> - A stunning turquoise alpine lake</li>
        <li><strong>Mangystau Region</strong> - Otherworldly landscapes and ancient underground mosques</li>
      </ul>
      
      <h3>Best Time to Visit</h3>
      <p>Kazakhstan experiences a continental climate with distinct seasons:</p>
      <ul>
        <li><strong>Spring (April-June):</strong> Perfect for seeing wildflowers and comfortable temperatures</li>
        <li><strong>Summer (July-August):</strong> Ideal for mountain hiking and lake visits</li>
        <li><strong>Autumn (September-October):</strong> Beautiful fall colors and pleasant weather</li>
        <li><strong>Winter (November-March):</strong> Great for winter sports and experiencing traditional culture</li>
      </ul>
      
      <h3>Cultural Experiences</h3>
      <p>Immerse yourself in Kazakhstan's rich nomadic heritage:</p>
      <ul>
        <li>Stay in traditional yurts</li>
        <li>Experience eagle hunting with Kazakh berkutchi</li>
        <li>Taste authentic Kazakh cuisine like beshbarmak</li>
        <li>Visit historical sites along the ancient Silk Road</li>
      </ul>
      
      <p>Kazakhstan is more than just a destination; it's an adventure waiting to be discovered. Start planning your journey today!</p>
    `,
    status: 'PUBLISHED',
    featured: true,
    featuredImage: '/blog/b8f13e4348813d42dc0bd00e6dab16133c019ad1.jpg',
    category: 'Travel Guide',
    tags: ['kazakhstan', 'travel', 'guide', 'almaty', 'astana', 'nature'],
    seoTitle: 'Kazakhstan Travel Guide - Complete Guide to Visiting Kazakhstan',
    seoDescription: 'Comprehensive travel guide to Kazakhstan featuring top destinations, best time to visit, cultural experiences, and travel tips for your perfect Kazakhstan adventure.',
    readTime: 8,
    publishedAt: new Date(),
  },
  {
    title: "Mangystau: Kazakhstan's Mystical Desert Region",
    slug: "mangystau-mystical-desert",
    excerpt: "Explore the otherworldly landscapes of Mangystau, where ancient history meets stunning natural formations.",
    content: `
      <h2>Mangystau: Kazakhstan's Mystical Desert Region</h2>
      
      <p>The Mangystau Region in western Kazakhstan is a land that seems to belong to another planet. With its dramatic cliffs, underground mosques, and surreal rock formations, Mangystau offers some of the most unique landscapes you'll find anywhere in the world.</p>
      
      <h3>Bozzhyra - The Grand Canyon of Kazakhstan</h3>
      <p>Bozzhyra is undoubtedly one of Kazakhstan's most spectacular natural wonders. This massive canyon system features:</p>
      <ul>
        <li>Towering chalk cliffs rising hundreds of meters</li>
        <li>Colorful rock layers telling millions of years of geological history</li>
        <li>Unique rock formations resembling castles and fortresses</li>
        <li>Incredible sunrise and sunset viewpoints</li>
      </ul>
      
      <h3>Underground Mosques and Ancient History</h3>
      <p>Mangystau is home to numerous underground mosques carved directly into the rock:</p>
      <ul>
        <li><strong>Shakpak Ata:</strong> A 10th-century underground mosque</li>
        <li><strong>Shopan Ata:</strong> Sacred site with ancient Sufi connections</li>
        <li><strong>Beket Ata:</strong> Important pilgrimage destination</li>
      </ul>
      
      <h3>Planning Your Mangystau Adventure</h3>
      <p>Due to its remote location, visiting Mangystau requires careful planning:</p>
      <ul>
        <li>Base yourself in Aktau city</li>
        <li>Rent a 4WD vehicle or join a guided tour</li>
        <li>Bring plenty of water and supplies</li>
        <li>Best visited in spring or autumn</li>
        <li>Consider camping for the full experience</li>
      </ul>
      
      <p>Mangystau is not just a destination; it's a journey into Kazakhstan's spiritual and geological heart.</p>
    `,
    status: 'PUBLISHED',
    featured: false,
    featuredImage: '/mangystau.jpg',
    category: 'Nature',
    tags: ['mangystau', 'desert', 'nature', 'adventure', 'underground mosques'],
    seoTitle: 'Mangystau Desert Region - Kazakhstan\'s Hidden Natural Wonder',
    seoDescription: 'Discover Mangystau\'s otherworldly landscapes, underground mosques, and dramatic canyons in western Kazakhstan.',
    readTime: 6,
    publishedAt: new Date(),
  },
  {
    title: "Kolsai Lakes: Kazakhstan's Alpine Paradise",
    slug: "kolsai-lakes-alpine-paradise",
    excerpt: "Discover the breathtaking beauty of Kolsai Lakes, three pristine alpine lakes nestled in the Tian Shan mountains.",
    content: `
      <h2>Kolsai Lakes: Kazakhstan's Alpine Paradise</h2>
      
      <p>The Kolsai Lakes, often referred to as the "Pearls of the Tian Shan," are a system of three alpine lakes located in the Almaty Region. These crystal-clear lakes offer some of the most spectacular mountain scenery in Central Asia.</p>
      
      <h3>The Three Lakes</h3>
      
      <h4>First Kolsai Lake (Lower Lake)</h4>
      <p>The most accessible of the three lakes:</p>
      <ul>
        <li>Elevation: 1,818 meters above sea level</li>
        <li>Easily reachable by car</li>
        <li>Perfect for photography and short walks</li>
        <li>Boat rentals available</li>
      </ul>
      
      <h4>Second Kolsai Lake (Middle Lake)</h4>
      <p>The most popular among hikers:</p>
      <ul>
        <li>Elevation: 2,252 meters above sea level</li>
        <li>2-3 hour hike from the first lake</li>
        <li>Stunning mountain reflections</li>
        <li>Great camping opportunities</li>
      </ul>
      
      <h4>Third Kolsai Lake (Upper Lake)</h4>
      <p>For experienced hikers only:</p>
      <ul>
        <li>Elevation: 2,850 meters above sea level</li>
        <li>Full day hike from the second lake</li>
        <li>Pristine wilderness setting</li>
        <li>Close to the Kyrgyzstan border</li>
      </ul>
      
      <h3>Activities and Experiences</h3>
      <ul>
        <li><strong>Hiking:</strong> Multiple trail options for all skill levels</li>
        <li><strong>Photography:</strong> Incredible reflections and mountain vistas</li>
        <li><strong>Camping:</strong> Designated camping areas near the lakes</li>
        <li><strong>Fishing:</strong> Rainbow trout (with proper permits)</li>
        <li><strong>Horseback Riding:</strong> Traditional Kazakh way to explore</li>
      </ul>
      
      <h3>Best Time to Visit</h3>
      <p>The Kolsai Lakes are best visited between May and October:</p>
      <ul>
        <li><strong>May-June:</strong> Snowmelt creates powerful waterfalls</li>
        <li><strong>July-August:</strong> Warmest weather, perfect for camping</li>
        <li><strong>September-October:</strong> Beautiful autumn colors</li>
      </ul>
      
      <p>Whether you're seeking adventure or tranquility, the Kolsai Lakes offer an unforgettable alpine experience in the heart of Kazakhstan.</p>
    `,
    status: 'PUBLISHED',
    featured: false,
    featuredImage: '/bao_contras.jpg',
    category: 'Nature',
    tags: ['kolsai lakes', 'mountains', 'hiking', 'alpine', 'tian shan'],
    seoTitle: 'Kolsai Lakes Kazakhstan - Complete Guide to Alpine Paradise',
    seoDescription: 'Explore Kolsai Lakes, Kazakhstan\'s stunning alpine lake system in the Tian Shan mountains. Hiking guide, best time to visit, and travel tips.',
    readTime: 7,
    publishedAt: new Date(),
  },
  {
    title: "Almaty: Where Modern Life Meets Mountain Beauty",
    slug: "almaty-modern-life-mountains",
    excerpt: "Explore Kazakhstan's cultural capital, where Soviet architecture, modern developments, and stunning mountain vistas create a unique urban experience.",
    content: `
      <h2>Almaty: Where Modern Life Meets Mountain Beauty</h2>
      
      <p>Almaty, Kazakhstan's largest city and former capital, perfectly embodies the country's blend of tradition and modernity. Set against the dramatic backdrop of the Trans-Ili Alatau mountains, this vibrant metropolis offers visitors a unique combination of urban sophistication and natural beauty.</p>
      
      <h3>Must-Visit Attractions</h3>
      
      <h4>Kok-Tobe Hill</h4>
      <p>The city's most iconic viewpoint:</p>
      <ul>
        <li>Panoramic views of Almaty and the mountains</li>
        <li>Cable car ride for scenic journey</li>
        <li>Apple monument commemorating Almaty's apple heritage</li>
        <li>Restaurants and entertainment facilities</li>
      </ul>
      
      <h4>Green Bazaar (Zeleny Bazaar)</h4>
      <p>Experience authentic Kazakh culture:</p>
      <ul>
        <li>Traditional spices and local products</li>
        <li>Fresh fruits including famous Almaty apples</li>
        <li>Kazakh delicacies and street food</li>
        <li>Handcrafted souvenirs and textiles</li>
      </ul>
      
      <h4>Medeu Ice Skating Rink</h4>
      <p>World's highest ice skating rink:</p>
      <ul>
        <li>Elevation: 1,691 meters above sea level</li>
        <li>Olympic training facility</li>
        <li>Beautiful mountain setting</li>
        <li>Gateway to Shymbulak Ski Resort</li>
      </ul>
      
      <h3>Cultural Experiences</h3>
      
      <h4>Architecture and History</h4>
      <ul>
        <li><strong>Ascension Cathedral:</strong> Beautiful Russian Orthodox wooden cathedral</li>
        <li><strong>Republic Square:</strong> Central gathering place with fountains</li>
        <li><strong>Panfilov Park:</strong> Memorial park with war monuments</li>
        <li><strong>Soviet-era buildings:</strong> Unique architectural heritage</li>
      </ul>
      
      <h4>Modern Almaty</h4>
      <ul>
        <li><strong>Esentai Mall:</strong> Luxury shopping and dining</li>
        <li><strong>MEGA Alma-Ata:</strong> International brands and entertainment</li>
        <li><strong>Dostyk Plaza:</strong> Business and commercial center</li>
        <li><strong>Kok-Tobe Park:</strong> Family entertainment complex</li>
      </ul>
      
      <h3>Day Trips from Almaty</h3>
      <p>Almaty serves as the perfect base for exploring nearby natural wonders:</p>
      <ul>
        <li><strong>Big Almaty Lake:</strong> 1-hour drive to stunning alpine lake</li>
        <li><strong>Charyn Canyon:</strong> 3-hour drive to Kazakhstan's Grand Canyon</li>
        <li><strong>Kolsai Lakes:</strong> 4-hour drive to alpine lake system</li>
        <li><strong>Turgen Gorge:</strong> Waterfalls and hot springs</li>
      </ul>
      
      <h3>Food and Dining</h3>
      <p>Almaty's culinary scene reflects its cosmopolitan nature:</p>
      <ul>
        <li><strong>Traditional Kazakh:</strong> Beshbarmak, manty, and kumys</li>
        <li><strong>International cuisine:</strong> Russian, Korean, European options</li>
        <li><strong>Modern restaurants:</strong> Fusion and contemporary dining</li>
        <li><strong>Street food:</strong> Samsa, lagman, and fresh fruit</li>
      </ul>
      
      <p>Almaty offers the perfect introduction to Kazakhstan, combining urban amenities with easy access to some of the country's most beautiful natural attractions.</p>
    `,
    status: 'PUBLISHED',
    featured: false,
    featuredImage: '/almaty.jpg',
    category: 'Cities',
    tags: ['almaty', 'city', 'culture', 'mountains', 'urban'],
    seoTitle: 'Almaty Kazakhstan Travel Guide - Complete City Guide',
    seoDescription: 'Discover Almaty, Kazakhstan\'s cultural capital. Complete guide to attractions, culture, food, and day trips from the city.',
    readTime: 9,
    publishedAt: new Date(),
  }
];

async function seedBlogs() {
  try {
    console.log('🌱 Starting blog seeding process...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Connected to database');
    
    // Clear existing blog posts
    await BlogPost.deleteMany({});
    console.log('🗑️  Cleared existing blog posts');
    
    // Find or create a default author (admin user)
    let author = await User.findOne({ role: 'ADMIN' });
    
    if (!author) {
      console.log('👤 No admin user found, creating default author...');
      const hashedPassword = await bcrypt.hash('Admin123!', 12);
      author = await User.create({
        name: 'Kazakhstan Travel Admin',
        email: 'blog@visitkazakhstan.com',
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true
      });
      console.log('✅ Created default author');
    }
    
    // Create blog posts with the author
    const blogPostsWithAuthor = sampleBlogPosts.map(post => ({
      ...post,
      authorId: author._id,
      images: [], // Add required images field
      views: Math.floor(Math.random() * 1000) + 100, // Random view count
      publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
    }));
    
    const createdPosts = await BlogPost.insertMany(blogPostsWithAuthor);
    console.log(`✅ Successfully created ${createdPosts.length} blog posts`);
    
    // Display created posts
    createdPosts.forEach((post: any, index: number) => {
      console.log(`${index + 1}. ${post.title} (${post.status})`);
    });
    
    console.log('🎉 Blog seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding blogs:', error);
    throw error;
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seeding function
if (require.main === module) {
  seedBlogs()
    .then(() => {
      console.log('✅ Seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export default seedBlogs;