'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Company {
  name: string;
  description: string;
  website: string;
  industry: string;
  features: string[];
}

interface CompanySearchProps {
  onCompanySelect: (company: Company) => void;
  selectedCompanies: Company[];
}

export default function CompanySearch({ onCompanySelect, selectedCompanies }: CompanySearchProps) {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setError('You must be logged in to search');
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/competitors/search_companies/`,
        { query },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setSearchResults(response.data);
      setShowResults(true);
    } catch (err: any) {
      console.error('Error searching companies:', err);
      setError(err.response?.data?.error || 'Failed to search companies');
    } finally {
      setLoading(false);
    }
  };

  const handleCompanySelect = (company: Company) => {
    onCompanySelect(company);
    setShowResults(false);
    setQuery('');
  };

  const isCompanySelected = (company: Company) => {
    return selectedCompanies.some(c => c.name === company.name);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="relative">
        <div className="flex items-center border border-apple-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for companies..."
            className="flex-grow px-4 py-2 outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-600 text-white p-2 h-full flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <MagnifyingGlassIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-2 text-red-500 text-sm">{error}</div>
      )}

      {showResults && searchResults.length > 0 && (
        <div className="mt-4 bg-white border border-apple-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          <div className="p-2 bg-apple-gray-50 border-b border-apple-gray-200 flex justify-between items-center">
            <h3 className="text-sm font-medium text-apple-gray-700">Search Results</h3>
            <button 
              onClick={() => setShowResults(false)}
              className="text-apple-gray-500 hover:text-apple-gray-700"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
          <ul className="divide-y divide-apple-gray-200">
            {searchResults.map((company, index) => (
              <li key={index} className="p-4 hover:bg-apple-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-apple-gray-900">{company.name}</h4>
                    <p className="text-sm text-apple-gray-500 mt-1">{company.industry}</p>
                    <p className="text-sm text-apple-gray-700 mt-2 line-clamp-2">{company.description}</p>
                  </div>
                  <button
                    onClick={() => handleCompanySelect(company)}
                    disabled={isCompanySelected(company)}
                    className={`ml-4 px-3 py-1 text-sm rounded-full ${
                      isCompanySelected(company)
                        ? 'bg-apple-gray-100 text-apple-gray-500 cursor-not-allowed'
                        : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                    }`}
                  >
                    {isCompanySelected(company) ? 'Selected' : 'Select'}
                  </button>
                </div>
                {company.features && company.features.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-apple-gray-500 mb-1">Key Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {company.features.slice(0, 3).map((feature, idx) => (
                        <span key={idx} className="text-xs bg-apple-gray-100 text-apple-gray-700 px-2 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                      {company.features.length > 3 && (
                        <span className="text-xs bg-apple-gray-100 text-apple-gray-700 px-2 py-1 rounded-full">
                          +{company.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showResults && searchResults.length === 0 && (
        <div className="mt-4 p-4 bg-apple-gray-50 border border-apple-gray-200 rounded-lg text-center">
          <p className="text-apple-gray-700">No companies found matching your search.</p>
        </div>
      )}
    </div>
  );
} 