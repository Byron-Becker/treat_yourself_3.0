// lib/supabase.ts

/**
 * IMPORTANT: Clerk + Supabase Integration Pattern
 * ----------------------------------------------
 * 
 * When using Clerk authentication with Supabase in this project:
 * 
 * 1. User IDs:
 *    - Clerk uses string IDs (e.g., "user_2rxQpCGXdYW7ZZu3Q9258lZS7o3")
 *    - Never use UUID type for user IDs in Supabase
 *    - Always use TEXT type for user_id columns
 * 
 * 2. Database Tables:
 *    ✅ DO: user_id TEXT NOT NULL
 *    ❌ DON'T: user_id UUID NOT NULL
 * 
 * 3. RLS Policies:
 *    ✅ DO: auth.jwt()->>'sub'
 *    ❌ DON'T: auth.uid()
 * 
 * 4. Storage Bucket Setup:
 *    a. Drop existing policies
 *    b. Ensure owner/owner_id columns are TEXT type
 *    c. Create policies using JWT checks:
 *       USING (
 *         bucket_id = 'your_bucket_name' AND
 *         (auth.jwt()->>'sub')::text IS NOT NULL
 *       )
 * 
 * This pattern prevents UUID/string type mismatches between 
 * Clerk's authentication and Supabase's storage/database systems.
 */


