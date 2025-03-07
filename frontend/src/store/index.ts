import { configureStore } from '@reduxjs/toolkit';
import competitorsReducer from './slices/competitorsSlice';
import analysisReducer from './slices/analysisSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    competitors: competitorsReducer,
    analysis: analysisReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 