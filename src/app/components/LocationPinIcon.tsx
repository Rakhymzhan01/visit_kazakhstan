import React from 'react';

interface LocationPinIconProps {
  size?: number;
  color?: string;
  className?: string;
}

const LocationPinIcon: React.FC<LocationPinIconProps> = ({ 
  size = 24, 
  color = '#14B8A6',
  className = ''
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Filled teardrop/pin shape */}
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        fill={color}
      />
      {/* Inner circle */}
      <circle
        cx="12"
        cy="9"
        r="2.5"
        fill="white"
      />
    </svg>
  );
};

export default LocationPinIcon;