import { useQuery, useQueryClient } from '@tanstack/react-query'
import { listItems } from './lib/api'
import { ItemList } from './components/ItemList'
import { AddItem } from './components/AddItem'
import { useState } from 'react'

export default function App() {
  const queryClient = useQueryClient()

  const [shouldThrow, setShouldThrow] = useState(false)
  if (shouldThrow) {
    throw new Error('Test error for error boundary!')
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['items'],
    queryFn: listItems,
  })

  return (
    <div style={{ maxWidth: 640, margin: '2rem auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Edge Boot</h1>

      <button
        onClick={() => setShouldThrow(true)}
        style={{ margin: '1rem 0', padding: '0.5rem', backgroundColor: '#ff6b6b', color: 'white', border: 'none', borderRadius: 4 }}
      >
        Test Error Boundary
      </button>

      <AddItem onAdded={() => queryClient.invalidateQueries({ queryKey: ['items'] })} />

      {isLoading && <p>Loading…</p>}
      {isError && <p>Failed to load items.</p>}
      {data && <ItemList items={data} />}
    </div>
  )
}
