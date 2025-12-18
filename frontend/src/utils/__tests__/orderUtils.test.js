import { describe, test, expect, vi } from 'vitest'
import {
  getStatusText,
  getStatusColor,
  getStatusButtonText,
  getStatusInfo,
  ORDER_STATUS
} from '../orderUtils'

// console.warn 모킹
const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

describe('getStatusText', () => {
  test('각 상태에 맞는 텍스트 반환', () => {
    expect(getStatusText('pending')).toBe('주문 접수')
    expect(getStatusText('preparing')).toBe('제조 중')
  })

  test('유효하지 않은 상태는 원본 반환', () => {
    expect(getStatusText('invalid')).toBe('invalid')
  })
})

describe('getStatusColor', () => {
  test('각 상태에 맞는 색상 클래스 반환', () => {
    expect(getStatusColor('pending')).toBe('bg-yellow-100 text-yellow-800')
    expect(getStatusColor('confirmed')).toBe('bg-blue-100 text-blue-800')
  })

  test('유효하지 않은 상태는 기본 색상 반환', () => {
    const result = getStatusColor('invalid')
    expect(result).toBe('bg-gray-100 text-gray-800')
  })
})

describe('getStatusButtonText', () => {
  test('관리자용 버튼 텍스트 반환', () => {
    expect(getStatusButtonText('pending')).toBe('주문 접수')
    expect(getStatusButtonText('confirmed')).toBe('제조 시작')
    expect(getStatusButtonText('preparing')).toBe('제조 중')
    expect(getStatusButtonText('ready')).toBe('제조 완료')
    expect(getStatusButtonText('completed')).toBe('완료')
    expect(getStatusButtonText('cancelled')).toBe('취소됨')
  })

  test('유효하지 않은 상태는 원본 반환', () => {
    expect(getStatusButtonText('invalid')).toBe('invalid')
  })
})

describe('getStatusInfo', () => {
  test('상태 정보 객체 반환', () => {
    const info = getStatusInfo('pending')
    
    expect(info).toHaveProperty('text')
    expect(info).toHaveProperty('color')
    expect(info).toHaveProperty('isValid')
    expect(info).toHaveProperty('canCancel')
    expect(info).toHaveProperty('canTransition')
    expect(info).toHaveProperty('nextStatus')
    
    expect(info.text).toBe('주문 접수')
    expect(info.color).toBe('bg-yellow-100 text-yellow-800')
    expect(info.isValid).toBe(true)
    expect(info.canCancel).toBe(true)
    expect(info.canTransition).toBe(true)
    expect(info.nextStatus).toBe('confirmed')
  })

  test('취소 가능한 상태 확인', () => {
    const pendingInfo = getStatusInfo('pending')
    expect(pendingInfo.canCancel).toBe(true)
    
    const confirmedInfo = getStatusInfo('confirmed')
    expect(confirmedInfo.canCancel).toBe(true)
    
    const preparingInfo = getStatusInfo('preparing')
    expect(preparingInfo.canCancel).toBe(false)
  })

  test('전이 가능 여부 확인', () => {
    const pendingInfo = getStatusInfo('pending')
    expect(pendingInfo.canTransition).toBe(true)
    expect(pendingInfo.nextStatus).toBe('confirmed')
    
    const completedInfo = getStatusInfo('completed')
    expect(completedInfo.canTransition).toBe(false)
    expect(completedInfo.nextStatus).toBe(null)
  })

  test('유효하지 않은 상태 처리', () => {
    const info = getStatusInfo('invalid')
    
    expect(info.isValid).toBe(false)
    expect(info.text).toBe('invalid')
    expect(info.canCancel).toBe(false)
    expect(info.canTransition).toBe(false)
    expect(info.nextStatus).toBe(null)
  })
})

describe('ORDER_STATUS 상수 재내보내기', () => {
  test('ORDER_STATUS 상수가 올바르게 내보내지는지 확인', () => {
    expect(ORDER_STATUS.PENDING).toBe('pending')
    expect(ORDER_STATUS.CONFIRMED).toBe('confirmed')
  })
})

