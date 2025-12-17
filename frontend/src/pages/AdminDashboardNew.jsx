import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Mock 데이터 - PRD 기준
const INITIAL_INVENTORY = [
  { id: 1, name: '아메리카노 (ICE)', stock: 10 },
  { id: 2, name: '아메리카노 (HOT)', stock: 10 },
  { id: 3, name: '카페라떼', stock: 10 }
]

const INITIAL_ORDERS = [
  {
    id: 1,
    createdAt: '2025-07-31T13:00:00Z',
    items: [{ menuName: '아메리카노(ICE)', quantity: 1 }],
    totalAmount: 4000,
    status: 'pending'
  }
]

const AdminDashboardNew = () => {
  const navigate = useNavigate()
  const [inventory, setInventory] = useState(INITIAL_INVENTORY)
  const [orders, setOrders] = useState(INITIAL_ORDERS)

  // 통계 계산
  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length,
    preparingOrders: orders.filter(o => o.status === 'preparing').length,
    completedOrders: orders.filter(o => o.status === 'ready' || o.status === 'completed').length
  }

  // 재고 증가
  const incrementStock = (id) => {
    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, stock: item.stock + 1 } : item
    ))
  }

  // 재고 감소
  const decrementStock = (id) => {
    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, stock: Math.max(0, item.stock - 1) } : item
    ))
  }

  // 재고 상태 표시: 0개=품절, 5개 미만=주의, 그 외=정상
  const getStockStatus = (stock) => {
    if (stock === 0) return { text: '품절', color: 'text-red-600' }
    if (stock < 5) return { text: '주의', color: 'text-yellow-600' }
    return { text: '정상', color: 'text-green-600' }
  }

  // 주문 상태 변경
  const handleStatusChange = (orderId) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order
      
      const statusFlow = {
        'pending': 'confirmed',
        'confirmed': 'preparing',
        'preparing': 'ready',
        'ready': 'completed'
      }
      
      return { ...order, status: statusFlow[order.status] || order.status }
    }))
  }

  // 상태 버튼 텍스트
  const getStatusButtonText = (status) => {
    const texts = {
      'pending': '주문 접수',
      'confirmed': '제조 시작',
      'preparing': '제조 중',
      'ready': '제조 완료',
      'completed': '완료',
      'cancelled': '취소됨'
    }
    return texts[status] || status
  }

  // 날짜 포맷
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${month}월 ${day}일 ${hours}:${minutes}`
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 (Navbar) - PRD 기준 */}
      <header 
        role="banner"
        className="bg-white border-b border-gray-300 flex items-center justify-between px-6 py-4"
      >
        <div className="text-xl font-bold text-gray-800">OrderBean - 커피 주문</div>
        <div className="flex items-center space-x-4">
          <span 
            className="text-gray-600 cursor-pointer hover:text-gray-900"
            onClick={() => navigate('/')}
          >
            주문하기
          </span>
          <button 
            className="px-4 py-2 border border-gray-400 rounded text-gray-700 bg-gray-50"
          >
            관리자
          </button>
        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* 관리자 대시보드 섹션 - PRD 기준: 4개 항목 */}
        <section className="bg-white border border-gray-200 p-4">
          <h2 className="text-base font-bold text-gray-900 underline mb-3">관리자 대시보드</h2>
          <p className="text-sm text-gray-700">
            총 주문 {stats.totalOrders} / 주문 접수 {stats.pendingOrders} / 제조 중 {stats.preparingOrders} / 제조 완료 {stats.completedOrders}
          </p>
        </section>

        {/* 재고 현황 섹션 - PRD 기준: 메뉴 3개 + 상태 표시 */}
        <section className="bg-white border border-gray-200 p-4">
          <h2 className="text-base font-bold text-gray-900 underline mb-4">재고 현황</h2>
          <div className="flex flex-wrap gap-4">
            {inventory.map((item) => {
              const stockStatus = getStockStatus(item.stock)
              return (
                <div 
                  key={item.id}
                  className="border border-gray-200 p-3 min-w-[160px]"
                >
                  <p className="text-sm text-gray-800 mb-1">{item.name}</p>
                  <div className="flex items-center space-x-3 mb-2">
                    <p className="text-sm text-gray-600">{item.stock}개</p>
                    <span className={`text-xs font-medium ${stockStatus.color}`}>
                      {stockStatus.text}
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => incrementStock(item.id)}
                      className="w-6 h-6 border border-gray-400 text-gray-600 hover:bg-gray-50 text-sm flex items-center justify-center"
                    >
                      +
                    </button>
                    <button
                      onClick={() => decrementStock(item.id)}
                      className="w-6 h-6 border border-gray-400 text-gray-600 hover:bg-gray-50 text-sm flex items-center justify-center"
                    >
                      -
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 주문 현황 섹션 - PRD 기준 */}
        <section className="bg-white border border-gray-200 p-4">
          <h2 className="text-base font-bold text-gray-900 underline mb-4">주문 현황</h2>
          <div className="space-y-3">
            {orders.map((order) => (
              <div 
                key={order.id}
                className="flex items-center justify-between text-sm py-2 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center space-x-6">
                  <span className="text-gray-600 w-32">{formatDate(order.createdAt)}</span>
                  <span className="text-gray-800">
                    {order.items.map(item => `${item.menuName} x ${item.quantity}`).join(', ')}
                  </span>
                  <span className="text-gray-800 font-medium">{order.totalAmount.toLocaleString()}원</span>
                </div>
                <button
                  onClick={() => handleStatusChange(order.id)}
                  disabled={order.status === 'completed' || order.status === 'cancelled'}
                  className={`px-4 py-1.5 border rounded text-sm ${
                    order.status === 'completed' || order.status === 'cancelled'
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'border-gray-400 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {getStatusButtonText(order.status)}
                </button>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-gray-500 text-sm">주문이 없습니다.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default AdminDashboardNew
