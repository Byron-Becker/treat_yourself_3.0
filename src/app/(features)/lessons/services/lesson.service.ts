// features/lessons/services/lesson.service.ts

import { BaseService } from '@/lib/supabase/services/base'
import type { Lesson, CreateLesson, UpdateLesson } from '../types/lesson.types'

export class LessonService extends BaseService {
  private readonly table = 'lessons'

  async getLesson(lessonId: string, token?: string | null): Promise<Lesson | null> {
    return this.withErrorHandling(async () => {
      const client = await this.getClient(token)
      const { data, error } = await client
        .from(this.table)
        .select('*')
        .eq('id', lessonId)
        .maybeSingle()
      
      if (error) throw error
      return data
    })
  }

  async getLessonProgress(userId: string, lessonId: string, token?: string | null): Promise<Lesson | null> {
    return this.withErrorHandling(async () => {
      const client = await this.getClient(token)
      const { data, error } = await client
        .from(this.table)
        .select('*')
        .eq('id', lessonId)
        .eq('user_id', userId)
        .maybeSingle()

      if (error) throw error
      return data
    })
  }

  async createLessonProgress(lesson: CreateLesson, token?: string | null): Promise<Lesson> {
    return this.withErrorHandling(async () => {
      const client = await this.getClient(token)

      // Get the user_id from the JWT claims
      const { data: claims, error: claimsError } = await client.rpc('requesting_user_id')
      if (claimsError) throw claimsError
      if (!claims) throw new Error('No user ID found in JWT claims')

      const { data, error } = await client
        .from(this.table)
        .insert({ ...lesson, user_id: claims })
        .select()
        .single()
      
      if (error) throw error
      return data
    })
  }

  async updateLessonProgress(
    lessonId: string, 
    updates: UpdateLesson, 
    token?: string | null
  ): Promise<Lesson> {
    return this.withErrorHandling(async () => {
      const client = await this.getClient(token)
      const { data, error } = await client
        .from(this.table)
        .update({ 
          ...updates, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', lessonId)
        .select()
        .single()
      
      if (error) throw error
      return data
    })
  }

  async completeSlide(
    lessonId: string,
    slideId: string,
    token?: string | null
  ): Promise<Lesson> {
    return this.withErrorHandling(async () => {
      const client = await this.getClient(token)
      
      // First get the current lesson to update completed slides
      const { data: currentLesson, error: fetchError } = await client
        .from(this.table)
        .select('*')
        .eq('id', lessonId)
        .single()

      if (fetchError) throw fetchError

      const completedSlideIds = new Set([
        ...currentLesson.completedSlideIds,
        slideId
      ])

      // Calculate new progress
      const totalSlides = currentLesson.slides.length
      const progress = (completedSlideIds.size / totalSlides) * 100

      // Update the lesson
      const { data, error } = await client
        .from(this.table)
        .update({
          completedSlideIds: Array.from(completedSlideIds),
          progress,
          updated_at: new Date().toISOString()
        })
        .eq('id', lessonId)
        .select()
        .single()

      if (error) throw error
      return data
    })
  }
}

export const lessonService = new LessonService()