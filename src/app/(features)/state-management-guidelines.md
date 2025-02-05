State Management Guidelines for Feature-Slice Design
This document outlines state management patterns for Feature-Slice Design (FSD) with Domain-Driven Design (DDD) principles and Test-Driven Development (TDD).

Feature Structure:

features/
  feature-name/
    model/          # Business logic & state
      store.ts      # Feature-specific state
      types.ts      # Feature-specific types
      constants.ts  # Feature-specific constants
    ui/            # React components
    api/           # API integration
    lib/           # Feature-specific utilities
    tests/         # Feature tests

Core Principles
## Implementation Patterns

### A. Local Component State
```typescript
// Good: Encapsulated UI state
function FeatureComponent() {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
}
// model/store.ts
export function useFeatureStore() {
  // Feature-specific state management
  const [entities, setEntities] = useState<Entity[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  // Business logic stays with state
  const processEntity = (entity: Entity) => {
    // Domain logic here
  }

  return {
    entities,
    isLoading,
    processEntity
  }
}
// model/domain.ts
export function calculateSomething(data: FeatureData) {
  // Pure business logic
  // No UI or state management here
}
// tests/store.test.ts
describe('Feature Store', () => {
  // Test business logic in isolation
  test('processes entity correctly', () => {})
  
  // Test state changes
  test('updates state as expected', () => {})
})

// tests/ui.test.ts
describe('Feature UI', () => {
  // Test UI behavior
  test('shows loading state', () => {})
})

Feature Isolation

Each feature manages its own state
No direct state access between features
Features communicate through defined interfaces
Business logic stays within feature boundary


State Ownership

State lives as close as possible to where it's used
Clear separation between UI and business logic
Explicit data flow within feature
Traceable state changes for testing



State Location Guidelines
Local UI State
Use for component-specific state that doesn't affect business logic:

Form input values
UI toggles (modal open/closed)
Animation states
Component-specific loading states

function FeatureComponent() {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  
  // Local UI logic only
  const handleToggle = () => setIsOpen(!isOpen)
}

Feature-Level State
Use for state that affects business logic or is shared across components:

Domain entity data
Feature-wide loading states
Feature-specific error states
Selected items/filters

// model/store.ts
export function useFeatureStore() {
  // Feature-specific state
  const [entities, setEntities] = useState<Entity[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  // Business logic stays with state
  const processEntity = (entity: Entity) => {
    // Domain logic here
  }

  return {
    entities,
    isLoading,
    processEntity
  }
}

Shared State (Use Sparingly)
Only for truly global state that multiple features need:

User authentication
Theme settings
Global notifications
App-wide settings

Cross-Feature Communication
Events Pattern
Use when features need to react to changes in other features:

// Shared event types
type FeatureEvent = {
  type: 'entityCreated' | 'entityUpdated'
  payload: unknown
}

// Feature A
const emitEvent = (event: FeatureEvent) => {
  // Event emission logic
}

// Feature B
const handleEvent = (event: FeatureEvent) => {
  // Event handling logic
}

Testing Strategy
Unit Tests
Test business logic in isolation:

// tests/domain.test.ts
describe('Feature Domain Logic', () => {
  test('processes data correctly', () => {
    const result = processData(testData)
    expect(result).toMatchExpectedOutput()
  })
})

Integration Tests
Test state management and UI together:

// tests/integration.test.ts
describe('Feature Integration', () => {
  test('updates UI when state changes', async () => {
    render(<FeatureComponent />)
    // Test state changes reflect in UI
  })
})

Best Practices

State Organization

Keep state modifications traceable
Document state shape and mutations
Use TypeScript for state typing
Implement proper error boundaries


Performance

Minimize state updates
Use proper memoization
Split state logically to prevent unnecessary rerenders
Consider state granularity


Development Flow

Start with domain model
Write tests first (TDD)
Implement business logic
Add UI components last



Anti-patterns to Avoid

State Management

Directly accessing other feature's state
Mixing UI and business logic state
Keeping mutable state
Deep nesting of state


Feature Organization

Circular dependencies between features
Shared state when not necessary
Unclear feature boundaries
Mixed responsibilities



Scaling Considerations

State Persistence

Define clear serialization patterns
Handle hydration properly
Consider offline capabilities


Performance at Scale

Implement proper state splitting
Use effective caching strategies
Consider code splitting impact


Team Collaboration

Document state management decisions
Maintain clear feature ownership
Regular state management audits