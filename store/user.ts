import { create } from 'zustand';
import { clearUserFromStorage, loadUserFromStorage, saveUserToStorage } from '@/utils/storage';
import { useEffect } from 'react';
import { User } from '@/entities/user';
import { GhConfig, LoginUserResponse, createUser, loginUser } from '@/api';

type UserState = {
  user: Partial<User> | null;
  loading: boolean;
  error: string | null;
};

type Action =
  | { type: 'SET_USER'; payload: Partial<User> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_USER' };

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

const reducer = (state: UserState, action: Action): UserState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_USER':
      return { ...state, user: null, loading: false, error: null };
    default:
      return state;
  }
};

export const useUserStore = create<{ state: UserState; dispatch: React.Dispatch<Action> }>((set) => ({
  state: initialState,
  dispatch: (action) => set((state) => ({ state: reducer(state.state, action) })),
}));

export const useUser = () => {
  const { state, dispatch } = useUserStore();

  useEffect(() => {
    const loadUser = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const storedUser = await loadUserFromStorage();
        if (storedUser) {
          dispatch({ type: 'SET_USER', payload: storedUser });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load user from storage' });
      }
    };
    loadUser();
  }, [dispatch]);

  const signUp = async (user: Partial<User>, ghConfig: GhConfig) => {
    
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const signUpResp = await createUser(user, ghConfig);
      if (signUpResp?.data?.success) {

        saveUserToStorage(signUpResp?.data?.user as Partial<User>);

        dispatch({ type: 'SET_USER', payload: signUpResp?.data?.user as Partial<User> });

        return Promise.resolve(signUpResp?.data);
      } else {

        dispatch({ type: 'SET_ERROR', payload: signUpResp?.data?.message || 'Sign up failed' });

        return Promise.reject(signUpResp?.data);
      }
    } catch (err) {

      dispatch({ type: 'SET_ERROR', payload: 'Error while signing up' });

      return Promise.reject(err);
    }
  };

  const login = async (username: string, passkey: number): Promise<LoginUserResponse> => {
    
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      
      const loggedInResp = await loginUser(username, passkey);

      if (loggedInResp?.data?.success) {

        saveUserToStorage(loggedInResp?.data?.user as Partial<User>);

        dispatch({ type: 'SET_USER', payload: loggedInResp?.data?.user as Partial<User> });

        return Promise.resolve(loggedInResp?.data);
      } else {

        dispatch({ type: 'SET_ERROR', payload: loggedInResp?.data?.message || 'Login failed' });
        
        return Promise.reject(loggedInResp?.data);
      }
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Error while logging in' });
      return Promise.reject(err);
    }
  };

  
  const logout = async () => {
    clearUserFromStorage();
    dispatch({ type: 'CLEAR_USER' });
  };


  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    login,
    signUp,
    logout
  };
};