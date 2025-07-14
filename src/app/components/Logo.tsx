import React from 'react';

interface VisitKazakhstanLogoProps {
  className?: string;
  width?: number;
  height?: number;
  variant?: 'default' | 'white' | 'dark';
}

const VisitKazakhstanLogo: React.FC<VisitKazakhstanLogoProps> = ({
  className = '',
  width = 280,
  height = 64,
  variant = 'default'
}) => {
  const getColors = () => {
    switch (variant) {
      case 'white':
        return {
          visit: '#FFFFFF',
          kazakhstan: '#FFFFFF', 
          decoration: '#FFFFFF'
        };
      case 'dark':
        return {
          visit: '#1F2937',
          kazakhstan: '#1F2937',
          decoration: '#F59E0B'
        };
      default:
        return {
          visit: '#009CBC', // Sky blue for "visit" 
          kazakhstan: '#009CBC', // Same blue for "kazakhstan"
          decoration: '#F59E0B' // Golden yellow for decorative line
        };
    }
  };

  const colors = getColors();

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 280 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* "visit" text - bold, cyan color, lowercase */}
      <text
        x="0"
        y="36"
        fontSize="28"
        fontWeight="700" // Changed from 400 to 700 for bold
        fill={colors.visit}
        fontFamily="Inter, -apple-system, BlinkMacSystemFont, sans-serif"
        letterSpacing="0.02em"
      >
        visit
      </text>

      {/* "kazakhstan" text - regular weight, same blue color, lowercase */}
      <text
        x="64"
        y="36"
        fontSize="28"
        fontWeight="400" // Kept as regular weight
        fill={colors.kazakhstan}
        fontFamily="Inter, -apple-system, BlinkMacSystemFont, sans-serif"
        letterSpacing="0.01em"
      >
        kazakhstan
      </text>
    </svg>
  );
};

export default VisitKazakhstanLogo;