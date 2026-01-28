import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
    },
    mutations: {
      retry: 1,
    },
  },
});

// Query keys for consistent cache management
export const queryKeys = {
  auth: ['auth'],
  user: ['user'],
  transactions: ['transactions'],
  transaction: id => ['transactions', id],
  recipients: ['recipients'],
  exchangeRates: ['exchangeRates'],
  receipts: ['receipts'],
  admin: ['admin'],
};
