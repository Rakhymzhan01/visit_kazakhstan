import React from 'react';
import Image from 'next/image';
import LocationPinIcon from './LocationPinIcon';
import FlameIcon from './FlameIcon';

interface DestinationItem {
  id: string;
  name: string;
  image: string;
  isFeatured?: boolean;
}

interface FigmaDestinationCardProps {
  variant?: 'horizontal' | 'vertical';
  location?: string;
  type?: string;
  destinations?: DestinationItem[];
  className?: string;
}

const defaultDestinations: DestinationItem[] = [
  {
    id: '1',
    name: 'Tulip Fields in South Kazakhstan (Taraz & Shym...)',
    image: '/charyn.jpg',
    isFeatured: false
  },
  {
    id: '2', 
    name: 'Lake Kaindy & Kolsai Lakes',
    image: '/kanatnaya_doroga.jpg',
    isFeatured: true
  },
  {
    id: '3',
    name: 'Charyn Canyon',
    image: '/desert.jpg',
    isFeatured: false
  }
];

const FigmaDestinationCard: React.FC<FigmaDestinationCardProps> = ({
  location = 'Almaty',
  type = 'Nature',
  destinations = defaultDestinations,
  className = ''
}) => {
  
  return (
    <div className={`w-[384px] space-y-4 ${className}`}>
      {/* Information Box */}
      <div 
        className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        style={{
          width: '384px',
          height: '245px'
        }}
      >
        <h2 
          className="mb-2 text-gray-500"
          style={{
            fontSize: '24px',
            fontWeight: '400',
            color: '#6B7280'
          }}
        >
          Information
        </h2>
        
        {/* Gray line under Information */}
        <div className="w-full h-px mb-4" style={{ backgroundColor: '#F5F5F5' }}></div>
        
        {/* Location Row */}
        <div className="flex items-start mb-4">
          <LocationPinIcon 
            size={24} 
            color="#14B8A6" 
            className="mr-3 mt-1 flex-shrink-0" 
          />
          <div className="flex flex-col">
            <span 
              className="text-gray-500 mb-1"
              style={{
                fontSize: '14px',
                fontWeight: '400'
              }}
            >
              Location
            </span>
            <span 
              className="text-black font-bold"
              style={{
                fontSize: '20px',
                fontWeight: '700'
              }}
            >
              {location}
            </span>
          </div>
        </div>
        
        {/* Type Row */}
        <div className="flex items-start">
          <FlameIcon 
            size={24} 
            color="#14B8A6" 
            className="mr-3 mt-1 flex-shrink-0" 
          />
          <div className="flex flex-col">
            <span 
              className="text-gray-500 mb-1"
              style={{
                fontSize: '14px',
                fontWeight: '400'
              }}
            >
              Type
            </span>
            <span 
              className="text-black font-bold"
              style={{
                fontSize: '20px',
                fontWeight: '700'
              }}
            >
              {type}
            </span>
          </div>
        </div>
      </div>

      {/* Destinations Box */}
      <div 
        className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        style={{
          width: '384px',
          height: '308px'
        }}
      >
        <h3 
          className="mb-2 text-gray-500"
          style={{
            fontSize: '24px',
            fontWeight: '400',
            color: '#6B7280'
          }}
        >
          Top Natural Destinations
        </h3>
        
        {/* Gray line under Top Natural Destinations */}
        <div className="w-full h-px mb-4" style={{ backgroundColor: '#F5F5F5' }}></div>
        
        {/* Destinations List */}
        <div className="space-y-3">
          {destinations.map((destination) => (
            <div 
              key={destination.id} 
              className="flex items-center"
            >
              {/* Destination Image - 64x54px */}
              <div 
                className="rounded-lg overflow-hidden flex-shrink-0 mr-3"
                style={{
                  width: '64px',
                  height: '54px'
                }}
              >
                <Image
                  src={destination.image}
                  alt={destination.name}
                  width={64}
                  height={54}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Destination Text - Right side */}
              <div className="flex-1">
                <p 
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 400,
                    fontSize: '20px',
                    lineHeight: '100%',
                    letterSpacing: '-2%',
                    verticalAlign: 'bottom',
                    color: destination.isFeatured ? '#14B8A6' : '#000000'
                  }}
                >
                  {destination.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FigmaDestinationCard;