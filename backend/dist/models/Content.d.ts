import mongoose, { Document } from 'mongoose';
export interface IContent extends Document {
    page: string;
    content: Record<string, any>;
    updatedById: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Content: mongoose.Model<IContent, {}, {}, {}, mongoose.Document<unknown, {}, IContent, {}, {}> & IContent & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Content.d.ts.map