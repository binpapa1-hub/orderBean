# 주문 상태 관련 코드 리팩토링 계획

## 📋 개요

이 문서는 `README.md`의 183-187줄에 해당하는 "중복 코드 제거" 작업에 대한 상세한 리팩토링 계획입니다. 코드 스멜, 정적 분석, SOLID 원칙을 고려하여 단계적으로 진행합니다.

---

## 🔍 현재 상황 분석

### 발견된 문제점

#### 1. 코드 중복 (DRY 원칙 위반)
- `getStatusColor()` 함수가 3개 파일에 중복:
  - `Orders.jsx` (18-35줄)
  - `OrderDetail.jsx` (40-57줄)
  - `AdminDashboard.jsx` (45-62줄)

- `getStatusText()` 함수가 2개 파일에 중복:
  - `Orders.jsx` (37-47줄): '제조 중'
  - `OrderDetail.jsx` (59-69줄): '제작 중' (텍스트 불일치!)

- `getStatusButtonText()` 함수:
  - `AdminDashboardNew.jsx` (72-82줄)

#### 2. 코드 스멜 (Code Smells)

**Magic Strings (하드코딩된 문자열)**
```javascript
case 'pending': return 'bg-yellow-100 text-yellow-800'
case 'confirmed': return 'bg-blue-100 text-blue-800'
// ... 상태 값들이 하드코딩됨
```

**일관성 부족**
- '제조 중' vs '제작 중' (Orders.jsx vs OrderDetail.jsx)
- 상태 텍스트가 파일마다 다름

**테스트 어려움**
- 함수가 컴포넌트 내부에 있어서 단위 테스트 불가능

#### 3. SOLID 원칙 위반

**Single Responsibility Principle (SRP) 위반**
- 컴포넌트가 UI 렌더링과 비즈니스 로직(상태 변환)을 모두 담당

**Open/Closed Principle (OCP) 위반**
- 새로운 상태 추가 시 여러 파일 수정 필요
- 확장에는 열려있지 않고, 수정에는 닫혀있지 않음

**Dependency Inversion Principle (DIP) 위반**
- 컴포넌트가 구체적인 구현(하드코딩된 값)에 의존

#### 4. 정적 분석 관점

**타입 안정성 부족**
- 상태 값에 대한 타입 정의 없음
- 잘못된 상태 값 전달 시 런타임 에러 가능

**에러 처리 부족**
- `default` case는 있지만, 명시적인 에러 처리 없음
- 잘못된 상태 값에 대한 로깅/모니터링 없음

**재사용성 낮음**
- 함수가 컴포넌트에 결합되어 있어 재사용 불가능

---

## 🎯 리팩토링 목표

1. ✅ **중복 코드 제거**: DRY 원칙 준수
2. ✅ **일관성 확보**: 상태 텍스트 통일
3. ✅ **확장성 향상**: 새로운 상태 추가 용이
4. ✅ **테스트 가능성**: 단위 테스트 작성 가능
5. ✅ **타입 안정성**: 상태 값 타입 정의
6. ✅ **SOLID 원칙 준수**: 책임 분리 및 의존성 역전

---

## 📝 단계별 리팩토링 계획

### Phase 1: 상수 정의 및 타입 안정성 확보

#### Step 1.1: 주문 상태 상수 정의
**파일**: `frontend/src/constants/orderStatus.js`

**목적**: 
- Magic Strings 제거
- 타입 안정성 확보
- 중앙 집중식 관리

**작업 내용**:
```javascript
/**
 * 주문 상태 상수 정의
 * @readonly
 * @enum {string}
 */
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} // Object.freeze()로 불변성 보장

/**
 * 주문 상태 배열 (순서 보장)
 */
export const ORDER_STATUS_LIST = Object.values(ORDER_STATUS)

/**
 * 주문 상태 유효성 검사
 * @param {string} status - 검사할 상태 값
 * @returns {boolean}
 */
export const isValidOrderStatus = (status) => {
  return ORDER_STATUS_LIST.includes(status)
}
```

**SOLID 적용**:
- **OCP**: 새로운 상태 추가 시 이 파일만 수정
- **DIP**: 컴포넌트는 추상화(상수)에 의존

---

#### Step 1.2: 상태 텍스트 매핑 정의
**파일**: `frontend/src/constants/orderStatus.js` (같은 파일에 추가)

**목적**: 
- 일관된 상태 텍스트 제공
- 다국어 지원 준비

**작업 내용**:
```javascript
/**
 * 주문 상태 한글 텍스트 매핑
 * @readonly
 */
export const ORDER_STATUS_TEXT = {
  [ORDER_STATUS.PENDING]: '주문 접수',
  [ORDER_STATUS.CONFIRMED]: '확인됨',
  [ORDER_STATUS.PREPARING]: '제조 중', // 통일된 텍스트
  [ORDER_STATUS.READY]: '준비 완료',
  [ORDER_STATUS.COMPLETED]: '완료',
  [ORDER_STATUS.CANCELLED]: '취소됨'
} // Object.freeze()로 불변성 보장

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
```

**코드 스멜 해결**:
- ✅ Magic Strings 제거
- ✅ 일관성 확보

---

#### Step 1.3: 상태 색상 매핑 정의
**파일**: `frontend/src/constants/orderStatus.js` (같은 파일에 추가)

**목적**: 
- Tailwind CSS 클래스 중앙 관리
- 테마 변경 용이

**작업 내용**:
```javascript
/**
 * 주문 상태별 Tailwind CSS 클래스 매핑
 * @readonly
 */
export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [ORDER_STATUS.CONFIRMED]: 'bg-blue-100 text-blue-800',
  [ORDER_STATUS.PREPARING]: 'bg-purple-100 text-purple-800',
  [ORDER_STATUS.READY]: 'bg-green-100 text-green-800',
  [ORDER_STATUS.COMPLETED]: 'bg-gray-100 text-gray-800',
  [ORDER_STATUS.CANCELLED]: 'bg-red-100 text-red-800'
} // Object.freeze()로 불변성 보장

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
```

**정적 분석 개선**:
- ✅ 타입 안정성: 유효성 검사 추가
- ✅ 에러 처리: 경고 로깅 및 폴백 값 제공

---

#### Step 1.4: 상태 플로우 정의 (선택사항)
**파일**: `frontend/src/constants/orderStatus.js` (같은 파일에 추가)

**목적**: 
- 상태 전이 로직 중앙화
- AdminDashboardNew.jsx의 `statusFlow` 제거

**작업 내용**:
```javascript
/**
 * 주문 상태 전이 맵 (다음 상태 정의)
 * @readonly
 */
export const ORDER_STATUS_FLOW = {
  [ORDER_STATUS.PENDING]: ORDER_STATUS.CONFIRMED,
  [ORDER_STATUS.CONFIRMED]: ORDER_STATUS.PREPARING,
  [ORDER_STATUS.PREPARING]: ORDER_STATUS.READY,
  [ORDER_STATUS.READY]: ORDER_STATUS.COMPLETED,
  // COMPLETED, CANCELLED는 최종 상태
} // Object.freeze()로 불변성 보장

/**
 * 다음 상태로 전이 가능한지 확인
 * @param {string} currentStatus - 현재 상태
 * @returns {boolean}
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
```

**SOLID 적용**:
- **SRP**: 상태 전이 로직을 별도 함수로 분리
- **OCP**: 새로운 상태 전이 추가 시 이 파일만 수정

---

### Phase 2: 유틸리티 함수 통합

#### Step 2.1: orderUtils.js 생성
**파일**: `frontend/src/utils/orderUtils.js`

**목적**: 
- 모든 주문 관련 유틸리티 함수 통합
- 단일 책임 원칙 준수

**작업 내용**:
```javascript
import {
  ORDER_STATUS,
  getOrderStatusText,
  getOrderStatusColor,
  isValidOrderStatus,
  getNextStatus,
  canTransitionToNext
} from '../constants/orderStatus'

/**
 * 주문 상태 관련 유틸리티 함수 모음
 * 
 * @namespace OrderUtils
 */

/**
 * 주문 상태 텍스트 가져오기 (별칭)
 * @param {string} status - 주문 상태
 * @returns {string}
 */
export const getStatusText = getOrderStatusText

/**
 * 주문 상태 색상 클래스 가져오기 (별칭)
 * @param {string} status - 주문 상태
 * @returns {string}
 */
export const getStatusColor = getOrderStatusColor

/**
 * 주문 상태 정보 객체 가져오기
 * @param {string} status - 주문 상태
 * @returns {{text: string, color: string, isValid: boolean}}
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
```

**SOLID 적용**:
- **SRP**: 주문 상태 관련 로직만 담당
- **DIP**: 상수에 의존, 구체적 구현에 의존하지 않음

---

#### Step 2.2: 관리자용 상태 버튼 텍스트 통합
**파일**: `frontend/src/utils/orderUtils.js` (추가)

**목적**: 
- AdminDashboardNew.jsx의 `getStatusButtonText` 통합

**작업 내용**:
```javascript
/**
 * 관리자용 상태 버튼 텍스트 매핑
 * @readonly
 */
const ADMIN_STATUS_BUTTON_TEXT = {
  [ORDER_STATUS.PENDING]: '주문 접수',
  [ORDER_STATUS.CONFIRMED]: '제조 시작',
  [ORDER_STATUS.PREPARING]: '제조 중',
  [ORDER_STATUS.READY]: '제조 완료',
  [ORDER_STATUS.COMPLETED]: '완료',
  [ORDER_STATUS.CANCELLED]: '취소됨'
}

/**
 * 관리자용 상태 버튼 텍스트 가져오기
 * @param {string} status - 주문 상태
 * @returns {string}
 */
export const getStatusButtonText = (status) => {
  if (!isValidOrderStatus(status)) {
    console.warn(`Invalid order status: ${status}`)
    return status
  }
  return ADMIN_STATUS_BUTTON_TEXT[status] || status
}
```

---

### Phase 3: 컴포넌트 리팩토링

#### Step 3.1: Orders.jsx 리팩토링
**파일**: `frontend/src/pages/Orders.jsx`

**작업 내용**:
```javascript
// Before
const getStatusColor = (status) => { ... }
const getStatusText = (status) => { ... }

// After
import { getStatusColor, getStatusText } from '../utils/orderUtils'

// 함수 정의 제거, import만 사용
```

**체크리스트**:
- [ ] `getStatusColor` 함수 제거
- [ ] `getStatusText` 함수 제거
- [ ] `orderUtils`에서 import 추가
- [ ] 기존 사용처가 정상 동작하는지 확인
- [ ] 테스트 실행

---

#### Step 3.2: OrderDetail.jsx 리팩토링
**파일**: `frontend/src/pages/OrderDetail.jsx`

**작업 내용**:
```javascript
// Before
const getStatusColor = (status) => { ... }
const getStatusText = (status) => { ... }
const canCancel = order.status === 'pending' || order.status === 'confirmed'

// After
import { getStatusColor, getStatusText, getStatusInfo, ORDER_STATUS } from '../utils/orderUtils'

// canCancel 로직도 개선
const statusInfo = getStatusInfo(order.status)
const canCancel = statusInfo.canCancel
```

**체크리스트**:
- [ ] `getStatusColor` 함수 제거
- [ ] `getStatusText` 함수 제거
- [ ] `canCancel` 로직을 `getStatusInfo` 사용으로 변경
- [ ] '제작 중' → '제조 중'으로 텍스트 통일 확인
- [ ] 테스트 실행

---

#### Step 3.3: AdminDashboard.jsx 리팩토링
**파일**: `frontend/src/pages/AdminDashboard.jsx`

**작업 내용**:
```javascript
// Before
const getStatusColor = (status) => { ... }

// After
import { getStatusColor, ORDER_STATUS } from '../utils/orderUtils'
```

**체크리스트**:
- [ ] `getStatusColor` 함수 제거
- [ ] `orderUtils`에서 import 추가
- [ ] 테스트 실행

---

#### Step 3.4: AdminDashboardNew.jsx 리팩토링
**파일**: `frontend/src/pages/AdminDashboardNew.jsx`

**작업 내용**:
```javascript
// Before
const statusFlow = {
  'pending': 'confirmed',
  'confirmed': 'preparing',
  ...
}
const getStatusButtonText = (status) => { ... }

// After
import { 
  getStatusButtonText, 
  getNextStatus, 
  ORDER_STATUS 
} from '../utils/orderUtils'

// handleStatusChange 함수 수정
const handleStatusChange = (orderId) => {
  setOrders(prev => prev.map(order => {
    if (order.id !== orderId) return order
    
    const nextStatus = getNextStatus(order.status)
    if (!nextStatus) return order // 전이 불가능한 상태
    
    return { ...order, status: nextStatus }
  }))
}
```

**체크리스트**:
- [ ] `statusFlow` 객체 제거
- [ ] `getStatusButtonText` 함수 제거
- [ ] `handleStatusChange` 로직 개선
- [ ] `orderUtils`에서 import 추가
- [ ] 테스트 실행

---

### Phase 4: 테스트 작성

#### Step 4.1: 상수 테스트
**파일**: `frontend/src/constants/__tests__/orderStatus.test.js`

**작업 내용**:
```javascript
import { 
  ORDER_STATUS, 
  ORDER_STATUS_LIST,
  isValidOrderStatus,
  getOrderStatusText,
  getOrderStatusColor,
  getNextStatus
} from '../orderStatus'

describe('ORDER_STATUS', () => {
  test('모든 상태가 정의되어 있어야 함', () => {
    expect(ORDER_STATUS.PENDING).toBe('pending')
    expect(ORDER_STATUS.CONFIRMED).toBe('confirmed')
    // ...
  })

  test('상태 리스트가 올바른 순서를 가져야 함', () => {
    expect(ORDER_STATUS_LIST).toContain('pending')
    expect(ORDER_STATUS_LIST.length).toBe(6)
  })
})

describe('isValidOrderStatus', () => {
  test('유효한 상태는 true 반환', () => {
    expect(isValidOrderStatus('pending')).toBe(true)
  })

  test('유효하지 않은 상태는 false 반환', () => {
    expect(isValidOrderStatus('invalid')).toBe(false)
  })
})

describe('getOrderStatusText', () => {
  test('각 상태에 맞는 텍스트 반환', () => {
    expect(getOrderStatusText('pending')).toBe('주문 접수')
    expect(getOrderStatusText('preparing')).toBe('제조 중')
  })

  test('유효하지 않은 상태는 원본 반환', () => {
    expect(getOrderStatusText('invalid')).toBe('invalid')
  })
})

// ... 더 많은 테스트
```

---

#### Step 4.2: 유틸리티 함수 테스트
**파일**: `frontend/src/utils/__tests__/orderUtils.test.js`

**작업 내용**:
```javascript
import { 
  getStatusText, 
  getStatusColor, 
  getStatusInfo,
  getStatusButtonText 
} from '../orderUtils'

describe('getStatusText', () => {
  // 테스트 작성
})

describe('getStatusColor', () => {
  // 테스트 작성
})

describe('getStatusInfo', () => {
  test('상태 정보 객체 반환', () => {
    const info = getStatusInfo('pending')
    expect(info).toHaveProperty('text')
    expect(info).toHaveProperty('color')
    expect(info).toHaveProperty('isValid')
    expect(info.canCancel).toBe(true)
  })
})

// ... 더 많은 테스트
```

---

### Phase 5: 문서화 및 검증

#### Step 5.1: JSDoc 주석 추가
**목적**: IDE 자동완성 및 문서 생성

**작업 내용**:
- 모든 함수에 JSDoc 주석 추가
- 타입 정의 명시
- 사용 예제 추가

---

#### Step 5.2: 통합 테스트
**체크리스트**:
- [ ] 모든 페이지에서 상태 표시가 정상 동작하는지 확인
- [ ] 상태 전이가 올바르게 작동하는지 확인
- [ ] 에러 케이스 처리 확인
- [ ] 성능 영향 없음 확인

---

#### Step 5.3: 코드 리뷰 체크리스트
- [ ] 중복 코드 제거 확인
- [ ] 일관성 확보 확인
- [ ] SOLID 원칙 준수 확인
- [ ] 테스트 커버리지 확인
- [ ] 문서화 완료 확인

---

## 📊 예상 효과

### 코드 품질 개선
- ✅ 중복 코드 제거: ~60줄 감소
- ✅ 유지보수성 향상: 상태 변경 시 1개 파일만 수정
- ✅ 테스트 가능성 향상: 단위 테스트 작성 가능

### 개발자 경험 개선
- ✅ IDE 자동완성 지원
- ✅ 타입 안정성 향상
- ✅ 일관된 API 사용

### 확장성 향상
- ✅ 새로운 상태 추가 용이
- ✅ 다국어 지원 준비
- ✅ 테마 변경 용이

---

## 🚨 주의사항

1. **점진적 리팩토링**: 한 번에 모든 파일을 수정하지 말고, 단계적으로 진행
2. **테스트 우선**: 각 단계마다 테스트를 작성하고 통과 확인
3. **백업**: 리팩토링 전 현재 코드 상태 커밋
4. **회귀 테스트**: 기존 기능이 정상 동작하는지 확인

---

## 📅 예상 소요 시간

- Phase 1: 1-2시간 (상수 정의)
- Phase 2: 1시간 (유틸리티 함수)
- Phase 3: 2-3시간 (컴포넌트 리팩토링)
- Phase 4: 2-3시간 (테스트 작성)
- Phase 5: 1시간 (문서화 및 검증)

**총 예상 시간**: 7-10시간

---

## ✅ 완료 체크리스트

### Phase 1
- [ ] `constants/orderStatus.js` 생성
- [ ] ORDER_STATUS 상수 정의
- [ ] ORDER_STATUS_TEXT 매핑 정의
- [ ] ORDER_STATUS_COLORS 매핑 정의
- [ ] ORDER_STATUS_FLOW 정의 (선택사항)
- [ ] 유효성 검사 함수 작성

### Phase 2
- [ ] `utils/orderUtils.js` 생성
- [ ] getStatusText, getStatusColor 함수 통합
- [ ] getStatusInfo 함수 추가
- [ ] getStatusButtonText 함수 통합

### Phase 3
- [ ] Orders.jsx 리팩토링
- [ ] OrderDetail.jsx 리팩토링
- [ ] AdminDashboard.jsx 리팩토링
- [ ] AdminDashboardNew.jsx 리팩토링

### Phase 4
- [ ] orderStatus.test.js 작성
- [ ] orderUtils.test.js 작성
- [ ] 테스트 커버리지 80% 이상 달성

### Phase 5
- [ ] JSDoc 주석 추가
- [ ] 통합 테스트 완료
- [ ] 코드 리뷰 완료

---

## 📚 참고 자료

- [SOLID 원칙](https://en.wikipedia.org/wiki/SOLID)
- [DRY 원칙](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)
- [코드 스멜](https://refactoring.guru/refactoring/smells)
- [React Testing Library](https://testing-library.com/react)

