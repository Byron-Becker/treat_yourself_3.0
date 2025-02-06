// src/features/user-profile/types/profile.types.ts
// Basic interfaces for our domain model

export interface UserProfile {
    id: string               // Clerk user id
    display_name: string      
    email: string           // Clerk email
    bio?: string            // Optional in first iteration
    avatar_url?: string      // Optional in first iteration
    timezone?: string       // Optional in first iteration
    created_at: string
    updated_at: string
  }
  
  // For creating a new profile
  export type CreateUserProfile = Omit<UserProfile, 'id' | 'created_at' | 'updated_at'> 
  
  // For updating an existing profile
  export type UpdateUserProfile = Partial<Omit<UserProfile, 'id' | 'email' | 'created_at' | 'updated_at'>>