# FAQ (자주 묻는 질문)

OrderBean 프로젝트에 대한 자주 묻는 질문과 답변입니다.

## 일반 질문

### Q: OrderBean이란 무엇인가요?

A: OrderBean은 바쁜 도시 생활자들을 위한 미리 주문 & 대기 없이 픽업 커피 주문 웹 서비스입니다. 사용자는 앱에서 미리 주문하고 결제한 후, 매장에 도착해 바로 음료를 받아갈 수 있습니다.

### Q: 어떤 기술 스택을 사용하나요?

A:
- **프론트엔드**: React, Tailwind CSS, Vite
- **백엔드**: Node.js, Express, MongoDB
- **인증**: JWT
- **스타일링**: Tailwind CSS

### Q: 프로젝트를 시작하려면 어떻게 해야 하나요?

A: [설치 가이드](./installation.md)를 참고하세요. 기본적으로:
1. MongoDB 설치 및 실행
2. 백엔드 의존성 설치 및 환경 변수 설정
3. 프론트엔드 의존성 설치
4. 개발 서버 실행

## 설치 및 설정

### Q: MongoDB가 필요하나요?

A: 네, MongoDB가 필요합니다. 로컬 MongoDB를 사용하거나 MongoDB Atlas(클라우드)를 사용할 수 있습니다.

### Q: 환경 변수는 어디에 설정하나요?

A: `backend/.env` 파일에 설정합니다. `.env.example` 파일을 복사하여 생성할 수 있습니다.

```bash
cd backend
cp .env.example .env
```

### Q: 테스트 계정은 어떻게 만들 수 있나요?

A: 시드 스크립트를 실행하면 테스트 계정이 자동 생성됩니다:

```bash
cd backend
node scripts/seed.js
```

생성되는 계정:
- 고객: `customer@test.com` / `password123`
- 매장 관리자: `merchant@test.com` / `password123`

## 개발 관련

### Q: 개발 서버는 어떻게 실행하나요?

A: 두 개의 터미널이 필요합니다:

**터미널 1 - 백엔드:**
```bash
cd backend
npm run dev
```

**터미널 2 - 프론트엔드:**
```bash
cd frontend
npm run dev
```

### Q: 코드 스타일 가이드가 있나요?

A: [개발 가이드](./development.md)에 코드 스타일 및 컨벤션이 설명되어 있습니다.

### Q: 새로운 기능을 추가하려면 어떻게 해야 하나요?

A:
1. 새 브랜치 생성: `git checkout -b feature/new-feature`
2. 개발 및 테스트
3. 커밋 및 푸시
4. Pull Request 생성

## API 관련

### Q: API 문서는 어디에 있나요?

A: [API 문서](./api.md)를 참고하세요.

### Q: 인증은 어떻게 하나요?

A: JWT 토큰을 사용합니다. 로그인 후 받은 토큰을 요청 헤더에 포함하세요:

```
Authorization: Bearer {token}
```

### Q: API 엔드포인트는 무엇인가요?

A: 기본 URL은 `http://localhost:5000/api`입니다. 자세한 엔드포인트는 [API 문서](./api.md)를 참고하세요.

## 데이터베이스 관련

### Q: 데이터베이스 스키마는 어디에 있나요?

A: [데이터베이스 문서](./database.md)에 상세한 스키마가 설명되어 있습니다.

### Q: 데이터를 초기화하려면 어떻게 해야 하나요?

A: MongoDB에서 직접 삭제하거나 시드 스크립트를 재실행할 수 있습니다.

## 배포 관련

### Q: 프로덕션 배포는 어떻게 하나요?

A: [배포 가이드](./deployment.md)를 참고하세요. (향후 작성 예정)

### Q: 어떤 호스팅 서비스를 사용하나요?

A: 권장 서비스:
- 프론트엔드: Vercel
- 백엔드: Render 또는 Heroku
- 데이터베이스: MongoDB Atlas

## 문제 해결

### Q: MongoDB 연결이 안 됩니다.

A: [트러블슈팅 가이드](./troubleshooting.md)의 "MongoDB 연결 실패" 섹션을 참고하세요.

### Q: 포트가 이미 사용 중입니다.

A: [트러블슈팅 가이드](./troubleshooting.md)의 "포트 충돌" 섹션을 참고하세요.

### Q: 에러가 발생했는데 어떻게 해결하나요?

A: [트러블슈팅 가이드](./troubleshooting.md)를 참고하세요. 일반적인 문제와 해결 방법이 정리되어 있습니다.

## 기능 관련

### Q: 결제는 어떻게 처리되나요?

A: 현재는 테스트 모드입니다. 실제 결제 게이트웨이 연동은 Phase 2에서 계획되어 있습니다.

### Q: 푸시 알림은 지원하나요?

A: 현재는 지원하지 않습니다. Phase 2에서 Firebase Cloud Messaging 연동을 계획하고 있습니다.

### Q: 위치 기반 검색은 어떻게 작동하나요?

A: GPS 위치 정보를 사용하여 반경 5km 이내의 카페를 검색합니다. 위치 정보 제공을 거부하면 전체 카페 목록이 표시됩니다.

## 기여 관련

### Q: 프로젝트에 기여하고 싶습니다.

A: [기여 가이드](./contributing.md)를 참고하세요. (향후 작성 예정)

### Q: 버그를 발견했습니다.

A: GitHub Issues에 버그를 보고해주세요. 가능한 한 상세한 정보를 포함해주세요.

## 라이선스

### Q: 이 프로젝트의 라이선스는 무엇인가요?

A: Toy Project로 개인/소규모 팀 개발용입니다.

---

## 추가 질문

더 궁금한 점이 있으면 GitHub Issues에 질문을 등록해주세요.

