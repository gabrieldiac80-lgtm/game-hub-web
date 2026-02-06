import { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, ProfileContextType } from '@/types/profile-types';

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const PROFILES_STORAGE_KEY = 'game_hub_profiles';
const CURRENT_PROFILE_KEY = 'game_hub_current_profile';

const DEFAULT_STATS = {
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  draws: 0,
};

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);

  // Load profiles from localStorage on mount
  useEffect(() => {
    const savedProfiles = localStorage.getItem(PROFILES_STORAGE_KEY);
    const currentProfileId = localStorage.getItem(CURRENT_PROFILE_KEY);

    if (savedProfiles) {
      const parsedProfiles = JSON.parse(savedProfiles);
      setProfiles(parsedProfiles);

      if (currentProfileId) {
        const profile = parsedProfiles.find((p: UserProfile) => p.id === currentProfileId);
        if (profile) {
          setCurrentProfile(profile);
        }
      }
    }
  }, []);

  const createProfile = (username: string, avatar: string) => {
    const newProfile: UserProfile = {
      id: Date.now().toString(),
      username,
      avatar,
      createdAt: Date.now(),
      stats: {
        tictactoe: { ...DEFAULT_STATS },
        sudoku: { ...DEFAULT_STATS },
        chess: { ...DEFAULT_STATS },
      },
    };

    const updatedProfiles = [...profiles, newProfile];
    setProfiles(updatedProfiles);
    setCurrentProfile(newProfile);

    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(updatedProfiles));
    localStorage.setItem(CURRENT_PROFILE_KEY, newProfile.id);
  };

  const switchProfile = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      setCurrentProfile(profile);
      localStorage.setItem(CURRENT_PROFILE_KEY, profileId);
    }
  };

  const deleteProfile = (profileId: string) => {
    const updatedProfiles = profiles.filter(p => p.id !== profileId);
    setProfiles(updatedProfiles);

    if (currentProfile?.id === profileId) {
      const nextProfile = updatedProfiles[0] || null;
      setCurrentProfile(nextProfile);
      if (nextProfile) {
        localStorage.setItem(CURRENT_PROFILE_KEY, nextProfile.id);
      } else {
        localStorage.removeItem(CURRENT_PROFILE_KEY);
      }
    }

    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(updatedProfiles));
  };

  const updateStats = (
    gameType: 'tictactoe' | 'sudoku' | 'chess',
    result: 'win' | 'loss' | 'draw',
    time?: number
  ) => {
    if (!currentProfile) return;

    const updatedProfile = { ...currentProfile };
    const gameStat = updatedProfile.stats[gameType];

    gameStat.gamesPlayed += 1;
    if (result === 'win') gameStat.wins += 1;
    else if (result === 'loss') gameStat.losses += 1;
    else if (result === 'draw') gameStat.draws += 1;

    if (time && gameType === 'sudoku') {
      if (!gameStat.bestTime || time < gameStat.bestTime) {
        gameStat.bestTime = time;
      }
    }

    setCurrentProfile(updatedProfile);

    const updatedProfiles = profiles.map(p =>
      p.id === updatedProfile.id ? updatedProfile : p
    );
    setProfiles(updatedProfiles);
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(updatedProfiles));
  };

  const value: ProfileContextType = {
    currentProfile,
    profiles,
    createProfile,
    switchProfile,
    deleteProfile,
    updateStats,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
}
