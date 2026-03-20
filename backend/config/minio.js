import * as Minio from 'minio';

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT) || 9000,
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'inkdapper';
const MINIO_REGION = process.env.MINIO_REGION || 'us-east-1';

const connectMinio = async () => {
  try {
    const bucketExists = await minioClient.bucketExists(BUCKET_NAME);

    if (!bucketExists) {
      await minioClient.makeBucket(BUCKET_NAME, MINIO_REGION);
      console.log(`MinIO: Bucket '${BUCKET_NAME}' created in region '${MINIO_REGION}'`);

      // Set public read policy so image URLs are accessible without auth
      const publicPolicy = JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
          },
        ],
      });

      await minioClient.setBucketPolicy(BUCKET_NAME, publicPolicy);
      console.log(`MinIO: Public read policy applied to '${BUCKET_NAME}'`);
    } else {
      console.log(`MinIO: Connected — bucket '${BUCKET_NAME}' is ready`);
    }
  } catch (error) {
    console.error('MinIO connection failed:', error.message);
    console.warn('Server will continue without MinIO — uploads will fail until MinIO is reachable.');
  }
};

export { minioClient, BUCKET_NAME, connectMinio };
