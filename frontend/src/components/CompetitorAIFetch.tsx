'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function CompetitorAIFetch() {
  const [competitorName, setCompetitorName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('You must be logged in to perform this action');
        setLoading(false);
        return;
      }

      // Call the backend endpoint that uses Gemini AI to fetch competitor info
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/competitors/fetch_from_ai/`,
        { company_name: competitorName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(`Successfully fetched information for ${competitorName}. Redirecting to competitors list...`);
      setCompetitorName('');
      
      // Redirect to competitors page after a short delay
      setTimeout(() => {
        router.push('/competitors');
      }, 2000);
    } catch (err: any) {
      console.error('Error fetching competitor info:', err);
      setError(err.response?.data?.detail || 'Failed to fetch competitor information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apple-card p-6">
      <h2 className="text-xl font-semibold text-apple-gray-900 mb-2">Add Competitor with AI</h2>
      <p className="text-apple-gray-500 mb-6">
        Enter a competitor name and our AI will automatically research and add them to your dashboard.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="competitorName" className="block text-sm font-medium text-apple-gray-700 mb-1">
            Competitor Name
          </label>
          <input
            id="competitorName"
            name="competitorName"
            type="text"
            required
            className="apple-input"
            placeholder="e.g., Microsoft, Amazon, Google"
            value={competitorName}
            onChange={(e) => setCompetitorName(e.target.value)}
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="text-green-500 text-sm text-center bg-green-50 p-3 rounded-lg">
            {success}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={loading}
            className="apple-button w-full"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Fetching competitor data...
              </span>
            ) : (
              'Fetch Competitor Data'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 