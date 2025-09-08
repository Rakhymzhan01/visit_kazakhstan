import React from 'react';

interface SearchIconProps {
  size?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

const SearchIcon: React.FC<SearchIconProps> = ({ 
  size = 16, 
  color = '#14B8A6', 
  className = '',
  strokeWidth = 1.5,
  style = {}
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      {/* Circle for the lens */}
      <circle
        cx="11"
        cy="11"
        r="8"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Diagonal handle extending from bottom-right */}
      <path
        d="m21 21-4.35-4.35"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SearchIcon;