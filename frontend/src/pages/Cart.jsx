import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const Cart = () => {
  const navigate = useNavigate()
  const [cartData, setCartData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('cart')
    if (stored) {
      setCartData(JSON.parse(stored))
    } else {
      toast.error('장바구니가 비어있습니다')
      navigate('/cafes')
    }
  }, [navigate])

  const removeItem = (index) => {
    const newItems = cartData.items.filter((_, i) => i !== index)
    if (newItems.length === 0) {
      localStorage.removeItem('cart')
      navigate('/cafes')
    } else {
      const newCart = { ...cartData, items: newItems }
      setCartData(newCart)
      localStorage.setItem('cart', JSON.stringify(newCart))
    }
  }

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return
    const newItems = [...cartData.items]
    newItems[index].quantity = newQuantity
    const newCart = { ...cartData, items: newItems }
    setCartData(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const calculateTotal = () => {
    return cartData?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0
  }

  const handleCheckout = async () => {
    if (!cartData || cartData.items.length === 0) {
      toast.error('장바구니가 비어있습니다')
      return
    }

    setLoading(true)
    try {
      const orderData = {
        cafeId: cartData.cafeId,
        items: cartData.items.map(item => ({
          menuId: item.menuId,
          quantity: item.quantity,
          selectedOptions: item.selectedOptions || {}
        })),
        paymentMethod: 'card'
      }

      const response = await axios.post('/api/orders', orderData)
      localStorage.removeItem('cart')
      toast.success('주문이 완료되었습니다!')
      navigate(`/orders/${response.data._id}`)
    } catch (error) {
      toast.error(error.response?.data?.message || '주문 실패')
    } finally {
      setLoading(false)
    }
  }

  if (!cartData) {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {cartData.items.map((item, index) => (
          <div key={index} className="flex items-center justify-between py-4 border-b last:border-b-0">
            <div className="flex-1">
              <h3 className="font-semibold">{item.menuName}</h3>
              <p className="text-gray-600 text-sm">{item.price.toLocaleString()}원</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(index, item.quantity - 1)}
                  className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(index, item.quantity + 1)}
                  className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <span className="font-semibold w-24 text-right">
                {(item.price * item.quantity).toLocaleString()}원
              </span>
              <button
                onClick={() => removeItem(index)}
                className="text-red-500 hover:text-red-700"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-semibold">총 금액</span>
          <span className="text-2xl font-bold text-primary-600">
            {calculateTotal().toLocaleString()}원
          </span>
        </div>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold disabled:opacity-50"
        >
          {loading ? '주문 중...' : '주문하기'}
        </button>
      </div>
    </div>
  )
}

export default Cart

