import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import CustomerMenu from '../../pages/CustomerMenu'

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

describe('CustomerMenu - 사용자 메뉴 화면', () => {
  
  describe('1. 헤더 (Navbar) 테스트', () => {
    it('로고 "COZY"가 표시되어야 한다', () => {
      renderWithRouter(<CustomerMenu />)
      expect(screen.getByText('COZY')).toBeInTheDocument()
    })

    it('주문하기 버튼이 표시되어야 한다', () => {
      renderWithRouter(<CustomerMenu />)
      const header = screen.getByRole('banner')
      expect(within(header).getByRole('button', { name: /주문하기/i })).toBeInTheDocument()
    })

    it('관리자 버튼이 표시되어야 한다', () => {
      renderWithRouter(<CustomerMenu />)
      expect(screen.getByRole('button', { name: /관리자/i })).toBeInTheDocument()
    })
  })

  describe('2. 메뉴 카드 테스트', () => {
    it('메뉴 카드가 3개 표시되어야 한다', () => {
      renderWithRouter(<CustomerMenu />)
      const menuCards = screen.getAllByTestId('menu-card')
      expect(menuCards.length).toBe(3)
    })

    it('아메리카노(ICE) 메뉴가 표시되어야 한다', () => {
      renderWithRouter(<CustomerMenu />)
      expect(screen.getByText('아메리카노(ICE)')).toBeInTheDocument()
    })

    it('아메리카노(HOT) 메뉴가 표시되어야 한다', () => {
      renderWithRouter(<CustomerMenu />)
      expect(screen.getByText('아메리카노(HOT)')).toBeInTheDocument()
    })

    it('카페라떼 메뉴가 표시되어야 한다', () => {
      renderWithRouter(<CustomerMenu />)
      expect(screen.getByText('카페라떼')).toBeInTheDocument()
    })

    it('각 메뉴에 담기 버튼이 있어야 한다', () => {
      renderWithRouter(<CustomerMenu />)
      const addButtons = screen.getAllByRole('button', { name: /담기/i })
      expect(addButtons.length).toBe(3)
    })

    it('각 메뉴에 이미지 placeholder가 있어야 한다', () => {
      renderWithRouter(<CustomerMenu />)
      const images = screen.getAllByTestId('menu-image-placeholder')
      expect(images.length).toBe(3)
    })
  })

  describe('3. 메뉴 옵션 테스트', () => {
    it('샷 추가 옵션 체크박스가 있어야 한다', () => {
      renderWithRouter(<CustomerMenu />)
      const shotOptions = screen.getAllByText(/샷 추가/)
      expect(shotOptions.length).toBeGreaterThan(0)
    })

    it('시럽 추가 옵션 체크박스가 있어야 한다', () => {
      renderWithRouter(<CustomerMenu />)
      const syrupOptions = screen.getAllByText(/시럽 추가/)
      expect(syrupOptions.length).toBeGreaterThan(0)
    })

    it('옵션 체크박스를 선택할 수 있어야 한다', () => {
      renderWithRouter(<CustomerMenu />)
      const checkboxes = screen.getAllByRole('checkbox')
      fireEvent.click(checkboxes[0])
      expect(checkboxes[0]).toBeChecked()
    })
  })

  describe('4. 장바구니 테스트', () => {
    it('담기 버튼 클릭 시 장바구니에 아이템이 추가되어야 한다', async () => {
      renderWithRouter(<CustomerMenu />)
      const addButton = screen.getAllByRole('button', { name: /담기/i })[0]
      fireEvent.click(addButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('cart-section')).toBeInTheDocument()
      })
    })

    it('장바구니에 수량이 표시되어야 한다', async () => {
      renderWithRouter(<CustomerMenu />)
      const addButton = screen.getAllByRole('button', { name: /담기/i })[0]
      fireEvent.click(addButton)
      
      await waitFor(() => {
        expect(screen.getByText(/X 1/i)).toBeInTheDocument()
      })
    })

    it('총 금액이 표시되어야 한다', async () => {
      renderWithRouter(<CustomerMenu />)
      const addButton = screen.getAllByRole('button', { name: /담기/i })[0]
      fireEvent.click(addButton)
      
      await waitFor(() => {
        expect(screen.getByText(/총 금액/)).toBeInTheDocument()
      })
    })

    it('장바구니 섹션에 주문하기 버튼이 있어야 한다', async () => {
      renderWithRouter(<CustomerMenu />)
      const addButton = screen.getAllByRole('button', { name: /담기/i })[0]
      fireEvent.click(addButton)
      
      await waitFor(() => {
        const cartSection = screen.getByTestId('cart-section')
        expect(within(cartSection).getByRole('button', { name: /주문하기/i })).toBeInTheDocument()
      })
    })
  })

  describe('5. 옵션 포함 장바구니 테스트', () => {
    it('샷 추가 옵션 선택 후 담기 시 옵션이 장바구니에 표시되어야 한다', async () => {
      renderWithRouter(<CustomerMenu />)
      
      const checkboxes = screen.getAllByRole('checkbox')
      fireEvent.click(checkboxes[0]) // 첫 번째 메뉴의 샷 추가
      
      const addButton = screen.getAllByRole('button', { name: /담기/i })[0]
      fireEvent.click(addButton)
      
      await waitFor(() => {
        const cartSection = screen.getByTestId('cart-section')
        expect(within(cartSection).getByText(/샷 추가/)).toBeInTheDocument()
      })
    })

    it('옵션 가격이 총 금액에 반영되어야 한다', async () => {
      renderWithRouter(<CustomerMenu />)
      
      const checkboxes = screen.getAllByRole('checkbox')
      fireEvent.click(checkboxes[0]) // 샷 추가 (+500원) → 4000 + 500 = 4500
      
      const addButton = screen.getAllByRole('button', { name: /담기/i })[0]
      fireEvent.click(addButton)
      
      await waitFor(() => {
        const cartSection = screen.getByTestId('cart-section')
        // 4500원이 장바구니에 표시되어야 함
        expect(cartSection.textContent).toContain('4,500')
      })
    })
  })
})
