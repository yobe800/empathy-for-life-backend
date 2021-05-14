const AWS = require('aws-sdk');

const { AWS_ACCESS_KEY_ID, AWS_SECRET_KEY, AWS_REGION } = process.env;

AWS.config.setPromisesDependency(require('bluebird'));
AWS.config.update({ accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_KEY, region: AWS_REGION });

module.exports = new AWS.S3();
