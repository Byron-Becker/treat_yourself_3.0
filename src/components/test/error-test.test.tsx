import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ErrorTest } from './error-test'
import { useErrorHandler } from '@/lib/errors/handlers'
import { ValidationError, AuthError, NetworkError, NotFoundError } from '@/lib/errors/base'
import { ErrorCode } from '@/lib/errors/codes'

// Mock the useErrorHandler hook
jest.mock('@/lib/errors/handlers', () => ({
  useErrorHandler: jest.fn()
}))

// Mock the toast hook since we're not testing UI feedback
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}))

describe('ErrorTest Component', () => {
  let mockHandleError: jest.Mock

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()
    
    // Setup mock error handler
    mockHandleError = jest.fn()
    ;(useErrorHandler as jest.Mock).mockReturnValue(mockHandleError)

    // Reset timers before each test
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should handle validation error correctly', async () => {
    render(<ErrorTest />)
    
    const button = screen.getByRole('button', { name: /test validation error/i })
    expect(button).toBeInTheDocument()
    
    fireEvent.click(button)
    
    expect(mockHandleError).toHaveBeenCalledWith(
      expect.any(ValidationError)
    )
    
    const error = mockHandleError.mock.calls[0][0]
    expect(error).toBeInstanceOf(ValidationError)
    expect(error.code).toBe(ErrorCode.VALIDATION_ERROR)
    expect(error.message).toBe('Invalid email format')
    expect(error.details).toEqual({ field: 'email' })
  })

  it('should handle auth error correctly', async () => {
    render(<ErrorTest />)
    
    const button = screen.getByRole('button', { name: /test auth error/i })
    expect(button).toBeInTheDocument()
    
    fireEvent.click(button)
    
    expect(mockHandleError).toHaveBeenCalledWith(
      expect.any(AuthError)
    )
    
    const error = mockHandleError.mock.calls[0][0]
    expect(error).toBeInstanceOf(AuthError)
    expect(error.code).toBe(ErrorCode.AUTH_ERROR)
    expect(error.message).toBe('Session has expired')
  })

  it('should handle network error correctly', async () => {
    render(<ErrorTest />)
    
    const button = screen.getByRole('button', { name: /test network error/i })
    expect(button).toBeInTheDocument()
    
    fireEvent.click(button)
    
    expect(mockHandleError).toHaveBeenCalledWith(
      expect.any(NetworkError)
    )
    
    const error = mockHandleError.mock.calls[0][0]
    expect(error).toBeInstanceOf(NetworkError)
    expect(error.code).toBe(ErrorCode.NETWORK_ERROR)
    expect(error.message).toBe('Failed to connect to the server')
  })

  it('should handle not found error correctly', async () => {
    render(<ErrorTest />)
    
    const button = screen.getByRole('button', { name: /test not found error/i })
    expect(button).toBeInTheDocument()
    
    fireEvent.click(button)
    
    expect(mockHandleError).toHaveBeenCalledWith(
      expect.any(NotFoundError)
    )
    
    const error = mockHandleError.mock.calls[0][0]
    expect(error).toBeInstanceOf(NotFoundError)
    expect(error.code).toBe(ErrorCode.NOT_FOUND)
    expect(error.message).toBe('User profile not found')
  })

  it('should handle async error correctly', async () => {
    render(<ErrorTest />)
    
    const button = screen.getByRole('button', { name: /test async error/i })
    expect(button).toBeInTheDocument()
    
    fireEvent.click(button)
    
    // Button should be disabled while loading
    expect(button).toHaveAttribute('disabled')
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    
    // Fast-forward timer to complete the setTimeout
    jest.advanceTimersByTime(1000)
    
    // Need to use await act here because we're testing async state updates
    await waitFor(() => {
      expect(mockHandleError).toHaveBeenCalledWith(expect.any(NetworkError))
    }, { timeout: 2000 })
    
    const error = mockHandleError.mock.calls[0][0]
    expect(error).toBeInstanceOf(NetworkError)
    expect(error.code).toBe(ErrorCode.NETWORK_ERROR)
    expect(error.message).toBe('API request failed')
    expect(error.details).toEqual({
      endpoint: '/api/test',
      status: 503
    })
    
    // Button should be re-enabled after error
    await waitFor(() => {
      expect(button).not.toHaveAttribute('disabled')
      expect(screen.getByText('Test Async Error')).toBeInTheDocument()
    })
  })
}) 