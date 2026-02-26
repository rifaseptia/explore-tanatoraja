import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IActivityLog extends Document {
    action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish';
    entity: 'destination' | 'event' | 'article' | 'hero_slide' | 'user';
    entityId: string;
    entityTitle: string;
    adminId: mongoose.Types.ObjectId;
    adminName: string;
    details?: string;
    createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
    {
        action: {
            type: String,
            enum: ['create', 'update', 'delete', 'publish', 'unpublish'],
            required: true,
        },
        entity: {
            type: String,
            enum: ['destination', 'event', 'article', 'hero_slide', 'user'],
            required: true,
        },
        entityId: { type: String, required: true },
        entityTitle: { type: String, required: true },
        adminId: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
        adminName: { type: String, required: true },
        details: { type: String },
    },
    {
        timestamps: true,
    }
);

ActivityLogSchema.index({ createdAt: -1 });
ActivityLogSchema.index({ entity: 1 });
ActivityLogSchema.index({ adminId: 1 });

const ActivityLog: Model<IActivityLog> =
    mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);

export default ActivityLog;
