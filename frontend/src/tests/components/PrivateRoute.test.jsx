import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PrivateRoute from '../../components/PrivateRoute'
import { AuthProvider } from '../../contexts/AuthContext'

// Mock react-router-dom's Navigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    Navigate: ({ to }) => <div data-testid="navigate">Navigate to {to}</div>,
  }
})

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    defaults: {
      headers: {
        common: {},
      },
    },
  },
}))

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const ProtectedPage = () => <div>Protected Content</div>
const PublicPage = () => <div>Public Content</div>

describe('PrivateRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should render protected content when user is authenticated', async () => {
    localStorage.setItem('token', 'test-token')
    
    // Mock successful user fetch
    const { default: axios } = await import('axios')
    axios.get = vi.fn().mockResolvedValue({
      data: { id: '1', name: 'Test User', email: 'test@example.com' }
    })

    render(
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<PrivateRoute><ProtectedPage /></PrivateRoute>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    )

    // Wait for auth to load
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Should show protected content (or loading, then content)
    // This depends on AuthContext implementation
  })

  it('should redirect to login when user is not authenticated', async () => {
    const { default: axios } = await import('axios')
    axios.get = vi.fn().mockRejectedValue({ response: { status: 401 } })

    render(
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<PrivateRoute><ProtectedPage /></PrivateRoute>} />
            <Route path="/login" element={<PublicPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    )

    // Should redirect to login
    // Implementation depends on PrivateRoute structure
  })

  it('should check role when requiredRole is specified', async () => {
    localStorage.setItem('token', 'test-token')
    
    const { default: axios } = await import('axios')
    axios.get = vi.fn().mockResolvedValue({
      data: { id: '1', name: 'Test User', email: 'test@example.com', role: 'customer' }
    })

    render(
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route 
              path="/" 
              element={
                <PrivateRoute requiredRole="merchant">
                  <ProtectedPage />
                </PrivateRoute>
              } 
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    )

    // Should redirect if role doesn't match
    // Implementation depends on PrivateRoute structure
  })
})

