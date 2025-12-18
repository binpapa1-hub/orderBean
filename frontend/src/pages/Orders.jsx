import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getStatusColor, getStatusText } from '../utils/orderUtils'
import Header from '../components/common/Header'

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header 
        variant="simple"
        showAuth={false}
        showAdmin={true}
        showOrders={true}
      />

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
