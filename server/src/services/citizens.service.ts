import { pool } from "../db/pool";
import type { Citizen } from "../types";

interface FlatRow {
  id: number;
  name: string;
  city_id: number;
  group_type: string | null;
  group_name: string | null;
}

export async function getAllCitizens(): Promise<Citizen[]> {
  const query = `
    SELECT 
      c.id, 
      c.name, 
      c.city_id,
      cg.type as group_type,
      cg.name as group_name
    FROM citizens c
    LEFT JOIN citizen_groups cg ON c.id = cg.citizen_id
    ORDER BY c.id, cg.level;
  `;

  const res = await pool.query<FlatRow>(query);
  const citizensMap = new Map<number, Citizen>();

  for (const row of res.rows) {
    if (!citizensMap.has(row.id)) {
      citizensMap.set(row.id, {
        id: row.id,
        name: row.name,
        city_id: row.city_id,
        groups: [],
      });
    }

    // Если у гражданина есть группа, добавит её в массив
    if (row.group_type && row.group_name) {
      citizensMap.get(row.id)!.groups.push({
        type: row.group_type,
        name: row.group_name,
      });
    }
  }

  return Array.from(citizensMap.values());
}
