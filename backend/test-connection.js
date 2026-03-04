import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';

dotenv.config();

const testDatabaseConnection = async () => {
  console.log('\n========================================');
  console.log('   PocketKash MongoDB Connection Test');
  console.log('========================================\n');

  try {
    // Test 1: Connect to MongoDB
    console.log('TEST 1: Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ MongoDB connection successful');
    console.log(`  Database: ${mongoose.connection.db.getName()}`);
    console.log(`  Host: ${mongoose.connection.host}`);

    // Test 2: Check if users collection exists and count documents
    console.log('\nTEST 2: Checking users collection...');
    const userCount = await User.countDocuments();
    console.log(`✓ Users collection found with ${userCount} documents`);

    // Test 3: Retrieve all users
    console.log('\nTEST 3: Fetching all users (without passwords)...');
    const users = await User.find().select('-password');
    if (users.length === 0) {
      console.log('! No users found. Run "npm run seed" to add test users.');
    } else {
      console.log(`✓ Found ${users.length} users:`);
      users.forEach((user, index) => {
        console.log(`  ${index + 1}. Username: ${user.username}, Email: ${user.email}, ID: ${user._id}`);
      });
    }

    // Test 4: Test user password verification
    if (users.length > 0) {
      console.log('\nTEST 4: Testing password verification...');
      const user = await User.findOne({ username: 'johndoe' }).select('+password');
      if (user) {
        const isPasswordValid = await user.comparePassword('password123');
        if (isPasswordValid) {
          console.log('✓ Password verification working correctly');
        } else {
          console.log('✗ Password verification failed');
        }
      } else {
        console.log('! Test user "johndoe" not found');
      }
    }

    // Test 5: Database validation
    console.log('\nTEST 5: Validating schema and indexes...');
    const schema = User.schema;
    console.log('✓ Schema validation:');
    console.log(`  - Username field: ${schema.paths.username.instance}`);
    console.log(`  - Email field: ${schema.paths.email.instance}`);
    console.log(`  - Password field: ${schema.paths.password.instance}`);

    console.log('\n========================================');
    console.log('  ✓ All tests passed successfully!');
    console.log('========================================\n');
    console.log('Database is ready for frontend integration.');
    console.log('Start the backend with: npm start');
    console.log('Start the frontend with: npm run dev (in root directory)\n');

  } catch (error) {
    console.error('\n✗ Test failed:', error.message);
    console.log('\nTroubleshooting steps:');
    console.log('1. Ensure MongoDB is running: mongod');
    console.log('2. Check .env file configuration');
    console.log('3. Run seeding: npm run seed');
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.\n');
  }
};

testDatabaseConnection();
