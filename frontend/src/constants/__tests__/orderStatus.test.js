import { describe, test, expect } from 'vitest'
import {
  ORDER_STATUS,
  ORDER_STATUS_LIST,
  isValidOrderStatus,
  getOrderStatusText,
  getOrderStatusColor,
  getNextStatus,
  canTransitionToNext,
  ORDER_STATUS_TEXT,
  ORDER_STATUS_COLORS,
  ORDER_STATUS_FLOW
} from '../orderStatus'

describe('ORDER_STATUS', () => {
  test('모든 상태가 정의되어 있어야 함', () => {
    expect(ORDER_STATUS.PENDING).toBe('pending')
    expect(ORDER_STATUS.CONFIRMED).toBe('confirmed')
    expect(ORDER_STATUS.PREPARING).toBe('preparing')
    expect(ORDER_STATUS.READY).toBe('ready')
    expect(ORDER_STATUS.COMPLETED).toBe('completed')
    expect(ORDER_STATUS.CANCELLED).toBe('cancelled')
  })

  test('상태 객체가 불변해야 함', () => {
    expect(() => {
      ORDER_STATUS.PENDING = 'new-status'
    }).toThrow()
  })

  test('상태 리스트가 올바른 순서를 가져야 함', () => {
    expect(ORDER_STATUS_LIST).toContain('pending')
    expect(ORDER_STATUS_LIST).toContain('confirmed')
    expect(ORDER_STATUS_LIST).toContain('preparing')
    expect(ORDER_STATUS_LIST).toContain('ready')
    expect(ORDER_STATUS_LIST).toContain('completed')
    expect(ORDER_STATUS_LIST).toContain('cancelled')
    expect(ORDER_STATUS_LIST.length).toBe(6)
  })
})

describe('isValidOrderStatus', () => {
  test('유효한 상태는 true 반환', () => {
    expect(isValidOrderStatus('pending')).toBe(true)
    expect(isValidOrderStatus('confirmed')).toBe(true)
    expect(isValidOrderStatus('preparing')).toBe(true)
    expect(isValidOrderStatus('ready')).toBe(true)
    expect(isValidOrderStatus('completed')).toBe(true)
    expect(isValidOrderStatus('cancelled')).toBe(true)
  })

  test('유효하지 않은 상태는 false 반환', () => {
    expect(isValidOrderStatus('invalid')).toBe(false)
    expect(isValidOrderStatus('')).toBe(false)
    expect(isValidOrderStatus(null)).toBe(false)
    expect(isValidOrderStatus(undefined)).toBe(false)
  })
})

describe('getOrderStatusText', () => {
  test('각 상태에 맞는 텍스트 반환', () => {
    expect(getOrderStatusText('pending')).toBe('주문 접수')
    expect(getOrderStatusText('confirmed')).toBe('확인됨')
    expect(getOrderStatusText('preparing')).toBe('제조 중')
    expect(getOrderStatusText('ready')).toBe('준비 완료')
    expect(getOrderStatusText('completed')).toBe('완료')
    expect(getOrderStatusText('cancelled')).toBe('취소됨')
  })

  test('유효하지 않은 상태는 원본 반환', () => {
    expect(getOrderStatusText('invalid')).toBe('invalid')
  })

  test('모든 상태에 대한 텍스트가 정의되어 있어야 함', () => {
    ORDER_STATUS_LIST.forEach(status => {
      expect(ORDER_STATUS_TEXT[status]).toBeDefined()
      expect(typeof ORDER_STATUS_TEXT[status]).toBe('string')
    })
  })
})

describe('getOrderStatusColor', () => {
  test('각 상태에 맞는 색상 클래스 반환', () => {
    expect(getOrderStatusColor('pending')).toBe('bg-yellow-100 text-yellow-800')
    expect(getOrderStatusColor('confirmed')).toBe('bg-blue-100 text-blue-800')
    expect(getOrderStatusColor('preparing')).toBe('bg-purple-100 text-purple-800')
    expect(getOrderStatusColor('ready')).toBe('bg-green-100 text-green-800')
    expect(getOrderStatusColor('completed')).toBe('bg-gray-100 text-gray-800')
    expect(getOrderStatusColor('cancelled')).toBe('bg-red-100 text-red-800')
  })

  test('유효하지 않은 상태는 기본 색상 반환', () => {
    expect(getOrderStatusColor('invalid')).toBe(ORDER_STATUS_COLORS[ORDER_STATUS.COMPLETED])
  })

  test('모든 상태에 대한 색상이 정의되어 있어야 함', () => {
    ORDER_STATUS_LIST.forEach(status => {
      expect(ORDER_STATUS_COLORS[status]).toBeDefined()
      expect(typeof ORDER_STATUS_COLORS[status]).toBe('string')
    })
  })
})

describe('ORDER_STATUS_FLOW', () => {
  test('상태 전이 맵이 올바르게 정의되어 있어야 함', () => {
    expect(ORDER_STATUS_FLOW[ORDER_STATUS.PENDING]).toBe(ORDER_STATUS.CONFIRMED)
    expect(ORDER_STATUS_FLOW[ORDER_STATUS.CONFIRMED]).toBe(ORDER_STATUS.PREPARING)
    expect(ORDER_STATUS_FLOW[ORDER_STATUS.PREPARING]).toBe(ORDER_STATUS.READY)
    expect(ORDER_STATUS_FLOW[ORDER_STATUS.READY]).toBe(ORDER_STATUS.COMPLETED)
  })

  test('최종 상태는 전이 맵에 없어야 함', () => {
    expect(ORDER_STATUS_FLOW[ORDER_STATUS.COMPLETED]).toBeUndefined()
    expect(ORDER_STATUS_FLOW[ORDER_STATUS.CANCELLED]).toBeUndefined()
  })
})

describe('canTransitionToNext', () => {
  test('전이 가능한 상태는 true 반환', () => {
    expect(canTransitionToNext('pending')).toBe(true)
    expect(canTransitionToNext('confirmed')).toBe(true)
    expect(canTransitionToNext('preparing')).toBe(true)
    expect(canTransitionToNext('ready')).toBe(true)
  })

  test('최종 상태는 false 반환', () => {
    expect(canTransitionToNext('completed')).toBe(false)
    expect(canTransitionToNext('cancelled')).toBe(false)
  })

  test('유효하지 않은 상태는 false 반환', () => {
    expect(canTransitionToNext('invalid')).toBe(false)
  })
})

describe('getNextStatus', () => {
  test('전이 가능한 상태의 다음 상태 반환', () => {
    expect(getNextStatus('pending')).toBe('confirmed')
    expect(getNextStatus('confirmed')).toBe('preparing')
    expect(getNextStatus('preparing')).toBe('ready')
    expect(getNextStatus('ready')).toBe('completed')
  })

  test('최종 상태는 null 반환', () => {
    expect(getNextStatus('completed')).toBe(null)
    expect(getNextStatus('cancelled')).toBe(null)
  })

  test('유효하지 않은 상태는 null 반환', () => {
    expect(getNextStatus('invalid')).toBe(null)
  })
})

