import React from 'react'

interface VisitKazakhstanLogoProps {
  className?: string
  width?: number
  height?: number
  variant?: 'default' | 'white' | 'dark'
}

const VisitKazakhstanLogo: React.FC<VisitKazakhstanLogoProps> = ({
  className = '',
  width = 140,
  height = 32,
  variant = 'default'
}) => {
  const getColors = () => {
    switch (variant) {
      case 'white':
        return {
          visit: '#FFFFFF',
          kazakhstan: '#FFFFFF', 
          decoration: '#FFFFFF'
        }
      case 'dark':
        return {
          visit: '#1F2937',
          kazakhstan: '#1F2937',
          decoration: '#F59E0B'
        }
      default:
        return {
          visit: '#0EA5E9', // Sky blue for "visit" 
          kazakhstan: '#374151', // Medium gray for "kazakhstan"
          decoration: '#F59E0B' // Golden yellow for decorative line
        }
    }
  }

  const colors = getColors()

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 140 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* "visit" text - cyan color, lowercase, lighter weight */}
      <text
        x="0"
        y="18"
        fontSize="14"
        fontWeight="300"
        fill={colors.visit}
        fontFamily="Inter, -apple-system, BlinkMacSystemFont, sans-serif"
        letterSpacing="0.02em"
      >
        visit
      </text>

      {/* "kazakhstan" text - dark color, lowercase, normal weight */}
      <text
        x="32"
        y="18"
        fontSize="14"
        fontWeight="400"
        fill={colors.kazakhstan}
        fontFamily="Inter, -apple-system, BlinkMacSystemFont, sans-serif"
        letterSpacing="0.01em"
      >
        kazakhstan
      </text>

      {/* Decorative flowing line under the text */}
      <g transform="translate(0, 23)">
        <path
          d="M0 1 Q12 -0.5 24 0.5 Q36 1.5 48 0 Q60 -1 72 0.5 Q84 2 96 0"
          stroke={colors.decoration}
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
        
        {/* Small star-like decorative elements */}
        <g transform="translate(16, 0)">
          <path d="M0 -1 L0.5 0 L0 1 L-0.5 0 Z" fill={colors.decoration} opacity="0.7" />
        </g>
        <g transform="translate(48, 0.5)">
          <path d="M0 -0.8 L0.4 0 L0 0.8 L-0.4 0 Z" fill={colors.decoration} opacity="0.6" />
        </g>
        <g transform="translate(80, 0)">
          <path d="M0 -0.6 L0.3 0 L0 0.6 L-0.3 0 Z" fill={colors.decoration} opacity="0.8" />
        </g>
      </g>
    </svg>
  )
}

export default VisitKazakhstanLogo