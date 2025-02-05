import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useErrorHandler } from '@/lib/errors/handlers'
import { ValidationError, AuthError, NetworkError, NotFoundError } from '@/lib/errors/base'

export function ErrorTest() {
  const handleError = useErrorHandler()
  const [loading, setLoading] = useState(false)

  const simulateValidationError = () => {
    try {
      throw new ValidationError('Invalid email format', { field: 'email' })
    } catch (error) {
      handleError(error)
    }
  }

  const simulateAuthError = () => {
    try {
      throw new AuthError('Session has expired')
    } catch (error) {
      handleError(error)
    }
  }

  const simulateNetworkError = () => {
    try {
      throw new NetworkError('Failed to connect to the server')
    } catch (error) {
      handleError(error)
    }
  }

  const simulateNotFoundError = () => {
    try {
      throw new NotFoundError('User profile not found')
    } catch (error) {
      handleError(error)
    }
  }

  const simulateAsyncError = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      throw new NetworkError('API request failed', { 
        endpoint: '/api/test',
        status: 503 
      })
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold mb-4">Error Handling Test</h2>
      
      <div className="flex flex-col gap-2">
        <Button 
          onClick={simulateValidationError}
          variant="outline"
        >
          Test Validation Error
        </Button>

        <Button 
          onClick={simulateAuthError}
          variant="outline"
        >
          Test Auth Error
        </Button>

        <Button 
          onClick={simulateNetworkError}
          variant="outline"
        >
          Test Network Error
        </Button>

        <Button 
          onClick={simulateNotFoundError}
          variant="outline"
        >
          Test Not Found Error
        </Button>

        <Button 
          onClick={simulateAsyncError}
          variant="outline"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Test Async Error'}
        </Button>
      </div>
    </div>
  )
} 