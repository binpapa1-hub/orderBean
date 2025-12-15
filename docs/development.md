# 개발 가이드

OrderBean 프로젝트 개발 환경 설정 및 개발 가이드입니다.

## 설치 및 실행

### 1. 필수 도구 설치

#### Node.js 설치

1. [Node.js 공식 웹사이트](https://nodejs.org/)에서 LTS 버전 다운로드
2. 설치 후 버전 확인:
   ```bash
   node --version  # v16.0.0 이상 필요
   npm --version   # v7.0.0 이상 필요
   ```

#### MongoDB 설치

**옵션 1: 로컬 MongoDB 설치**
1. [MongoDB 공식 웹사이트](https://www.mongodb.com/try/download/community)에서 다운로드
2. 설치 후 서비스 시작:
   ```bash
   # Windows
   net start MongoDB
   
   # Linux
   sudo systemctl start mongod
   
   # Mac
   brew services start mongodb-community
   ```

**옵션 2: MongoDB Atlas 사용 (클라우드)**
1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)에 가입
2. 무료 클러스터 생성
3. 연결 문자열 복사

### 2. 프로젝트 클론

```bash
# 저장소 클론
git clone <repository-url>
cd OrderBean
```

### 3. 백엔드 설치 및 설정

```bash
# 백엔드 디렉토리로 이동
cd backend

# 의존성 설치
npm install

# 환경 변수 파일 생성
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

**환경 변수 설정** (`backend/.env` 파일 편집):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/orderbean
# 또는 MongoDB Atlas 사용 시:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/orderbean
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 4. 프론트엔드 설치

```bash
# 루트 디렉토리로 이동
cd ..

# 프론트엔드 디렉토리로 이동
cd frontend

# 의존성 설치
npm install
```

### 5. 초기 데이터 시드 (선택사항)

테스트용 데이터를 생성하려면:

```bash
# 백엔드 디렉토리로 이동
cd ../backend

# 시드 스크립트 실행
node scripts/seed.js
```

이 스크립트는 다음 테스트 계정을 생성합니다:
- **고객**: `customer@test.com` / `password123`
- **매장 관리자**: `merchant@test.com` / `password123`

### 6. 실행

프로젝트를 실행하려면 **두 개의 터미널**이 필요합니다.

#### 터미널 1: 백엔드 서버 실행

```bash
# 백엔드 디렉토리로 이동
cd backend

# 개발 서버 실행
npm run dev
```

**성공 메시지:**
```
✅ MongoDB connected
🚀 Server running on port 5000
```

백엔드는 `http://localhost:5000`에서 실행됩니다.

#### 터미널 2: 프론트엔드 서버 실행

```bash
# 프론트엔드 디렉토리로 이동
cd frontend

# 개발 서버 실행
npm run dev
```

**성공 메시지:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

프론트엔드는 `http://localhost:3000`에서 실행됩니다.

### 7. 실행 확인

1. **백엔드 확인**
   - 브라우저에서 `http://localhost:5000/api/health` 접속
   - 다음 응답이 보이면 성공:
     ```json
     {
       "status": "OK",
       "message": "OrderBean API is running"
     }
     ```

2. **프론트엔드 확인**
   - 브라우저에서 `http://localhost:3000` 접속
   - 홈페이지가 표시되면 성공

3. **데이터베이스 연결 확인**
   - 백엔드 터미널에서 `✅ MongoDB connected` 메시지 확인

### 8. 개발 시작

이제 개발을 시작할 수 있습니다!

- 프론트엔드: `http://localhost:3000`
- 백엔드 API: `http://localhost:5000/api`

**참고:**
- 프론트엔드 코드 변경 시 자동으로 새로고침됩니다 (Hot Module Replacement)
- 백엔드 코드 변경 시 nodemon이 자동으로 서버를 재시작합니다

## 개발 환경 설정

### 필수 도구

- **Node.js**: v16.0.0 이상
- **npm** 또는 **yarn**
- **MongoDB**: v5.0 이상
- **Git**
- **VS Code** 또는 **Cursor** (권장)

### VS Code 확장 프로그램 (권장)

- ESLint
- Prettier
- MongoDB for VS Code
- REST Client (API 테스트용)

## 프로젝트 구조

```
OrderBean/
├── frontend/          # React 프론트엔드
├── backend/           # Node.js 백엔드
└── docs/              # 문서
```

자세한 구조는 [프로젝트 구조 문서](../PROJECT_STRUCTURE.md)를 참고하세요.

## 개발 워크플로우

### 1. 브랜치 전략

- `main`: 프로덕션 배포용
- `develop`: 개발 브랜치
- `feature/*`: 기능 개발 브랜치
- `fix/*`: 버그 수정 브랜치

### 2. 개발 시작

```bash
# develop 브랜치에서 시작
git checkout develop

# 새 기능 브랜치 생성
git checkout -b feature/new-feature

# 개발 후 커밋
git add .
git commit -m "feat: 새로운 기능 추가"

# develop에 머지
git checkout develop
git merge feature/new-feature
```

### 3. 커밋 메시지 규칙

[Conventional Commits](https://www.conventionalcommits.org/) 형식을 따릅니다:

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드 프로세스 또는 보조 도구 변경

예시:
```
feat: 주문 취소 기능 추가
fix: 로그인 토큰 만료 문제 수정
docs: API 문서 업데이트
```

## 프론트엔드 개발

### 기술 스택

- **React 18**: UI 라이브러리
- **Vite**: 빌드 도구
- **Tailwind CSS**: 스타일링
- **React Router**: 라우팅
- **Axios**: HTTP 클라이언트

### 개발 서버 실행

```bash
cd frontend
npm run dev
```

개발 서버는 `http://localhost:3000`에서 실행됩니다.

**주요 스크립트:**
- `npm run dev`: 개발 서버 실행 (Hot Module Replacement 지원)
- `npm run build`: 프로덕션 빌드
- `npm run preview`: 빌드 결과 미리보기

### 코드 스타일

**컴포넌트 구조:**
```jsx
import React from 'react';

const ComponentName = () => {
  // Hooks
  const [state, setState] = React.useState();
  
  // Handlers
  const handleClick = () => {
    // ...
  };
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

**파일 명명 규칙:**
- 컴포넌트: PascalCase (예: `Navbar.jsx`)
- 유틸리티: camelCase (예: `formatDate.js`)
- 상수: UPPER_SNAKE_CASE (예: `API_BASE_URL.js`)

### 상태 관리

**Context API 사용:**
```jsx
// contexts/AuthContext.jsx
import { createContext, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### API 호출

**Axios 인스턴스 사용:**
```jsx
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// 요청 인터셉터로 토큰 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 백엔드 개발

### 기술 스택

- **Node.js**: 런타임
- **Express**: 웹 프레임워크
- **MongoDB**: 데이터베이스
- **Mongoose**: ODM
- **JWT**: 인증

### 개발 서버 실행

```bash
cd backend
npm run dev
```

개발 서버는 `http://localhost:5000`에서 실행됩니다.
`nodemon`이 설치되어 있어 파일 변경 시 자동 재시작됩니다.

**주요 스크립트:**
- `npm run dev`: 개발 서버 실행 (nodemon으로 자동 재시작)
- `npm start`: 프로덕션 모드 실행
- `npm run seed`: 초기 데이터 시드 실행

### 코드 스타일

**라우트 구조:**
```javascript
// routes/example.js
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

// GET /api/example
router.get('/', async (req, res) => {
  try {
    // 로직
    res.json({ data: result });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
```

**모델 구조:**
```javascript
// models/Example.js
const mongoose = require('mongoose');

const exampleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  // ...
}, {
  timestamps: true
});

module.exports = mongoose.model('Example', exampleSchema);
```

### 미들웨어 사용

**인증 미들웨어:**
```javascript
const { auth, requireRole } = require('../middleware/auth');

// 인증 필요
router.get('/protected', auth, async (req, res) => {
  // req.user에 사용자 정보가 포함됨
  res.json({ user: req.user });
});

// 특정 역할 필요
router.get('/admin', auth, requireRole('admin'), async (req, res) => {
  // 관리자만 접근 가능
});
```

### 에러 처리

**일관된 에러 응답:**
```javascript
try {
  // 로직
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({ 
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
}
```

## 데이터베이스

### MongoDB 연결

```javascript
// server.js
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));
```

### 스키마 설계

자세한 스키마는 [데이터베이스 문서](./database.md)를 참고하세요.

### 시드 데이터

```bash
cd backend
node scripts/seed.js
```

## 테스트

### 프론트엔드 테스트 (향후)

```bash
cd frontend
npm test
```

### 백엔드 테스트 (향후)

```bash
cd backend
npm test
```

## 디버깅

### 프론트엔드

- **React DevTools**: 브라우저 확장 프로그램 설치
- **Network Tab**: API 요청 모니터링
- **Console**: 에러 및 로그 확인

### 백엔드

- **Console Logging**: `console.log()`, `console.error()`
- **Node Inspector**: `node --inspect server.js`
- **MongoDB Compass**: 데이터베이스 시각화

## 성능 최적화

### 프론트엔드

- **코드 스플리팅**: React.lazy() 사용
- **이미지 최적화**: WebP 형식 사용
- **번들 크기**: 불필요한 의존성 제거

### 백엔드

- **인덱싱**: 자주 조회하는 필드에 인덱스 추가
- **쿼리 최적화**: 필요한 필드만 선택
- **캐싱**: Redis 도입 (향후)

## 보안

### 프론트엔드

- **XSS 방지**: 사용자 입력 검증
- **CSRF 방지**: SameSite 쿠키 설정
- **환경 변수**: 민감한 정보는 환경 변수로 관리

### 백엔드

- **입력 검증**: express-validator 사용
- **SQL Injection 방지**: Mongoose 사용
- **비밀번호 해싱**: bcrypt 사용
- **JWT 보안**: 토큰 만료 시간 설정

## 배포 전 체크리스트

- [ ] 환경 변수 설정 확인
- [ ] 데이터베이스 연결 확인
- [ ] API 엔드포인트 테스트
- [ ] 에러 처리 확인
- [ ] 보안 검토
- [ ] 성능 테스트
- [ ] 문서 업데이트

## 유용한 리소스

- [React 공식 문서](https://react.dev/)
- [Express 공식 문서](https://expressjs.com/)
- [MongoDB 공식 문서](https://www.mongodb.com/docs/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)

## 문제 해결

자주 발생하는 문제는 [트러블슈팅 가이드](./troubleshooting.md)를 참고하세요.

