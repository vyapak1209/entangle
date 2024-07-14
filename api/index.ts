import { ApiUserPayload, User } from '@/entities/user';
import { ApiResponse, create } from 'apisauce';

const apiClient = create({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL}/api/entangle`,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export type GhConfig = {
  ghRepoName: string;
  ghPat: string;
};

export type CreateUserResponse = {
  success: boolean;
  message: string;
  user?: User;
};

export type LoginUserResponse = {
  success: boolean;
  message: string;
  user?: User;
};

export const createUser = async (user: ApiUserPayload, ghConfig?: GhConfig): Promise<ApiResponse<CreateUserResponse>> => {
  return await apiClient.post('/user', { user, ghConfig });
};

export const loginUser = async (username: string, passkey: number): Promise<ApiResponse<LoginUserResponse>> => {
  return await apiClient.post('/user/login', { username, passkey });
};