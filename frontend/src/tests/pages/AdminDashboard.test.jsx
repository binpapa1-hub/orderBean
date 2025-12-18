import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import AdminDashboardNew from '../../pages/AdminDashboardNew'

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('AdminDashboard - 관리자 화면', () => {
  
  describe('1. 헤더 테스트', () => {
    it('로고가 표시되어야 한다', () => {
      renderWithRouter(<AdminDashboardNew />)
      expect(screen.getByText('OrderBean - 커피 주문')).toBeInTheDocument()
    })

    it('주문하기 링크가 표시되어야 한다', () => {
      renderWithRouter(<AdminDashboardNew />)
      expect(screen.getByText('주문하기')).toBeInTheDocument()
    })

    it('관리자 버튼이 표시되어야 한다', () => {
      renderWithRouter(<AdminDashboardNew />)
      expect(screen.getByRole('button', { name: /관리자/i })).toBeInTheDocument()
    })
  })

  describe('2. 관리자 대시보드 섹션 테스트', () => {
    it('관리자 대시보드 제목이 표시되어야 한다', () => {
      renderWithRouter(<AdminDashboardNew />)
      expect(screen.getByText('관리자 대시보드')).toBeInTheDocument()
    })

    it('총 주문 수가 표시되어야 한다', () => {
      renderWithRouter(<AdminDashboardNew />)
      expect(screen.getByText(/총 주문/)).toBeInTheDocument()
    })

    it('주문 접수 수가 표시되어야 한다', () => {
      renderWithRouter(<AdminDashboardNew />)
      const dashboardSection = screen.getByText('관리자 대시보드').closest('section')
      expect(dashboardSection.textContent).toContain('주문 접수')
    })

    it('제조 중 수가 표시되어야 한다', () => {
      renderWithRouter(<AdminDashboardNew />)
      expect(screen.getByText(/제조 중/)).toBeInTheDocument()
    })

    it('제조 완료 수가 표시되어야 한다', () => {
      renderWithRouter(<AdminDashboardNew />)
      expect(screen.getByText(/제조 완료/)).toBeInTheDocument()
    })
  })

  describe('3. 재고 현황 섹션 테스트', () => {
    it('재고 현황 제목이 표시되어야 한다', () => {
      renderWithRouter(<AdminDashboardNew />)
      expect(screen.getByText('재고 현황')).toBeInTheDocument()
    })

    it('메뉴 3개의 재고가 표시되어야 한다', () => {
      renderWithRouter(<AdminDashboardNew />)
      expect(screen.getByText('아메리카노 (ICE)')).toBeInTheDocument()
      expect(screen.getByText('아메리카노 (HOT)')).toBeInTheDocument()
      expect(screen.getByText('카페라떼')).toBeInTheDocument()
    })

    it('재고 수량이 표시되어야 한다', () => {
      renderWithRouter(<AdminDashboardNew />)
      const stockTexts = screen.getAllByText(/\d+개/)
      expect(stockTexts.length).toBeGreaterThanOrEqual(3)
    })

    it('재고 증가 버튼(+)이 있어야 한다', () => {
      renderWithRouter(<AdminDashboardNew />)
      const plusButtons = screen.getAllByRole('button', { name: '+' })
      expect(plusButtons.length).toBe(3)
    })

    it('재고 감소 버튼(-)이 있어야 한다', () => {
      renderWithRouter(<AdminDashboardNew />)
      const minusButtons = screen.getAllByRole('button', { name: '-' })
      expect(minusButtons.length).toBe(3)
    })

    it('+ 버튼 클릭 시 재고가 1 증가해야 한다', async () => {
      renderWithRouter(<AdminDashboardNew />)
      const plusButtons = screen.getAllByRole('button', { name: '+' })
      
      // 첫 번째 메뉴의 + 버튼 클릭
      fireEvent.click(plusButtons[0])
      
      await waitFor(() => {
        expect(screen.getByText('11개')).toBeInTheDocument()
      })
    })

    it('- 버튼 클릭 시 재고가 1 감소해야 한다', async () => {
      renderWithRouter(<AdminDashboardNew />)
      const minusButtons = screen.getAllByRole('button', { name: '-' })
      
      // 첫 번째 메뉴의 - 버튼 클릭
      fireEvent.click(minusButtons[0])
      
      await waitFor(() => {
        expect(screen.getByText('9개')).toBeInTheDocument()
      })
    })

    it('재고 10개 이상이면 "정상" 표시', () => {
      renderWithRouter(<AdminDashboardNew />)
      const normalLabels = screen.getAllByText('정상')
      expect(normalLabels.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('4. 주문 현황 섹션 테스트', () => {
    it('주문 현황 제목이 표시되어야 한다', () => {
      renderWithRouter(<AdminDashboardNew />)
      expect(screen.getByText('주문 현황')).toBeInTheDocument()
    })

    it('주문 날짜와 시간이 표시되어야 한다', () => {
      renderWithRouter(<AdminDashboardNew />)
      expect(screen.getByText(/월.*일.*:/)).toBeInTheDocument()
    })

    it('주문 메뉴가 표시되어야 한다', () => {
      renderWithRouter(<AdminDashboardNew />)
      const orderSection = screen.getByText('주문 현황').closest('section')
      expect(within(orderSection).getByText(/아메리카노\(ICE\) x 1/)).toBeInTheDocument()
    })

    it('주문 금액이 표시되어야 한다', () => {
      renderWithRouter(<AdminDashboardNew />)
      const orderSection = screen.getByText('주문 현황').closest('section')
      expect(within(orderSection).getByText(/4,000원/)).toBeInTheDocument()
    })

    it('주문 접수 상태 버튼이 표시되어야 한다', () => {
      renderWithRouter(<AdminDashboardNew />)
      expect(screen.getByRole('button', { name: /주문 접수/i })).toBeInTheDocument()
    })

    it('주문 접수 버튼 클릭 시 제조 시작으로 상태 변경', async () => {
      renderWithRouter(<AdminDashboardNew />)
      const statusButton = screen.getByRole('button', { name: /주문 접수/i })
      
      fireEvent.click(statusButton)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /제조 시작/i })).toBeInTheDocument()
      })
    })
  })

  describe('5. 재고 상태 표시 테스트', () => {
    it('재고가 5개 미만이면 "주의" 표시', async () => {
      renderWithRouter(<AdminDashboardNew />)
      const minusButtons = screen.getAllByRole('button', { name: '-' })
      
      // 재고를 4개로 만들기 위해 6번 클릭
      for (let i = 0; i < 6; i++) {
        fireEvent.click(minusButtons[0])
      }
      
      await waitFor(() => {
        expect(screen.getByText('주의')).toBeInTheDocument()
      })
    })

    it('재고가 0개이면 "품절" 표시', async () => {
      renderWithRouter(<AdminDashboardNew />)
      const minusButtons = screen.getAllByRole('button', { name: '-' })
      
      // 재고를 0개로 만들기 위해 10번 클릭
      for (let i = 0; i < 10; i++) {
        fireEvent.click(minusButtons[0])
      }
      
      await waitFor(() => {
        expect(screen.getByText('품절')).toBeInTheDocument()
      })
    })
  })
})

