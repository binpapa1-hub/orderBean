# OrderBean 테스트 케이스 목록

**생성일**: 2025년 12월 17일  
**총 테스트 케이스**: 90개 (백엔드 67개 + 프론트엔드 23개)

---

## 백엔드 테스트 케이스 (67개)

### 1. 인증 API (auth.test.js) - 15개

#### POST /api/auth/register (회원가입)
| # | 테스트 케이스 | 예상 결과 |
|---|--------------|----------|
| 1 | 유효한 정보로 회원가입 | 201, 토큰 및 사용자 정보 반환 |
| 2 | 이미 존재하는 이메일로 가입 시도 | 400, "User already exists" |
| 3 | 이름 누락 | 400, validation error |
| 4 | 잘못된 이메일 형식 | 400, validation error |
| 5 | 비밀번호 6자 미만 | 400, validation error |
| 6 | merchant 역할로 가입 | 201, role: "merchant" |

#### POST /api/auth/login (로그인)
| # | 테스트 케이스 | 예상 결과 |
|---|--------------|----------|
| 7 | 유효한 자격 증명으로 로그인 | 200, 토큰 및 사용자 정보 반환 |
| 8 | 잘못된 이메일 형식 | 400, validation error |
| 9 | 비밀번호 누락 | 400, validation error |
| 10 | 존재하지 않는 사용자 | 400, "Invalid credentials" |
| 11 | 잘못된 비밀번호 | 400, "Invalid credentials" |

#### GET /api/auth/me (현재 사용자)
| # | 테스트 케이스 | 예상 결과 |
|---|--------------|----------|
| 12 | 유효한 토큰으로 조회 | 200, 사용자 정보 (비밀번호 제외) |
| 13 | 토큰 없이 요청 | 401, "No token" |
| 14 | 잘못된 토큰 | 401, "Token is not valid" |
| 15 | 만료된 토큰 | 401, "Token is not valid" |

---

### 2. 카페 API (cafes.test.js) - 7개

#### GET /api/cafes (카페 목록)
| # | 테스트 케이스 | 예상 결과 |
|---|--------------|----------|
| 1 | 영업 중인 카페 목록 조회 | 200, 카페 배열 반환 |
| 2 | 영업 종료된 카페는 목록에 미포함 | 200, isOpen: false 카페 제외 |
| 3 | 위치 기반 필터링 (위도, 경도, 반경) | 200, 반경 내 카페만 반환 |
| 4 | 반경 내 카페 없음 | 200, 빈 배열 |

#### GET /api/cafes/:id (카페 상세)
| # | 테스트 케이스 | 예상 결과 |
|---|--------------|----------|
| 5 | 유효한 ID로 조회 | 200, 카페 상세 정보 |
| 6 | 존재하지 않는 ID | 404, "Cafe not found" |
| 7 | 잘못된 ID 형식 | 500, Server error |

---

### 3. 메뉴 API (menus.test.js) - 8개

#### GET /api/menus (메뉴 목록)
| # | 테스트 케이스 | 예상 결과 |
|---|--------------|----------|
| 1 | 사용 가능한 메뉴 목록 조회 | 200, 메뉴 배열 반환 |
| 2 | 품절 메뉴는 목록에 미포함 | 200, isAvailable: false 메뉴 제외 |
| 3 | cafeId로 필터링 | 200, 해당 카페 메뉴만 반환 |
| 4 | category로 필터링 | 200, 해당 카테고리 메뉴만 반환 |
| 5 | cafeId + category 복합 필터링 | 200, 조건 만족 메뉴만 반환 |

#### GET /api/menus/:id (메뉴 상세)
| # | 테스트 케이스 | 예상 결과 |
|---|--------------|----------|
| 6 | 유효한 ID로 조회 | 200, 메뉴 상세 + 카페 정보 |
| 7 | 존재하지 않는 ID | 404, "Menu item not found" |
| 8 | 카페 정보 populate 확인 | 200, cafeId에 name, address 포함 |

---

### 4. 주문 API (orders.test.js) - 17개

#### POST /api/orders (주문 생성)
| # | 테스트 케이스 | 예상 결과 |
|---|--------------|----------|
| 1 | 유효한 주문 생성 | 201, 주문 정보 반환 |
| 2 | 미인증 상태에서 주문 | 401, "No token" |
| 3 | 품절 메뉴 주문 | 400, "not available" |
| 4 | 여러 메뉴 주문 시 총액 계산 | 201, totalAmount 정확히 계산 |
| 5 | 예상 픽업 시간 설정 확인 | 201, estimatedPickupTime 존재 |

#### GET /api/orders (주문 목록)
| # | 테스트 케이스 | 예상 결과 |
|---|--------------|----------|
| 6 | 사용자 주문 목록 조회 | 200, 본인 주문만 반환 |
| 7 | 미인증 상태 | 401, "No token" |
| 8 | 다른 사용자 주문 미포함 | 200, 본인 주문만 반환 |

#### GET /api/orders/:id (주문 상세)
| # | 테스트 케이스 | 예상 결과 |
|---|--------------|----------|
| 9 | 본인 주문 상세 조회 | 200, 주문 상세 정보 |
| 10 | 존재하지 않는 주문 | 404, "Order not found" |
| 11 | 다른 사용자 주문 접근 | 403, "Access denied" |

#### PATCH /api/orders/:id/cancel (주문 취소)
| # | 테스트 케이스 | 예상 결과 |
|---|--------------|----------|
| 12 | 본인 주문 취소 | 200, status: "cancelled" |
| 13 | 존재하지 않는 주문 취소 | 404, "Order not found" |
| 14 | 다른 사용자 주문 취소 시도 | 403, "Access denied" |
| 15 | ready 상태 주문 취소 불가 | 400, "Cannot cancel" |
| 16 | completed 상태 주문 취소 불가 | 400, "Cannot cancel" |
| 17 | 취소 시 환불 상태 변경 | 200, paymentStatus: "refunded" |

---

### 5. 관리자 API (admin.test.js) - 20개

#### GET /api/admin/orders (관리자 주문 목록)
| # | 테스트 케이스 | 예상 결과 |
|---|--------------|----------|
| 1 | merchant가 소유 카페 주문 조회 | 200, 주문 배열 반환 |
| 2 | 미인증 상태 | 401, "No token" |
| 3 | customer 역할 접근 | 403, "Insufficient permissions" |
| 4 | 소유하지 않은 카페 주문은 미포함 | 200, 본인 카페 주문만 반환 |

#### PATCH /api/admin/orders/:id/status (주문 상태 변경)
| # | 테스트 케이스 | 예상 결과 |
|---|--------------|----------|
| 5 | 주문 상태 업데이트 | 200, 변경된 status |
| 6 | ready로 변경 시 actualPickupTime 설정 | 200, actualPickupTime 존재 |
| 7 | 잘못된 상태값 | 400, "Invalid status" |
| 8 | 존재하지 않는 주문 | 404, "Order not found" |
| 9 | 소유하지 않은 카페 주문 변경 | 403, "Access denied" |

#### GET /api/admin/menus (관리자 메뉴 목록)
| # | 테스트 케이스 | 예상 결과 |
|---|--------------|----------|
| 10 | 소유 카페 메뉴 조회 | 200, 메뉴 배열 반환 |
| 11 | 미인증 상태 | 401, "No token" |

#### POST /api/admin/menus (메뉴 생성)
| # | 테스트 케이스 | 예상 결과 |
|---|--------------|----------|
| 12 | 새 메뉴 생성 | 201, 생성된 메뉴 정보 |
| 13 | 소유하지 않은 카페에 메뉴 생성 | 403, "Access denied" |

#### PATCH /api/admin/menus/:id (메뉴 수정)
| # | 테스트 케이스 | 예상 결과 |
|---|--------------|----------|
| 14 | 메뉴 정보 수정 | 200, 수정된 메뉴 정보 |
| 15 | 존재하지 않는 메뉴 | 404, "Menu not found" |
| 16 | 소유하지 않은 카페 메뉴 수정 | 403, "Access denied" |

#### GET /api/admin/stats (판매 통계)
| # | 테스트 케이스 | 예상 결과 |
|---|--------------|----------|
| 17 | 판매 통계 조회 | 200, totalOrders, totalRevenue, popularMenus |
| 18 | 미인증 상태 | 401, "No token" |
| 19 | 총 주문 수 확인 | 200, totalOrders >= 0 |
| 20 | 총 매출액 확인 | 200, totalRevenue >= 0 |

---

## 프론트엔드 테스트 케이스 (23개)

### 1. Navbar 컴포넌트 (Navbar.test.jsx) - 4개

| # | 테스트 케이스 | 예상 결과 |
|---|--------------|----------|
| 1 | 비로그인 시 로고 및 네비게이션 렌더링 | OrderBean 로고, 카페 찾기, 로그인, 회원가입 표시 |
| 2 | 로그인 시 사용자 이름 표시 | "안녕하세요, {name}님" 표시 |
| 3 | merchant 역할 시 관리자 링크 표시 | "관리자" 링크 표시 |
| 4 | 로그아웃 클릭 시 네비게이트 호출 | navigate('/') 호출 |

---

### 2. PrivateRoute 컴포넌트 (PrivateRoute.test.jsx) - 3개

| # | 테스트 케이스 | 예상 결과 |
|---|--------------|----------|
| 1 | 인증된 사용자 - 보호된 콘텐츠 렌더링 | children 컴포넌트 표시 |
| 2 | 비인증 사용자 - 로그인으로 리다이렉트 | Navigate to /login |
| 3 | requiredRole 불일치 시 리다이렉트 | 권한 없음 처리 |

---

### 3. AuthContext (AuthContext.test.jsx) - 8개

| # | 테스트 케이스 | 예상 결과 |
|---|--------------|----------|
| 1 | AuthProvider 외부에서 useAuth 사용 시 에러 | "useAuth must be used within AuthProvider" |
| 2 | AuthProvider 내부에서 컨텍스트 제공 | login, register, logout 함수 존재 |
| 3 | 토큰 있을 때 사용자 정보 fetch | /api/auth/me 호출 |
| 4 | 로그인 성공 | 토큰 저장, 사용자 설정, 성공 토스트 |
| 5 | 로그인 실패 | 에러 토스트 표시 |
| 6 | 회원가입 성공 | 토큰 저장, 사용자 설정, 성공 토스트 |
| 7 | 로그아웃 | 토큰 제거, 사용자 null, 성공 토스트 |
| 8 | fetch 에러 시 토큰 정리 | localStorage에서 토큰 제거 |

---

### 4. Login 페이지 (Login.test.jsx) - 8개

| # | 테스트 케이스 | 예상 결과 |
|---|--------------|----------|
| 1 | 로그인 폼 렌더링 | 이메일, 비밀번호 입력, 로그인 버튼 표시 |
| 2 | 회원가입 링크 표시 | "계정이 없으신가요? 회원가입" 표시 |
| 3 | 이메일 입력값 업데이트 | 입력한 값으로 업데이트 |
| 4 | 비밀번호 입력값 업데이트 | 입력한 값으로 업데이트 |
| 5 | 폼 제출 시 로그인 API 호출 | /api/auth/login 호출 |
| 6 | 로그인 성공 시 /cafes로 이동 | navigate('/cafes') 호출 |
| 7 | 로그인 실패 시 에러 표시 | toast.error 호출 |
| 8 | 이메일, 비밀번호 필수 입력 | required 속성 확인 |

---

## 테스트 카테고리별 요약

| 카테고리 | 테스트 수 | 비고 |
|----------|----------|------|
| 인증 (Auth) | 15 | 회원가입, 로그인, 토큰 검증 |
| 카페 (Cafes) | 7 | 목록, 상세, 위치 필터링 |
| 메뉴 (Menus) | 8 | 목록, 상세, 필터링 |
| 주문 (Orders) | 17 | 생성, 조회, 취소, 권한 검증 |
| 관리자 (Admin) | 20 | 주문 관리, 메뉴 관리, 통계 |
| **백엔드 합계** | **67** | |
| Navbar | 4 | 네비게이션 UI |
| PrivateRoute | 3 | 라우트 보호 |
| AuthContext | 8 | 인증 상태 관리 |
| Login | 8 | 로그인 페이지 |
| **프론트엔드 합계** | **23** | |
| **총계** | **90** | |

---

## 테스트 실행 방법

### 백엔드
```bash
cd backend
npm install
npm test
```

### 프론트엔드
```bash
cd frontend
npm install
npm test
```

---

## 테스트 파일 위치

```
OrderBean/
├── backend/tests/
│   ├── setup.js          # 테스트 환경 설정
│   ├── auth.test.js      # 인증 API 테스트
│   ├── cafes.test.js     # 카페 API 테스트
│   ├── menus.test.js     # 메뉴 API 테스트
│   ├── orders.test.js    # 주문 API 테스트
│   └── admin.test.js     # 관리자 API 테스트
│
└── frontend/src/tests/
    ├── setup.js                        # 테스트 환경 설정
    ├── components/
    │   ├── Navbar.test.jsx             # Navbar 테스트
    │   └── PrivateRoute.test.jsx       # PrivateRoute 테스트
    ├── contexts/
    │   └── AuthContext.test.jsx        # AuthContext 테스트
    └── pages/
        └── Login.test.jsx              # Login 페이지 테스트
```

