import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

const Menu = () => {
  const { cafeId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [cafe, setCafe] = useState(null)
  const [menus, setMenus] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCafe()
    fetchMenus()
  }, [cafeId])

  const fetchCafe = async () => {
    try {
      const response = await axios.get(`/api/cafes/${cafeId}`)
      setCafe(response.data)
    } catch (error) {
      toast.error('카페 정보를 불러오는데 실패했습니다')
    }
  }

  const fetchMenus = async () => {
    try {
      const response = await axios.get(`/api/menus?cafeId=${cafeId}`)
      setMenus(response.data)
    } catch (error) {
      toast.error('메뉴를 불러오는데 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (menu) => {
    if (!user) {
      toast.error('로그인이 필요합니다')
      navigate('/login')
      return
    }

    const cartItem = {
      menuId: menu._id,
      menuName: menu.name,
      price: menu.price,
      quantity: 1,
      selectedOptions: {}
    }
    setCart([...cart, cartItem])
    toast.success('장바구니에 추가되었습니다')
  }

  const goToCart = () => {
    if (cart.length === 0) {
      toast.error('장바구니가 비어있습니다')
      return
    }
    // Store cart in localStorage temporarily
    localStorage.setItem('cart', JSON.stringify({ cafeId, items: cart }))
    navigate('/cart')
  }

  const categories = ['all', 'coffee', 'tea', 'beverage', 'dessert', 'food']
  const filteredMenus = selectedCategory === 'all'
    ? menus
    : menus.filter(menu => menu.category === selectedCategory)

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      {cafe && (
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{cafe.name}</h1>
          <p className="text-gray-600">{cafe.address}</p>
        </div>
      )}

      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {category === 'all' ? '전체' :
             category === 'coffee' ? '커피' :
             category === 'tea' ? '차' :
             category === 'beverage' ? '음료' :
             category === 'dessert' ? '디저트' : '음식'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredMenus.map((menu) => (
          <div
            key={menu._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {menu.image ? (
                <img src={menu.image} alt={menu.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">☕</span>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-1">{menu.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{menu.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary-600">
                  {menu.price.toLocaleString()}원
                </span>
                <button
                  onClick={() => addToCart(menu)}
                  disabled={!menu.isAvailable}
                  className={`px-4 py-2 rounded-lg ${
                    menu.isAvailable
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {menu.isAvailable ? '담기' : '품절'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-4 right-4">
          <button
            onClick={goToCart}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg shadow-lg hover:bg-primary-700 font-semibold"
          >
            장바구니 ({cart.length})
          </button>
        </div>
      )}

      {filteredMenus.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">메뉴가 없습니다.</p>
        </div>
      )}
    </div>
  )
}

export default Menu

