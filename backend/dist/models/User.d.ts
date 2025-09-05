import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    role: 'ADMIN' | 'SUPER_ADMIN';
    isActive: boolean;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=User.d.ts.map