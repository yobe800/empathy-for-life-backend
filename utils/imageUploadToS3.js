const s3 = require("../aws/s3");

const imageUploadToS3 = async (fileKey = "", route = "", base64) => {
  const base64Data = new Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
  const type = base64.split(';')[0].split('/')[1];
  const s3Bucket = process.env.AWS_S3_BUCKET;

  const params = {
    Bucket: `${s3Bucket}/${route}`,
    Key: `${fileKey}.${Date.now()}`,
    Body: base64Data,
    ACL: 'public-read',
    ContentEncoding: 'base64',
    ContentType: `image/${type}`,
  }

  const { Location } = await s3
    .upload(params)
    .promise();

  return Location;

  // To delete, see: https://gist.github.com/SylarRuby/b3b1430ca633bc5ffec29bbcdac2bd52
}

module.exports = imageUploadToS3;
