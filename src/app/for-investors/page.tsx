import React from 'react'
import Image from 'next/image'
import { Download, FileText } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const ForInvestorsPage = () => {
  const documents = [
    {
      id: 1,
      name: 'Document name',
      size: 'PDF 12.8 MB',
      downloadUrl: '/documents/document-1.pdf'
    },
    {
      id: 2,
      name: 'Document name',
      size: 'PDF 12.8 MB',
      downloadUrl: '/documents/document-2.pdf'
    },
    {
      id: 3,
      name: 'Document name',
      size: 'PDF 12.8 MB',
      downloadUrl: '/documents/document-3.pdf'
    },
    {
      id: 4,
      name: 'Document name',
      size: 'PDF 12.8 MB',
      downloadUrl: '/documents/document-4.pdf'
    }
  ]

  const presentations = [
    {
      id: 1,
      title: 'Lorem ipsum dolor sit amet',
      image: '/presentations/presentation-1.jpg',
      downloadUrl: '/presentations/presentation-1.pdf'
    },
    {
      id: 2,
      title: 'Lorem ipsum dolor sit amet',
      image: '/presentations/presentation-2.jpg',
      downloadUrl: '/presentations/presentation-2.pdf'
    },
    {
      id: 3,
      title: 'Lorem ipsum dolor sit amet',
      image: '/presentations/presentation-3.jpg',
      downloadUrl: '/presentations/presentation-3.pdf'
    },
    {
      id: 4,
      title: 'Lorem ipsum dolor sit amet',
      image: '/presentations/presentation-4.jpg',
      downloadUrl: '/presentations/presentation-4.pdf'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-2 items-center justify-center">
            {/* Left Content */}
            <div className="w-full lg:w-[678px] h-auto lg:h-[550px] bg-white rounded-lg px-6 sm:px-12 lg:px-20 py-8 lg:py-16 flex flex-col justify-center">
              <div className="inline-block text-white px-4 py-2 rounded-full text-sm font-medium mb-6 w-fit" style={{ backgroundColor: '#C6ABE2' }}>
                INVESTORS
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-gray-900 mb-6 leading-tight">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </h1>
              <p className="text-sm lg:text-[14px] text-gray-600 leading-relaxed max-w-md">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et 
                velit interdum, ac aliquet odio mattis.
              </p>
            </div>
            
            {/* Right Image */}
            <div className="w-full lg:w-[674px] h-[300px] sm:h-[400px] lg:h-[550px] rounded-lg overflow-hidden">
              <Image 
                src="/expo.jpg" 
                alt="Business meeting"
                width={674}
                height={550}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reports and Presentations Section 1 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h2 className="text-center sm:text-left">
              <span className="text-[#202020]" style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(24px, 6vw, 48px)',
                lineHeight: '100%',
                letterSpacing: '-4%'
              }}>Reports and</span> <span 
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
              >Presentations</span>
            </h2>
            <button className="text-[#009CBC] hover:text-[#007A9A] font-medium transition-colors self-center sm:self-auto">
              Download all
            </button>
          </div>

          {/* Document List */}
          <div className="space-y-4">
            {documents.map((document) => (
              <div key={document.id} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-[#202020] mb-1 truncate">
                      {document.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {document.size}
                    </p>
                  </div>
                </div>
                <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
                  <Download className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reports and Presentations Section 2 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h2 className="text-center sm:text-left">
              <span className="text-[#202020]" style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(24px, 6vw, 48px)',
                lineHeight: '100%',
                letterSpacing: '-4%'
              }}>Reports and</span> <span 
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
              >Presentations</span>
            </h2>
            <button className="text-[#009CBC] hover:text-[#007A9A] font-medium transition-colors self-center sm:self-auto">
              Download all
            </button>
          </div>

          {/* Presentation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {presentations.map((presentation) => (
              <div key={presentation.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
                <div className="relative h-40 sm:h-48 bg-gray-100">
                  {/* Placeholder for presentation thumbnail */}
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-yellow-100">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-200 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                    </div>
                  </div>
                  
                  {/* Download overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-white text-[#202020] px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm sm:text-base">
                      Download
                    </button>
                  </div>
                </div>
                
                <div className="p-3 sm:p-4">
                  <h3 className="text-sm sm:text-base font-medium text-[#202020] leading-tight">
                    {presentation.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default ForInvestorsPage