import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Wind, 
  User, 
  Menu, 
  X, 
  Compass, 
  HeartHandshake, 
  Activity, 
  Moon, 
  Smile, 
  Camera, 
  FileText,
  Users
} from 'lucide-react';
import AmbientSoundPlayer from './AmbientSoundPlayer';
import { useAuth } from '../context/AuthContext';

export default function TopNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Yoga', path: '/yoga' },
    { name: 'Protocols', path: '/yoga/protocols' },
    { name: 'AI Pose', path: '/yoga/pose-correction' },
    { name: 'Emergency Calm', path: '/calm', highlight: true },
    { name: 'Meditation', path: '/meditation' },
    { name: 'Sleep', path: '/sleep' },
    { name: 'Face Yoga', path: '/face-yoga' },
    { name: 'Consult', path: '/consult' },
    { name: 'Progress', path: '/progress' },
    { name: 'Community', path: '/community' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full zen-glass border-b border-sage-200/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-sage-600 to-sage-800 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-300">
              <span className="text-lg">🌿</span>
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-stone-900 group-hover:text-sage-800 transition-colors">
                Prana
              </span>
              <span className="hidden sm:inline-block text-[10px] text-sage-600 font-semibold tracking-widest uppercase ml-1.5 opacity-80">
                Yoga & Wellness
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1.5 text-xs font-medium text-stone-600">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-full transition-all duration-200 ${
                    isActive
                      ? link.highlight
                        ? 'bg-rose-500 text-white font-semibold shadow-sm'
                        : 'bg-sage-200/80 text-sage-900 font-semibold'
                      : link.highlight
                      ? 'text-rose-600 hover:bg-rose-50 font-semibold'
                      : 'hover:text-sage-900 hover:bg-sage-100/60'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Controls: Ambient Sounds + Emergency Calm + Profile */}
          <div className="flex items-center gap-2.5">
            <AmbientSoundPlayer className="hidden sm:flex" />

            <button
              onClick={() => navigate('/calm')}
              title="Instant Emergency Calm"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-600 text-white text-xs font-semibold shadow-sm hover:brightness-105 active:scale-95 transition-all"
            >
              <Wind className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Calm</span>
            </button>

            {/* User Profile Avatar */}
            <Link
              to="/profile"
              title="Profile & Preferences"
              className="w-9 h-9 rounded-full bg-sage-200 border border-sage-300 flex items-center justify-center text-sage-800 hover:bg-sage-300 transition-colors shadow-sm"
            >
              <User className="w-4 h-4" />
            </Link>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-stone-600 hover:bg-sage-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white/95 border-b border-sage-200 px-4 pt-2 pb-6 space-y-2 backdrop-blur-lg animate-fade-in">
          <div className="pt-2 pb-3 mb-2 border-b border-sage-100">
            <AmbientSoundPlayer />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 ${
                    isActive
                      ? link.highlight
                        ? 'bg-rose-500 text-white font-semibold'
                        : 'bg-sage-100 text-sage-900 font-semibold'
                      : link.highlight
                      ? 'text-rose-600 bg-rose-50 font-semibold'
                      : 'text-stone-700 hover:bg-sage-50'
                  }`
                }
              >
                <span>{link.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
