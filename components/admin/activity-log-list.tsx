'use client';

import { formatDistanceToNow } from 'date-fns';
import { Plus, Pencil, Trash2, Eye, EyeOff, MapPin, Calendar, FileText, Image, Users } from 'lucide-react';

interface Activity {
    _id: string;
    action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish';
    entity: 'destination' | 'event' | 'article' | 'hero_slide' | 'user';
    entityTitle: string;
    adminName: string;
    createdAt: string;
}

interface ActivityLogListProps {
    activities: Activity[];
}

const actionIcons = {
    create: Plus,
    update: Pencil,
    delete: Trash2,
    publish: Eye,
    unpublish: EyeOff,
};

const actionColors = {
    create: 'bg-green-100 text-green-600',
    update: 'bg-blue-100 text-blue-600',
    delete: 'bg-red-100 text-red-600',
    publish: 'bg-indigo-100 text-indigo-600',
    unpublish: 'bg-neutral-100 text-neutral-600',
};

const entityIcons = {
    destination: MapPin,
    event: Calendar,
    article: FileText,
    hero_slide: Image,
    user: Users,
};

const actionLabels = {
    create: 'added',
    update: 'updated',
    delete: 'deleted',
    publish: 'published',
    unpublish: 'unpublish',
};

const entityLabels = {
    destination: 'destination',
    event: 'event',
    article: 'article',
    hero_slide: 'hero slide',
    user: 'user',
};

export default function ActivityLogList({ activities }: ActivityLogListProps) {
    if (activities.length === 0) {
        return (
            <div className="py-8 text-center">
                <p className="text-neutral-400 text-sm">No activity yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {activities.map((activity) => {
                const ActionIcon = actionIcons[activity.action];
                const EntityIcon = entityIcons[activity.entity];
                const colorClass = actionColors[activity.action];

                return (
                    <div key={activity._id} className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${colorClass}`}>
                            <ActionIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-indigo-900">
                                <span className="font-medium">{activity.adminName}</span>
                                {' '}{actionLabels[activity.action]}{' '}
                                {entityLabels[activity.entity]}
                                {' '}<span className="font-medium">"{activity.entityTitle}"</span>
                            </p>
                            <p className="text-xs text-neutral-400 mt-0.5">
                                {formatDistanceToNow(new Date(activity.createdAt), {
                                    addSuffix: true
                                })}
                            </p>
                        </div>
                        <EntityIcon className="w-4 h-4 text-neutral-300 flex-shrink-0" />
                    </div>
                );
            })}
        </div>
    );
}
