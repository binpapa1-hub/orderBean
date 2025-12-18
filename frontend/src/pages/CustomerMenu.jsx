import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// 임의의 커피 메뉴 데이터
const MOCK_MENUS = [
  {
    id: 1,
    name: '아메리카노(ICE)',
    price: 4000,
    description: '간단한 설명...',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=300&h=300&fit=crop',
    options: [
      { name: '샷 추가', price: 500 },
      { name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 2,
    name: '아메리카노(HOT)',
    price: 4000,
    description: '간단한 설명...',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&h=300&fit=crop',
    options: [
      { name: '샷 추가', price: 500 },
      { name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 3,
    name: '카페라떼',
    price: 5000,
    description: '간단한 설명...',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=300&h=300&fit=crop',
    options: [
      { name: '샷 추가', price: 500 },
      { name: '시럽 추가', price: 0 }
    ]
  }
]

const CustomerMenu = () => {
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  const [selectedOptions, setSelectedOptions] = useState({})

  // 옵션 체크박스 변경 핸들러
  const handleOptionChange = (menuId, optionName, checked) => {
    setSelectedOptions(prev => {
      const menuOptions = prev[menuId] || []
      if (checked) {
        return { ...prev, [menuId]: [...menuOptions, optionName] }
      } else {
        return { ...prev, [menuId]: menuOptions.filter(o => o !== optionName) }
      }
    })
  }

  // 장바구니에 추가 - 같은 메뉴+옵션은 수량 증가
  const addToCart = (menu) => {
    const menuSelectedOptions = selectedOptions[menu.id] || []
    
    // 옵션 가격 계산
    const optionPrice = menu.options
      .filter(opt => menuSelectedOptions.includes(opt.name))
      .reduce((sum, opt) => sum + opt.price, 0)
    
    const itemPrice = menu.price + optionPrice
    const optionsKey = [...menuSelectedOptions].sort().join(',')

    // 동일한 메뉴+옵션 조합이 있는지 확인
    const existingItemIndex = cart.findIndex(
      item => item.menuId === menu.id && 
      [...item.selectedOptions].sort().join(',') === optionsKey
    )

    if (existingItemIndex >= 0) {
      // 수량 증가
      setCart(prev => prev.map((item, index) => 
        index === existingItemIndex 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      // 새 아이템 추가
      const cartItem = {
        menuId: menu.id,
        menuName: menu.name,
        price: itemPrice,
        quantity: 1,
        selectedOptions: menuSelectedOptions
      }
      setCart(prev => [...prev, cartItem])
    }
    
    // 옵션 초기화
    setSelectedOptions(prev => ({ ...prev, [menu.id]: [] }))
  }

  // 총 금액 계산
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // 주문하기
  const handleOrder = () => {
    const newOrder = {
      id: Date.now(),
      items: cart,
      totalAmount,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    
    // 기존 주문 내역 불러오기
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    
    // 새 주문 추가
    localStorage.setItem('orders', JSON.stringify([newOrder, ...existingOrders]))
    
    alert('주문이 완료되었습니다!')
    setCart([])
    navigate('/orders')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 (Navbar) */}
      <header 
        role="banner"
        className="bg-white border-b border-gray-300 flex items-center justify-between px-6 py-4"
      >
        <div className="text-xl font-bold text-gray-800">OrderBean - 커피 주문</div>
        <div className="flex items-center space-x-4">
          <span 
            className="text-gray-600 cursor-pointer hover:text-gray-900"
            onClick={() => navigate('/orders')}
          >
            주문하기
          </span>
          <button 
            className="px-4 py-2 border border-gray-400 rounded text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => navigate('/admin')}
          >
            관리자
          </button>
        </div>
      </header>

      {/* 메뉴 목록 */}
      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MOCK_MENUS.map((menu) => (
            <div 
              key={menu.id} 
              data-testid="menu-card"
              className="bg-white border border-gray-200 p-4"
            >
              {/* 이미지 */}
              <div 
                data-testid="menu-image-placeholder"
                className="w-full h-32 bg-gray-100 border border-gray-300 flex items-center justify-center mb-3 overflow-hidden"
              >
                {menu.image ? (
                  <img 
                    src={menu.image} 
                    alt={menu.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <svg className="w-full h-full text-gray-300" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="1" />
                    <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="1" />
                  </svg>
                )}
              </div>

              {/* 메뉴명 */}
              <h3 className="text-base font-bold text-gray-900">{menu.name}</h3>
              
              {/* 가격 */}
              <p className="text-sm text-gray-500 mb-2">{menu.price.toLocaleString()}원</p>
              
              {/* 설명 */}
              <p className="text-xs text-gray-400 mb-3">{menu.description}</p>

              {/* 옵션 */}
              <div className="space-y-1 mb-4">
                {menu.options.map((option) => (
                  <label key={option.name} className="flex items-center text-sm text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mr-2 w-3 h-3"
                      checked={(selectedOptions[menu.id] || []).includes(option.name)}
                      onChange={(e) => handleOptionChange(menu.id, option.name, e.target.checked)}
                    />
                    <span className="text-gray-500">{option.name} (+{option.price.toLocaleString()}원)</span>
                  </label>
                ))}
              </div>

              {/* 담기 버튼 */}
              <button
                onClick={() => addToCart(menu)}
                className="px-6 py-1.5 border border-gray-400 rounded text-gray-700 hover:bg-gray-50 text-sm"
              >
                담기
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* 장바구니 영역 - 2분할 레이아웃 */}
      {cart.length > 0 && (
        <section 
          data-testid="cart-section"
          className="bg-white border border-gray-200 mx-6 mb-6 p-6"
        >
          <h2 className="text-base font-bold text-gray-900 mb-4">장바구니</h2>
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
            {/* 왼쪽: 주문 내역 */}
            <div className="flex-1">
              <table className="w-full text-sm">
                <tbody>
                  {cart.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 last:border-0">
                      <td className="py-2 text-gray-800">
                        {item.menuName}
                        {item.selectedOptions.length > 0 && (
                          <span className="text-gray-500 ml-1">
                            ({item.selectedOptions.join(', ')})
                          </span>
                        )}
                      </td>
                      <td className="py-2 text-gray-600 text-center w-16">
                        X {item.quantity}
                      </td>
                      <td className="py-2 text-gray-800 text-right w-24">
                        {(item.price * item.quantity).toLocaleString()}원
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 오른쪽: 총 금액 + 주문하기 버튼 */}
            <div className="flex flex-col items-end space-y-4 md:border-l md:border-gray-200 md:pl-6">
              <div className="flex items-center space-x-3">
                <span className="text-gray-600">총 금액</span>
                <span className="text-xl font-bold text-gray-900">{totalAmount.toLocaleString()}원</span>
              </div>
              <button
                onClick={handleOrder}
                className="px-8 py-2 border border-gray-400 rounded text-gray-700 hover:bg-gray-50"
              >
                주문하기
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default CustomerMenu
