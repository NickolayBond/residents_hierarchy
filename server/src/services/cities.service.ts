import { pool } from "../db/pool";
import type { City } from "../types";

export async function getAllCities(): Promise<City[]> {
  const { rows } = await pool.query<City>(
    "SELECT id, name, data FROM cities ORDER BY id",
  );
  return rows;
}

export async function getCityById(id: number): Promise<City | null> {
  const { rows } = await pool.query<City>(
    "SELECT id, name, data FROM cities WHERE id = $1",
    [id],
  );
  return rows[0] ?? null;
}
