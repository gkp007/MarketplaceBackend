import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import "dotenv/config";
import s3Client from "../config/awsConfig";

const bucketName = process.env.AWS_BUCKET_NAME!;

// Generate a pre-signed PUT URL
export const getPresignedPutUrl = async (
  key: string,
  contentType: string,
  expiresIn = 300
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return { success: true, url: signedUrl };
  } catch (error) {
    console.error("Error generating pre-signed PUT URL:", error);
    return { success: false, error: "Failed to generate pre-signed PUT URL" };
  }
};

// Generate a pre-signed GET URL
export const getPresignedGetUrl = async (
  key: string,
  expiresIn = 300
): Promise<string> => {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error("Error generating pre-signed GET URL:", error);
    throw new Error("Failed to generate pre-signed GET URL");
  }
};
