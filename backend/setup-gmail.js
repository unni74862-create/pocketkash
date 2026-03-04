#!/usr/bin/env node

/**
 * Gmail Setup Helper for PocketKash Password Reset
 * This script helps you configure Gmail for sending password reset emails
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
};

async function setupGmail() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║     Gmail Setup for PocketKash Password Reset Feature     ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log('📋 Step 1: Create a Gmail App Password\n');
  console.log('Follow these steps:');
  console.log('1. Go to: https://myaccount.google.com/security');
  console.log('2. Enable "2-Step Verification" if not already enabled');
  console.log('3. Go to: https://myaccount.google.com/apppasswords');
  console.log('4. Select "Mail" and "Windows Computer"');
  console.log('5. Click "Generate"');
  console.log('6. Copy the 16-character password (with spaces)\n');

  console.log('📧 Step 2: Enter Your Gmail Credentials\n');

  const email = await question('Enter your Gmail address (e.g., yourname@gmail.com): ');
  const appPassword = await question('Enter your 16-character App Password (with spaces): ');

  if (!email.includes('@gmail.com')) {
    console.log('\n❌ Error: Please use a Gmail address (@gmail.com)');
    rl.close();
    process.exit(1);
  }

  if (appPassword.length < 15) {
    console.log('\n❌ Error: App Password should be 16 characters with spaces');
    rl.close();
    process.exit(1);
  }

  console.log('\n✅ Updating backend/.env file...\n');

  // Read current .env
  const envPath = path.join(__dirname, '.env');
  let envContent = fs.readFileSync(envPath, 'utf-8');

  // Update email configuration
  const newEnvContent = envContent
    .replace(/EMAIL_USER=.*/g, `EMAIL_USER=${email}`)
    .replace(/EMAIL_PASSWORD=.*/g, `EMAIL_PASSWORD=${appPassword}`)
    .replace(/EMAIL_FROM=.*/g, `EMAIL_FROM=${email}`);

  fs.writeFileSync(envPath, newEnvContent);

  console.log('📝 Updated in .env:');
  console.log(`   EMAIL_USER=${email}`);
  console.log(`   EMAIL_PASSWORD=****${appPassword.slice(-4)}`);
  console.log(`   EMAIL_FROM=${email}`);

  console.log('\n✨ Setup Complete!\n');
  console.log('Next steps:');
  console.log('1. Restart your backend server: npm run dev');
  console.log('2. Go to http://localhost:5173/auth');
  console.log('3. Click "Forgot Password?"');
  console.log('4. Enter your email address');
  console.log('5. Check your Gmail inbox for the reset link\n');

  console.log('💡 Tips:');
  console.log('   - Check your Spam/Promotions folder if email doesn\'t arrive');
  console.log('   - Watch backend console for email sending logs');
  console.log('   - If error appears, check your App Password is entered correctly\n');

  rl.close();
}

setupGmail().catch((error) => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
});
