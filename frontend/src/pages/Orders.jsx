import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Orders = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // localStorage에서 주문 내역 불러오기
    const storedOrders = localStorage.getItem('orders')
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders))
    }
    setLoading(false)
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'preparing':
        return 'bg-purple-100 text-purple-800'
      case 'ready':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    const statusMap = {
      pending: '주문 접수',
      confirmed: '확인됨',
      preparing: '제조 중',
      ready: '준비 완료',
      completed: '완료',
      cancelled: '취소됨'
    }
    return statusMap[status] || status
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-300 flex items-center justify-between px-6 py-4">
        <div 
          className="text-xl font-bold text-gray-800 cursor-pointer"
          onClick={() => navigate('/')}
        >
          OrderBean - 커피 주문
        </div>
        <div className="flex items-center space-x-4">
          <span 
            className="text-gray-600 cursor-pointer hover:text-gray-900"
            onClick={() => navigate('/')}
          >
            주문하기
          </span>
          <button 
            className="px-4 py-2 border border-gray-400 rounded text-gray-700 hover:bg-gray-50"
            onClick={() => navigate('/admin')}
          >
            관리자
          </button>
        </div>
      </header>

      <main className="p-6">
        <h1 className="text-2xl font-bold mb-6">주문 내역</h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-12 border border-gray-200 rounded">
            <p className="text-gray-500 mb-4">주문 내역이 없습니다.</p>
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:underline"
            >
              메뉴로 돌아가기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-gray-200 rounded-lg p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">
                      {new Date(order.createdAt).toLocaleString('ko-KR')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.menuName}
                        {item.selectedOptions?.length > 0 && (
                          <span className="text-gray-500 ml-1">
                            ({item.selectedOptions.join(', ')})
                          </span>
                        )}
                        <span className="ml-2">x {item.quantity}</span>
                      </span>
                      <span className="text-gray-800">{(item.price * item.quantity).toLocaleString()}원</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end border-t pt-4">
                  <span className="text-lg font-bold text-gray-900">
                    총 {order.totalAmount.toLocaleString()}원
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Orders
