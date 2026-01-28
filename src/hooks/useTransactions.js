import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import transactionService from '../api/transactionService';
import { queryKeys } from '../api/queryClient';

// Get transactions query
export const useTransactions = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: [...queryKeys.transactions, page, limit],
    queryFn: () => transactionService.getTransactions(page, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get transaction by ID query
export const useTransaction = (id: string) => {
  return useQuery({
    queryKey: queryKeys.transaction(id),
    queryFn: () => transactionService.getTransactionById(id),
    enabled: !!id,
  });
};

// Create transaction mutation
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionService.createTransaction,
    onSuccess: (data) => {
      // Invalidate transactions list
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
      // Add new transaction to cache
      queryClient.setQueryData(queryKeys.transaction(data.id), data);
    },
    onError: (error) => {
      console.error('Create transaction failed:', error);
    },
  });
};

// Upload invoice mutation
export const useUploadInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ transactionId, file }: { transactionId: string; file: File }) =>
      transactionService.uploadInvoice(transactionId, file),
    onSuccess: (data, variables) => {
      // Update specific transaction in cache
      queryClient.setQueryData(queryKeys.transaction(variables.transactionId), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
    },
    onError: (error) => {
      console.error('Upload invoice failed:', error);
    },
  });
};

// Update transaction status mutation
export const useUpdateTransactionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      transactionService.updateTransactionStatus(id, status),
    onSuccess: (data, variables) => {
      // Update transaction in cache
      queryClient.setQueryData(queryKeys.transaction(variables.id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
    },
    onError: (error) => {
      console.error('Update transaction status failed:', error);
    },
  });
};

// Delete transaction mutation
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionService.deleteTransaction,
    onSuccess: (_, variables) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.transaction(variables) });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
    },
    onError: (error) => {
      console.error('Delete transaction failed:', error);
    },
  });
};
