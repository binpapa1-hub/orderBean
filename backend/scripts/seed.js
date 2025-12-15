const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Cafe = require('../models/Cafe');
const Menu = require('../models/Menu');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/orderbean');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Cafe.deleteMany({});
    await Menu.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create sample users
    const customer = new User({
      name: '테스트 고객',
      email: 'customer@test.com',
      password: 'password123',
      phone: '010-1234-5678',
      role: 'customer'
    });
    await customer.save();

    const merchant = new User({
      name: '카페 관리자',
      email: 'merchant@test.com',
      password: 'password123',
      phone: '010-9876-5432',
      role: 'merchant'
    });
    await merchant.save();

    console.log('✅ Created sample users');

    // Create sample cafes
    const cafe1 = new Cafe({
      name: '스타벅스 강남점',
      address: '서울시 강남구 테헤란로 123',
      location: {
        latitude: 37.4979,
        longitude: 127.0276
      },
      phone: '02-1234-5678',
      operatingHours: {
        open: '07:00',
        close: '23:00',
        days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
      },
      isOpen: true,
      congestionLevel: 'medium',
      merchantId: merchant._id
    });
    await cafe1.save();

    const cafe2 = new Cafe({
      name: '이디야커피 홍대점',
      address: '서울시 마포구 홍익로 456',
      location: {
        latitude: 37.5563,
        longitude: 126.9236
      },
      phone: '02-2345-6789',
      operatingHours: {
        open: '08:00',
        close: '22:00',
        days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
      },
      isOpen: true,
      congestionLevel: 'low',
      merchantId: merchant._id
    });
    await cafe2.save();

    console.log('✅ Created sample cafes');

    // Create sample menus
    const menus = [
      {
        name: '아메리카노',
        description: '진한 에스프레소에 물을 더한 깔끔한 커피',
        category: 'coffee',
        price: 4500,
        cafeId: cafe1._id,
        options: {
          sizes: [
            { name: 'Tall', price: 0 },
            { name: 'Grande', price: 500 },
            { name: 'Venti', price: 1000 }
          ],
          shots: [
            { name: '1샷', price: 0 },
            { name: '2샷', price: 500 },
            { name: '3샷', price: 1000 }
          ]
        }
      },
      {
        name: '카페라떼',
        description: '부드러운 우유와 에스프레소의 조화',
        category: 'coffee',
        price: 5000,
        cafeId: cafe1._id,
        options: {
          sizes: [
            { name: 'Tall', price: 0 },
            { name: 'Grande', price: 500 },
            { name: 'Venti', price: 1000 }
          ],
          milk: [
            { name: '일반 우유', price: 0 },
            { name: '저지방 우유', price: 0 },
            { name: '두유', price: 500 },
            { name: '오트밀크', price: 500 }
          ]
        }
      },
      {
        name: '카푸치노',
        description: '에스프레소에 우유 거품을 올린 커피',
        category: 'coffee',
        price: 5000,
        cafeId: cafe1._id
      },
      {
        name: '아메리카노',
        description: '진한 에스프레소에 물을 더한 깔끔한 커피',
        category: 'coffee',
        price: 4000,
        cafeId: cafe2._id
      },
      {
        name: '카페라떼',
        description: '부드러운 우유와 에스프레소의 조화',
        category: 'coffee',
        price: 4500,
        cafeId: cafe2._id
      },
      {
        name: '녹차라떼',
        description: '고소한 녹차와 우유의 만남',
        category: 'tea',
        price: 5000,
        cafeId: cafe2._id
      },
      {
        name: '초콜릿 케이크',
        description: '진한 초콜릿의 달콤함',
        category: 'dessert',
        price: 6000,
        cafeId: cafe1._id
      }
    ];

    for (const menuData of menus) {
      const menu = new Menu(menuData);
      await menu.save();
    }

    console.log('✅ Created sample menus');
    console.log('\n📝 Sample Accounts:');
    console.log('Customer: customer@test.com / password123');
    console.log('Merchant: merchant@test.com / password123');
    console.log('\n✅ Seed data created successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

