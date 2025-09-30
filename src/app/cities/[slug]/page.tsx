'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MapPin, Star } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
// import toast from 'react-hot-toast'; // removed for now

// Static cities data with detailed information
const citiesData = {
  'astana': {
    id: 1,
    name: 'Astana',
    subtitle: 'Bold, Visionary, Futuristic',
    description: 'Kazakhstan\'s capital rises from the steppe with ambition and style. Known for its striking architecture — the Bayterek Tower, Khan Shatyr, and Nur Alem Sphere — Astana is a hub for politics, business, and innovation. Museums, concert halls, and festivals make it a symbol of a forward-looking nation.',
    image: '/baiterek.jpg',
    category: 'Cities',
    region: 'North-Central Kazakhstan',
    population: '1.2 million',
    founded: '1830 (renamed to Nur-Sultan in 2019)',
    bestTime: 'May-September',
    duration: '3-4 days',
    highlights: [
      'Bayterek Tower - Iconic symbol with panoramic city views',
      'Khan Shatyr Entertainment Center - World\'s largest tent',
      'Nur Alem Sphere - Future energy pavilion from EXPO 2017',
      'Astana Opera - World-class performances',
      'National Museum of Kazakhstan - Modern history exhibits'
    ],
    content: `
      <h3>The Vision Made Reality</h3>
      <p>In 1997, Kazakhstan's President Nursultan Nazarbayev announced that the capital would move from Almaty to Astana (now Nur-Sultan). What followed was one of the most ambitious urban development projects of the 21st century. Rising from the vast Kazakh steppe, this futuristic city embodies the nation's aspirations and confidence in its future.</p>
      
      <h3>Architectural Marvels</h3>
      <p>The city's skyline is a testament to bold vision and innovative design. The Bayterek Tower, designed to represent a Kazakh legend about a mythical tree of life, has become the city's most recognizable symbol. Khan Shatyr, designed by Norman Foster, creates a climate-controlled environment housing shops, restaurants, and even a beach resort with sand imported from the Maldives.</p>
      
      <h3>Cultural Hub</h3>
      <p>Despite its youth, Astana has quickly established itself as a major cultural center. The Astana Opera, opened in 2013, brings world-class ballet, opera, and classical music to Central Asia. The city regularly hosts international festivals, conferences, and cultural events that showcase both Kazakhstani and global culture.</p>
      
      <h3>Modern Living</h3>
      <p>Life in Astana represents Kazakhstan's modern identity. The city offers a high standard of living with excellent infrastructure, modern shopping centers, fine dining, and cultural amenities. The harsh continental climate, with temperatures ranging from -30°C in winter to +30°C in summer, has shaped both the architecture and lifestyle of its residents.</p>
    `
  },
  'almaty': {
    id: 2,
    name: 'Almaty',
    subtitle: 'Green, Cultural, Creative',
    description: 'The cultural and creative heart of Kazakhstan, nestled in the foothills of the majestic Tian Shan mountains. Former capital with rich history, vibrant arts scene, and gateway to natural wonders.',
    image: '/almaty.jpg',
    category: 'Cities',
    region: 'Southeast Kazakhstan',
    population: '2 million',
    founded: '1854',
    bestTime: 'April-June, September-November',
    duration: '3-5 days',
    highlights: [
      'Kok-Tobe Hill - Cable car rides and city panoramas',
      'Green Bazaar - Traditional market experience',
      'Central Park and tree-lined streets',
      'Medeu Ice Skating Rink - World\'s highest outdoor rink',
      'Vibrant nightlife and restaurant scene'
    ],
    content: `
      <h3>Kazakhstan's Cultural Capital</h3>
      <p>Almaty served as Kazakhstan's capital until 1997 and remains the country's largest city and cultural heart. Set against the dramatic backdrop of the snow-capped Tian Shan mountains, Almaty combines Soviet-era architecture with modern developments, creating a unique urban landscape that reflects Kazakhstan's complex history.</p>
      
      <h3>Mountain City Lifestyle</h3>
      <p>Few cities in the world offer such proximity to both urban amenities and pristine mountain wilderness. Almaty residents can ski at Shymbulak in winter, hike in the foothills year-round, and enjoy the city's many parks and green spaces. This connection to nature influences the relaxed, outdoor-oriented lifestyle that characterizes the city.</p>
      
      <h3>Creative and Cultural Scene</h3>
      <p>Almaty's creative energy is evident everywhere - from the street art that adorns buildings throughout the city to the numerous galleries, theaters, and music venues. The city's café culture, influenced by its proximity to both Europe and Asia, creates spaces where artists, entrepreneurs, and intellectuals gather to exchange ideas.</p>
      
      <h3>Gateway to Adventure</h3>
      <p>The city serves as the perfect base for exploring Kazakhstan's natural wonders. The famous Big Almaty Lake, Charyn Canyon, and Kolsai Lakes are all within day-trip distance, making Almaty an ideal destination for travelers seeking both urban sophistication and natural beauty.</p>
    `
  },
  'turkestan': {
    id: 3,
    name: 'Turkestan',
    subtitle: 'Sacred & Historic',
    description: 'Ancient spiritual center and UNESCO World Heritage site, home to the magnificent Mausoleum of Khoja Ahmed Yasawi and centuries of Islamic architecture.',
    image: '/turkestan.jpg',
    category: 'Cities',
    region: 'South Kazakhstan',
    population: '180,000',
    founded: '6th century',
    bestTime: 'April-June, September-November',
    duration: '1-2 days',
    highlights: [
      'Mausoleum of Khoja Ahmed Yasawi - UNESCO World Heritage site',
      'Ancient Islamic architecture',
      'Spiritual pilgrimage destination',
      'Traditional crafts and bazaars',
      'Historical museums and cultural sites'
    ],
    content: `
      <h3>Sacred City of Central Asia</h3>
      <p>Turkestan is one of Kazakhstan's most historically significant cities, serving as a spiritual and cultural center for centuries. The city's importance stems from its association with Khoja Ahmed Yasawi, a 12th-century Sufi mystic and poet whose teachings spread throughout the Turkic world.</p>
      
      <h3>The Yasawi Mausoleum</h3>
      <p>The city's crown jewel is the magnificent Mausoleum of Khoja Ahmed Yasawi, built by Timur (Tamerlane) in the late 14th century. This UNESCO World Heritage site represents one of the finest examples of Timurid architecture, featuring intricate tilework, soaring arches, and a massive dome that dominates the city's skyline.</p>
      
      <h3>Pilgrimage and Spirituality</h3>
      <p>For centuries, Turkestan has been a major pilgrimage destination for Muslims from across Central Asia. The city maintains its spiritual significance today, with visitors coming to pay respects at the mausoleum and experience the peaceful, contemplative atmosphere that pervades the old city.</p>
      
      <h3>Cultural Heritage</h3>
      <p>Beyond the famous mausoleum, Turkestan offers insights into traditional Central Asian Islamic culture. The city's bazaars, traditional workshops, and cultural centers preserve and showcase the region's rich crafts traditions, including carpet weaving, metalwork, and ceramics.</p>
    `
  },
  'shymkent': {
    id: 4,
    name: 'Shymkent',
    subtitle: 'Southern Flavor & Tulip Capital',
    description: 'Kazakhstan\'s southern gateway, rich in tradition and known as the tulip capital. A vibrant mix of modern development and traditional Central Asian culture.',
    image: '/shym.jpg',
    category: 'Cities',
    region: 'South Kazakhstan',
    population: '1 million',
    founded: '12th century',
    bestTime: 'April-May (tulip season), September-November',
    duration: '2-3 days',
    highlights: [
      'Spectacular tulip fields in spring',
      'Traditional Uzbek and Kazakh culture',
      'Vibrant bazaars and markets',
      'Regional cuisine specialties',
      'Proximity to Turkestan and historical sites'
    ],
    content: `
      <h3>Kazakhstan's Southern Gateway</h3>
      <p>Shymkent, Kazakhstan's third-largest city, serves as the gateway to the country's south and Central Asia beyond. The city's location along ancient trade routes has made it a cultural crossroads where Kazakh, Uzbek, and other Central Asian influences blend to create a unique urban character.</p>
      
      <h3>The Tulip Capital</h3>
      <p>Shymkent is renowned as Kazakhstan's tulip capital, surrounded by vast steppes that burst into color each spring with millions of wild tulips. These spectacular displays attract photographers and nature lovers from around the world, while the city celebrates its floral heritage with annual tulip festivals.</p>
      
      <h3>Cultural Melting Pot</h3>
      <p>The city's multicultural character is evident in its cuisine, architecture, and cultural life. Traditional Uzbek influences are particularly strong, reflected in the city's excellent pilaf, architecture featuring Islamic motifs, and bazaars that evoke the atmosphere of ancient Silk Road trading posts.</p>
      
      <h3>Modern Development</h3>
      <p>While honoring its traditional heritage, Shymkent has embraced modern development. New infrastructure, cultural facilities, and business districts demonstrate the city's role as a regional economic center while maintaining the warmth and hospitality that characterizes southern Kazakhstan.</p>
    `
  },
  'aktau-mangystau': {
    id: 5,
    name: 'Aktau & Mangystau',
    subtitle: 'Caspian Port & Martian Landscapes',
    description: 'Coastal city on the Caspian Sea surrounded by otherworldly desert landscapes, underground mosques, and unique geological formations.',
    image: '/aktau.jpg',
    category: 'Cities',
    region: 'Western Kazakhstan',
    population: '200,000',
    founded: '1963',
    bestTime: 'April-June, September-November',
    duration: '3-4 days',
    highlights: [
      'Caspian Sea beaches and waterfront',
      'Underground mosques and caves',
      'Bozzhyra Canyon - Mars-like landscapes',
      'Valley of Balls - Mysterious stone spheres',
      'Oil industry heritage and museums'
    ],
    content: `
      <h3>Where Sea Meets Desert</h3>
      <p>Aktau is Kazakhstan's only port city, located on the eastern shore of the Caspian Sea. Built as a planned city in the Soviet era to support uranium mining and oil extraction, Aktau has evolved into a modern coastal city that serves as the gateway to the otherworldly landscapes of the Mangystau region.</p>
      
      <h3>Caspian Sea Life</h3>
      <p>As Kazakhstan's only seaside city, Aktau offers a unique coastal lifestyle. The city's beaches, seafront promenades, and marine atmosphere provide a sharp contrast to the country's landlocked interior. The Caspian Sea, actually the world's largest lake, supports fishing, recreation, and maritime transportation.</p>
      
      <h3>Gateway to Geological Wonders</h3>
      <p>Aktau serves as the base for exploring the Mangystau region's incredible geological formations. The nearby Ustyurt Plateau features landscapes so alien they've been compared to Mars, with chalk cliffs, underground mosques carved into cliffsides, and the famous Bozzhyra Canyon with its dramatic viewpoints.</p>
      
      <h3>Energy Capital</h3>
      <p>The city's economy is built on Kazakhstan's energy resources, particularly oil and natural gas from the Caspian shelf. This industrial heritage has shaped the city's character while providing the economic foundation for its development as a regional center.</p>
    `
  },
  'oskemen': {
    id: 6,
    name: 'Oskemen',
    subtitle: 'Mountain Gateway',
    description: 'Eastern Kazakhstan\'s cultural center, gateway to the Altai Mountains and rich in mining heritage and natural beauty.',
    image: '/city.png',
    category: 'Cities',
    region: 'Eastern Kazakhstan',
    population: '350,000',
    founded: '1720',
    bestTime: 'May-September',
    duration: '2-3 days',
    highlights: [
      'Gateway to Altai Mountains',
      'Irtysh River waterfront',
      'Mining and metallurgy heritage',
      'Soviet-era architecture',
      'Access to pristine wilderness areas'
    ],
    content: `
      <h3>Eastern Cultural Center</h3>
      <p>Oskemen (also known as Ust-Kamenogorsk) serves as the cultural and economic center of eastern Kazakhstan. Founded as a fortress in 1720, the city has grown to become a major industrial center while maintaining its role as the gateway to the pristine wilderness of the Altai Mountains.</p>
      
      <h3>Industrial Heritage</h3>
      <p>The city's development was largely shaped by its rich mineral resources, particularly zinc, lead, and other metals. Major industrial facilities, including the Ust-Kamenogorsk Titanium and Magnesium Plant, have made the city an important center of Kazakhstan's non-ferrous metallurgy industry.</p>
      
      <h3>Natural Gateway</h3>
      <p>For nature enthusiasts, Oskemen serves as the launching point for adventures in the Altai Mountains. The region offers some of Kazakhstan's most spectacular mountain scenery, pristine lakes, and opportunities for hiking, fishing, and wildlife viewing in areas that remain largely untouched by development.</p>
      
      <h3>River City</h3>
      <p>The Irtysh River flows through the heart of Oskemen, creating a scenic waterfront that provides recreational opportunities and shapes the city's character. The river connects the city to the broader Ob-Irtysh river system, one of the world's longest waterways.</p>
    `
  },
  'taraz': {
    id: 7,
    name: 'Taraz',
    subtitle: 'Ancient City of Traders',
    description: 'One of Kazakhstan\'s oldest cities, a key stop on the ancient Silk Road with rich archaeological heritage and trading history.',
    image: '/tours.jpg',
    category: 'Cities',
    region: 'South Kazakhstan',
    population: '400,000',
    founded: '6th century',
    bestTime: 'April-June, September-November',
    duration: '1-2 days',
    highlights: [
      'Ancient Silk Road heritage',
      'Archaeological sites and ruins',
      'Traditional crafts and bazaars',
      'Historical museums',
      'Proximity to Kyrgyzstan border'
    ],
    content: `
      <h3>Silk Road Legacy</h3>
      <p>Taraz is one of Kazakhstan's most ancient cities, with a history spanning over 2,000 years. As a major stop on the Silk Road, the city served as a crucial trading post where merchants from China, Central Asia, and the Middle East exchanged goods, ideas, and cultures.</p>
      
      <h3>Archaeological Treasures</h3>
      <p>The region around Taraz is rich in archaeological sites that reveal the city's long and complex history. Ancient settlement remains, burial mounds, and artifacts tell the story of the various peoples and civilizations that have called this area home over the centuries.</p>
      
      <h3>Cultural Crossroads</h3>
      <p>Taraz's position near the Kyrgyzstan border has made it a cultural crossroads where Kazakh and Kyrgyz traditions blend. This multicultural heritage is evident in the city's cuisine, crafts, and cultural practices, creating a unique regional identity.</p>
      
      <h3>Modern Development</h3>
      <p>While honoring its ancient heritage, modern Taraz has developed into an important regional center. The city combines historical preservation with contemporary development, serving both as a window into Kazakhstan's past and a gateway to its southern neighbors.</p>
    `
  },
  'karaganda': {
    id: 8,
    name: 'Karaganda',
    subtitle: 'Industrial Heritage',
    description: 'Major industrial center with a unique Soviet-era architecture and important role in Kazakhstan\'s mining and space program history.',
    image: '/expo.jpg',
    category: 'Cities',
    region: 'Central Kazakhstan',
    population: '500,000',
    founded: '1930s',
    bestTime: 'May-September',
    duration: '1-2 days',
    highlights: [
      'Soviet-era industrial architecture',
      'Mining heritage and museums',
      'Connection to space program history',
      'Cultural institutions and theaters',
      'Nearby Baikonur Cosmodrome'
    ],
    content: `
      <h3>Industrial Powerhouse</h3>
      <p>Karaganda was built during the Soviet industrialization drive of the 1930s to exploit the region's rich coal deposits. The city quickly grew into one of the USSR's major industrial centers, developing a distinctive character shaped by its mining heritage and planned Soviet urban design.</p>
      
      <h3>Soviet Architecture</h3>
      <p>The city showcases some of the best examples of Soviet-era architecture and urban planning. Wide boulevards, imposing public buildings, and distinctive residential blocks create an urban landscape that tells the story of Soviet industrial ambitions and architectural ideals.</p>
      
      <h3>Space Age Heritage</h3>
      <p>Karaganda's location made it strategically important during the space race. The nearby Baikonur Cosmodrome, the world's first and largest operational space launch facility, has strong historical connections to the city. Many space program personnel and their families lived in Karaganda during the height of the Soviet space program.</p>
      
      <h3>Cultural Life</h3>
      <p>Despite its industrial character, Karaganda has developed a rich cultural life. The city's theaters, museums, and cultural institutions reflect both its Soviet heritage and its role in Kazakhstan's modern development.</p>
    `
  },
  'pavlodar': {
    id: 9,
    name: 'Pavlodar',
    subtitle: 'Northern Industry',
    description: 'Industrial city on the Irtysh River, known for its petrochemical industry and as a gateway to northern Kazakhstan\'s natural areas.',
    image: '/desert.jpg',
    category: 'Cities',
    region: 'Northern Kazakhstan',
    population: '350,000',
    founded: '1861',
    bestTime: 'May-September',
    duration: '1-2 days',
    highlights: [
      'Irtysh River location',
      'Petrochemical industry heritage',
      'Gateway to northern wilderness',
      'Soviet-era urban planning',
      'Cultural and educational institutions'
    ],
    content: `
      <h3>River City of the North</h3>
      <p>Pavlodar sits on the banks of the Irtysh River in northern Kazakhstan, serving as an important industrial and transportation hub. The city's development was closely tied to the river, which provided both transportation routes and water resources for industrial development.</p>
      
      <h3>Petrochemical Center</h3>
      <p>The discovery of oil resources in the region transformed Pavlodar into a major petrochemical center. Large refineries and chemical plants have made the city crucial to Kazakhstan's energy sector, while also shaping its economic and social character.</p>
      
      <h3>Northern Gateway</h3>
      <p>Pavlodar serves as a gateway to the vast wilderness areas of northern Kazakhstan. The region offers opportunities to experience the northern steppes, wetlands, and forest-steppe zones that are less visited but equally beautiful parts of the country.</p>
      
      <h3>Educational Hub</h3>
      <p>The city has developed into an important educational center for northern Kazakhstan, with universities and technical institutes that serve the region's industrial and educational needs. This has given Pavlodar a younger, more dynamic population despite its industrial focus.</p>
    `
  },
  'atyrau': {
    id: 10,
    name: 'Atyrau',
    subtitle: 'Oil Capital',
    description: 'Kazakhstan\'s oil capital at the mouth of the Ural River, where Europe meets Asia, with modern development and Caspian Sea access.',
    image: '/images/cities/atyrau.jpg',
    category: 'Cities',
    region: 'Western Kazakhstan',
    population: '400,000',
    founded: '1640',
    bestTime: 'April-June, September-November',
    duration: '1-2 days',
    highlights: [
      'Oil industry capital',
      'Europe-Asia boundary location',
      'Ural River delta and Caspian access',
      'Modern international business district',
      'Caviar and fishing heritage'
    ],
    content: `
      <h3>Where Europe Meets Asia</h3>
      <p>Atyrau holds the unique distinction of being located at the traditional boundary between Europe and Asia, with the Ural River serving as the continental divide. This geographical significance has made the city an important crossroads throughout its history.</p>
      
      <h3>Oil Capital</h3>
      <p>Modern Atyrau's identity is closely tied to Kazakhstan's oil industry. As the center of the country's oil production and refining, the city has attracted significant international investment and development, creating a modern business district that rivals any in Central Asia.</p>
      
      <h3>River Delta Ecology</h3>
      <p>The Ural River delta, where Atyrau is located, creates a unique ecosystem where river meets sea. This environment supports diverse wildlife and has historically been important for fishing, particularly for sturgeon and the production of caviar.</p>
      
      <h3>International Character</h3>
      <p>The presence of major international oil companies has given Atyrau a cosmopolitan character unusual for its size. The city features international hotels, restaurants, and cultural facilities that cater to its diverse expatriate community while maintaining its Kazakhstani character.</p>
    `
  }
};

export default function CityPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const city = citiesData[slug as keyof typeof citiesData];

  // Share functionality removed for now

  if (!city) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">City Not Found</h1>
            <p className="text-gray-600 mb-8">
              The city you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link href="/categories/cities" className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cities
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Image with Title Overlay */}
      <div className="relative w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative w-full h-[453px] rounded-lg overflow-hidden bg-gray-900">
          <Image
            src={city.image}
            alt={city.name}
            width={1200}
            height={453}
            className="w-full h-full object-cover"
            priority
          />
          
          {/* Strong dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
          
          {/* Title overlay with strong contrast */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center">
              <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight px-8 max-w-5xl mb-4" style={{
                textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)'
              }}>
                {city.name}
              </h1>
              <p className="text-xl lg:text-2xl text-white/90 font-medium" style={{
                textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
              }}>
                {city.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <p className="text-xl text-black mb-8 leading-relaxed">
              {city.description}
            </p>
            
            <div 
              className="prose prose-lg max-w-none prose-headings:!text-black prose-p:!text-black prose-a:text-amber-600 prose-strong:!text-black prose-li:!text-black prose-ul:!text-black prose-ol:!text-black"
              dangerouslySetInnerHTML={{ __html: city.content }}
            />

            {/* Highlights Section */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-black mb-6">City Highlights</h3>
              <ul className="space-y-3">
                {city.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <Star className="h-5 w-5 text-amber-600 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar - Information Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">City Information</h3>
              
              <div className="space-y-6">
                {/* Region */}
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <MapPin className="h-5 w-5 mr-2 text-amber-600" />
                    <span className="text-sm font-medium">Region</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{city.region}</p>
                </div>

                {/* Best Time to Visit */}
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <svg className="h-5 w-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium">Best Time to Visit</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{city.bestTime}</p>
                </div>

                {/* Duration */}
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <svg className="h-5 w-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium">Recommended Duration</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{city.duration}</p>
                </div>


                {/* Plan Your Trip */}
                <div className="pt-6">
                  <Link 
                    href="/plan-your-trip"
                    className="w-full flex items-center justify-center px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                  >
                    Visit {city.name}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Cities Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Link 
          href="/categories/cities" 
          className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cities
        </Link>
      </div>

      <Footer />
    </div>
  );
}