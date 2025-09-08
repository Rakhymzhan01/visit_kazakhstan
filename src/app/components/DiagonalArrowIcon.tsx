import React from 'react';

interface DiagonalArrowIconProps {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const DiagonalArrowIcon: React.FC<DiagonalArrowIconProps> = ({ 
  size = 16, 
  color = '#14B8A6', 
  className = '',
  style = {}
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      {/* Main diagonal line from top-left to bottom-right - made longer */}
      <path
        d="M3 3L13 13"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Arrowhead at bottom-right - made longer */}
      <path
        d="M8.5 13L13 13L13 8.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DiagonalArrowIcon;