import { createSlice } from '@reduxjs/toolkit';

const entitiesSlice = createSlice({
  name: 'entities',
  initialState: {
    user: {},
    collaborator: {},
  },
  reducers: {
    setEntityData: (state, action) => {
      const { entityType, data } = action.payload;
      state[entityType] = data;
    },
  },
});

export const { setEntityData } = entitiesSlice.actions;

export default entitiesSlice.reducer;