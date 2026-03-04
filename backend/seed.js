import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Seed test users
    const testUsers = [
      {
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123',
      },
      {
        username: 'janedoe',
        email: 'jane@example.com',
        password: 'password456',
      },
      {
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpass789',
      },
      {
        username: 'demouser',
        email: 'demo@example.com',
        password: 'demo12345',
      },
    ];

    const createdUsers = await User.insertMany(testUsers);
    console.log(`Successfully seeded ${createdUsers.length} users`);

    // Display seeded users (without passwords)
    const users = await User.find().select('-password');
    console.log('\nSeeded Users:');
    users.forEach((user) => {
      console.log(
        `- Username: ${user.username}, Email: ${user.email}, ID: ${user._id}`
      );
    });

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
