import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare const updateContentValidation: import("express-validator").ValidationChain[];
export declare const getPageContent: (req: Request, res: Response) => Promise<void>;
export declare const getAllPages: (req: Request, res: Response) => Promise<void>;
export declare const updateContent: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const bulkUpdateContent: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const deleteContent: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getContentHistory: (req: AuthenticatedRequest, res: Response) => Promise<void>;
//# sourceMappingURL=contentController.d.ts.map