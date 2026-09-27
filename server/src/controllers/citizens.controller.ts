import { Request, Response, NextFunction } from 'express';
import { getAllCitizens } from '../services/citizens.service';

export async function listCitizens(_req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await getAllCitizens());
  } catch (e) {
    next(e);
  }
}