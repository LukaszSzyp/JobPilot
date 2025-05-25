"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

interface CrudOperations<T, CreateInput, UpdateInput> {
  create: (input: CreateInput) => Promise<T>
  update: (id: string, input: UpdateInput) => Promise<T>
  delete: (id: string) => Promise<void>
}

interface UseCrudOperationsOptions {
  queryKeys: string[][]
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useCrudOperations<T, CreateInput, UpdateInput>(
  operations: CrudOperations<T, CreateInput, UpdateInput>,
  options: UseCrudOperationsOptions,
) {
  const queryClient = useQueryClient()

  const invalidateQueries = () => {
    options.queryKeys.forEach((key) => {
      queryClient.invalidateQueries({ queryKey: key })
    })
  }

  const createMutation = useMutation({
    mutationFn: operations.create,
    onSuccess: () => {
      invalidateQueries()
      options.onSuccess?.()
    },
    onError: options.onError,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateInput }) => operations.update(id, input),
    onSuccess: () => {
      invalidateQueries()
      options.onSuccess?.()
    },
    onError: options.onError,
  })

  const deleteMutation = useMutation({
    mutationFn: operations.delete,
    onSuccess: () => {
      invalidateQueries()
      options.onSuccess?.()
    },
    onError: options.onError,
  })

  return {
    create: createMutation.mutate,
    update: (params: { id: string; input: UpdateInput }) => updateMutation.mutate(params),
    delete: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    error: createMutation.error || updateMutation.error || deleteMutation.error,
  }
}
