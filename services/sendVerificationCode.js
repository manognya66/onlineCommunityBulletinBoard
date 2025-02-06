const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid'); // Generate unique verification code
const moment = require('moment'); // For handling timestamps

// Set up AWS SES
AWS.config.update({
  region: 'us-east-1', // Use your desired AWS region
});

const ses = new AWS.SES(); // SES instance for sending emails

// Store verification codes in memory (You can use a database in production)
let verificationStore = {}; // This will store the code and timestamp by email

// Send verification code via SES
const sendVerificationCode = async (email) => {
  // Generate a 6-digit verification code using uuid (first part of uuidv4)
  const verificationCode = uuidv4().split('-')[0].slice(0, 6); // Using part of UUID to generate a 6-digit code

  // Set expiry timestamp (1 minute from now)
  const expiryTime = moment().add(1, 'minute').toISOString(); // 1 minute expiry

  // Store the code and expiry time in memory
  verificationStore[email] = {
    code: verificationCode,
    expiry: expiryTime,
  };

  const params = {
    Source: 'your-email@example.com', // Your verified SES email address
    Destination: {
      ToAddresses: [email], // Recipient's email
    },
    Message: {
      Subject: {
        Data: 'Your Verification Code', // Subject of the email
      },
      Body: {
        Text: {
          Data: `Your verification code is: ${verificationCode}`, // The verification code message
        },
      },
    },
  };

  try {
    // Send the email via SES
    const result = await ses.sendEmail(params).promise();
    console.log('Verification code sent:', result);
    return verificationCode; // Return the verification code for further use
  } catch (error) {
    console.error('Error sending verification code:', error);
    throw new Error('Failed to send verification code');
  }
};

// Verify the entered verification code
const verifyCode = async (email, enteredCode) => {
  // Check if the email exists in our store
  if (!verificationStore[email]) {
    throw new Error('Verification code not found for this email');
  }

  const { code, expiry } = verificationStore[email];

  // Check if the verification code has expired
  const isExpired = moment().isAfter(expiry);
  if (isExpired) {
    throw new Error('Verification code has expired');
  }

  // Check if the entered code matches the stored code
  if (enteredCode !== code.toString()) {
    throw new Error('Invalid verification code');
  }

  console.log('Verification successful');
  return true; // Code is correct and not expired
};

module.exports = { sendVerificationCode, verifyCode };
