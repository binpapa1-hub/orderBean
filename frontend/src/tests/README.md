# Frontend Tests

프론트엔드 컴포넌트 및 페이지 테스트 케이스입니다.

## 테스트 실행

### 모든 테스트 실행
```bash
cd frontend
npm test
```

### Watch 모드로 실행
```bash
npm test
# 기본적으로 watch 모드입니다
```

### UI 모드로 실행
```bash
npm run test:ui
```

### 커버리지 확인
```bash
npm run test:coverage
```

## 테스트 구조

```
frontend/src/tests/
├── setup.js                    # 테스트 환경 설정
├── components/
│   ├── Navbar.test.jsx         # 네비게이션 바 테스트
│   └── PrivateRoute.test.jsx   # 인증 라우트 테스트
├── pages/
│   └── Login.test.jsx          # 로그인 페이지 테스트
└── contexts/
    └── AuthContext.test.jsx    # 인증 컨텍스트 테스트
```

## 테스트 커버리지

### Navbar.test.jsx
- ✅ 로그인 전 네비게이션 렌더링
- ✅ 로그인 후 사용자 정보 표시
- ✅ 관리자 링크 표시 (merchant/admin)
- ✅ 로그아웃 기능

### Login.test.jsx
- ✅ 로그인 폼 렌더링
- ✅ 입력 필드 업데이트
- ✅ 로그인 API 호출
- ✅ 성공/실패 처리
- ✅ 회원가입 링크

### AuthContext.test.jsx
- ✅ AuthProvider 컨텍스트 제공
- ✅ 로그인 기능
- ✅ 회원가입 기능
- ✅ 로그아웃 기능
- ✅ 토큰 기반 사용자 정보 조회
- ✅ 에러 처리

### PrivateRoute.test.jsx
- ✅ 인증된 사용자 접근 허용
- ✅ 비인증 사용자 리다이렉트
- ✅ 역할 기반 접근 제어

## 테스트 도구

- **Vitest**: 테스트 러너
- **React Testing Library**: 컴포넌트 테스트
- **jsdom**: DOM 환경 시뮬레이션
- **@testing-library/user-event**: 사용자 이벤트 시뮬레이션

## Mock 설정

테스트에서 다음을 Mock 처리합니다:
- `react-router-dom`: 라우팅
- `axios`: API 호출
- `react-hot-toast`: 토스트 알림
- `localStorage`: 로컬 스토리지

## 주의사항

1. 테스트는 실제 API를 호출하지 않습니다.
2. 모든 API 호출은 Mock으로 처리됩니다.
3. 각 테스트는 독립적으로 실행됩니다.

