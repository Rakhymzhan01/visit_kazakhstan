import mongoose from 'mongoose';
declare global {
    var __mongoose: typeof mongoose | undefined;
}
declare const connectDB: () => Promise<typeof mongoose>;
export { connectDB };
export default mongoose;
//# sourceMappingURL=database.d.ts.map