// src/features/user-profile/components/profile-view.tsx

'use client'

import { useState } from 'react'
import { useProfile } from '../hooks/use-profile'
import { ProfileForm } from './profile-form'

export function ProfileView() {
  const { profile, loading, error } = useProfile()
  const [isEditing, setIsEditing] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="text-red-700">Error loading profile: {error.message}</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="bg-yellow-50 p-4 rounded-md">
        <div className="text-yellow-700">No profile found. One will be created automatically.</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {!isEditing ? (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Your Profile</h3>
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Edit Profile
                </button>
              </div>
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Display Name</h4>
                  <p className="mt-1 text-sm text-gray-900">{profile.display_name || 'Not set'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Email</h4>
                  <p className="mt-1 text-sm text-gray-900">{profile.email || 'Not set'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Bio</h4>
                  <p className="mt-1 text-sm text-gray-900">{profile.bio || 'Not set'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Timezone</h4>
                  <p className="mt-1 text-sm text-gray-900">{profile.timezone || 'Not set'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Edit Profile</h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
              <ProfileForm onSuccess={() => setIsEditing(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}