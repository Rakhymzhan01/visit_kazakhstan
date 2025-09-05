import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare const createBlogValidation: import("express-validator").ValidationChain[];
export declare const updateBlogValidation: import("express-validator").ValidationChain[];
export declare const getBlogsValidation: import("express-validator").ValidationChain[];
export declare const getBlogs: (req: Request, res: Response) => Promise<void>;
export declare const getBlog: (req: Request, res: Response) => Promise<void>;
export declare const createBlog: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updateBlog: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const deleteBlog: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getBlogStats: (req: AuthenticatedRequest, res: Response) => Promise<void>;
//# sourceMappingURL=blogController.d.ts.map