'use client'

import Image from "next/image"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import FigmaDestinationCard from "../../components/FigmaDestinationCard"

interface TourPageProps {
  params: Promise<{
    slug: string
  }>
}

// Tour data - you can move this to a separate data file or API later
interface TourData {
  title: string;
  mainImage: string;
  secondaryImage: string;
}

const tourData: Record<string, TourData> = {
  'charyn-canyon-kolsai-lakes-tour': {
    title: 'Charyn Canyon & Kolsai Lakes Tour',
    mainImage: '/charyn.jpg',
    secondaryImage: '/baiterek.jpg'
  },
  'mangystau-desert-expedition': {
    title: 'Mangystau Desert Expedition',
    mainImage: '/mangystau.jpg',
    secondaryImage: '/desert.jpg'
  },
  'turkestan-taraz-otrar-route': {
    title: 'Turkestan - Taraz - Otrar Route',
    mainImage: '/turkestan.jpg',
    secondaryImage: '/kozha_akhmet_yassaui.jpg'
  },
  'almaty': {
    title: 'Almaty',
    mainImage: '/almaty.jpg',
    secondaryImage: '/city.png'
  }
}

export default async function TourDetailPage({ params }: TourPageProps) {
  const { slug } = await params
  const tour = tourData[slug]
  
  if (!tour) {
    return <div>Tour not found</div>
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20 bg-gray-50">
        {/* Main Content */}
        <section className="pb-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Tour Title */}
            <h1 className="mb-12" style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600,
              fontSize: '40px',
              lineHeight: '100%',
              letterSpacing: '-3%',
              color: '#202020'
            }}>
              {tour.title}
            </h1>
            
            {/* Main Image */}
            <div className="mb-12">
              <Image
                src={tour.mainImage}
                alt={tour.title}
                width={1360}
                height={453}
                className="w-full object-cover"
                style={{
                  width: '1360px',
                  height: '453px',
                  transform: 'rotate(0deg)',
                  opacity: 1,
                  borderRadius: '16px', // M size border radius
                  maxWidth: '100%'
                }}
              />
            </div>

            {/* Content Layout with Text, Image and Destination Card */}
            <div className="mb-12 flex gap-8">
              {/* Left Column - Text and Secondary Image */}
              <div className="flex-1" style={{ maxWidth: '766px' }}>
                {/* First Lorem Text */}
                <div className="mb-8">
                  <p className="text-gray-600 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                  <p className="text-gray-600 leading-relaxed mt-4">
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                  </p>
                </div>

                {/* Secondary Image */}
                <div className="mb-8">
                  <Image
                    src={tour.secondaryImage}
                    alt={`${tour.title} additional view`}
                    width={766}
                    height={313}
                    className="object-cover"
                    style={{
                      width: '766px',
                      height: '313px',
                      transform: 'rotate(0deg)',
                      opacity: 1,
                      borderRadius: '8px',
                      maxWidth: '100%'
                    }}
                  />
                </div>
              </div>
              
              {/* Right Column - Destination Information Card */}
              <div className="flex-shrink-0">
                <FigmaDestinationCard variant="vertical" location="Almaty" type="Nature" />
              </div>
            </div>

            {/* Second Lorem Text */}
            <div className="mb-12" style={{ maxWidth: '766px' }}>
              <p className="text-gray-600 leading-relaxed">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.
              </p>
            </div>

          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}