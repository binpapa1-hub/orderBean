# Backend Tests

백엔드 API 테스트 케이스입니다.

## 테스트 실행

### 모든 테스트 실행
```bash
cd backend
npm test
```

### Watch 모드로 실행
```bash
npm run test:watch
```

### 커버리지 확인
```bash
npm test
# 커버리지 리포트가 자동으로 생성됩니다
```

## 테스트 구조

```
backend/tests/
├── setup.js          # 테스트 환경 설정
├── auth.test.js      # 인증 API 테스트
├── cafes.test.js     # 카페 API 테스트
├── menus.test.js     # 메뉴 API 테스트
├── orders.test.js    # 주문 API 테스트
└── admin.test.js     # 관리자 API 테스트
```

## 테스트 환경 설정

테스트는 별도의 테스트 데이터베이스를 사용합니다. `.env` 파일에 다음을 추가하세요:

```env
TEST_MONGODB_URI=mongodb://localhost:27017/orderbean_test
```

또는 환경 변수로 설정:
```bash
export TEST_MONGODB_URI=mongodb://localhost:27017/orderbean_test
```

## 테스트 커버리지

각 테스트 파일은 다음을 테스트합니다:

### auth.test.js
- ✅ 사용자 회원가입 (성공, 실패 케이스)
- ✅ 사용자 로그인 (성공, 실패 케이스)
- ✅ 현재 사용자 정보 조회
- ✅ 인증 토큰 검증

### cafes.test.js
- ✅ 카페 목록 조회
- ✅ 위치 기반 카페 필터링
- ✅ 카페 상세 정보 조회
- ✅ 영업 중인 카페만 조회

### menus.test.js
- ✅ 메뉴 목록 조회
- ✅ 카페별 메뉴 필터링
- ✅ 카테고리별 메뉴 필터링
- ✅ 메뉴 상세 정보 조회

### orders.test.js
- ✅ 주문 생성
- ✅ 주문 목록 조회
- ✅ 주문 상세 정보 조회
- ✅ 주문 취소
- ✅ 권한 검증

### admin.test.js
- ✅ 관리자 주문 목록 조회
- ✅ 주문 상태 업데이트
- ✅ 메뉴 관리 (생성, 수정, 조회)
- ✅ 판매 통계 조회
- ✅ 권한 검증 (merchant/admin)

## 주의사항

1. 테스트 실행 전 MongoDB가 실행 중이어야 합니다.
2. 테스트는 자동으로 테스트 데이터베이스를 정리합니다.
3. 각 테스트는 독립적으로 실행됩니다.

