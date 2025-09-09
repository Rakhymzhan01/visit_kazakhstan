'use client'

import Image from "next/image"
import Link from "next/link"
import { Button } from "./components/ui/button"
import { Card, CardContent } from "./components/ui/card"
import { Badge } from "./components/ui/badge"
import { Star, Instagram, Minus } from "lucide-react"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { useState } from "react"

export default function HomePage() {
  const [expandedCards, setExpandedCards] = useState<number[]>([])

  const toggleCard = (index: number) => {
    setExpandedCards(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[610px] bg-cover bg-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover absolute inset-0"
        >
          <source src="./2496349_Mountain_Water_1920x1080.mp4" type="video/mp4" />
          <source src="/hero-video.webm" type="video/webm" />
          {/* Fallback image if video doesn't load */}
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
            className="text-white z-10 absolute"
            style={{
              width: '504px',
              height: '98px',
              top: '340px',
              left: '120px',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600,
              fontSize: '40px',
              lineHeight: '100%',
              letterSpacing: '-3%',
              opacity: 1
            }}
          >
            <h1>Your Next Best Trip,</h1>
            <h1>Return Inspired</h1>
          </div>
        </div>
      </section>

      {/* Why Visit Kazakhstan */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8">
            <span className="text-[#202020]" style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 700,
              fontSize: '48px',
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
                fontSize: '48px',
                lineHeight: '100%',
                letterSpacing: '-4%'
              }}
            >Visit Kazakhstan</span>
          </h2>

          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
              {[
                {
                  title: "Silk Road History",
                  image: "/desert.jpg",
                  bgColor: "from-blue-400 to-blue-600",
                },
                {
                  title: "Nomadic Soul",
                  image: "/shanyrak.jpg",
                  bgColor: "from-amber-600 to-amber-800",
                },
                {
                  title: "Modern Meets Traditional",
                  image: "/baiterek.jpg", 
                  bgColor: "from-orange-400 to-orange-600",
                },
                {
                  title: "No Crowds, Just Space",
                  image: "/kanatnaya_doroga.jpg",
                  bgColor: "from-red-400 to-red-600",
                },
                {
                  title: "Unspoiled Nature",
                  image: "/yurta.jpg",
                  bgColor: "from-green-400 to-green-600",
                },
              ].map((item, index) => {
                const isExpanded = expandedCards.includes(index)
                return (
                  <Card key={index} className="relative overflow-hidden group cursor-pointer flex-shrink-0 p-0 border-0" style={{
                    width: '384px',
                    height: '500px',
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
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
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
                          {/* Plus icon container */}
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
                            {/* Vertical rectangle */}
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
                            {/* Horizontal rectangle */}
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

      {/* Top Tour Themes */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-start mb-8">
            <h2 className="mb-8">
              <span className="text-[#202020]" style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                fontSize: '48px',
                lineHeight: '100%',
                letterSpacing: '-4%'
              }}>Top Tour</span> <span 
                className="bg-gradient-to-r from-[#009CBC] to-[#FFE700] bg-clip-text text-transparent"
                style={{
                  background: 'linear-gradient(90deg, #009CBC 0%, #FFE700 154.07%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 400,
                  fontSize: '48px',
                  lineHeight: '100%',
                  letterSpacing: '-4%'
                }}
              >Themes</span>
            </h2>
            <div className="text-left">
              <div style={{
                width: '588px',
                height: '72px'
              }}>
                <p style={{
                  transform: 'rotate(0deg)',
                  opacity: 1,
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '150%',
                  letterSpacing: '-1%',
                  color: '#333333'
                }}>
                  Kazakhstan is vast and diverse — and so are the ways to experience it. Whether you&apos;re chasing
                  landscapes, culture, adventure, or spiritual meaning, there&apos;s a route for every traveler.
                </p>
              </div>
              
              <Link href="/tours">
                <Button
                  className="border-0 hover:bg-white hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md"
                  style={{
                    width: '142px',
                    height: '50px',
                    transform: 'rotate(0deg)',
                    opacity: 1,
                    paddingTop: '13px',
                    paddingRight: '26px',
                    paddingBottom: '13px',
                    paddingLeft: '26px',
                    gap: '10px',
                    borderRadius: '99px',
                    background: '#FFFFFF',
                    color: '#009CBC',
                    marginTop: '16px',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  Show all tours
                </Button>
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
              {[
                {
                  title: "Charyn Canyon & Kolsai Lakes Tour",
                description:
                  "A classic multi-day trip from Almaty into the Tian Shan mountains — explore canyons, alpine lakes, and mountain villages.",
                image: "/bao_contras.jpg",
                date: "20 may 2025",
                location: "Almaty",
                rating: 5,
              },
              {
                title: "Mangystau Desert Expedition",
                description:
                  "Visit Bozzhyra, Sherkala, and Torysh with local guides. Sleep in a yurt under the stars, explore sacred places.",
                image: "/mangystau.jpg",
                date: "20 may 2025",
                location: "",
                rating: 5,
              },
              {
                title: "Turkestan - Taraz - Otrar Route",
                description:
                  "A historical journey across mausoleums, caravanserais, and ruins — with stories of poets, traders, and pilgrims.",
                image: "/kozha_akhmet_yassaui.jpg",
                date: "20 may 2025",
                location: "",
                rating: 5,
              },
              {
                title: "Almaty",
                description:
                  "Street art, fashion studios, coffee culture, and live music — explore Almaty's youthful soul.",
                image: "/almaty.jpg",
                date: "20 may 2025",
                location: "",
                rating: 5,
              },
              ].map((tour, index) => (
                <Card key={index} className="overflow-hidden flex-shrink-0 border-0 p-2 shadow-md" style={{
                  width: '384px',
                  height: '506px'
                }}>
                  <div className="relative">
                    <Image
                      src={tour.image || "/placeholder.svg"}
                      alt={tour.title}
                      width={368}
                      height={260}
                      className="w-full object-cover rounded-lg"
                      style={{
                        width: '368px',
                        height: '260px'
                      }}
                    />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-gray-800/80 text-white text-xs px-2 py-1">📅 {tour.date}</Badge>
                    {tour.location && (
                      <Badge className="bg-gray-800/80 text-white text-xs px-2 py-1">{tour.location}</Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="mb-2 text-[#202020]" style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 600,
                    fontSize: '24px',
                    lineHeight: '100%',
                    letterSpacing: '-2%'
                  }}>{tour.title}</h3>
                  <p className="text-gray-600 mb-3 line-clamp-3" style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '24px',
                    letterSpacing: '-1%'
                  }}>{tour.description}</p>
                  <div className="flex justify-between items-center">
                    <Button variant="link" className="text-[#009CBC] hover:text-[#007a9a] p-0 text-sm">
                      Read more →
                    </Button>
                    <div className="flex">
                      {Array.from({ length: tour.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Discover Cities */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-[#202020]">
            Discover <span className="text-[#009CBC]">Cities</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-gray-600 mb-6 text-sm">
                Kazakhstan&apos;s cities reflect the country&apos;s past, present, and future — from ancient Silk Road stops to
                futuristic capitals, sleepy desert towns to cultural and academic centers. Each has its own character,
                rhythm, and reason to explore.
              </p>
              <Button className="bg-[#009CBC] hover:bg-[#007a9a] text-white rounded-full">Discover</Button>
            </div>

            <div className="relative">
              <Image
                src="/kz_map.png"
                alt="Kazakhstan Map"
                width={500}
                height={300}
                className="w-full h-auto"
              />
            </div>
          </div>

          <div className="mt-8">
            <Card className="relative overflow-hidden w-72">
              <Image
                src="/turkestan.jpg?height=160&width=280"
                alt="Turkestan"
                width={280}
                height={160}
                className="w-full h-40 object-cover"
              />
              <div className="absolute bottom-3 left-3 text-white">
                <h3 className="text-lg font-semibold">Turkestan</h3>
                <p className="text-sm opacity-90">31° Dry sunshine, 12:30</p>
                <p className="text-xs opacity-75">LIGHT OVERCAST</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-[#009CBC] mb-4">@into.kazakhstan</h2>
              <p className="text-gray-600 mb-6 text-sm">
                Kazakhstan is vast and diverse — and so are the ways to experience it. Whether you&apos;re chasing
                landscapes, culture, adventure, or spiritual meaning, there&apos;s a route for every traveler.
              </p>
              <Button variant="link" className="text-[#009CBC] hover:text-[#007a9a] p-0">
                See Instagram
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { image: "/nomad_girls.png", alt: "Nomad girls" },
                { image: "/desert.jpg", alt: "Desert landscape" },
                { image: "/yurta.jpg", alt: "Traditional yurt" }
              ].map((post, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={post.image}
                    alt={post.alt}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <Instagram className="absolute top-2 right-2 w-4 h-4 text-white" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-[#202020]">Blog</h2>
            <Link href="/blog">
              <Button variant="link" className="text-[#009CBC] hover:text-[#007a9a]">
                Show all blogs
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                image: "/famile.jpg",
                title: "Almaty Creative Tour",
                description: "Street art, fashion studios, coffee culture, and live music — explore Almaty&apos;s youthful soul.",
                category: "Culture"
              },
              {
                image: "/baiterek.jpg",
                title: "Nur-Sultan Architecture",
                description: "Discover the futuristic architecture and modern landmarks of Kazakhstan&apos;s capital city.",
                category: "Architecture"
              },
              {
                image: "/mangystau.jpg",
                title: "Mangystau Adventures",
                description: "Explore the mystical landscapes and ancient formations of the Mangystau region.",
                category: "Adventure"
              },
              {
                image: "/kozha_akhmet_yassaui.jpg",
                title: "Historical Heritage",
                description: "Journey through Kazakhstan&apos;s rich historical sites and cultural monuments.",
                category: "History"
              }
            ].map((post, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={280}
                    height={160}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-gray-800/80 text-white text-xs px-2 py-1">📅 20 may 2025</Badge>
                    <Badge className="bg-gray-800/80 text-white text-xs px-2 py-1">{post.category}</Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-base mb-2 text-[#202020]">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {post.description}
                  </p>
                  <Link href="/blog">
                    <Button variant="link" className="text-[#009CBC] hover:text-[#007a9a] p-0 text-sm">
                      Read more →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Events */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-start mb-8">
            <h2 className="text-3xl font-bold text-[#202020]">
              Explore <span className="text-[#009CBC]">Events</span>
            </h2>
            <div className="max-w-md text-right">
              <p className="text-gray-600 text-sm mb-4">
                Kazakhstan is vast and diverse — and so are the ways to experience it. Whether you&apos;re chasing
                landscapes, culture, adventure, or spiritual meaning, there&apos;s a route for every traveler.
              </p>
              <Button variant="link" className="text-[#009CBC] hover:text-[#007a9a] p-0">
                Show all Events
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Kolsay & Kayindy", image: "/bao_contras.jpg?height=240&width=280" },
              { name: "Charyn Canyon", image: "/charyn.jpg?height=240&width=280" },
              { name: "Shymbulak", image: "/kanatnaya_doroga.jpg?height=240&width=280" },
              { name: "Charyn Canyon", image: "/charyn.jpg?height=240&width=280" },
            ].map((event, index) => (
              <Card key={index} className="relative overflow-hidden h-60">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <Image
                  src={event.image || "/placeholder.svg"}
                  alt={event.name}
                  width={280}
                  height={240}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 z-20">
                  <Badge className="bg-gray-800/80 text-white text-xs px-2 py-1 mr-2">📅 20 may 2025</Badge>
                  <Badge className="bg-gray-800/80 text-white text-xs px-2 py-1">Nature</Badge>
                </div>
                <div className="absolute bottom-4 left-4 text-white z-20">
                  <h3 className="text-lg font-semibold">{event.name}</h3>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* For Investors */}
      <section className="py-16 relative">
        <div className="absolute inset-0">
          <Image
            src="/expo.jpg?height=300&width=1200"
            alt="City aerial view"
            width={1200}
            height={300}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-white">
              For <span className="text-[#009CBC]">Investors</span>
            </h2>
            <Button className="bg-white text-gray-900 hover:bg-gray-100 rounded-full">Show all tours</Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center mb-6">
                <Image
                  src="/Logo 2.png"
                  alt="Visit Kazakhstan"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </div>
              <h2 className="text-3xl font-bold mb-6 text-[#202020]">
                About <span className="text-[#009CBC]">us</span>
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                Kazakhstan is vast and diverse — and so are the ways to experience it. Whether you&apos;re chasing
                landscapes, culture, adventure, or spiritual meaning, there&apos;s a route for every traveler.
              </p>
              <Button variant="link" className="text-[#009CBC] hover:text-[#007a9a] p-0">
                Read more
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#009CBC] mb-2">2010</div>
                <p className="text-gray-600 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#009CBC] mb-2">50+</div>
                <p className="text-gray-600 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#009CBC] mb-2">1000+</div>
                <p className="text-gray-600 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#009CBC] mb-2">20</div>
                <p className="text-gray-600 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
