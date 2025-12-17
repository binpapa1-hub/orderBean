# OrderBean RED 단계 작업 리포트

**생성일**: 2025년 12월 17일  
**프로젝트**: OrderBean - 커피 주문 웹 서비스  
**작업 단계**: RED (테스트 케이스 작성)

---

## 📁 리포트 파일 목록

| 파일명 | 설명 |
|--------|------|
| [test-coverage-report.md](./test-coverage-report.md) | 테스트 커버리지 리포트 |
| [test-cases.md](./test-cases.md) | 테스트 케이스 상세 목록 (90개) |
| [user-stories-gherkin.md](./user-stories-gherkin.md) | Gherkin 스타일 사용자 스토리 (27개) |
| [non-functional-requirements.md](./non-functional-requirements.md) | 비기능적 요구사항 |

---

## 📊 작업 요약

### 테스트 케이스 현황

| 영역 | 테스트 수 | 비고 |
|------|----------|------|
| 백엔드 - 인증 (Auth) | 15개 | 회원가입, 로그인, 토큰 검증 |
| 백엔드 - 카페 (Cafes) | 7개 | 목록, 상세, 위치 필터링 |
| 백엔드 - 메뉴 (Menus) | 8개 | 목록, 상세, 필터링 |
| 백엔드 - 주문 (Orders) | 17개 | 생성, 조회, 취소, 권한 검증 |
| 백엔드 - 관리자 (Admin) | 20개 | 주문 관리, 메뉴 관리, 통계 |
| **백엔드 합계** | **67개** | Jest + Supertest |
| 프론트엔드 - Navbar | 4개 | 네비게이션 UI |
| 프론트엔드 - PrivateRoute | 3개 | 라우트 보호 |
| 프론트엔드 - AuthContext | 8개 | 인증 상태 관리 |
| 프론트엔드 - Login | 8개 | 로그인 페이지 |
| **프론트엔드 합계** | **23개** | Vitest + Testing Library |
| **총계** | **90개** | |

### Gherkin 사용자 스토리

| 기능 | 시나리오 수 |
|------|------------|
| 회원가입 및 로그인 | 5개 |
| 카페 탐색 및 검색 | 4개 |
| 메뉴 조회 및 주문 | 4개 |
| 주문 및 결제 | 6개 |
| 관리자 기능 | 8개 |
| **총계** | **27개** |

### 비기능적 요구사항

| 카테고리 | 주요 항목 |
|----------|----------|
| 성능 | API 응답 <500ms, 동시 사용자 50명 |
| 보안 | JWT 인증, bcrypt 해싱, RBAC |
| 확장성 | 모듈화 구조, 수평 확장 가능 |
| 사용성 | 반응형 UI, 토스트 알림 |

---

## 🛠 생성된 테스트 파일

### 백엔드 (backend/tests/)
```
backend/tests/
├── setup.js          # 테스트 환경 설정
├── auth.test.js      # 인증 API 테스트
├── cafes.test.js     # 카페 API 테스트
├── menus.test.js     # 메뉴 API 테스트
├── orders.test.js    # 주문 API 테스트
├── admin.test.js     # 관리자 API 테스트
└── README.md         # 백엔드 테스트 가이드
```

### 프론트엔드 (frontend/src/tests/)
```
frontend/src/tests/
├── setup.js                        # 테스트 환경 설정
├── components/
│   ├── Navbar.test.jsx             # Navbar 테스트
│   └── PrivateRoute.test.jsx       # PrivateRoute 테스트
├── contexts/
│   └── AuthContext.test.jsx        # AuthContext 테스트
├── pages/
│   └── Login.test.jsx              # Login 페이지 테스트
└── README.md                       # 프론트엔드 테스트 가이드
```

---

## 🚀 테스트 실행 방법

### 백엔드 테스트
```bash
cd backend
npm install
npm test          # MongoDB 실행 필요
```

### 프론트엔드 테스트
```bash
cd frontend
npm install
npm test
```

---

## 📝 설정 파일

### 백엔드
- `backend/package.json` - Jest, Supertest 의존성 추가
- `backend/jest.config.js` - Jest 설정

### 프론트엔드
- `frontend/package.json` - Vitest, Testing Library 의존성 추가
- `frontend/vite.config.js` - Vitest 설정 추가

### 공통
- `TESTING.md` - 전체 테스트 가이드

---

## ✅ RED 단계 완료 항목

- [x] 백엔드 테스트 케이스 작성 (67개)
- [x] 프론트엔드 테스트 케이스 작성 (23개)
- [x] Gherkin 스타일 사용자 스토리 작성 (27개)
- [x] 비기능적 요구사항 문서화
- [x] 테스트 커버리지 리포트 생성
- [x] GitHub 업로드

---

## 📌 다음 단계 (GREEN)

1. 테스트가 통과하도록 코드 구현/수정
2. MongoDB 연결 후 백엔드 테스트 실행
3. 프론트엔드 Login 테스트 수정 (label-input 연결)
4. 모든 테스트 통과 확인

---

## 📚 참고 문서

- [프로젝트 README](../README.md)
- [개발 가이드](../docs/development.md)
- [API 문서](../docs/api.md)
- [테스트 가이드](../TESTING.md)

