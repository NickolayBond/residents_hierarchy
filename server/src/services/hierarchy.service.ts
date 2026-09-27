import { getAllCities } from './cities.service';
import type { HierarchyNode } from '../types';
import { getAllCitizens } from './citizens.service';


export async function buildHierarchy(): Promise<HierarchyNode> {
  const [citizens, cities] = await Promise.all([
    getAllCitizens(),
    getAllCities(),
  ]);

  const cityById = new Map(cities.map((c) => [c.id, c]));

  const root: HierarchyNode = { type: 'root', name: 'Все жители', children: [] };

  // Хелпер: найти/создать дочерний узел по (type, name)
  const findOrCreate = (
    parent: HierarchyNode,
    type: string,
    name: string,
  ): HierarchyNode => {
    let node = parent.children.find(
      (c) => c.type === type && c.name === name,
    );
    if (!node) {
      node = { type, name, children: [] };
      parent.children.push(node);
    }
    return node;
  };

  for (const citizen of citizens) {
    const chain = [...citizen.groups].sort((a, b) => a.type.localeCompare(b.type)); 
    if (chain.length === 0) continue;

    let cursor = root;
    for (let i = 0; i < chain.length; i++) {
      const g = chain[i];
      const levelType = g.type;
      cursor = findOrCreate(cursor, levelType, g.name);
    }

    cursor.children.push({
      type: 'citizen',
      name: citizen.name,
      children: [],
      meta: { cityId: citizen.city_id },
    });
  }

  enrichCities(root, cityById);

  countCitizens(root);

  sortTree(root);

  return root;
}

function enrichCities(
  node: HierarchyNode,
  cityById: Map<number, { id: number; name: string; data: string }>,
): void {
  if (node.type === 'city') {
    const normalized = normalizeName(node.name);
    const city = [...cityById.values()].find(
      (c) => normalizeName(c.name) === normalized,
    );
    if (city) {
      node.meta = { ...node.meta, cityId: city.id, population: city.data };
    }
  }
  node.children.forEach((c) => enrichCities(c, cityById));
}

function countCitizens(node: HierarchyNode): number {
  if (node.type === 'citizen') return 1;
  const total = node.children.reduce((sum, c) => sum + countCitizens(c), 0);
  node.citizensCount = total;
  return total;
}

function sortTree(node: HierarchyNode): void {
  node.children.sort((a, b) => {
    if (a.type === 'citizen' && b.type !== 'citizen') return 1;
    if (b.type === 'citizen' && a.type !== 'citizen') return -1;
    return a.name.localeCompare(b.name, 'ru');
  });
  node.children.forEach(sortTree);
}

function normalizeName(name: string): string {
  return name
    .replace(/\s*(г\.|ул\.|р-н|пр-т|пр-д|проезд|д\.)\s*$/iu, '')
    .trim()
    .toLowerCase();
}