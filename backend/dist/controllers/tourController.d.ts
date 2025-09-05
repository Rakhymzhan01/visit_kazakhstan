import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare const createTourValidation: import("express-validator").ValidationChain[];
export declare const updateTourValidation: import("express-validator").ValidationChain[];
export declare const getToursValidation: import("express-validator").ValidationChain[];
export declare const getTours: (req: Request, res: Response) => Promise<void>;
export declare const getToursByCategory: (req: Request, res: Response) => Promise<void>;
export declare const getTour: (req: Request, res: Response) => Promise<void>;
export declare const createTour: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updateTour: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const deleteTour: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getTourStats: (req: AuthenticatedRequest, res: Response) => Promise<void>;
//# sourceMappingURL=tourController.d.ts.map