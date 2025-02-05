// src/lib/supabase/README.md

# Data Fetching Enhancements

## SWR/React Query Integration

When scaling the application, consider adding SWR or React Query for:
- Automatic caching
- Background revalidation
- Optimistic updates
- Request deduplication
- Offline support

### Implementation Location:
```
src/lib/supabase/
  ├── hooks/              
  │   ├── base.ts        # Add base hook with SWR/Query config
  │   └── [domain].ts    # Domain hooks extend base hook
```

### Example Pattern:
```typescript
// hooks/base.ts
import useSWR from 'swr'

export function useQuery<T>(key: string, fetcher: () => Promise<T>) {
  return useSWR(key, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 2000
  })
}

// hooks/[domain].ts
export function useItems() {
  const { data, error, mutate } = useQuery(
    'items', 
    () => itemsService.getAll()
  )
  // ... rest of hook logic
}
```

Choose SWR for lighter needs, React Query for more complex requirements.