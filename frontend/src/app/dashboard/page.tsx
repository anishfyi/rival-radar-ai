'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import CompanySearch from '../../components/CompanySearch';

interface Company {
  name: string;
  description: string;
  website: string;
  industry: string;
  features: string[];
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

interface MarketShareData {
  name: string;
  value: number;
}

interface TrendData {
  month: string;
  yourCompany: number;
  topCompetitor: number;
  industryAverage: number;
}

const COLORS = ['#0066cc', '#ff9500', '#30d158', '#ff3b30', '#5e5ce6', '#ff9f0a', '#64d2ff'];

export default function Dashboard() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [yourCompany, setYourCompany] = useState<Competitor | null>(null);
  const [marketShareData, setMarketShareData] = useState<MarketShareData[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [suggestedFeatures, setSuggestedFeatures] = useState<string[]>([]);
  const [recentUpdates, setRecentUpdates] = useState<{competitor: string, date: string, update: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompanies, setSelectedCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          setError('You must be logged in to view this page');
          setLoading(false);
          return;
        }

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

        // Generate market share data (mock data for demonstration)
        if (yourCompanyData && competitorsData.length > 0) {
          const marketData: MarketShareData[] = [
            { name: yourCompanyData.name, value: 35 },
          ];
          
          competitorsData.slice(0, 6).forEach((comp, index) => {
            marketData.push({
              name: comp.name,
              value: Math.floor(Math.random() * 20) + 5, // Random value between 5-25
            });
          });
          
          // Add "Others" category if there are more than 6 competitors
          if (competitorsData.length > 6) {
            const othersValue = 100 - marketData.reduce((sum, item) => sum + item.value, 0);
            marketData.push({ name: 'Others', value: othersValue > 0 ? othersValue : 5 });
          }
          
          setMarketShareData(marketData);

          // Generate trend data (mock data for demonstration)
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
          const trendData = months.map(month => {
            const baseValue = Math.floor(Math.random() * 10) + 70; // Base value between 70-80
            return {
              month,
              yourCompany: baseValue,
              topCompetitor: baseValue - Math.floor(Math.random() * 15) - 5, // 5-20 less than your company
              industryAverage: baseValue - Math.floor(Math.random() * 25) - 10, // 10-35 less than your company
            };
          });
          setTrendData(trendData);

          // Generate suggested features
          if (yourCompanyData) {
            const yourFeatures = new Set(yourCompanyData.features);
            const competitorFeatures = new Set<string>();
            competitorsData.forEach(comp => {
              comp.features.forEach(f => competitorFeatures.add(f));
            });

            // Features that competitors have but your company doesn't
            const suggestedFeatures = Array.from(competitorFeatures).filter(f => !yourFeatures.has(f));
            setSuggestedFeatures(suggestedFeatures.slice(0, 5)); // Show top 5 suggested features
          }

          // Generate recent updates (mock data for demonstration)
          const updates = [
            { 
              competitor: competitorsData[0]?.name || 'Competitor A', 
              date: '2 days ago', 
              update: 'Launched a new mobile app with enhanced user experience' 
            },
            { 
              competitor: competitorsData[1]?.name || 'Competitor B', 
              date: '1 week ago', 
              update: 'Updated pricing structure to target enterprise customers' 
            },
            { 
              competitor: competitorsData[2]?.name || 'Competitor C', 
              date: '2 weeks ago', 
              update: 'Released API integration with popular CRM platforms' 
            },
          ];
          setRecentUpdates(updates);
        }
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to load dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleCompanySelect = (company: Company) => {
    setSelectedCompanies(prev => [...prev, company]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-apple-gray-600">Loading dashboard data...</div>
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
        <h1 className="text-3xl font-semibold text-apple-gray-900">Dashboard</h1>
        <div className="apple-card p-6 text-center">
          <p className="text-apple-gray-500 mb-4">Please add your company information first to enable the dashboard.</p>
          <Link href="/competitors" className="apple-button py-2 px-4 text-sm inline-block">
            Add Your Company
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-apple-gray-900">Dashboard</h1>
        <div className="text-sm text-apple-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="apple-card p-6">
        <h2 className="text-lg font-semibold text-apple-gray-900 mb-4">Search Companies</h2>
        <CompanySearch 
          onCompanySelect={handleCompanySelect} 
          selectedCompanies={selectedCompanies} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="apple-card p-6">
          <h2 className="text-lg font-semibold text-apple-gray-900 mb-4">Total Competitors</h2>
          <div className="flex items-center">
            <div className="text-4xl font-bold text-apple-gray-900">{competitors.length}</div>
            <div className="ml-4 text-sm text-apple-gray-500">
              {competitors.length > 0 ? 'Active competitors being tracked' : 'No competitors added yet'}
            </div>
          </div>
          <div className="mt-4">
            <Link href="/competitors" className="text-primary-600 text-sm hover:underline">
              View all competitors →
            </Link>
          </div>
        </div>

        <div className="apple-card p-6">
          <h2 className="text-lg font-semibold text-apple-gray-900 mb-4">Feature Coverage</h2>
          <div className="flex items-center">
            {yourCompany.features.length > 0 ? (
              <>
                <div className="text-4xl font-bold text-apple-gray-900">
                  {Math.round((yourCompany.features.length / (yourCompany.features.length + suggestedFeatures.length)) * 100)}%
                </div>
                <div className="ml-4 text-sm text-apple-gray-500">
                  {yourCompany.features.length} features implemented out of {yourCompany.features.length + suggestedFeatures.length} in the market
                </div>
              </>
            ) : (
              <div className="text-sm text-apple-gray-500">
                No features added to your company yet
              </div>
            )}
          </div>
          <div className="mt-4">
            <Link href="/analysis" className="text-primary-600 text-sm hover:underline">
              View feature analysis →
            </Link>
          </div>
        </div>

        <div className="apple-card p-6">
          <h2 className="text-lg font-semibold text-apple-gray-900 mb-4">Market Position</h2>
          <div className="flex items-center">
            <div className="text-4xl font-bold text-apple-gray-900">
              {marketShareData.length > 0 ? `${marketShareData[0].value}%` : 'N/A'}
            </div>
            <div className="ml-4 text-sm text-apple-gray-500">
              Estimated market share
            </div>
          </div>
          <div className="mt-4">
            <Link href="/analysis" className="text-primary-600 text-sm hover:underline">
              View market analysis →
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="apple-card p-6">
          <h2 className="text-lg font-semibold text-apple-gray-900 mb-4">Market Share</h2>
          <div className="h-[300px]">
            {marketShareData.length > 0 ? (
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
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-apple-gray-500">No market share data available</p>
              </div>
            )}
          </div>
        </div>

        <div className="apple-card p-6">
          <h2 className="text-lg font-semibold text-apple-gray-900 mb-4">Performance Trends</h2>
          <div className="h-[300px]">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="yourCompany" name={yourCompany.name} stroke="#0066cc" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="topCompetitor" name="Top Competitor" stroke="#ff9500" />
                  <Line type="monotone" dataKey="industryAverage" name="Industry Average" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-apple-gray-500">No trend data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="apple-card p-6">
          <h2 className="text-lg font-semibold text-apple-gray-900 mb-4">Suggested Features</h2>
          {suggestedFeatures.length > 0 ? (
            <ul className="space-y-3">
              {suggestedFeatures.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <div>
                    <div className="text-apple-gray-900 font-medium">{feature}</div>
                    <div className="text-xs text-apple-gray-500">
                      Implemented by {Math.floor(Math.random() * (competitors.length - 1) + 2)} competitors
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-apple-gray-500">
              {yourCompany.features.length > 0 
                ? "Your company already offers all the features that your competitors have!" 
                : "Add features to your company to see suggestions"}
            </p>
          )}
          <div className="mt-4">
            <Link href="/analysis" className="text-primary-600 text-sm hover:underline">
              View all suggested features →
            </Link>
          </div>
        </div>

        <div className="apple-card p-6">
          <h2 className="text-lg font-semibold text-apple-gray-900 mb-4">Recent Competitor Updates</h2>
          {recentUpdates.length > 0 ? (
            <ul className="space-y-4">
              {recentUpdates.map((update, index) => (
                <li key={index} className="border-b border-apple-gray-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between">
                    <div className="font-medium text-apple-gray-900">{update.competitor}</div>
                    <div className="text-xs text-apple-gray-500">{update.date}</div>
                  </div>
                  <div className="text-sm text-apple-gray-700 mt-1">{update.update}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-apple-gray-500">No recent updates available</p>
          )}
          <div className="mt-4">
            <Link href="/competitors" className="text-primary-600 text-sm hover:underline">
              View all competitors →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 