'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Search, Menu, X } from 'lucide-react'
import VisitKazakhstanLogo from './Logo'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const navigation = [
    {
      name: 'CATEGORIES',
      href: '/categories',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Nature Escapes', href: '/categories/nature' },
        { name: 'Cultural Tours', href: '/categories/culture' },
        { name: 'City Breaks', href: '/categories/cities' },
        { name: 'Adventure Tours', href: '/categories/adventure' }
      ]
    },
    {
      name: 'TOURS',
      href: '/tours',
      hasDropdown: true,
    },
    { name: 'PLAN YOUR TRIP', href: '/plan-your-trip' },
    { name: 'BLOG', href: '/blog' },
    { name: 'EVENTS', href: '/events' },
    { name: 'ABOUT US', href: '/about-us' },
    { name: 'FOR INVESTORS', href: '/for-investors' }
  ]

  return (
    <header className="bg-white shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <VisitKazakhstanLogo 
              width={140}
              height={32}
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors" style={{fontSize: '14px'}}
                >
                  {item.name}
                  {item.hasDropdown && (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </Link>

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
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:flex items-center bg-gray-50 rounded-full px-3 py-1.5 max-w-xs">
              <Search className="h-4 w-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm outline-none flex-1"
              />
            </div>

            {/* Language Toggle */}
            <button className="bg-teal-500 text-white px-3 py-2 rounded-full text-sm font-medium hover:bg-teal-600 transition-colors">
              EN
            </button>

            {/* Plan Your Trip Button */}
            <Link
              href="/plan-your-trip"
              className="bg-[#009CBC] hover:bg-[#007a9a] text-white rounded-full text-sm h-9 px-4 flex items-center font-medium whitespace-nowrap"
            >
              Plan your trip
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t">
          <div className="px-4 py-2">
            {/* Mobile Search */}
            <div className="flex items-center bg-gray-50 rounded-full px-3 py-1.5 mb-4">
              <Search className="h-4 w-4 text-gray-400 mr-2" />
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
                  <Link
                    href={item.href}
                    className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
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
  )
}

export default Header