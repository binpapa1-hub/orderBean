/**
 * 주문 상태 관련 상수 및 유틸리티 함수
 * 
 * 이 모듈은 주문 상태의 중앙 집중식 관리를 제공합니다.
 * Magic Strings를 제거하고 타입 안정성을 확보합니다.
 */

/**
 * 주문 상태 상수 정의
 * @readonly
 * @enum {string}
 */
export const ORDER_STATUS = Object.freeze({
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
})

/**
 * 주문 상태 배열 (순서 보장)
 * @readonly
 */
export const ORDER_STATUS_LIST = Object.freeze(Object.values(ORDER_STATUS))

/**
 * 주문 상태 유효성 검사
 * @param {string} status - 검사할 상태 값
 * @returns {boolean} 유효한 상태인지 여부
 */
export const isValidOrderStatus = (status) => {
  return ORDER_STATUS_LIST.includes(status)
}

/**
 * 주문 상태 한글 텍스트 매핑
 * @readonly
 */
export const ORDER_STATUS_TEXT = Object.freeze({
  [ORDER_STATUS.PENDING]: '주문 접수',
  [ORDER_STATUS.CONFIRMED]: '확인됨',
  [ORDER_STATUS.PREPARING]: '제조 중',
  [ORDER_STATUS.READY]: '준비 완료',
  [ORDER_STATUS.COMPLETED]: '완료',
  [ORDER_STATUS.CANCELLED]: '취소됨'
})

/**
 * 주문 상태 텍스트 가져오기
 * @param {string} status - 주문 상태
 * @returns {string} 상태 텍스트
 */
export const getOrderStatusText = (status) => {
  if (!isValidOrderStatus(status)) {
    console.warn(`Invalid order status: ${status}`)
    return status // 폴백: 원본 상태 반환
  }
  return ORDER_STATUS_TEXT[status] || status
}

/**
 * 주문 상태별 Tailwind CSS 클래스 매핑
 * @readonly
 */
export const ORDER_STATUS_COLORS = Object.freeze({
  [ORDER_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [ORDER_STATUS.CONFIRMED]: 'bg-blue-100 text-blue-800',
  [ORDER_STATUS.PREPARING]: 'bg-purple-100 text-purple-800',
  [ORDER_STATUS.READY]: 'bg-green-100 text-green-800',
  [ORDER_STATUS.COMPLETED]: 'bg-gray-100 text-gray-800',
  [ORDER_STATUS.CANCELLED]: 'bg-red-100 text-red-800'
})

/**
 * 주문 상태 색상 클래스 가져오기
 * @param {string} status - 주문 상태
 * @returns {string} Tailwind CSS 클래스
 */
export const getOrderStatusColor = (status) => {
  if (!isValidOrderStatus(status)) {
    console.warn(`Invalid order status: ${status}`)
    return ORDER_STATUS_COLORS[ORDER_STATUS.COMPLETED] // 폴백: 기본 색상
  }
  return ORDER_STATUS_COLORS[status] || ORDER_STATUS_COLORS[ORDER_STATUS.COMPLETED]
}

/**
 * 주문 상태 전이 맵 (다음 상태 정의)
 * @readonly
 */
export const ORDER_STATUS_FLOW = Object.freeze({
  [ORDER_STATUS.PENDING]: ORDER_STATUS.CONFIRMED,
  [ORDER_STATUS.CONFIRMED]: ORDER_STATUS.PREPARING,
  [ORDER_STATUS.PREPARING]: ORDER_STATUS.READY,
  [ORDER_STATUS.READY]: ORDER_STATUS.COMPLETED,
  // COMPLETED, CANCELLED는 최종 상태
})

/**
 * 다음 상태로 전이 가능한지 확인
 * @param {string} currentStatus - 현재 상태
 * @returns {boolean} 전이 가능 여부
 */
export const canTransitionToNext = (currentStatus) => {
  return ORDER_STATUS_FLOW.hasOwnProperty(currentStatus)
}

/**
 * 다음 상태 가져오기
 * @param {string} currentStatus - 현재 상태
 * @returns {string|null} 다음 상태 또는 null
 */
export const getNextStatus = (currentStatus) => {
  if (!canTransitionToNext(currentStatus)) {
    return null
  }
  return ORDER_STATUS_FLOW[currentStatus]
}

