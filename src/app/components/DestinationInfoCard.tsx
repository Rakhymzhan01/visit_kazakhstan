import React from 'react';
import Image from 'next/image';
import LocationIcon from './LocationIcon';
import FireIcon from './FireIcon';

interface DestinationItem {
  id: string;
  name: string;
  image: string;
  isFeatured?: boolean;
}

interface DestinationInfoCardProps {
  variant?: 'short' | 'tall';
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

const DestinationInfoCard: React.FC<DestinationInfoCardProps> = ({
  variant = 'tall',
  location = 'Almaty',
  type = 'Nature',
  destinations = defaultDestinations,
  className = ''
}) => {
  
  return (
    <div className={`w-[384px] space-y-4 ${className}`}>
      {/* Information Card */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="mb-2" style={{
          fontFamily: 'Manrope, sans-serif',
          fontWeight: 400,
          fontSize: '20px',
          lineHeight: '100%',
          letterSpacing: '-2%',
          color: '#6b7280'
        }}>Information</h2>
        
        {/* Gray line under Information */}
        <div className="w-full h-px mb-4" style={{ backgroundColor: '#F5F5F5' }}></div>
        
        {/* Location Row */}
        <div className="flex items-center mb-3">
          <LocationIcon size={20} color="#14B8A6" className="mr-3" />
          <span className="mr-2" style={{
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 400,
            fontSize: '12px',
            lineHeight: '150%',
            letterSpacing: '-1%',
            color: '#6b7280'
          }}>Location</span>
          <span style={{
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 400,
            fontSize: '20px',
            lineHeight: '100%',
            letterSpacing: '-2%',
            color: '#000000'
          }}>{location}</span>
        </div>
        
        {/* Type Row */}
        <div className="flex items-center">
          <FireIcon size={20} color="#14B8A6" className="mr-3" />
          <span className="mr-2" style={{
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 400,
            fontSize: '12px',
            lineHeight: '150%',
            letterSpacing: '-1%',
            color: '#6b7280'
          }}>Type</span>
          <span style={{
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 400,
            fontSize: '20px',
            lineHeight: '100%',
            letterSpacing: '-2%',
            color: '#000000'
          }}>{type}</span>
        </div>
      </div>

      {/* Destinations Card */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="mb-2" style={{
          fontFamily: 'Manrope, sans-serif',
          fontWeight: 400,
          fontSize: '20px',
          lineHeight: '100%',
          letterSpacing: '-2%',
          color: '#000000'
        }}>Top Natural Destinations</h3>
        <div className="w-full h-px mb-4" style={{ backgroundColor: '#F5F5F5' }}></div>
        
        {/* Destinations List */}
        <div className="space-y-3">
          {destinations.slice(0, variant === 'short' ? 2 : 3).map((destination) => (
            <div key={destination.id} className="flex flex-col">
              <div className="w-20 h-20 rounded-lg overflow-hidden mb-2 flex-shrink-0">
                <Image
                  src={destination.image}
                  alt={destination.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 400,
                  fontSize: '20px',
                  lineHeight: '100%',
                  letterSpacing: '-2%',
                  color: destination.isFeatured ? '#14B8A6' : '#000000'
                }}>
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

export default DestinationInfoCard;