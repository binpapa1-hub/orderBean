# 테스트 가이드

OrderBean 프로젝트의 테스트 실행 가이드입니다.

## 백엔드 테스트

### 설정

1. MongoDB가 실행 중이어야 합니다.
2. 테스트용 데이터베이스 URI를 설정합니다:

```bash
cd backend
export TEST_MONGODB_URI=mongodb://localhost:27017/orderbean_test
```

또는 `.env` 파일에 추가:
```env
TEST_MONGODB_URI=mongodb://localhost:27017/orderbean_test
```

### 실행

```bash
cd backend
npm install  # 테스트 의존성 설치
npm test     # 모든 테스트 실행
```

### 테스트 커버리지

백엔드 테스트는 다음을 포함합니다:
- ✅ 인증 API (회원가입, 로그인, 사용자 정보)
- ✅ 카페 API (목록, 상세, 위치 필터링)
- ✅ 메뉴 API (목록, 상세, 필터링)
- ✅ 주문 API (생성, 조회, 취소)
- ✅ 관리자 API (주문 관리, 메뉴 관리, 통계)

## 프론트엔드 테스트

### 설정

```bash
cd frontend
npm install  # 테스트 의존성 설치
```

### 실행

```bash
npm test              # Watch 모드로 실행
npm run test:ui       # UI 모드로 실행
npm run test:coverage # 커버리지 리포트 생성
```

### 테스트 커버리지

프론트엔드 테스트는 다음을 포함합니다:
- ✅ Navbar 컴포넌트
- ✅ Login 페이지
- ✅ AuthContext
- ✅ PrivateRoute 컴포넌트

## 테스트 작성 가이드

### 백엔드 테스트 작성

1. `backend/tests/` 디렉토리에 `*.test.js` 파일 생성
2. `supertest`를 사용하여 API 엔드포인트 테스트
3. 각 테스트는 독립적으로 실행되어야 함
4. `beforeEach`에서 테스트 데이터 준비
5. `afterEach`에서 데이터 정리 (setup.js에서 자동 처리)

예시:
```javascript
describe('API Route', () => {
  it('should do something', async () => {
    const res = await request(app)
      .get('/api/endpoint')
      .expect(200);
    
    expect(res.body).toHaveProperty('data');
  });
});
```

### 프론트엔드 테스트 작성

1. `frontend/src/tests/` 디렉토리에 `*.test.jsx` 파일 생성
2. `@testing-library/react`를 사용하여 컴포넌트 테스트
3. `@testing-library/user-event`를 사용하여 사용자 상호작용 시뮬레이션
4. 필요한 경우 Mock 설정

예시:
```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## CI/CD 통합

### GitHub Actions 예시

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: |
          cd backend
          npm install
          npm test
  
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: |
          cd frontend
          npm install
          npm test
```

## 문제 해결

### 백엔드 테스트가 실패하는 경우

1. MongoDB가 실행 중인지 확인
2. `TEST_MONGODB_URI` 환경 변수가 올바르게 설정되었는지 확인
3. 테스트 데이터베이스에 접근 권한이 있는지 확인

### 프론트엔드 테스트가 실패하는 경우

1. 모든 의존성이 설치되었는지 확인: `npm install`
2. Mock 설정이 올바른지 확인
3. 브라우저 환경 시뮬레이션이 제대로 작동하는지 확인

## 추가 리소스

- [Jest 문서](https://jestjs.io/docs/getting-started)
- [Vitest 문서](https://vitest.dev/)
- [React Testing Library 문서](https://testing-library.com/react)
- [Supertest 문서](https://github.com/visionmedia/supertest)

