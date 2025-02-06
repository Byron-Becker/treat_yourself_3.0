// src/features/user-profile/hooks/use-profile.ts

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import type { UserProfile, UpdateUserProfile } from '../types/profile.types'
import { userProfileService } from '../services/profile.service'
import { SupabaseError } from '@/lib/supabase/errors/supabase'
import { useErrorHandler } from '@/lib/errors/handlers'

export function useProfile() {
  const isMounted = useRef(false)
  const fetchInProgress = useRef(false)
  const { userId, getToken } = useAuth()
  const { user } = useUser()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<SupabaseError | null>(null)
  const handleError = useErrorHandler()

  const authState = useMemo(() => ({
    userId,
    user,
    getToken
  }), [userId, user, getToken])

  const fetchProfile = useCallback(async () => {
    if (!authState.userId || fetchInProgress.current) {
      return
    }

    try {
      fetchInProgress.current = true
      setLoading(true)
      setError(null)
      const token = await authState.getToken({ template: 'supabase' })
      let data = await userProfileService.getProfile(authState.userId, token)
      
      if (!data && authState.user) {
        const newProfile = {
          id: authState.userId,
          display_name: authState.user.username || 
                       authState.user.firstName && authState.user.lastName ? 
                       `${authState.user.firstName} ${authState.user.lastName}` :
                       authState.user.firstName || 'New User',
          email: authState.user.primaryEmailAddress?.emailAddress || '',
          avatar_url: authState.user.imageUrl || undefined,
        }
        data = await userProfileService.createProfile(newProfile, token)
      }

      if (isMounted.current) {
        setProfile(data)
      }
    } catch (err) {
      if (isMounted.current) {
        const supabaseError = SupabaseError.fromError(err)
        setError(supabaseError)
        handleError(supabaseError)
      }
    } finally {
      if (isMounted.current) {
        setLoading(false)
      }
      fetchInProgress.current = false
    }
  }, [authState, handleError])

  const updateProfile = useCallback(async (updates: UpdateUserProfile) => {
    if (!authState.userId) return

    try {
      setLoading(true)
      setError(null)
      const token = await authState.getToken({ template: 'supabase' })
      const updated = await userProfileService.updateProfile(authState.userId, updates, token)
      if (isMounted.current) {
        setProfile(updated)
      }
      return updated
    } catch (err) {
      const supabaseError = SupabaseError.fromError(err)
      if (isMounted.current) {
        setError(supabaseError)
        handleError(supabaseError)
      }
      throw supabaseError
    } finally {
      if (isMounted.current) {
        setLoading(false)
      }
    }
  }, [authState, handleError])

  useEffect(() => {
    isMounted.current = true
    
    if (authState.userId && !profile && !error) {
      fetchProfile()
    }

    return () => {
      isMounted.current = false
    }
  }, [authState.userId, profile, error, fetchProfile])

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    user: authState.user
  }
}