import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders')
      setOrders(response.data)
    } catch (error) {
      toast.error('주문 내역을 불러오는데 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

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
      pending: '대기 중',
      confirmed: '확인됨',
      preparing: '제작 중',
      ready: '준비 완료',
      completed: '완료',
      cancelled: '취소됨'
    }
    return statusMap[status] || status
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">주문 내역</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">주문 내역이 없습니다.</p>
          <Link
            to="/cafes"
            className="text-primary-600 hover:underline"
          >
            카페 찾기
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-1">
                    {order.cafeId?.name || '카페'}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {new Date(order.createdAt).toLocaleString('ko-KR')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-700">
                    {order.items.length}개 품목
                  </p>
                </div>
                <span className="text-lg font-bold text-primary-600">
                  {order.totalAmount.toLocaleString()}원
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders

