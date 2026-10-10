import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Compass, Wind, Camera, HeartHandshake, User } from 'lucide-react';

export default function BottomNav() {
  const items = [
    { label: 'Home', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Yoga', icon: Compass, path: '/yoga' },
    { label: 'Calm', icon: Wind, path: '/calm', highlight: true },
    { label: 'AI Pose', icon: Camera, path: '/yoga/pose-correction' },
    { label: 'Consult', icon: HeartHandshake, path: '/consult' },
    { label: 'Profile', icon: User, path: '/profile' }
  ];

  return (
    <nav className="xl:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 border-t border-sage-200/90 backdrop-blur-md px-2 py-1 shadow-lg">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? item.highlight
                      ? 'text-rose-600 font-bold'
                      : 'text-sage-800 font-bold'
                    : 'text-stone-500 hover:text-stone-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-1 rounded-lg ${
                      isActive && !item.highlight ? 'bg-sage-100' : ''
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        item.highlight ? 'text-rose-500 animate-pulse' : ''
                      }`}
                    />
                  </div>
                  <span className="text-[10px] tracking-tight mt-0.5">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
