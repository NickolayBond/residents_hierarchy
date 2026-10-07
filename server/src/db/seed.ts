import fs from "fs";
import path from "path";
import { pool } from "./pool";
import type { Citizen, City } from "../types";

const normalize = (s: string) =>
  s
    .replace(/\s*(г\.|ул\.|р-н|пр-т|пр-д|проезд|д\.)\s*$/iu, "")
    .trim()
    .toLowerCase();

async function seed() {
  const dataDir = path.resolve(__dirname, "../../data");
  const cities: City[] = JSON.parse(
    fs.readFileSync(path.join(dataDir, "cities.json"), "utf-8"),
  );
  const citizens: Citizen[] = JSON.parse(
    fs.readFileSync(path.join(dataDir, "citizens.json"), "utf-8"),
  );

  const client = await pool.connect();
  try {
    const cityByName = new Map(cities.map((c) => [normalize(c.name), c.id]));

    await client.query("BEGIN");

    await client.query(
      "TRUNCATE citizen_groups, citizens, cities RESTART IDENTITY CASCADE",
    );

    for (const c of cities) {
      await client.query(
        "INSERT INTO cities (id, name, data) VALUES ($1, $2, $3)",
        [c.id, c.name, c.data],
      );
    }

    for (const citizen of citizens) {
      const cityGroup = citizen.groups.find((g) => g.type === "city");
      const cityId = cityGroup
        ? (cityByName.get(normalize(cityGroup.name)) ?? citizen.city_id)
        : citizen.city_id;

      const { rows } = await client.query<{ id: number }>(
        "INSERT INTO citizens (name, city_id) VALUES ($1, $2) RETURNING id",
        [citizen.name, cityId],
      );
      const citizenId = rows[0].id;

      for (let i = 0; i < citizen.groups.length; i++) {
        const g = citizen.groups[i];
        await client.query(
          "INSERT INTO citizen_groups (citizen_id, level, type, name) VALUES ($1, $2, $3, $4)",
          [citizenId, i, g.type, g.name],
        );
      }
    }
    await client.query("COMMIT");
    console.log(`Seeded ${cities.length} cities, ${citizens.length} citizens`);
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error("Seed failed", err);
  process.exit(1);
});
