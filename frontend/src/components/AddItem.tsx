import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createItem } from '../lib/api'
import { useState } from 'react'
import type { Item } from '../types'

export function AddItem({ onAdded }: { onAdded: () => void }) {
  const [text, setText] = useState('')
  const queryClient = useQueryClient()
  
  const mutation = useMutation({
    mutationFn: createItem,
    onMutate: async (newText: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['items'] })

      // Snapshot the previous value
      const previousItems = queryClient.getQueryData<Item[]>(['items'])

      // Optimistically update to the new value
      const optimisticItem: Item = {
        id: Date.now(), // Temporary ID
        text: newText,
        created_at: new Date().toISOString(),
      }
      
      queryClient.setQueryData<Item[]>(['items'], (old) => 
        old ? [optimisticItem, ...old] : [optimisticItem]
      )

      // Return a context object with the snapshotted value
      return { previousItems }
    },
    onError: (err, newText, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousItems) {
        queryClient.setQueryData(['items'], context.previousItems)
      }
    },
    onSuccess: () => {
      setText('')
      onAdded()
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = text.trim()
    if (trimmed.length < 1) return
    mutation.mutate(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe your item"
        minLength={1}
        style={{ flex: 1, padding: '0.5rem' }}
      />
      <button type="submit" disabled={mutation.isPending || text.trim().length < 1}>
        {mutation.isPending ? 'Adding…' : 'Add'}
      </button>
    </form>
  )
}


