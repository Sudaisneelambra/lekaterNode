require('dotenv').config();
const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');

const myBucket = process.env.MYBUCKET;

const region = process.env.REGION;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: myBucket,
    metadata: function(req, file, cb) {
      cb(null, {fieldName: file.originalname});
    },
    key: function(req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname);
    },
    limits: { fileSize: 10 * 1024 * 1024 }
  }),
});

module.exports=upload;
