import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare const loginValidation: import("express-validator").ValidationChain[];
export declare const createUserValidation: import("express-validator").ValidationChain[];
export declare const login: (req: Request, res: Response) => Promise<void>;
export declare const getProfile: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updateProfile: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const changePassword: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const createUser: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const logout: (req: AuthenticatedRequest, res: Response) => Promise<void>;
//# sourceMappingURL=authController.d.ts.map