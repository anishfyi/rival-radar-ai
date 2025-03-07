import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AnalysisData {
  category: string;
  yourCompany: number;
  competitors: number;
}

interface Analysis {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  competitors: number[];
  data: Record<string, any>;
}

interface AnalysisState {
  analyses: Analysis[];
  dashboardData: AnalysisData[];
  loading: boolean;
  error: string | null;
}

const initialState: AnalysisState = {
  analyses: [],
  dashboardData: [],
  loading: false,
  error: null,
};

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    setAnalyses: (state, action: PayloadAction<Analysis[]>) => {
      state.analyses = action.payload;
      state.loading = false;
      state.error = null;
    },
    setDashboardData: (state, action: PayloadAction<AnalysisData[]>) => {
      state.dashboardData = action.payload;
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
    addAnalysis: (state, action: PayloadAction<Analysis>) => {
      state.analyses.push(action.payload);
    },
    updateAnalysis: (state, action: PayloadAction<Analysis>) => {
      const index = state.analyses.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.analyses[index] = action.payload;
      }
    },
    deleteAnalysis: (state, action: PayloadAction<number>) => {
      state.analyses = state.analyses.filter(a => a.id !== action.payload);
    },
  },
});

export const {
  setAnalyses,
  setDashboardData,
  setLoading,
  setError,
  addAnalysis,
  updateAnalysis,
  deleteAnalysis,
} = analysisSlice.actions;

export default analysisSlice.reducer; 