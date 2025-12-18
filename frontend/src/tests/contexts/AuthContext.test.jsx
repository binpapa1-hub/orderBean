import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../../contexts/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'

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

// Test component that uses AuthContext
const TestComponent = () => {
  const { user, loading, login, register, logout } = useAuth()
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      {user ? (
        <div>
          <div data-testid="user-name">{user.name}</div>
          <div data-testid="user-email">{user.email}</div>
          <button onClick={logout} data-testid="logout-btn">Logout</button>
        </div>
      ) : (
        <div>
          <button 
            onClick={() => login('test@example.com', 'password123')} 
            data-testid="login-btn"
          >
            Login
          </button>
          <button 
            onClick={() => register({ name: 'Test', email: 'test@example.com', password: 'password123' })} 
            data-testid="register-btn"
          >
            Register
          </button>
        </div>
      )}
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should throw error when used outside AuthProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useAuth must be used within AuthProvider')
    
    consoleSpy.mockRestore()
  })

  it('should provide auth context when wrapped in AuthProvider', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    expect(screen.getByTestId('login-btn')).toBeInTheDocument()
    expect(screen.getByTestId('register-btn')).toBeInTheDocument()
  })

  it('should fetch user on mount if token exists', async () => {
    localStorage.setItem('token', 'test-token')
    const mockGet = vi.fn().mockResolvedValue({
      data: { id: '1', name: 'Test User', email: 'test@example.com' }
    })
    axios.get = mockGet

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/api/auth/me')
    })
  })

  it('should handle login successfully', async () => {
    const mockPost = vi.fn().mockResolvedValue({
      data: {
        token: 'test-token',
        user: { id: '1', name: 'Test User', email: 'test@example.com' }
      }
    })
    axios.post = mockPost

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const loginBtn = screen.getByTestId('login-btn')
    loginBtn.click()

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/api/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      })
      expect(toast.success).toHaveBeenCalledWith('로그인 성공!')
    })
  })

  it('should handle login failure', async () => {
    const mockPost = vi.fn().mockRejectedValue({
      response: {
        data: { message: 'Invalid credentials' }
      }
    })
    axios.post = mockPost

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const loginBtn = screen.getByTestId('login-btn')
    loginBtn.click()

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled()
    })
  })

  it('should handle register successfully', async () => {
    const mockPost = vi.fn().mockResolvedValue({
      data: {
        token: 'test-token',
        user: { id: '1', name: 'Test', email: 'test@example.com' }
      }
    })
    axios.post = mockPost

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const registerBtn = screen.getByTestId('register-btn')
    registerBtn.click()

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/api/auth/register', {
        name: 'Test',
        email: 'test@example.com',
        password: 'password123'
      })
      expect(toast.success).toHaveBeenCalledWith('회원가입 성공!')
    })
  })

  it('should handle logout', async () => {
    // First login
    const mockPost = vi.fn().mockResolvedValue({
      data: {
        token: 'test-token',
        user: { id: '1', name: 'Test User', email: 'test@example.com' }
      }
    })
    axios.post = mockPost

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const loginBtn = screen.getByTestId('login-btn')
    loginBtn.click()

    await waitFor(() => {
      expect(screen.getByTestId('logout-btn')).toBeInTheDocument()
    })

    // Then logout
    const logoutBtn = screen.getByTestId('logout-btn')
    logoutBtn.click()

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('로그아웃되었습니다')
      expect(localStorage.getItem('token')).toBeNull()
    })
  })

  it('should clear token on fetch user error', async () => {
    localStorage.setItem('token', 'invalid-token')
    const mockGet = vi.fn().mockRejectedValue({
      response: { status: 401 }
    })
    axios.get = mockGet

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBeNull()
    })
  })
})

