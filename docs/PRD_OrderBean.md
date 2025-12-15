# PRD: OrderBean v1.0

## Document Info

- 작성자: OrderBean 개발팀
- 작성일: 2025-12-15
- 최종 수정일: 2025-12-15
- 버전: 1.0
- 상태: Draft
- 승인자: [PM, Tech Lead, Design Lead]

## Table of Contents

1. Executive Summary
2. 목표 및 성공 지표
3. 사용자 & 페르소나
4. 사용자 스토리
5. 기능 명세
6. UX/UI 설계
7. 기술 사양
8. API 명세
9. 데이터 모델
10. 비기능 요구사항
11. 일정 및 마일스톤
12. 리스크 & 의존성

---

## 1. Executive Summary

### 1.1 제품 개요

**OrderBean**은 바쁜 도시 생활자(20~40대 직장인, 대학생, 프리랜서)를 위한 커피 주문 웹 서비스로, **출근길이나 업무 중 카페에서 길게 줄 서서 기다리는 시간을 없애고**, **미리 주문해 바로 픽업할 수 있는 솔루션**을 제공합니다.

### 1.2 배경 및 필요성

**시장 기회:**
- 국내 커피 시장 규모: 연간 약 8조원 (2024년 기준)
- 테이크아웃 커피 시장 성장률: 연평균 15% 이상
- 모바일 주문 시장 급성장 중

**사용자 문제 (Pain Point):**
- 아침 피크 타임 대기 시간: 평균 10~20분
- 주문 실수로 인한 재주문 필요
- 예상치 못한 지연으로 인한 일정 지연
- 매장 혼잡도 파악 불가

**현재 솔루션의 한계:**
- 대형 프랜차이즈 앱은 해당 브랜드만 지원
- 로컬 카페는 주문 시스템 미비
- 통합 플랫폼 부재
- 실시간 재고 및 혼잡도 정보 부족

### 1.3 핵심 가치

- **시간 절약**: 미리 주문하여 대기 시간 제로
- **편의성**: 위치 기반 카페 검색 및 원클릭 재주문
- **투명성**: 실시간 혼잡도 및 예상 픽업 시간 제공
- **통합성**: 다양한 카페 브랜드를 한 곳에서 주문

### 1.4 범위 (Scope)

**포함 (In Scope):**

**MVP 핵심 기능:**
- 사용자 인증 및 프로필 관리
- 카페 목록 조회 및 위치 기반 검색
- 메뉴 조회 및 옵션 선택
- 주문 생성 및 결제 (테스트 모드)
- 주문 내역 조회 및 취소
- 관리자 주문 대시보드
- 주문 상태 관리 (접수 → 제작 중 → 완료)

**필수 통합:**
- JWT 기반 인증 시스템
- MongoDB 데이터베이스
- RESTful API

**기본 분석:**
- 주문 통계 (총 주문, 매출, 인기 메뉴)

**제외 (Out of Scope):**

- 모바일 네이티브 앱 (Phase 2)
- 실제 결제 게이트웨이 연동 (Phase 2)
- 푸시 알림 시스템 (Phase 2)
- 실시간 주문 상태 업데이트 (WebSocket, Phase 2)
- 이미지 업로드 기능 (Phase 2)
- 리뷰 및 평점 시스템 (Phase 3)
- 로열티 프로그램 (Phase 3)
- AI 기반 메뉴 추천 (Phase 3)
- 배달 연동 (Phase 3)

---

## 2. 목표 및 성공 지표

### 2.1 비즈니스 목표

1. 출시 후 3개월 내 MAU 1,000명 달성 (Toy Project 목표)
2. 출시 후 6개월 내 일일 주문 100건 달성
3. 사용자 만족도 80% 이상 유지

### 2.2 제품 목표

1. 주문 생성 시간 5분 이내 달성
2. 주문 취소율 5% 이하 유지
3. 주문 완료율 95% 이상 유지
4. 평균 픽업 대기 시간 15분 이내

### 2.3 핵심 지표 (Key Metrics)

| 지표 | 목표 | 측정 방법 |
|------|------|-----------|
| MAU | 1,000 | 사용자 로그 분석 |
| DAU/MAU | 0.2 | 사용자 로그 분석 |
| Activation | 70% | 첫 주문 완료율 |
| Retention (D7) | 30% | Cohort 분석 |
| 주문 완료율 | 95% | 주문 데이터 분석 |
| 평균 주문 금액 | 8,000원 | 주문 데이터 분석 |
| 재주문율 | 40% | 주문 이력 분석 |

### 2.4 성공 기준

**Launch Criteria:**

- [x] 모든 Must-have 기능 완료
- [ ] 크리티컬 버그 0건
- [ ] 로드 테스트 통과 (100 동시 사용자)
- [ ] 보안 감사 통과 (기본 OWASP 준수)
- [ ] 베타 테스트 사용자 만족도 70%+

---

## 3. 사용자 & 페르소나

### 3.1 타깃 사용자

**Primary:** 20~40대 도시 거주 직장인
- 규모: 매일/주 4회 이상 테이크아웃 커피 구매
- 업종: IT, 금융, 컨설팅, 마케팅 등
- 연령: 25~40세
- 수: 약 500만명 (국내 도시 거주자 기준)

**Secondary:** 대학생 및 프리랜서
- 규모: 주 2~3회 커피 구매
- 연령: 20~30세
- 수: 약 200만명

**Tertiary:** 매장 관리자 (Merchant)
- 규모: 소규모 카페 운영자
- 연령: 30~50세
- 수: 약 10만개 카페 (국내 기준)

### 3.2 Primary Persona

**이름:** 마케팅 매니저 김민수 (32세)

**배경:**
- 직급: 마케팅 팀장
- 회사: IT 스타트업 (직원 50명)
- 경력: 7년
- 학력: 경영학과 졸업

**일상:**
- 08:00: 출근 준비
- 08:30: 지하철 탑승, 커피 주문 앱 실행
- 09:00: 회사 도착, 카페에서 픽업
- 10:00: 팀 미팅
- 12:00: 점심
- 14:00: 오후 커피 주문
- 18:00: 퇴근

**목표:**
- 아침 출근 시간 절약
- 업무 중 커피 주문 편의성 향상
- 예측 가능한 픽업 시간 확보

**과제 (Jobs to be Done):**
- "아침에 카페 줄 서지 않고 바로 커피 받고 싶어요"
- "업무 중 빠르게 커피 주문하고 싶어요"
- "자주 주문하는 메뉴를 빠르게 재주문하고 싶어요"
- "픽업 시간을 미리 알고 싶어요"

**고충 (Pains):**
- 😫 "아침 피크 타임에 15~20분 대기"
- 😤 "주문 실수로 인한 재주문"
- 😰 "예상치 못한 지연으로 일정 지연"
- 😓 "매장 혼잡도 파악 불가"

**이득 (Gains):**
- ⚡ "대기 시간 제로로 시간 절약"
- 🎯 "정확한 주문으로 실수 방지"
- 📍 "위치 기반으로 근처 카페 쉽게 찾기"
- ⏰ "예상 픽업 시간으로 일정 계획"

**사용 도구:**
- 모바일: 스마트폰 (iOS/Android)
- 결제: 카드, 모바일 결제
- 소통: Slack, 이메일

**구매 의사결정:**
- 권한: 개인 결제
- 프로세스: 무료 사용 → 편의성 체감 → 정기 사용
- 중요 요소:
  1. 사용 편의성
  2. 시간 절약 효과
  3. 가격 (수수료 없음)
  4. 카페 다양성

### 3.3 Secondary Persona

**이름:** 카페 사장 이영희 (45세)

**배경:**
- 직급: 카페 사장
- 회사: 로컬 카페 (직원 3명)
- 경력: 카페 운영 5년

**목표:**
- 주문 처리 효율성 향상
- 고객 대기 시간 감소
- 매출 증대

**과제 (Jobs to be Done):**
- "들어오는 주문을 실시간으로 확인하고 싶어요"
- "주문 상태를 쉽게 업데이트하고 싶어요"
- "매출 통계를 확인하고 싶어요"

**고충 (Pains):**
- 😫 "전화 주문 처리로 인한 업무 방해"
- 😤 "주문 관리 시스템 부재"
- 😰 "피크 타임 주문 집중"

**이득 (Gains):**
- ⚡ "자동화된 주문 관리"
- 📊 "매출 및 인기 메뉴 분석"
- 🎯 "효율적인 주문 처리"

---

## 4. 사용자 스토리

### 4.1 Epic: 사용자 인증 및 프로필

**Epic ID:** E001

**설명:** 사용자가 계정을 생성하고 로그인하여 서비스를 이용

#### User Story 4.1.1: 회원가입

```
As a 새로운 사용자
I want to 이메일과 비밀번호로 회원가입하기를
So that OrderBean 서비스를 이용할 수 있다

Acceptance Criteria:
- [x] 이름, 이메일, 비밀번호 입력 필드가 있다
- [x] 이메일 형식 검증이 있다
- [x] 비밀번호는 최소 6자 이상이어야 한다
- [x] 역할 선택 (고객/매장 관리자)이 있다
- [x] 회원가입 성공 시 자동 로그인된다
- [x] 중복 이메일 체크가 있다

Priority: Must Have
Story Points: 5
Sprint: Sprint 1
```

#### User Story 4.1.2: 로그인

```
As a 기존 사용자
I want to 이메일과 비밀번호로 로그인하기를
So that 내 계정에 접근할 수 있다

Acceptance Criteria:
- [x] 이메일, 비밀번호 입력 필드가 있다
- [x] 로그인 성공 시 JWT 토큰이 발급된다
- [x] 로그인 실패 시 에러 메시지가 표시된다
- [x] 토큰은 7일간 유효하다

Priority: Must Have
Story Points: 3
Sprint: Sprint 1
```

### 4.2 Epic: 카페 검색 및 조회

**Epic ID:** E002

**설명:** 사용자가 근처 카페를 찾고 정보를 확인

#### User Story 4.2.1: 카페 목록 조회

```
As a 고객
I want to 등록된 카페 목록을 조회하기를
So that 주문할 카페를 선택할 수 있다

Acceptance Criteria:
- [x] 카페 목록이 카드 형태로 표시된다
- [x] 카페 이름, 주소, 영업 상태가 표시된다
- [x] 혼잡도 정보가 표시된다 (여유/보통/혼잡)
- [x] 영업 중인 카페만 필터링 가능하다

Priority: Must Have
Story Points: 5
Sprint: Sprint 1
```

#### User Story 4.2.2: 위치 기반 카페 검색

```
As a 고객
I want to 내 위치 기반으로 근처 카페를 검색하기를
So that 가까운 카페를 쉽게 찾을 수 있다

Acceptance Criteria:
- [x] GPS 위치 정보를 요청할 수 있다
- [x] 반경 5km 이내 카페를 표시한다
- [x] 거리 순으로 정렬된다
- [x] 위치 정보 제공 거부 시 전체 목록 표시

Priority: Should Have
Story Points: 8
Sprint: Sprint 2
```

### 4.3 Epic: 메뉴 조회 및 주문

**Epic ID:** E003

**설명:** 사용자가 메뉴를 조회하고 주문을 생성

#### User Story 4.3.1: 메뉴 목록 조회

```
As a 고객
I want to 선택한 카페의 메뉴 목록을 조회하기를
So that 주문할 메뉴를 선택할 수 있다

Acceptance Criteria:
- [x] 카테고리별로 메뉴가 분류되어 표시된다 (커피/차/음료/디저트/음식)
- [x] 메뉴 이름, 설명, 가격, 이미지가 표시된다
- [x] 품절 메뉴는 표시되지 않거나 비활성화된다
- [x] 카테고리 필터링이 가능하다

Priority: Must Have
Story Points: 5
Sprint: Sprint 1
```

#### User Story 4.3.2: 장바구니에 메뉴 추가

```
As a 고객
I want to 메뉴를 장바구니에 추가하기를
So that 여러 메뉴를 한 번에 주문할 수 있다

Acceptance Criteria:
- [x] "담기" 버튼 클릭 시 장바구니에 추가된다
- [x] 장바구니 아이콘에 개수가 표시된다
- [x] 같은 카페의 메뉴만 장바구니에 추가 가능하다
- [x] 수량 조절이 가능하다

Priority: Must Have
Story Points: 5
Sprint: Sprint 1
```

#### User Story 4.3.3: 주문 생성

```
As a 고객
I want to 장바구니의 메뉴를 주문하기를
So that 카페에서 픽업할 수 있다

Acceptance Criteria:
- [x] 장바구니에서 주문하기 버튼이 있다
- [x] 총 금액이 표시된다
- [x] 주문 생성 시 예상 픽업 시간이 계산된다 (기본 15분)
- [x] 주문 상태는 "pending"으로 시작한다
- [x] 결제 상태는 "paid"로 설정된다 (테스트 모드)

Priority: Must Have
Story Points: 8
Sprint: Sprint 1
```

### 4.4 Epic: 주문 관리

**Epic ID:** E004

**설명:** 사용자가 주문 내역을 조회하고 관리

#### User Story 4.4.1: 주문 내역 조회

```
As a 고객
I want to 내 주문 내역을 조회하기를
So that 과거 주문을 확인하고 재주문할 수 있다

Acceptance Criteria:
- [x] 주문 목록이 시간순으로 표시된다
- [x] 각 주문의 카페명, 주문 시간, 상태, 금액이 표시된다
- [x] 주문 상태에 따른 색상 구분이 있다

Priority: Must Have
Story Points: 5
Sprint: Sprint 1
```

#### User Story 4.4.2: 주문 상세 조회

```
As a 고객
I want to 주문 상세 정보를 조회하기를
So that 주문 내용과 상태를 확인할 수 있다

Acceptance Criteria:
- [x] 주문한 메뉴 목록과 수량이 표시된다
- [x] 총 금액이 표시된다
- [x] 주문 시간과 예상 픽업 시간이 표시된다
- [x] 현재 주문 상태가 표시된다
- [x] 카페 정보(이름, 주소, 전화번호)가 표시된다

Priority: Must Have
Story Points: 3
Sprint: Sprint 1
```

#### User Story 4.4.3: 주문 취소

```
As a 고객
I want to 주문을 취소하기를
So that 실수로 주문한 경우 취소할 수 있다

Acceptance Criteria:
- [x] "준비 완료" 상태 이전에만 취소 가능하다
- [x] 취소 확인 다이얼로그가 있다
- [x] 취소 시 주문 상태가 "cancelled"로 변경된다
- [x] 결제 상태가 "refunded"로 변경된다

Priority: Must Have
Story Points: 5
Sprint: Sprint 1
```

### 4.5 Epic: 관리자 주문 관리

**Epic ID:** E005

**설명:** 매장 관리자가 주문을 확인하고 상태를 관리

#### User Story 4.5.1: 주문 대시보드 조회

```
As a 매장 관리자
I want to 들어온 주문 목록을 실시간으로 확인하기를
So that 주문을 처리할 수 있다

Acceptance Criteria:
- [x] 내 카페의 모든 주문이 표시된다
- [x] 주문 시간순으로 정렬된다
- [x] 고객 정보, 주문 내용, 금액이 표시된다
- [x] 주문 상태가 색상으로 구분된다

Priority: Must Have
Story Points: 5
Sprint: Sprint 1
```

#### User Story 4.5.2: 주문 상태 업데이트

```
As a 매장 관리자
I want to 주문 상태를 업데이트하기를
So that 고객에게 주문 진행 상황을 알릴 수 있다

Acceptance Criteria:
- [x] 주문 상태를 드롭다운으로 변경할 수 있다
- [x] 상태: pending → confirmed → preparing → ready → completed
- [x] 상태 변경 시 저장된다
- [x] "ready" 상태로 변경 시 실제 픽업 시간이 기록된다

Priority: Must Have
Story Points: 5
Sprint: Sprint 1
```

#### User Story 4.5.3: 판매 통계 조회

```
As a 매장 관리자
I want to 판매 통계를 조회하기를
So that 매출과 인기 메뉴를 파악할 수 있다

Acceptance Criteria:
- [x] 총 주문 수가 표시된다
- [x] 총 매출이 표시된다
- [x] 인기 메뉴 Top 5가 표시된다
- [x] 대기 중인 주문 수가 표시된다

Priority: Should Have
Story Points: 5
Sprint: Sprint 2
```

---

## 5. 기능 명세

### 5.1 고객 기능 (Customer-Facing)

#### 5.1.1 사용자 인증
- **회원가입**: 이름, 이메일, 비밀번호, 전화번호(선택), 역할 선택
- **로그인**: 이메일/비밀번호 기반 인증
- **로그아웃**: 세션 종료
- **프로필 조회**: 현재 로그인한 사용자 정보 조회

#### 5.1.2 카페 검색 및 조회
- **카페 목록 조회**: 등록된 모든 카페 표시
- **카페 상세 정보**: 이름, 주소, 전화번호, 영업 시간, 혼잡도
- **위치 기반 검색**: GPS 기반 근처 카페 검색 (반경 5km)
- **영업 상태 필터**: 영업 중인 카페만 표시

#### 5.1.3 메뉴 조회
- **메뉴 목록**: 카페별 메뉴 목록 조회
- **카테고리 필터**: 커피/차/음료/디저트/음식별 필터링
- **메뉴 상세**: 이름, 설명, 가격, 이미지, 옵션 정보
- **재고 확인**: 품절 메뉴 표시

#### 5.1.4 주문 생성
- **장바구니 추가**: 메뉴를 장바구니에 추가
- **수량 조절**: 장바구니에서 수량 증가/감소
- **옵션 선택**: 크기, 샷, 시럽, 우유, 얼음 옵션 선택 (향후 확장)
- **주문 생성**: 장바구니 내용으로 주문 생성
- **예상 픽업 시간**: 주문 시점 기준 15분 후 예상 시간 계산

#### 5.1.5 주문 관리
- **주문 내역 조회**: 과거 및 현재 주문 목록
- **주문 상세 조회**: 주문 내용, 상태, 시간 정보
- **주문 취소**: 픽업 전 주문 취소 가능
- **재주문**: 과거 주문을 기반으로 재주문 (향후 확장)

### 5.2 관리자 기능 (Merchant-Facing)

#### 5.2.1 주문 관리
- **주문 대시보드**: 실시간 주문 목록 조회
- **주문 상태 관리**: pending → confirmed → preparing → ready → completed
- **주문 상세 확인**: 고객 정보, 주문 내용, 금액 확인

#### 5.2.2 메뉴 관리
- **메뉴 목록 조회**: 내 카페의 메뉴 목록
- **메뉴 생성**: 새 메뉴 추가 (이름, 설명, 가격, 카테고리, 옵션)
- **메뉴 수정**: 기존 메뉴 정보 수정
- **재고 관리**: 메뉴 품절 설정 (isAvailable)

#### 5.2.3 통계 및 분석
- **판매 통계**: 총 주문 수, 총 매출
- **인기 메뉴**: 주문량 기준 Top 5 메뉴
- **대기 주문**: 현재 대기 중인 주문 수

---

## 6. UX/UI 설계

### 6.1 디자인 원칙

- **모바일 우선 (Mobile First)**: 반응형 디자인으로 모바일 환경 최적화
- **직관적 네비게이션**: 명확한 메뉴 구조와 버튼 배치
- **빠른 로딩**: 최소한의 클릭으로 주문 완료
- **일관된 디자인**: Tailwind CSS 기반 통일된 디자인 시스템

### 6.2 주요 화면

#### 6.2.1 홈 화면
- **히어로 섹션**: "바쁜 아침, 줄 서지 말고 바로 픽업하세요!" 메시지
- **주요 기능 소개**: 빠른 주문, 위치 기반 검색, 다양한 메뉴
- **CTA 버튼**: "카페 찾기", "시작하기"

#### 6.2.2 카페 목록 화면
- **카드 레이아웃**: 카페별 카드 형태 표시
- **정보 표시**: 카페명, 주소, 영업 상태, 혼잡도
- **필터링**: 영업 중인 카페만 표시 옵션

#### 6.2.3 메뉴 화면
- **카테고리 탭**: 상단에 카테고리 필터 탭
- **메뉴 그리드**: 3열 그리드 레이아웃 (모바일: 1열)
- **메뉴 카드**: 이미지, 이름, 설명, 가격, 담기 버튼
- **장바구니 플로팅 버튼**: 하단 고정 버튼 (아이템 수 표시)

#### 6.2.4 장바구니 화면
- **주문 품목 리스트**: 메뉴명, 수량, 가격
- **수량 조절**: +/- 버튼
- **총 금액**: 하단에 총 금액 표시
- **주문하기 버튼**: 하단 고정 버튼

#### 6.2.5 주문 내역 화면
- **주문 카드**: 카페명, 주문 시간, 상태, 금액
- **상태 색상**: 상태별 색상 구분 (대기/확인/제작중/준비완료/완료/취소)
- **정렬**: 최신순 정렬

#### 6.2.6 관리자 대시보드
- **통계 카드**: 총 주문, 총 매출, 대기 주문 수
- **주문 테이블**: 주문 목록을 테이블 형태로 표시
- **상태 드롭다운**: 각 주문의 상태 변경 드롭다운

### 6.3 색상 시스템

- **Primary Color**: #f2810c (주황색 - 커피 컬러)
- **Success**: #10b981 (초록색)
- **Warning**: #f59e0b (노란색)
- **Error**: #ef4444 (빨간색)
- **Background**: #f9fafb (회색 배경)

### 6.4 타이포그래피

- **Heading 1**: 3xl (30px), Bold
- **Heading 2**: 2xl (24px), Semibold
- **Body**: base (16px), Regular
- **Small**: sm (14px), Regular

---

## 7. 기술 사양

### 7.1 프론트엔드

**프레임워크 및 라이브러리:**
- React 18.2.0
- React Router DOM 6.20.1
- Vite 5.0.8 (빌드 도구)
- Tailwind CSS 3.3.6 (스타일링)
- Axios 1.6.2 (HTTP 클라이언트)
- React Hot Toast 2.4.1 (알림)

**아키텍처:**
- 컴포넌트 기반 구조
- Context API를 활용한 전역 상태 관리 (인증)
- RESTful API 통신

**디렉토리 구조:**
```
frontend/
├── src/
│   ├── components/     # 재사용 가능한 컴포넌트
│   ├── pages/          # 페이지 컴포넌트
│   ├── contexts/        # Context API
│   ├── App.jsx         # 메인 앱 컴포넌트
│   ├── main.jsx        # 진입점
│   └── index.css       # 글로벌 스타일
├── index.html
├── package.json
└── vite.config.js
```

### 7.2 백엔드

**프레임워크 및 라이브러리:**
- Node.js
- Express 4.18.2
- MongoDB (Mongoose 8.0.3)
- JWT (jsonwebtoken 9.0.2)
- bcryptjs 2.4.3 (비밀번호 해싱)
- express-validator 7.0.1 (입력 검증)
- CORS 2.8.5

**아키텍처:**
- RESTful API
- MVC 패턴
- 미들웨어 기반 인증

**디렉토리 구조:**
```
backend/
├── models/          # 데이터 모델
├── routes/          # API 라우트
├── middleware/      # 미들웨어 (인증 등)
├── scripts/         # 유틸리티 스크립트
├── server.js        # 서버 진입점
└── package.json
```

### 7.3 데이터베이스

**데이터베이스:**
- MongoDB (NoSQL)
- Mongoose ODM

**연결:**
- 로컬 MongoDB 또는 MongoDB Atlas

### 7.4 배포

**개발 환경:**
- 프론트엔드: Vite Dev Server (localhost:3000)
- 백엔드: Node.js (localhost:5000)

**프로덕션 배포 (향후):**
- 프론트엔드: Vercel
- 백엔드: Render 또는 Heroku
- 데이터베이스: MongoDB Atlas

---

## 8. API 명세

### 8.1 인증 (Authentication)

#### POST /api/auth/register
회원가입

**Request Body:**
```json
{
  "name": "홍길동",
  "email": "user@example.com",
  "password": "password123",
  "phone": "010-1234-5678",
  "role": "customer"
}
```

**Response: 201 Created**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "홍길동",
    "email": "user@example.com",
    "role": "customer"
  }
}
```

#### POST /api/auth/login
로그인

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response: 200 OK**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "홍길동",
    "email": "user@example.com",
    "role": "customer"
  }
}
```

#### GET /api/auth/me
현재 사용자 정보 조회

**Headers:**
```
Authorization: Bearer {token}
```

**Response: 200 OK**
```json
{
  "_id": "user_id",
  "name": "홍길동",
  "email": "user@example.com",
  "role": "customer",
  "phone": "010-1234-5678"
}
```

### 8.2 카페 (Cafes)

#### GET /api/cafes
카페 목록 조회

**Query Parameters:**
- `latitude` (optional): 위도
- `longitude` (optional): 경도
- `radius` (optional): 반경 (km, default: 5)

**Response: 200 OK**
```json
[
  {
    "_id": "cafe_id",
    "name": "스타벅스 강남점",
    "address": "서울시 강남구 테헤란로 123",
    "location": {
      "latitude": 37.4979,
      "longitude": 127.0276
    },
    "phone": "02-1234-5678",
    "isOpen": true,
    "congestionLevel": "medium",
    "operatingHours": {
      "open": "07:00",
      "close": "23:00"
    }
  }
]
```

#### GET /api/cafes/:id
카페 상세 정보 조회

**Response: 200 OK**
```json
{
  "_id": "cafe_id",
  "name": "스타벅스 강남점",
  "address": "서울시 강남구 테헤란로 123",
  "location": {
    "latitude": 37.4979,
    "longitude": 127.0276
  },
  "phone": "02-1234-5678",
  "isOpen": true,
  "congestionLevel": "medium"
}
```

### 8.3 메뉴 (Menus)

#### GET /api/menus
메뉴 목록 조회

**Query Parameters:**
- `cafeId` (optional): 카페 ID
- `category` (optional): 카테고리 (coffee/tea/beverage/dessert/food)

**Response: 200 OK**
```json
[
  {
    "_id": "menu_id",
    "name": "아메리카노",
    "description": "진한 에스프레소에 물을 더한 깔끔한 커피",
    "category": "coffee",
    "price": 4500,
    "isAvailable": true,
    "cafeId": {
      "_id": "cafe_id",
      "name": "스타벅스 강남점"
    },
    "options": {
      "sizes": [
        { "name": "Tall", "price": 0 },
        { "name": "Grande", "price": 500 }
      ]
    }
  }
]
```

#### GET /api/menus/:id
메뉴 상세 정보 조회

**Response: 200 OK**
```json
{
  "_id": "menu_id",
  "name": "아메리카노",
  "description": "진한 에스프레소에 물을 더한 깔끔한 커피",
  "category": "coffee",
  "price": 4500,
  "isAvailable": true,
  "options": {
    "sizes": [
      { "name": "Tall", "price": 0 },
      { "name": "Grande", "price": 500 }
    ]
  }
}
```

### 8.4 주문 (Orders)

#### POST /api/orders
주문 생성

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "cafeId": "cafe_id",
  "items": [
    {
      "menuId": "menu_id",
      "quantity": 2,
      "selectedOptions": {
        "size": "Grande"
      }
    }
  ],
  "paymentMethod": "card"
}
```

**Response: 201 Created**
```json
{
  "_id": "order_id",
  "customerId": "user_id",
  "cafeId": {
    "_id": "cafe_id",
    "name": "스타벅스 강남점",
    "address": "서울시 강남구 테헤란로 123"
  },
  "items": [
    {
      "menuId": {
        "_id": "menu_id",
        "name": "아메리카노",
        "price": 4500
      },
      "quantity": 2,
      "price": 9000
    }
  ],
  "totalAmount": 9000,
  "status": "pending",
  "paymentStatus": "paid",
  "estimatedPickupTime": "2025-12-15T10:45:00Z",
  "createdAt": "2025-12-15T10:30:00Z"
}
```

#### GET /api/orders
주문 목록 조회

**Headers:**
```
Authorization: Bearer {token}
```

**Response: 200 OK**
```json
[
  {
    "_id": "order_id",
    "cafeId": {
      "_id": "cafe_id",
      "name": "스타벅스 강남점"
    },
    "totalAmount": 9000,
    "status": "preparing",
    "createdAt": "2025-12-15T10:30:00Z"
  }
]
```

#### GET /api/orders/:id
주문 상세 조회

**Headers:**
```
Authorization: Bearer {token}
```

**Response: 200 OK**
```json
{
  "_id": "order_id",
  "customerId": {
    "_id": "user_id",
    "name": "홍길동"
  },
  "cafeId": {
    "_id": "cafe_id",
    "name": "스타벅스 강남점",
    "address": "서울시 강남구 테헤란로 123",
    "phone": "02-1234-5678"
  },
  "items": [
    {
      "menuId": {
        "_id": "menu_id",
        "name": "아메리카노",
        "price": 4500
      },
      "quantity": 2,
      "price": 9000
    }
  ],
  "totalAmount": 9000,
  "status": "preparing",
  "paymentStatus": "paid",
  "estimatedPickupTime": "2025-12-15T10:45:00Z",
  "createdAt": "2025-12-15T10:30:00Z"
}
```

#### PATCH /api/orders/:id/cancel
주문 취소

**Headers:**
```
Authorization: Bearer {token}
```

**Response: 200 OK**
```json
{
  "_id": "order_id",
  "status": "cancelled",
  "paymentStatus": "refunded"
}
```

### 8.5 관리자 (Admin)

#### GET /api/admin/orders
관리자 주문 목록 조회

**Headers:**
```
Authorization: Bearer {token}
```

**Response: 200 OK**
```json
[
  {
    "_id": "order_id",
    "customerId": {
      "_id": "user_id",
      "name": "홍길동",
      "email": "user@example.com"
    },
    "cafeId": {
      "_id": "cafe_id",
      "name": "스타벅스 강남점"
    },
    "items": [
      {
        "menuId": {
          "_id": "menu_id",
          "name": "아메리카노"
        },
        "quantity": 2
      }
    ],
    "totalAmount": 9000,
    "status": "pending",
    "createdAt": "2025-12-15T10:30:00Z"
  }
]
```

#### PATCH /api/admin/orders/:id/status
주문 상태 업데이트

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "status": "preparing"
}
```

**Response: 200 OK**
```json
{
  "_id": "order_id",
  "status": "preparing",
  "updatedAt": "2025-12-15T10:35:00Z"
}
```

#### GET /api/admin/stats
판매 통계 조회

**Headers:**
```
Authorization: Bearer {token}
```

**Response: 200 OK**
```json
{
  "totalOrders": 150,
  "totalRevenue": 1200000,
  "popularMenus": [
    {
      "_id": "menu_id",
      "count": 45
    }
  ]
}
```

#### GET /api/admin/menus
관리자 메뉴 목록 조회

**Headers:**
```
Authorization: Bearer {token}
```

**Response: 200 OK**
```json
[
  {
    "_id": "menu_id",
    "name": "아메리카노",
    "description": "진한 에스프레소에 물을 더한 깔끔한 커피",
    "category": "coffee",
    "price": 4500,
    "isAvailable": true,
    "cafeId": {
      "_id": "cafe_id",
      "name": "스타벅스 강남점"
    }
  }
]
```

#### POST /api/admin/menus
메뉴 생성

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "cafeId": "cafe_id",
  "name": "카페라떼",
  "description": "부드러운 우유와 에스프레소의 조화",
  "category": "coffee",
  "price": 5000,
  "isAvailable": true,
  "options": {
    "sizes": [
      { "name": "Tall", "price": 0 },
      { "name": "Grande", "price": 500 }
    ]
  }
}
```

**Response: 201 Created**
```json
{
  "_id": "menu_id",
  "name": "카페라떼",
  "description": "부드러운 우유와 에스프레소의 조화",
  "category": "coffee",
  "price": 5000,
  "isAvailable": true,
  "cafeId": {
    "_id": "cafe_id",
    "name": "스타벅스 강남점"
  }
}
```

#### PATCH /api/admin/menus/:id
메뉴 수정

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "price": 5500,
  "isAvailable": false
}
```

**Response: 200 OK**
```json
{
  "_id": "menu_id",
  "name": "카페라떼",
  "price": 5500,
  "isAvailable": false
}
```

---

## 9. 데이터 모델

### 9.1 Entity Relationship Diagram (ERD)

```
┌─────────────┐         ┌─────────────┐
│    Users    │         │    Cafes    │
├─────────────┤         ├─────────────┤
│ _id         │◄──┐     │ _id         │
│ name        │   │     │ name        │
│ email       │   │     │ address     │
│ password    │   │     │ location    │
│ phone       │   │     │ phone       │
│ role        │   │     │ merchantId  │──┐
│             │   │     │ isOpen      │  │
└─────────────┘   │     │ congestion  │  │
                  │     └─────────────┘  │
                  │            │         │
                  │            │ 1:N     │
                  │            │         │
                  │     ┌──────▼──────┐  │
                  │     │    Menus    │  │
                  │     ├─────────────┤  │
                  │     │ _id         │  │
                  │     │ name        │  │
                  │     │ description │  │
                  │     │ category    │  │
                  │     │ price       │  │
                  │     │ cafeId      │──┘
                  │     │ isAvailable │
                  │     │ options     │
                  │     └─────────────┘
                  │            │
                  │            │ 1:N
                  │            │
         ┌────────▼────────────▼──┐
         │        Orders          │
         ├────────────────────────┤
         │ _id                    │
         │ customerId             │──┐
         │ cafeId                 │  │
         │ items[]                │  │
         │   - menuId             │  │
         │   - quantity           │  │
         │   - selectedOptions    │  │
         │   - price              │  │
         │ totalAmount            │  │
         │ status                 │  │
         │ paymentStatus          │  │
         │ estimatedPickupTime    │  │
         │ createdAt              │  │
         └────────────────────────┘  │
                  │                 │
                  │ N:1             │
                  │                 │
         ┌────────┴─────────────────┘
         │
         └── Users (customerId)
```

### 9.2 데이터 모델 상세

#### 9.2.1 User (사용자)
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String (optional),
  role: String (enum: ['customer', 'merchant', 'admin'], default: 'customer'),
  favoriteMenus: [ObjectId] (ref: 'Menu'),
  createdAt: Date
}
```

#### 9.2.2 Cafe (카페)
```javascript
{
  _id: ObjectId,
  name: String (required),
  address: String (required),
  location: {
    latitude: Number (required),
    longitude: Number (required)
  },
  phone: String (optional),
  operatingHours: {
    open: String (default: '08:00'),
    close: String (default: '22:00'),
    days: [String] (enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'])
  },
  isOpen: Boolean (default: true),
  congestionLevel: String (enum: ['low', 'medium', 'high'], default: 'low'),
  merchantId: ObjectId (required, ref: 'User'),
  image: String (optional),
  createdAt: Date
}
```

#### 9.2.3 Menu (메뉴)
```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String (optional),
  category: String (enum: ['coffee', 'tea', 'beverage', 'dessert', 'food'], required),
  price: Number (required, min: 0),
  image: String (optional),
  isAvailable: Boolean (default: true),
  options: {
    sizes: [{ name: String, price: Number }],
    shots: [{ name: String, price: Number }],
    syrups: [{ name: String, price: Number }],
    milk: [{ name: String, price: Number }],
    ice: [{ name: String, price: Number }]
  },
  cafeId: ObjectId (required, ref: 'Cafe'),
  createdAt: Date
}
```

#### 9.2.4 Order (주문)
```javascript
{
  _id: ObjectId,
  customerId: ObjectId (required, ref: 'User'),
  cafeId: ObjectId (required, ref: 'Cafe'),
  items: [{
    menuId: ObjectId (required, ref: 'Menu'),
    quantity: Number (required, min: 1),
    selectedOptions: {
      size: String,
      shots: String,
      syrup: String,
      milk: String,
      ice: String
    },
    price: Number (required)
  }],
  totalAmount: Number (required, min: 0),
  status: String (enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'], default: 'pending'),
  paymentStatus: String (enum: ['pending', 'paid', 'refunded'], default: 'pending'),
  paymentMethod: String (enum: ['card', 'mobile'], default: 'card'),
  estimatedPickupTime: Date (optional),
  actualPickupTime: Date (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### 9.3 데이터 흐름 (Data Flow)

**주문 생성 플로우:**
1. 사용자가 메뉴를 장바구니에 추가
2. 장바구니에서 주문하기 클릭
3. 프론트엔드 → 백엔드: POST /api/orders
4. 백엔드에서 메뉴 가격 계산 및 주문 생성
5. 예상 픽업 시간 계산 (현재 시간 + 15분)
6. 주문 저장 및 응답 반환
7. 프론트엔드에서 주문 상세 페이지로 이동

**주문 상태 업데이트 플로우:**
1. 관리자가 주문 상태 변경
2. 프론트엔드 → 백엔드: PATCH /api/admin/orders/:id/status
3. 백엔드에서 주문 상태 업데이트
4. "ready" 상태일 경우 actualPickupTime 기록
5. 업데이트된 주문 정보 반환

---

## 10. 비기능 요구사항

### 10.1 성능 요구사항

**응답 시간:**
- API 평균 응답 시간: 1초 이내
- 페이지 로딩 시간: 2초 이내
- 주문 생성 처리 시간: 3초 이내

**처리량:**
- 동시 사용자: 100명
- 초당 요청 처리: 50건
- 데이터베이스 쿼리 최적화

**확장성:**
- 수평 확장 가능한 아키텍처
- MongoDB 인덱싱 최적화
- 캐싱 전략 (향후 Redis 도입)

### 10.2 보안 요구사항

**인증 및 인가:**
- JWT 토큰 기반 인증
- 비밀번호 bcrypt 해싱 (salt rounds: 10)
- 토큰 만료 시간: 7일

**데이터 보안:**
- HTTPS 강제 (프로덕션)
- 민감 정보 암호화
- SQL Injection 방지 (Mongoose 사용)
- XSS 방지 (입력 검증)

**결제 보안:**
- 결제 정보 직접 저장 금지
- 외부 결제 게이트웨이 위임 (향후)
- 결제 검증 로직

**OWASP Top 10 준수:**
- 인젝션 방지
- 인증 및 세션 관리
- 민감 데이터 노출 방지
- XML 외부 엔티티(XXE) 방지
- 취약한 접근 제어 방지
- 보안 설정 오류 방지
- XSS 방지
- 안전하지 않은 역직렬화 방지
- 알려진 취약점 사용 방지
- 로깅 및 모니터링 부족 방지

### 10.3 가용성 요구사항

**업타임:**
- 목표: 99% 이상
- 다운타임 허용: 월 7.2시간 이내

**백업 및 복구:**
- 데이터베이스 일일 백업 (향후)
- 재해 복구 계획 (향후)

### 10.4 사용성 요구사항

**접근성:**
- WCAG 2.1 Level A 준수 (향후)
- 키보드 네비게이션 지원
- 스크린 리더 호환성 (향후)

**반응형 디자인:**
- 모바일 (320px ~ 768px)
- 태블릿 (768px ~ 1024px)
- 데스크톱 (1024px 이상)

**브라우저 호환성:**
- Chrome (최신 2개 버전)
- Firefox (최신 2개 버전)
- Safari (최신 2개 버전)
- Edge (최신 2개 버전)

### 10.5 유지보수 요구사항

**코드 품질:**
- 일관된 코딩 스타일
- 주석 및 문서화
- 모듈화된 구조

**로깅:**
- 에러 로깅
- API 요청 로깅 (향후)
- 성능 모니터링 (향후)

**테스트:**
- 단위 테스트 (향후)
- 통합 테스트 (향후)
- E2E 테스트 (향후)

---

## 11. 일정 및 마일스톤

### 11.1 개발 일정

**Phase 1: MVP 개발 (4주)**

**Week 1: 기본 인프라 구축**
- [x] 프로젝트 구조 설정
- [x] 프론트엔드 기본 설정 (React + Tailwind)
- [x] 백엔드 기본 설정 (Express + MongoDB)
- [x] 데이터베이스 모델 설계 및 구현
- [x] 인증 시스템 구현 (JWT)

**Week 2: 핵심 기능 개발**
- [x] 카페 목록 및 검색 기능
- [x] 메뉴 조회 기능
- [x] 장바구니 기능
- [x] 주문 생성 기능
- [x] 주문 내역 조회 기능

**Week 3: 관리자 기능 및 개선**
- [x] 관리자 대시보드
- [x] 주문 상태 관리
- [x] 메뉴 관리 (CRUD)
- [x] 판매 통계
- [x] UI/UX 개선

**Week 4: 테스트 및 배포 준비**
- [ ] 통합 테스트
- [ ] 버그 수정
- [ ] 성능 최적화
- [ ] 문서화 완료
- [ ] 배포 준비

### 11.2 마일스톤

**M1: 기본 인프라 완료 (Week 1)**
- 프로젝트 구조 완성
- 인증 시스템 동작 확인

**M2: MVP 핵심 기능 완료 (Week 2)**
- 고객 주문 플로우 완성
- 기본 기능 테스트 통과

**M3: 관리자 기능 완료 (Week 3)**
- 관리자 대시보드 완성
- 전체 기능 통합 테스트

**M4: MVP 출시 준비 완료 (Week 4)**
- 모든 기능 완성
- 문서화 완료
- 배포 준비 완료

### 11.3 향후 로드맵

**Phase 2: 기능 확장 (2개월)**
- 실제 결제 게이트웨이 연동 (Toss Payments/Stripe)
- 푸시 알림 시스템 (Firebase Cloud Messaging)
- 실시간 주문 상태 업데이트 (WebSocket)
- 이미지 업로드 기능
- 위치 기반 검색 개선 (정확한 거리 계산)

**Phase 3: 고급 기능 (3개월)**
- 리뷰 및 평점 시스템
- 로열티 프로그램
- AI 기반 메뉴 추천
- 배달 연동
- 모바일 네이티브 앱 개발

---

## 12. 리스크 & 의존성

### 12.1 기술적 리스크

| 리스크 | 영향도 | 확률 | 대응 방안 |
|--------|--------|------|-----------|
| MongoDB 연결 실패 | 높음 | 중간 | 연결 풀 설정, 재연결 로직 구현 |
| JWT 토큰 보안 취약점 | 높음 | 낮음 | 토큰 만료 시간 설정, HTTPS 강제 |
| 성능 저하 (대량 주문) | 중간 | 중간 | 데이터베이스 인덱싱, 쿼리 최적화 |
| 결제 시스템 연동 실패 | 높음 | 중간 | 테스트 모드로 우선 구현, 단계적 연동 |

### 12.2 비즈니스 리스크

| 리스크 | 영향도 | 확률 | 대응 방안 |
|--------|--------|------|-----------|
| 사용자 확보 실패 | 높음 | 중간 | 마케팅 전략 수립, 무료 체험 제공 |
| 카페 입점 저조 | 높음 | 중간 | 입점 인센티브 제공, 쉬운 등록 프로세스 |
| 경쟁 서비스 출현 | 중간 | 높음 | 차별화된 기능 개발, 빠른 시장 진입 |

### 12.3 의존성

**외부 서비스:**
- MongoDB (데이터베이스)
- 결제 게이트웨이 (향후: Toss Payments/Stripe)
- 푸시 알림 서비스 (향후: Firebase Cloud Messaging)
- 호스팅 서비스 (향후: Vercel, Render/Heroku)

**개발 도구:**
- Node.js
- npm/yarn
- Git
- VS Code / Cursor

**팀 의존성:**
- 프론트엔드 개발자
- 백엔드 개발자
- 디자이너 (향후)
- QA 엔지니어 (향후)

### 12.4 완화 전략

**기술적 리스크 완화:**
- 정기적인 코드 리뷰
- 단계적 배포 (Staging → Production)
- 모니터링 시스템 구축 (향후)
- 자동화된 테스트 (향후)

**비즈니스 리스크 완화:**
- 사용자 피드백 수집 및 반영
- 빠른 반복 개발 (Agile 방법론)
- MVP 우선 출시 후 기능 확장

---

## 부록

### A. 용어 정의

- **MVP (Minimum Viable Product)**: 최소 기능 제품
- **JWT (JSON Web Token)**: 웹 토큰 기반 인증 방식
- **RESTful API**: REST 원칙을 따르는 API 설계
- **ODM (Object Document Mapper)**: 객체-문서 매핑 도구 (Mongoose)
- **CORS (Cross-Origin Resource Sharing)**: 교차 출처 리소스 공유

### B. 참고 자료

- [PRD 문서 템플릿](file://WB2_2-PRD 문서 템플릿.pdf)
- [OrderBean 요구사항 문서](./README.md)
- [Express.js 공식 문서](https://expressjs.com/)
- [React 공식 문서](https://react.dev/)
- [MongoDB 공식 문서](https://www.mongodb.com/docs/)

### C. 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|-----------|--------|
| 1.0 | 2025-12-15 | 초안 작성 | 개발팀 |

---

**문서 끝**

