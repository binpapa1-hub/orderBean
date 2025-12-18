import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { getStatusColor, getStatusText, getStatusInfo } from '../utils/orderUtils'

const OrderDetail = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`/api/orders/${orderId}`)
      setOrder(response.data)
    } catch (error) {
      toast.error('주문 정보를 불러오는데 실패했습니다')
      navigate('/orders')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!window.confirm('정말 주문을 취소하시겠습니까?')) return

    try {
      await axios.patch(`/api/orders/${orderId}/cancel`)
      toast.success('주문이 취소되었습니다')
      fetchOrder()
    } catch (error) {
      toast.error(error.response?.data?.message || '주문 취소 실패')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!order) {
    return null
  }

  const statusInfo = getStatusInfo(order.status)
  const canCancel = statusInfo.canCancel

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">주문 상세</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">
              {order.cafeId?.name || '카페'}
            </h2>
            <p className="text-gray-600">{order.cafeId?.address}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
            {getStatusText(order.status)}
          </span>
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="font-semibold mb-3">주문 품목</h3>
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2">
              <div>
                <p className="font-medium">{item.menuId?.name || '메뉴'}</p>
                <p className="text-sm text-gray-600">수량: {item.quantity}</p>
              </div>
              <span className="font-semibold">
                {(item.price * item.quantity).toLocaleString()}원
              </span>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">주문 시간</span>
            <span>{new Date(order.createdAt).toLocaleString('ko-KR')}</span>
          </div>
          {order.estimatedPickupTime && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">예상 픽업 시간</span>
              <span>{new Date(order.estimatedPickupTime).toLocaleString('ko-KR')}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-lg font-bold mt-4">
            <span>총 금액</span>
            <span className="text-primary-600">
              {order.totalAmount.toLocaleString()}원
            </span>
          </div>
        </div>

        {canCancel && (
          <button
            onClick={handleCancel}
            className="w-full mt-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            주문 취소
          </button>
        )}
      </div>
    </div>
  )
}

export default OrderDetail

