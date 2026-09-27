import { pool } from '../db/pool';
import type { Citizen, CitizenGroup } from '../types';

interface CitizenRow {
  id: number;
  name: string;
  city_id: number;
}

interface GroupRow {
  citizen_id: number;
  level: number;
  type: string;
  name: string;
}

export async function getAllCitizens(): Promise<Citizen[]> {
  const [citizensRes, groupsRes] = await Promise.all([
    pool.query<CitizenRow>('SELECT id, name, city_id FROM citizens ORDER BY id'),
    pool.query<GroupRow>(
      'SELECT citizen_id, level, type, name FROM citizen_groups ORDER BY citizen_id, level',
    ),
  ]);

  const groupsByCitizen = new Map<number, CitizenGroup[]>();
  for (const g of groupsRes.rows) {
    const list = groupsByCitizen.get(g.citizen_id) ?? [];
    list.push({ type: g.type, name: g.name });
    groupsByCitizen.set(g.citizen_id, list);
  }

  return citizensRes.rows.map((c) => ({
    id: c.id,
    name: c.name,
    city_id: c.city_id,
    groups: groupsByCitizen.get(c.id) ?? [],
  }));
}