import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

export class S3Service {
  private static s3Client: S3Client;
  private static bucket: string;
  private static region: string;
  private static initialized = false;

  static initialize() {
    try {
      const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
      const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
      const region = process.env.AWS_REGION || 'us-east-1';
      const bucket = process.env.AWS_BUCKET_NAME;

      // Validate required environment variables
      if (!accessKeyId || !secretAccessKey || !bucket) {
        console.error('Missing required S3 configuration: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_NAME must be set');
        return;
      }

      this.s3Client = new S3Client({
        region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
      
      this.bucket = bucket;
      this.region = region;
      this.initialized = true;
      
      console.log(`S3Service initialized successfully. Bucket: ${this.bucket}, Region: ${this.region}`);
    } catch (error) {
      console.error('Error initializing S3Service:', error);
    }
  }
  
  /**
   * Check if S3 service is properly initialized
   */
  static isInitialized(): boolean {
    return this.initialized;
  }

  static async generateUploadUrl(fileType: string): Promise<{ uploadUrl: string; key: string }> {
    // Check if service is initialized
    if (!this.initialized) {
      console.error('S3Service not initialized properly');
      throw new Error('S3 service not initialized');
    }
    
    try {
      // Validate file type
      if (!fileType || !fileType.includes('/')) {
        throw new Error('Invalid file type format');
      }
      
      // Generate unique file key with valid extension
      const fileTypeComponents = fileType.split('/');
      let extension = fileTypeComponents[1];
      
      // Normalize common image extensions
      if (extension === 'jpeg' || extension === 'jpg') {
        extension = 'jpg';
      } else if (extension === 'png') {
        extension = 'png';
      } else if (extension === 'gif') {
        extension = 'gif';
      } else if (extension === 'svg+xml') {
        extension = 'svg';
      } else {
        // Default to jpg for unknown types
        extension = 'jpg';
      }
      
      const key = `books/${uuidv4()}.${extension}`;
      
      // Create the S3 command with appropriate settings
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: fileType,
      });

      // Generate the signed URL with longer expiration
      const uploadUrl = await getSignedUrl(this.s3Client, command, { 
        expiresIn: 3600, // 1 hour
      });
      
      console.log(`Generated upload URL for key: ${key}, type: ${fileType}`);
      
      return {
        uploadUrl,
        key,
      };
    } catch (error) {
      console.error('Error generating S3 upload URL:', error);
      throw new Error('Error generating upload URL');
    }
  }

  static getImageUrl(key: string): string {
    if (!this.initialized) {
      console.error('S3Service not initialized properly');
      throw new Error('S3 service not initialized');
    }
    
    if (!key) {
      throw new Error('Invalid image key');
    }
    
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }
} 