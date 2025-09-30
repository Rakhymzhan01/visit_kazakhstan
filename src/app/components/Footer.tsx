import React from 'react'
import Link from 'next/link'
import { Instagram, Youtube, Facebook, Send, Twitter } from 'lucide-react'
import Image from 'next/image'

const Footer = () => {
  const menuLinks = [
    { title: 'CATEGORIES', href: '/categories' },
    { title: 'TOURS', href: '/tours' },
    { title: 'PLAN YOUR TRIP', href: '/plan-your-trip' },
    { title: 'BLOG', href: '/blog' },
    { title: 'EVENTS', href: '/events' }
  ]

  const companyLinks = [
    { title: 'ABOUT US', href: '/about-us' },
    { title: 'FOR INVESTORS', href: '/for-investors' }
  ]

  const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com/visitkazakhstan', label: 'Instagram' },
    { icon: Youtube, href: 'https://youtube.com/visitkazakhstan', label: 'YouTube' },
    { icon: Facebook, href: 'https://facebook.com/visitkazakhstan', label: 'Facebook' },
    { icon: Send, href: 'https://t.me/visitkazakhstan', label: 'Telegram' },
    { icon: Twitter, href: 'https://twitter.com/visitkazakhstan', label: 'Twitter' }
  ]

  return (
    <footer className="bg-white text-[#333333]">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative">
        {/* Mobile-first layout */}
        <div className="space-y-8 lg:space-y-0">
          {/* Logo and Contact - Full width on mobile */}
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start space-y-6 sm:space-y-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/Logo 2.png"
                alt="Visit Kazakhstan"
                width={117}
                height={48}
                className="w-[100px] sm:w-[117px] h-auto"
              />
            </Link>
            
            <div className="text-center sm:text-right space-y-2">
              <p className="text-[#333333] font-montserrat" style={{
                fontWeight: 600,
                fontSize: 'clamp(18px, 4vw, 24px)',
                lineHeight: '130%',
                letterSpacing: '-2%'
              }}>+7 7122 000-000</p>
              <p className="text-[#333333] font-manrope" style={{
                fontWeight: 400,
                fontSize: 'clamp(16px, 3vw, 20px)',
                lineHeight: '100%',
                letterSpacing: '-2%'
              }}>info@visitkazakhstan.com</p>
            </div>
          </div>

          {/* Navigation Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {/* Menu Links */}
            <div>
              <h4 className="font-manrope mb-4 sm:mb-6" style={{
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '150%',
                letterSpacing: '-1%',
                color: '#929292'
              }}>MENU</h4>
              <ul className="space-y-2 sm:space-y-3">
                {menuLinks.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="font-manrope hover:text-[#009CBC] transition-colors duration-200 text-xs sm:text-sm"
                      style={{
                        fontWeight: 500,
                        lineHeight: '100%',
                        letterSpacing: '0%',
                        textTransform: 'uppercase',
                        color: '#333333'
                      }}
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-manrope mb-4 sm:mb-6" style={{
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '150%',
                letterSpacing: '-1%',
                color: '#929292'
              }}>COMPANY</h4>
              <ul className="space-y-2 sm:space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="font-manrope hover:text-[#009CBC] transition-colors duration-200 text-xs sm:text-sm"
                      style={{
                        fontWeight: 500,
                        lineHeight: '100%',
                        letterSpacing: '0%',
                        textTransform: 'uppercase',
                        color: '#333333'
                      }}
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-manrope mb-4 sm:mb-6" style={{
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '150%',
                letterSpacing: '-1%',
                color: '#929292'
              }}>SOCIAL</h4>
              <ul className="space-y-2 sm:space-y-3">
                {socialLinks.map((social) => (
                  <li key={social.label}>
                    <Link
                      href={social.href}
                      className="font-manrope hover:text-[#009CBC] transition-colors duration-200 text-xs sm:text-sm"
                      style={{
                        fontWeight: 500,
                        lineHeight: '100%',
                        letterSpacing: '0%',
                        textTransform: 'uppercase',
                        color: '#333333'
                      }}
                    >
                      {social.label.toUpperCase()}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Address Column */}
            <div>
              <h4 className="font-manrope mb-4 sm:mb-6" style={{
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '150%',
                letterSpacing: '-1%',
                color: '#929292'
              }}>ADDRESS</h4>
              <div className="font-manrope text-xs sm:text-sm" style={{
                fontWeight: 500,
                lineHeight: '120%',
                letterSpacing: '0%',
                textTransform: 'uppercase',
                color: '#333333'
              }}>
                <p>4517 Washington Ave.</p>
                <p>Manchester, Kentucky</p>
                <p>39495</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-[#202020] border-t border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white text-sm">
              ©2025 Visit Kazakhstan. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href="/privacy-policy"
                className="text-white hover:text-[#009CBC] text-sm transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/offer"
                className="text-white hover:text-[#009CBC] text-sm transition-colors duration-200"
              >
                Offer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer