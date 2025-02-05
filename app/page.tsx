import { createClerkSupabaseClientSsr } from '@/lib/supabase/client-ssr'
import AddTaskForm from './AddTaskForm'

interface Task {
  id: number
  name: string
}

export default async function Home() {
  // Create and await the Supabase client
  const client = await createClerkSupabaseClientSsr()

  // Query the 'tasks' table to render the list of tasks
  const { data, error } = await client.from('tasks').select('*')
  if (error) {
    throw error
  }
  const tasks = data as Task[]

  return (
    <div>
      <h1>Tasks</h1>

      <div>
        {tasks?.map((task) => (
          <p key={task.id}>{task.name}</p>
        ))}
      </div>

      <AddTaskForm />
    </div>
  )
}