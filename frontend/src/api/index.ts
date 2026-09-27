import type { City, HierarchyNode } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export const fetchHierarchy = () => request<HierarchyNode>('/api/hierarchy');
export const fetchCities = () => request<City[]>('/api/cities');