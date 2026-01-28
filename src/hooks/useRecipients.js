import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import authService from '../api/authService';
import { queryKeys } from '../api/queryClient';

// Get recipients query
export const useRecipients = (page = 1, limit = 100, search = '') => {
  return useQuery({
    queryKey: [...queryKeys.recipients, page, limit, search],
    queryFn: async () => {
      // Since we don't have a dedicated recipient service, we'll use authService or create one
      // For now, let's assume authService has a getRecipients method or we'll need to create it
      const response = await fetch(`/api/recipients?page=${page}&limit=${limit}&search=${search}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch recipients');
      }
      
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Add recipient mutation
export const useAddRecipient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recipientData: any) => {
      const response = await fetch('/api/recipients', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipientData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add recipient');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recipients });
    },
    onError: (error) => {
      console.error('Add recipient failed:', error);
    },
  });
};

// Update recipient mutation
export const useUpdateRecipient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`/api/recipients/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update recipient');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recipients });
    },
    onError: (error) => {
      console.error('Update recipient failed:', error);
    },
  });
};

// Delete recipient mutation
export const useDeleteRecipient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/recipients/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete recipient');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recipients });
    },
    onError: (error) => {
      console.error('Delete recipient failed:', error);
    },
  });
};
