import { apiRequest } from "./queryClient";

export interface UserData {
  id: number;
  username: string;
  email: string;
  imagesProcessed: number;
  subscriptionTier: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export const registerUser = async (data: RegisterData): Promise<UserData> => {
  const response = await apiRequest('POST', '/api/auth/register', data);
  return response.json();
};

export const loginUser = async (data: LoginData): Promise<UserData> => {
  const response = await apiRequest('POST', '/api/auth/login', data);
  return response.json();
};

export const logoutUser = async (): Promise<void> => {
  await apiRequest('POST', '/api/auth/logout', {});
};

export const getCurrentUser = async (): Promise<UserData | null> => {
  try {
    const response = await fetch('/api/auth/user', {
      credentials: 'include',
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        return null;
      }
      throw new Error('Failed to get current user');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const checkFreeTrial = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/free-trial', {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to check free trial status');
    }
    
    const data = await response.json();
    return data.hasFreeTrial;
  } catch (error) {
    console.error('Error checking free trial:', error);
    return false;
  }
};
