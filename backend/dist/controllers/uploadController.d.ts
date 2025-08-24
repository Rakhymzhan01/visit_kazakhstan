import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare const uploadFile: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const uploadFiles: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getMedia: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updateMedia: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const deleteMedia: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getMediaStats: (req: AuthenticatedRequest, res: Response) => Promise<void>;
//# sourceMappingURL=uploadController.d.ts.map