import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    id: 'demo-user-123',
    email: 'seeker@wellness.local',
    name: 'Aria Montgomery'
  });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check Supabase session
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || 'Mindful Seeker'
          });
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || 'Mindful Seeker'
          });
        }
      });

      return () => subscription?.unsubscribe();
    }
    setLoading(false);
  }, []);

  // Fetch initial profile
  useEffect(() => {
    api.getDashboard()
      .then((res) => {
        if (res?.data?.profile) {
          setProfile(res.data.profile);
        }
      })
      .catch((err) => console.log('AuthContext profile fetch note:', err.message))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const signInDemo = () => {
    localStorage.setItem('prana_auth_token', 'demo-token');
    setUser({
      id: 'demo-user-123',
      email: 'seeker@wellness.local',
      name: 'Aria Montgomery'
    });
  };

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('prana_auth_token');
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        setProfile,
        loading,
        signInDemo,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
