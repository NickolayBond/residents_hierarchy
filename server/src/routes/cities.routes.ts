import { Router } from 'express';
import { listCities, showCity } from '../controllers/cities.controller';

export const citiesRouter = Router();
citiesRouter.get('/', listCities);
citiesRouter.get('/:id', showCity);