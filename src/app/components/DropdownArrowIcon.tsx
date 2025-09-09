import React from 'react';

interface DropdownArrowIconProps {
  size?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

const DropdownArrowIcon: React.FC<DropdownArrowIconProps> = ({ 
  size = 16, 
  color = 'white', 
  className = '',
  strokeWidth = 1.5,
  style
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
      {/* Chevron down - two lines forming a "V" pointing down */}
      <path
        d="m6 9 6 6 6-6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DropdownArrowIcon;