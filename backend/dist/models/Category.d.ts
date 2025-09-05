import mongoose, { Document } from 'mongoose';
export interface ICategory extends Document {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    featured: boolean;
    status: 'ACTIVE' | 'INACTIVE';
    displayOrder: number;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Category: mongoose.Model<ICategory, {}, {}, {}, mongoose.Document<unknown, {}, ICategory, {}, {}> & ICategory & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Category.d.ts.map