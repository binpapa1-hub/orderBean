import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
    fetchStats()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/admin/orders')
      setOrders(response.data)
    } catch (error) {
      toast.error('주문 목록을 불러오는데 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Stats fetch error:', error)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`/api/admin/orders/${orderId}/status`, { status: newStatus })
      toast.success('주문 상태가 업데이트되었습니다')
      fetchOrders()
    } catch (error) {
      toast.error(error.response?.data?.message || '상태 업데이트 실패')
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">관리자 대시보드</h1>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 mb-2">총 주문</h3>
            <p className="text-3xl font-bold text-primary-600">{stats.totalOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 mb-2">총 매출</h3>
            <p className="text-3xl font-bold text-primary-600">
              {stats.totalRevenue.toLocaleString()}원
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 mb-2">대기 중인 주문</h3>
            <p className="text-3xl font-bold text-primary-600">
              {orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">주문 목록</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">주문 번호</th>
                <th className="text-left py-2">고객</th>
                <th className="text-left py-2">카페</th>
                <th className="text-left py-2">금액</th>
                <th className="text-left py-2">상태</th>
                <th className="text-left py-2">작업</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="py-2 text-sm">{order._id.slice(-8)}</td>
                  <td className="py-2">{order.customerId?.name || '-'}</td>
                  <td className="py-2">{order.cafeId?.name || '-'}</td>
                  <td className="py-2">{order.totalAmount.toLocaleString()}원</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="text-sm border rounded px-2 py-1"
                    >
                      <option value="pending">pending</option>
                      <option value="confirmed">confirmed</option>
                      <option value="preparing">preparing</option>
                      <option value="ready">ready</option>
                      <option value="completed">completed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              주문이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

