import { Request, Response, NextFunction } from 'express';
import { buildHierarchy } from '../services/hierarchy.service';

export async function getHierarchy(_req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await buildHierarchy());
  } catch (e) {
    next(e);
  }
}