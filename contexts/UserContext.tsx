import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { UserProfile, userService } from '../lib/supabase';

interface UserContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  isLoading: boolean;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      console.error('No user found in context');
      return;
    }
    
    try {
      // If user doesn't have an ID yet, we need to create the profile first
      if (!user.id) {
        const newUser = await userService.createUserProfile({
          name: user.name || '',
          age: user.age || 0,
          phone: user.phone || '',
          interests: user.interests || [],
          address: user.address || '',
          society: user.society || '',
          flat: user.flat || '',
          avatar: user.avatar || '',
          bio: user.bio || '',
          gender: user.gender || '',
          state_id: user.state_id || undefined
        });
        
        const updatedUser = { ...newUser, ...updates };
        setUser(updatedUser);
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        // Update existing user
        const updatedUser = await userService.updateUserProfile(user.id, updates);
        const newUser = { ...user, ...updatedUser };
        setUser(newUser);
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('onboardingComplete');
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const value: UserContextType = {
    user,
    setUser,
    isLoading,
    updateUserProfile,
    logout,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 