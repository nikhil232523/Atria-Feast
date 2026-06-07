import React from 'react';
import { Utensils, Clock, Mail, Phone, MapPin, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Section 1: Logo & Vision */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-emerald-500 rounded-lg text-white">
                <Utensils className="w-5 h-5" />
              </div>
              <span className="text-lg font-sans font-bold text-white tracking-tight">
                Atria <span className="text-emerald-400">Feasty</span>
              </span>
            </div>
            <p className="text-sm line-clamp-3 leading-relaxed mb-6">
              Bengaluru's premium culinary haven merging Indian heritage with international plates. Powered by modern smart automated order, reservations, and inventory networks.
            </p>
            <div className="text-xs text-emerald-400 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              Enterprise Java Technologies Powered
            </div>
          </div>

          {/* Section 2: Precise Restaurant Timings */}
          <div>
            <h4 className="text-sm font-sans font-semibold text-white uppercase tracking-wider mb-6">
              Opening Timings
            </h4>
            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <Clock className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-white font-medium">Monday - Sunday</div>
                  <div>09:00 AM - 11:00 PM</div>
                  <div className="text-xs text-gray-500 mt-0.5">Kitchen orders close at 10:30 PM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Owners */}
          <div>
            <h4 className="text-sm font-sans font-semibold text-white uppercase tracking-wider mb-6">
              Founding Owners
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between border-b border-gray-800 pb-1.5">
                <span className="text-white font-medium">Shrishti</span>
                <span className="text-xs bg-emerald-950 text-emerald-400 px-2.5 py-0.5 rounded-full font-semibold">Owner</span>
              </li>
              <li className="flex items-center justify-between border-b border-gray-800 pb-1.5">
                <span className="text-white font-medium">Krish</span>
                <span className="text-xs bg-emerald-950 text-emerald-400 px-2.5 py-0.5 rounded-full font-semibold">Owner</span>
              </li>
              <li className="flex items-center justify-between pb-1.5">
                <span className="text-white font-medium">Nikhil</span>
                <span className="text-xs bg-emerald-950 text-emerald-400 px-2.5 py-0.5 rounded-full font-semibold">Owner</span>
              </li>
            </ul>
          </div>

          {/* Section 4: Contact details */}
          <div>
            <h4 className="text-sm font-sans font-semibold text-white uppercase tracking-wider mb-6">
              Get in Touch
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Atria Feasty, Outer Ring Rd, Hebbal, Bengaluru, Karnataka 560024</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-400" />
                <span>+91 80 2319 9999</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-400" />
                <span>welcome@atriafeasty.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© 2026 Atria Feasty. All Intellectual Rights Reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0 font-mono">
            <span className="hover:text-white transition cursor-pointer">SSL-SECURE</span>
            <span className="hover:text-white transition cursor-pointer">ROLE-BASED-RBAC</span>
            <span className="hover:text-white transition cursor-pointer">DATABASE-DRIVEN</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
