import { Request, Response, NextFunction } from 'express';
import { getAllCities, getCityById } from '../services/cities.service';

export async function listCities(_req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await getAllCities());
  } catch (e) {
    next(e);
  }
}

export async function showCity(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const city = await getCityById(id);
    if (!city) return res.status(404).json({ error: 'City not found' });
    res.json(city);
  } catch (e) {
    next(e);
  }
}