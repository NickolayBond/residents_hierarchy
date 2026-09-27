import { Router } from 'express';
import { getHierarchy } from '../controllers/hierarchy.controller';

export const hierarchyRouter = Router();
hierarchyRouter.get('/', getHierarchy);