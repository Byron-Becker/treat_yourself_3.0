// src/lib/supabase/types/test.ts

export interface TestItem {
    id: string
    created_at: string
    content: string
  }
  
  export type CreateTestItem = Omit<TestItem, 'id' | 'created_at'>
  export type UpdateTestItem = Partial<CreateTestItem>