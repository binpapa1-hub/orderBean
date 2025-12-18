# 헤더 컴포넌트 통합 리팩토링 계획

## 📋 개요

이 문서는 `README.md`의 238-240줄에 해당하는 "헤더 컴포넌트 통합" 작업에 대한 상세한 리팩토링 계획입니다. 코드 스멜, 정적 분석, SOLID 원칙을 고려하여 단계적으로 진행합니다.

---

## 🔍 현재 상황 분석

### 발견된 문제점

#### 1. 코드 중복 (DRY 원칙 위반)
- 헤더 구조가 3개 파일에 중복:
  - `CustomerMenu.jsx` (126-145줄)
  - `AdminDashboardNew.jsx` (80-99줄)
  - `Orders.jsx` (59-81줄)

- 동일한 구조 반복:
```javascript
<header className="bg-white border-b border-gray-300 flex items-center justify-between px-6 py-4">
  <div className="text-xl font-bold text-gray-800">OrderBean - 커피 주문</div>
  <div className="flex items-center space-x-4">
    <span onClick={() => navigate('/orders')}>주문하기</span>
    <button onClick={() => navigate('/admin')}>관리자</button>
  </div>
</header>
```

#### 2. 코드 스멜 (Code Smells)

**접근성 문제**
```javascript
// CustomerMenu.jsx, AdminDashboardNew.jsx, Orders.jsx
<span onClick={() => navigate('/orders')}>
  주문하기
</span>
```
**문제점**: 
- `<span>`에 onClick 사용 - 키보드 접근 불가
- 포커스 가능한 요소가 아님
- 스크린 리더에서 버튼으로 인식되지 않음

**일관성 부족**
- `Navbar.jsx`는 `shadow-md` 스타일 사용
- 중복 헤더는 `border-b` 스타일 사용
- UI 일관성 부족

**기존 Navbar 미사용**
- `Navbar.jsx`가 이미 존재하지만 사용되지 않음
- 인증 기능이 포함되어 있어 더 완전한 구현

#### 3. SOLID 원칙 위반

**Single Responsibility Principle (SRP) 위반**
- 각 페이지 컴포넌트가 UI 렌더링과 헤더 렌더링을 모두 담당
- 헤더 로직이 페이지 컴포넌트에 결합됨

**Open/Closed Principle (OCP) 위반**
- 헤더 변경 시 여러 파일 수정 필요
- 확장에는 열려있지 않고, 수정에는 닫혀있지 않음

**Dependency Inversion Principle (DIP) 위반**
- 컴포넌트가 구체적인 헤더 구현에 의존

#### 4. 정적 분석 관점

**타입 안정성 부족**
- props에 대한 타입 정의 없음
- 잘못된 props 전달 시 런타임 에러 가능

**재사용성 낮음**
- 헤더가 각 페이지에 하드코딩되어 재사용 불가능

**테스트 어려움**
- 헤더 로직이 페이지 컴포넌트에 결합되어 단위 테스트 어려움

---

## 🎯 리팩토링 목표

1. ✅ **중복 코드 제거**: DRY 원칙 준수
2. ✅ **접근성 개선**: 키보드 네비게이션 및 ARIA 속성 추가
3. ✅ **일관성 확보**: 통일된 헤더 스타일 및 구조
4. ✅ **재사용성 향상**: 공통 헤더 컴포넌트 생성
5. ✅ **SOLID 원칙 준수**: 책임 분리 및 의존성 역전
6. ✅ **기존 Navbar 활용**: 인증 기능 통합

---

## 📝 단계별 리팩토링 계획

### Phase 1: 헤더 컴포넌트 설계 및 분석

#### Step 1.1: 현재 헤더 구조 분석
**목적**: 
- 각 헤더의 기능 및 스타일 차이점 파악
- 통합 가능한 부분 식별

**작업 내용**:
- [ ] `CustomerMenu.jsx` 헤더 분석
  - 기능: 주문하기 링크, 관리자 버튼
  - 스타일: `border-b border-gray-300`
  - 접근성: `<span onClick>` 사용 (문제)
  
- [ ] `AdminDashboardNew.jsx` 헤더 분석
  - 기능: 주문하기 링크, 관리자 버튼 (비활성화 스타일)
  - 스타일: `border-b border-gray-300`
  - 접근성: `<span onClick>` 사용 (문제)
  
- [ ] `Orders.jsx` 헤더 분석
  - 기능: 주문하기 링크, 관리자 버튼
  - 스타일: `border-b border-gray-300`
  - 접근성: `<span onClick>` 사용 (문제)
  
- [ ] `Navbar.jsx` 분석
  - 기능: 인증 기능, 사용자 정보, 카페 찾기, 주문 내역
  - 스타일: `shadow-md`
  - 접근성: `<Link>`, `<button>` 사용 (양호)

**결과물**: 헤더 기능 비교표 작성

---

#### Step 1.2: 통합 헤더 설계
**목적**: 
- 통합 헤더의 props 인터페이스 설계
- 다양한 사용 케이스 지원

**설계 고려사항**:
```javascript
// 통합 헤더 컴포넌트 설계
<Header 
  variant="default" | "simple"  // 스타일 변형
  showAuth={true}               // 인증 기능 표시 여부
  showAdmin={true}              // 관리자 버튼 표시 여부
  showOrders={true}             // 주문하기 링크 표시 여부
  currentPage="home"             // 현재 페이지 (활성 상태 표시)
/>
```

**작업 내용**:
- [ ] 헤더 variants 정의
  - `default`: 인증 기능 포함 (Navbar 기반)
  - `simple`: 간단한 헤더 (현재 중복 헤더 기반)
  
- [ ] Props 인터페이스 설계
  - 필수 props
  - 선택적 props
  - 기본값 정의

---

### Phase 2: 통합 헤더 컴포넌트 생성

#### Step 2.1: Header 컴포넌트 생성
**파일**: `frontend/src/components/common/Header.jsx`

**목적**: 
- 모든 페이지에서 사용할 수 있는 통합 헤더
- 기존 Navbar 기능 통합
- 접근성 개선

**작업 내용**:
```javascript
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

/**
 * 통합 헤더 컴포넌트
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
  const location = useLocation()

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
```

**체크리스트**:
- [ ] Header 컴포넌트 생성
- [ ] 기존 Navbar 기능 통합
- [ ] 접근성 개선 (`<span onClick>` → `<Link>` 또는 `<button>`)
- [ ] ARIA 속성 추가
- [ ] 스타일 변형 지원
- [ ] Props 타입 정의 (JSDoc)

---

#### Step 2.2: Header 컴포넌트 최적화
**목적**: 
- 성능 최적화
- 코드 품질 개선

**작업 내용**:
- [ ] `useMemo`로 스타일 클래스 메모이제이션
- [ ] 조건부 렌더링 최적화
- [ ] 불필요한 리렌더링 방지
- [ ] 코드 주석 추가

---

### Phase 3: 기존 컴포넌트 리팩토링

#### Step 3.1: CustomerMenu.jsx 리팩토링
**파일**: `frontend/src/pages/CustomerMenu.jsx`

**작업 내용**:
```javascript
// Before
<header 
  role="banner"
  className="bg-white border-b border-gray-300 flex items-center justify-between px-6 py-4"
>
  <div className="text-xl font-bold text-gray-800">OrderBean - 커피 주문</div>
  <div className="flex items-center space-x-4">
    <span 
      className="text-gray-600 cursor-pointer hover:text-gray-900"
      onClick={() => navigate('/orders')}
    >
      주문하기
    </span>
    <button 
      className="px-4 py-2 border border-gray-400 rounded text-gray-700 hover:bg-gray-50 transition-colors"
      onClick={() => navigate('/admin')}
    >
      관리자
    </button>
  </div>
</header>

// After
import Header from '../components/common/Header'

<Header 
  variant="simple"
  showAuth={false}
  showAdmin={true}
  showOrders={true}
/>
```

**체크리스트**:
- [ ] Header import 추가
- [ ] 중복 헤더 코드 제거 (126-145줄)
- [ ] Header 컴포넌트로 교체
- [ ] 기능 동일성 확인
- [ ] 스타일 일관성 확인

---

#### Step 3.2: AdminDashboardNew.jsx 리팩토링
**파일**: `frontend/src/pages/AdminDashboardNew.jsx`

**작업 내용**:
```javascript
// Before
<header 
  role="banner"
  className="bg-white border-b border-gray-300 flex items-center justify-between px-6 py-4"
>
  <div className="text-xl font-bold text-gray-800">OrderBean - 커피 주문</div>
  <div className="flex items-center space-x-4">
    <span 
      className="text-gray-600 cursor-pointer hover:text-gray-900"
      onClick={() => navigate('/')}
    >
      주문하기
    </span>
    <button 
      className="px-4 py-2 border border-gray-400 rounded text-gray-700 bg-gray-50"
    >
      관리자
    </button>
  </div>
</header>

// After
import Header from '../components/common/Header'

<Header 
  variant="simple"
  showAuth={false}
  showAdmin={true}
  showOrders={true}
/>
```

**체크리스트**:
- [ ] Header import 추가
- [ ] 중복 헤더 코드 제거 (80-99줄)
- [ ] Header 컴포넌트로 교체
- [ ] 관리자 페이지에서 관리자 버튼 비활성화 스타일 처리
- [ ] 기능 동일성 확인

---

#### Step 3.3: Orders.jsx 리팩토링
**파일**: `frontend/src/pages/Orders.jsx`

**작업 내용**:
```javascript
// Before
<header className="bg-white border-b border-gray-300 flex items-center justify-between px-6 py-4">
  <div 
    className="text-xl font-bold text-gray-800 cursor-pointer"
    onClick={() => navigate('/')}
  >
    OrderBean - 커피 주문
  </div>
  <div className="flex items-center space-x-4">
    <span 
      className="text-gray-600 cursor-pointer hover:text-gray-900"
      onClick={() => navigate('/')}
    >
      주문하기
    </span>
    <button 
      className="px-4 py-2 border border-gray-400 rounded text-gray-700 hover:bg-gray-50"
      onClick={() => navigate('/admin')}
    >
      관리자
    </button>
  </div>
</header>

// After
import Header from '../components/common/Header'

<Header 
  variant="simple"
  showAuth={false}
  showAdmin={true}
  showOrders={true}
/>
```

**체크리스트**:
- [ ] Header import 추가
- [ ] 중복 헤더 코드 제거 (59-81줄)
- [ ] Header 컴포넌트로 교체
- [ ] 기능 동일성 확인

---

#### Step 3.4: App.jsx 업데이트 (선택사항)
**파일**: `frontend/src/App.jsx`

**목적**: 
- 전역 헤더 적용 검토
- 레이아웃 컴포넌트 생성 검토

**작업 내용**:
- [ ] 전역 헤더 적용 여부 결정
- [ ] 레이아웃 컴포넌트 생성 검토
- [ ] 라우트 구조 최적화

---

### Phase 4: 기존 Navbar 처리

#### Step 4.1: Navbar.jsx 처리 결정
**파일**: `frontend/src/components/Navbar.jsx`

**옵션**:
1. **Navbar.jsx 제거**: Header 컴포넌트로 완전 대체
2. **Navbar.jsx 유지**: Header의 `variant="default"`로 사용
3. **Navbar.jsx 리팩토링**: Header 컴포넌트 기반으로 재작성

**권장**: 옵션 2 (Navbar.jsx를 Header의 별칭으로 사용)

**작업 내용**:
- [ ] Navbar.jsx 처리 방식 결정
- [ ] Navbar.jsx를 Header로 리팩토링하거나 제거
- [ ] Navbar를 사용하는 다른 파일 확인 및 업데이트

---

### Phase 5: 테스트 작성

#### Step 5.1: Header 컴포넌트 테스트
**파일**: `frontend/src/components/common/__tests__/Header.test.jsx`

**작업 내용**:
```javascript
import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Header from '../Header'
import { AuthProvider } from '../../../contexts/AuthContext'

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('Header', () => {
  test('기본 렌더링', () => {
    renderWithProviders(<Header />)
    expect(screen.getByText('OrderBean - 커피 주문')).toBeInTheDocument()
  })

  test('simple variant 스타일 적용', () => {
    const { container } = renderWithProviders(<Header variant="simple" />)
    const header = container.querySelector('header')
    expect(header).toHaveClass('border-b')
  })

  test('showAuth=false일 때 인증 기능 숨김', () => {
    renderWithProviders(<Header showAuth={false} />)
    expect(screen.queryByText('로그인')).not.toBeInTheDocument()
  })

  test('showAdmin=false일 때 관리자 버튼 숨김', () => {
    renderWithProviders(<Header showAdmin={false} />)
    expect(screen.queryByText('관리자')).not.toBeInTheDocument()
  })

  test('접근성: Link 요소 사용', () => {
    renderWithProviders(<Header />)
    const orderLink = screen.getByLabelText('주문 내역 보기')
    expect(orderLink.tagName).toBe('A')
  })

  // ... 더 많은 테스트
})
```

**체크리스트**:
- [ ] 기본 렌더링 테스트
- [ ] variant 테스트
- [ ] props 테스트 (showAuth, showAdmin, showOrders)
- [ ] 접근성 테스트
- [ ] 인증 상태별 테스트
- [ ] 네비게이션 테스트

---

### Phase 6: 문서화 및 검증

#### Step 6.1: JSDoc 주석 추가
**목적**: IDE 자동완성 및 문서 생성

**작업 내용**:
- [ ] 모든 props에 JSDoc 주석 추가
- [ ] 사용 예제 추가
- [ ] 타입 정의 명시

---

#### Step 6.2: 통합 테스트
**체크리스트**:
- [ ] 모든 페이지에서 헤더가 정상 표시되는지 확인
- [ ] 네비게이션이 올바르게 작동하는지 확인
- [ ] 인증 상태에 따른 헤더 변경 확인
- [ ] 접근성 검증 (키보드 네비게이션)
- [ ] 반응형 디자인 확인

---

#### Step 6.3: 코드 리뷰 체크리스트
- [ ] 중복 코드 제거 확인
- [ ] 접근성 개선 확인
- [ ] SOLID 원칙 준수 확인
- [ ] 테스트 커버리지 확인
- [ ] 문서화 완료 확인

---

## 📊 예상 효과

### 코드 품질 개선
- ✅ 중복 코드 제거: ~60줄 감소
- ✅ 접근성 개선: 키보드 네비게이션 지원
- ✅ 일관성 확보: 통일된 헤더 스타일
- ✅ 유지보수성 향상: 헤더 변경 시 1개 파일만 수정

### 개발자 경험 개선
- ✅ 재사용 가능한 컴포넌트
- ✅ Props를 통한 유연한 커스터마이징
- ✅ 타입 안정성 향상

### 사용자 경험 개선
- ✅ 접근성 향상 (키보드 네비게이션, 스크린 리더 지원)
- ✅ 일관된 UI/UX
- ✅ 인증 상태에 따른 적절한 네비게이션

---

## 🚨 주의사항

1. **점진적 리팩토링**: 한 번에 모든 파일을 수정하지 말고, 단계적으로 진행
2. **기존 기능 유지**: 리팩토링 후 기존 기능이 정상 동작하는지 확인
3. **접근성 테스트**: 키보드 네비게이션 및 스크린 리더 테스트 필수
4. **스타일 일관성**: 기존 디자인과 일치하는지 확인

---

## 📅 예상 소요 시간

- Phase 1: 30분 (분석 및 설계)
- Phase 2: 1-2시간 (Header 컴포넌트 생성)
- Phase 3: 1-2시간 (컴포넌트 리팩토링)
- Phase 4: 30분 (Navbar 처리)
- Phase 5: 1-2시간 (테스트 작성)
- Phase 6: 30분 (문서화 및 검증)

**총 예상 시간**: 5-8시간

---

## ✅ 완료 체크리스트

### Phase 1
- [ ] 현재 헤더 구조 분석
- [ ] 통합 헤더 설계
- [ ] Props 인터페이스 정의

### Phase 2
- [ ] Header 컴포넌트 생성
- [ ] 기존 Navbar 기능 통합
- [ ] 접근성 개선
- [ ] 스타일 변형 지원

### Phase 3
- [ ] CustomerMenu.jsx 리팩토링
- [ ] AdminDashboardNew.jsx 리팩토링
- [ ] Orders.jsx 리팩토링
- [ ] App.jsx 업데이트 (선택사항)

### Phase 4
- [ ] Navbar.jsx 처리 결정
- [ ] Navbar.jsx 리팩토링 또는 제거

### Phase 5
- [ ] Header.test.jsx 작성
- [ ] 테스트 커버리지 80% 이상 달성

### Phase 6
- [ ] JSDoc 주석 추가
- [ ] 통합 테스트 완료
- [ ] 코드 리뷰 완료

---

## 📚 참고 자료

- [React 접근성 가이드](https://react.dev/learn/accessibility)
- [ARIA 속성 가이드](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [SOLID 원칙](https://en.wikipedia.org/wiki/SOLID)
- [DRY 원칙](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)

