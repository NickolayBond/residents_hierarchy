export type GroupType =
  | "root"
  | "country"
  | "city"
  | "district"
  | "street"
  | "house"
  | "citizen"
  | string;

export interface HierarchyNode {
  type: GroupType;
  name: string;
  children: HierarchyNode[];
  citizensCount?: number;
  meta?: {
    cityId?: number;
    population?: string;
  };
}

export interface City {
  id: number;
  name: string;
  data: string;
}
