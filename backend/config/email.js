import nodemailer from 'nodemailer';

// Create email transporter (using environment variables)
// For development, you can use services like Mailtrap, SendGrid, or Gmail
const createTransporter = () => {
  // Check if we have email configuration
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT) {
    console.warn('⚠️  Email configuration not set. Password reset emails will not be sent.');
    console.warn('📝 Please configure EMAIL_HOST and EMAIL_PORT in .env file');
    return null;
  }

  console.log('📧 Email Configuration:');
  console.log(`   Host: ${process.env.EMAIL_HOST}`);
  console.log(`   Port: ${process.env.EMAIL_PORT}`);
  console.log(`   Secure: ${process.env.EMAIL_SECURE}`);
  console.log(`   User: ${process.env.EMAIL_USER}`);

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

export const sendResetPasswordEmail = async (email, resetToken, resetUrl) => {
  console.log(`\n🔄 Attempting to send password reset email to: ${email}`);
  
  const transporter = createTransporter();
  
  if (!transporter) {
    console.warn(`⚠️  Email service not configured. Reset URL: ${resetUrl}`);
    return true; // In development, just log the reset URL
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request for PocketKash',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hi there,</p>
        <p>We received a request to reset your password. Click the link below to create a new password:</p>
        <p style="margin: 20px 0;">
          <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
            Reset Your Password
          </a>
        </p>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p style="color: #999; font-size: 12px;">This link will expire in 30 minutes.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        <p style="color: #999; font-size: 12px;">PocketKash Team</p>
      </div>
    `,
  };

  try {
    console.log('📬 Sending email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   To: ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    console.error('   Code:', error.code);
    console.error('   Details:', error.response);
    
    // Provide helpful debugging info
    if (error.message.includes('Invalid login')) {
      console.error('💡 Hint: Check your EMAIL_USER and EMAIL_PASSWORD in .env');
      console.error('   For Gmail: Make sure you\'re using an App Password, not your regular password');
      console.error('   App Password must be 16 characters with spaces');
    }
    if (error.message.includes('connect')) {
      console.error('💡 Hint: Check EMAIL_HOST and EMAIL_PORT');
      console.error(`   Gmail SMTP: Host=smtp.gmail.com, Port=587, Secure=false`);
    }
    
    return false;
  }
};

export default { sendResetPasswordEmail };
