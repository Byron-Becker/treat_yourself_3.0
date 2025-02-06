// src/features/user-profile/components/profile-view.tsx

import { useCallback } from 'react'
import { useProfile } from '../hooks/use-profile'
import { Button } from '@/components/ui/button'
import { userProfileService } from '../services/profile.service'

export function ProfileView() {
  console.log('🎨 ProfileView component rendered')
  const { profile, loading, error, fetchProfile, updateProfile, user } = useProfile()

  console.log('📊 ProfileView state:', {
    hasProfile: !!profile,
    loading,
    hasError: !!error,
    hasUser: !!user
  })

  const handleCreateProfile = useCallback(async () => {
    console.log('📝 handleCreateProfile called')
    if (!user) {
      console.log('⚠️ No user available')
      return
    }

    try {
      console.log('🚀 Creating profile for user')
      const token = await user.session?.getToken({ template: 'supabase' })
      if (!token) {
        console.error('❌ No token available')
        return
      }

      await userProfileService.createProfile({
        id: user.id,
        display_name: user.fullName || user.username || 'New User',
        email: user.primaryEmailAddress?.emailAddress || '',
        bio: '',
        avatar_url: user.imageUrl || '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }, token)
      
      console.log('✅ Profile created, refreshing...')
      fetchProfile()
    } catch (err) {
      console.error('❌ Failed to create profile:', err)
    }
  }, [user, fetchProfile])

  const handleUpdateName = useCallback(async () => {
    console.log('✏️ handleUpdateName called')
    try {
      await updateProfile({
        display_name: 'New Name',
      })
    } catch {
      console.error('❌ Update failed')
    }
  }, [updateProfile])

  if (!user) {
    console.log('⏳ Waiting for user information')
    return <div>Loading user information...</div>
  }

  if (loading) {
    console.log('⌛ Loading profile data')
    return <div>Loading profile...</div>
  }

  if (error) {
    console.log('❌ Rendering error state:', error)
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <h3 className="text-red-800 font-semibold">Error loading profile</h3>
        <p className="text-red-600">{error.message}</p>
        <p className="text-sm text-red-500 mt-2">User ID: {user.id}</p>
        <Button 
          onClick={fetchProfile}
          className="mt-4 bg-red-100 text-red-800 hover:bg-red-200"
        >
          Retry
        </Button>
      </div>
    )
  }

  if (!profile) {
    console.log('➕ Rendering create profile state')
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h3 className="text-yellow-800 font-semibold">No profile found</h3>
        <p className="text-sm text-yellow-600 mt-2">Would you like to create your profile?</p>
        <Button 
          onClick={handleCreateProfile}
          className="mt-4"
        >
          Create Profile
        </Button>
      </div>
    )
  }

  console.log('✨ Rendering profile view:', profile)
  return (
    <div className="p-4 space-y-4">
      <div>
        <h2 className="text-2xl font-bold">{profile.display_name}</h2>
        <p className="text-gray-600">{profile.email}</p>
        {profile.bio && <p className="mt-2">{profile.bio}</p>}
        <p className="text-sm text-gray-500 mt-2">User ID: {user.id}</p>
      </div>
      
      <Button onClick={handleUpdateName}>
        Update Name
      </Button>
    </div>
  )
}