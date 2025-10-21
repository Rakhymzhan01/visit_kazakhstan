'use client'

import { useEffect, useState } from 'react'
import Image from "next/image"
import Link from "next/link"
import { Button } from "./components/ui/button"
import { Card, CardContent } from "./components/ui/card"
import { Star, Instagram, Minus } from "lucide-react"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { homepageApi, blogApi } from '@/lib/api'

// Types
interface WhyVisitItem {
  title: string;
  description: string;
  image: string;
  bgColor: string;
  order: number;
}


interface Tour {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image: string;
  category: string;
  rating: number;
  date?: string;
  location?: string;
  featured: boolean;
  status: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string;
  category?: string;
  publishedAt?: string;
  createdAt: string;
}

interface Event {
  _id: string;
  name: string;
  image: string;
  category: string;
  date: string;
  order: number;
}

export default function HomePage() {
  const [expandedCards, setExpandedCards] = useState<number[]>([])
  
  // State for dynamic content
  const [heroContent, setHeroContent] = useState({ title: 'Your Next Best Trip,', subtitle: 'Return Inspired' })
  const [whyVisitItems, setWhyVisitItems] = useState<WhyVisitItem[]>([])
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([])
  const [featuredBlogs, setFeaturedBlogs] = useState<BlogPost[]>([])
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([])
  const [tourThemesContent, setTourThemesContent] = useState({ title: 'Top Tour Themes', description: 'Kazakhstan is vast and diverse — and so are the ways to experience it. Whether you\'re chasing landscapes, culture, adventure, or spiritual meaning, there\'s a route for every traveler.' })
  const [, setLoading] = useState(true)

  const toggleCard = (index: number) => {
    setExpandedCards(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  // Load dynamic content
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        
        // Start with empty array
        setWhyVisitItems([]);

        try {
          console.log('Fetching homepage content from API...');
          const homepageResponse = await homepageApi.getPublicHomepageContent();
          console.log('Homepage response:', homepageResponse);
          
          if (homepageResponse.data.success && homepageResponse.data.data) {
            const data = homepageResponse.data.data;
            console.log('Homepage data:', data);
            
            // Set hero content from database
            if (data.hero) {
              console.log('SUCCESS: Setting hero content from database:', data.hero);
              setHeroContent({
                title: data.hero.title || 'Your Next Best Trip,',
                subtitle: data.hero.subtitle || 'Return Inspired'
              });
            }
            
            if (data.whyVisit?.features && data.whyVisit.features.length > 0) {
              console.log('SUCCESS: Setting features from database:', data.whyVisit.features);
              setWhyVisitItems(data.whyVisit.features.sort((a: WhyVisitItem, b: WhyVisitItem) => a.order - b.order));
            } else {
              console.log('No features found in database data');
              setWhyVisitItems([]);
            }
          } else {
            console.log('No content in database, keeping empty');
            setWhyVisitItems([]);
          }
        } catch (error) {
          console.error('Error fetching homepage content:', error);
          console.log('API error, keeping empty');
          setWhyVisitItems([]);
        }
        
        // Load tour themes from homepage content
        try {
          const homepageToursResponse = await homepageApi.getPublicHomepageContent();
          if (homepageToursResponse.data.success && homepageToursResponse.data.data?.tourThemes) {
            const tourThemes = homepageToursResponse.data.data.tourThemes;
            console.log('🏠 Homepage Tour Themes:', tourThemes);
            
            // Set tour themes title and description
            if (tourThemes.title || tourThemes.description) {
              setTourThemesContent({
                title: tourThemes.title || 'Top Tour Themes',
                description: tourThemes.description || 'Kazakhstan is vast and diverse — and so are the ways to experience it. Whether you\'re chasing landscapes, culture, adventure, or spiritual meaning, there\'s a route for every traveler.'
              });
            }
            
            // Set tour themes tours
            if (tourThemes.tours && tourThemes.tours.length > 0) {
              const sortedTours = tourThemes.tours.sort((a: { order: number }, b: { order: number }) => a.order - b.order);
              setFeaturedTours(sortedTours);
            }
          }
        } catch (error) {
          console.error('Error loading tour themes:', error);
        }
        
        // Load featured blog posts
        try {
          const blogsResponse = await blogApi.getBlogs({ featured: true, limit: 4, status: 'PUBLISHED' });
          if (blogsResponse.data.success && blogsResponse.data.data?.blogs) {
            setFeaturedBlogs(blogsResponse.data.data.blogs);
          }
        } catch (error) {
          console.error('Error loading featured blogs:', error);
        }
        
        // Load featured events from homepage content
        try {
          console.log('Getting events from homepage data...');
          const homepageResponse = await homepageApi.getPublicHomepageContent();
          if (homepageResponse.data.success && homepageResponse.data.data?.events?.eventList) {
            console.log('Events found in homepage:', homepageResponse.data.data.events.eventList);
            setFeaturedEvents(homepageResponse.data.data.events.eventList.sort((a: { order: number }, b: { order: number }) => a.order - b.order));
          }
        } catch (error) {
          console.error('Error loading featured events:', error);
        }
        
      } catch (error) {
        console.error('Error loading homepage content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[610px] bg-cover bg-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover absolute inset-0"
        >
          <source src="./2496349_Mountain_Water_1920x1080.mp4" type="video/mp4" />
          <source src="/hero-video.webm" type="video/webm" />
          <Image
            src="/image.png"
            alt="Kazakhstan Landscape"
            width={1200}
            height={400}
            className="w-full h-full object-cover absolute inset-0"
          />
        </video>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0">
          <div 
            className="text-white z-10 absolute px-4 sm:px-6 lg:px-0"
            style={{
              width: 'calc(100% - 32px)',
              maxWidth: '504px',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600,
              fontSize: 'clamp(24px, 5vw, 40px)',
              lineHeight: '100%',
              letterSpacing: '-3%',
              opacity: 1,
              textAlign: 'center'
            }}
          >
            <h1>{heroContent.title}</h1>
            <h1>{heroContent.subtitle}</h1>
          </div>
        </div>
      </section>

      {/* Why Visit Kazakhstan - Dynamic */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 sm:mb-8 text-center sm:text-left">
            <span className="text-[#202020]" style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(24px, 6vw, 48px)',
              lineHeight: '100%',
              letterSpacing: '-4%'
            }}>Why</span> <span 
              className="bg-gradient-to-r from-[#009CBC] to-[#FFE700] bg-clip-text text-transparent"
              style={{
                background: 'linear-gradient(90deg, #009CBC 0%, #FFE700 154.07%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 400,
                fontSize: 'clamp(24px, 6vw, 48px)',
                lineHeight: '100%',
                letterSpacing: '-4%'
              }}
            >Visit Kazakhstan</span>
          </h2>

          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 sm:gap-6 pb-4" style={{ width: 'max-content' }}>
              {whyVisitItems.map((item, index) => {
                const isExpanded = expandedCards.includes(index)
                return (
                  <Card key={index} className="relative overflow-hidden group cursor-pointer flex-shrink-0 p-0 border-0" style={{
                    width: 'clamp(280px, 80vw, 384px)',
                    height: 'clamp(400px, 70vh, 500px)',
                    justifyContent: 'space-between',
                    transform: 'rotate(0deg)',
                    opacity: 1,
                    borderRadius: '8px'
                  }}>
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      width={384}
                      height={500}
                      className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${isExpanded ? 'scale-90' : 'scale-100'}`}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-b from-black/70 to-transparent transition-opacity duration-500 ${isExpanded ? 'opacity-0' : 'opacity-100'}`}></div>
                    <div className={`absolute inset-0 transition-all duration-500 ${isExpanded ? 'bg-[#009CBC] opacity-90' : 'bg-transparent opacity-0'}`}></div>
                    
                    <div className="absolute top-10 left-10 right-10 text-white z-20">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      {isExpanded && (
                        <p className="text-sm mt-4 opacity-90 transition-all duration-500 animate-in slide-in-from-top-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={() => toggleCard(index)}
                      className="absolute bottom-10 right-10 hover:bg-white/90 border-0 z-20 flex justify-center items-center p-0 transition-all duration-300 hover:scale-105"
                      style={{
                        width: '50px',
                        height: '50px',
                        transform: 'rotate(0deg)',
                        opacity: 1,
                        borderRadius: '999px',
                        background: '#FFFFFF'
                      }}
                    >
                      {isExpanded ? (
                        <Minus 
                          className="text-[#009CBC]"
                          style={{
                            width: '24px',
                            height: '24px'
                          }}
                          strokeWidth={2}
                        />
                      ) : (
                        <div
                          className="relative"
                          style={{
                            width: '30px',
                            height: '30px'
                          }}
                        >
                          <div
                            className="absolute"
                            style={{
                              width: '21px',
                              height: '21px',
                              transform: 'rotate(0deg)',
                              opacity: 1,
                              top: '4.5px',
                              left: '4.5px'
                            }}
                          >
                            <div
                              className="absolute"
                              style={{
                                left: '45%',
                                right: '45%',
                                top: '15%',
                                bottom: '15%',
                                background: '#009CBC'
                              }}
                            />
                            <div
                              className="absolute"
                              style={{
                                left: '15%',
                                right: '15%',
                                top: '45%',
                                bottom: '45%',
                                background: '#009CBC'
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </Button>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Top Tour Themes - Dynamic from Database */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6 sm:mb-8 space-y-6 lg:space-y-0">
            <h2 className="text-center sm:text-left">
              <span className="text-[#202020]" style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(24px, 6vw, 48px)',
                lineHeight: '100%',
                letterSpacing: '-4%'
              }}>{tourThemesContent.title.split(' ').slice(0, -1).join(' ')}</span> <span 
                className="bg-gradient-to-r from-[#009CBC] to-[#FFE700] bg-clip-text text-transparent"
                style={{
                  background: 'linear-gradient(90deg, #009CBC 0%, #FFE700 154.07%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 400,
                  fontSize: 'clamp(24px, 6vw, 48px)',
                  lineHeight: '100%',
                  letterSpacing: '-4%'
                }}
              >{tourThemesContent.title.split(' ').slice(-1)[0]}</span>
            </h2>
            <div className="text-center lg:text-left lg:max-w-md">
              <p className="text-sm sm:text-base mb-4" style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 400,
                lineHeight: '150%',
                letterSpacing: '-1%',
                color: '#333333'
              }}>
                {tourThemesContent.description}
              </p>
              
              <Link href="/tours">
                <Button
                  className="border-0 hover:bg-white hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md w-full sm:w-auto"
                  style={{
                    height: '50px',
                    paddingTop: '13px',
                    paddingRight: '26px',
                    paddingBottom: '13px',
                    paddingLeft: '26px',
                    gap: '10px',
                    borderRadius: '99px',
                    background: '#FFFFFF',
                    color: '#009CBC',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  Show all tours
                </Button>
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 sm:gap-6 pb-4" style={{ width: 'max-content' }}>
              {featuredTours.length > 0 ? featuredTours.map((tour, index) => (
                <Card key={tour.title || index} className="relative overflow-hidden flex-shrink-0 border-0 p-2 shadow-md hover:shadow-lg transition-shadow duration-200" style={{
                  width: 'clamp(280px, 80vw, 384px)',
                  height: 'clamp(400px, auto, 506px)'
                }}>
                    <div className="relative">
                      <img
                        src={tour.image || '/tours.jpg'}
                        alt={tour.title}
                        className="w-full object-cover rounded-lg"
                        style={{
                          width: '368px',
                          height: '260px'
                        }}
                        onError={(e) => {
                          console.error(`❌ Homepage image failed to load for ${tour.title}:`, tour.image);
                          (e.target as HTMLImageElement).src = '/tours.jpg';
                        }}
                        onLoad={() => {
                          console.log(`✅ Homepage image loaded successfully for ${tour.title}:`, tour.image);
                        }}
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <div className="flex items-center bg-black/80 text-white px-3 py-1.5 rounded-md">
                          <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium">{tour.date || '20 may 2025'}</span>
                        </div>
                        {tour.location && (
                          <div className="flex items-center bg-black/80 text-white px-3 py-1.5 rounded-md">
                            <span className="text-sm font-medium">{tour.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <CardContent className="px-4 pt-4 pb-16 flex flex-col">
                      <h3 className="mb-2 text-[#202020]" style={{
                        fontFamily: 'Manrope, sans-serif',
                        fontWeight: 600,
                        fontSize: '24px',
                        lineHeight: '100%',
                        letterSpacing: '-2%'
                      }}>{tour.title}</h3>
                      <p className="text-gray-600 mb-6 line-clamp-3 flex-grow" style={{
                        fontFamily: 'Manrope, sans-serif',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '24px',
                        letterSpacing: '-1%'
                      }}>{tour.description}</p>
                    </CardContent>
                    
                    {/* Explore tours link - positioned to align with stars visually */}
                    <div className="absolute bottom-[15px] left-[27px] flex items-center">
                      <Link href="/tours">
                        <Button variant="link" className="text-[#009CBC] hover:text-[#007a9a] p-0 text-sm">
                          Explore tours →
                        </Button>
                      </Link>
                    </div>
                    
                    {/* Star rating - positioned exactly 27px from right and bottom edges of card */}
                    <div className="absolute bottom-[27px] right-[27px] flex">
                      {Array.from({ length: tour.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </Card>
              )) : null
            }
            </div>
          </div>
        </div>
      </section>

      {/* Discover Cities - Static (can stay as is) */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 sm:mb-8 text-center sm:text-left">
            <span className="text-[#202020]" style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(24px, 6vw, 48px)',
              lineHeight: '100%',
              letterSpacing: '-4%'
            }}>Discover</span> <span 
              className="bg-gradient-to-r from-[#009CBC] to-[#FFE700] bg-clip-text text-transparent"
              style={{
                background: 'linear-gradient(90deg, #009CBC 0%, #FFE700 154.07%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 400,
                fontSize: 'clamp(24px, 6vw, 48px)',
                lineHeight: '100%',
                letterSpacing: '-4%'
              }}
            >Cities</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="text-center lg:text-left">
              <p className="text-gray-600 mb-6 text-sm sm:text-base" style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 400,
                lineHeight: '150%',
                letterSpacing: '-1%'
              }}>
                Kazakhstan&apos;s cities reflect the country&apos;s past, present, and future — from ancient Silk Road stops to
                futuristic capitals, sleepy desert towns to cultural and academic centers. Each has its own character,
                rhythm, and reason to explore.
              </p>
              <Link href="/categories/cities">
                <Button 
                  className="bg-[#009CBC] hover:bg-[#007a9a] text-white border-0 hover:scale-105 transition-all duration-200 w-full sm:w-auto"
                  style={{
                    height: '50px',
                    borderRadius: '99px',
                    padding: '0 24px'
                  }}
                >
                  Discover
                </Button>
              </Link>
            </div>

            <div className="relative order-first lg:order-last">
              {/* Interactive Kazakhstan Vector Map */}
              <div className="w-full max-w-md mx-auto lg:max-w-none h-[300px] bg-gray-50 rounded-lg flex items-center justify-center p-4">
                <div className="relative w-full h-full flex items-center justify-center">
                  <svg 
                    width="100%" 
                    height="100%" 
                    viewBox="0 0 640 348" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="max-w-full max-h-full"
                  >
                    {/* Kazakhstan main territory */}
                    <path 
                      d="M383.443 313.276L374.494 317.155L353.916 331.673L347.088 346.414L341.279 346.547L337 336.803L317.161 336.136L313.984 319.113L306.382 318.969L307.545 297.817L288.87 282.197L262.11 283.878L243.813 286.999L228.911 267.534L216.145 259.276L191.961 243.489L189.045 241.564L148.879 254.624L149.497 333.237L141.489 334.249L130.571 317.934L120.026 312.057L102.313 316.426L95.4187 323.381L94.5451 318.29L98.3794 309.536L95.402 302.18L77.3225 294.94L70.2773 275.664L61.6633 270.183L61.1457 263.082L76.3209 265.158L76.9217 249.115L90.1879 245.52L103.821 248.825L106.632 227.084L103.849 213.094L88.2349 214.196L74.9685 208.637L56.9056 218.637L42.3481 223.372L34.4239 219.722L36.01 208.025L26.066 192.666L14.4859 193.312L1.24182 177.525L10.2454 159.634L5.68775 154.771L18.1418 128.227L34.1848 142.317L36.1269 124.549L68.3352 97.5654L92.7087 96.9145L127.099 114.176L145.573 124.142L162.129 113.748L186.864 113.252L206.819 126.007L211.354 118.717L233.268 119.78L237.18 108.061L211.894 90.8266L226.868 78.4563L223.947 71.4781L238.927 64.7782L227.664 46.9267L234.815 37.9229L293.2 28.6688L300.818 22.0468L339.86 12.0803L353.888 0.772949L381.929 6.66032L386.842 34.5508L403.13 28.0678L423.169 37.144L421.878 51.5175L436.842 50.0261L475.945 25.0184L470.235 33.3877L490.146 53.7489L525.009 118.166L533.323 105.184L554.819 119.457L577.239 113.113L585.853 117.56L593.36 131.727L604.267 136.446L610.911 146.702L631.011 143.48L639.286 158.137L627.411 173.891L614.451 176.084L613.71 199.377L605.029 209.728L574.078 202.199L562.821 242.61L554.836 247.54L523.924 256.343L537.969 293.927L527.262 299.464L528.509 311.512L518.899 308.424L511.069 300.828L487.92 298.607L462.05 298.023L456.379 300.366L434.16 291.412L425.3 295.831L422.88 308.334L397.204 301.05L386.937 304.038L383.443 313.276Z" 
                      fill="#B7C6B4" 
                      stroke="#ffffff" 
                      strokeWidth="1" 
                      className="transition-colors cursor-pointer"
                    />
                    
                    {/* City Labels - Positioned based on actual lat/lon coordinates within map bounds */}
                    <g style={{ fontFamily: 'Inter, Segoe UI, system-ui, -apple-system, sans-serif' }}>
                      {/* Petropavl - lat: 54.8667, lon: 69.15 */}
                      <rect x="350" y="37" width="80" height="32" rx="16" fill="#ffffff" stroke="none"/>
                      <text x="390" y="58" fontSize="14" fill="#000000" fontWeight="500" textAnchor="middle">
                        Petropavl
                      </text>
                      
                      {/* Qostanai - lat: 53.2144, lon: 63.6246 */}
                      <rect x="233" y="66" width="70" height="32" rx="16" fill="#ffffff" stroke="none"/>
                      <text x="268" y="87" fontSize="14" fill="#000000" fontWeight="500" textAnchor="middle">
                        Qostanai
                      </text>
                      
                      {/* Oral - lat: 51.2333, lon: 51.3667 */}
                      <rect x="71" y="105" width="50" height="32" rx="16" fill="#ffffff" stroke="none"/>
                      <text x="96" y="126" fontSize="14" fill="#000000" fontWeight="500" textAnchor="middle">
                        Oral
                      </text>
                      
                      {/* Pavlodar - lat: 52.3, lon: 76.95 */}
                      <rect x="459" y="81" width="70" height="32" rx="16" fill="#ffffff" stroke="none"/>
                      <text x="494" y="102" fontSize="14" fill="#000000" fontWeight="500" textAnchor="middle">
                        Pavlodar
                      </text>
                      
                      {/* Astana - lat: 51.1694, lon: 71.4491 - CAPITAL, wider label */}
                      <rect x="385" y="108" width="80" height="32" rx="16" fill="#ffffff" stroke="none"/>
                      <text x="425" y="129" fontSize="14" fill="#000000" fontWeight="500" textAnchor="middle">
                        Astana
                      </text>
                      
                      {/* Aktobe - lat: 50.2839, lon: 57.1669 */}
                      <rect x="157" y="126" width="60" height="32" rx="16" fill="#ffffff" stroke="none"/>
                      <text x="187" y="147" fontSize="14" fill="#000000" fontWeight="500" textAnchor="middle">
                        Aktobe
                      </text>
                      
                      {/* Semey - lat: 50.4111, lon: 80.2275 - label ABOVE dot */}
                      <rect x="474" y="98" width="60" height="32" rx="16" fill="#ffffff" stroke="none"/>
                      <text x="504" y="119" fontSize="14" fill="#000000" fontWeight="500" textAnchor="middle">
                        Semey
                      </text>
                      
                      {/* Oskemen - lat: 49.9789, lon: 82.6144 */}
                      <rect x="556" y="132" width="70" height="32" rx="16" fill="#ffffff" stroke="none"/>
                      <text x="591" y="153" fontSize="14" fill="#000000" fontWeight="500" textAnchor="middle">
                        Oskemen
                      </text>
                      
                      {/* Karagandy - lat: 49.8047, lon: 73.1094 */}
                      <rect x="405" y="134" width="80" height="32" rx="16" fill="#ffffff" stroke="none"/>
                      <text x="445" y="155" fontSize="14" fill="#000000" fontWeight="500" textAnchor="middle">
                        Karagandy
                      </text>
                      
                      {/* Atyrau - lat: 47.1164, lon: 51.8833 */}
                      <rect x="79" y="188" width="55" height="32" rx="16" fill="#ffffff" stroke="none"/>
                      <text x="106" y="209" fontSize="14" fill="#000000" fontWeight="500" textAnchor="middle">
                        Atyrau
                      </text>
                      
                      {/* Qyzylorda - lat: 44.8479, lon: 65.5093 */}
                      <rect x="291" y="235" width="80" height="32" rx="16" fill="#ffffff" stroke="none"/>
                      <text x="331" y="256" fontSize="14" fill="#000000" fontWeight="500" textAnchor="middle">
                        Qyzylorda
                      </text>
                      
                      {/* Aktau - lat: 43.65, lon: 51.2 */}
                      <rect x="61" y="254" width="55" height="32" rx="16" fill="#ffffff" stroke="none"/>
                      <text x="88" y="275" fontSize="14" fill="#000000" fontWeight="500" textAnchor="middle">
                        Aktau
                      </text>
                      
                      {/* SOUTHERN CLUSTER - Strategic positioning */}
                      
                      {/* Turkistan - lat: 43.2978, lon: 68.2517 - label LEFT of dot */}
                      <rect x="280" y="260" width="75" height="32" rx="16" fill="#ffffff" stroke="none"/>
                      <text x="317" y="281" fontSize="14" fill="#000000" fontWeight="500" textAnchor="middle">
                        Turkistan
                      </text>
                      
                      {/* Taraz - lat: 42.9, lon: 71.3667 - label RIGHT of dot */}
                      <rect x="405" y="264" width="50" height="32" rx="16" fill="#ffffff" stroke="none"/>
                      <text x="430" y="285" fontSize="14" fill="#000000" fontWeight="500" textAnchor="middle">
                        Taraz
                      </text>
                      
                      {/* Shymkent - lat: 42.315, lon: 69.5901 - label BELOW dot */}
                      <rect x="324" y="305" width="80" height="32" rx="16" fill="#ffffff" stroke="none"/>
                      <text x="364" y="326" fontSize="14" fill="#000000" fontWeight="500" textAnchor="middle">
                        Shymkent
                      </text>
                      
                      {/* Almaty - lat: 43.2567, lon: 76.9286 - label RIGHT of dot */}
                      <rect x="482" y="259" width="60" height="32" rx="16" fill="#ffffff" stroke="none"/>
                      <text x="512" y="280" fontSize="14" fill="#000000" fontWeight="500" textAnchor="middle">
                        Almaty
                      </text>
                    </g>
                    
                    {/* City markers - Positioned using real lat/lon coordinates within actual map bounds */}
                    <g style={{ zIndex: 10 }}>
                      {/* Petropavl - lat: 54.8667, lon: 69.15 */}
                      <circle cx="330" cy="49" r="5" fill="#00FFB3" className="cursor-pointer hover:fill-cyan-300 transition-colors">
                        <title>Petropavl</title>
                      </circle>
                      
                      {/* Qostanai - lat: 53.2144, lon: 63.6246 */}
                      <circle cx="213" cy="78" r="5" fill="#00FFB3" className="cursor-pointer hover:fill-cyan-300 transition-colors">
                        <title>Qostanai</title>
                      </circle>
                      
                      {/* Oral - lat: 51.2333, lon: 51.3667 */}
                      <circle cx="51" cy="117" r="5" fill="#00FFB3" className="cursor-pointer hover:fill-cyan-300 transition-colors">
                        <title>Oral</title>
                      </circle>
                      
                      {/* Pavlodar - lat: 52.3, lon: 76.95 */}
                      <circle cx="439" cy="93" r="5" fill="#00FFB3" className="cursor-pointer hover:fill-cyan-300 transition-colors">
                        <title>Pavlodar</title>
                      </circle>
                      
                      {/* Astana - lat: 51.1694, lon: 71.4491 - Capital */}
                      <circle cx="365" cy="120" r="6" fill="#00FFB3" className="cursor-pointer hover:fill-cyan-300 transition-colors">
                        <title>Astana - Capital</title>
                      </circle>
                      
                      {/* Aktobe - lat: 50.2839, lon: 57.1669 */}
                      <circle cx="137" cy="138" r="5" fill="#00FFB3" className="cursor-pointer hover:fill-cyan-300 transition-colors">
                        <title>Aktobe</title>
                      </circle>
                      
                      {/* Semey - lat: 50.4111, lon: 80.2275 */}
                      <circle cx="454" cy="130" r="5" fill="#00FFB3" className="cursor-pointer hover:fill-cyan-300 transition-colors">
                        <title>Semey</title>
                      </circle>
                      
                      {/* Oskemen - lat: 49.9789, lon: 82.6144 */}
                      <circle cx="536" cy="144" r="5" fill="#00FFB3" className="cursor-pointer hover:fill-cyan-300 transition-colors">
                        <title>Oskemen</title>
                      </circle>
                      
                      {/* Karagandy - lat: 49.8047, lon: 73.1094 */}
                      <circle cx="385" cy="146" r="5" fill="#00FFB3" className="cursor-pointer hover:fill-cyan-300 transition-colors">
                        <title>Karagandy</title>
                      </circle>
                      
                      {/* Atyrau - lat: 47.1164, lon: 51.8833 */}
                      <circle cx="59" cy="200" r="5" fill="#00FFB3" className="cursor-pointer hover:fill-cyan-300 transition-colors">
                        <title>Atyrau</title>
                      </circle>
                      
                      {/* Qyzylorda - lat: 44.8479, lon: 65.5093 */}
                      <circle cx="271" cy="247" r="5" fill="#00FFB3" className="cursor-pointer hover:fill-cyan-300 transition-colors">
                        <title>Qyzylorda</title>
                      </circle>
                      
                      {/* Aktau - lat: 43.65, lon: 51.2 */}
                      <circle cx="41" cy="266" r="5" fill="#00FFB3" className="cursor-pointer hover:fill-cyan-300 transition-colors">
                        <title>Aktau</title>
                      </circle>
                      
                      {/* Turkistan - lat: 43.2978, lon: 68.2517 */}
                      <circle cx="360" cy="272" r="5" fill="#00FFB3" className="cursor-pointer hover:fill-cyan-300 transition-colors">
                        <title>Turkistan</title>
                      </circle>
                      
                      {/* Almaty - lat: 43.2567, lon: 76.9286 */}
                      <circle cx="462" cy="271" r="5" fill="#00FFB3" className="cursor-pointer hover:fill-cyan-300 transition-colors">
                        <title>Almaty</title>
                      </circle>
                      
                      {/* Taraz - lat: 42.9, lon: 71.3667 */}
                      <circle cx="385" cy="276" r="5" fill="#00FFB3" className="cursor-pointer hover:fill-cyan-300 transition-colors">
                        <title>Taraz</title>
                      </circle>
                      
                      {/* Shymkent - lat: 42.315, lon: 69.5901 */}
                      <circle cx="364" cy="289" r="5" fill="#00FFB3" className="cursor-pointer hover:fill-cyan-300 transition-colors">
                        <title>Shymkent</title>
                      </circle>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-start" style={{ marginTop: '-20px' }}>
            <Card className="relative overflow-hidden w-full max-w-xs sm:max-w-sm border-0 shadow-none">
              <Image
                src="/turkestan.jpg"
                alt="Turkestan"
                width={384}
                height={271}
                className="w-full object-cover"
                style={{ width: '384px', height: '271px' }}
              />
              {/* Turkestan title - bottom left */}
              <div className="absolute text-white" style={{ bottom: '20px', left: '20px' }}>
                <h3 style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 600,
                  fontSize: '24px',
                  lineHeight: '130%',
                  letterSpacing: '-2%'
                }}>Turkestan</h3>
              </div>
              
              {/* Weather info - bottom right with black transparent bg */}
              <div 
                className="absolute text-white px-3 py-2 rounded-md"
                style={{
                  background: '#00000080',
                  backdropFilter: 'blur(20px)',
                  bottom: '20px',
                  right: '20px'
                }}
              >
                <div className="flex items-center gap-2">
                  <span style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 600,
                    fontSize: '24px',
                    lineHeight: '100%',
                    letterSpacing: '-2%'
                  }}>31°</span>
                  <div className="flex flex-col">
                    <span style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontWeight: 400,
                      fontSize: '10px',
                      lineHeight: '150%',
                      letterSpacing: '-1%'
                    }}>понедельник 12:00</span>
                    <span style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontWeight: 400,
                      fontSize: '10px',
                      lineHeight: '150%',
                      letterSpacing: '-1%'
                    }}>Ясно, солнечно</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-8 sm:py-12 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">
            <div className="text-center lg:text-left lg:max-w-md">
              <h2 className="mb-4">
                <span 
                  className="bg-gradient-to-r from-[#009CBC] to-[#FFE700] bg-clip-text text-transparent"
                  style={{
                    background: 'linear-gradient(90deg, #009CBC 0%, #FFE700 154.07%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 400,
                    fontSize: 'clamp(24px, 6vw, 48px)',
                    lineHeight: '100%',
                    letterSpacing: '-4%'
                  }}
                >@into.kazakhstan</span>
              </h2>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Kazakhstan is vast and diverse — and so are the ways to experience it. Whether you&apos;re chasing
                landscapes, culture, adventure, or spiritual meaning, there&apos;s a route for every traveler.
              </p>
              <Button 
                className="bg-white hover:bg-gray-50 text-[#009CBC] border-0 hover:scale-105 transition-all duration-200 w-full sm:w-auto"
                style={{
                  height: '50px',
                  borderRadius: '99px',
                  padding: '0 24px'
                }}
              >
                See Instagram
              </Button>
            </div>

            <div className="flex-1">
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-4 sm:gap-6 pb-4" style={{ width: 'max-content' }}>
                  {[
                    { image: "/nomad_girls.png", alt: "Nomad girls" },
                    { image: "/desert.jpg", alt: "Desert landscape" },
                    { image: "/yurta.jpg", alt: "Traditional yurt" }
                  ].map((post, index) => (
                    <div key={index} className="relative flex-shrink-0" style={{ 
                      width: 'clamp(200px, 50vw, 282px)', 
                      height: 'clamp(200px, 50vw, 282px)' 
                    }}>
                      <Image
                        src={post.image}
                        alt={post.alt}
                        width={282}
                        height={282}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <Instagram className="absolute top-3 left-3 w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section - Dynamic from Database */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            <h2 className="text-center sm:text-left">
              <span 
                className="bg-gradient-to-r from-[#009CBC] to-[#FFE700] bg-clip-text text-transparent"
                style={{
                  background: 'linear-gradient(90deg, #009CBC 0%, #FFE700 154.07%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 400,
                  fontSize: 'clamp(24px, 6vw, 48px)',
                  lineHeight: '100%',
                  letterSpacing: '-4%'
                }}
              >Blog</span>
            </h2>
            <Link href="/blog" className="flex justify-center sm:justify-start">
              <Button 
                className="bg-white hover:bg-gray-50 text-[#009CBC] border-0 hover:scale-105 transition-all duration-200 w-full sm:w-auto"
                style={{
                  height: '50px',
                  borderRadius: '99px',
                  padding: '0 24px'
                }}
              >
                Show all blogs
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 sm:gap-6 pb-4" style={{ width: 'max-content' }}>
              {featuredBlogs.length > 0 ? featuredBlogs.map((post) => (
                <Card key={post.id} className="relative overflow-hidden flex-shrink-0 p-2 flex flex-col border-0" style={{ 
                  width: 'clamp(280px, 80vw, 384px)', 
                  height: 'clamp(400px, auto, 506px)' 
                }}>
                  <div className="relative">
                    <Image
                      src={post.featuredImage || "/placeholder.svg"}
                      alt={post.title}
                      width={368}
                      height={260}
                      className="w-full object-cover rounded-lg"
                      style={{ width: '368px', height: '260px' }}
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <div className="flex items-center bg-black/80 text-white px-3 py-1.5 rounded-md">
                        <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium">{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center bg-black/80 text-white px-3 py-1.5 rounded-md">
                        <span className="text-sm font-medium">{post.category || 'Blog'}</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="px-4 pt-4 pb-16 flex flex-col flex-1">
                    <h3 className="mb-2 text-[#202020]" style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontWeight: 600,
                      fontSize: '24px',
                      lineHeight: '100%',
                      letterSpacing: '-2%'
                    }}>{post.title}</h3>
                    <p className="text-gray-600 mb-3 flex-1" style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '24px',
                      letterSpacing: '-1%'
                    }}>
                      {post.excerpt || post.title}
                    </p>
                  </CardContent>
                  
                  {/* Read more link - positioned exactly 27px from left and bottom edges of card */}
                  <div className="absolute bottom-[15px] left-[27px]">
                    <Link href={`/blog/${post.slug}`}>
                      <Button variant="link" className="text-[#009CBC] hover:text-[#007a9a] p-0 text-sm">
                        Read more →
                      </Button>
                    </Link>
                  </div>
                </Card>
              )) : null
            }
            </div>
          </div>
        </div>
      </section>

      {/* Explore Events - Dynamic from Database */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6 sm:mb-8 space-y-6 lg:space-y-0">
            <h2 className="text-center sm:text-left">
              <span className="text-[#202020]" style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(24px, 6vw, 48px)',
                lineHeight: '100%',
                letterSpacing: '-4%'
              }}>Explore</span> <span 
                className="bg-gradient-to-r from-[#009CBC] to-[#FFE700] bg-clip-text text-transparent"
                style={{
                  background: 'linear-gradient(90deg, #009CBC 0%, #FFE700 154.07%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 400,
                  fontSize: 'clamp(24px, 6vw, 48px)',
                  lineHeight: '100%',
                  letterSpacing: '-4%'
                }}
              >Events</span>
            </h2>
            <div className="text-center lg:text-left lg:max-w-md">
              <p className="text-gray-600 text-sm sm:text-base mb-4">
                Kazakhstan is vast and diverse — and so are the ways to experience it. Whether you&apos;re chasing
                landscapes, culture, adventure, or spiritual meaning, there&apos;s a route for every traveler.
              </p>
              <Link href="/events">
                <Button 
                  className="bg-white hover:bg-gray-50 text-[#009CBC] border-0 hover:scale-105 transition-all duration-200 w-full sm:w-auto"
                  style={{
                    height: '50px',
                    borderRadius: '99px',
                    padding: '0 24px'
                  }}
                >
                  Show all Events
                </Button>
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 sm:gap-6 pb-4" style={{ width: 'max-content' }}>
              {featuredEvents.length > 0 ? featuredEvents.map((event) => (
                <Card key={event._id} className="relative overflow-hidden flex-shrink-0 border-0" style={{ 
                  width: 'clamp(280px, 80vw, 384px)', 
                  height: 'clamp(300px, 60vh, 400px)' 
                }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                  <Image
                    src={event.image || "/placeholder.svg"}
                    alt={event.name || "Featured event"}
                    width={384}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 z-20 flex gap-2">
                    <div className="flex items-center bg-black/80 text-white px-3 py-1.5 rounded-md">
                      <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center bg-black/80 text-white px-3 py-1.5 rounded-md">
                      <span className="text-sm font-medium">{event.category}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white z-20">
                    <h3 className="text-lg font-semibold">{event.name}</h3>
                  </div>
                </Card>
              )) : null
            }
            </div>
          </div>
        </div>
      </section>

      {/* For Investors */}
      <section className="py-8 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-lg overflow-hidden" style={{ height: 'clamp(180px, 30vh, 240px)' }}>
            <Image
              src="/expo.jpg?height=240&width=1360"
              alt="City aerial view"
              width={1360}
              height={240}
              className="object-cover rounded-lg w-full h-full"
            />
            <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
            <div className="absolute inset-0 flex flex-col sm:flex-row justify-center sm:justify-between items-center px-4 sm:px-8 z-10 gap-4 sm:gap-0">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white text-center sm:text-left">
                For <span className="text-[#009CBC]">Investors</span>
              </h2>
              <Link href="/for-investors">
                <Button className="bg-white text-gray-900 hover:bg-gray-100 rounded-full w-full sm:w-auto px-6">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Static */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            {/* Left side - About content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex justify-center lg:justify-start items-center mb-6">
                <Image
                  src="/Logo 2.png"
                  alt="Visit Kazakhstan"
                  width={120}
                  height={40}
                  className="h-8 sm:h-10 w-auto"
                />
              </div>
              <h2 className="mb-6">
                <span className="text-[#202020]" style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 700,
                  fontSize: 'clamp(24px, 6vw, 48px)',
                  lineHeight: '100%',
                  letterSpacing: '-4%'
                }}>About</span> <span 
                  className="bg-gradient-to-r from-[#009CBC] to-[#FFE700] bg-clip-text text-transparent"
                  style={{
                    background: 'linear-gradient(90deg, #009CBC 0%, #FFE700 154.07%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 400,
                    fontSize: 'clamp(24px, 6vw, 48px)',
                    lineHeight: '100%',
                    letterSpacing: '-4%'
                  }}
                >us</span>
              </h2>
              <p className="text-gray-600 mb-6 text-sm sm:text-base" style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 400,
                lineHeight: '150%',
                letterSpacing: '-1%'
              }}>
                Kazakhstan is vast and diverse — and so are the ways to experience it. Whether you&apos;re chasing
                landscapes, culture, adventure, or spiritual meaning, there&apos;s a route for every traveler.
              </p>
              <Button 
                className="text-[#009CBC] hover:text-[#007a9a] border-0 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md w-full sm:w-auto"
                style={{
                  height: '50px',
                  borderRadius: '99px',
                  background: '#FFFFFF',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                  padding: '0 24px'
                }}
              >
                Read more
              </Button>
            </div>

            {/* Right side - Statistics boxes */}
            <div className="w-full lg:w-auto lg:max-w-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <div className="text-[#009CBC] mb-3 font-montserrat" style={{
                    fontWeight: 600,
                    fontSize: 'clamp(32px, 8vw, 50px)',
                    lineHeight: '100%',
                    letterSpacing: '-4%'
                  }}>2010</div>
                  <p className="text-gray-600 font-manrope text-sm sm:text-base" style={{
                    fontWeight: 400,
                    lineHeight: '150%',
                    letterSpacing: '-1%'
                  }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 sm:mt-8">
                  <div className="text-[#009CBC] mb-3 font-montserrat" style={{
                    fontWeight: 600,
                    fontSize: 'clamp(32px, 8vw, 50px)',
                    lineHeight: '100%',
                    letterSpacing: '-4%'
                  }}>50+</div>
                  <p className="text-gray-600 font-manrope text-sm sm:text-base" style={{
                    fontWeight: 400,
                    lineHeight: '150%',
                    letterSpacing: '-1%'
                  }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 sm:mt-16">
                  <div className="text-[#009CBC] mb-3 font-montserrat" style={{
                    fontWeight: 600,
                    fontSize: 'clamp(32px, 8vw, 50px)',
                    lineHeight: '100%',
                    letterSpacing: '-4%'
                  }}>1000+</div>
                  <p className="text-gray-600 font-manrope text-sm sm:text-base" style={{
                    fontWeight: 400,
                    lineHeight: '150%',
                    letterSpacing: '-1%'
                  }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 sm:mt-24">
                  <div className="text-[#009CBC] mb-3 font-montserrat" style={{
                    fontWeight: 600,
                    fontSize: 'clamp(32px, 8vw, 50px)',
                    lineHeight: '100%',
                    letterSpacing: '-4%'
                  }}>20</div>
                  <p className="text-gray-600 font-manrope text-sm sm:text-base" style={{
                    fontWeight: 400,
                    lineHeight: '150%',
                    letterSpacing: '-1%'
                  }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}