# OrderBean 프로젝트 구조

## 전체 구조

```
OrderBean/
├── frontend/                 # React 프론트엔드
│   ├── src/
│   │   ├── components/       # 재사용 가능한 컴포넌트
│   │   ├── contexts/         # Context API (전역 상태)
│   │   ├── pages/            # 페이지 컴포넌트
│   │   ├── App.jsx           # 메인 앱 컴포넌트
│   │   ├── main.jsx          # 진입점
│   │   └── index.css         # 글로벌 스타일
│   ├── index.html            # HTML 템플릿
│   ├── package.json          # 의존성 관리
│   ├── vite.config.js        # Vite 설정
│   ├── tailwind.config.js    # Tailwind CSS 설정
│   ├── postcss.config.js     # PostCSS 설정
│   └── .gitignore           # Git 무시 파일
│
├── backend/                  # Node.js 백엔드
│   ├── models/               # MongoDB 모델
│   ├── routes/               # API 라우트
│   ├── middleware/           # 미들웨어 (인증 등)
│   ├── scripts/              # 유틸리티 스크립트
│   ├── server.js             # 서버 진입점
│   ├── package.json         # 의존성 관리
│   └── .gitignore           # Git 무시 파일
│
├── PRD_OrderBean.md         # PRD 문서
├── README.md                 # 프로젝트 설명서
└── PROJECT_STRUCTURE.md     # 이 파일
```

## 프론트엔드 구조 (frontend/)

### 디렉토리 상세

```
frontend/
├── src/
│   ├── components/           # 재사용 가능한 컴포넌트
│   │   ├── Navbar.jsx        # 네비게이션 바
│   │   └── PrivateRoute.jsx # 인증이 필요한 라우트 보호
│   │
│   ├── contexts/             # Context API
│   │   └── AuthContext.jsx   # 인증 상태 관리
│   │
│   ├── pages/                # 페이지 컴포넌트
│   │   ├── Home.jsx          # 홈 페이지
│   │   ├── Login.jsx         # 로그인 페이지
│   │   ├── Register.jsx      # 회원가입 페이지
│   │   ├── Cafes.jsx         # 카페 목록 페이지
│   │   ├── Menu.jsx          # 메뉴 조회 페이지
│   │   ├── Cart.jsx          # 장바구니 페이지
│   │   ├── Orders.jsx        # 주문 내역 페이지
│   │   ├── OrderDetail.jsx   # 주문 상세 페이지
│   │   └── AdminDashboard.jsx # 관리자 대시보드
│   │
│   ├── App.jsx               # 메인 앱 컴포넌트 (라우팅)
│   ├── main.jsx              # React 진입점
│   └── index.css             # 글로벌 스타일 (Tailwind)
│
├── index.html                # HTML 템플릿
├── package.json              # npm 의존성 및 스크립트
├── vite.config.js            # Vite 빌드 도구 설정
├── tailwind.config.js        # Tailwind CSS 설정
├── postcss.config.js         # PostCSS 설정
└── .gitignore               # Git 무시 파일
```

### 주요 파일 설명

- **App.jsx**: React Router를 사용한 라우팅 설정
- **AuthContext.jsx**: 사용자 인증 상태를 전역으로 관리
- **components/**: 여러 페이지에서 재사용되는 컴포넌트
- **pages/**: 각 라우트에 해당하는 페이지 컴포넌트

## 백엔드 구조 (backend/)

### 디렉토리 상세

```
backend/
├── models/                   # MongoDB 데이터 모델
│   ├── User.js              # 사용자 모델
│   ├── Cafe.js              # 카페 모델
│   ├── Menu.js              # 메뉴 모델
│   └── Order.js             # 주문 모델
│
├── routes/                   # API 라우트 핸들러
│   ├── auth.js              # 인증 관련 라우트 (회원가입, 로그인)
│   ├── cafes.js             # 카페 관련 라우트
│   ├── menus.js             # 메뉴 관련 라우트
│   ├── orders.js            # 주문 관련 라우트
│   └── admin.js             # 관리자 관련 라우트
│
├── middleware/              # Express 미들웨어
│   └── auth.js              # JWT 인증 미들웨어
│
├── scripts/                 # 유틸리티 스크립트
│   └── seed.js              # 초기 데이터 시드 스크립트
│
├── server.js                # Express 서버 진입점
├── package.json             # npm 의존성 및 스크립트
└── .gitignore               # Git 무시 파일
```

### 주요 파일 설명

- **server.js**: Express 서버 설정 및 라우트 등록
- **models/**: Mongoose를 사용한 데이터 모델 정의
- **routes/**: 각 API 엔드포인트의 핸들러 함수
- **middleware/auth.js**: JWT 토큰 검증 미들웨어
- **scripts/seed.js**: 테스트 데이터 생성 스크립트

## 데이터 흐름

### 주문 생성 플로우

```
1. 사용자 (Frontend)
   └─> Menu.jsx: 메뉴 선택 및 장바구니 추가
   
2. Cart.jsx: 주문하기 버튼 클릭
   └─> POST /api/orders 요청
   
3. Backend: routes/orders.js
   └─> middleware/auth.js: JWT 토큰 검증
   └─> models/Order.js: 주문 데이터 저장
   └─> 응답 반환
   
4. Frontend: OrderDetail.jsx
   └─> 주문 상세 페이지 표시
```

### 인증 플로우

```
1. 사용자 (Frontend)
   └─> Login.jsx: 이메일/비밀번호 입력
   
2. POST /api/auth/login 요청
   
3. Backend: routes/auth.js
   └─> models/User.js: 사용자 조회 및 비밀번호 검증
   └─> JWT 토큰 생성 및 반환
   
4. Frontend: AuthContext.jsx
   └─> 토큰 저장 및 사용자 상태 업데이트
```

## API 구조

### 라우트 그룹

- **/api/auth**: 인증 관련 (회원가입, 로그인, 사용자 정보)
- **/api/cafes**: 카페 관련 (목록, 상세 정보)
- **/api/menus**: 메뉴 관련 (목록, 상세 정보)
- **/api/orders**: 주문 관련 (생성, 조회, 취소)
- **/api/admin**: 관리자 관련 (주문 관리, 메뉴 관리, 통계)

## 환경 변수

### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/orderbean
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

## 빌드 및 실행

### 개발 환경

**Backend:**
```bash
cd backend
npm install
npm run dev  # nodemon으로 자동 재시작
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev  # Vite 개발 서버 (localhost:3000)
```

### 프로덕션 빌드

**Frontend:**
```bash
cd frontend
npm run build  # dist/ 폴더에 빌드 결과물 생성
```

**Backend:**
```bash
cd backend
npm start  # 프로덕션 모드 실행
```

## 의존성 관리

### Frontend 주요 의존성
- `react`: UI 라이브러리
- `react-router-dom`: 라우팅
- `axios`: HTTP 클라이언트
- `react-hot-toast`: 알림 메시지
- `tailwindcss`: CSS 프레임워크

### Backend 주요 의존성
- `express`: 웹 프레임워크
- `mongoose`: MongoDB ODM
- `jsonwebtoken`: JWT 토큰 생성/검증
- `bcryptjs`: 비밀번호 해싱
- `cors`: CORS 설정
- `express-validator`: 입력 검증

## 확장 계획

### Phase 2 (향후 추가)
- `frontend/src/services/`: API 호출 서비스 레이어
- `frontend/src/hooks/`: 커스텀 React Hooks
- `backend/utils/`: 유틸리티 함수
- `backend/config/`: 설정 파일
- `backend/tests/`: 테스트 파일

### Phase 3 (향후 추가)
- `frontend/src/assets/`: 이미지, 폰트 등 정적 파일
- `backend/uploads/`: 업로드된 파일 저장
- `backend/logs/`: 로그 파일
- `docker/`: Docker 설정 파일

