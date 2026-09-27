DROP TABLE IF EXISTS citizen_groups;

DROP TABLE IF EXISTS citizens;

DROP TABLE IF EXISTS cities;

CREATE TABLE cities (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  data TEXT
);

CREATE TABLE citizens (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  city_id INTEGER REFERENCES cities(id)
);

CREATE TABLE citizen_groups (
  id SERIAL PRIMARY KEY,
  citizen_id INTEGER NOT NULL REFERENCES citizens(id) ON DELETE CASCADE,
  level INTEGER NOT NULL,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  UNIQUE (citizen_id, level)
);

CREATE INDEX idx_citizen_groups_citizen ON citizen_groups(citizen_id);

CREATE INDEX idx_citizen_groups_type_name ON citizen_groups(type, name);