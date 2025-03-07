'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import CompanyForm from '../../components/CompanyForm';
import CompetitorAIFetch from '../../components/CompetitorAIFetch';

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

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [yourCompany, setYourCompany] = useState<Competitor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddCompanyForm, setShowAddCompanyForm] = useState(false);
  const [showAddCompetitorForm, setShowAddCompetitorForm] = useState(false);

  useEffect(() => {
    const fetchCompetitors = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          setError('You must be logged in to view this page');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/competitors/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Separate your company from competitors
        const yourCompanyData = response.data.find((comp: Competitor) => comp.is_your_company);
        const competitorsData = response.data.filter((comp: Competitor) => !comp.is_your_company);

        setYourCompany(yourCompanyData || null);
        setCompetitors(competitorsData);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to load competitors');
        console.error('Error fetching competitors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitors();
  }, []);

  const handleCompanyAdded = () => {
    setShowAddCompanyForm(false);
    window.location.reload(); // Refresh to show the new data
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-apple-gray-600">Loading competitors...</div>
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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-apple-gray-900">Competitors</h1>
        <div className="flex space-x-4">
          {!yourCompany && (
            <button
              onClick={() => setShowAddCompanyForm(!showAddCompanyForm)}
              className="apple-button-secondary flex items-center"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Add Your Company
            </button>
          )}
          <button
            onClick={() => setShowAddCompetitorForm(!showAddCompetitorForm)}
            className="apple-button flex items-center"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Add Competitor
          </button>
        </div>
      </div>

      {showAddCompanyForm && (
        <CompanyForm onSuccess={handleCompanyAdded} />
      )}

      {showAddCompetitorForm && (
        <CompetitorAIFetch />
      )}

      {yourCompany && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-apple-gray-900">Your Company</h2>
          <div className="apple-card p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h3 className="text-lg font-medium text-primary-600">{yourCompany.name}</h3>
                <p className="text-sm text-apple-gray-500 mt-1">
                  <a href={yourCompany.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {yourCompany.website}
                  </a>
                </p>
                <p className="mt-4 text-apple-gray-700">{yourCompany.description}</p>
              </div>
              <div className="flex flex-col items-start md:items-end">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {yourCompany.market_position}
                </span>
                <p className="text-xs text-apple-gray-500 mt-2">
                  Last updated: {new Date(yourCompany.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="text-sm font-medium text-apple-gray-900 mb-2">Key Features</h4>
              <div className="flex flex-wrap gap-2">
                {yourCompany.features.map((feature, index) => (
                  <span key={index} className="px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-apple-gray-900">Competitor List</h2>
        {competitors.length === 0 ? (
          <div className="apple-card p-6 text-center">
            <p className="text-apple-gray-500">No competitors added yet. Add your first competitor to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {competitors.map((competitor) => (
              <div key={competitor.id} className="apple-card overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-primary-600">{competitor.name}</h3>
                      <p className="text-sm text-apple-gray-500 mt-1">
                        <a href={competitor.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {competitor.website}
                        </a>
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {competitor.market_position}
                    </span>
                  </div>
                  <p className="mt-4 text-apple-gray-700 line-clamp-3">{competitor.description}</p>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-apple-gray-900 mb-2">Key Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {competitor.features.slice(0, 5).map((feature, index) => (
                        <span key={index} className="px-3 py-1 rounded-full text-xs font-medium bg-apple-gray-100 text-apple-gray-800">
                          {feature}
                        </span>
                      ))}
                      {competitor.features.length > 5 && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-apple-gray-100 text-apple-gray-800">
                          +{competitor.features.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-apple-gray-50 px-6 py-3 border-t border-apple-gray-100 flex justify-between items-center">
                  <span className="text-xs text-apple-gray-500">
                    Last updated: {new Date(competitor.updated_at).toLocaleDateString()}
                  </span>
                  <Link 
                    href={`/competitors/${competitor.id}`}
                    className="text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 