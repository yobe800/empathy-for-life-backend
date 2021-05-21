const AWS = require("aws-sdk");

const { AWS_ACCESS_KEY_ID, AWS_SECRET_KEY, AWS_REGION, AWS_S3_BUCKET } = process.env;

AWS.config.setPromisesDependency(require("bluebird"));
AWS.config.update({ accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_KEY, region: AWS_REGION });

const s3 = new AWS.S3();

const uploadPhotoToS3 = async (fileKey = "", route = "", base64) => {
  const base64Data = new Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), "base64");
  const type = base64.split(";")[0].split("/")[1];

  const params = {
    Bucket: `${AWS_S3_BUCKET}/${route}`,
    Key: `${fileKey}${Date.now()}.${type}`,
    Body: base64Data,
    ACL: "public-read",
    ContentEncoding: "base64",
    ContentType: `image/${type}`,
  };

  const { Location: photoUrl, Key: photoKey } = await s3
    .upload(params)
    .promise();

  return { photoUrl, photoKey };
};

const deletePhotoFromS3 = async (photoKey) => {
  const params = {
    Bucket: AWS_S3_BUCKET,
    Key: photoKey,
  };
  try {
    return await s3.deleteObject(params).promise();
  } catch (err) {
    throw err;
  }
};

module.exports = {
  uploadPhotoToS3,
  deletePhotoFromS3,
};
