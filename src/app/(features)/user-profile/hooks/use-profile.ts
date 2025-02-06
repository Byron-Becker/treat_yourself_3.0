// src/features/user-profile/hooks/use-profile.ts

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import type { UserProfile, UpdateUserProfile } from '../types/profile.types'
import { userProfileService } from '../services/profile.service'
import { SupabaseError } from '@/lib/supabase/errors/supabase'
import { useErrorHandler } from '@/lib/errors/handlers'

export function useProfile() {
  console.log('🔄 useProfile hook rendered')
  const isMounted = useRef(false)
  const fetchInProgress = useRef(false)
  const { userId, getToken } = useAuth()
  const { user } = useUser()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<SupabaseError | null>(null)
  const handleError = useErrorHandler()

  // Create stable references for auth state
  const authState = useMemo(() => ({
    userId,
    user,
    getToken
  }), [userId, user, getToken])

  console.log('📊 Current hook state:', { 
    userId: authState.userId,
    isMounted: isMounted.current,
    fetchInProgress: fetchInProgress.current,
    profile: !!profile,
    loading,
    error: !!error,
    hasUser: !!authState.user
  })

  const fetchProfile = useCallback(async () => {
    console.log('🔍 fetchProfile called', { 
      userId: authState.userId,
      fetchInProgress: fetchInProgress.current,
      isMounted: isMounted.current
    })
    
    if (!authState.userId || fetchInProgress.current) {
      console.log('⏭️ Skipping fetch:', !authState.userId ? 'no userId' : 'fetch in progress')
      return
    }

    try {
      console.log('🚀 Starting profile fetch...')
      fetchInProgress.current = true
      setLoading(true)
      setError(null)
      const token = await authState.getToken({ template: 'supabase' })
      const data = await userProfileService.getProfile(authState.userId, token)
      console.log('✅ Profile data received:', data)
      if (isMounted.current) {
        console.log('💾 Setting profile data')
        setProfile(data)
      } else {
        console.log('⚠️ Component unmounted, skipping profile update')
      }
    } catch (err) {
      console.error('❌ Error fetching profile:', err)
      if (isMounted.current) {
        const supabaseError = SupabaseError.fromError(err)
        setError(supabaseError)
        handleError(supabaseError)
      }
    } finally {
      if (isMounted.current) {
        console.log('🏁 Setting loading to false')
        setLoading(false)
      }
      console.log('🔓 Releasing fetch lock')
      fetchInProgress.current = false
    }
  }, [authState, handleError])

  const updateProfile = useCallback(async (updates: UpdateUserProfile) => {
    console.log('✏️ updateProfile called with:', updates)
    if (!authState.userId) return

    try {
      setLoading(true)
      setError(null)
      const token = await authState.getToken({ template: 'supabase' })
      const updated = await userProfileService.updateProfile(authState.userId, updates, token)
      console.log('✅ Profile updated:', updated)
      if (isMounted.current) {
        setProfile(updated)
      }
      return updated
    } catch (err) {
      console.error('❌ Error updating profile:', err)
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
    console.log('🎣 Profile effect triggered', { 
      userId: authState.userId, 
      wasMounted: isMounted.current 
    })
    
    isMounted.current = true
    
    if (authState.userId && !profile && !error) {
      console.log('👤 User ID present and no profile loaded, fetching profile')
      fetchProfile()
    }

    return () => {
      console.log('♻️ Profile effect cleanup')
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