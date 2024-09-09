require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
  // 他の設定があれば追加
};
