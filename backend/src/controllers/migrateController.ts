import { Response } from 'express';
import { Destination } from '../models/Destination';
import { AuthenticatedRequest } from '../middleware/auth';

// Complete destinations data from the original frontend
const sampleDestinations = [
  // NATURE DESTINATIONS
  {
    name: 'Lake Kaindy',
    slug: 'lake-kaindy',
    subtitle: 'The Sunken Forest Lake',
    description: 'Marvel at the ethereal beauty of Lake Kaindy, famous for its submerged forest of Tian Shan spruces.',
    content: 'Lake Kaindy stands as one of nature\'s most extraordinary creations, where a 1911 earthquake created a natural dam, flooding a valley and preserving a ghostly forest of spruces beneath crystal-clear waters. The turquoise lake, situated at 2,000 meters above sea level, offers an ethereal landscape where bare tree trunks emerge from pristine mountain water like ancient sentinels. This extraordinary phenomenon has created one of Kazakhstan\'s most photographed natural wonders, where the interplay of light, water, and preserved forest creates an almost mystical atmosphere that changes throughout the day.',
    image: '/nature/kaindy.jpg',
    gallery: ['/nature/kaindy-1.jpg', '/nature/kaindy-2.jpg', '/nature/kaindy-3.jpg'],
    category: 'nature',
    location: 'Almaty Region, Kazakhstan',
    highlights: [
      'Submerged forest of preserved Tian Shan spruces',
      'Crystal-clear turquoise mountain water',
      'Spectacular photography opportunities',
      '2,000 meters above sea level',
      'Unique earthquake-formed natural dam'
    ],
    activities: ['Photography', 'Diving', 'Hiking', 'Nature walks'],
    bestTime: 'June-September',
    duration: '1-2 days',
    difficulty: 'Moderate',
    rating: 5,
    featured: true,
    status: 'ACTIVE',
    displayOrder: 1
  },
  {
    name: 'Kolsai Lakes',
    slug: 'kolsai-lakes',
    subtitle: 'The Pearls of the Northern Tian Shan',
    description: 'Discover three stunning alpine lakes nestled in the Tian Shan mountains.',
    content: 'The Kolsai Lakes system represents one of Kazakhstan\'s most pristine mountain destinations, featuring three crystal-clear alpine lakes connected by rushing mountain streams. Each lake sits at a different elevation, creating a unique ecosystem and offering distinct experiences. The first lake (1,818m) is easily accessible and perfect for families, the second lake (2,252m) requires a moderate hike through ancient spruce forests, while the third lake (2,850m) challenges experienced hikers with breathtaking high-altitude views. The entire system is surrounded by snow-capped peaks and dense coniferous forests, creating a perfect sanctuary for wildlife and an unforgettable experience for nature lovers.',
    image: '/nature/kolsai.jpg',
    gallery: ['/nature/kolsai-1.jpg', '/nature/kolsai-2.jpg', '/nature/kolsai-3.jpg'],
    category: 'nature',
    location: 'Almaty Region, Kazakhstan',
    highlights: [
      'Three pristine alpine lakes at different elevations',
      'Ancient spruce forests',
      'Excellent trout fishing',
      'Snow-capped mountain views',
      'Rich wildlife including bears and snow leopards'
    ],
    activities: ['Hiking', 'Fishing', 'Photography', 'Camping', 'Horseback riding'],
    bestTime: 'June-September',
    duration: '2-4 days',
    difficulty: 'Moderate',
    rating: 5,
    featured: true,
    status: 'ACTIVE',
    displayOrder: 2
  },
  {
    name: 'Charyn Canyon',
    slug: 'charyn-canyon',
    subtitle: 'The Grand Canyon of Kazakhstan',
    description: 'Explore dramatic red rock formations and the famous Valley of Castles.',
    content: 'Charyn Canyon stands as one of Kazakhstan\'s most spectacular natural monuments, carved by the Charyn River over millions of years. Stretching 154 kilometers long with depths reaching 300 meters, this geological masterpiece rivals the famous Grand Canyon in its dramatic beauty. The Valley of Castles, the canyon\'s most famous section, features towering red sandstone formations that have been sculpted by wind and water into castle-like structures, creating an otherworldly landscape that shifts in color from deep red to golden yellow as the sun moves across the sky.',
    image: '/nature/charyn.jpg',
    gallery: ['/nature/charyn-1.jpg', '/nature/charyn-2.jpg', '/nature/charyn-3.jpg'],
    category: 'nature',
    location: 'Almaty Region, Kazakhstan',
    highlights: [
      'Valley of Castles with dramatic rock formations',
      '154 km long canyon system',
      'Depths reaching up to 300 meters',
      'Unique red sandstone geology',
      'Ancient Sogdian ash grove'
    ],
    activities: ['Hiking', 'Photography', 'Rock climbing', 'Camping'],
    bestTime: 'April-October',
    duration: '1-2 days',
    difficulty: 'Easy to Moderate',
    rating: 5,
    featured: true,
    status: 'ACTIVE',
    displayOrder: 3
  },
  {
    name: 'Big Almaty Lake',
    slug: 'big-almaty-lake',
    subtitle: 'Turquoise Alpine Jewel',
    description: 'A pristine mountain lake offering breathtaking views and crystal-clear waters.',
    content: 'Big Almaty Lake, situated at 2,511 meters above sea level, is a stunning alpine reservoir that serves as both a natural wonder and a vital water source for Almaty city. The lake\'s extraordinary turquoise color, caused by glacial silt suspended in the water, creates a mesmerizing contrast against the surrounding snow-capped peaks of the Trans-Ili Alatau mountains. This easily accessible mountain lake offers visitors a perfect escape from city life, with its pristine waters reflecting the majestic Tian Shan peaks and providing a tranquil setting for contemplation and photography.',
    image: '/nature/big-almaty-lake.jpg',
    gallery: ['/nature/big-almaty-1.jpg', '/nature/big-almaty-2.jpg'],
    category: 'nature',
    location: 'Almaty Region, Kazakhstan',
    highlights: [
      'Stunning turquoise glacial lake',
      '2,511 meters above sea level',
      'Panoramic mountain views',
      'Easy accessibility from Almaty',
      'Trans-Ili Alatau mountain setting'
    ],
    activities: ['Photography', 'Hiking', 'Sightseeing'],
    bestTime: 'May-October',
    duration: 'Half day',
    difficulty: 'Easy',
    rating: 4,
    featured: false,
    status: 'ACTIVE',
    displayOrder: 4
  },
  {
    name: 'Altyn-Emel National Park',
    slug: 'altyn-emel',
    subtitle: 'Land of Golden Mountains and Singing Dunes',
    description: 'Discover the mystical Singing Dune and diverse wildlife in this vast steppe landscape.',
    content: 'Altyn-Emel National Park encompasses 4,600 square kilometers of diverse landscapes, from desert steppes to river valleys, creating Kazakhstan\'s most biodiverse protected area. The park\'s crown jewel is the famous Singing Dune, a 150-meter-tall sand formation that produces an otherworldly humming sound when the sand shifts. Beyond this natural phenomenon, the park hosts over 1,800 plant species and serves as a crucial habitat for endangered species like the Przewalski\'s horse, kulan (wild ass), and saiga antelope, making it a premier destination for wildlife enthusiasts and nature photographers.',
    image: '/nature/altyn-emel.jpg',
    gallery: ['/nature/altyn-emel-1.jpg', '/nature/altyn-emel-2.jpg', '/nature/altyn-emel-3.jpg'],
    category: 'nature',
    location: 'Almaty Region, Kazakhstan',
    highlights: [
      'Famous 150m-tall Singing Dune',
      'Home to Przewalski\'s horses',
      '1,800+ plant species',
      'Diverse desert and steppe landscapes',
      'Ancient petroglyphs and archaeological sites'
    ],
    activities: ['Wildlife viewing', 'Photography', 'Hiking', 'Archaeological tours'],
    bestTime: 'April-October',
    duration: '2-3 days',
    difficulty: 'Moderate',
    rating: 4,
    featured: false,
    status: 'ACTIVE',
    displayOrder: 5
  },
  {
    name: 'Borovoye National Nature Park',
    slug: 'borovoye',
    subtitle: 'Kazakhstan\'s Switzerland',
    description: 'Experience pristine lakes, granite formations, and virgin pine forests.',
    content: 'Borovoye National Nature Park, often called "Kazakhstan\'s Switzerland," offers a stunning landscape of pristine lakes nestled among granite rock formations and virgin pine forests. This 830-square-kilometer park features over 14 lakes, with Lake Borovoye being the largest and most spectacular. The park\'s unique geology, created by ancient volcanic activity, has produced dramatic granite outcrops that rise majestically from the steppe, creating a landscape unlike anywhere else in Kazakhstan. The combination of clear mountain air, therapeutic mineral waters, and diverse ecosystems makes Borovoye a perfect destination for both active adventures and restorative retreats.',
    image: '/nature/borovoye.jpg',
    gallery: ['/nature/borovoye-1.jpg', '/nature/borovoye-2.jpg', '/nature/borovoye-3.jpg'],
    category: 'nature',
    location: 'Akmola Region, Kazakhstan',
    highlights: [
      '14 pristine mountain lakes',
      'Dramatic granite rock formations',
      'Virgin pine and birch forests',
      'Therapeutic mineral waters',
      'Rich wildlife including deer and eagles'
    ],
    activities: ['Boating', 'Fishing', 'Hiking', 'Rock climbing', 'Spa treatments'],
    bestTime: 'May-September',
    duration: '2-4 days',
    difficulty: 'Easy to Moderate',
    rating: 4,
    featured: false,
    status: 'ACTIVE',
    displayOrder: 6
  },
  {
    name: 'Mangystau Region',
    slug: 'mangystau-region',
    subtitle: 'Land of Ancient Mysteries',
    description: 'Explore otherworldly landscapes, ancient necropolises, and underground mosques.',
    content: 'Mangystau Region represents one of Earth\'s most otherworldly landscapes, where millions of years of geological processes have created a surreal terrain of limestone plateaus, underground canyons, and bizarrely shaped rock formations. This ancient land, once beneath the Tethys Ocean, now reveals its maritime past through fossils and sedimentary layers visible in dramatic cliff faces. The region holds profound historical significance as well, serving as a crossroads for ancient trade routes and housing remarkable architectural monuments including underground mosques carved from solid rock and vast necropolises that testify to the area\'s rich cultural heritage.',
    image: '/nature/mangystau.jpg',
    gallery: ['/nature/mangystau-1.jpg', '/nature/mangystau-2.jpg', '/nature/mangystau-3.jpg'],
    category: 'nature',
    location: 'Mangystau Region, Kazakhstan',
    highlights: [
      'Unique limestone plateau formations',
      'Underground mosques and canyons',
      'Ancient fossil deposits',
      'Dramatic cliff faces and rock sculptures',
      'Historical trade route heritage'
    ],
    activities: ['Geological tours', 'Photography', 'Archaeological exploration', 'Cave exploration'],
    bestTime: 'April-June, September-October',
    duration: '3-5 days',
    difficulty: 'Moderate to Challenging',
    rating: 4,
    featured: false,
    status: 'ACTIVE',
    displayOrder: 7
  },

  // CULTURAL DESTINATIONS - "NOW" (Modern Culture)
  {
    name: 'Kok-Tobe Hill',
    slug: 'kok-tobe-hill',
    subtitle: 'Almaty\'s Beloved Landmark',
    description: 'Enjoy panoramic city views, entertainment, and the iconic TV tower.',
    content: 'Kok-Tobe Hill stands as Almaty\'s most beloved recreational destination, offering breathtaking panoramic views of the city against the backdrop of the majestic Tian Shan mountains. This 1,100-meter-high hill combines natural beauty with modern entertainment, featuring Kazakhstan\'s tallest TV tower, amusement rides, restaurants, and cultural attractions. The hill\'s name, meaning "Blue Hill" in Kazakh, reflects its role as a symbol of Almaty\'s identity, while its facilities cater to visitors of all ages with everything from romantic evening strolls to family-friendly activities and cultural performances.',
    image: '/culture/kok-tobe.jpg',
    gallery: ['/culture/kok-tobe-1.jpg', '/culture/kok-tobe-2.jpg'],
    category: 'culture',
    subcategory: 'now',
    location: 'Almaty, Kazakhstan',
    highlights: [
      'Panoramic views of Almaty and Tian Shan mountains',
      'Kazakhstan\'s tallest TV tower (372m)',
      'Cable car ride experience',
      'Amusement park and entertainment zone',
      'Traditional Kazakh cultural performances'
    ],
    activities: ['Sightseeing', 'Cable car rides', 'Dining', 'Entertainment', 'Photography'],
    bestTime: 'Year-round',
    duration: 'Half day',
    difficulty: 'Easy',
    rating: 4,
    featured: true,
    status: 'ACTIVE',
    displayOrder: 8
  },
  {
    name: 'Medeu Skating Rink',
    slug: 'medeu-skating-rink',
    subtitle: 'World\'s Highest Skating Rink',
    description: 'Experience ice skating at 1,691 meters with stunning mountain views.',
    content: 'Medeu Skating Rink holds the distinction of being the world\'s highest skating rink at 1,691 meters above sea level, creating ideal conditions for speed skating records due to the thin mountain air. This architectural marvel, built in 1972, features a 10,500 square meter ice field surrounded by the spectacular scenery of the Tian Shan mountains. The rink has hosted numerous international competitions and set over 200 world records, making it a pilgrimage site for skating enthusiasts while offering recreational skating opportunities for visitors of all skill levels.',
    image: '/culture/medeu.jpg',
    gallery: ['/culture/medeu-1.jpg', '/culture/medeu-2.jpg'],
    category: 'culture',
    subcategory: 'now',
    location: 'Almaty, Kazakhstan',
    highlights: [
      'World\'s highest skating rink (1,691m)',
      'Over 200 world records set here',
      'Stunning Tian Shan mountain backdrop',
      'Olympic-standard facilities',
      '10,500 square meter ice surface'
    ],
    activities: ['Ice skating', 'Speed skating', 'Sightseeing', 'Photography'],
    bestTime: 'November-March',
    duration: 'Half day',
    difficulty: 'Easy',
    rating: 4,
    featured: false,
    status: 'ACTIVE',
    displayOrder: 9
  },
  {
    name: 'Green Bazaar',
    slug: 'green-bazaar',
    subtitle: 'Almaty\'s Culinary Heart',
    description: 'Immerse yourself in local flavors, spices, and traditional crafts.',
    content: 'The Green Bazaar (Zeleny Bazaar) serves as Almaty\'s vibrant culinary heart, where the aromas of fresh spices, dried fruits, and traditional delicacies create an intoxicating sensory experience. This historic market, housed in a beautiful early 20th-century building, showcases Kazakhstan\'s diverse culinary heritage through its colorful displays of local produce, traditional dairy products, and handcrafted items. From horse sausage (shuzhuk) to fresh kumys, the bazaar offers authentic tastes that connect visitors directly to Kazakh nomadic traditions and modern urban culture.',
    image: '/culture/green-bazaar.jpg',
    gallery: ['/culture/green-bazaar-1.jpg', '/culture/green-bazaar-2.jpg'],
    category: 'culture',
    subcategory: 'now',
    location: 'Almaty, Kazakhstan',
    highlights: [
      'Historic early 20th-century architecture',
      'Authentic Kazakh culinary specialties',
      'Fresh local produce and spices',
      'Traditional crafts and textiles',
      'Cultural immersion experience'
    ],
    activities: ['Food tasting', 'Shopping', 'Cultural exploration', 'Photography'],
    bestTime: 'Year-round',
    duration: '2-3 hours',
    difficulty: 'Easy',
    rating: 4,
    featured: false,
    status: 'ACTIVE',
    displayOrder: 10
  },
  {
    name: 'Astana Opera House',
    slug: 'astana-opera-house',
    subtitle: 'World-Class Performing Arts',
    description: 'Experience magnificent architecture and world-renowned performances.',
    content: 'The Astana Opera House stands as a crown jewel of Kazakhstan\'s cultural renaissance, combining cutting-edge architecture with world-class performing arts. This magnificent venue, opened in 2013, features state-of-the-art acoustics and stunning neoclassical design that creates an intimate yet grand atmosphere for opera, ballet, and symphonic performances. The opera house regularly hosts international stars alongside Kazakhstan\'s finest performers, making it a cultural bridge between East and West and a symbol of the nation\'s commitment to preserving and promoting high cultural arts.',
    image: '/culture/astana-opera.jpg',
    gallery: ['/culture/astana-opera-1.jpg', '/culture/astana-opera-2.jpg'],
    category: 'culture',
    subcategory: 'now',
    location: 'Nur-Sultan, Kazakhstan',
    highlights: [
      'World-class neoclassical architecture',
      'State-of-the-art acoustics and staging',
      'International and local performances',
      '1,250-seat main hall',
      'Symbol of modern Kazakhstan culture'
    ],
    activities: ['Opera attendance', 'Ballet performances', 'Concert attendance', 'Architecture tours'],
    bestTime: 'September-May (performance season)',
    duration: '3-4 hours per performance',
    difficulty: 'Easy',
    rating: 5,
    featured: true,
    status: 'ACTIVE',
    displayOrder: 11
  },
  {
    name: 'Bayterek Tower',
    slug: 'bayterek-tower',
    subtitle: 'Symbol of Modern Kazakhstan',
    description: 'Climb the national symbol for panoramic views of Nur-Sultan.',
    content: 'Bayterek Tower stands as the defining symbol of modern Kazakhstan, representing the mythical tree of life from Kazakh folklore where the sacred bird Samruk laid golden eggs. This 105-meter-tall monument combines traditional symbolism with contemporary design, featuring a golden sphere supported by a white tower that mimics the legendary tree. From its observation deck at 97 meters, visitors enjoy panoramic views of Nur-Sultan\'s futuristic skyline while contemplating the nation\'s journey from ancient nomadic traditions to modern statehood.',
    image: '/culture/bayterek.jpg',
    gallery: ['/culture/bayterek-1.jpg', '/culture/bayterek-2.jpg'],
    category: 'culture',
    subcategory: 'now',
    location: 'Nur-Sultan, Kazakhstan',
    highlights: [
      'National symbol of Kazakhstan',
      '97-meter observation deck',
      'Golden handprint of President Nazarbayev',
      'Panoramic city views',
      'Symbol of tree of life mythology'
    ],
    activities: ['Sightseeing', 'Photography', 'Cultural learning', 'City viewing'],
    bestTime: 'Year-round',
    duration: '1-2 hours',
    difficulty: 'Easy',
    rating: 4,
    featured: true,
    status: 'ACTIVE',
    displayOrder: 12
  },
  {
    name: 'Nur-Astana Mosque',
    slug: 'nur-astana-mosque',
    subtitle: 'Central Asia\'s Largest Mosque',
    description: 'Marvel at stunning Islamic architecture and spiritual significance.',
    content: 'Nur-Astana Mosque stands as Central Asia\'s largest mosque and one of the most magnificent examples of contemporary Islamic architecture. This grand structure, completed in 2005, can accommodate up to 7,000 worshippers and features a stunning blend of traditional Islamic design elements with modern construction techniques. The mosque\'s soaring minarets, intricate geometric patterns, and spacious prayer halls create a serene spiritual atmosphere while serving as a symbol of Kazakhstan\'s religious tolerance and cultural diversity.',
    image: '/culture/nur-astana-mosque.jpg',
    gallery: ['/culture/nur-astana-1.jpg', '/culture/nur-astana-2.jpg'],
    category: 'culture',
    subcategory: 'now',
    location: 'Nur-Sultan, Kazakhstan',
    highlights: [
      'Central Asia\'s largest mosque',
      'Capacity for 7,000 worshippers',
      'Contemporary Islamic architecture',
      'Intricate geometric decorations',
      'Symbol of religious tolerance'
    ],
    activities: ['Architectural appreciation', 'Cultural learning', 'Photography', 'Spiritual reflection'],
    bestTime: 'Year-round',
    duration: '1-2 hours',
    difficulty: 'Easy',
    rating: 4,
    featured: false,
    status: 'ACTIVE',
    displayOrder: 13
  },

  // CULTURAL DESTINATIONS - "THEN" (Historical Heritage)
  {
    name: 'Mausoleum of Khoja Ahmed Yasawi',
    slug: 'khoja-ahmed-yasawi-mausoleum',
    subtitle: 'UNESCO World Heritage Masterpiece',
    description: 'Explore this 14th-century architectural marvel and spiritual center.',
    content: 'The Mausoleum of Khoja Ahmed Yasawi represents one of Central Asia\'s most significant architectural achievements and Kazakhstan\'s premier UNESCO World Heritage Site. Built by Timur (Tamerlane) in the late 14th century to honor the great Sufi poet and philosopher, this magnificent structure showcases the pinnacle of Timurid architecture with its soaring dome, intricate tilework, and monumental scale. The mausoleum served as a prototype for later Islamic architecture and continues to function as an important pilgrimage site, bridging Kazakhstan\'s pre-Islamic Turkic heritage with its Islamic spiritual traditions.',
    image: '/culture/yasawi-mausoleum.jpg',
    gallery: ['/culture/yasawi-1.jpg', '/culture/yasawi-2.jpg', '/culture/yasawi-3.jpg'],
    category: 'culture',
    subcategory: 'then',
    location: 'Turkestan, Kazakhstan',
    highlights: [
      'UNESCO World Heritage Site',
      'Masterpiece of Timurid architecture',
      'Largest brick dome in Central Asia',
      'Important Islamic pilgrimage site',
      'Tomb of great Sufi poet Khoja Ahmed Yasawi'
    ],
    activities: ['Historical tours', 'Architectural study', 'Pilgrimage', 'Photography'],
    bestTime: 'Year-round',
    duration: '2-3 hours',
    difficulty: 'Easy',
    era: '14th century',
    type: 'Religious architecture',
    rating: 5,
    featured: true,
    status: 'ACTIVE',
    displayOrder: 14
  },
  {
    name: 'Otrar Archaeological Site',
    slug: 'otrar-archaeological-site',
    subtitle: 'Ancient Silk Road Trading Post',
    description: 'Walk through ruins of a once-great Silk Road city.',
    content: 'Otrar Archaeological Site preserves the remains of one of Central Asia\'s most important medieval cities, a thriving Silk Road trading post that played a crucial role in East-West commerce for over a millennium. Founded in the 1st century CE, Otrar reached its zenith in the 12th-13th centuries before being destroyed by the Mongol invasion of 1219-1221. The extensive ruins reveal the layout of a sophisticated urban center with citadels, residential quarters, workshops, and religious buildings, providing invaluable insights into medieval Central Asian urban life and the economic networks that connected China with Europe.',
    image: '/culture/otrar.jpg',
    gallery: ['/culture/otrar-1.jpg', '/culture/otrar-2.jpg', '/culture/otrar-3.jpg'],
    category: 'culture',
    subcategory: 'then',
    location: 'South Kazakhstan Region, Kazakhstan',
    highlights: [
      'Major Silk Road trading center',
      'Ruins spanning over 1,000 years',
      'Birthplace of mathematician Al-Farabi',
      'Extensive archaeological excavations',
      'Strategic location at trade route crossroads'
    ],
    activities: ['Archaeological tours', 'Historical exploration', 'Educational visits', 'Photography'],
    bestTime: 'April-October',
    duration: '2-3 hours',
    difficulty: 'Moderate',
    era: '1st-13th centuries CE',
    type: 'Archaeological site',
    rating: 4,
    featured: false,
    status: 'ACTIVE',
    displayOrder: 15
  },
  {
    name: 'Tamgaly Petroglyphs',
    slug: 'tamgaly-petroglyphs',
    subtitle: 'Ancient Rock Art Gallery',
    description: 'Discover 5,000 years of rock art in this UNESCO site.',
    content: 'Tamgaly Petroglyphs constitute Kazakhstan\'s most significant concentration of ancient rock art, representing a continuous artistic tradition spanning over 5,000 years. This UNESCO World Heritage Site contains more than 5,000 petroglyphs carved into dark volcanic rocks, depicting everything from Bronze Age hunting scenes to medieval Turkic inscriptions. The site serves as an outdoor museum of human history, where successive cultures - from Bronze Age pastoralists to medieval Turkic tribes - left their mark, creating a unique palimpsest of Central Asian civilization that offers unparalleled insights into ancient spiritual beliefs, daily life, and artistic expression.',
    image: '/culture/tamgaly.jpg',
    gallery: ['/culture/tamgaly-1.jpg', '/culture/tamgaly-2.jpg', '/culture/tamgaly-3.jpg'],
    category: 'culture',
    subcategory: 'then',
    location: 'Almaty Region, Kazakhstan',
    highlights: [
      'UNESCO World Heritage Site',
      'Over 5,000 ancient petroglyphs',
      '5,000-year continuous artistic tradition',
      'Bronze Age to medieval period art',
      'Unique spiritual and cultural insights'
    ],
    activities: ['Archaeological tours', 'Rock art study', 'Photography', 'Educational visits'],
    bestTime: 'April-October',
    duration: '3-4 hours',
    difficulty: 'Moderate',
    era: 'Bronze Age to Medieval (3000 BCE - 1400 CE)',
    type: 'Archaeological site',
    rating: 4,
    featured: true,
    status: 'ACTIVE',
    displayOrder: 16
  },
  {
    name: 'Bektau-Ata Sacred Mountains',
    slug: 'bektau-ata-sacred-mountains',
    subtitle: 'Spiritual Landscape of Ancient Beliefs',
    description: 'Experience the mystical atmosphere of these sacred granite formations.',
    content: 'Bektau-Ata Sacred Mountains represent one of Kazakhstan\'s most spiritually significant landscapes, where dramatic granite formations have served as a pilgrimage destination for over a millennium. These ancient weathered rocks, shaped by millions of years of erosion, create a surreal landscape of stone sculptures that local traditions imbue with healing and spiritual powers. The site combines natural wonder with deep cultural significance, as generations of Kazakhs have come here seeking spiritual guidance, physical healing, and connection with their ancestral beliefs, making it a unique synthesis of geological marvel and living cultural heritage.',
    image: '/culture/bektau-ata.jpg',
    gallery: ['/culture/bektau-ata-1.jpg', '/culture/bektau-ata-2.jpg'],
    category: 'culture',
    subcategory: 'then',
    location: 'Karaganda Region, Kazakhstan',
    highlights: [
      'Sacred pilgrimage destination',
      'Ancient granite rock formations',
      'Traditional healing beliefs',
      'Spiritual and cultural significance',
      'Unique geological formations'
    ],
    activities: ['Spiritual tours', 'Rock formations exploration', 'Cultural learning', 'Photography'],
    bestTime: 'May-September',
    duration: '1-2 days',
    difficulty: 'Moderate',
    era: 'Ancient times to present',
    type: 'Sacred natural site',
    rating: 4,
    featured: false,
    status: 'ACTIVE',
    displayOrder: 17
  },
  {
    name: 'Sauran Ancient City',
    slug: 'sauran-ancient-city',
    subtitle: 'Medieval Fortress Ruins',
    description: 'Explore the remains of a powerful medieval fortress city.',
    content: 'Sauran Ancient City stands as one of Kazakhstan\'s most impressive medieval archaeological sites, preserving the remains of a powerful fortress city that controlled the northern Silk Road routes. Built in the 10th century and reaching its peak in the 14th-15th centuries, Sauran featured massive defensive walls, a sophisticated urban layout, and advanced hydraulic systems that supported a thriving population. The city\'s strategic location made it a crucial link in the trade networks connecting Europe, Asia, and the Middle East, while its impressive fortifications demonstrate the military architecture expertise of medieval Central Asian civilizations.',
    image: '/culture/sauran.jpg',
    gallery: ['/culture/sauran-1.jpg', '/culture/sauran-2.jpg'],
    category: 'culture',
    subcategory: 'then',
    location: 'South Kazakhstan Region, Kazakhstan',
    highlights: [
      'Massive medieval defensive walls',
      'Strategic Silk Road location',
      'Advanced urban planning',
      'Sophisticated water management systems',
      '10th-15th century occupation'
    ],
    activities: ['Archaeological exploration', 'Historical tours', 'Photography', 'Educational visits'],
    bestTime: 'April-October',
    duration: '2-3 hours',
    difficulty: 'Moderate',
    era: '10th-15th centuries',
    type: 'Archaeological site',
    rating: 3,
    featured: false,
    status: 'ACTIVE',
    displayOrder: 18
  },

  // CITIES DESTINATIONS
  {
    name: 'Nur-Sultan (Astana)',
    slug: 'nur-sultan',
    subtitle: 'The Futuristic Capital',
    description: 'Experience Kazakhstan\'s modern capital with its futuristic architecture.',
    content: 'Nur-Sultan, Kazakhstan\'s capital since 1997, represents one of the world\'s most ambitious urban planning projects of the modern era. Rising from the steppe in just two decades, this futuristic city showcases cutting-edge architecture alongside traditional Kazakh cultural elements, creating a unique urban landscape that symbolizes the nation\'s rapid modernization. From the iconic Bayterek Tower to the stunning Palace of Peace and Reconciliation, every district tells the story of Kazakhstan\'s transformation from Soviet republic to independent nation, while world-class cultural institutions, government buildings, and residential complexes demonstrate the country\'s vision for the 21st century.',
    image: '/cities/nur-sultan.jpg',
    gallery: ['/cities/nur-sultan-1.jpg', '/cities/nur-sultan-2.jpg', '/cities/nur-sultan-3.jpg'],
    category: 'cities',
    location: 'Akmola Region, Kazakhstan',
    region: 'Akmola',
    population: '1.2 million',
    founded: '1830 (as Akmolinsk)',
    highlights: [
      'Futuristic architectural landmarks',
      'Bayterek Tower national symbol',
      'Palace of Peace and Reconciliation',
      'World-class cultural institutions',
      'Modern urban planning showcase'
    ],
    activities: ['Architecture tours', 'Cultural visits', 'Government building tours', 'Modern art exploration'],
    bestTime: 'May-September',
    duration: '2-3 days',
    difficulty: 'Easy',
    rating: 5,
    featured: true,
    status: 'ACTIVE',
    displayOrder: 19
  },
  {
    name: 'Almaty',
    slug: 'almaty',
    subtitle: 'The Southern Capital',
    description: 'Discover Kazakhstan\'s cultural heart nestled beneath the Tian Shan mountains.',
    content: 'Almaty, Kazakhstan\'s largest city and former capital, embodies the perfect fusion of Soviet heritage, Kazakh culture, and modern cosmopolitan life, all set against the spectacular backdrop of the snow-capped Tian Shan mountains. This verdant city, whose name means "father of apples," offers an unparalleled quality of life with its tree-lined boulevards, vibrant cultural scene, and easy access to world-class mountain recreation. From the bustling Green Bazaar to the elegant opera house, from Soviet-era monuments to cutting-edge shopping centers, Almaty presents visitors with the full spectrum of Kazakhstan\'s cultural evolution while maintaining its reputation as Central Asia\'s most livable city.',
    image: '/cities/almaty.jpg',
    gallery: ['/cities/almaty-1.jpg', '/cities/almaty-2.jpg', '/cities/almaty-3.jpg'],
    category: 'cities',
    location: 'Almaty Region, Kazakhstan',
    region: 'Almaty',
    population: '2.0 million',
    founded: '1854',
    highlights: [
      'Spectacular Tian Shan mountain backdrop',
      'Rich cultural and arts scene',
      'Historic Green Bazaar market',
      'Soviet architectural heritage',
      'Gateway to mountain recreation'
    ],
    activities: ['City tours', 'Cultural exploration', 'Mountain excursions', 'Shopping', 'Dining'],
    bestTime: 'April-October',
    duration: '2-4 days',
    difficulty: 'Easy',
    rating: 5,
    featured: true,
    status: 'ACTIVE',
    displayOrder: 20
  },
  {
    name: 'Turkestan',
    slug: 'turkestan',
    subtitle: 'The Spiritual Center',
    description: 'Visit Kazakhstan\'s ancient spiritual capital and UNESCO World Heritage sites.',
    content: 'Turkestan stands as Kazakhstan\'s spiritual and historical heart, a city whose significance transcends national borders to encompass the entire Islamic world. Home to the magnificent Mausoleum of Khoja Ahmed Yasawi, this UNESCO World Heritage Site has attracted pilgrims for over six centuries, earning its designation as a sacred city where three visits equal one hajj to Mecca. Beyond its religious importance, Turkestan preserves layers of Central Asian history, from its ancient origins as a Silk Road trading post to its role as the capital of the Kazakh Khanate, making it an essential destination for understanding Kazakhstan\'s cultural and spiritual heritage.',
    image: '/cities/turkestan.jpg',
    gallery: ['/cities/turkestan-1.jpg', '/cities/turkestan-2.jpg', '/cities/turkestan-3.jpg'],
    category: 'cities',
    location: 'South Kazakhstan Region, Kazakhstan',
    region: 'South Kazakhstan',
    population: '180,000',
    founded: '4th century CE',
    highlights: [
      'UNESCO World Heritage Site',
      'Major Islamic pilgrimage destination',
      'Mausoleum of Khoja Ahmed Yasawi',
      'Ancient Silk Road heritage',
      'Capital of historical Kazakh Khanate'
    ],
    activities: ['Pilgrimage tours', 'Historical exploration', 'Architecture study', 'Cultural immersion'],
    bestTime: 'April-October',
    duration: '1-2 days',
    difficulty: 'Easy',
    rating: 5,
    featured: true,
    status: 'ACTIVE',
    displayOrder: 21
  },
  {
    name: 'Shymkent',
    slug: 'shymkent',
    subtitle: 'The Garden City',
    description: 'Explore Kazakhstan\'s third-largest city known for its parks and cultural diversity.',
    content: 'Shymkent, Kazakhstan\'s third-largest city, earned its nickname "Garden City" through its abundance of parks, tree-lined streets, and commitment to green urban spaces. This ancient settlement, with roots dating back over 800 years, has evolved into a modern industrial and cultural center while maintaining its reputation for hospitality and cultural diversity. The city serves as a gateway to southern Kazakhstan\'s historical treasures, including nearby Turkestan, while offering visitors its own attractions ranging from traditional bazaars to modern entertainment complexes and some of the country\'s best examples of Soviet-era urban planning adapted for the 21st century.',
    image: '/cities/shymkent.jpg',
    gallery: ['/cities/shymkent-1.jpg', '/cities/shymkent-2.jpg'],
    category: 'cities',
    location: 'South Kazakhstan Region, Kazakhstan',
    region: 'South Kazakhstan',
    population: '1.0 million',
    founded: '12th century',
    highlights: [
      'Extensive parks and green spaces',
      'Cultural diversity and hospitality',
      'Gateway to southern historical sites',
      'Traditional bazaars and markets',
      'Modern industrial and cultural center'
    ],
    activities: ['City tours', 'Park visits', 'Cultural exploration', 'Shopping', 'Regional excursions'],
    bestTime: 'April-October',
    duration: '1-2 days',
    difficulty: 'Easy',
    rating: 3,
    featured: false,
    status: 'ACTIVE',
    displayOrder: 22
  },
  {
    name: 'Aktau',
    slug: 'aktau',
    subtitle: 'The Caspian Gateway',
    description: 'Discover Kazakhstan\'s only seaside city on the Caspian Sea shore.',
    content: 'Aktau holds the unique distinction of being Kazakhstan\'s only seaside city, stretching along the eastern shore of the Caspian Sea in a landscape that resembles an alien planet more than a typical coastal destination. Built in the 1960s as a uranium mining center, this young city has evolved into Kazakhstan\'s primary maritime gateway and oil industry hub, while its dramatic white cliffs, unique desert-meets-sea environment, and access to the otherworldly landscapes of Mangystau Region make it an increasingly popular destination for adventurous travelers seeking experiences unlike anywhere else in the world.',
    image: '/cities/aktau.jpg',
    gallery: ['/cities/aktau-1.jpg', '/cities/aktau-2.jpg'],
    category: 'cities',
    location: 'Mangystau Region, Kazakhstan',
    region: 'Mangystau',
    population: '180,000',
    founded: '1963',
    highlights: [
      'Kazakhstan\'s only seaside city',
      'Caspian Sea coastline',
      'Dramatic white limestone cliffs',
      'Gateway to Mangystau Region',
      'Unique desert-meets-sea landscape'
    ],
    activities: ['Coastal walks', 'Regional tours', 'Oil industry tours', 'Geological exploration'],
    bestTime: 'May-September',
    duration: '1-2 days',
    difficulty: 'Easy',
    rating: 3,
    featured: false,
    status: 'ACTIVE',
    displayOrder: 23
  },
  {
    name: 'Oskemen',
    slug: 'oskemen',
    subtitle: 'The Eastern Gateway',
    description: 'Experience the confluence of Kazakh, Russian, and Siberian cultures.',
    content: 'Oskemen (formerly Ust-Kamenogorsk) occupies a strategic position at the confluence of the Irtysh and Ulba rivers in eastern Kazakhstan, serving as the regional capital and a fascinating example of cultural convergence where Kazakh, Russian, and Siberian influences create a unique urban identity. Founded as a Russian fortress in 1720, the city has evolved into a major industrial and educational center while maintaining its role as the gateway to the Altai Mountains. The city\'s rich industrial heritage, combined with its proximity to some of Kazakhstan\'s most beautiful mountain landscapes, offers visitors insights into both the country\'s Soviet legacy and its natural wonders.',
    image: '/cities/oskemen.jpg',
    gallery: ['/cities/oskemen-1.jpg', '/cities/oskemen-2.jpg'],
    category: 'cities',
    location: 'East Kazakhstan Region, Kazakhstan',
    region: 'East Kazakhstan',
    population: '350,000',
    founded: '1720',
    highlights: [
      'Confluence of Irtysh and Ulba rivers',
      'Gateway to Altai Mountains',
      'Rich industrial and mining heritage',
      'Cultural convergence point',
      'Educational and scientific center'
    ],
    activities: ['City tours', 'Industrial heritage tours', 'River activities', 'Mountain excursions'],
    bestTime: 'May-September',
    duration: '1-2 days',
    difficulty: 'Easy',
    rating: 3,
    featured: false,
    status: 'ACTIVE',
    displayOrder: 24
  },
  {
    name: 'Taraz',
    slug: 'taraz',
    subtitle: 'The Ancient Crossroads',
    description: 'Walk through 2,000 years of history in this ancient Silk Road city.',
    content: 'Taraz stands as one of Kazakhstan\'s oldest continuously inhabited cities, with a remarkable 2,000-year history that spans from its origins as the Silk Road trading center of Talas to its current role as a modern regional capital. This ancient crossroads has witnessed the rise and fall of empires, from the medieval Karakhanid state to the Mongol invasions, each leaving their mark on the city\'s rich archaeological and architectural heritage. Today, Taraz combines its historical significance with modern development, offering visitors the chance to explore ancient mausoleums, archaeological sites, and museums while experiencing contemporary Kazakh urban life in a city that truly bridges past and present.',
    image: '/cities/taraz.jpg',
    gallery: ['/cities/taraz-1.jpg', '/cities/taraz-2.jpg'],
    category: 'cities',
    location: 'Zhambyl Region, Kazakhstan',
    region: 'Zhambyl',
    population: '360,000',
    founded: '1st century CE',
    highlights: [
      '2,000 years of continuous habitation',
      'Ancient Silk Road trading center',
      'Rich archaeological heritage',
      'Medieval mausoleums and monuments',
      'Bridge between ancient and modern'
    ],
    activities: ['Historical tours', 'Archaeological site visits', 'Cultural exploration', 'Monument tours'],
    bestTime: 'April-October',
    duration: '1-2 days',
    difficulty: 'Easy',
    rating: 3,
    featured: false,
    status: 'ACTIVE',
    displayOrder: 25
  },
  {
    name: 'Karaganda',
    slug: 'karaganda',
    subtitle: 'The Coal Mining Capital',
    description: 'Discover the industrial heart of Kazakhstan and its Soviet-era heritage.',
    content: 'Karaganda emerged in the 20th century as the industrial heart of Kazakhstan, built around vast coal deposits that powered the Soviet Union\'s industrial expansion and continue to fuel Kazakhstan\'s economy today. This planned city, developed primarily in the 1930s-50s, showcases some of the finest examples of Soviet urban planning and architecture outside of Russia, while its complex history as a center of both industrial achievement and Stalinist repression creates a compelling destination for visitors interested in understanding Kazakhstan\'s Soviet legacy and its ongoing transformation into a modern industrial center.',
    image: '/cities/karaganda.jpg',
    gallery: ['/cities/karaganda-1.jpg', '/cities/karaganda-2.jpg'],
    category: 'cities',
    location: 'Karaganda Region, Kazakhstan',
    region: 'Karaganda',
    population: '500,000',
    founded: '1934',
    highlights: [
      'Major coal mining and industrial center',
      'Fine Soviet-era architecture',
      'Planned city development',
      'Industrial heritage sites',
      'Complex Soviet historical legacy'
    ],
    activities: ['Industrial tours', 'Soviet architecture exploration', 'Historical museums', 'City walks'],
    bestTime: 'May-September',
    duration: '1-2 days',
    difficulty: 'Easy',
    rating: 3,
    featured: false,
    status: 'ACTIVE',
    displayOrder: 26
  },
  {
    name: 'Pavlodar',
    slug: 'pavlodar',
    subtitle: 'The Irtysh River Port',
    description: 'Experience Kazakhstan\'s major river port and industrial center.',
    content: 'Pavlodar occupies a strategic position on the Irtysh River in northern Kazakhstan, serving as the country\'s principal river port and a major industrial center that exemplifies the Soviet Union\'s ambitious development of Central Asia\'s resource wealth. Founded in the 18th century as a salt trading post, the city expanded dramatically during the Soviet era to become a hub for petrochemical, aluminum, and energy production, while maintaining its role as a river transport center connecting Kazakhstan with Siberian Russia. Today, Pavlodar offers visitors insights into Kazakhstan\'s industrial development while providing access to the Irtysh River\'s recreational opportunities.',
    image: '/cities/pavlodar.jpg',
    gallery: ['/cities/pavlodar-1.jpg', '/cities/pavlodar-2.jpg'],
    category: 'cities',
    location: 'Pavlodar Region, Kazakhstan',
    region: 'Pavlodar',
    population: '350,000',
    founded: '1720',
    highlights: [
      'Major Irtysh River port',
      'Industrial and petrochemical center',
      'River transport hub',
      'Soviet-era industrial architecture',
      'Connection to Siberian Russia'
    ],
    activities: ['Industrial tours', 'River activities', 'City exploration', 'Transportation heritage'],
    bestTime: 'May-September',
    duration: '1 day',
    difficulty: 'Easy',
    rating: 2,
    featured: false,
    status: 'ACTIVE',
    displayOrder: 27
  },
  {
    name: 'Atyrau',
    slug: 'atyrau',
    subtitle: 'The Oil Capital',
    description: 'Visit Kazakhstan\'s oil industry center at the mouth of the Ural River.',
    content: 'Atyrau stands as Kazakhstan\'s undisputed oil capital, strategically located at the mouth of the Ural River where Europe meets Asia and where the Caspian Sea meets the Eurasian steppe. This dynamic city has been transformed by oil wealth from a modest fishing town into a modern industrial metropolis that serves as the headquarters for Kazakhstan\'s petroleum industry and the base for international oil companies operating in the Caspian region. The city\'s unique geography, straddling two continents, combined with its role as the gateway to Kazakhstan\'s oil riches, creates a fascinating destination where traditional Kazakh culture meets global energy industry influences.',
    image: '/cities/atyrau.jpg',
    gallery: ['/cities/atyrau-1.jpg', '/cities/atyrau-2.jpg'],
    category: 'cities',
    location: 'Atyrau Region, Kazakhstan',
    region: 'Atyrau',
    population: '290,000',
    founded: '1640',
    highlights: [
      'Kazakhstan\'s oil industry capital',
      'Strategic location where Europe meets Asia',
      'Mouth of the Ural River',
      'International petroleum hub',
      'Caspian Sea access point'
    ],
    activities: ['Oil industry tours', 'River activities', 'Continental boundary visits', 'Modern city exploration'],
    bestTime: 'April-October',
    duration: '1-2 days',
    difficulty: 'Easy',
    rating: 3,
    featured: false,
    status: 'ACTIVE',
    displayOrder: 28
  }
];

export const migrateDestinations = async (req: AuthenticatedRequest, res: Response) => {
  try {
    console.log('Starting destination migration...');
    
    // Optional: Clear all existing destinations first (uncomment the next line to enable)
    // await Destination.deleteMany({});
    // console.log('Cleared existing destinations');
    
    let importedCount = 0;
    let skippedCount = 0;

    for (const destData of sampleDestinations) {
      try {
        // Check if destination already exists
        const existing = await Destination.findOne({ slug: destData.slug });
        
        if (existing) {
          console.log(`Skipping ${destData.name} - already exists`);
          skippedCount++;
          continue;
        }

        // Create new destination
        const destination = new Destination({
          ...destData,
          createdBy: req.user!.id
        });
        
        await destination.save();
        console.log(`Imported: ${destData.name}`);
        importedCount++;
        
      } catch (error) {
        console.error(`Failed to import ${destData.name}:`, error);
      }
    }

    const totalDestinations = await Destination.countDocuments();

    res.json({
      success: true,
      message: 'Migration completed successfully',
      data: {
        imported: importedCount,
        skipped: skippedCount,
        totalInDatabase: totalDestinations
      }
    });

  } catch (error) {
    console.error('Migration failed:', error);
    res.status(500).json({
      success: false,
      message: 'Migration failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};