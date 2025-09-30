'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MapPin, Camera } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
// import toast from 'react-hot-toast'; // removed for now

// Static destination data (this matches the data from nature page)
const destinationsData = {
  'mangystau-region': {
    id: 1,
    name: 'Mangystau Region',
    description: 'A surreal desert meets seas region in the west, filled with chalk mountains, underground mosques, and alien-like rock formations. Visit Bozzhyra, Torysh (Valley of Balls), and Sherkala Mountain for a journey into a land that feels untouched by time.',
    image: '/mangystau.jpg',
    category: 'Nature',
    location: 'Western Kazakhstan',
    bestTime: 'April-May, September-October',
    duration: '3-5 days',
    difficulty: 'Moderate',
    highlights: [
      'Bozzhyra Canyon - Mars-like landscapes with stunning viewpoints',
      'Torysh Valley of Balls - Mysterious spherical rock formations',
      'Sherkala Mountain - Lion-shaped sacred mountain',
      'Underground mosques carved into cliffsides',
      'Dramatic chalk cliffs and canyons'
    ],
    content: `
      <h3>About Mangystau Region</h3>
      <p>Mangystau Region is one of Kazakhstan's most otherworldly destinations, where ancient seas have left behind a landscape that seems more suited to another planet than Earth. Located in western Kazakhstan along the Caspian Sea coast, this region offers some of the most dramatic and unusual natural formations in Central Asia.</p>
      
      <h3>Bozzhyra Canyon</h3>
      <p>Often called Kazakhstan's Grand Canyon, Bozzhyra is a massive canyon system with colorful layered cliffs and bizarre rock formations. The best viewpoints offer panoramic vistas across the desert landscape, especially stunning at sunrise and sunset when the rocks glow with warm colors.</p>
      
      <h3>Torysh - Valley of Balls</h3>
      <p>This unique geological site features hundreds of mysterious spherical stones scattered across the landscape. These naturally formed stone balls range from a few centimeters to several meters in diameter, creating an almost alien landscape that has puzzled scientists for decades.</p>
      
      <h3>Planning Your Visit</h3>
      <p>The best time to visit Mangystau is during spring (April-May) when temperatures are mild and wildflowers bloom, or autumn (September-October) when the heat subsides. Summer temperatures can be extreme, reaching over 40°C (104°F). Most visitors base themselves in Aktau city and take day trips or camping expeditions to the various sites.</p>
    `
  },
  'charyn-canyon': {
    id: 2,
    name: 'Charyn Canyon',
    description: 'Kazakhstan\'s answer to the Grand Canyon, with dramatic red rock formations carved by millennia of erosion.',
    image: '/charyn.jpg',
    category: 'Nature',
    location: 'Almaty Region',
    bestTime: 'April-June, September-October',
    duration: '1-2 days',
    difficulty: 'Easy to Moderate',
    highlights: [
      'Valley of Castles - Iconic red rock formations',
      'Charyn River - Scenic river views and wildlife',
      'Hiking trails through colorful canyons',
      'Photography opportunities at every turn',
      'Ecological reserve with unique flora'
    ],
    content: `
      <h3>About Charyn Canyon</h3>
      <p>Charyn Canyon is Kazakhstan's most famous natural landmark, stretching for over 80 kilometers along the Charyn River. The canyon is particularly famous for its "Valley of Castles" section, where wind and water have sculpted the red sandstone into fantastic shapes resembling medieval fortresses.</p>
      
      <h3>Valley of Castles</h3>
      <p>The main attraction of Charyn Canyon, this 2-kilometer section features towering red rock formations that have been carved by millions of years of erosion. The rocks glow brilliant orange and red in the morning and evening light, creating some of the most photographed landscapes in Kazakhstan.</p>
      
      <h3>Getting There</h3>
      <p>Located about 200 kilometers east of Almaty, Charyn Canyon is easily accessible by car or tour bus. The journey takes approximately 3-4 hours from Almaty city center. Many visitors combine a trip to Charyn with visits to nearby Kolsai Lakes for a complete nature experience.</p>
    `
  },
  'kolsai-lakes': {
    id: 3,
    name: 'Lake Kaindy & Kolsai Lakes',
    description: 'Crystal-clear alpine lakes in the Tian Shan mountains, perfect for hiking and photography.',
    image: '/bao_contras.jpg',
    category: 'Nature',
    location: 'Almaty Region, Tian Shan Mountains',
    bestTime: 'June-September',
    duration: '2-3 days',
    difficulty: 'Moderate to Challenging',
    highlights: [
      'Three pristine alpine lakes at different elevations',
      'Lake Kaindy with its underwater forest',
      'Spectacular mountain hiking trails',
      'Crystal-clear waters perfect for photography',
      'Traditional Kazakh village culture'
    ],
    content: `
      <h3>About Kolsai Lakes</h3>
      <p>The Kolsai Lakes, often called the "Pearls of the Tian Shan," are a system of three alpine lakes nestled in the northern Tian Shan mountains. Each lake sits at a different elevation, offering unique landscapes and hiking opportunities for visitors of all skill levels.</p>
      
      <h3>Lake Kaindy</h3>
      <p>Perhaps the most famous of the region's lakes, Lake Kaindy was formed by an earthquake in 1911 that created a natural dam. The lake is famous for its submerged forest of Tian Shan spruce trees, whose trunks still rise above the crystal-clear waters like ghostly sentinels.</p>
      
      <h3>The Three Lakes</h3>
      <p>Lower Kolsai Lake (1,818m) is the most accessible and popular for camping and gentle walks. Middle Kolsai Lake (2,252m) requires a moderate hike and offers stunning reflections of surrounding peaks. Upper Kolsai Lake (2,850m) is the most challenging to reach but rewards hikers with pristine wilderness and panoramic mountain views.</p>
    `
  },
  'big-almaty-lake': {
    id: 4,
    name: 'Big Almaty Lake',
    description: 'Stunning turquoise lake nestled high in the mountains above Almaty city.',
    image: '/almaty.jpg',
    category: 'Nature',
    location: 'Trans-Ili Alatau, above Almaty',
    bestTime: 'June-October',
    duration: 'Half day to 1 day',
    difficulty: 'Easy',
    highlights: [
      'Brilliant turquoise alpine lake',
      'Easy accessibility from Almaty city',
      'Surrounding peaks over 4,000 meters',
      'Astronomical observatory nearby',
      'Year-round scenic beauty'
    ],
    content: `
      <h3>About Big Almaty Lake</h3>
      <p>Big Almaty Lake is one of Kazakhstan's most accessible and photographed natural wonders. Located just 28 kilometers south of Almaty city at an elevation of 2,511 meters, this pristine alpine lake offers a perfect escape from urban life into the high mountains of the Trans-Ili Alatau.</p>
      
      <h3>The Lake</h3>
      <p>The lake's brilliant turquoise color comes from glacial sediment that filters the sunlight in spectacular ways. Surrounded by three major peaks - Soviet Peak (4,317m), Ozyorny Peak (4,110m), and Tourist Peak (3,954m) - the lake provides some of the most stunning mountain reflections in Central Asia.</p>
      
      <h3>Visiting Tips</h3>
      <p>The lake is accessible year-round, though the road may require 4WD vehicles in winter. Summer offers the warmest weather and longest daylight hours, while autumn provides crisp air and stunning fall colors. The nearby Tian Shan Astronomical Observatory adds an educational element to visits.</p>
    `
  },
  'altyn-emel': {
    id: 5,
    name: 'Altyn-Emel National Park',
    description: 'Home to the famous Singing Dunes and diverse wildlife in a vast desert landscape.',
    image: '/desert.jpg',
    category: 'Nature',
    location: 'Almaty Region',
    bestTime: 'April-June, September-November',
    duration: '2-3 days',
    difficulty: 'Easy to Moderate',
    highlights: [
      'Singing Dunes - Musical sand dunes phenomenon',
      'Aktau Mountains - Colorful badlands',
      'Wild Przewalski horses',
      'Ancient petroglyphs and burial mounds',
      'Diverse desert ecosystem'
    ],
    content: `
      <h3>About Altyn-Emel National Park</h3>
      <p>Altyn-Emel National Park covers over 4,600 square kilometers of diverse landscapes in southeastern Kazakhstan. The park is famous for its unique natural phenomena, including the singing sand dunes and colorful rock formations, as well as its successful wildlife conservation programs.</p>
      
      <h3>The Singing Dunes</h3>
      <p>The park's most famous attraction is a 120-meter high sand dune that produces a mysterious humming sound when the sand shifts. This acoustic phenomenon, caused by the movement of fine sand grains, can be heard from several kilometers away and has fascinated visitors for centuries.</p>
      
      <h3>Wildlife and Conservation</h3>
      <p>Altyn-Emel is home to several endangered species, including the Przewalski horse (takhi), which was successfully reintroduced to the wild here. The park also protects Asiatic wild ass (kulan), Goitered gazelles, and over 200 bird species in its diverse desert and steppe ecosystems.</p>
    `
  },
  'borovoe': {
    id: 6,
    name: 'Borovoe (Burabay)',
    description: 'Kazakhstan\'s "Switzerland" with pristine lakes, unique rock formations, and pine forests.',
    image: '/kanatnaya_doroga.jpg',
    category: 'Nature',
    location: 'Akmola Region',
    bestTime: 'May-September',
    duration: '2-4 days',
    difficulty: 'Easy',
    highlights: [
      'Pristine freshwater lakes',
      'Unique granite rock formations',
      'Dense pine and birch forests',
      'Rich birdlife and wildlife',
      'Traditional Kazakh legends and culture'
    ],
    content: `
      <h3>About Borovoe National Nature Park</h3>
      <p>Borovoe, also known as Burabay, is often called "Kazakhstan's Switzerland" for its stunning combination of pristine lakes, dense forests, and unique rock formations. This 830-square-kilometer nature park in northern Kazakhstan offers some of the country's most accessible and family-friendly natural attractions.</p>
      
      <h3>Lakes and Landscapes</h3>
      <p>The park contains over 14 lakes, with Lake Borovoye being the largest and most popular. The area's unique geology has created dramatic granite outcrops rising from the steppes, including the famous Zheke-Batyr rock formation and Okzhetpes rock, each associated with ancient Kazakh legends.</p>
      
      <h3>Activities and Culture</h3>
      <p>Borovoe offers excellent opportunities for hiking, boating, fishing, and wildlife watching. The area is rich in Kazakh folklore, with many rock formations and lakes featuring in traditional legends. The park also serves as an important bird migration route, making it a paradise for birdwatchers.</p>
    `
  },
  'tulip-fields': {
    id: 7,
    name: 'Tulip Fields in South Kazakhstan',
    description: 'Spectacular wildflower displays in spring, covering the steppes in vibrant colors.',
    image: '/yurta.jpg',
    category: 'Nature',
    location: 'South Kazakhstan (Taraz & Shymkent regions)',
    bestTime: 'April-May',
    duration: '1-2 days',
    difficulty: 'Easy',
    highlights: [
      'Mass blooming of wild Schrenk tulips',
      'Colorful carpet across the steppes',
      'Perfect photography opportunities',
      'Short but spectacular season',
      'Traditional nomadic culture'
    ],
    content: `
      <h3>About Kazakhstan's Tulip Fields</h3>
      <p>Every spring, the steppes of southern Kazakhstan transform into one of the world's most spectacular natural flower displays. Wild Schrenk tulips (Tulipa schrenkii) cover vast areas with brilliant red carpets, creating scenes that rival the famous tulip fields of Holland.</p>
      
      <h3>The Blooming Season</h3>
      <p>The tulip season is brief but magnificent, typically lasting from mid-April to early May depending on weather conditions. During peak bloom, millions of wild tulips create an almost unreal landscape of color stretching to the horizon, interspersed with other wildflowers including poppies and irises.</p>
      
      <h3>Conservation and Culture</h3>
      <p>These wild tulips are ancestors of the cultivated varieties grown worldwide. The Schrenk tulip is now protected as Kazakhstan's national flower. The blooming season coincides with the arrival of spring in the nomadic calendar, making it a time of celebration in traditional Kazakh culture.</p>
    `
  }
};

export default function NatureDestinationPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const destination = destinationsData[slug as keyof typeof destinationsData];

  // Share functionality removed for now

  if (!destination) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Destination Not Found</h1>
            <p className="text-gray-600 mb-8">
              The destination you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link href="/categories/nature" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Nature
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
            src={destination.image}
            alt={destination.name}
            width={1200}
            height={453}
            className="w-full h-full object-cover"
            priority
          />
          
          {/* Strong dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
          
          {/* Title overlay with strong contrast */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <h1 className="text-4xl lg:text-6xl font-black text-white text-center leading-tight px-8 max-w-5xl" style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)'
            }}>
              {destination.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <p className="text-xl text-black mb-8 leading-relaxed">
              {destination.description}
            </p>
            
            <div 
              className="prose prose-lg max-w-none prose-headings:!text-black prose-p:!text-black prose-a:text-green-600 prose-strong:!text-black prose-li:!text-black prose-ul:!text-black prose-ol:!text-black"
              dangerouslySetInnerHTML={{ __html: destination.content }}
            />

            {/* Highlights Section */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-black mb-6">Key Highlights</h3>
              <ul className="space-y-3">
                {destination.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <Camera className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar - Information Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Destination Information</h3>
              
              <div className="space-y-6">
                {/* Location */}
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <MapPin className="h-5 w-5 mr-2 text-green-600" />
                    <span className="text-sm font-medium">Location</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{destination.location}</p>
                </div>

                {/* Best Time */}
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <svg className="h-5 w-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium">Best Time to Visit</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{destination.bestTime}</p>
                </div>

                {/* Duration */}
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <svg className="h-5 w-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium">Recommended Duration</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{destination.duration}</p>
                </div>

                {/* Difficulty */}
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <svg className="h-5 w-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-sm font-medium">Difficulty Level</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{destination.difficulty}</p>
                </div>


                {/* Plan Your Trip */}
                <div className="pt-6">
                  <Link 
                    href="/plan-your-trip"
                    className="w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Plan Your Trip to {destination.name}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Nature Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Link 
          href="/categories/nature" 
          className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Nature Destinations
        </Link>
      </div>

      <Footer />
    </div>
  );
}