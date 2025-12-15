# 설치 가이드

OrderBean 프로젝트를 로컬 환경에 설치하는 방법을 안내합니다.

## 필수 요구사항

### 소프트웨어

- **Node.js**: v16.0.0 이상
- **npm**: v7.0.0 이상 (또는 yarn)
- **MongoDB**: v5.0 이상
- **Git**: 최신 버전

### 확인 방법

```bash
# Node.js 버전 확인
node --version

# npm 버전 확인
npm --version

# MongoDB 버전 확인
mongod --version

# Git 버전 확인
git --version
```

## 설치 단계

### 1. 저장소 클론

```bash
git clone <repository-url>
cd OrderBean
```

### 2. 백엔드 설정

```bash
# 백엔드 디렉토리로 이동
cd backend

# 의존성 설치
npm install

# 환경 변수 파일 생성
cp .env.example .env

# .env 파일 편집 (필요한 경우)
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/orderbean
# JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
# NODE_ENV=development
```

### 3. 프론트엔드 설정

```bash
# 루트 디렉토리로 이동
cd ..

# 프론트엔드 디렉토리로 이동
cd frontend

# 의존성 설치
npm install
```

### 4. MongoDB 설정

#### 로컬 MongoDB 사용

```bash
# MongoDB 서비스 시작 (Windows)
net start MongoDB

# MongoDB 서비스 시작 (Linux/Mac)
sudo systemctl start mongod

# 또는 직접 실행
mongod
```

#### MongoDB Atlas 사용

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)에 가입
2. 클러스터 생성
3. 데이터베이스 사용자 생성
4. 네트워크 액세스 설정 (IP 화이트리스트)
5. 연결 문자열 복사
6. `backend/.env` 파일의 `MONGODB_URI`에 연결 문자열 설정

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/orderbean
```

### 5. 초기 데이터 시드 (선택사항)

테스트용 데이터를 생성하려면:

```bash
cd backend
node scripts/seed.js
```

이 스크립트는 다음 테스트 계정을 생성합니다:
- **고객**: `customer@test.com` / `password123`
- **매장 관리자**: `merchant@test.com` / `password123`

## 실행

### 개발 모드

**터미널 1 - 백엔드:**
```bash
cd backend
npm run dev
```

백엔드는 `http://localhost:5000`에서 실행됩니다.

**터미널 2 - 프론트엔드:**
```bash
cd frontend
npm run dev
```

프론트엔드는 `http://localhost:3000`에서 실행됩니다.

### 프로덕션 모드

**백엔드:**
```bash
cd backend
npm start
```

**프론트엔드:**
```bash
cd frontend
npm run build
npm run preview
```

## 설치 확인

### 1. 백엔드 확인

브라우저에서 `http://localhost:5000/api/health`를 열어보세요.

예상 응답:
```json
{
  "status": "OK",
  "message": "OrderBean API is running"
}
```

### 2. 프론트엔드 확인

브라우저에서 `http://localhost:3000`을 열어보세요.

홈페이지가 표시되면 성공입니다.

### 3. 데이터베이스 연결 확인

백엔드 콘솔에서 다음 메시지를 확인하세요:
```
✅ MongoDB connected
```

## 문제 해결

### MongoDB 연결 실패

**문제**: `MongoDB connection error`

**해결 방법**:
1. MongoDB 서비스가 실행 중인지 확인
2. `MONGODB_URI` 환경 변수가 올바른지 확인
3. 방화벽 설정 확인 (MongoDB Atlas 사용 시)

### 포트 충돌

**문제**: `Port 5000 is already in use`

**해결 방법**:
1. 다른 프로세스가 포트를 사용 중인지 확인
2. `.env` 파일에서 `PORT` 값을 변경
3. 또는 실행 중인 프로세스 종료

### 의존성 설치 실패

**문제**: `npm install` 실패

**해결 방법**:
1. Node.js 버전 확인 (v16 이상 필요)
2. `npm cache clean --force` 실행
3. `node_modules` 폴더 삭제 후 재설치

## 다음 단계

설치가 완료되면 다음 문서를 참고하세요:

- [빠른 시작](./quick-start.md) - 첫 번째 주문 만들기
- [개발 가이드](./development.md) - 개발 환경 설정
- [API 문서](./api.md) - API 사용 방법

