'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCompetitors } from '../store/slices/competitorsSlice';
import CompetitorList from '../components/CompetitorList';
import AnalysisDashboard from '../components/AnalysisDashboard';

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch competitors data from the API
    const fetchCompetitors = async () => {
      try {
        const response = await fetch('/api/competitors/');
        const data = await response.json();
        dispatch(setCompetitors(data));
      } catch (error) {
        console.error('Error fetching competitors:', error);
      }
    };

    fetchCompetitors();
  }, [dispatch]);

  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Competitor Analysis Dashboard
        </h1>
        <p className="text-gray-600 mb-6">
          Track and analyze your competitors with AI-powered insights.
        </p>
        <CompetitorList />
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          AI Analysis Insights
        </h2>
        <AnalysisDashboard />
      </div>
    </div>
  );
} 