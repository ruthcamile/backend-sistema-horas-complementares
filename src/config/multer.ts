import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import path from 'path';

const s3Config = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
  endpoint: process.env.AWS_S3_ENDPOINT as string, 
  forcePathStyle: true, 
});

export const upload = multer({
  storage: multerS3({
    s3: s3Config,
    bucket: process.env.AWS_S3_BUCKET as string,
    
    key: function (req: any, file: any, cb: any) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const extension = path.extname(file.originalname);
      cb(null, `certificados/${file.fieldname}-${uniqueSuffix}${extension}`);
    },
  }),
});

export default upload;