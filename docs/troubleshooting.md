# 트러블슈팅 가이드

OrderBean 프로젝트에서 자주 발생하는 문제와 해결 방법입니다.

## 일반적인 문제

### MongoDB 연결 실패

**증상:**
```
❌ MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27017
```

**해결 방법:**

1. **MongoDB 서비스 확인**
   ```bash
   # Windows
   net start MongoDB
   
   # Linux/Mac
   sudo systemctl start mongod
   ```

2. **연결 문자열 확인**
   - `backend/.env` 파일의 `MONGODB_URI` 확인
   - 로컬 MongoDB: `mongodb://localhost:27017/orderbean`
   - MongoDB Atlas: 연결 문자열이 올바른지 확인

3. **방화벽 확인** (MongoDB Atlas 사용 시)
   - MongoDB Atlas에서 IP 화이트리스트에 현재 IP 추가

---

### 포트 충돌

**증상:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**해결 방법:**

1. **포트 사용 중인 프로세스 확인**
   ```bash
   # Windows
   netstat -ano | findstr :5000
   
   # Linux/Mac
   lsof -i :5000
   ```

2. **프로세스 종료**
   ```bash
   # Windows (PID 확인 후)
   taskkill /PID <PID> /F
   
   # Linux/Mac
   kill -9 <PID>
   ```

3. **포트 변경**
   - `backend/.env`에서 `PORT` 값을 변경

---

### 의존성 설치 실패

**증상:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**해결 방법:**

1. **캐시 정리**
   ```bash
   npm cache clean --force
   ```

2. **node_modules 삭제 후 재설치**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Node.js 버전 확인**
   - Node.js v16 이상 필요
   - `node --version`으로 확인

---

### JWT 토큰 오류

**증상:**
```
401 Unauthorized
Token is not valid
```

**해결 방법:**

1. **토큰 만료 확인**
   - 토큰은 7일 후 만료
   - 다시 로그인하여 새 토큰 발급

2. **JWT_SECRET 확인**
   - `backend/.env`의 `JWT_SECRET`이 설정되어 있는지 확인

3. **토큰 형식 확인**
   - 헤더 형식: `Authorization: Bearer {token}`
   - 공백 확인

---

### CORS 오류

**증상:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**해결 방법:**

1. **백엔드 CORS 설정 확인**
   ```javascript
   // server.js
   app.use(cors());
   ```

2. **프론트엔드 프록시 설정 확인**
   ```javascript
   // vite.config.js
   server: {
     proxy: {
       '/api': {
         target: 'http://localhost:5000',
         changeOrigin: true
       }
     }
   }
   ```

---

## 프론트엔드 문제

### 빌드 실패

**증상:**
```
Error: Cannot find module '...'
```

**해결 방법:**

1. **의존성 재설치**
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **캐시 정리**
   ```bash
   npm cache clean --force
   ```

---

### 페이지 새로고침 시 404

**증상:**
- React Router로 이동한 페이지에서 새로고침 시 404

**해결 방법:**

1. **Vite 설정 확인**
   ```javascript
   // vite.config.js
   export default defineConfig({
     // ...
   });
   ```

2. **서버 설정** (프로덕션)
   - 모든 경로를 `index.html`로 리다이렉트

---

### Tailwind CSS 스타일이 적용되지 않음

**증상:**
- Tailwind 클래스가 적용되지 않음

**해결 방법:**

1. **설정 파일 확인**
   - `tailwind.config.js`의 `content` 경로 확인
   - `postcss.config.js` 확인

2. **CSS import 확인**
   ```css
   /* index.css */
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

---

## 백엔드 문제

### 환경 변수 로드 실패

**증상:**
```
undefined 환경 변수
```

**해결 방법:**

1. **.env 파일 확인**
   - `backend/.env` 파일이 존재하는지 확인
   - `.env.example`을 복사하여 생성

2. **dotenv 로드 확인**
   ```javascript
   // server.js 상단
   require('dotenv').config();
   ```

---

### Mongoose 모델 오류

**증상:**
```
Schema hasn't been registered for model "User"
```

**해결 방법:**

1. **모델 import 순서 확인**
   - 모델을 사용하기 전에 import 확인

2. **스키마 정의 확인**
   - 모델 파일에서 스키마가 올바르게 정의되었는지 확인

---

### 비밀번호 해싱 오류

**증상:**
```
비밀번호 비교 실패
```

**해결 방법:**

1. **bcrypt 버전 확인**
   - `bcryptjs` 사용 (순수 JavaScript 구현)

2. **비밀번호 비교 메서드 확인**
   ```javascript
   // User 모델
   userSchema.methods.comparePassword = async function(candidatePassword) {
     return await bcrypt.compare(candidatePassword, this.password);
   };
   ```

---

## 데이터베이스 문제

### 시드 데이터 생성 실패

**증상:**
```
Error: E11000 duplicate key error
```

**해결 방법:**

1. **기존 데이터 삭제**
   ```bash
   # MongoDB에서 직접 삭제
   mongo
   use orderbean
   db.users.deleteMany({})
   db.cafes.deleteMany({})
   db.menus.deleteMany({})
   ```

2. **시드 스크립트 재실행**
   ```bash
   node scripts/seed.js
   ```

---

### 쿼리 성능 저하

**증상:**
- API 응답이 느림

**해결 방법:**

1. **인덱스 확인**
   ```javascript
   // 자주 조회하는 필드에 인덱스 추가
   userSchema.index({ email: 1 });
   orderSchema.index({ customerId: 1, createdAt: -1 });
   ```

2. **populate 최적화**
   - 필요한 필드만 선택
   ```javascript
   .populate('cafeId', 'name address')
   ```

---

## 네트워크 문제

### API 요청 실패

**증상:**
```
Network Error
ERR_CONNECTION_REFUSED
```

**해결 방법:**

1. **백엔드 서버 실행 확인**
   - 백엔드가 `http://localhost:5000`에서 실행 중인지 확인

2. **프록시 설정 확인**
   - Vite 프록시 설정 확인

3. **방화벽 확인**
   - 로컬 방화벽이 포트를 차단하지 않는지 확인

---

## 개발 도구 문제

### Hot Reload 작동 안 함

**증상:**
- 파일 변경 시 자동 새로고침이 안 됨

**해결 방법:**

1. **Vite HMR 확인**
   - Vite 개발 서버가 실행 중인지 확인

2. **nodemon 확인** (백엔드)
   - `package.json`에 nodemon이 설치되어 있는지 확인
   - `npm run dev` 사용

---

## 성능 문제

### 페이지 로딩이 느림

**해결 방법:**

1. **번들 크기 확인**
   ```bash
   npm run build
   # dist 폴더 크기 확인
   ```

2. **불필요한 의존성 제거**
   - 사용하지 않는 라이브러리 제거

3. **이미지 최적화**
   - WebP 형식 사용
   - 이미지 크기 최적화

---

## 로그 확인

### 백엔드 로그

```javascript
// server.js
console.log('Server running on port', PORT);
console.error('Error:', error);
```

### 프론트엔드 로그

- 브라우저 개발자 도구 Console 탭
- Network 탭에서 API 요청 확인

---

## 추가 도움

문제가 해결되지 않으면:

1. **에러 메시지 전체 확인**
   - 콘솔의 전체 에러 메시지 확인

2. **로그 확인**
   - 백엔드/프론트엔드 로그 확인

3. **문서 참고**
   - [설치 가이드](./installation.md)
   - [개발 가이드](./development.md)
   - [API 문서](./api.md)

4. **이슈 등록**
   - GitHub Issues에 문제 보고

---

## 자주 묻는 질문

자세한 FAQ는 [FAQ 문서](./faq.md)를 참고하세요.

