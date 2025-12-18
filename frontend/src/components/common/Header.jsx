import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

/**
 * 통합 헤더 컴포넌트
 * 
 * 모든 페이지에서 사용할 수 있는 통합 헤더 컴포넌트입니다.
 * 기존 Navbar 기능을 통합하고 접근성을 개선했습니다.
 * 
 * @param {Object} props
 * @param {string} props.variant - 헤더 스타일 변형 ('default' | 'simple')
 * @param {boolean} props.showAuth - 인증 기능 표시 여부
 * @param {boolean} props.showAdmin - 관리자 버튼 표시 여부
 * @param {boolean} props.showOrders - 주문하기 링크 표시 여부
 * @param {string} props.title - 헤더 제목 (기본값: 'OrderBean - 커피 주문')
 */
const Header = ({
  variant = 'default',
  showAuth = true,
  showAdmin = true,
  showOrders = true,
  title = 'OrderBean - 커피 주문'
}) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // 스타일 변형에 따른 클래스 결정
  const headerClasses = variant === 'simple'
    ? 'bg-white border-b border-gray-300'
    : 'bg-white shadow-md'

  const containerClasses = variant === 'simple'
    ? 'flex items-center justify-between px-6 py-4'
    : 'container mx-auto px-4'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header 
      role="banner"
      className={headerClasses}
    >
      <div className={containerClasses}>
        <div className="flex justify-between items-center h-16">
          {/* 로고/제목 */}
          <Link 
            to="/" 
            className="flex items-center space-x-2"
            aria-label="홈으로 이동"
          >
            <span className="text-xl font-bold text-gray-800">
              {title}
            </span>
          </Link>
          
          {/* 네비게이션 */}
          <nav className="flex items-center space-x-4" aria-label="주요 네비게이션">
            {showOrders && (
              <Link
                to="/orders"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="주문 내역 보기"
              >
                주문하기
              </Link>
            )}
            
            {showAuth && user ? (
              <>
                {showAdmin && (user.role === 'merchant' || user.role === 'admin') && (
                  <Link
                    to="/admin"
                    className="px-4 py-2 border border-gray-400 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                    aria-label="관리자 페이지로 이동"
                  >
                    관리자
                  </Link>
                )}
                <span className="text-gray-700" aria-label={`사용자: ${user.name}`}>
                  안녕하세요, {user.name}님
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                  aria-label="로그아웃"
                >
                  로그아웃
                </button>
              </>
            ) : showAuth ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                  aria-label="로그인"
                >
                  로그인
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                  aria-label="회원가입"
                >
                  회원가입
                </Link>
              </>
            ) : null}
            
            {!showAuth && showAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="px-4 py-2 border border-gray-400 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                aria-label="관리자 페이지로 이동"
              >
                관리자
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header

