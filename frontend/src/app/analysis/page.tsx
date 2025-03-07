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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

interface AnalysisData {
  category: string;
  yourCompany: number;
  competitors: number;
}

interface Feature {
  name: string;
  yourCompany: boolean;
  competitors: string[];
}

interface Competitor {
  id: number;
  name: string;
  description: string;
  website: string;
  features: string[];
  market_position: string;
  created_at: string;
  updated_at: string;
  last_analyzed: string | null;
  is_your_company?: boolean;
}

interface ComparisonData {
  feature: string;
  yourCompany: boolean;
  competitors: Record<string, boolean>;
}

export default function AnalysisPage() {
  const [analysisData, setAnalysisData] = useState<AnalysisData[]>([]);
  const [radarData, setRadarData] = useState<AnalysisData[]>([]);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [yourCompany, setYourCompany] = useState<Competitor | null>(null);
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);
  const [suggestedFeatures, setSuggestedFeatures] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          setError('You must be logged in to view this page');
          setLoading(false);
          return;
        }

        // Fetch dashboard data
        const dashboardResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/analysis/dashboard_data/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Fetch competitors
        const competitorsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/competitors/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Process competitors data
        const yourCompanyData = competitorsResponse.data.find((comp: Competitor) => comp.is_your_company);
        const competitorsData = competitorsResponse.data.filter((comp: Competitor) => !comp.is_your_company);

        setYourCompany(yourCompanyData || null);
        setCompetitors(competitorsData);

        // Set analysis data
        setAnalysisData(dashboardResponse.data);

        // Create radar data
        const radarCategories = ['Innovation', 'Market Share', 'User Experience', 'Pricing', 'Feature Set'];
        const radarData = radarCategories.map(category => ({
          category,
          yourCompany: Math.floor(Math.random() * 50) + 50, // Random value between 50-100 for demo
          competitors: Math.floor(Math.random() * 70) + 30, // Random value between 30-100 for demo
        }));
        setRadarData(radarData);

        // Create comparison data if your company exists
        if (yourCompanyData) {
          // Get all unique features
          const allFeatures = new Set<string>();
          yourCompanyData.features.forEach(f => allFeatures.add(f));
          competitorsData.forEach(comp => {
            comp.features.forEach(f => allFeatures.add(f));
          });

          // Create comparison data
          const comparisonData: ComparisonData[] = Array.from(allFeatures).map(feature => {
            const data: ComparisonData = {
              feature,
              yourCompany: yourCompanyData.features.includes(feature),
              competitors: {}
            };

            competitorsData.forEach(comp => {
              data.competitors[comp.name] = comp.features.includes(feature);
            });

            return data;
          });

          setComparisonData(comparisonData);

          // Generate suggested features
          const yourFeatures = new Set(yourCompanyData.features);
          const competitorFeatures = new Set<string>();
          competitorsData.forEach(comp => {
            comp.features.forEach(f => competitorFeatures.add(f));
          });

          // Features that competitors have but your company doesn't
          const suggestedFeatures = Array.from(competitorFeatures).filter(f => !yourFeatures.has(f));
          setSuggestedFeatures(suggestedFeatures);
        }
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to load analysis data');
        console.error('Error fetching analysis data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-apple-gray-600">Loading analysis data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="text-red-700">{error}</div>
      </div>
    );
  }

  if (!yourCompany) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold text-apple-gray-900">Competitive Analysis</h1>
        <div className="apple-card p-6 text-center">
          <p className="text-apple-gray-500 mb-4">Please add your company information first to enable competitive analysis.</p>
          <a href="/competitors" className="apple-button py-2 px-4 text-sm inline-block">
            Add Your Company
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold text-apple-gray-900">Competitive Analysis</h1>
      
      <div className="apple-card p-6">
        <h2 className="text-xl font-semibold text-apple-gray-900 mb-6">Market Comparison</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analysisData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="yourCompany" name={yourCompany.name} fill="#0066cc" />
              <Bar dataKey="competitors" name="Competitors Avg." fill="#94a3b8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="apple-card p-6">
        <h2 className="text-xl font-semibold text-apple-gray-900 mb-6">Competitive Positioning</h2>
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name={yourCompany.name} dataKey="yourCompany" stroke="#0066cc" fill="#0066cc" fillOpacity={0.6} />
              <Radar name="Competitors Avg." dataKey="competitors" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.6} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="apple-card p-6">
        <h2 className="text-xl font-semibold text-apple-gray-900 mb-6">Feature Comparison</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-apple-gray-200">
            <thead className="bg-apple-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-apple-gray-500 uppercase tracking-wider">
                  Feature
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-apple-gray-500 uppercase tracking-wider">
                  {yourCompany.name}
                </th>
                {competitors.map(comp => (
                  <th key={comp.id} scope="col" className="px-6 py-3 text-left text-xs font-medium text-apple-gray-500 uppercase tracking-wider">
                    {comp.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-apple-gray-200">
              {comparisonData.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-apple-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-apple-gray-900">
                    {row.feature}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-apple-gray-500">
                    {row.yourCompany ? (
                      <span className="text-green-500">✓</span>
                    ) : (
                      <span className="text-red-500">✗</span>
                    )}
                  </td>
                  {competitors.map(comp => (
                    <td key={comp.id} className="px-6 py-4 whitespace-nowrap text-sm text-apple-gray-500">
                      {row.competitors[comp.name] ? (
                        <span className="text-green-500">✓</span>
                      ) : (
                        <span className="text-red-500">✗</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="apple-card p-6">
        <h2 className="text-xl font-semibold text-apple-gray-900 mb-6">Suggested Features</h2>
        <p className="text-apple-gray-500 mb-4">
          Based on our analysis, here are features that your competitors offer but your company doesn't:
        </p>
        {suggestedFeatures.length === 0 ? (
          <p className="text-apple-gray-700 italic">Your company already offers all the features that your competitors have!</p>
        ) : (
          <ul className="space-y-2">
            {suggestedFeatures.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span className="text-apple-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 