import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/common/LoadingSpinner'

const Cafes = () => {
  const [cafes, setCafes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCafes()
  }, [])

  const fetchCafes = async () => {
    try {
      const response = await axios.get('/api/cafes')
      setCafes(response.data)
    } catch (error) {
      toast.error('카페 목록을 불러오는데 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">카페 찾기</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cafes.map((cafe) => (
          <Link
            key={cafe._id}
            to={`/cafes/${cafe._id}/menu`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {cafe.image ? (
                <img src={cafe.image} alt={cafe.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">☕</span>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{cafe.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{cafe.address}</p>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded text-xs ${
                  cafe.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {cafe.isOpen ? '영업 중' : '영업 종료'}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${
                  cafe.congestionLevel === 'low' ? 'bg-blue-100 text-blue-800' :
                  cafe.congestionLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {cafe.congestionLevel === 'low' ? '여유' :
                   cafe.congestionLevel === 'medium' ? '보통' : '혼잡'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {cafes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">등록된 카페가 없습니다.</p>
        </div>
      )}
    </div>
  )
}

export default Cafes

