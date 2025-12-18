import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Login from '../../pages/Login'
import { AuthProvider } from '../../contexts/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

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

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should render login form', () => {
    renderWithRouter(<Login />)
    
    expect(screen.getByText('로그인')).toBeInTheDocument()
    expect(screen.getByLabelText(/이메일/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/비밀번호/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument()
  })

  it('should show register link', () => {
    renderWithRouter(<Login />)
    
    expect(screen.getByText(/계정이 없으신가요/i)).toBeInTheDocument()
    expect(screen.getByText('회원가입')).toBeInTheDocument()
  })

  it('should update email input value', async () => {
    const user = userEvent.setup()
    renderWithRouter(<Login />)
    
    const emailInput = screen.getByLabelText(/이메일/i)
    await user.type(emailInput, 'test@example.com')
    
    expect(emailInput).toHaveValue('test@example.com')
  })

  it('should update password input value', async () => {
    const user = userEvent.setup()
    renderWithRouter(<Login />)
    
    const passwordInput = screen.getByLabelText(/비밀번호/i)
    await user.type(passwordInput, 'password123')
    
    expect(passwordInput).toHaveValue('password123')
  })

  it('should call login API on form submit', async () => {
    const user = userEvent.setup()
    const mockPost = vi.fn().mockResolvedValue({
      data: {
        token: 'test-token',
        user: { id: '1', name: 'Test User', email: 'test@example.com' }
      }
    })
    axios.post = mockPost

    renderWithRouter(<Login />)
    
    const emailInput = screen.getByLabelText(/이메일/i)
    const passwordInput = screen.getByLabelText(/비밀번호/i)
    const submitButton = screen.getByRole('button', { name: '로그인' })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/api/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      })
    })
  })

  it('should navigate to cafes on successful login', async () => {
    const user = userEvent.setup()
    const mockPost = vi.fn().mockResolvedValue({
      data: {
        token: 'test-token',
        user: { id: '1', name: 'Test User', email: 'test@example.com' }
      }
    })
    axios.post = mockPost

    renderWithRouter(<Login />)
    
    const emailInput = screen.getByLabelText(/이메일/i)
    const passwordInput = screen.getByLabelText(/비밀번호/i)
    const submitButton = screen.getByRole('button', { name: '로그인' })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/cafes')
    })
  })

  it('should show error on failed login', async () => {
    const user = userEvent.setup()
    const mockPost = vi.fn().mockRejectedValue({
      response: {
        data: { message: 'Invalid credentials' }
      }
    })
    axios.post = mockPost

    renderWithRouter(<Login />)
    
    const emailInput = screen.getByLabelText(/이메일/i)
    const passwordInput = screen.getByLabelText(/비밀번호/i)
    const submitButton = screen.getByRole('button', { name: '로그인' })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled()
    })
  })

  it('should require email and password', () => {
    renderWithRouter(<Login />)
    
    const emailInput = screen.getByLabelText(/이메일/i)
    const passwordInput = screen.getByLabelText(/비밀번호/i)
    
    expect(emailInput).toBeRequired()
    expect(passwordInput).toBeRequired()
  })
})

