import { create } from 'zustand';
import { clearUserFromStorage, loadUserFromStorage, saveUserToStorage } from '@/utils/storage';
import { generateUUID } from '@/utils/random-id';
import { useEffect } from 'react';

export type User = {
  username: string;
  userID: string;
  ghRepoName: string;
  ghPat: string;
};

type UserState = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));


export const useUser = () => {
  const { user, setUser, clearUser } = useUserStore();

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await loadUserFromStorage();
      if (storedUser) {
        setUser(storedUser);
      }
    };
    loadUser();
  }, [setUser]);

  const login = async (username: string, ghRepoName: string, ghPat: string) => {
    const userID = generateUUID(6); // Function to generate a unique ID
    const user = { username, userID, ghRepoName, ghPat };
    await saveUserToStorage(user);
    setUser(user);
  };

  const updateUser = async (ghRepoName: string, ghPat: string) => {
    if (user) {
      const updatedUser = { ...user, ghRepoName, ghPat };
      await saveUserToStorage(updatedUser);
      setUser(updatedUser);
    }
  };

  const logout = async () => {
    clearUserFromStorage();
    clearUser();
  };

  return {
    user,
    login,
    updateUser,
    logout,
  };
};
