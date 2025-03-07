'use client';

import React, { useState } from 'react';
import CompanySearch from '../../components/CompanySearch';
import CompanyComparison from '../../components/CompanyComparison';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Company {
  name: string;
  description: string;
  website: string;
  industry: string;
  features: string[];
}

export default function ComparePage() {
  const [selectedCompanies, setSelectedCompanies] = useState<Company[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleCompanySelect = (company: Company) => {
    if (selectedCompanies.length >= 2) {
      setError('You can only compare two companies at a time. Please remove one first.');
      return;
    }

    setSelectedCompanies([...selectedCompanies, company]);
    setError(null);
  };

  const handleRemoveCompany = (index: number) => {
    const newSelectedCompanies = [...selectedCompanies];
    newSelectedCompanies.splice(index, 1);
    setSelectedCompanies(newSelectedCompanies);
    setError(null);
  };

  const handleResetComparison = () => {
    setSelectedCompanies([]);
    setError(null);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold text-apple-gray-900">Compare Companies</h1>
      
      <div className="apple-card p-6">
        <h2 className="text-xl font-semibold text-apple-gray-900 mb-4">Search and Select Companies</h2>
        <p className="text-apple-gray-600 mb-6">
          Search for companies to compare. Select two companies to see a detailed comparison of their features, market share, and more.
        </p>
        
        <CompanySearch 
          onCompanySelect={handleCompanySelect}
          selectedCompanies={selectedCompanies}
        />
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
            {error}
          </div>
        )}

        {selectedCompanies.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-apple-gray-900 mb-3">Selected Companies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedCompanies.map((company, index) => (
                <div key={index} className="p-4 bg-apple-gray-50 rounded-lg border border-apple-gray-200 relative">
                  <button
                    onClick={() => handleRemoveCompany(index)}
                    className="absolute top-2 right-2 text-apple-gray-500 hover:text-apple-gray-700"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                  <h4 className="font-medium text-apple-gray-900">{company.name}</h4>
                  <p className="text-sm text-apple-gray-500 mt-1">{company.industry}</p>
                  <p className="text-sm text-apple-gray-700 mt-2 line-clamp-2">{company.description}</p>
                  
                  {company.features && company.features.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-apple-gray-500 mb-1">Key Features:</p>
                      <div className="flex flex-wrap gap-1">
                        {company.features.slice(0, 3).map((feature, idx) => (
                          <span key={idx} className="text-xs bg-white text-apple-gray-700 px-2 py-1 rounded-full border border-apple-gray-200">
                            {feature}
                          </span>
                        ))}
                        {company.features.length > 3 && (
                          <span className="text-xs bg-white text-apple-gray-700 px-2 py-1 rounded-full border border-apple-gray-200">
                            +{company.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedCompanies.length === 2 && (
        <div className="apple-card p-6">
          <CompanyComparison
            company1={selectedCompanies[0]}
            company2={selectedCompanies[1]}
            onReset={handleResetComparison}
          />
        </div>
      )}
    </div>
  );
} 