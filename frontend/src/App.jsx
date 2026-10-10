import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import TopNav from './components/TopNav';
import BottomNav from './components/BottomNav';
import AIAssistantDrawer from './components/AIAssistantDrawer';

import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import YogaLibraryPage from './pages/YogaLibraryPage';
import ProtocolsPage from './pages/ProtocolsPage';
import PoseCorrectionPage from './pages/PoseCorrectionPage';
import CalmPage from './pages/CalmPage';
import MeditationPage from './pages/MeditationPage';
import SleepPage from './pages/SleepPage';
import FaceYogaPage from './pages/FaceYogaPage';
import ConsultPage from './pages/ConsultPage';
import ProgressPage from './pages/ProgressPage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  const location = useLocation();
  const isLandingOrOnboarding = location.pathname === '/' || location.pathname === '/onboarding';

  return (
    <div className="min-h-screen flex flex-col bg-sand-50 text-stone-800 pb-16 xl:pb-0">
      {/* Top Navigation Bar (Shown on all app routes) */}
      {!isLandingOrOnboarding && <TopNav />}

      {/* Main Content Area */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/yoga" element={<YogaLibraryPage />} />
          <Route path="/yoga/protocols" element={<ProtocolsPage />} />
          <Route path="/yoga/pose-correction" element={<PoseCorrectionPage />} />
          <Route path="/calm" element={<CalmPage />} />
          <Route path="/meditation" element={<MeditationPage />} />
          <Route path="/sleep" element={<SleepPage />} />
          <Route path="/face-yoga" element={<FaceYogaPage />} />
          <Route path="/consult" element={<ConsultPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>

      {/* Floating Prana AI Assistant (Available on all app routes) */}
      {!isLandingOrOnboarding && <AIAssistantDrawer />}

      {/* Bottom Navigation for Mobile Screens */}
      {!isLandingOrOnboarding && <BottomNav />}
    </div>
  );
}
