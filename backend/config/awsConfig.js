const AWS = require('aws-sdk');

// AWS SDK configuration
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Load from environment variables
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Load from environment variables
  region: 'us-east-1', // Use your region here
});

module.exports = AWS;
