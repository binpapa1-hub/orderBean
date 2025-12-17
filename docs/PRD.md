# OrderBean PRD (Product Requirements Document)

**버전**: 2.0  
**작성일**: 2025-12-17  
**상태**: RED 단계 완료

---

## 목차

1. [개요](#1-개요)
2. [기능 요구사항](#2-기능-요구사항)
3. [데이터 모델](#3-데이터-모델)
4. [API 명세](#4-api-명세)
5. [사용자 스토리 (Gherkin)](#5-사용자-스토리-gherkin)
6. [비기능적 요구사항](#6-비기능적-요구사항)
7. [테스트 케이스](#7-테스트-케이스)
8. [기술 스택](#8-기술-스택)

---

## 1. 개요

### 1.1 제품 소개
**OrderBean**은 바쁜 도시 생활자들을 위한 커피 주문 웹 서비스입니다.

**슬로건**: "바쁜 아침, 줄 서지 말고 바로 픽업하세요!"

### 1.2 핵심 가치
- **시간 절약**: 미리 주문하여 대기 시간 제로
- **편의성**: 위치 기반 카페 검색 및 원클릭 재주문
- **투명성**: 실시간 혼잡도 및 예상 픽업 시간 제공

### 1.3 타깃 사용자
| 유형 | 설명 | 비율 |
|------|------|------|
| **Primary** | 20~40대 직장인 | 60% |
| **Secondary** | 대학생, 프리랜서 | 30% |
| **Tertiary** | 매장 관리자 | 10% |

### 1.4 프로젝트 범위 (MVP)
**포함:**
- 사용자 인증 (회원가입/로그인)
- 카페 목록 및 검색
- 메뉴 조회 및 주문
- 주문 관리
- 관리자 대시보드

**제외 (Phase 2+):**
- 실제 결제 연동
- 푸시 알림
- 모바일 네이티브 앱

---

## 2. 기능 요구사항

### 2.1 고객 기능

#### 2.1.1 사용자 인증
| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 회원가입 | 이름, 이메일, 비밀번호로 가입 | Must Have |
| 로그인 | 이메일/비밀번호 인증, JWT 토큰 발급 | Must Have |
| 로그아웃 | 세션 종료 | Must Have |
| 프로필 조회 | 현재 사용자 정보 조회 | Must Have |

#### 2.1.2 카페 검색
| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 카페 목록 | 영업 중인 카페 목록 표시 | Must Have |
| 카페 상세 | 이름, 주소, 전화번호, 혼잡도 | Must Have |
| 위치 기반 검색 | GPS 기반 근처 카페 검색 | Should Have |

#### 2.1.3 메뉴 및 주문
| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 메뉴 목록 | 카페별 메뉴 조회 | Must Have |
| 카테고리 필터 | coffee/tea/beverage/dessert/food | Must Have |
| 장바구니 | 메뉴 추가, 수량 조절 | Must Have |
| 주문 생성 | 장바구니 내용으로 주문 | Must Have |
| 주문 내역 | 과거/현재 주문 목록 | Must Have |
| 주문 취소 | 픽업 전 취소 가능 | Must Have |

### 2.2 관리자 기능

| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 주문 대시보드 | 실시간 주문 목록 | Must Have |
| 상태 관리 | pending→confirmed→preparing→ready→completed | Must Have |
| 메뉴 관리 | 생성, 수정, 품절 처리 | Must Have |
| 판매 통계 | 총 주문, 매출, 인기 메뉴 | Should Have |

---

## 3. 데이터 모델

### 3.1 ERD (Entity Relationship Diagram)

```
┌─────────────┐         ┌─────────────┐
│    Users    │         │    Cafes    │
├─────────────┤         ├─────────────┤
│ _id         │◄──┐     │ _id         │
│ name        │   │     │ name        │
│ email       │   │     │ address     │
│ password    │   │     │ location    │
│ phone       │   │     │ merchantId  │──┐
│ role        │   │     │ isOpen      │  │
└─────────────┘   │     └─────────────┘  │
                  │            │         │
                  │     ┌──────▼──────┐  │
                  │     │    Menus    │  │
                  │     ├─────────────┤  │
                  │     │ _id         │  │
                  │     │ name        │  │
                  │     │ category    │  │
                  │     │ price       │  │
                  │     │ cafeId      │──┘
                  │     │ isAvailable │
                  │     └─────────────┘
                  │            │
         ┌────────▼────────────▼──┐
         │        Orders          │
         ├────────────────────────┤
         │ _id                    │
         │ customerId             │
         │ cafeId                 │
         │ items[]                │
         │ totalAmount            │
         │ status                 │
         │ paymentStatus          │
         └────────────────────────┘
```

### 3.2 엔터티 상세

#### User (사용자)
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| _id | ObjectId | Y | 고유 식별자 |
| name | String | Y | 이름 |
| email | String | Y | 이메일 (고유) |
| password | String | Y | 비밀번호 (해시) |
| phone | String | N | 전화번호 |
| role | Enum | Y | customer/merchant/admin |
| createdAt | Date | Y | 생성일 |

#### Cafe (카페)
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| _id | ObjectId | Y | 고유 식별자 |
| name | String | Y | 카페 이름 |
| address | String | Y | 주소 |
| location | Object | Y | { latitude, longitude } |
| phone | String | N | 전화번호 |
| merchantId | ObjectId | Y | 소유 관리자 |
| isOpen | Boolean | Y | 영업 여부 |
| congestionLevel | Enum | Y | low/medium/high |

#### Menu (메뉴)
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| _id | ObjectId | Y | 고유 식별자 |
| name | String | Y | 메뉴 이름 |
| description | String | N | 설명 |
| category | Enum | Y | coffee/tea/beverage/dessert/food |
| price | Number | Y | 가격 |
| cafeId | ObjectId | Y | 소속 카페 |
| isAvailable | Boolean | Y | 판매 가능 여부 |
| options | Object | N | 사이즈, 샷, 시럽 등 |

#### Order (주문)
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| _id | ObjectId | Y | 고유 식별자 |
| customerId | ObjectId | Y | 주문 고객 |
| cafeId | ObjectId | Y | 주문 카페 |
| items | Array | Y | [{ menuId, quantity, price }] |
| totalAmount | Number | Y | 총 금액 |
| status | Enum | Y | pending/confirmed/preparing/ready/completed/cancelled |
| paymentStatus | Enum | Y | pending/paid/refunded |
| estimatedPickupTime | Date | N | 예상 픽업 시간 |
| createdAt | Date | Y | 주문 시간 |

### 3.3 엔터티 관계
| 관계 | 설명 |
|------|------|
| User 1:N Cafe | 한 관리자가 여러 카페 소유 |
| Cafe 1:N Menu | 한 카페에 여러 메뉴 |
| User 1:N Order | 한 고객이 여러 주문 |
| Cafe 1:N Order | 한 카페에 여러 주문 |
| Menu N:1 Order | 한 주문에 여러 메뉴 |

---

## 4. API 명세

### 4.1 인증 API

| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| POST | /api/auth/register | 회원가입 | - |
| POST | /api/auth/login | 로그인 | - |
| GET | /api/auth/me | 현재 사용자 | Bearer |

#### POST /api/auth/register
```json
// Request
{
  "name": "홍길동",
  "email": "user@example.com",
  "password": "password123",
  "role": "customer"
}

// Response 201
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "name": "홍길동",
    "email": "user@example.com",
    "role": "customer"
  }
}
```

#### POST /api/auth/login
```json
// Request
{
  "email": "user@example.com",
  "password": "password123"
}

// Response 200
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

### 4.2 카페 API

| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| GET | /api/cafes | 카페 목록 | - |
| GET | /api/cafes/:id | 카페 상세 | - |

### 4.3 메뉴 API

| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| GET | /api/menus | 메뉴 목록 | - |
| GET | /api/menus/:id | 메뉴 상세 | - |

**Query Parameters:**
- `cafeId`: 카페별 필터
- `category`: 카테고리별 필터

### 4.4 주문 API

| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| POST | /api/orders | 주문 생성 | Bearer |
| GET | /api/orders | 주문 목록 | Bearer |
| GET | /api/orders/:id | 주문 상세 | Bearer |
| PATCH | /api/orders/:id/cancel | 주문 취소 | Bearer |

### 4.5 관리자 API

| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| GET | /api/admin/orders | 주문 목록 | Bearer (merchant/admin) |
| PATCH | /api/admin/orders/:id/status | 상태 변경 | Bearer (merchant/admin) |
| GET | /api/admin/menus | 메뉴 목록 | Bearer (merchant/admin) |
| POST | /api/admin/menus | 메뉴 생성 | Bearer (merchant/admin) |
| PATCH | /api/admin/menus/:id | 메뉴 수정 | Bearer (merchant/admin) |
| GET | /api/admin/stats | 통계 조회 | Bearer (merchant/admin) |

---

## 5. 사용자 스토리 (Gherkin)

### 5.1 회원가입 및 로그인

#### Scenario: 신규 사용자 회원가입 성공
```gherkin
Given 사용자가 회원가입 페이지에 있다
When 사용자가 다음 정보를 입력한다:
  | 필드     | 값                    |
  | 이름     | 홍길동                |
  | 이메일   | hong@example.com      |
  | 비밀번호 | password123           |
And "회원가입" 버튼을 클릭한다
Then 회원가입이 성공한다
And 사용자는 자동으로 로그인된다
And 카페 목록 페이지로 이동한다
```

#### Scenario: 유효한 자격 증명으로 로그인
```gherkin
Given 이메일 "customer@test.com", 비밀번호 "password123"으로 가입된 사용자가 있다
When 사용자가 해당 이메일과 비밀번호를 입력한다
And "로그인" 버튼을 클릭한다
Then 로그인이 성공한다
And 네비게이션 바에 사용자 이름이 표시된다
```

### 5.2 카페 탐색

#### Scenario: 영업 중인 카페 목록 조회
```gherkin
Given 다음 카페들이 등록되어 있다:
  | 이름        | 영업 상태 |
  | 스타벅스    | 영업 중   |
  | 이디야커피  | 영업 종료 |
When 사용자가 카페 목록 페이지에 접속한다
Then "스타벅스"가 표시된다
And "이디야커피"는 표시되지 않는다
```

### 5.3 주문 생성

#### Scenario: 주문 생성 성공
```gherkin
Given 사용자가 로그인되어 있다
And 장바구니에 "아메리카노 x 2"가 있다
When 사용자가 "주문하기" 버튼을 클릭한다
Then 주문이 생성된다
And 주문 상태가 "pending"이다
And 예상 픽업 시간이 표시된다
```

#### Scenario: 주문 취소
```gherkin
Given 사용자가 로그인되어 있다
And 주문 상태가 "pending"인 주문이 있다
When 사용자가 "주문 취소" 버튼을 클릭한다
Then 주문 상태가 "cancelled"로 변경된다
And 결제 상태가 "refunded"로 변경된다
```

### 5.4 관리자 기능

#### Scenario: 주문 상태 업데이트
```gherkin
Given 사용자가 "merchant" 역할로 로그인되어 있다
And 주문 상태가 "pending"인 주문이 있다
When 관리자가 상태를 "confirmed"로 변경한다
Then 주문 상태가 "confirmed"로 업데이트된다
```

#### Scenario: 일반 사용자 관리자 페이지 접근 거부
```gherkin
Given 사용자가 "customer" 역할로 로그인되어 있다
When 사용자가 관리자 대시보드에 접근한다
Then "Insufficient permissions" 에러가 표시된다
And 접근이 거부된다 (403)
```

---

## 6. 비기능적 요구사항

### 6.1 성능

| 항목 | 목표값 |
|------|--------|
| API 응답 시간 (평균) | < 500ms |
| 페이지 로드 시간 | < 2초 |
| 동시 사용자 | 50명 |
| 초당 요청 수 | 100 req/s |

### 6.2 보안

| 항목 | 구현 |
|------|------|
| 인증 방식 | JWT (7일 만료) |
| 비밀번호 해싱 | bcrypt (salt: 10) |
| 역할 기반 접근 제어 | customer/merchant/admin |
| 입력 검증 | express-validator |

### 6.3 확장성

| 항목 | 현재 | 확장 방안 |
|------|------|----------|
| 서버 | 단일 | Docker + Load Balancer |
| DB | 단일 MongoDB | Replica Set |
| 세션 | JWT (Stateless) | 수평 확장 가능 |

### 6.4 사용성

| 항목 | 구현 |
|------|------|
| 반응형 디자인 | Tailwind CSS |
| 피드백 | react-hot-toast |
| 브라우저 지원 | Chrome, Firefox, Safari, Edge |

---

## 7. 테스트 케이스

### 7.1 테스트 요약

| 영역 | 테스트 수 |
|------|----------|
| 백엔드 - 인증 | 15개 |
| 백엔드 - 카페 | 7개 |
| 백엔드 - 메뉴 | 8개 |
| 백엔드 - 주문 | 17개 |
| 백엔드 - 관리자 | 20개 |
| **백엔드 합계** | **67개** |
| 프론트엔드 - Navbar | 4개 |
| 프론트엔드 - PrivateRoute | 3개 |
| 프론트엔드 - AuthContext | 8개 |
| 프론트엔드 - Login | 8개 |
| **프론트엔드 합계** | **23개** |
| **총계** | **90개** |

### 7.2 주요 테스트 케이스

#### 인증 테스트
| # | 테스트 | 예상 결과 |
|---|--------|----------|
| 1 | 유효한 정보로 회원가입 | 201, 토큰 발급 |
| 2 | 중복 이메일 회원가입 | 400, "User already exists" |
| 3 | 유효한 자격으로 로그인 | 200, 토큰 발급 |
| 4 | 잘못된 비밀번호 로그인 | 400, "Invalid credentials" |
| 5 | 토큰 없이 보호된 API 접근 | 401, "No token" |

#### 주문 테스트
| # | 테스트 | 예상 결과 |
|---|--------|----------|
| 1 | 유효한 주문 생성 | 201, 주문 정보 |
| 2 | 품절 메뉴 주문 | 400, "not available" |
| 3 | 본인 주문 취소 | 200, status: "cancelled" |
| 4 | 다른 사용자 주문 접근 | 403, "Access denied" |
| 5 | 완료된 주문 취소 시도 | 400, "Cannot cancel" |

#### 관리자 테스트
| # | 테스트 | 예상 결과 |
|---|--------|----------|
| 1 | merchant 주문 목록 조회 | 200, 주문 배열 |
| 2 | customer 관리자 API 접근 | 403, "Insufficient permissions" |
| 3 | 주문 상태 업데이트 | 200, 변경된 status |
| 4 | 메뉴 생성 | 201, 메뉴 정보 |
| 5 | 타 카페 메뉴 수정 시도 | 403, "Access denied" |

### 7.3 테스트 실행

```bash
# 백엔드 테스트 (MongoDB 필요)
cd backend
npm test

# 프론트엔드 테스트
cd frontend
npm test
```

---

## 8. 기술 스택

### 8.1 프론트엔드

| 기술 | 버전 | 용도 |
|------|------|------|
| React | 18.2.0 | UI 라이브러리 |
| React Router | 6.20.1 | 라우팅 |
| Tailwind CSS | 3.3.6 | 스타일링 |
| Axios | 1.6.2 | HTTP 클라이언트 |
| Vite | 5.0.8 | 빌드 도구 |
| Vitest | 1.1.0 | 테스트 |

### 8.2 백엔드

| 기술 | 버전 | 용도 |
|------|------|------|
| Node.js | 18+ | 런타임 |
| Express | 4.18.2 | 웹 프레임워크 |
| MongoDB | 6+ | 데이터베이스 |
| Mongoose | 8.0.3 | ODM |
| JWT | 9.0.2 | 인증 |
| bcryptjs | 2.4.3 | 비밀번호 해싱 |
| Jest | 29.7.0 | 테스트 |

### 8.3 프로젝트 구조

```
OrderBean/
├── frontend/
│   ├── src/
│   │   ├── components/     # 재사용 컴포넌트
│   │   ├── contexts/       # Context API
│   │   ├── pages/          # 페이지 컴포넌트
│   │   └── tests/          # 프론트엔드 테스트
│   └── package.json
│
├── backend/
│   ├── models/             # MongoDB 모델
│   ├── routes/             # API 라우트
│   ├── middleware/         # 미들웨어
│   ├── tests/              # 백엔드 테스트
│   └── package.json
│
├── docs/                   # 문서
├── report/                 # 리포트
└── README.md
```

---

## 부록

### A. 참고 문서
- [테스트 케이스 상세](../report/test-cases.md)
- [테스트 커버리지 리포트](../report/test-coverage-report.md)
- [Gherkin 사용자 스토리](../report/user-stories-gherkin.md)
- [비기능적 요구사항](../report/non-functional-requirements.md)

### B. 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0 | 2025-12-15 | 초안 작성 |
| 2.0 | 2025-12-17 | RED 단계 완료, 테스트 케이스 추가 |

---

**문서 끝**

