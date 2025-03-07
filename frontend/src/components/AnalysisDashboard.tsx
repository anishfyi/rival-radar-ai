'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface AnalysisData {
  category: string;
  yourCompany: number;
  competitors: number;
}

export default function AnalysisDashboard() {
  const [analysisData, setAnalysisData] = useState<AnalysisData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        const response = await fetch('/api/analysis/');
        const data = await response.json();
        setAnalysisData(data);
      } catch (error) {
        setError('Failed to load analysis data');
        console.error('Error fetching analysis data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading analysis data...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-4">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={analysisData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="yourCompany" fill="#0ea5e9" name="Your Company" />
            <Bar dataKey="competitors" fill="#94a3b8" name="Competitors" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Key Strengths</h3>
          <ul className="space-y-2">
            <li className="text-blue-800">• Advanced AI capabilities</li>
            <li className="text-blue-800">• Strong market presence</li>
            <li className="text-blue-800">• Innovative feature set</li>
          </ul>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-red-900 mb-2">Areas for Improvement</h3>
          <ul className="space-y-2">
            <li className="text-red-800">• User interface refinement</li>
            <li className="text-red-800">• Performance optimization</li>
            <li className="text-red-800">• Customer support enhancement</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 