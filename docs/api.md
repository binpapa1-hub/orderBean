# API 문서

OrderBean RESTful API 상세 명세서입니다.

## 기본 정보

- **Base URL**: `http://localhost:5000/api`
- **인증 방식**: JWT Bearer Token
- **Content-Type**: `application/json`

## 인증

대부분의 API는 JWT 토큰 인증이 필요합니다. 요청 헤더에 다음을 포함하세요:

```
Authorization: Bearer {token}
```

---

## 인증 API

### 회원가입

**POST** `/api/auth/register`

새로운 사용자를 등록합니다.

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

**에러 응답: 400 Bad Request**
```json
{
  "message": "User already exists"
}
```

---

### 로그인

**POST** `/api/auth/login`

사용자 로그인 및 토큰 발급.

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

**에러 응답: 400 Bad Request**
```json
{
  "message": "Invalid credentials"
}
```

---

### 현재 사용자 정보

**GET** `/api/auth/me`

현재 로그인한 사용자 정보를 조회합니다.

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
  "phone": "010-1234-5678",
  "favoriteMenus": [],
  "createdAt": "2025-12-15T10:00:00Z"
}
```

---

## 카페 API

### 카페 목록 조회

**GET** `/api/cafes`

등록된 카페 목록을 조회합니다.

**Query Parameters:**
- `latitude` (optional): 위도
- `longitude` (optional): 경도
- `radius` (optional): 검색 반경 (km, default: 5)

**Example:**
```
GET /api/cafes?latitude=37.4979&longitude=127.0276&radius=5
```

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
      "close": "23:00",
      "days": ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
    },
    "createdAt": "2025-12-15T10:00:00Z"
  }
]
```

---

### 카페 상세 정보

**GET** `/api/cafes/:id`

특정 카페의 상세 정보를 조회합니다.

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
  "congestionLevel": "medium",
  "operatingHours": {
    "open": "07:00",
    "close": "23:00"
  }
}
```

**에러 응답: 404 Not Found**
```json
{
  "message": "Cafe not found"
}
```

---

## 메뉴 API

### 메뉴 목록 조회

**GET** `/api/menus`

메뉴 목록을 조회합니다.

**Query Parameters:**
- `cafeId` (optional): 카페 ID로 필터링
- `category` (optional): 카테고리로 필터링 (coffee/tea/beverage/dessert/food)

**Example:**
```
GET /api/menus?cafeId=cafe_id&category=coffee
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
      "name": "스타벅스 강남점",
      "address": "서울시 강남구 테헤란로 123"
    },
    "options": {
      "sizes": [
        { "name": "Tall", "price": 0 },
        { "name": "Grande", "price": 500 }
      ]
    },
    "createdAt": "2025-12-15T10:00:00Z"
  }
]
```

---

### 메뉴 상세 정보

**GET** `/api/menus/:id`

특정 메뉴의 상세 정보를 조회합니다.

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
      { "name": "Grande", "price": 500 },
      { "name": "Venti", "price": 1000 }
    ],
    "shots": [
      { "name": "1샷", "price": 0 },
      { "name": "2샷", "price": 500 }
    ]
  },
  "cafeId": {
    "_id": "cafe_id",
    "name": "스타벅스 강남점"
  }
}
```

---

## 주문 API

### 주문 생성

**POST** `/api/orders`

새로운 주문을 생성합니다.

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
        "size": "Grande",
        "shots": "2샷"
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
      "selectedOptions": {
        "size": "Grande"
      },
      "price": 10000
    }
  ],
  "totalAmount": 10000,
  "status": "pending",
  "paymentStatus": "paid",
  "paymentMethod": "card",
  "estimatedPickupTime": "2025-12-15T10:45:00Z",
  "createdAt": "2025-12-15T10:30:00Z"
}
```

**에러 응답: 400 Bad Request**
```json
{
  "message": "Menu item {menuId} is not available"
}
```

---

### 주문 목록 조회

**GET** `/api/orders`

현재 사용자의 주문 목록을 조회합니다.

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
      "name": "스타벅스 강남점",
      "address": "서울시 강남구 테헤란로 123"
    },
    "totalAmount": 10000,
    "status": "preparing",
    "createdAt": "2025-12-15T10:30:00Z"
  }
]
```

---

### 주문 상세 정보

**GET** `/api/orders/:id`

특정 주문의 상세 정보를 조회합니다.

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
      "price": 10000
    }
  ],
  "totalAmount": 10000,
  "status": "preparing",
  "paymentStatus": "paid",
  "estimatedPickupTime": "2025-12-15T10:45:00Z",
  "createdAt": "2025-12-15T10:30:00Z"
}
```

---

### 주문 취소

**PATCH** `/api/orders/:id/cancel`

주문을 취소합니다. (준비 완료 전에만 가능)

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

**에러 응답: 400 Bad Request**
```json
{
  "message": "Cannot cancel order that is ready or completed"
}
```

---

## 관리자 API

모든 관리자 API는 `merchant` 또는 `admin` 역할이 필요합니다.

### 주문 목록 조회 (관리자)

**GET** `/api/admin/orders`

관리자의 카페에 대한 모든 주문 목록을 조회합니다.

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
    "totalAmount": 10000,
    "status": "pending",
    "createdAt": "2025-12-15T10:30:00Z"
  }
]
```

---

### 주문 상태 업데이트

**PATCH** `/api/admin/orders/:id/status`

주문 상태를 업데이트합니다.

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

**가능한 상태 값:**
- `pending`: 대기 중
- `confirmed`: 확인됨
- `preparing`: 제작 중
- `ready`: 준비 완료
- `completed`: 완료
- `cancelled`: 취소됨

**Response: 200 OK**
```json
{
  "_id": "order_id",
  "status": "preparing",
  "updatedAt": "2025-12-15T10:35:00Z"
}
```

---

### 판매 통계 조회

**GET** `/api/admin/stats`

판매 통계를 조회합니다.

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

---

### 메뉴 목록 조회 (관리자)

**GET** `/api/admin/menus`

관리자의 카페 메뉴 목록을 조회합니다.

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

---

### 메뉴 생성

**POST** `/api/admin/menus`

새로운 메뉴를 생성합니다.

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

---

### 메뉴 수정

**PATCH** `/api/admin/menus/:id`

기존 메뉴를 수정합니다.

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

## 에러 응답

모든 API는 다음 형식의 에러 응답을 반환할 수 있습니다:

**401 Unauthorized**
```json
{
  "message": "No token, authorization denied"
}
```

**403 Forbidden**
```json
{
  "message": "Insufficient permissions"
}
```

**404 Not Found**
```json
{
  "message": "Resource not found"
}
```

**500 Internal Server Error**
```json
{
  "message": "Server error"
}
```

---

## 상태 코드

- `200 OK`: 성공
- `201 Created`: 리소스 생성 성공
- `400 Bad Request`: 잘못된 요청
- `401 Unauthorized`: 인증 필요
- `403 Forbidden`: 권한 없음
- `404 Not Found`: 리소스 없음
- `500 Internal Server Error`: 서버 오류

---

## 예제 코드

### JavaScript (Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// 로그인
const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  const token = response.data.token;
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  return response.data;
};

// 주문 생성
const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};
```

### cURL

```bash
# 로그인
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# 주문 생성 (토큰 필요)
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "cafeId": "cafe_id",
    "items": [{"menuId": "menu_id", "quantity": 1}],
    "paymentMethod": "card"
  }'
```

