# 데이터베이스 스키마

OrderBean 프로젝트의 MongoDB 데이터베이스 스키마 문서입니다.

## 데이터베이스 정보

- **데이터베이스명**: `orderbean`
- **ODM**: Mongoose
- **버전**: MongoDB 5.0+

## ERD (Entity Relationship Diagram)

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
                  │            │ 1:N     │
                  │            │         │
                  │     ┌──────▼──────┐  │
                  │     │    Menus    │  │
                  │     ├─────────────┤  │
                  │     │ _id         │  │
                  │     │ name        │  │
                  │     │ price       │  │
                  │     │ cafeId      │──┘
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
         │ totalAmount            │  │
         │ status                 │  │
         └────────────────────────┘  │
                  │                 │
                  │ N:1             │
                  │                 │
         ┌────────┴─────────────────┘
         │
         └── Users (customerId)
```

## 컬렉션 상세

### Users (사용자)

사용자 정보를 저장하는 컬렉션입니다.

**스키마:**
```javascript
{
  _id: ObjectId,
  name: String (required, trim),
  email: String (required, unique, lowercase, trim),
  password: String (required, minlength: 6, hashed),
  phone: String (optional, trim),
  role: String (enum: ['customer', 'merchant', 'admin'], default: 'customer'),
  favoriteMenus: [ObjectId] (ref: 'Menu'),
  createdAt: Date (default: Date.now)
}
```

**인덱스:**
- `email`: unique index

**예시:**
```json
{
  "_id": ObjectId("..."),
  "name": "홍길동",
  "email": "user@example.com",
  "password": "$2a$10$...",
  "phone": "010-1234-5678",
  "role": "customer",
  "favoriteMenus": [],
  "createdAt": ISODate("2025-12-15T10:00:00Z")
}
```

---

### Cafes (카페)

카페 정보를 저장하는 컬렉션입니다.

**스키마:**
```javascript
{
  _id: ObjectId,
  name: String (required, trim),
  address: String (required),
  location: {
    latitude: Number (required),
    longitude: Number (required)
  },
  phone: String (optional, trim),
  operatingHours: {
    open: String (default: '08:00'),
    close: String (default: '22:00'),
    days: [String] (enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'])
  },
  isOpen: Boolean (default: true),
  congestionLevel: String (enum: ['low', 'medium', 'high'], default: 'low'),
  merchantId: ObjectId (required, ref: 'User'),
  image: String (optional, default: ''),
  createdAt: Date (default: Date.now)
}
```

**인덱스:**
- `merchantId`: index
- `location`: 2dsphere index (향후)

**예시:**
```json
{
  "_id": ObjectId("..."),
  "name": "스타벅스 강남점",
  "address": "서울시 강남구 테헤란로 123",
  "location": {
    "latitude": 37.4979,
    "longitude": 127.0276
  },
  "phone": "02-1234-5678",
  "operatingHours": {
    "open": "07:00",
    "close": "23:00",
    "days": ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
  },
  "isOpen": true,
  "congestionLevel": "medium",
  "merchantId": ObjectId("..."),
  "image": "",
  "createdAt": ISODate("2025-12-15T10:00:00Z")
}
```

---

### Menus (메뉴)

메뉴 정보를 저장하는 컬렉션입니다.

**스키마:**
```javascript
{
  _id: ObjectId,
  name: String (required, trim),
  description: String (optional, default: ''),
  category: String (enum: ['coffee', 'tea', 'beverage', 'dessert', 'food'], required),
  price: Number (required, min: 0),
  image: String (optional, default: ''),
  isAvailable: Boolean (default: true),
  options: {
    sizes: [{ name: String, price: Number }],
    shots: [{ name: String, price: Number }],
    syrups: [{ name: String, price: Number }],
    milk: [{ name: String, price: Number }],
    ice: [{ name: String, price: Number }]
  },
  cafeId: ObjectId (required, ref: 'Cafe'),
  createdAt: Date (default: Date.now)
}
```

**인덱스:**
- `cafeId`: index
- `category`: index
- `isAvailable`: index

**예시:**
```json
{
  "_id": ObjectId("..."),
  "name": "아메리카노",
  "description": "진한 에스프레소에 물을 더한 깔끔한 커피",
  "category": "coffee",
  "price": 4500,
  "image": "",
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
  "cafeId": ObjectId("..."),
  "createdAt": ISODate("2025-12-15T10:00:00Z")
}
```

---

### Orders (주문)

주문 정보를 저장하는 컬렉션입니다.

**스키마:**
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
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

**인덱스:**
- `customerId`: index
- `cafeId`: index
- `status`: index
- `createdAt`: index (descending)

**예시:**
```json
{
  "_id": ObjectId("..."),
  "customerId": ObjectId("..."),
  "cafeId": ObjectId("..."),
  "items": [
    {
      "menuId": ObjectId("..."),
      "quantity": 2,
      "selectedOptions": {
        "size": "Grande",
        "shots": "2샷"
      },
      "price": 10000
    }
  ],
  "totalAmount": 10000,
  "status": "pending",
  "paymentStatus": "paid",
  "paymentMethod": "card",
  "estimatedPickupTime": ISODate("2025-12-15T10:45:00Z"),
  "createdAt": ISODate("2025-12-15T10:30:00Z"),
  "updatedAt": ISODate("2025-12-15T10:30:00Z")
}
```

## 관계 (Relationships)

### 1:N 관계

- **User → Cafe**: 한 사용자(merchant)가 여러 카페를 운영할 수 있음
- **Cafe → Menu**: 한 카페가 여러 메뉴를 가질 수 있음
- **User → Order**: 한 사용자가 여러 주문을 할 수 있음
- **Cafe → Order**: 한 카페가 여러 주문을 받을 수 있음

### 참조 (References)

- `Cafe.merchantId` → `User._id`
- `Menu.cafeId` → `Cafe._id`
- `Order.customerId` → `User._id`
- `Order.cafeId` → `Cafe._id`
- `Order.items[].menuId` → `Menu._id`
- `User.favoriteMenus[]` → `Menu._id`

## 데이터 무결성

### 제약 조건

1. **이메일 중복 방지**: `Users.email`에 unique index
2. **참조 무결성**: Mongoose의 `ref`를 통한 참조 검증
3. **필수 필드**: `required: true`로 필수 필드 보장
4. **열거형 값**: `enum`으로 허용된 값만 저장

### 검증

- **이메일 형식**: Mongoose의 이메일 검증
- **비밀번호 길이**: 최소 6자
- **가격**: 0 이상의 숫자
- **수량**: 1 이상의 숫자

## 인덱스 전략

### 성능 최적화를 위한 인덱스

1. **Users**
   - `email`: unique index (로그인 조회 최적화)

2. **Cafes**
   - `merchantId`: index (관리자별 카페 조회)
   - `isOpen`: index (영업 중인 카페 필터링)

3. **Menus**
   - `cafeId`: index (카페별 메뉴 조회)
   - `category`: index (카테고리별 필터링)
   - `isAvailable`: index (재고 확인)

4. **Orders**
   - `customerId`: index (사용자별 주문 조회)
   - `cafeId`: index (카페별 주문 조회)
   - `status`: index (상태별 필터링)
   - `createdAt`: descending index (최신순 정렬)

## 쿼리 예제

### 사용자별 주문 조회

```javascript
Order.find({ customerId: userId })
  .populate('cafeId', 'name address')
  .populate('items.menuId', 'name price')
  .sort({ createdAt: -1 });
```

### 카페별 메뉴 조회

```javascript
Menu.find({ cafeId: cafeId, isAvailable: true })
  .populate('cafeId', 'name');
```

### 위치 기반 카페 검색 (향후)

```javascript
Cafe.find({
  location: {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      $maxDistance: 5000 // 5km
    }
  },
  isOpen: true
});
```

## 마이그레이션

### 초기 데이터 시드

```bash
cd backend
node scripts/seed.js
```

이 스크립트는 다음을 생성합니다:
- 테스트 사용자 2명 (고객, 매장 관리자)
- 테스트 카페 2개
- 테스트 메뉴 여러 개

## 백업 및 복구

### 백업

```bash
mongodump --db=orderbean --out=/backup/path
```

### 복구

```bash
mongorestore --db=orderbean /backup/path/orderbean
```

## 모니터링

### 쿼리 성능 확인

```javascript
// 느린 쿼리 로깅 활성화
mongoose.set('debug', true);
```

### 인덱스 사용 확인

```javascript
// explain() 사용
Order.find({ customerId: userId }).explain('executionStats');
```

## 향후 개선 사항

- [ ] 2dsphere 인덱스 추가 (위치 기반 검색)
- [ ] 복합 인덱스 추가 (자주 함께 조회되는 필드)
- [ ] TTL 인덱스 (오래된 주문 자동 삭제)
- [ ] 샤딩 전략 (대규모 데이터 처리)

