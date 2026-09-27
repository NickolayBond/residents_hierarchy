import { Router } from 'express';
import { listCitizens } from '../controllers/citizens.controller';

export const citizensRouter = Router();
citizensRouter.get('/', listCitizens);