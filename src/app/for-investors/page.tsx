import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
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
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                INVESTORS
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-[#202020] mb-6 leading-tight">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et 
                velit interdum, ac aliquet odio mattis.
              </p>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/images/investors/business-meeting.jpg"
                  alt="Business meeting"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reports and Presentations Section 1 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#202020]">
              Reports and <span className="text-[#009CBC]">Presentations</span>
            </h2>
            <button className="text-[#009CBC] hover:text-[#007A9A] font-medium transition-colors">
              Download all
            </button>
          </div>

          {/* Document List */}
          <div className="space-y-4">
            {documents.map((document) => (
              <div key={document.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#202020] mb-1">
                      {document.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {document.size}
                    </p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Download className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reports and Presentations Section 2 */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#202020]">
              Reports and <span className="text-[#009CBC]">Presentations</span>
            </h2>
            <button className="text-[#009CBC] hover:text-[#007A9A] font-medium transition-colors">
              Download all
            </button>
          </div>

          {/* Presentation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {presentations.map((presentation) => (
              <div key={presentation.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
                <div className="relative h-48 bg-gray-100">
                  {/* Placeholder for presentation thumbnail */}
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-yellow-100">
                    <div className="w-16 h-16 bg-green-200 rounded-lg flex items-center justify-center">
                      <FileText className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  
                  {/* Download overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-white text-[#202020] px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                      Download
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-base font-medium text-[#202020] leading-tight">
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