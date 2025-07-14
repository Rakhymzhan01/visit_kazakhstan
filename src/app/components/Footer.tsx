import React from 'react'
import Link from 'next/link'
import { Instagram, Youtube, Facebook, Send, Twitter } from 'lucide-react'
import VisitKazakhstanLogo from './Logo'

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Logo and Contact */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center mb-6">
              <VisitKazakhstanLogo 
                width={140}
                height={32}
                variant="default"
                className="h-8 w-auto"
              />
            </Link>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg mb-2">Contact</h4>
                <p className="text-[#333333] text-lg">+7 7122 000-000</p>
                <p className="text-[#333333]">info@visitkazakhstan.com</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Address</h4>
                <p className="text-[#333333]">
                  4517 Washington Ave.<br />
                  Manchester, Kentucky<br />
                  39495
                </p>
              </div>
            </div>
          </div>

          {/* Menu Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6">MENU</h4>
            <ul className="space-y-3">
              {menuLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-[#333333] hover:text-[#009CBC] transition-colors duration-200"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6">COMPANY</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-[#333333] hover:text-[#009CBC] transition-colors duration-200"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6">SOCIAL</h4>
            <ul className="space-y-3">
              {socialLinks.map((social) => {
                const IconComponent = social.icon
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-[#333333] hover:text-[#009CBC] transition-colors duration-200"
                    >
                      <IconComponent className="h-4 w-4 mr-2" />
                      {social.label.toUpperCase()}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-[#202020] border-t border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white text-sm">
              ©2025 Visit Qazaqstan. All rights reserved.
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