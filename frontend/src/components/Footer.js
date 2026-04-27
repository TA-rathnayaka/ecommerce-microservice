import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-[#F9FAFB] pt-20 pb-16">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo & Socials */}
          <div className="flex flex-col gap-8">
            <Link to="/" className="flex items-center gap-1.5">
              <div className="flex h-11 w-11 items-center justify-center">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 44C24 44 40 36 40 24C40 12 24 4 24 4C24 4 8 12 8 24C8 36 24 44 24 44Z" stroke="#2D5A34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M24 44V24" stroke="#2D5A34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M24 24C24 24 32 20 36 12" stroke="#2D5A34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M24 24C24 24 16 20 12 12" stroke="#2D5A34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 32C18 36 22 38 24 38C26 38 30 36 32 32" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="font-display text-3xl font-black tracking-tighter text-[#FF6B35]">
                FRESH
              </span>
            </Link>

            <div className="flex items-center gap-6 text-gray-400">
              <a href="#" className="transition hover:text-[#2D5A34]">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" className="transition hover:text-[#2D5A34]">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a href="#" className="transition hover:text-[#2D5A34]">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" className="transition hover:text-[#2D5A34]">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm9.385 8h-3.359c-.232-1.787-.674-3.385-1.272-4.63 1.94.757 3.52 2.302 4.631 4.63zm-5.411 0h-3.974v-4.88c1.64.444 3.01 1.97 3.974 4.88zm-5.974-4.88v4.88h-3.974c.964-2.91 2.334-4.436 3.974-4.88zm-5.974 4.88h-3.359c1.111-2.328 2.691-3.873 4.631-4.63-.598 1.245-1.04 2.843-1.272 4.63zm-1.015 2h3.615c-.066.643-.1 1.304-.1 2s.034 1.357.1 2h-3.615c-.066-.643-.1-1.304-.1-2s.034-1.357.1-2zm1.066 6h3.359c.232 1.787.674 3.385 1.272 4.63-1.94-.757-3.52-2.302-4.631-4.63zm5.411 0h3.974v4.88c-1.64-.444-3.01-1.97-3.974-4.88zm5.974 4.88v-4.88h3.974c-.964 2.91-2.334 4.436-3.974 4.88zm5.974-4.88h3.359c-1.111 2.328-2.691 3.873-4.631 4.63.598-1.245 1.04-2.843 1.272-4.63zm1.015-2h-3.615c.066-.643.1-1.304.1-2s-.034-1.357-.1-2h3.615c.066.643.1 1.304.1 2s-.034 1.357-.1 2zm-5.666-4h-3.974v-2c0-.667.034-1.333.1-2h3.774c.066.667.1 1.333.1 2v2zm-3.974 2v2c0 .667-.034 1.333-.1 2h-3.774c-.066-.667-.1-1.333-.1-2v-2h3.974zm0 6h-3.774c-.066.667-.1 1.333-.1 2h3.774c.066.667.1 1.333.1-2v-2zm2 0v2c0 .667-.034 1.333-.1 2h-3.774c.066-.667.1-1.333.1-2v-2h3.774z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Our Services */}
          <div>
            <h4 className="mb-6 font-display text-xl font-bold text-ink">Our services</h4>
            <ul className="space-y-4 text-gray-500">
              <li><Link to="/" className="transition hover:text-ink">Pricing</Link></li>
              <li><Link to="/" className="transition hover:text-ink">Tracking</Link></li>
              <li><Link to="/" className="transition hover:text-ink">Report a Bug</Link></li>
              <li><Link to="/" className="transition hover:text-ink">Terms of service</Link></li>
            </ul>
          </div>

          {/* Our Company */}
          <div>
            <h4 className="mb-6 font-display text-xl font-bold text-ink">Our Company</h4>
            <ul className="space-y-4 text-gray-500">
              <li><Link to="/" className="transition hover:text-ink">Reporting</Link></li>
              <li><Link to="/" className="transition hover:text-ink">Get in Touch</Link></li>
              <li><Link to="/" className="transition hover:text-ink">Management</Link></li>
            </ul>
          </div>

          {/* Address */}
          <div>
            <h4 className="mb-6 font-display text-xl font-bold text-ink">Address</h4>
            <ul className="space-y-4 text-gray-500">
              <li>121 King St,</li>
              <li>888-123-42278</li>
              <li>hellotazrin7@gmail.com</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
