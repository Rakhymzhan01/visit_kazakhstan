'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import PlanTripModal from './PlanTripModal'
import SearchIcon from './SearchIcon'
import DropdownArrowIcon from './DropdownArrowIcon'
import DiagonalArrowIcon from './DiagonalArrowIcon'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isPlanTripModalOpen, setIsPlanTripModalOpen] = useState(false)

  const navigation = [
    {
      name: 'CATEGORIES',
      href: '/categories',
      width: 134,
      textWidth: 84,
      hasDropdown: true,
      dropdownItems: [
        { name: 'Nature Escapes', href: '/categories/nature' },
        { name: 'Cultural Tours', href: '/categories/culture' },
        { name: 'City Breaks', href: '/categories/cities' }
      ]
    },
    {
      name: 'TOURS',
      href: '/tours',
      width: 97,
      textWidth: 47,
      hasDropdown: true,
      dropdownItems: []
    },
    { name: 'PLAN YOUR TRIP', href: '/plan-your-trip', width: 139, textWidth: 107 },
    { name: 'BLOG', href: '/blog', width: 68, textWidth: 36 },
    { name: 'EVENTS', href: '/events', width: 84, textWidth: 52 },
    { name: 'ABOUT US', href: '/about-us', width: 99, textWidth: 67 },
    { name: 'FOR INVESTORS', href: '/for-investors', width: 137, textWidth: 105 }
  ]

  const handlePlanTripClick = (e: React.MouseEvent) => {
    e.preventDefault()
    window.location.href = '/plan-your-trip'
  }

  return (
    <>
      <header 
        className="bg-[#F5F5F5] relative z-50 w-full"
        style={{
          height: '82px',
          justifyContent: 'space-between',
          opacity: 1,
          borderBottom: '0.7px solid #D3D3D3',
          paddingTop: '16px',
          paddingRight: '40px',
          paddingBottom: '16px',
          paddingLeft: '40px',
          backdropFilter: 'blur(50px)'
        }}
      >
          <div className="flex items-center justify-between h-full w-full">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0 mr-8 lg:mr-12 xl:mr-16">
              <Image
                src="/Logo 2.png"
                alt="Visit Kazakhstan"
                width={94}
                height={38}
                style={{
                  width: '94px',
                  height: '38px',
                  opacity: 1
                }}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-4 xl:space-x-8 flex-1 justify-center">
              <div 
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                  padding: '2px',
                  width: '740px',
                  height: '50px',
                  background: '#FFFFFF',
                  borderRadius: '99px',
                  flex: 'none',
                  order: 0,
                  alignSelf: 'stretch',
                  flexGrow: 0
                }}
              >
              {navigation.map((item) => (
                <div 
                  key={item.name} 
                  className="relative group"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '6px 16px',
                    gap: '2px',
                    width: `${item.width}px`,
                    height: '46px',
                    borderRadius: '99px',
                    flex: 'none',
                    alignSelf: 'stretch',
                    flexGrow: 0,
                    margin: '0px -10px'
                  }}
                >
                  {item.name === 'PLAN YOUR TRIP' ? (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '0px',
                        gap: '10px',
                        width: `${item.textWidth}px`,
                        height: '19px',
                        flex: 'none',
                        flexGrow: 0
                      }}
                    >
                      <button
                        onClick={handlePlanTripClick}
                        style={{
                          width: `${item.textWidth}px`,
                          height: '19px',
                          fontFamily: 'var(--font-manrope), Manrope, sans-serif',
                          fontStyle: 'normal',
                          fontWeight: 500,
                          fontSize: '14px',
                          lineHeight: '19px',
                          textTransform: 'uppercase',
                          color: '#333333',
                          flex: 'none',
                          flexGrow: 0,
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {item.name}
                      </button>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '0px',
                        gap: '8px',
                        width: 'auto',
                        height: '19px',
                        flex: 'none',
                        flexGrow: 0
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-manrope), Manrope, sans-serif',
                          fontStyle: 'normal',
                          fontWeight: 500,
                          fontSize: '14px',
                          lineHeight: '19px',
                          textTransform: 'uppercase',
                          color: '#333333',
                          flex: 'none',
                          flexGrow: 0,
                          textDecoration: 'none',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <Link
                          href={item.href}
                          style={{
                            color: 'inherit',
                            textDecoration: 'none'
                          }}
                        >
                          {item.name}
                        </Link>
                      </span>
                      {item.hasDropdown && (
                        <DiagonalArrowIcon 
                          size={16} 
                          color="#009CBC"
                          style={{
                            width: '16px',
                            height: '16px',
                            opacity: 1,
                            minWidth: '16px',
                            minHeight: '16px',
                            display: 'block'
                          }}
                        />
                      )}
                    </div>
                  )}

                  {/* Dropdown Menu */}
                  {item.hasDropdown && item.dropdownItems && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-lg rounded-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="py-2">
                        {item.dropdownItems.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              </div>
            </nav>

            {/* Search and Language Container */}
            <div 
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '2px',
                gap: '2px',
                width: '140px',
                height: '50px',
                background: '#009CBC',
                borderRadius: '99px',
                flex: 'none',
                order: 1,
                alignSelf: 'stretch',
                flexGrow: 0
              }}
            >
              {/* Search */}
              <div 
                className="hidden md:flex items-center bg-white"
                style={{
                  width: '86px',
                  height: '46px',
                  opacity: 1,
                  paddingTop: '6px',
                  paddingRight: '12px',
                  paddingBottom: '6px',
                  paddingLeft: '6px',
                  gap: '3px',
                  borderRadius: '99px'
                }}
              >
                <SearchIcon 
                  size={16} 
                  color="#6B7280" 
                  strokeWidth={2}
                  style={{ minWidth: '16px', minHeight: '16px' }}
                />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm outline-none flex-1"
                />
              </div>

              {/* Language Toggle */}
              <button className="text-white text-sm font-medium flex items-center gap-1">
                EN
                <DropdownArrowIcon 
                  size={16} 
                  color="white"
                  strokeWidth={2}
                  style={{
                    width: '16px',
                    height: '16px',
                    transform: 'rotate(0deg)',
                    opacity: 1
                  }}
                />
              </button>
            </div>

            {/* Actions Container */}
            <div className="flex items-center space-x-4">
              {/* Plan Your Trip Button */}
              <button
                onClick={handlePlanTripClick}
                className="bg-[#009CBC] hover:bg-[#007a9a] text-white flex items-center justify-center font-medium whitespace-nowrap"
                style={{
                  width: '137px',
                  height: '50px',
                  opacity: 1,
                  paddingTop: '13px',
                  paddingRight: '26px',
                  paddingBottom: '13px',
                  paddingLeft: '26px',
                  gap: '10px',
                  borderRadius: '99px'
                }}
              >
                Plan your trip
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-700"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t">
            <div className="px-4 py-2">
              {/* Mobile Search */}
              <div className="flex items-center bg-gray-50 rounded-full px-3 py-1.5 mb-4">
                <SearchIcon 
                  size={16} 
                  color="#6B7280" 
                  strokeWidth={2} 
                  className="mr-2"
                  style={{ minWidth: '16px', minHeight: '16px' }}
                />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm outline-none flex-1"
                />
              </div>

              {/* Mobile Navigation */}
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <div key={item.name}>
                    {item.name === 'PLAN YOUR TRIP' ? (
                      <button
                        onClick={(e) => {
                          handlePlanTripClick(e)
                          setIsMenuOpen(false)
                        }}
                        className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                      >
                        {item.name}
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                    {item.hasDropdown && item.dropdownItems && (
                      <div className="pl-4 space-y-1">
                        {item.dropdownItems.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="block py-1 text-sm text-gray-600 hover:text-blue-600"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Plan Trip Modal */}
      <PlanTripModal 
        isOpen={isPlanTripModalOpen} 
        onClose={() => setIsPlanTripModalOpen(false)} 
      />
    </>
  )
}

export default Header