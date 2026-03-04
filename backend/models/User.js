import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username must not exceed 30 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    profile: {
      name: String,
      age: Number,
      role: {
        type: String,
        enum: ['studying', 'working', 'both'],
        default: 'studying',
      },
      hasIncome: {
        type: Boolean,
        default: false,
      },
      monthlyAllowance: {
        type: Number,
        default: 0,
      },
      salary: {
        type: Number,
        default: 0,
      },
      sideIncome: {
        type: Number,
        default: 0,
      },
      spendingFrequency: {
        type: String,
        enum: ['rarely', 'sometimes', 'often', 'always'],
        default: 'sometimes',
      },
      plansBeforeSpending: {
        type: Boolean,
        default: false,
      },
      topSpendingCategory: {
        type: String,
        default: 'food',
      },
      dailyLimit: {
        type: Number,
        default: 0,
      },
      weeklyLimit: {
        type: Number,
        default: 0,
      },
      monthlyLimit: {
        type: Number,
        default: 0,
      },
      routineExpenses: [
        {
          id: String,
          name: String,
          amount: Number,
          category: String,
        },
      ],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate password reset token
userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(32).toString('hex');
  // Hash and save to database
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  // Set token expiry time (30 minutes)
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);

export default User;
