# OrderBean ☕

**바쁜 아침, 줄 서지 말고 바로 픽업하세요!**

OrderBean은 바쁜 도시 생활자들을 위한 미리 주문 & 대기 없이 픽업 커피 주문 웹 서비스입니다.

## 프로젝트 구조

```
OrderBean/
├── frontend/                 # React + Tailwind CSS 프론트엔드
│   ├── src/
│   │   ├── components/       # 재사용 가능한 컴포넌트
│   │   │   ├── Navbar.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── contexts/         # Context API (전역 상태)
│   │   │   └── AuthContext.jsx
│   │   ├── pages/           # 페이지 컴포넌트
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Cafes.jsx
│   │   │   ├── Menu.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── OrderDetail.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── App.jsx          # 메인 앱 컴포넌트
│   │   ├── main.jsx         # 진입점
│   │   └── index.css        # 글로벌 스타일
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                  # Node.js/Express 백엔드
│   ├── models/              # MongoDB 모델
│   │   ├── User.js
│   │   ├── Cafe.js
│   │   ├── Menu.js
│   │   └── Order.js
│   ├── routes/              # API 라우트
│   │   ├── auth.js
│   │   ├── cafes.js
│   │   ├── menus.js
│   │   ├── orders.js
│   │   └── admin.js
│   ├── middleware/          # 미들웨어
│   │   └── auth.js          # JWT 인증
│   ├── scripts/             # 유틸리티 스크립트
│   │   └── seed.js          # 초기 데이터 시드
│   ├── server.js            # 서버 진입점
│   └── package.json
│
├── PRD_OrderBean.md         # PRD 문서
├── PROJECT_STRUCTURE.md    # 상세 프로젝트 구조 문서
└── README.md                # 이 파일
```

> 📖 더 자세한 프로젝트 구조는 [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)를 참고하세요.

## 기술 스택

### 프론트엔드
- React
- Tailwind CSS
- React Router
- Axios

### 백엔드
- Node.js
- Express
- MongoDB
- JWT (인증)
- bcrypt (비밀번호 해싱)

## 주요 기능

### 고객 기능
- 커피 메뉴 조회 및 주문
- 위치 기반 카페 검색
- 미리 주문 및 결제
- 주문 내역 조회
- 재주문 기능
- 예상 픽업 시간 알림

### 관리자 기능
- 실시간 주문 대시보드
- 주문 상태 관리
- 메뉴 및 재고 관리
- 영업 시간 설정
- 판매 보고서

## 시작하기

### 1. MongoDB 설정
MongoDB가 설치되어 있어야 합니다. 로컬 MongoDB를 사용하거나 MongoDB Atlas를 사용할 수 있습니다.

### 2. 백엔드 설정
```bash
cd backend
npm install
cp .env.example .env
# .env 파일을 편집하여 환경 변수 설정
npm run dev
```

### 3. 초기 데이터 시드 (선택사항)
```bash
cd backend
node scripts/seed.js
```
이 스크립트는 테스트용 사용자, 카페, 메뉴 데이터를 생성합니다:
- 고객 계정: `customer@test.com` / `password123`
- 매장 관리자 계정: `merchant@test.com` / `password123`

### 4. 프론트엔드 실행
```bash
cd frontend
npm install
npm run dev
```

프론트엔드는 `http://localhost:3000`에서 실행되고, 백엔드는 `http://localhost:5000`에서 실행됩니다.

## 환경 변수 설정

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/orderbean
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

## API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보

### 카페
- `GET /api/cafes` - 카페 목록 조회
- `GET /api/cafes/:id` - 카페 상세 정보

### 메뉴
- `GET /api/menus` - 메뉴 목록 조회 (cafeId, category 필터 지원)
- `GET /api/menus/:id` - 메뉴 상세 정보

### 주문
- `POST /api/orders` - 주문 생성
- `GET /api/orders` - 주문 목록 조회
- `GET /api/orders/:id` - 주문 상세 정보
- `PATCH /api/orders/:id/cancel` - 주문 취소

### 관리자
- `GET /api/admin/orders` - 관리자 주문 목록
- `PATCH /api/admin/orders/:id/status` - 주문 상태 업데이트
- `GET /api/admin/menus` - 관리자 메뉴 목록
- `POST /api/admin/menus` - 메뉴 생성
- `PATCH /api/admin/menus/:id` - 메뉴 수정
- `GET /api/admin/stats` - 판매 통계

## 라이선스

Toy Project - 개인/소규모 팀 개발용

## To-Do List

### TC (Test Cases)
- [ ] 테스트 케이스 작성 및 커버리지 향상

### Implementation
- [ ] 추가 기능 구현

### Refactoring

상세한 리팩토링 분석은 [frontend/REFACTORING_ANALYSIS.md](./frontend/REFACTORING_ANALYSIS.md)를 참고하세요.

#### Phase 1: 긴급 (즉시 개선) 🔴

- [ ] **중복 코드 제거** 
  
  > 📖 상세 리팩토링 계획: [frontend/REFACTORING_PLAN_ORDER_STATUS.md](./frontend/REFACTORING_PLAN_ORDER_STATUS.md)
  
  **Phase 1: 상수 정의 및 타입 안정성 확보**
  - [ ] `src/constants/orderStatus.js` 생성
    - [ ] `ORDER_STATUS` 상수 정의 (Magic Strings 제거)
    - [ ] `ORDER_STATUS_TEXT` 매핑 정의 (일관된 텍스트)
    - [ ] `ORDER_STATUS_COLORS` 매핑 정의 (Tailwind CSS 클래스)
    - [ ] `ORDER_STATUS_FLOW` 정의 (상태 전이 로직)
    - [ ] `isValidOrderStatus()` 유효성 검사 함수
    - [ ] `getOrderStatusText()`, `getOrderStatusColor()` 함수
    - [ ] `getNextStatus()`, `canTransitionToNext()` 함수
  
  **Phase 2: 유틸리티 함수 통합**
  - [ ] `src/utils/orderUtils.js` 생성
    - [ ] `getStatusText()`, `getStatusColor()` 함수 통합 (별칭)
    - [ ] `getStatusInfo()` 함수 추가 (통합 정보 객체)
    - [ ] `getStatusButtonText()` 함수 통합 (관리자용)
    - [ ] 상수 재내보내기
  
  **Phase 3: 컴포넌트 리팩토링**
  - [ ] `Orders.jsx` 리팩토링
    - [ ] 중복 함수 제거 (`getStatusColor`, `getStatusText`)
    - [ ] `orderUtils`에서 import
  - [ ] `OrderDetail.jsx` 리팩토링
    - [ ] 중복 함수 제거
    - [ ] `canCancel` 로직을 `getStatusInfo()` 사용으로 개선
    - [ ] '제작 중' → '제조 중' 텍스트 통일
  - [ ] `AdminDashboard.jsx` 리팩토링
    - [ ] `getStatusColor` 함수 제거
  - [ ] `AdminDashboardNew.jsx` 리팩토링
    - [ ] `statusFlow` 객체 제거, `getNextStatus()` 사용
    - [ ] `getStatusButtonText` 함수 제거
  
  **Phase 4: 테스트 작성**
  - [ ] `src/constants/__tests__/orderStatus.test.js` 작성
  - [ ] `src/utils/__tests__/orderUtils.test.js` 작성
  - [ ] 테스트 커버리지 80% 이상 달성
  
  **Phase 5: 문서화 및 검증**
  - [ ] JSDoc 주석 추가
  - [ ] 통합 테스트 완료
  - [ ] 코드 리뷰 완료
  
  **코드 스멜 해결**:
  - ✅ Magic Strings 제거
  - ✅ DRY 원칙 준수
  - ✅ 일관성 확보
  
  **SOLID 원칙 적용**:
  - ✅ SRP: 상태 로직을 별도 모듈로 분리
  - ✅ OCP: 새로운 상태 추가 시 상수 파일만 수정
  - ✅ DIP: 컴포넌트는 추상화(상수)에 의존

- [ ] **헤더 컴포넌트 통합**
  - [ ] `src/components/common/Header.jsx` 생성 또는 기존 `Navbar.jsx` 활용
  - [ ] `CustomerMenu.jsx`, `AdminDashboardNew.jsx`, `Orders.jsx`에서 중복 헤더 제거

- [ ] **로딩 스피너 컴포넌트화**
  - [ ] `src/components/common/LoadingSpinner.jsx` 생성
  - [ ] 모든 페이지에서 공통 컴포넌트 사용

- [ ] **localStorage 추상화**
  - [ ] `src/hooks/useLocalStorage.js` 커스텀 훅 생성
  - [ ] 에러 처리 및 타입 안정성 추가
  - [ ] `CustomerMenu.jsx`, `Orders.jsx`, `Cart.jsx`에서 적용

#### Phase 2: 중요 (단기) 🟡

- [ ] **장바구니 전역 상태 관리**
  - [ ] `src/contexts/CartContext.jsx` 생성
  - [ ] `CustomerMenu.jsx`, `Menu.jsx`, `Cart.jsx`에서 전역 상태 사용
  - [ ] 상태 동기화 문제 해결

- [ ] **API 설정 중앙화**
  - [ ] `src/config/api.js` 생성 - API 베이스 URL 설정
  - [ ] axios instance 생성 및 인터셉터 설정
  - [ ] 환경 변수 지원 (개발/프로덕션)

- [ ] **컴포넌트 분리**
  - [ ] `CustomerMenu.jsx` 분리:
    - [ ] `src/components/menu/MenuCard.jsx` 생성
    - [ ] `src/components/menu/MenuOption.jsx` 생성
    - [ ] `src/components/cart/CartSection.jsx` 생성
    - [ ] `src/components/cart/OrderSummary.jsx` 생성
  - [ ] `AdminDashboardNew.jsx` 분리:
    - [ ] `src/components/admin/InventoryCard.jsx` 생성
    - [ ] `src/components/admin/OrderCard.jsx` 생성
    - [ ] `src/components/order/StatusBadge.jsx` 생성

- [ ] **에러 처리 통일**
  - [ ] 모든 `alert()` 호출을 `react-hot-toast`로 변경
  - [ ] `src/components/common/ErrorBoundary.jsx` 생성
  - [ ] 일관된 에러 처리 패턴 적용

#### Phase 3: 개선 (중기) 🟢

- [ ] **타입 안정성**
  - [ ] TypeScript 도입 검토 또는 PropTypes 추가
  - [ ] 주요 컴포넌트에 타입 정의

- [ ] **접근성 개선**
  - [ ] `<span onClick>` → `<button>` 또는 `<Link>` 변경
  - [ ] ARIA 속성 추가 (`role`, `aria-label`)
  - [ ] 키보드 네비게이션 지원

- [ ] **성능 최적화**
  - [ ] `useMemo`로 계산값 메모이제이션 (`totalAmount` 등)
  - [ ] 이미지 lazy loading 적용
  - [ ] 불필요한 리렌더링 최소화

- [ ] **테스트 커버리지 향상**
  - [ ] `CustomerMenu.test.jsx` 작성
  - [ ] `AdminDashboardNew.test.jsx` 작성
  - [ ] 유틸리티 함수 테스트 작성

- [ ] **코드 품질 개선**
  - [ ] `clsx` 또는 `classnames` 라이브러리 추가
  - [ ] 복잡한 조건부 클래스명 정리
  - [ ] JSDoc 주석 추가
  - [ ] 네이밍 일관성 개선 (`AdminDashboardNew` → `AdminDashboard`)

