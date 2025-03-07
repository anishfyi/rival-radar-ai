'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface CompanyFormProps {
  onSuccess?: () => void;
}

export default function CompanyForm({ onSuccess }: CompanyFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    description: '',
    industry: '',
    key_features: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('You must be logged in to perform this action');
        setLoading(false);
        return;
      }

      // Convert key_features string to array
      const features = formData.key_features
        .split(',')
        .map(feature => feature.trim())
        .filter(feature => feature.length > 0);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/competitors/`,
        {
          name: formData.name,
          website: formData.website,
          description: formData.description,
          features: features,
          market_position: formData.industry,
          is_your_company: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Reset form
      setFormData({
        name: '',
        website: '',
        description: '',
        industry: '',
        key_features: '',
      });

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Redirect to dashboard
      router.push('/');
    } catch (err: any) {
      console.error('Error adding company:', err);
      setError(err.response?.data?.detail || 'Failed to add company. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apple-card p-6">
      <h2 className="text-xl font-semibold text-apple-gray-900 mb-6">Your Company Information</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-apple-gray-700 mb-1">
            Company Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="apple-input"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-apple-gray-700 mb-1">
            Website
          </label>
          <input
            id="website"
            name="website"
            type="url"
            required
            className="apple-input"
            placeholder="https://example.com"
            value={formData.website}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-apple-gray-700 mb-1">
            Industry / Market Position
          </label>
          <input
            id="industry"
            name="industry"
            type="text"
            required
            className="apple-input"
            placeholder="e.g., SaaS, E-commerce, FinTech"
            value={formData.industry}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-apple-gray-700 mb-1">
            Company Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            className="apple-input"
            placeholder="Describe your company, products, and services"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="key_features" className="block text-sm font-medium text-apple-gray-700 mb-1">
            Key Features/Capabilities (comma-separated)
          </label>
          <textarea
            id="key_features"
            name="key_features"
            rows={3}
            required
            className="apple-input"
            placeholder="e.g., AI-powered analytics, Real-time monitoring, Custom reporting"
            value={formData.key_features}
            onChange={handleChange}
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={loading}
            className="apple-button w-full"
          >
            {loading ? 'Saving...' : 'Save Company Information'}
          </button>
        </div>
      </form>
    </div>
  );
} 