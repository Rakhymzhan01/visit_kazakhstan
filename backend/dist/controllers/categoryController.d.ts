import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare const createCategoryValidation: import("express-validator").ValidationChain[];
export declare const updateCategoryValidation: import("express-validator").ValidationChain[];
export declare const getCategoriesValidation: import("express-validator").ValidationChain[];
export declare const getCategories: (req: Request, res: Response) => Promise<void>;
export declare const getCategory: (req: Request, res: Response) => Promise<void>;
export declare const createCategory: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updateCategory: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const deleteCategory: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getCategoryStats: (req: AuthenticatedRequest, res: Response) => Promise<void>;
//# sourceMappingURL=categoryController.d.ts.map