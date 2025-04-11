"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const uuid_1 = require("uuid");
class S3Service {
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
            this.s3Client = new client_s3_1.S3Client({
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
        }
        catch (error) {
            console.error('Error initializing S3Service:', error);
        }
    }
    /**
     * Check if S3 service is properly initialized
     */
    static isInitialized() {
        return this.initialized;
    }
    static generateUploadUrl(fileType) {
        return __awaiter(this, void 0, void 0, function* () {
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
                }
                else if (extension === 'png') {
                    extension = 'png';
                }
                else if (extension === 'gif') {
                    extension = 'gif';
                }
                else if (extension === 'svg+xml') {
                    extension = 'svg';
                }
                else {
                    // Default to jpg for unknown types
                    extension = 'jpg';
                }
                const key = `books/${(0, uuid_1.v4)()}.${extension}`;
                // Create the S3 command with appropriate settings
                const command = new client_s3_1.PutObjectCommand({
                    Bucket: this.bucket,
                    Key: key,
                    ContentType: fileType,
                });
                // Generate the signed URL with longer expiration
                const uploadUrl = yield (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, {
                    expiresIn: 3600, // 1 hour
                });
                console.log(`Generated upload URL for key: ${key}, type: ${fileType}`);
                return {
                    uploadUrl,
                    key,
                };
            }
            catch (error) {
                console.error('Error generating S3 upload URL:', error);
                throw new Error('Error generating upload URL');
            }
        });
    }
    static getImageUrl(key) {
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
exports.S3Service = S3Service;
S3Service.initialized = false;
