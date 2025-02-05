// src/lib/supabase/hooks/test.ts

import { useState, useCallback } from 'react'
import { useAuth } from '@clerk/nextjs'
import type { TestItem, CreateTestItem, UpdateTestItem } from '../types/test'
import { testService } from '../services/test'
import { SupabaseError } from '../errors/supabase'

export function useTestItems() {
  const { getToken } = useAuth()
  const [items, setItems] = useState<TestItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<SupabaseError | null>(null)

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true)
      const token = await getToken({ template: 'supabase' })
      const data = await testService.getAll(token)
      setItems(data)
      setError(null)
    } catch (err) {
      setError(SupabaseError.fromError(err))
    } finally {
      setLoading(false)
    }
  }, [getToken])

  const createItem = useCallback(async (item: CreateTestItem) => {
    try {
      setLoading(true)
      const token = await getToken({ template: 'supabase' })
      const newItem = await testService.create(item, token)
      setItems(prev => [...prev, newItem])
      setError(null)
      return newItem
    } catch (err) {
      setError(SupabaseError.fromError(err))
      throw err
    } finally {
      setLoading(false)
    }
  }, [getToken])

  const updateItem = useCallback(async (id: string, updates: UpdateTestItem) => {
    try {
      setLoading(true)
      const token = await getToken({ template: 'supabase' })
      const updated = await testService.update(id, updates, token)
      setItems(prev => prev.map(item => item.id === id ? updated : item))
      setError(null)
      return updated
    } catch (err) {
      setError(SupabaseError.fromError(err))
      throw err
    } finally {
      setLoading(false)
    }
  }, [getToken])

  const deleteItem = useCallback(async (id: string) => {
    try {
      setLoading(true)
      const token = await getToken({ template: 'supabase' })
      await testService.delete(id, token)
      setItems(prev => prev.filter(item => item.id !== id))
      setError(null)
    } catch (err) {
      setError(SupabaseError.fromError(err))
      throw err
    } finally {
      setLoading(false)
    }
  }, [getToken])

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem
  }
}