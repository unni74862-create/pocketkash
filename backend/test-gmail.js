#!/usr/bin/env node

/**
 * Test Gmail Configuration
 * Quick test to verify your Gmail setup is working
 */

import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

async function testGmail() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║           Testing Gmail Configuration                      ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Check environment variables
  console.log('📋 Checking environment variables...\n');

  const requiredVars = [
    'EMAIL_HOST',
    'EMAIL_PORT',
    'EMAIL_SECURE',
    'EMAIL_USER',
    'EMAIL_PASSWORD',
    'EMAIL_FROM'
  ];

  let allSet = true;
  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (!value) {
      console.log(`❌ ${varName}: NOT SET`);
      allSet = false;
    } else {
      const display = varName === 'EMAIL_PASSWORD' 
        ? '****' + value.slice(-4)
        : value;
      console.log(`✅ ${varName}: ${display}`);
    }
  }

  if (!allSet) {
    console.log('\n❌ Some environment variables are missing!');
    console.log('Please update your .env file with Gmail credentials.\n');
    process.exit(1);
  }

  console.log('\n🔌 Attempting to connect to Gmail SMTP server...\n');

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    // Verify SMTP connection
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');

    // Test sending email
    console.log('📧 Attempting to send test email...\n');
    
    const testEmail = process.env.EMAIL_USER; // Send to self
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: testEmail,
      subject: 'PocketKash - Email Configuration Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Configuration Test</h2>
          <p>Hi,</p>
          <p>This is a test email to verify that your Gmail configuration is working correctly for PocketKash password reset feature.</p>
          <p style="margin: 20px 0;">
            <strong>✅ Configuration Status: SUCCESS</strong>
          </p>
          <p>You can now use the "Forgot Password" feature in PocketKash and receive password reset links at this email address.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">PocketKash Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Test email sent successfully!\n');
    console.log(`📨 Details:`);
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   To: ${testEmail}`);
    console.log(`   From: ${process.env.EMAIL_FROM}\n`);

    console.log('✨ Gmail is now configured for password reset emails!\n');
    console.log('🚀 You can now:');
    console.log('   1. Start your backend server: npm run dev');
    console.log('   2. Go to http://localhost:5173/auth');
    console.log('   3. Click "Forgot Password?"');
    console.log('   4. Enter your email to receive password reset link\n');

  } catch (error) {
    console.log('❌ Error connecting to Gmail:\n');
    console.log(`Error: ${error.message}\n`);

    if (error.message.includes('Invalid login')) {
      console.log('💡 Possible causes:');
      console.log('   1. EMAIL_PASSWORD is incorrect (use App Password, not regular password)');
      console.log('   2. You haven\'t enabled 2-Step Verification');
      console.log('   3. Email address is incorrect\n');
      console.log('📝 Steps to fix:');
      console.log('   1. Go to https://myaccount.google.com/security');
      console.log('   2. Enable 2-Step Verification if not already enabled');
      console.log('   3. Go to https://myaccount.google.com/apppasswords');
      console.log('   4. Generate a new App Password');
      console.log('   5. Update EMAIL_PASSWORD in .env with the new password\n');
    } else if (error.message.includes('connect')) {
      console.log('💡 Possible causes:');
      console.log('   1. EMAIL_HOST is incorrect');
      console.log('   2. EMAIL_PORT is incorrect');
      console.log('   3. Network/firewall is blocking the connection\n');
      console.log('📝 For Gmail, use:');
      console.log('   EMAIL_HOST=smtp.gmail.com');
      console.log('   EMAIL_PORT=587');
      console.log('   EMAIL_SECURE=false\n');
    }

    console.log('For more help, check: https://myaccount.google.com/apppasswords\n');
    process.exit(1);
  }
}

testGmail().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
