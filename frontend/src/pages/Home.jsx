import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          바쁜 아침, 줄 서지 말고
        </h1>
        <h2 className="text-5xl font-bold text-primary-600 mb-8">
          바로 픽업하세요!
        </h2>
        <p className="text-xl text-gray-600 mb-12">
          OrderBean으로 미리 주문하고, 매장에 도착해 바로 음료를 받아가세요.
        </p>
        
        <div className="flex justify-center space-x-4">
          <Link
            to="/cafes"
            className="px-8 py-4 bg-primary-600 text-white text-lg font-semibold rounded-lg hover:bg-primary-700 transition"
          >
            카페 찾기
          </Link>
          <Link
            to="/register"
            className="px-8 py-4 bg-white text-primary-600 text-lg font-semibold rounded-lg border-2 border-primary-600 hover:bg-primary-50 transition"
          >
            시작하기
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">빠른 주문</h3>
            <p className="text-gray-600">미리 주문하고 대기 없이 바로 픽업</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="text-xl font-semibold mb-2">위치 기반 검색</h3>
            <p className="text-gray-600">근처 카페를 쉽게 찾아보세요</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="text-4xl mb-4">☕</div>
            <h3 className="text-xl font-semibold mb-2">다양한 메뉴</h3>
            <p className="text-gray-600">원하는 옵션으로 커스터마이징</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

