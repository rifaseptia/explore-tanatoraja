'use client';

import { useState } from 'react';
import { Calendar, Check, ExternalLink, Download } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Props {
    title: string;
    description: string;
    location: string;
    startDate: string;
    endDate?: string;
}

export default function AddToCalendar({ title, description, location, startDate, endDate }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations('common'); // Assuming we have or will add common translations, or hardcode for now if missing

    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date(start.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours if no end date

    // Format for Google Calendar: YYYYMMDDTHHmmSSZ
    const formatGoogleDate = (date: Date) => {
        return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
    };

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}&dates=${formatGoogleDate(start)}/${formatGoogleDate(end)}`;

    const downloadIcs = () => {
        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'BEGIN:VEVENT',
            `DTSTART:${formatGoogleDate(start)}`,
            `DTEND:${formatGoogleDate(end)}`,
            `SUMMARY:${title}`,
            `DESCRIPTION:${description}`,
            `LOCATION:${location}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\n');

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${title.replace(/\s+/g, '-')}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-6 py-3 bg-[#A78BFA] hover:bg-[#8B5CF6] text-white font-bold rounded-xl transition-all shadow-lg shadow-violet-200/50"
            >
                <Calendar size={18} />
                <span>Add to Calendar</span>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-20 py-1 animate-in fade-in zoom-in-95 duration-200">
                        <a
                            href={googleUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-violet-50 transition-colors w-full text-left"
                            onClick={() => setIsOpen(false)}
                        >
                            <ExternalLink size={16} className="text-[#A78BFA]" />
                            Google Calendar
                        </a>
                        <button
                            onClick={() => {
                                downloadIcs();
                                setIsOpen(false);
                            }}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-violet-50 transition-colors w-full text-left"
                        >
                            <Download size={16} className="text-[#A78BFA]" />
                            Download .ICS
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
