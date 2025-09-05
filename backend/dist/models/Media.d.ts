import mongoose, { Document } from 'mongoose';
export interface IMedia extends Document {
    filename: string;
    originalName: string;
    path: string;
    url: string;
    mimeType: string;
    size: number;
    alt?: string;
    caption?: string;
    width?: number;
    height?: number;
    metadata?: Record<string, any>;
    usageCount: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Media: mongoose.Model<IMedia, {}, {}, {}, mongoose.Document<unknown, {}, IMedia, {}, {}> & IMedia & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Media.d.ts.map