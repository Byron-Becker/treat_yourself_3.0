'use client'

import { useEffect } from 'react'
import { useTestItems } from '@/lib/supabase/hooks/example-hook'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { ErrorTest } from '@/components/test/error-test'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'

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
    } catch (error) {
      console.error('Failed to create item:', error)
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
    <div className="container mx-auto py-8 space-y-8">
      <div className="p-4 space-y-4 border rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Test Items</h1>
          <UserButton />
         <button>
          <Link href="/auth/sign-in">
            sign in
          </Link>
         </button>
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

      <Link href="/lessons/exercise-lesson">
        <Button className="mt-4">Go to Exercise Lesson</Button>
      </Link>

      <Link href="/onboarding">
        <Button className="mt-4 ml-4">Go to onboarding</Button>
      </Link>

      <div className="border rounded-lg shadow-sm">
        <ErrorTest />
      </div>
    </div>
  )
}