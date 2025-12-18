/**
 * 로딩 스피너 컴포넌트
 * 
 * 데이터 로딩 중 사용자에게 로딩 상태를 표시하는 공통 컴포넌트입니다.
 * 
 * @param {Object} props
 * @param {string} props.size - 스피너 크기 ('sm' | 'md' | 'lg')
 * @param {string} props.color - 스피너 색상 ('primary' | 'gray' | 'white')
 * @param {string} props.text - 로딩 텍스트 (선택사항)
 * @param {boolean} props.fullScreen - 전체 화면 중앙 배치 여부
 * @param {string} props.className - 추가 CSS 클래스
 */
const LoadingSpinner = ({
  size = 'md',
  color = 'primary',
  text = null,
  fullScreen = false,
  className = ''
}) => {
  // 크기별 클래스
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-12 w-12 border-b-2',
    lg: 'h-16 w-16 border-b-2'
  }

  // 색상별 클래스
  const colorClasses = {
    primary: 'border-primary-600',
    gray: 'border-gray-600',
    white: 'border-white'
  }

  const spinnerClasses = `animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]}`

  const containerClasses = fullScreen
    ? `flex flex-col justify-center items-center min-h-screen ${className}`
    : `flex flex-col justify-center items-center ${className}`

  return (
    <div className={containerClasses} role="status" aria-label="로딩 중">
      <div className={spinnerClasses} aria-hidden="true"></div>
      {text && (
        <p className="mt-4 text-gray-600 text-sm" aria-live="polite">
          {text}
        </p>
      )}
      <span className="sr-only">로딩 중입니다...</span>
    </div>
  )
}

export default LoadingSpinner

