import React from 'react'
import { Outlet, Link } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 font-sans">
      {/* 1. BRAND LOGO AREA */}
      <div className="text-center mb-8">
        <Link to="/" className="inline-block group">
          <h1 className="text-5xl font-serif font-bold text-gray-900 tracking-tight group-hover:opacity-80 transition-opacity">
            Engrisk
          </h1>
          <span className="block text-xs font-medium tracking-[0.3em] text-gray-400 mt-2 uppercase">
            Editorial Learning
          </span>
        </Link>
      </div>

      {/* 2. MAIN CARD CONTAINER */}
      <div className="w-full max-w-[500px]">
        <div className="bg-white py-10 px-8 md:px-12 shadow-xl shadow-gray-200/50 rounded-3xl border border-gray-100">
          <Outlet />
        </div>

        {/* Footer Links (Optional) */}
        <div className="mt-8 text-center space-x-6 text-sm text-gray-400">
          <Link to="/about" className="hover:text-gray-900 transition-colors">
            Về chúng tôi
          </Link>
          <Link to="/privacy" className="hover:text-gray-900 transition-colors">
            Bảo mật
          </Link>
          <Link to="/contact" className="hover:text-gray-900 transition-colors">
            Liên hệ
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
