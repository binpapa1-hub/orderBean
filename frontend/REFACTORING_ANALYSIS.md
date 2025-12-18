# 프런트엔드 코드 리팩토링 분석 보고서

## 📋 개요
프런트엔드 코드를 분석하여 발견된 코드 스멜과 개선점을 정리한 문서입니다.

---

## 🔴 심각한 코드 스멜 (High Priority)

### 1. **중복 코드 (Code Duplication)**

#### 1.1 상태 관련 유틸리티 함수 중복
**위치**: `Orders.jsx`, `OrderDetail.jsx`
```javascript
// Orders.jsx (18-47줄)
const getStatusColor = (status) => { ... }
const getStatusText = (status) => { ... }

// OrderDetail.jsx (40-69줄) - 동일한 로직 반복
const getStatusColor = (status) => { ... }
const getStatusText = (status) => { ... }
```
**문제점**: 
- 동일한 로직이 여러 파일에 중복
- 상태 텍스트가 일치하지 않음 (예: '제작 중' vs '제조 중')
- 유지보수 시 여러 곳 수정 필요

**개선 방안**: 
- `src/utils/orderUtils.js` 생성하여 공통 함수 추출
- 또는 `src/constants/orderStatus.js`에 상수 정의

#### 1.2 헤더 컴포넌트 중복
**위치**: `CustomerMenu.jsx`, `AdminDashboardNew.jsx`, `Orders.jsx`
```javascript
// 각 파일에 동일한 헤더 구조 반복
<header className="bg-white border-b border-gray-300 flex items-center justify-between px-6 py-4">
  <div className="text-xl font-bold text-gray-800">OrderBean - 커피 주문</div>
  ...
</header>
```
**문제점**: 
- UI 일관성 유지 어려움
- 변경 시 여러 파일 수정 필요
- Navbar 컴포넌트가 있지만 사용되지 않음

**개선 방안**: 
- `Navbar.jsx`를 실제로 사용하거나
- `Header.jsx` 컴포넌트 생성하여 재사용

#### 1.3 로딩 스피너 중복
**위치**: 거의 모든 페이지 컴포넌트
```javascript
// 반복되는 로딩 UI
<div className="flex justify-center items-center min-h-screen">
  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
</div>
```
**개선 방안**: 
- `src/components/LoadingSpinner.jsx` 생성

---

### 2. **하드코딩된 값 (Magic Numbers/Strings)**

#### 2.1 Mock 데이터 하드코딩
**위치**: `CustomerMenu.jsx` (5-39줄)
```javascript
const MOCK_MENUS = [
  { id: 1, name: '아메리카노(ICE)', price: 4000, ... },
  ...
]
```
**문제점**: 
- 실제 API와 분리되지 않음
- 개발/프로덕션 환경 구분 없음

**개선 방안**: 
- 환경 변수로 API 엔드포인트 관리
- Mock 데이터는 별도 파일로 분리

#### 2.2 API 엔드포인트 하드코딩
**위치**: 모든 페이지 컴포넌트
```javascript
axios.get('/api/cafes')
axios.post('/api/auth/login')
```
**문제점**: 
- API 베이스 URL 변경 시 여러 곳 수정 필요
- 개발/프로덕션 환경 대응 어려움

**개선 방안**: 
- `src/config/api.js` 생성하여 API 설정 중앙화
- 또는 axios instance 생성

#### 2.3 상태 값 하드코딩
**위치**: 여러 파일
```javascript
// 상태 플로우가 하드코딩됨
const statusFlow = {
  'pending': 'confirmed',
  'confirmed': 'preparing',
  ...
}
```
**개선 방안**: 
- `src/constants/orderStatus.js`에 상수 정의

---

### 3. **상태 관리 문제**

#### 3.1 localStorage 직접 사용
**위치**: `CustomerMenu.jsx`, `Orders.jsx`, `Cart.jsx`
```javascript
// CustomerMenu.jsx (113-116줄)
const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
localStorage.setItem('orders', JSON.stringify([newOrder, ...existingOrders]))
```
**문제점**: 
- 상태 동기화 어려움
- 여러 컴포넌트에서 직접 접근하여 일관성 부족
- 에러 처리 부족 (JSON.parse 실패 가능)

**개선 방안**: 
- `CartContext` 생성하여 장바구니 상태 관리
- `useLocalStorage` 커스텀 훅 생성

#### 3.2 장바구니 상태 분산
**위치**: `CustomerMenu.jsx`, `Menu.jsx`, `Cart.jsx`
```javascript
// CustomerMenu.jsx - 자체 상태로 관리
const [cart, setCart] = useState([])

// Menu.jsx - 또 다른 장바구니 상태
const [cart, setCart] = useState([])
```
**문제점**: 
- 장바구니 상태가 여러 컴포넌트에 분산
- 상태 동기화 불가능
- 사용자 경험 저하

**개선 방안**: 
- 전역 상태 관리 (Context API 또는 상태 관리 라이브러리)

---

### 4. **컴포넌트 구조 문제**

#### 4.1 거대한 컴포넌트 (God Component)
**위치**: `CustomerMenu.jsx` (266줄), `AdminDashboardNew.jsx` (204줄)
```javascript
// CustomerMenu.jsx - 하나의 컴포넌트에 너무 많은 책임
- 메뉴 목록 렌더링
- 옵션 선택 로직
- 장바구니 관리
- 주문 처리
- UI 렌더링
```
**문제점**: 
- 단일 책임 원칙 위반
- 테스트 어려움
- 재사용 불가능

**개선 방안**: 
- `MenuCard`, `CartSection`, `OrderSummary` 등으로 분리

#### 4.2 인라인 스타일 로직
**위치**: 여러 파일
```javascript
// 조건부 클래스명이 복잡함
className={`px-4 py-1.5 border rounded text-sm ${
  order.status === 'completed' || order.status === 'cancelled'
    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
    : 'border-gray-400 text-gray-700 hover:bg-gray-50'
}`}
```
**개선 방안**: 
- `clsx` 또는 `classnames` 라이브러리 사용
- 또는 유틸리티 함수로 추출

---

## 🟡 중간 우선순위 개선점

### 5. **에러 처리 부족**

#### 5.1 일관되지 않은 에러 처리
**위치**: 여러 파일
```javascript
// CustomerMenu.jsx - alert 사용
alert('주문이 완료되었습니다!')

// 다른 파일 - toast 사용
toast.error('주문 정보를 불러오는데 실패했습니다')
```
**문제점**: 
- 사용자 경험 불일치
- alert는 모던 웹 앱에 부적합

**개선 방안**: 
- 모든 알림을 `react-hot-toast`로 통일

#### 5.2 에러 바운더리 부재
**문제점**: 
- 예상치 못한 에러 발생 시 전체 앱 크래시 가능

**개선 방안**: 
- React Error Boundary 구현

---

### 6. **타입 안정성 부족**

#### 6.1 PropTypes 또는 TypeScript 없음
**문제점**: 
- 런타임 에러 가능성
- IDE 자동완성 부족
- 리팩토링 시 안전성 부족

**개선 방안**: 
- TypeScript 도입 또는 PropTypes 추가

---

### 7. **접근성 (Accessibility) 문제**

#### 7.1 키보드 네비게이션 부족
```javascript
// CustomerMenu.jsx (134줄)
<span onClick={() => navigate('/orders')}>
  주문하기
</span>
```
**문제점**: 
- `<span>`에 onClick 사용 - 키보드 접근 불가
- 포커스 가능한 요소가 아님

**개선 방안**: 
- `<button>` 또는 `<Link>` 사용

#### 7.2 ARIA 속성 부족
**개선 방안**: 
- 적절한 `role`, `aria-label` 추가

---

### 8. **성능 최적화 부족**

#### 8.1 불필요한 리렌더링
```javascript
// CustomerMenu.jsx - 매번 계산되는 totalAmount
const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
```
**개선 방안**: 
- `useMemo`로 메모이제이션

#### 8.2 이미지 최적화 부족
```javascript
// 외부 이미지 URL 직접 사용
<img src="https://images.unsplash.com/..." />
```
**개선 방안**: 
- 이미지 lazy loading
- 최적화된 이미지 URL 사용

---

## 🟢 낮은 우선순위 개선점

### 9. **코드 스타일 일관성**

#### 9.1 네이밍 불일치
- `CustomerMenu` vs `Menu`
- `AdminDashboardNew` (New 접미사는 임시적)

#### 9.2 주석 부족
- 복잡한 로직에 주석 없음
- 함수 JSDoc 부재

---

### 10. **테스트 커버리지**

#### 10.1 테스트 파일은 있으나 실제 사용 컴포넌트와 불일치
- `CustomerMenu.test.jsx` 없음
- `AdminDashboardNew.test.jsx` 없음

---

## 📊 우선순위별 개선 계획

### Phase 1: 긴급 (즉시 개선)
1. ✅ 중복 코드 제거 (상태 유틸리티 함수)
2. ✅ 헤더 컴포넌트 통합
3. ✅ 로딩 스피너 컴포넌트화
4. ✅ localStorage 추상화 (커스텀 훅)

### Phase 2: 중요 (단기)
5. ✅ 장바구니 전역 상태 관리
6. ✅ API 설정 중앙화
7. ✅ 컴포넌트 분리 (CustomerMenu, AdminDashboardNew)
8. ✅ 에러 처리 통일

### Phase 3: 개선 (중기)
9. ✅ TypeScript 도입 검토
10. ✅ 접근성 개선
11. ✅ 성능 최적화
12. ✅ 테스트 커버리지 향상

---

## 🛠️ 권장 리팩토링 구조

```
src/
├── components/
│   ├── common/
│   │   ├── Header.jsx          # 통합 헤더
│   │   ├── LoadingSpinner.jsx  # 로딩 스피너
│   │   └── ErrorBoundary.jsx   # 에러 바운더리
│   ├── menu/
│   │   ├── MenuCard.jsx
│   │   └── MenuOption.jsx
│   ├── cart/
│   │   ├── CartItem.jsx
│   │   └── CartSummary.jsx
│   └── order/
│       ├── OrderCard.jsx
│       └── StatusBadge.jsx
├── contexts/
│   ├── AuthContext.jsx
│   └── CartContext.jsx          # 새로 추가
├── hooks/
│   ├── useLocalStorage.js       # 새로 추가
│   └── useApi.js                # 새로 추가
├── utils/
│   ├── orderUtils.js            # 새로 추가
│   └── formatUtils.js           # 새로 추가
├── constants/
│   ├── orderStatus.js            # 새로 추가
│   └── api.js                    # 새로 추가
└── config/
    └── api.js                    # 새로 추가
```

---

## 📝 결론

현재 코드는 기능적으로는 동작하지만, 유지보수성과 확장성 측면에서 개선이 필요합니다. 특히 중복 코드 제거와 상태 관리 개선이 가장 시급합니다. 위의 우선순위에 따라 단계적으로 리팩토링을 진행하는 것을 권장합니다.

