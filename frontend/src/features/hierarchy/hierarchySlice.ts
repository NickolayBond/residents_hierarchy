import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchCities, fetchHierarchy } from '../../api';
import type { City, HierarchyNode } from '../../types';

interface HierarchyState {
  tree: HierarchyNode | null;
  cities: Record<number, City>;
  loading: boolean;
  error: string | null;
}

const initialState: HierarchyState = {
  tree: null,
  cities: {},
  loading: false,
  error: null,
};

export const loadHierarchy = createAsyncThunk(
  'hierarchy/load',
  async () => {
    const [tree, cities] = await Promise.all([fetchHierarchy(), fetchCities()]);
    return { tree, cities };
  },
);

const hierarchySlice = createSlice({
  name: 'hierarchy',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadHierarchy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadHierarchy.fulfilled, (state, action) => {
        state.loading = false;
        state.tree = action.payload.tree;
        state.cities = Object.fromEntries(
          action.payload.cities.map((c) => [c.id, c]),
        );
      })
      .addCase(loadHierarchy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Не удалось загрузить данные';
      });
  },
});

export default hierarchySlice.reducer;