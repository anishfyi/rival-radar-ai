import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Competitor {
  id: number;
  name: string;
  description: string;
  website: string;
  features: string[];
  marketPosition: string;
  lastUpdated: string;
}

interface CompetitorsState {
  competitors: Competitor[];
  loading: boolean;
  error: string | null;
}

const initialState: CompetitorsState = {
  competitors: [],
  loading: false,
  error: null,
};

const competitorsSlice = createSlice({
  name: 'competitors',
  initialState,
  reducers: {
    setCompetitors: (state, action: PayloadAction<Competitor[]>) => {
      state.competitors = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    addCompetitor: (state, action: PayloadAction<Competitor>) => {
      state.competitors.push(action.payload);
    },
    updateCompetitor: (state, action: PayloadAction<Competitor>) => {
      const index = state.competitors.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.competitors[index] = action.payload;
      }
    },
    deleteCompetitor: (state, action: PayloadAction<number>) => {
      state.competitors = state.competitors.filter(c => c.id !== action.payload);
    },
  },
});

export const {
  setCompetitors,
  setLoading,
  setError,
  addCompetitor,
  updateCompetitor,
  deleteCompetitor,
} = competitorsSlice.actions;

export default competitorsSlice.reducer; 