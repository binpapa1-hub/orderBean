import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Header from '../Header'
import { AuthProvider } from '../../../contexts/AuthContext'

// useNavigate 모킹
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('기본 렌더링', () => {
    renderWithProviders(<Header />)
    expect(screen.getByText('OrderBean - 커피 주문')).toBeInTheDocument()
  })

  test('simple variant 스타일 적용', () => {
    const { container } = renderWithProviders(<Header variant="simple" />)
    const header = container.querySelector('header')
    expect(header).toHaveClass('border-b')
    expect(header).toHaveClass('border-gray-300')
  })

  test('default variant 스타일 적용', () => {
    const { container } = renderWithProviders(<Header variant="default" />)
    const header = container.querySelector('header')
    expect(header).toHaveClass('shadow-md')
  })

  test('showAuth=false일 때 인증 기능 숨김', () => {
    renderWithProviders(<Header showAuth={false} />)
    expect(screen.queryByText('로그인')).not.toBeInTheDocument()
    expect(screen.queryByText('회원가입')).not.toBeInTheDocument()
  })

  test('showAdmin=false일 때 관리자 버튼 숨김', () => {
    renderWithProviders(<Header showAdmin={false} showAuth={false} />)
    expect(screen.queryByText('관리자')).not.toBeInTheDocument()
  })

  test('showOrders=false일 때 주문하기 링크 숨김', () => {
    renderWithProviders(<Header showOrders={false} />)
    expect(screen.queryByLabelText('주문 내역 보기')).not.toBeInTheDocument()
  })

  test('접근성: Link 요소 사용', () => {
    renderWithProviders(<Header showOrders={true} />)
    const orderLink = screen.getByLabelText('주문 내역 보기')
    expect(orderLink.tagName).toBe('A')
    expect(orderLink).toHaveAttribute('href', '/orders')
  })

  test('접근성: ARIA 속성 포함', () => {
    renderWithProviders(<Header />)
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
    
    const nav = screen.getByLabelText('주요 네비게이션')
    expect(nav).toBeInTheDocument()
  })

  test('커스텀 title prop 적용', () => {
    renderWithProviders(<Header title="커스텀 제목" />)
    expect(screen.getByText('커스텀 제목')).toBeInTheDocument()
  })

  test('로고 링크가 홈으로 이동', () => {
    renderWithProviders(<Header />)
    const logoLink = screen.getByLabelText('홈으로 이동')
    expect(logoLink).toHaveAttribute('href', '/')
  })
})

