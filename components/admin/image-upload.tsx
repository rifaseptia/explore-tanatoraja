'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import imageCompression from 'browser-image-compression';

// Compression options — only compress when image is above 2MB
// Target output: 2MB or below to maintain quality
const compressionOptions = {
    maxSizeMB: 1.5, // Target ~1.5MB for main images (balancing quality and size)
    maxWidthOrHeight: 1920, // Full HD resolution is sufficient
    useWebWorker: true,
    initialQuality: 0.9, // Higher quality to prevent pixelation
};

const thumbnailCompressionOptions = {
    maxSizeMB: 0.5, // Target ~500KB for thumbnails (smaller but still good quality)
    maxWidthOrHeight: 1200, // Good quality for card images
    useWebWorker: true,
    initialQuality: 0.85, // 85% quality for thumbnails
};

// Size threshold - only compress if file is larger than 2MB
const COMPRESSION_THRESHOLD_MB = 2;

async function compressImage(file: File, isThumbnail: boolean = false): Promise<File> {
    // Skip compression if file is below threshold to preserve original quality
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB <= COMPRESSION_THRESHOLD_MB) {
        console.log(`Skipping compression for ${file.name}: ${fileSizeMB.toFixed(2)}MB (below ${COMPRESSION_THRESHOLD_MB}MB threshold)`);
        return file;
    }

    const options = isThumbnail ? thumbnailCompressionOptions : compressionOptions;

    try {
        const compressedFile = await imageCompression(file, options);
        const originalKB = (file.size / 1024).toFixed(0);
        const compressedKB = (compressedFile.size / 1024).toFixed(0);
        const savings = ((1 - compressedFile.size / file.size) * 100).toFixed(1);
        console.log(`Compressed ${file.name}: ${originalKB}KB → ${compressedKB}KB (saved ${savings}%)`);
        return compressedFile;
    } catch (error) {
        console.error('Compression error:', error);
        return file; // Return original if compression fails
    }
}

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label: string;
    description?: string;
    required?: boolean;
    isThumbnail?: boolean;
}

export default function ImageUpload({ value, onChange, label, description, required, isThumbnail = false }: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);
    const [error, setError] = useState('');

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            uploadFile(file);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isThumbnail]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadFile(file);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isThumbnail]);

    const uploadFile = async (file: File) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('File must be an image');
            return;
        }

        setError('');

        try {
            // Always compress for optimal loading speed
            setIsCompressing(true);
            const fileToUpload = await compressImage(file, isThumbnail);
            setIsCompressing(false);

            setIsUploading(true);

            const formData = new FormData();
            formData.append('file', fileToUpload);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                throw new Error('Upload failed');
            }

            const data = await res.json();
            onChange(data.url);
        } catch (err) {
            console.error('Upload error:', err);
            setError('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
            setIsCompressing(false);
        }
    };

    const handleRemove = () => {
        onChange('');
    };

    const isProcessing = isCompressing || isUploading;

    return (
        <div>
            <label className="block text-sm font-medium text-indigo-900 mb-2">
                {label} {required && '*'}
            </label>
            {description && (
                <p className="text-xs text-neutral-400 mb-2">{description}</p>
            )}

            {value ? (
                <div className="relative inline-block">
                    <img
                        src={value}
                        alt="Preview"
                        className="w-48 h-32 object-cover rounded-lg border-2 border-indigo-200"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition cursor-pointer ${isDragging
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                        }`}
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id={`upload-${label}`}
                    />
                    <label htmlFor={`upload-${label}`} className="cursor-pointer">
                        {isProcessing ? (
                            <div className="flex flex-col items-center">
                                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-2" />
                                <p className="text-sm text-neutral-500">
                                    {isCompressing ? 'Compressing...' : 'Uploading...'}
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                                    <Upload className="w-6 h-6 text-neutral-400" />
                                </div>
                                <p className="text-sm text-neutral-600 mb-1">
                                    <span className="text-indigo-600 font-medium">Click to upload</span> or drag & drop
                                </p>
                                <p className="text-xs text-neutral-400">PNG, JPG, WEBP — auto-compressed if above 2MB</p>
                            </div>
                        )}
                    </label>
                </div>
            )}

            {error && (
                <p className="text-xs text-red-500 mt-2">{error}</p>
            )}
        </div>
    );
}

// Gallery version with multiple images
interface GalleryUploadProps {
    value: string[];
    onChange: (urls: string[]) => void;
    maxImages?: number;
    label: string;
    description?: string;
}

export function GalleryUpload({ value, onChange, maxImages = 5, label, description }: GalleryUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);
    const [error, setError] = useState('');

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        if (value.length < maxImages) {
            setIsDragging(true);
        }
    }, [value.length, maxImages]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        const availableSlots = maxImages - value.length;
        const filesToUpload = files.slice(0, availableSlots);

        if (filesToUpload.length > 0) {
            uploadFiles(filesToUpload);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value.length, maxImages]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const availableSlots = maxImages - value.length;
        const filesToUpload = files.slice(0, availableSlots);

        if (filesToUpload.length > 0) {
            uploadFiles(filesToUpload);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value.length, maxImages]);

    const uploadFiles = async (files: File[]) => {
        setError('');

        try {
            // Compress files first
            setIsCompressing(true);
            const compressedFiles = await Promise.all(
                files.map(file => compressImage(file, false))
            );
            setIsCompressing(false);

            setIsUploading(true);

            const uploadPromises = compressedFiles.map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);

                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!res.ok) {
                    throw new Error('Upload failed');
                }

                const data = await res.json();
                return data.url;
            });

            const urls = await Promise.all(uploadPromises);
            onChange([...value, ...urls]);
        } catch (err) {
            console.error('Upload error:', err);
            setError(err instanceof Error ? err.message : 'Failed to upload images');
        } finally {
            setIsUploading(false);
            setIsCompressing(false);
        }
    };

    const handleRemove = (url: string) => {
        onChange(value.filter(v => v !== url));
    };

    const isFull = value.length >= maxImages;
    const isProcessing = isCompressing || isUploading;

    return (
        <div>
            <label className="block text-sm font-medium text-indigo-900 mb-2">
                {label}
            </label>
            {description && (
                <p className="text-xs text-neutral-400 mb-2">{description} ({value.length}/{maxImages})</p>
            )}

            {/* Existing Images */}
            {value.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-3">
                    {value.map((url, index) => (
                        <div key={url} className="relative group">
                            <img
                                src={url}
                                alt={`Gallery ${index + 1}`}
                                className="w-24 h-24 object-cover rounded-lg"
                            />
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 text-white text-xs rounded">
                                {index + 1}
                            </span>
                            <button
                                type="button"
                                onClick={() => handleRemove(url)}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Area */}
            {!isFull && (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition cursor-pointer ${isDragging
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                        }`}
                >
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        id={`gallery-upload-${label}`}
                    />
                    <label htmlFor={`gallery-upload-${label}`} className="cursor-pointer">
                        {isProcessing ? (
                            <div className="flex items-center justify-center gap-2">
                                <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                                <span className="text-sm text-neutral-500">
                                    {isCompressing ? 'Compressing...' : 'Uploading...'}
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <ImageIcon className="w-5 h-5 text-neutral-400" />
                                <span className="text-sm text-neutral-600">
                                    <span className="text-indigo-600 font-medium">Add photo</span> or drag & drop
                                </span>
                            </div>
                        )}
                    </label>
                </div>
            )}

            {isFull && (
                <p className="text-xs text-amber-600">Maximum {maxImages} photos reached</p>
            )}

            {error && (
                <p className="text-xs text-red-500 mt-2">{error}</p>
            )}
        </div>
    );
}
