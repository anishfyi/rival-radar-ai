'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../store';

export default function CompetitorList() {
  const { competitors, loading, error } = useSelector(
    (state: RootState) => state.competitors
  );

  if (loading) {
    return <div className="text-center py-4">Loading competitors...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-4">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {competitors.map((competitor) => (
        <div
          key={competitor.id}
          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {competitor.name}
              </h3>
              <p className="text-sm text-gray-500">{competitor.website}</p>
            </div>
            <span className="text-sm text-gray-500">
              Last updated: {new Date(competitor.lastUpdated).toLocaleDateString()}
            </span>
          </div>
          <p className="mt-2 text-gray-600">{competitor.description}</p>
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900">Features:</h4>
            <ul className="mt-2 space-y-1">
              {competitor.features.map((feature, index) => (
                <li key={index} className="text-sm text-gray-600">
                  • {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {competitor.marketPosition}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
} 