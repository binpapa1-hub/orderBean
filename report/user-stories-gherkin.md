# OrderBean 사용자 스토리 (Gherkin Style)

**생성일**: 2025년 12월 17일

---

## 1. 회원가입 및 로그인

### Feature: 사용자 인증
사용자로서 OrderBean 서비스를 이용하기 위해 회원가입하고 로그인할 수 있다.

#### Scenario: 신규 사용자 회원가입 성공
```gherkin
Given 사용자가 회원가입 페이지에 있다
When 사용자가 다음 정보를 입력한다:
  | 필드     | 값                    |
  | 이름     | 홍길동                |
  | 이메일   | hong@example.com      |
  | 비밀번호 | password123           |
  | 전화번호 | 010-1234-5678         |
And "회원가입" 버튼을 클릭한다
Then 회원가입이 성공한다
And 사용자는 자동으로 로그인된다
And 카페 목록 페이지로 이동한다
```

#### Scenario: 이미 존재하는 이메일로 회원가입 시도
```gherkin
Given 이메일 "existing@example.com"으로 가입된 사용자가 있다
When 사용자가 동일한 이메일 "existing@example.com"으로 회원가입을 시도한다
Then "User already exists" 에러 메시지가 표시된다
And 회원가입이 실패한다
```

#### Scenario: 유효한 자격 증명으로 로그인 성공
```gherkin
Given 이메일 "customer@test.com", 비밀번호 "password123"으로 가입된 사용자가 있다
When 사용자가 이메일 "customer@test.com"과 비밀번호 "password123"을 입력한다
And "로그인" 버튼을 클릭한다
Then 로그인이 성공한다
And 네비게이션 바에 "안녕하세요, {이름}님"이 표시된다
And 카페 목록 페이지로 이동한다
```

#### Scenario: 잘못된 비밀번호로 로그인 시도
```gherkin
Given 이메일 "customer@test.com", 비밀번호 "password123"으로 가입된 사용자가 있다
When 사용자가 이메일 "customer@test.com"과 비밀번호 "wrongpassword"를 입력한다
And "로그인" 버튼을 클릭한다
Then "Invalid credentials" 에러 메시지가 표시된다
And 로그인이 실패한다
```

#### Scenario: 로그아웃
```gherkin
Given 사용자가 로그인되어 있다
When 사용자가 "로그아웃" 버튼을 클릭한다
Then 사용자가 로그아웃된다
And 네비게이션 바에 "로그인", "회원가입" 버튼이 표시된다
And 홈 페이지로 이동한다
```

---

## 2. 카페 탐색 및 검색

### Feature: 카페 찾기
사용자로서 근처의 영업 중인 카페를 찾아 메뉴를 확인할 수 있다.

#### Scenario: 영업 중인 카페 목록 조회
```gherkin
Given 다음 카페들이 등록되어 있다:
  | 이름        | 주소              | 영업 상태 |
  | 스타벅스    | 강남역 1번 출구   | 영업 중   |
  | 투썸플레이스| 강남역 2번 출구   | 영업 중   |
  | 이디야커피  | 강남역 3번 출구   | 영업 종료 |
When 사용자가 카페 목록 페이지에 접속한다
Then 영업 중인 카페 2개가 표시된다
And "이디야커피"는 목록에 표시되지 않는다
```

#### Scenario: 위치 기반 카페 검색
```gherkin
Given 사용자의 현재 위치가 위도 37.5665, 경도 126.9780이다
And 반경 2km 내에 다음 카페가 있다:
  | 이름     | 거리   |
  | 카페A    | 0.5km  |
  | 카페B    | 1.8km  |
And 반경 2km 외에 "카페C"가 있다 (거리: 3km)
When 사용자가 반경 2km로 카페를 검색한다
Then "카페A"와 "카페B"가 목록에 표시된다
And "카페C"는 목록에 표시되지 않는다
```

#### Scenario: 카페 상세 정보 조회
```gherkin
Given "스타벅스 강남점" 카페가 등록되어 있다
When 사용자가 "스타벅스 강남점"을 클릭한다
Then 다음 정보가 표시된다:
  | 항목       | 값                 |
  | 카페 이름  | 스타벅스 강남점    |
  | 주소       | 강남역 1번 출구    |
  | 전화번호   | 02-1234-5678       |
  | 영업시간   | 08:00 - 22:00      |
  | 혼잡도     | 보통               |
And 메뉴 목록이 표시된다
```

#### Scenario: 존재하지 않는 카페 조회
```gherkin
Given 카페 ID "nonexistent123"가 존재하지 않는다
When 사용자가 해당 카페 페이지에 접근한다
Then "Cafe not found" 메시지가 표시된다
And 404 에러 페이지가 표시된다
```

---

## 3. 메뉴 조회 및 주문

### Feature: 메뉴 조회 및 장바구니
사용자로서 카페의 메뉴를 확인하고 원하는 음료를 장바구니에 담을 수 있다.

#### Scenario: 카페 메뉴 조회
```gherkin
Given "스타벅스 강남점"에 다음 메뉴가 등록되어 있다:
  | 메뉴명      | 카테고리 | 가격   | 상태     |
  | 아메리카노  | coffee   | 4,500원 | 판매 중  |
  | 카페라떼    | coffee   | 5,000원 | 판매 중  |
  | 초코케이크  | dessert  | 6,000원 | 품절     |
When 사용자가 "스타벅스 강남점" 메뉴 페이지에 접속한다
Then "아메리카노"와 "카페라떼"가 표시된다
And "초코케이크"는 품절로 표시되거나 숨겨진다
```

#### Scenario: 카테고리별 메뉴 필터링
```gherkin
Given "스타벅스 강남점"에 다양한 카테고리의 메뉴가 있다
When 사용자가 "coffee" 카테고리를 선택한다
Then 커피 메뉴만 표시된다
And 디저트 메뉴는 표시되지 않는다
```

#### Scenario: 메뉴 옵션 선택
```gherkin
Given 사용자가 "아메리카노" 메뉴를 선택했다
And 다음 옵션이 제공된다:
  | 옵션   | 선택지                | 추가 가격 |
  | 사이즈 | Small, Regular, Large | 0, 0, +500원 |
  | 샷     | 기본, 추가            | 0, +500원 |
When 사용자가 "Large" 사이즈와 "샷 추가"를 선택한다
Then 최종 가격이 "5,500원"으로 표시된다
```

#### Scenario: 장바구니에 메뉴 추가
```gherkin
Given 사용자가 로그인되어 있다
And 사용자가 "아메리카노" 메뉴 상세 페이지에 있다
When 사용자가 수량을 2개로 설정한다
And "장바구니에 담기" 버튼을 클릭한다
Then 장바구니에 "아메리카노 x 2"가 추가된다
And 장바구니 아이콘에 수량 "2"가 표시된다
```

---

## 4. 주문 및 결제

### Feature: 주문 생성 및 결제
사용자로서 장바구니의 메뉴를 주문하고 결제할 수 있다.

#### Scenario: 주문 생성 성공
```gherkin
Given 사용자가 로그인되어 있다
And 장바구니에 다음 항목이 있다:
  | 메뉴명     | 옵션       | 수량 | 가격   |
  | 아메리카노 | Large      | 2    | 10,000원 |
  | 카페라떼   | Regular    | 1    | 5,000원  |
And 총 금액이 "15,000원"이다
When 사용자가 "주문하기" 버튼을 클릭한다
And 결제 방법으로 "카드"를 선택한다
And 결제가 완료된다
Then 주문이 생성된다
And 주문 상태가 "pending"이다
And 예상 픽업 시간이 표시된다 (약 15분 후)
And 주문 확인 페이지로 이동한다
```

#### Scenario: 비로그인 상태에서 주문 시도
```gherkin
Given 사용자가 로그인되어 있지 않다
And 장바구니에 메뉴가 담겨있다
When 사용자가 "주문하기" 버튼을 클릭한다
Then 로그인 페이지로 리다이렉트된다
And "로그인이 필요합니다" 메시지가 표시된다
```

#### Scenario: 품절된 메뉴가 포함된 주문
```gherkin
Given 사용자가 로그인되어 있다
And 장바구니에 "아메리카노"가 담겨있다
And "아메리카노"가 품절 상태로 변경되었다
When 사용자가 "주문하기" 버튼을 클릭한다
Then "Menu item {menuId} is not available" 에러가 표시된다
And 주문이 생성되지 않는다
```

#### Scenario: 주문 내역 조회
```gherkin
Given 사용자가 로그인되어 있다
And 사용자가 3개의 주문을 완료했다
When 사용자가 "주문 내역" 페이지에 접속한다
Then 3개의 주문이 최신순으로 표시된다
And 각 주문에 다음 정보가 표시된다:
  | 항목         |
  | 주문 번호    |
  | 카페 이름    |
  | 주문 메뉴    |
  | 총 금액      |
  | 주문 상태    |
  | 주문 일시    |
```

#### Scenario: 주문 취소
```gherkin
Given 사용자가 로그인되어 있다
And 주문 상태가 "pending"인 주문이 있다
When 사용자가 해당 주문의 "주문 취소" 버튼을 클릭한다
Then 주문 상태가 "cancelled"로 변경된다
And 결제 상태가 "refunded"로 변경된다
And "주문이 취소되었습니다" 메시지가 표시된다
```

#### Scenario: 준비 완료된 주문 취소 불가
```gherkin
Given 사용자가 로그인되어 있다
And 주문 상태가 "ready"인 주문이 있다
When 사용자가 해당 주문의 "주문 취소" 버튼을 클릭한다
Then "Cannot cancel order that is ready or completed" 에러가 표시된다
And 주문 상태가 변경되지 않는다
```

---

## 5. 관리자 기능

### Feature: 매장 관리자 대시보드
매장 관리자로서 주문을 관리하고 메뉴를 수정할 수 있다.

#### Scenario: 관리자 주문 목록 조회
```gherkin
Given 사용자가 "merchant" 역할로 로그인되어 있다
And 해당 매장에 5개의 주문이 있다
When 사용자가 관리자 대시보드에 접속한다
Then 해당 매장의 주문 5개가 표시된다
And 각 주문에 다음 정보가 표시된다:
  | 항목         |
  | 고객 이름    |
  | 주문 메뉴    |
  | 총 금액      |
  | 주문 상태    |
  | 주문 시간    |
```

#### Scenario: 일반 사용자 관리자 페이지 접근 거부
```gherkin
Given 사용자가 "customer" 역할로 로그인되어 있다
When 사용자가 관리자 대시보드 URL에 접근한다
Then "Insufficient permissions" 에러가 표시된다
And 접근이 거부된다 (403 에러)
```

#### Scenario: 주문 상태 업데이트
```gherkin
Given 사용자가 "merchant" 역할로 로그인되어 있다
And 주문 상태가 "pending"인 주문이 있다
When 관리자가 해당 주문의 상태를 "confirmed"로 변경한다
Then 주문 상태가 "confirmed"로 업데이트된다
And 고객에게 알림이 전송된다
```

#### Scenario: 주문 준비 완료 처리
```gherkin
Given 사용자가 "merchant" 역할로 로그인되어 있다
And 주문 상태가 "preparing"인 주문이 있다
When 관리자가 해당 주문의 상태를 "ready"로 변경한다
Then 주문 상태가 "ready"로 업데이트된다
And 실제 픽업 시간(actualPickupTime)이 기록된다
And 고객에게 "주문이 준비되었습니다" 알림이 전송된다
```

#### Scenario: 새 메뉴 추가
```gherkin
Given 사용자가 "merchant" 역할로 로그인되어 있다
And 해당 카페의 메뉴 관리 페이지에 있다
When 관리자가 다음 정보로 새 메뉴를 추가한다:
  | 필드       | 값            |
  | 메뉴명     | 바닐라라떼    |
  | 카테고리   | coffee        |
  | 가격       | 5,500원       |
  | 설명       | 달콤한 바닐라 라떼 |
And "메뉴 추가" 버튼을 클릭한다
Then 새 메뉴가 생성된다
And 메뉴 목록에 "바닐라라떼"가 표시된다
```

#### Scenario: 메뉴 품절 처리
```gherkin
Given 사용자가 "merchant" 역할로 로그인되어 있다
And "아메리카노" 메뉴가 판매 중이다
When 관리자가 "아메리카노"의 상태를 "품절"로 변경한다
Then 메뉴의 isAvailable이 false로 변경된다
And 고객 메뉴 목록에서 해당 메뉴가 품절로 표시된다
```

#### Scenario: 판매 통계 조회
```gherkin
Given 사용자가 "merchant" 역할로 로그인되어 있다
And 해당 매장에서 10건의 주문, 총 150,000원의 매출이 발생했다
When 관리자가 판매 통계 페이지에 접속한다
Then 다음 정보가 표시된다:
  | 항목       | 값         |
  | 총 주문 수 | 10건       |
  | 총 매출액  | 150,000원  |
And 인기 메뉴 TOP 5가 표시된다
```

#### Scenario: 다른 매장 주문 접근 불가
```gherkin
Given 사용자가 "merchant" 역할로 로그인되어 있다
And 사용자가 소유한 매장은 "카페A"이다
And "카페B"에 주문이 있다
When 관리자가 "카페B"의 주문 상태를 변경하려고 한다
Then "Access denied" 에러가 표시된다
And 변경이 거부된다 (403 에러)
```

---

## 요약

| 기능 | 시나리오 수 |
|------|------------|
| 1. 회원가입 및 로그인 | 5개 |
| 2. 카페 탐색 및 검색 | 4개 |
| 3. 메뉴 조회 및 주문 | 4개 |
| 4. 주문 및 결제 | 6개 |
| 5. 관리자 기능 | 8개 |
| **총계** | **27개** |

---

## Gherkin 키워드 설명

| 키워드 | 의미 |
|--------|------|
| **Feature** | 테스트할 기능 |
| **Scenario** | 특정 상황에서의 테스트 케이스 |
| **Given** | 사전 조건 (테스트 시작 전 상태) |
| **When** | 사용자 행동 (테스트 액션) |
| **Then** | 예상 결과 (검증할 사항) |
| **And** | 추가 조건/행동/결과 연결 |

