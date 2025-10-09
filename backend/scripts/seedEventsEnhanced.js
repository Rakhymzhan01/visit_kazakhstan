const mongoose = require('mongoose');
const { Event } = require('../dist/models');
require('dotenv').config();

const enhancedEvents = [
  {
    title: "Almaty International Music Festival 2025",
    slug: "almaty-international-music-festival-2025",
    description: "Join us for Kazakhstan's premier music festival featuring international and local artists in the heart of Almaty. This extraordinary three-day celebration brings together traditional Kazakh music with contemporary world music performances. Experience the rich sounds of dombra, kobyz, and traditional throat singing alongside modern fusion artists from across Central Asia and beyond. The festival takes place in stunning outdoor venues with the majestic Tian Shan mountains as your backdrop. Artists from Mongolia, Kyrgyzstan, Uzbekistan, and international performers will showcase the diverse musical heritage of the Silk Road. Food stalls featuring traditional Central Asian cuisine, craft exhibitions, and cultural workshops complete this immersive cultural experience. Don't miss the closing ceremony featuring a collaborative performance by all participating artists under the stars.",
    excerpt: "Kazakhstan's premier music festival featuring international and local artists with traditional and contemporary performances in the heart of Almaty.",
    image: "/expo.jpg",
    category: "Music",
    date: new Date("2025-06-15"),
    time: "18:00",
    location: "Kok-Tobe Park, Almaty, Kazakhstan",
    featured: true,
    status: "PUBLISHED",
    price: "5,000 KZT - 15,000 KZT",
    duration: "3 days",
    organizer: "Almaty Cultural Foundation & Ministry of Culture",
    website: "https://almaty-music-fest.kz",
    tags: ["music", "festival", "almaty", "culture", "international", "traditional", "world-music", "silk-road"],
    authorId: "68c961562756fecf06837266"
  },
  {
    title: "Astana Cultural Heritage Exhibition",
    slug: "astana-cultural-heritage-exhibition",
    description: "Explore Kazakhstan's rich cultural heritage through an extraordinary exhibition showcasing 5,000 years of history. This comprehensive display features rare artifacts from the Saka and Scythian periods, traditional nomadic crafts, and interactive exhibits detailing the evolution of Kazakh culture. Witness live demonstrations of traditional crafts including felt-making, jewelry crafting, and carpet weaving by master artisans. The exhibition includes a virtual reality experience of ancient Silk Road trade routes, reconstructed yurt displays showing different regional styles, and multimedia presentations of Kazakhstan's cultural transformation. Educational programs for children and adults include traditional music performances, storytelling sessions in both Kazakh and Russian, and hands-on workshops where visitors can try their hand at traditional crafts. This is a rare opportunity to see artifacts normally housed in museums across Kazakhstan brought together in one spectacular venue.",
    excerpt: "Explore 5,000 years of Kazakh cultural heritage through artifacts, interactive displays, and live demonstrations by master artisans.",
    image: "/baiterek.jpg",
    category: "Culture",
    date: new Date("2025-07-20"),
    time: "10:00",
    location: "Nur-Sultan National Museum, Astana, Kazakhstan",
    featured: false,
    status: "PUBLISHED",
    price: "Free admission",
    duration: "2 weeks",
    organizer: "Ministry of Culture and Sports of Kazakhstan",
    website: "https://culture.gov.kz/heritage2025",
    tags: ["culture", "heritage", "astana", "exhibition", "traditional", "history", "artifacts", "crafts"],
    authorId: "68c961562756fecf06837266"
  },
  {
    title: "Mangystau Desert Adventure Rally",
    slug: "mangystau-desert-adventure-rally",
    description: "Embark on an unforgettable journey through the mystical landscapes of Mangystau region, often called Kazakhstan's most alien-like terrain. This two-day adventure rally takes you through ancient underground mosques carved into cliffs, dramatic canyons that rival the American Southwest, and mysterious stone formations that have stood for millions of years. Participants will visit the underground Beket-Ata Mosque, explore the Valley of Balls with its perfectly spherical rock formations, and camp overnight under some of the clearest night skies on Earth. The rally includes professional guides who share geological insights and local legends, 4WD vehicle rentals, camping equipment, and traditional Kazakh meals prepared by local families. Photography workshops are included for those interested in capturing the surreal landscapes. This isn't just an adventure tour - it's a spiritual journey through landscapes that feel like another planet, combined with deep cultural immersion in one of Kazakhstan's most remote regions.",
    excerpt: "Two-day adventure through Mangystau's alien landscapes including underground mosques, mysterious canyons, and overnight desert camping.",
    image: "/mangystau.jpg",
    category: "Adventure",
    date: new Date("2025-08-10"),
    time: "08:00",
    location: "Aktau, Mangystau Region, Kazakhstan",
    featured: false,
    status: "PUBLISHED",
    price: "35,000 KZT per person",
    duration: "2 days, 1 night",
    organizer: "Kazakhstan Adventure Sports & Mangystau Tourism Board",
    website: "https://mangystau-adventure.kz",
    tags: ["adventure", "desert", "rally", "mangystau", "underground-mosque", "geology", "camping", "photography"],
    authorId: "68c961562756fecf06837266"
  },
  {
    title: "Almaty Tech Innovation Conference 2025",
    slug: "almaty-tech-innovation-conference-2025",
    description: "Kazakhstan's premier technology conference bringing together leading innovators, entrepreneurs, and tech leaders to discuss the future of digital transformation in Central Asia. This year's theme focuses on 'Digital Silk Road: Innovation Without Borders' featuring keynote speakers from Silicon Valley, Skolkovo, and emerging tech hubs across Eurasia. The conference covers artificial intelligence applications in nomadic heritage preservation, blockchain solutions for cross-border trade, and sustainable technology innovations for harsh climates. Attendees will participate in hands-on workshops on machine learning, cryptocurrency regulation in Kazakhstan, and e-commerce solutions for rural regions. The startup pitch competition offers $50,000 in prizes for the most innovative solutions addressing Central Asian challenges. Networking sessions include meetings with venture capitalists, government officials from the Digital Kazakhstan program, and representatives from international tech companies establishing regional headquarters. This is the must-attend event for anyone interested in Kazakhstan's rapid technological advancement and investment opportunities.",
    excerpt: "Kazakhstan's leading technology conference featuring international speakers, startup competitions, and innovations in the Digital Silk Road initiative.",
    image: "/almaty.jpg",
    category: "Conference",
    date: new Date("2025-09-05"),
    time: "09:00",
    location: "Almaty Convention Center, Almaty, Kazakhstan",
    featured: false,
    status: "PUBLISHED",
    price: "18,000 KZT early bird / 25,000 KZT regular",
    duration: "3 days",
    organizer: "Tech Kazakhstan Association & Digital Kazakhstan Initiative",
    website: "https://techconf-almaty.kz",
    tags: ["technology", "conference", "innovation", "startup", "almaty", "blockchain", "AI", "digital-silk-road"],
    authorId: "68c961562756fecf06837266"
  },
  {
    title: "Kolsai Lakes Photography Masterclass",
    slug: "kolsai-lakes-photography-masterclass",
    description: "Join internationally acclaimed landscape photographers for an immersive workshop in the breathtaking Kolsai Lakes, known as the 'Pearls of Kazakhstan'. This four-day intensive program is designed for intermediate to advanced photographers looking to master alpine landscape photography. The workshop covers advanced techniques including focus stacking, long exposure water photography, and golden hour mountain compositions. Participants will photograph all three Kolsai lakes, each offering unique perspectives and challenges. Professional instruction includes one-on-one portfolio reviews, post-processing masterclasses using Lightroom and Photoshop, and lessons on equipment selection for extreme weather conditions. The program includes accommodation in traditional guesthouses, meals featuring local cuisine, and guided hiking to exclusive viewpoints not accessible to regular tourists. Evening sessions cover astrophotography techniques for capturing the Milky Way above the mountains. All participants receive a professional critique of their work and the best images will be featured in a collaborative exhibition in Almaty. Limited to 12 participants to ensure personalized instruction.",
    excerpt: "Four-day intensive photography workshop in Kazakhstan's alpine paradise with professional instruction and exclusive access to pristine viewpoints.",
    image: "/bao_contras.jpg",
    category: "Workshop",
    date: new Date("2025-09-22"),
    time: "07:00",
    location: "Kolsai Lakes National Park, Almaty Region, Kazakhstan",
    featured: true,
    status: "PUBLISHED",
    price: "75,000 KZT (including accommodation and meals)",
    duration: "4 days, 3 nights",
    organizer: "Kazakhstan Photography Society & Mountain Focus Academy",
    website: "https://kolsai-photo-workshop.kz",
    tags: ["photography", "workshop", "kolsai", "mountains", "landscape", "nature", "alpine", "masterclass"],
    authorId: "68c961562756fecf06837266"
  },
  {
    title: "Turkestan Medieval Heritage Festival",
    slug: "turkestan-medieval-heritage-festival",
    description: "Step back in time to the golden age of the Silk Road at the ancient city of Turkestan, UNESCO World Heritage site and spiritual heart of Kazakhstan. This spectacular festival celebrates the rich medieval history surrounding the magnificent Khoja Ahmed Yasawi Mausoleum, one of Central Asia's most important Islamic monuments. Experience authentic medieval crafts demonstrations including traditional metalworking, calligraphy, manuscript illumination, and ancient weaving techniques passed down through generations. The festival features historical reenactments of Silk Road merchant caravans, traditional horseback demonstrations, and performances of epic tales from Kazakh oral tradition. Visitors can participate in workshops on traditional cooking methods, learn ancient musical instruments, and observe master craftsmen creating intricate woodwork and ceramics. The highlight is the evening performance combining traditional Kazakh music, Sufi poetry, and dance performances in the shadow of the 14th-century mausoleum. Food stalls offer historically accurate medieval recipes, and the bazaar features handcrafted goods made using traditional techniques. This festival offers a rare glimpse into Kazakhstan's role as a crucial link between East and West.",
    excerpt: "Experience medieval Silk Road traditions in UNESCO World Heritage site Turkestan with crafts, performances, and historical reenactments.",
    image: "/kozha_akhmet_yassaui.jpg",
    category: "Festival",
    date: new Date("2025-10-15"),
    time: "11:00",
    location: "Khoja Ahmed Yasawi Complex, Turkestan, Kazakhstan",
    featured: true,
    status: "PUBLISHED",
    price: "5,000 KZT adults / Children under 12 free",
    duration: "2 days",
    organizer: "Turkestan Regional Administration & UNESCO Kazakhstan",
    website: "https://turkestan-heritage-festival.kz",
    tags: ["festival", "heritage", "turkestan", "medieval", "silk-road", "unesco", "culture", "history"],
    authorId: "68c961562756fecf06837266"
  },
  {
    title: "Charyn Canyon Geological Expedition",
    slug: "charyn-canyon-geological-expedition",
    description: "Explore the magnificent Charyn Canyon, often called Kazakhstan's Grand Canyon, on this comprehensive geological expedition led by professional geologists and experienced mountain guides. This full-day adventure combines hiking, education, and breathtaking scenery as you discover how 12 million years of erosion created this natural masterpiece. The expedition includes guided tours through the famous Valley of Castles, where red sandstone formations create an otherworldly landscape reminiscent of the American Southwest. Expert guides explain the fascinating geological processes that shaped the canyon while pointing out fossil remains and unique rock formations. The program includes rappelling opportunities for adventure seekers, photography instruction for capturing the dramatic light and shadows, and lessons on the unique desert ecosystem that thrives in this harsh environment. Participants will visit hidden chambers and viewpoints known only to local guides, enjoy a traditional picnic lunch prepared by local families, and learn about the conservation efforts protecting this natural wonder. The expedition concludes with sunset photography from the canyon rim, offering spectacular views of the Ili River valley below.",
    excerpt: "Full-day geological expedition through Kazakhstan's Grand Canyon with expert guides, hiking, and rappelling opportunities.",
    image: "/charyn.jpg",
    category: "Adventure",
    date: new Date("2025-11-08"),
    time: "06:00",
    location: "Charyn Canyon National Nature Park, Almaty Region, Kazakhstan",
    featured: false,
    status: "PUBLISHED",
    price: "12,000 KZT (including transport and lunch)",
    duration: "Full day (12 hours)",
    organizer: "Kazakhstan Eco Tourism & Geological Society of Kazakhstan",
    website: "https://charyn-expedition.kz",
    tags: ["adventure", "geology", "charyn", "canyon", "hiking", "nature", "photography", "conservation"],
    authorId: "68c961562756fecf06837266"
  },
  {
    title: "Winter Nomad Games Championship",
    slug: "winter-nomad-games-championship",
    description: "Experience the authentic spirit of Kazakhstan's nomadic heritage at the Winter Nomad Games, featuring traditional equestrian sports and winter competitions that have been part of Kazakh culture for over 1,000 years. This spectacular three-day championship brings together the finest horsemen from across Central Asia to compete in traditional games including Kokpar (horseback tug-of-war with a goat carcass), Kyz kuu (chase the girl), and mounted archery competitions. Winter-specific events include ski-joring with horses, traditional hunting demonstrations with golden eagles and hunting dogs, and ice horse racing on frozen lakes. Cultural performances throughout the event feature traditional music, throat singing, and epic storytelling around warming fires. Visitors can participate in workshops learning traditional crafts like leather working, felt making, and horse equipment decoration. The festival includes demonstrations of traditional winter survival techniques, ice fishing competitions, and traditional winter food preparation. Accommodation is available in heated traditional yurts, offering an authentic nomadic experience even in winter conditions. This is a rare opportunity to witness skills that are rapidly disappearing from the modern world, presented in their original cultural context.",
    excerpt: "Three-day championship featuring traditional Kazakh equestrian sports, eagle hunting, and authentic nomadic winter competitions.",
    image: "/famile.jpg",
    category: "Sports",
    date: new Date("2025-12-20"),
    time: "10:00",
    location: "Kapchagai Lake, Almaty Region, Kazakhstan",
    featured: false,
    status: "PUBLISHED",
    price: "Free spectator access / 20,000 KZT for participation workshops",
    duration: "3 days",
    organizer: "Kazakhstan Equestrian Federation & World Nomad Games Committee",
    website: "https://winter-nomad-games.kz",
    tags: ["traditional-sports", "nomad", "winter", "horses", "kokpar", "archery", "eagle-hunting", "cultural"],
    authorId: "68c961562756fecf06837266"
  }
];

async function seedEnhancedEvents() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/visit-kazakhstan');
    console.log('Connected to MongoDB');

    // Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events');

    // Insert enhanced events
    const createdEvents = await Event.insertMany(enhancedEvents);
    console.log(`Successfully created ${createdEvents.length} enhanced events:`);
    
    createdEvents.forEach(event => {
      console.log(`- ${event.title} (${event.category}) ${event.featured ? '[FEATURED]' : ''}`);
      console.log(`  📝 Description: ${event.description.substring(0, 100)}...`);
      console.log(`  💰 Price: ${event.price}`);
      console.log(`  🕒 Duration: ${event.duration}`);
      console.log(`  🏢 Organizer: ${event.organizer}`);
      console.log(`  🔗 Website: ${event.website}`);
      console.log(`  🏷️ Tags: ${event.tags.join(', ')}`);
      console.log('');
    });

    console.log('✅ Enhanced events seeding completed successfully!');
    console.log('📁 Events with comprehensive details are now stored in the "events" collection');
    console.log('🎯 Each event now has detailed descriptions, comprehensive information, and rich content for detail pages');
    
  } catch (error) {
    console.error('Error seeding enhanced events:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the enhanced seeding script
seedEnhancedEvents();