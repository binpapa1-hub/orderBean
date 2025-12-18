/**
 * 주문 관련 유틸리티 함수 모음
 * 
 * 이 모듈은 주문 상태 관련 유틸리티 함수를 제공합니다.
 * 컴포넌트에서 직접 사용할 수 있는 편의 함수들을 포함합니다.
 */

import {
  ORDER_STATUS,
  ORDER_STATUS_LIST,
  getOrderStatusText,
  getOrderStatusColor,
  isValidOrderStatus,
  getNextStatus,
  canTransitionToNext
} from '../constants/orderStatus'

/**
 * 주문 상태 텍스트 가져오기 (별칭)
 * @param {string} status - 주문 상태
 * @returns {string} 상태 텍스트
 */
export const getStatusText = getOrderStatusText

/**
 * 주문 상태 색상 클래스 가져오기 (별칭)
 * @param {string} status - 주문 상태
 * @returns {string} Tailwind CSS 클래스
 */
export const getStatusColor = getOrderStatusColor

/**
 * 관리자용 상태 버튼 텍스트 매핑
 * @readonly
 */
const ADMIN_STATUS_BUTTON_TEXT = Object.freeze({
  [ORDER_STATUS.PENDING]: '주문 접수',
  [ORDER_STATUS.CONFIRMED]: '제조 시작',
  [ORDER_STATUS.PREPARING]: '제조 중',
  [ORDER_STATUS.READY]: '제조 완료',
  [ORDER_STATUS.COMPLETED]: '완료',
  [ORDER_STATUS.CANCELLED]: '취소됨'
})

/**
 * 관리자용 상태 버튼 텍스트 가져오기
 * @param {string} status - 주문 상태
 * @returns {string} 버튼 텍스트
 */
export const getStatusButtonText = (status) => {
  if (!isValidOrderStatus(status)) {
    console.warn(`Invalid order status: ${status}`)
    return status
  }
  return ADMIN_STATUS_BUTTON_TEXT[status] || status
}

/**
 * 주문 상태 정보 객체 가져오기
 * @param {string} status - 주문 상태
 * @returns {{text: string, color: string, isValid: boolean, canCancel: boolean, canTransition: boolean, nextStatus: string|null}}
 */
export const getStatusInfo = (status) => {
  const isValid = isValidOrderStatus(status)
  return {
    text: getOrderStatusText(status),
    color: getOrderStatusColor(status),
    isValid,
    canCancel: status === ORDER_STATUS.PENDING || status === ORDER_STATUS.CONFIRMED,
    canTransition: canTransitionToNext(status),
    nextStatus: getNextStatus(status)
  }
}

// 상수 재내보내기 (편의성)
export { ORDER_STATUS, ORDER_STATUS_LIST }

