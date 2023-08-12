import { createSlice } from '@reduxjs/toolkit'

interface IStarredRepository {
  name: string;
  shortDescriptionHTML: string;
  ownerAvatarUrl: string;
  rating: number | undefined;
}

const initialState: { [id: string] : IStarredRepository; } = {};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    favoriteAdded(state, action) {
      state[action.payload.id] = action.payload.repository;
    },
    favoriteRemoved(state, action) {
      delete state[action.payload];
    },
    favoriteRatingUpdated(state, action) {
      state[action.payload.id].rating = action.payload.rating;
    }
  }
})

export const { favoriteAdded, favoriteRemoved, favoriteRatingUpdated } = favoritesSlice.actions
export type { IStarredRepository };
export default favoritesSlice.reducer