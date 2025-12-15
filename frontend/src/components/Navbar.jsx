import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-600">☕ OrderBean</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/cafes" className="text-gray-700 hover:text-primary-600">
              카페 찾기
            </Link>
            
            {user ? (
              <>
                {user.role === 'merchant' || user.role === 'admin' ? (
                  <Link to="/admin" className="text-gray-700 hover:text-primary-600">
                    관리자
                  </Link>
                ) : null}
                <Link to="/orders" className="text-gray-700 hover:text-primary-600">
                  주문 내역
                </Link>
                <span className="text-gray-700">안녕하세요, {user.name}님</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600">
                  로그인
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

