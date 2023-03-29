const AWS = require('aws-sdk');
const Jimp = require('jimp');

// configure AWS SDK
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const thumbnailBucket = process.env.THUMBNAIL_BUCKET;

exports.handler = async (event, context, callback) => {
  console.log('event', event)
  // get the S3 bucket and key values from the event
  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;

  try {
    // download the image file from S3
    const image = await s3.getObject({ Bucket: bucket, Key: key }).promise();
    console.log('image', image)

    // create thumbnail using jimp module
    const thumbnail = await Jimp.read(image.Body);
    thumbnail.resize(200, 200);

    // convert the thumbnail to a buffer
    const resizedImage = await thumbnail.getBufferAsync(Jimp.AUTO);
    
    // upload the thumbnail image to a different bucket
    const res = await s3.putObject({
      Bucket: thumbnailBucket,
      Key: key,
      Body: resizedImage,
      ContentType: image.ContentType
    }).promise();

    callback(null, 'Thumbnail created successfully');
  } catch (err) {
    console.log('error', err);
    callback(err);
  }
};