import { create } from 'zustand';
import { clearUserFromStorage, loadUserFromStorage, saveUserToStorage } from '@/utils/storage';
import { useEffect } from 'react';
import { User } from '@/entities/user';
import { GhConfig, LoginUserResponse, createUser, loginUser } from '@/api';


type UserState = {
  user: Partial<User> | null;
  setUser: (user: Partial<User>) => void;
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
  }, []);


  const signUp = async (user: Partial<User>, ghConfig: GhConfig) => {
    try {
      const signUpResp = await createUser(user, ghConfig);

      setUser(signUpResp?.data?.user as Partial<User>);

      if (signUpResp?.data?.success) {

        setUser(signUpResp?.data?.user as Partial<User>);

        return Promise.resolve(signUpResp?.data);
      } else {

        return Promise.reject(signUpResp?.data);
      }

    } catch (err) {
      console.log('Error while signing in', err);
      return Promise.reject(err);
    }
  }

  const login = async (username: string, passkey: number): Promise<LoginUserResponse> => {
    try {

      const loggedInResp = await loginUser(username, passkey);

      if (loggedInResp?.data?.success) {
      
        setUser(loggedInResp?.data?.user as Partial<User>);

        return Promise.resolve(loggedInResp?.data);
      } else {

        return Promise.reject(loggedInResp?.data);
      }

    } catch (err) {
      console.log('Error while logging in', err);
      return Promise.reject(err);
    }
  };


  const logout = async () => {
    clearUserFromStorage();
    clearUser();
  };

  return {
    user,
    login,
    signUp,
    logout,
  };
};
