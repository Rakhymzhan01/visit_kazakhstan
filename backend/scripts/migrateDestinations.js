const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Define User schema directly
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['ADMIN', 'USER'],
    default: 'USER'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Define Destination schema directly
const DestinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  gallery: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    required: true,
    enum: ['nature', 'culture', 'cities']
  },
  subcategory: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  highlights: [{
    type: String,
    trim: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE'
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  seoTitle: {
    type: String,
    trim: true
  },
  seoDescription: {
    type: String,
    trim: true
  },
  price: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  coordinates: {
    lat: {
      type: Number
    },
    lng: {
      type: Number
    }
  },
  activities: [{
    type: String,
    trim: true
  }],
  facilities: [{
    type: String,
    trim: true
  }],
  tips: [{
    type: String,
    trim: true
  }],
  bestTime: {
    type: String,
    trim: true
  },
  duration: {
    type: String,
    trim: true
  },
  difficulty: {
    type: String,
    trim: true
  },
  era: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    trim: true
  },
  region: {
    type: String,
    trim: true
  },
  population: {
    type: String,
    trim: true
  },
  founded: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create indexes
DestinationSchema.index({ name: 'text', description: 'text', content: 'text' });
DestinationSchema.index({ category: 1, subcategory: 1, status: 1, displayOrder: 1 });
DestinationSchema.index({ slug: 1 });
DestinationSchema.index({ featured: 1, status: 1 });

// Create models
const User = mongoose.model('User', UserSchema);
const Destination = mongoose.model('Destination', DestinationSchema);

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/visit-kazakhstan');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Nature destinations data (from your frontend)
const natureDestinations = [
  {
    name: 'Mangystau Region',
    slug: 'mangystau-region',
    subtitle: 'Otherworldly Landscapes of Western Kazakhstan',
    description: 'Discover the dramatic and surreal landscapes of Mangystau, where ancient seabeds have created a geological wonderland of canyons, plateaus, and unique rock formations.',
    content: `The Mangystau region of western Kazakhstan offers some of the most extraordinary and otherworldly landscapes on Earth. This ancient land, once covered by the Tethys Sea, has been sculpted over millions of years into a dramatic tableau of canyons, plateaus, and bizarre rock formations that seem more suited to an alien planet than our own world.

The region's most famous attraction is the Bozzhira tract, a vast depression filled with chalky white cliffs and colorful stratified rocks that create an almost lunar landscape. The Ustyurt Plateau, stretching endlessly to the horizon, offers visitors a sense of the infinite, while the underground mosque of Mangystau provides a unique spiritual experience in this remote corner of Kazakhstan.

Beyond its geological wonders, Mangystau is steeped in history and legend. Ancient petroglyphs tell stories of nomadic peoples who traversed these lands for millennia, while sacred sites like the Shakpak-Ata underground mosque demonstrate the deep spiritual connection between the Kazakh people and their harsh but beautiful homeland.`,
    image: '/nature/mangystau.jpg',
    gallery: ['/nature/mangystau-1.jpg', '/nature/mangystau-2.jpg', '/nature/mangystau-3.jpg'],
    category: 'nature',
    location: 'Western Kazakhstan',
    highlights: [
      'Bozzhira tract with otherworldly rock formations',
      'Ustyurt Plateau stretching to the horizon', 
      'Underground Shakpak-Ata mosque',
      'Ancient petroglyphs and archaeological sites',
      'Unique desert landscapes and canyons'
    ],
    activities: ['Photography', 'Hiking', 'Archaeological tours', 'Spiritual retreats'],
    facilities: ['Guided tours', 'Basic accommodation', 'Transportation'],
    tips: [
      'Best visited during spring or autumn to avoid extreme temperatures',
      'Bring plenty of water and sun protection',
      'Hire a local guide familiar with the terrain'
    ],
    bestTime: 'April-May, September-October',
    duration: '3-5 days',
    difficulty: 'Moderate to challenging',
    rating: 5,
    featured: true,
    status: 'ACTIVE',
    displayOrder: 1
  },
  {
    name: 'Charyn Canyon',
    slug: 'charyn-canyon',
    subtitle: 'Kazakhstan\'s Grand Canyon',
    description: 'Experience the breathtaking beauty of Charyn Canyon, often called the "Grand Canyon of Kazakhstan," with its dramatic red rock formations and the famous Valley of Castles.',
    content: `Charyn Canyon stands as one of Kazakhstan's most spectacular natural wonders, earning its nickname as the "Grand Canyon of Kazakhstan." Carved by the Charyn River over millions of years, this magnificent canyon stretches for over 150 kilometers through the desert landscape of southeastern Kazakhstan.

The canyon's most famous section is the Valley of Castles, where erosion has sculpted the red sandstone into fantastic formations that resemble medieval fortresses, towers, and battlements. These towering spires, some reaching heights of 300 meters, create a landscape so dramatic and otherworldly that it has served as the backdrop for numerous films and documentaries.

The canyon is not just a geological marvel but also an ecosystem sanctuary. Despite the harsh desert environment, the canyon supports a surprising diversity of plant and animal life, including rare species that have adapted to this unique habitat. The Charyn River continues to flow through the canyon floor, creating oases of greenery that contrast beautifully with the red rock walls.`,
    image: '/nature/charyn.jpg',
    gallery: ['/nature/charyn-1.jpg', '/nature/charyn-2.jpg'],
    category: 'nature',
    location: 'Almaty Region, 200km east of Almaty',
    highlights: [
      'Valley of Castles with dramatic rock formations',
      'Ancient rock layers spanning millions of years',
      'Charyn River oasis ecosystem',
      'Rare desert flora and fauna',
      'Stunning sunrise and sunset views'
    ],
    activities: ['Hiking', 'Photography', 'Rock climbing', 'Rafting', 'Camping'],
    facilities: ['Visitor center', 'Camping areas', 'Hiking trails', 'Transportation'],
    bestTime: 'April-June, September-October',
    duration: '1-2 days',
    difficulty: 'Easy to moderate',
    rating: 5,
    featured: false,
    status: 'ACTIVE',
    displayOrder: 2
  },
  {
    name: 'Kolsai Lakes',
    slug: 'kolsai-lakes',
    subtitle: 'The Pearls of the Northern Tian Shan',
    description: 'Discover the pristine beauty of Kolsai Lakes, three stunning alpine lakes nestled in the Tian Shan mountains, perfect for hiking, fishing, and experiencing untouched nature.',
    content: `The Kolsai Lakes, often referred to as the "Pearls of the Northern Tian Shan," represent one of Kazakhstan's most pristine and beautiful natural destinations. This system of three alpine lakes, situated at elevations between 1,800 and 2,850 meters above sea level, offers visitors an unforgettable journey through some of Central Asia's most spectacular mountain scenery.

Each of the three lakes has its own distinct character and beauty. The Lower Kolsai Lake, the largest and most accessible, is surrounded by dense spruce forests and serves as the starting point for most adventures. Its crystal-clear waters reflect the surrounding peaks, creating a mirror-like surface that seems to double the majesty of the landscape. The Middle Kolsai Lake requires a moderate hike through alpine meadows dotted with wildflowers, while the Upper Kolsai Lake, the most remote and pristine, rewards the determined hiker with unparalleled solitude and breathtaking views.

The region is not just about the lakes themselves but the entire ecosystem they support. Ancient spruce forests, home to bears, wolves, and numerous bird species, surround the lower elevations, while alpine meadows burst with colorful wildflowers during the short mountain summer. The area offers some of the best fishing in Kazakhstan, with trout thriving in the cold, oxygen-rich waters.`,
    image: '/nature/kolsai.jpg',
    gallery: ['/nature/kolsai-1.jpg', '/nature/kolsai-2.jpg'],
    category: 'nature',
    location: 'Almaty Region, 300km southeast of Almaty',
    highlights: [
      'Three pristine alpine lakes at different elevations',
      'Ancient spruce forests and alpine meadows',
      'Excellent trout fishing opportunities',
      'Wildlife including bears and mountain goats',
      'Spectacular mountain hiking trails'
    ],
    activities: ['Hiking', 'Fishing', 'Camping', 'Photography', 'Horseback riding'],
    facilities: ['Guesthouses', 'Camping sites', 'Fishing permits', 'Horse rentals'],
    bestTime: 'June-September',
    duration: '2-4 days',
    difficulty: 'Moderate',
    rating: 5,
    featured: true,
    status: 'ACTIVE',
    displayOrder: 3
  },
  {
    name: 'Lake Kaindy',
    slug: 'lake-kaindy',
    subtitle: 'The Sunken Forest Lake',
    description: 'Marvel at the ethereal beauty of Lake Kaindy, famous for its submerged forest of Tian Shan spruces that create a mystical underwater landscape.',
    content: `Lake Kaindy stands as one of nature's most extraordinary and haunting creations. This 400-meter-long lake, situated at 2,000 meters above sea level in the Tian Shan mountains, was formed in 1911 when a powerful earthquake triggered a massive limestone landslide that dammed the valley and flooded the forest below.

What makes Lake Kaindy truly magical is the ghostly forest of Tian Shan spruces that remains perfectly preserved beneath its crystal-clear waters. The trunks of these ancient trees, some reaching up to 30 meters in height, pierce the lake's surface like the masts of sunken ships, creating one of the most photographed and mystical landscapes in all of Kazakhstan.

The lake's otherworldly appearance is enhanced by its remarkable clarity and the way light filters through the water to illuminate the submerged forest below. The preserved trees, having been naturally mummified by the cold mountain water, create an underwater forest that divers and photographers from around the world come to experience. The contrast between the dead, silvered tree trunks and the vivid turquoise water creates a scene that seems more like a fantasy painting than a natural phenomenon.`,
    image: '/nature/kaindy.jpg',
    gallery: ['/nature/kaindy-1.jpg', '/nature/kaindy-2.jpg'],
    category: 'nature',
    location: 'Almaty Region, 280km southeast of Almaty',
    highlights: [
      'Submerged forest of preserved Tian Shan spruces',
      'Crystal-clear turquoise mountain water',
      'Spectacular photography opportunities',
      'Unique geological formation from 1911 earthquake',
      'Mystical underwater landscape'
    ],
    activities: ['Photography', 'Diving', 'Hiking', 'Nature observation'],
    facilities: ['Hiking trails', 'Photography tours', 'Basic accommodation nearby'],
    bestTime: 'June-September',
    duration: '1-2 days',
    difficulty: 'Moderate',
    rating: 5,
    featured: true,
    status: 'ACTIVE',
    displayOrder: 4
  },
  {
    name: 'Altyn-Emel National Park',
    slug: 'altyn-emel-national-park',
    subtitle: 'Singing Dunes and Ancient Petroglyphs',
    description: 'Explore the diverse landscapes of Altyn-Emel National Park, home to the famous Singing Dune, ancient petroglyphs, and unique desert wildlife.',
    content: `Altyn-Emel National Park represents one of Kazakhstan's most diverse and fascinating protected areas, encompassing over 4,600 square kilometers of varied landscapes that range from desert steppes to dramatic mountain ranges. The park's name, meaning "Golden Saddle" in Kazakh, perfectly captures the golden hues that dominate much of this remarkable region.

The park's most famous attraction is the Singing Dune (Aqqum), a massive sand formation that rises 150 meters high and stretches for nearly 3 kilometers. This natural phenomenon produces haunting musical tones when the wind moves across its surface or when visitors slide down its slopes, creating an almost supernatural experience that has inspired local legends for centuries.

Beyond the Singing Dune, Altyn-Emel serves as an open-air museum of ancient history. The park contains thousands of petroglyphs, some dating back over 5,000 years, that provide invaluable insights into the lives, beliefs, and artistic expressions of the region's ancient inhabitants. The most significant concentration of these rock drawings can be found at Tamgaly-Tas, where images of Buddhas and ancient scripts tell the story of the Silk Road's passage through this region.`,
    image: '/nature/altyn-emel.jpg',
    category: 'nature',
    location: 'Almaty Region, 250km northeast of Almaty',
    highlights: [
      'Famous Singing Dune (Aqqum) with musical sounds',
      'Ancient petroglyphs dating back 5,000 years',
      'Diverse wildlife including kulans and argali sheep',
      'Dramatic landscapes from desert to mountains',
      'Rich archaeological and historical sites'
    ],
    activities: ['Wildlife viewing', 'Archaeology tours', 'Photography', 'Desert exploration'],
    facilities: ['Visitor center', 'Guided tours', 'Accommodation', 'Research station'],
    bestTime: 'April-June, September-October',
    duration: '2-3 days',
    difficulty: 'Easy to moderate',
    rating: 4,
    featured: false,
    status: 'ACTIVE',
    displayOrder: 5
  }
];

// Culture destinations data
const cultureDestinations = [
  {
    name: 'Mausoleum of Khoja Ahmed Yasawi',
    slug: 'mausoleum-khoja-ahmed-yasawi',
    subtitle: 'UNESCO World Heritage Masterpiece',
    description: 'Visit the magnificent Mausoleum of Khoja Ahmed Yasawi in Turkestan, a UNESCO World Heritage site and one of the finest examples of Timurid architecture.',
    content: `The Mausoleum of Khoja Ahmed Yasawi stands as one of Central Asia's most magnificent architectural achievements and serves as Kazakhstan's most important pilgrimage site. Built between 1389 and 1405 by order of Timur (Tamerlane), this UNESCO World Heritage site represents the pinnacle of medieval Islamic architecture and continues to draw visitors and pilgrims from across the Muslim world.

The mausoleum was constructed to honor Khoja Ahmed Yasawi, a 12th-century Sufi mystic and poet whose teachings profoundly influenced the spiritual and cultural development of the Turkic peoples. Yasawi's poetry, written in the Chagatai Turkic language, made Islamic mysticism accessible to ordinary people and helped establish a distinctly Central Asian form of Sufism that continues to this day.

The architectural grandeur of the mausoleum is breathtaking. The main dome, standing 44 meters high, dominates the skyline of Turkestan and can be seen from miles away. The building's azure-blue domes, intricate geometric patterns, and masterful tilework represent the finest traditions of Islamic art and architecture. Inside, the massive bronze cauldron, cast in 1399, is considered one of the largest of its kind in the medieval Islamic world.`,
    image: '/culture/yasawi-mausoleum.jpg',
    category: 'culture',
    subcategory: 'then',
    location: 'Turkestan, South Kazakhstan',
    highlights: [
      'UNESCO World Heritage status',
      'Magnificent Timurid architecture',
      'Largest medieval bronze cauldron',
      'Important Islamic pilgrimage site',
      '12th-century Sufi mystical traditions'
    ],
    activities: ['Cultural tours', 'Pilgrimage', 'Architecture appreciation', 'Historical research'],
    facilities: ['Visitor center', 'Museum', 'Prayer facilities', 'Guided tours'],
    era: '14th-15th centuries',
    type: 'Religious architecture',
    bestTime: 'Year-round',
    duration: 'Half day',
    difficulty: 'Easy',
    rating: 5,
    featured: true,
    status: 'ACTIVE',
    displayOrder: 1
  },
  {
    name: 'Almaty Central Mosque',
    slug: 'almaty-central-mosque',
    subtitle: 'Modern Islamic Architecture',
    description: 'Experience the grandeur of Almaty Central Mosque, one of the largest mosques in Central Asia, showcasing contemporary Islamic architecture.',
    content: `The Almaty Central Mosque represents a magnificent example of contemporary Islamic architecture and stands as one of the largest and most impressive religious buildings in Central Asia. Opened in 1999, this grand mosque can accommodate up to 7,000 worshippers and serves as both a spiritual center for Almaty's Muslim community and an architectural landmark that attracts visitors from around the world.

The mosque's design brilliantly combines traditional Islamic architectural elements with modern construction techniques and materials. The central dome, reaching 36 meters in height, is flanked by four minarets that soar 47 meters into the sky, creating a striking silhouette against Almaty's mountain backdrop. The building's white marble facade, adorned with intricate geometric patterns and calligraphy, reflects the timeless beauty of Islamic artistic traditions while incorporating contemporary design sensibilities.

Inside, the mosque is equally impressive. The main prayer hall features soaring ceilings decorated with traditional Islamic geometric patterns and calligraphy from the Quran. The mihrab (prayer niche) is a masterpiece of craftsmanship, while the minbar (pulpit) showcases the finest traditions of Islamic woodworking. The mosque also houses a library, conference halls, and educational facilities that serve the broader community.`,
    image: '/culture/almaty-mosque.jpg',
    category: 'culture',
    subcategory: 'now',
    location: 'Almaty, Kazakhstan',
    highlights: [
      'One of the largest mosques in Central Asia',
      'Stunning contemporary Islamic architecture',
      'Beautiful marble facade and geometric patterns',
      '47-meter tall minarets',
      'Accommodates 7,000 worshippers'
    ],
    activities: ['Architecture tours', 'Cultural learning', 'Photography', 'Spiritual visits'],
    facilities: ['Prayer halls', 'Library', 'Educational center', 'Visitor guidance'],
    era: 'Contemporary (1999)',
    type: 'Religious architecture',
    bestTime: 'Year-round',
    duration: '1-2 hours',
    difficulty: 'Easy',
    rating: 4,
    featured: false,
    status: 'ACTIVE',
    displayOrder: 2
  }
];

// City destinations data  
const citiesDestinations = [
  {
    name: 'Baiterek Tower',
    slug: 'baiterek-tower',
    subtitle: 'Symbol of Modern Nur-Sultan',
    description: 'Ascend the iconic Baiterek Tower, the symbol of Kazakhstan\'s capital, offering panoramic views and representing the nation\'s aspirations for the future.',
    content: `The Baiterek Tower stands as the most recognizable symbol of modern Kazakhstan and represents the nation's ambitious vision for the future. Rising 105 meters above the capital city of Nur-Sultan (formerly Astana), this architectural marvel has become synonymous with Kazakhstan's rapid development and modernization since independence.

The tower's design is deeply rooted in Kazakh mythology and folklore. The name "Baiterek" comes from a Kazakh legend about a mythical tree of life where the sacred bird Samruk laid its golden eggs. The tower's golden sphere, representing the egg, sits atop a soaring white trunk that symbolizes the tree itself. This connection between ancient legend and futuristic architecture perfectly captures Kazakhstan's ability to honor its cultural heritage while embracing modernity.

From the observation deck at 97 meters, visitors can enjoy breathtaking 360-degree views of the entire capital. The vista encompasses the dramatic skyline of government buildings, the flowing Ishim River, and the vast Kazakh steppe stretching to the horizon. Inside the golden sphere, visitors will find a gilded handprint of Kazakhstan's first President, Nursultan Nazarbayev, which has become a popular attraction for both tourists and locals.`,
    image: '/cities/baiterek.jpg',
    category: 'cities',
    location: 'Nur-Sultan (Astana), Kazakhstan',
    highlights: [
      'Iconic symbol of modern Kazakhstan',
      'Panoramic views from 97-meter observation deck',
      'Represents the mythical Baiterek tree',
      'Golden sphere with presidential handprint',
      'Stunning architectural design'
    ],
    activities: ['Sightseeing', 'Photography', 'City tours', 'Cultural appreciation'],
    facilities: ['Observation deck', 'Elevators', 'Gift shop', 'Information center'],
    region: 'Akmola Region',
    founded: '2002',
    bestTime: 'Year-round',
    duration: '1-2 hours',
    difficulty: 'Easy',
    rating: 5,
    featured: true,
    status: 'ACTIVE',
    displayOrder: 1
  },
  {
    name: 'Kok-Tobe Hill',
    slug: 'kok-tobe-hill',
    subtitle: 'Almaty\'s Favorite Recreation Spot',
    description: 'Enjoy spectacular views of Almaty and the Tian Shan mountains from Kok-Tobe Hill, accessible by cable car and featuring parks, restaurants, and the famous Apple of Almaty monument.',
    content: `Kok-Tobe Hill, rising 1,100 meters above sea level, has been Almaty's most beloved recreational destination for decades. The name "Kok-Tobe," meaning "Blue Hill" in Kazakh, perfectly captures the azure atmosphere that often surrounds this elevated paradise overlooking Kazakhstan's former capital city.

The journey to Kok-Tobe is an adventure in itself. The cable car ride, spanning 1,620 meters, offers breathtaking aerial views of the city below and the majestic Tian Shan mountains beyond. As visitors ascend through the crisp mountain air, the urban landscape of Almaty unfolds beneath them, revealing the perfect grid of Soviet-era urban planning enhanced by modern developments and surrounded by the dramatic backdrop of snow-capped peaks.

At the summit, Kok-Tobe Park offers a perfect blend of natural beauty and family-friendly attractions. The park features walking paths through mountain forests, playgrounds for children, and numerous cafes and restaurants where visitors can enjoy traditional Kazakh cuisine while taking in the spectacular views. The famous "Apple of Almaty" monument pays homage to the city's name, which means "Father of Apples" in Kazakh, and has become one of the most photographed landmarks in the city.`,
    image: '/cities/kok-tobe.jpg',
    category: 'cities',
    location: 'Almaty, Kazakhstan',
    highlights: [
      'Spectacular panoramic views of Almaty',
      'Scenic cable car ride to the summit',
      'Famous Apple of Almaty monument',
      'Family-friendly recreational facilities',
      'Mountain forest walking trails'
    ],
    activities: ['Cable car rides', 'Dining', 'Photography', 'Family recreation', 'Hiking'],
    facilities: ['Cable car', 'Restaurants', 'Playgrounds', 'Walking paths', 'Gift shops'],
    region: 'Almaty Region',
    founded: '1967 (cable car)',
    bestTime: 'Year-round',
    duration: 'Half day',
    difficulty: 'Easy',
    rating: 4,
    featured: false,
    status: 'ACTIVE',
    displayOrder: 2
  }
];

// Migration function
async function migrateDestinations() {
  try {
    console.log('🚀 Starting destination migration...');

    // Find or create admin user for createdBy field
    let adminUser = await User.findOne({ email: 'admin@visitkazakhstan.com' });
    
    if (!adminUser) {
      console.log('Creating admin user...');
      const hashedPassword = await bcrypt.hash('Admin123!', 12);
      adminUser = new User({
        name: 'Admin',
        email: 'admin@visitkazakhstan.com',
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true
      });
      await adminUser.save();
      console.log('✅ Admin user created');
    }

    // Clear existing destinations (optional - comment out if you want to keep existing data)
    // await Destination.deleteMany({});
    // console.log('🗑️ Cleared existing destinations');

    // Prepare all destinations
    const allDestinations = [
      ...natureDestinations.map(dest => ({ ...dest, createdBy: adminUser._id })),
      ...cultureDestinations.map(dest => ({ ...dest, createdBy: adminUser._id })),
      ...citiesDestinations.map(dest => ({ ...dest, createdBy: adminUser._id }))
    ];

    console.log(`📥 Importing ${allDestinations.length} destinations...`);

    // Insert destinations one by one to handle duplicates
    let importedCount = 0;
    let skippedCount = 0;

    for (const destData of allDestinations) {
      try {
        // Check if destination already exists
        const existing = await Destination.findOne({ slug: destData.slug });
        
        if (existing) {
          console.log(`⚠️  Skipping ${destData.name} - already exists`);
          skippedCount++;
          continue;
        }

        // Create new destination
        const destination = new Destination(destData);
        await destination.save();
        console.log(`✅ Imported: ${destData.name}`);
        importedCount++;
        
      } catch (error) {
        console.error(`❌ Failed to import ${destData.name}:`, error.message);
      }
    }

    console.log('\n🎉 Migration completed!');
    console.log(`✅ Imported: ${importedCount} destinations`);
    console.log(`⚠️  Skipped: ${skippedCount} destinations (already existed)`);
    console.log(`📊 Total in database: ${await Destination.countDocuments()}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📴 Database connection closed');
  }
}

// Run migration
if (require.main === module) {
  connectDB().then(migrateDestinations);
}

module.exports = { migrateDestinations };