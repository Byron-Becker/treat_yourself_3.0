'use client'

import { useEffect } from 'react'
import { useTestItems } from '@/lib/supabase/hooks/test'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export default function Home() {
  const { items, loading, error, fetchItems, createItem, updateItem, deleteItem } = useTestItems()
  const { toast } = useToast()

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleCreate = async () => {
    try {
      await createItem({ content: 'Test item ' + Date.now() })
      toast({
        title: 'Success',
        description: 'Item created'
      })
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'Failed to create item',
        variant: 'destructive'
      })
    }
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500">Error: {error.message}</div>
        <Button onClick={() => fetchItems()} className="mt-2">Retry</Button>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Test Items</h1>
        <Button onClick={handleCreate} disabled={loading}>
          Add Item
        </Button>
      </div>

      {loading && <div>Loading...</div>}
      
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between p-2 border rounded">
            <span>{item.content}</span>
            <div className="space-x-2">
              <Button 
                onClick={() => updateItem(item.id, { content: 'Updated ' + Date.now() })}
                variant="outline"
                disabled={loading}
              >
                Update
              </Button>
              <Button 
                onClick={() => deleteItem(item.id)}
                variant="destructive"
                disabled={loading}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}