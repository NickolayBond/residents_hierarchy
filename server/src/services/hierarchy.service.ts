import { getAllCities } from "./cities.service";
import type { HierarchyNode } from "../types";
import { getAllCitizens } from "./citizens.service";

const collator = new Intl.Collator("ru");

// Хелпер: найти/создать дочерний узел по (type, name)
const childIndex = new WeakMap<HierarchyNode, Map<string, HierarchyNode>>();

const findOrCreate = (
  parent: HierarchyNode,
  type: string,
  name: string,
): HierarchyNode => {
  let index = childIndex.get(parent);
  if (!index) {
    index = new Map();
    for (const child of parent.children) {
      index.set(`${child.type}\u0000${child.name}`, child);
    }
    childIndex.set(parent, index);
  }

  const key = `${type}\u0000${name}`;
  let node = index.get(key);
  if (!node) {
    node = { type, name, children: [] };
    parent.children.push(node);
    index.set(key, node);
  }
  return node;
};

export async function buildHierarchy(): Promise<HierarchyNode> {
  const [citizens, cities] = await Promise.all([
    getAllCitizens(),
    getAllCities(),
  ]);

  const cityByNormalized = new Map<
    string,
    { id: number; name: string; data: string }
  >();
  for (const c of cities) {
    cityByNormalized.set(normalizeName(c.name), c);
  }

  const root: HierarchyNode = {
    type: "root",
    name: "Все жители",
    children: [],
  };

  for (const citizen of citizens) {
    if (citizen.groups.length === 0) continue;

    const chain = citizen.groups
      .slice()
      .sort((a, b) => (a.type < b.type ? -1 : a.type > b.type ? 1 : 0));

    let cursor = root;
    for (let i = 0; i < chain.length; i++) {
      const g = chain[i];
      cursor = findOrCreate(cursor, g.type, g.name);
    }

    cursor.children.push({
      type: "citizen",
      name: citizen.name,
      children: [],
      meta: { cityId: citizen.city_id },
    });
  }

  enrichCities(root, cityByNormalized);
  countCitizens(root);
  sortTree(root);

  return root;
}

function enrichCities(
  node: HierarchyNode,
  cityByNormalized: Map<string, { id: number; name: string; data: string }>,
): void {
  if (node.type === "city") {
    const city = cityByNormalized.get(normalizeName(node.name));
    if (city) {
      node.meta = { ...node.meta, cityId: city.id, population: city.data };
    }
  }
  for (const child of node.children) {
    enrichCities(child, cityByNormalized);
  }
}

function countCitizens(node: HierarchyNode): number {
  if (node.type === "citizen") return 1;
  let total = 0;
  for (const child of node.children) {
    total += countCitizens(child);
  }
  node.citizensCount = total;
  return total;
}

function sortTree(node: HierarchyNode): void {
  node.children.sort((a, b) => {
    const aCit = a.type === "citizen";
    const bCit = b.type === "citizen";
    if (aCit !== bCit) return aCit ? 1 : -1;
    return collator.compare(a.name, b.name);
  });
  for (const child of node.children) {
    sortTree(child);
  }
}

function normalizeName(name: string): string {
  return name
    .replace(/\s*(г\.|ул\.|р-н|пр-т|пр-д|проезд|д\.)\s*$/iu, "")
    .trim()
    .toLowerCase();
}
