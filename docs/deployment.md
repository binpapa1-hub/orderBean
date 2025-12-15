# 배포 가이드

OrderBean 프로젝트를 프로덕션 환경에 배포하는 방법을 안내합니다.

## 배포 전 체크리스트

- [ ] 모든 기능 테스트 완료
- [ ] 환경 변수 설정 확인
- [ ] 데이터베이스 백업
- [ ] 보안 검토 완료
- [ ] 성능 테스트 완료
- [ ] 문서 업데이트 완료

## 배포 옵션

### 옵션 1: Vercel (프론트엔드) + Render (백엔드)

**장점:**
- 무료 티어 제공
- 간편한 배포
- 자동 HTTPS

### 옵션 2: Vercel (프론트엔드) + Heroku (백엔드)

**장점:**
- 널리 사용되는 플랫폼
- 다양한 애드온

### 옵션 3: 전체 VPS 배포

**장점:**
- 완전한 제어
- 비용 효율적 (장기)

## 프론트엔드 배포 (Vercel)

### 1. Vercel 계정 생성

1. [Vercel](https://vercel.com)에 가입
2. GitHub 저장소 연결

### 2. 프로젝트 설정

1. Vercel 대시보드에서 "New Project" 클릭
2. GitHub 저장소 선택
3. 설정:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3. 환경 변수 설정

Vercel 대시보드에서 환경 변수 설정:
- `VITE_API_URL`: 백엔드 API URL (예: `https://your-backend.herokuapp.com`)

### 4. 배포

자동으로 배포가 시작됩니다. 배포 완료 후 URL이 제공됩니다.

## 백엔드 배포 (Render)

### 1. Render 계정 생성

1. [Render](https://render.com)에 가입
2. GitHub 저장소 연결

### 2. Web Service 생성

1. "New" → "Web Service" 선택
2. GitHub 저장소 선택
3. 설정:
   - **Name**: `orderbean-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 3. 환경 변수 설정

Render 대시보드에서 환경 변수 추가:
```
PORT=10000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
NODE_ENV=production
```

### 4. 배포

자동으로 배포가 시작됩니다.

## 백엔드 배포 (Heroku)

### 1. Heroku CLI 설치

```bash
# 설치 확인
heroku --version
```

### 2. Heroku 로그인

```bash
heroku login
```

### 3. 앱 생성

```bash
cd backend
heroku create orderbean-backend
```

### 4. 환경 변수 설정

```bash
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production
```

### 5. 배포

```bash
git push heroku main
```

## MongoDB Atlas 설정

### 1. 클러스터 생성

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)에 로그인
2. "Create Cluster" 클릭
3. 무료 티어 선택 (M0)

### 2. 데이터베이스 사용자 생성

1. "Database Access" → "Add New Database User"
2. 사용자명과 비밀번호 설정
3. 권한: "Atlas admin" 또는 "Read and write to any database"

### 3. 네트워크 액세스 설정

1. "Network Access" → "Add IP Address"
2. "Allow Access from Anywhere" 선택 (또는 특정 IP)

### 4. 연결 문자열 복사

1. "Clusters" → "Connect"
2. "Connect your application" 선택
3. 연결 문자열 복사
4. `MONGODB_URI` 환경 변수에 설정

## 프로덕션 환경 변수

### 프론트엔드

```env
VITE_API_URL=https://your-backend.herokuapp.com
```

### 백엔드

```env
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/orderbean
JWT_SECRET=your-super-secret-jwt-key-production
NODE_ENV=production
```

## 보안 체크리스트

- [ ] `JWT_SECRET` 강력한 비밀번호 사용
- [ ] HTTPS 사용 (자동)
- [ ] CORS 설정 확인
- [ ] 환경 변수 노출 방지
- [ ] 데이터베이스 접근 제한

## 모니터링

### 로그 확인

**Render:**
- 대시보드에서 로그 확인

**Heroku:**
```bash
heroku logs --tail
```

### 성능 모니터링

- 응답 시간 모니터링
- 에러율 확인
- 데이터베이스 쿼리 성능

## 롤백

### Vercel

1. 대시보드에서 이전 배포 선택
2. "Promote to Production" 클릭

### Render/Heroku

```bash
# Heroku
heroku rollback

# Render
대시보드에서 이전 배포로 롤백
```

## 도메인 설정

### 커스텀 도메인 추가

**Vercel:**
1. 프로젝트 설정 → Domains
2. 도메인 추가
3. DNS 설정 안내 따르기

**Render/Heroku:**
1. 대시보드에서 Custom Domain 설정
2. DNS 레코드 추가

## SSL 인증서

Vercel, Render, Heroku 모두 자동으로 SSL 인증서를 제공합니다.

## 백업 전략

### 데이터베이스 백업

**MongoDB Atlas:**
- 자동 백업 활성화
- 수동 백업 다운로드

### 코드 백업

- GitHub에 모든 코드 저장
- 태그로 버전 관리

## 성능 최적화

### 프론트엔드

- 코드 스플리팅
- 이미지 최적화
- CDN 사용 (Vercel 자동)

### 백엔드

- 데이터베이스 인덱싱
- 쿼리 최적화
- 캐싱 (향후 Redis 도입)

## 문제 해결

### 배포 실패

1. 로그 확인
2. 환경 변수 확인
3. 빌드 로그 확인

### 데이터베이스 연결 실패

1. MongoDB Atlas IP 화이트리스트 확인
2. 연결 문자열 확인
3. 사용자 권한 확인

---

## 다음 단계

배포 완료 후:

1. 기능 테스트
2. 성능 모니터링
3. 사용자 피드백 수집
4. 지속적인 개선

