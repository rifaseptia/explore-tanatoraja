'use client';

import { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';

interface Props {
    title: string;
    text?: string;
    url?: string;
}

export default function ShareButton({ title, text, url }: Props) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const shareData = {
            title: title,
            text: text || `Check out ${title} on Explore Tana Toraja`,
            url: url || window.location.href,
        };

        // Try Native Share API first (Mobile)
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback: Copy to Clipboard (Desktop)
            try {
                await navigator.clipboard.writeText(shareData.url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy class', err);
            }
        }
    };

    return (
        <div className="relative">
            <button
                onClick={handleShare}
                className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-[#A78BFA] transition-all border border-white/20 flex items-center justify-center group"
                aria-label="Share"
            >
                {copied ? <Check size={18} /> : <Share2 size={18} />}
            </button>

            {/* Tooltip confirmation for copy */}
            {copied && (
                <div className="absolute top-14 right-0 px-3 py-1 bg-black/80 text-white text-xs rounded-md whitespace-nowrap animate-in fade-in slide-in-from-top-1">
                    Link Copied!
                </div>
            )}
        </div>
    );
}
