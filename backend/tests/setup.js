const mongoose = require('mongoose');
require('dotenv').config();

// Use test database
const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/orderbean_test';

beforeAll(async () => {
  jest.setTimeout(30000); // 30초 타임아웃
  try {
    await mongoose.connect(TEST_MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10초 내 연결 실패 시 에러
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB connected for tests');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('Please make sure MongoDB is running on', TEST_MONGODB_URI);
    console.error('You can start MongoDB with: mongod');
    throw error;
  }
}, 30000);

afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      try {
        await collections[key].deleteMany({});
      } catch (error) {
        // Collection might not exist, ignore
      }
    }
  }
});

afterAll(async () => {
  jest.setTimeout(30000);
  if (mongoose.connection.readyState === 1) {
    try {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
    }
  }
}, 30000);

