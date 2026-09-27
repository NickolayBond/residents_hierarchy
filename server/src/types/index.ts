export type GroupType =
  | 'country'
  | 'city'
  | 'district'
  | 'street'
  | 'house';

export interface CitizenGroup {
  type: GroupType | string;
  name: string;
}

export interface Citizen {
  id: number;
  name: string;
  city_id: number;
  groups: CitizenGroup[];
}

export interface City {
  id: number;
  name: string;
  data: string;
}

/* Узел иерархии, отдаваемый фронту */
export interface HierarchyNode {
  type: string;     
  name: string;
  children: HierarchyNode[];
  /* сколько жителей в поддереве */
  citizensCount?: number;
  /* данные для тултипа */
  meta?: {
    cityId?: number;
    population?: string;
  };
}