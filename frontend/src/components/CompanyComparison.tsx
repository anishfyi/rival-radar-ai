'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface Company {
  name: string;
  description: string;
  website: string;
  industry: string;
  features: string[];
}

interface FeatureComparison {
  feature: string;
  company1Has: boolean;
  company2Has: boolean;
  notes: string;
}

interface ComparisonData {
  marketShare: {
    company1: number;
    company2: number;
  };
  revenue: {
    company1: string;
    company2: string;
  };
  strengths: {
    company1: string[];
    company2: string[];
  };
  weaknesses: {
    company1: string[];
    company2: string[];
  };
  featureComparison: FeatureComparison[];
  overallAnalysis: string;
}

interface CompanyComparisonProps {
  company1: Company | null;
  company2: Company | null;
  onReset: () => void;
}

const COLORS = ['#0066cc', '#ff9500', '#30d158', '#ff3b30', '#5e5ce6'];

export default function CompanyComparison({ company1, company2, onReset }: CompanyComparisonProps) {
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComparisonData = async () => {
      if (!company1 || !company2) return;

      setLoading(true);
      setError(null);

      try {
        // Get token from localStorage
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          setError('You must be logged in to compare companies');
          setLoading(false);
          return;
        }

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/competitors/compare_companies/`,
          { company1, company2 },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        setComparisonData(response.data);
      } catch (err: any) {
        console.error('Error comparing companies:', err);
        setError(err.response?.data?.error || 'Failed to compare companies');
      } finally {
        setLoading(false);
      }
    };

    fetchComparisonData();
  }, [company1, company2]);

  if (!company1 || !company2) {
    return (
      <div className="text-center p-8 bg-apple-gray-50 rounded-lg border border-apple-gray-200">
        <p className="text-apple-gray-700">Please select two companies to compare.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg border border-apple-gray-200">
        <div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full mb-4"></div>
        <p className="text-apple-gray-700">Analyzing and comparing companies...</p>
        <p className="text-apple-gray-500 text-sm mt-2">This may take a moment as we gather detailed insights.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-200">
        <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
        <p className="text-red-700">{error}</p>
        <button
          onClick={onReset}
          className="mt-4 px-4 py-2 bg-white text-red-700 border border-red-300 rounded-md hover:bg-red-50"
        >
          Reset Comparison
        </button>
      </div>
    );
  }

  if (!comparisonData) {
    return (
      <div className="text-center p-8 bg-apple-gray-50 rounded-lg border border-apple-gray-200">
        <p className="text-apple-gray-700">No comparison data available.</p>
        <button
          onClick={onReset}
          className="mt-4 px-4 py-2 bg-white text-apple-gray-700 border border-apple-gray-300 rounded-md hover:bg-apple-gray-50"
        >
          Reset Comparison
        </button>
      </div>
    );
  }

  // Prepare market share data for pie chart
  const marketShareData = [
    { name: company1.name, value: comparisonData.marketShare.company1 },
    { name: company2.name, value: comparisonData.marketShare.company2 },
    { name: 'Others', value: 100 - comparisonData.marketShare.company1 - comparisonData.marketShare.company2 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-apple-gray-900">
          {company1.name} vs {company2.name}
        </h2>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-white text-apple-gray-700 border border-apple-gray-300 rounded-md hover:bg-apple-gray-50"
        >
          New Comparison
        </button>
      </div>

      <div className="p-6 bg-white rounded-lg border border-apple-gray-200">
        <h3 className="text-lg font-medium text-apple-gray-900 mb-4">Overall Analysis</h3>
        <p className="text-apple-gray-700 whitespace-pre-line">{comparisonData.overallAnalysis}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-lg border border-apple-gray-200">
          <h3 className="text-lg font-medium text-apple-gray-900 mb-4">Market Share</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={marketShareData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {marketShareData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg border border-apple-gray-200">
          <h3 className="text-lg font-medium text-apple-gray-900 mb-4">Revenue</h3>
          <div className="grid grid-cols-2 gap-4 h-full">
            <div className="flex flex-col items-center justify-center p-4 bg-apple-gray-50 rounded-lg">
              <h4 className="text-apple-gray-700 font-medium mb-2">{company1.name}</h4>
              <div className="text-2xl font-bold text-primary-600">{comparisonData.revenue.company1}</div>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-apple-gray-50 rounded-lg">
              <h4 className="text-apple-gray-700 font-medium mb-2">{company2.name}</h4>
              <div className="text-2xl font-bold text-primary-600">{comparisonData.revenue.company2}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-lg border border-apple-gray-200">
          <h3 className="text-lg font-medium text-apple-gray-900 mb-4">Strengths</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-apple-gray-700 font-medium mb-2">{company1.name}</h4>
              <ul className="space-y-2">
                {comparisonData.strengths.company1.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-apple-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-apple-gray-700 font-medium mb-2">{company2.name}</h4>
              <ul className="space-y-2">
                {comparisonData.strengths.company2.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-apple-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg border border-apple-gray-200">
          <h3 className="text-lg font-medium text-apple-gray-900 mb-4">Weaknesses</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-apple-gray-700 font-medium mb-2">{company1.name}</h4>
              <ul className="space-y-2">
                {comparisonData.weaknesses.company1.map((weakness, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span className="text-apple-gray-700">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-apple-gray-700 font-medium mb-2">{company2.name}</h4>
              <ul className="space-y-2">
                {comparisonData.weaknesses.company2.map((weakness, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span className="text-apple-gray-700">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg border border-apple-gray-200">
        <h3 className="text-lg font-medium text-apple-gray-900 mb-4">Feature Comparison</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-apple-gray-200">
            <thead className="bg-apple-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-apple-gray-500 uppercase tracking-wider">
                  Feature
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-apple-gray-500 uppercase tracking-wider">
                  {company1.name}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-apple-gray-500 uppercase tracking-wider">
                  {company2.name}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-apple-gray-500 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-apple-gray-200">
              {comparisonData.featureComparison.map((feature, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-apple-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-apple-gray-900">
                    {feature.feature}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-apple-gray-500">
                    {feature.company1Has ? (
                      <span className="text-green-500">✓</span>
                    ) : (
                      <span className="text-red-500">✗</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-apple-gray-500">
                    {feature.company2Has ? (
                      <span className="text-green-500">✓</span>
                    ) : (
                      <span className="text-red-500">✗</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-apple-gray-500">
                    {feature.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 