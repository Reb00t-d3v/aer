import { apiRequest } from './queryClient';

export interface ProcessedImage {
  original: string;
  processed: string;
  id: number | null;
}

export const uploadAndProcessImage = async (file: File): Promise<ProcessedImage> => {
  // Create a FormData object to send the file
  const formData = new FormData();
  formData.append('image', file);
  
  // Use fetch directly for FormData uploads
  const response = await fetch('/api/images/upload', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to process image');
  }
  
  return await response.json();
};

export const getUserImages = async (): Promise<any[]> => {
  const response = await apiRequest('GET', '/api/user-images', undefined);
  return response.json();
};

export const getSubscriptionPlans = async (): Promise<any> => {
  const response = await apiRequest('GET', '/api/subscription-plans', undefined);
  return response.json();
};

export const updateSubscription = async (tier: string): Promise<any> => {
  const response = await apiRequest('POST', '/api/subscriptions', { tier });
  return response.json();
};
