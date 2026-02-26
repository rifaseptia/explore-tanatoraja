import { v2 as cloudinary } from 'cloudinary';

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('Cloudinary environment variables are missing!');
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export default cloudinary;

export async function uploadToCloudinary(
    fileUri: string,
    fileName: string
): Promise<{ url: string; public_id: string }> {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            fileUri,
            {
                public_id: fileName,
                folder: 'explore-toraja',
                resource_type: 'auto',
            },
            (error: any, result: any) => {
                if (error) return reject(error);
                resolve({
                    url: result!.secure_url,
                    public_id: result!.public_id,
                });
            }
        );
    });
}
