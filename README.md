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

-TC
-Implementation
-Refactoring

