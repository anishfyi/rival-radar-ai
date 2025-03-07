'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  MagnifyingGlassIcon, 
  LightBulbIcon 
} from '@heroicons/react/24/outline';

// Inline styles as a fallback
const styles = {
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 1rem',
  },
  section: {
    padding: '4rem 0',
  },
  heading: {
    fontSize: '2.25rem',
    fontWeight: 600,
    color: '#1d1d1d',
    marginBottom: '1.5rem',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '0.85rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '1px solid #f3f3f3',
    overflow: 'hidden',
    transition: 'box-shadow 0.3s ease',
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.75rem 1.5rem',
    borderRadius: '9999px',
    fontWeight: 500,
    backgroundColor: '#0066cc',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  buttonSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.75rem 1.5rem',
    borderRadius: '9999px',
    fontWeight: 500,
    backgroundColor: '#f3f3f3',
    color: '#1d1d1d',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
};

interface DashboardStats {
  totalCompetitors: number;
  totalAnalyses: number;
  lastUpdated: string;
}

export default function Home() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCompetitors: 0,
    totalAnalyses: 0,
    lastUpdated: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);

    if (!token) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/competitors/market_overview/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStats({
          totalCompetitors: response.data.total_competitors || 0,
          totalAnalyses: response.data.recent_analyses?.length || 0,
          lastUpdated: new Date().toISOString(),
        });
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="bg-white" style={{ backgroundColor: '#ffffff' }}>
        <section className="apple-section relative overflow-hidden" style={styles.section}>
          <div className="apple-container" style={styles.container}>
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-semibold text-apple-gray-900 tracking-tight mb-6" style={styles.heading}>
                Rival Radar
              </h1>
              <p className="text-xl md:text-2xl text-apple-gray-500 mb-10 leading-relaxed" style={{ color: '#8c8c8c', fontSize: '1.25rem', marginBottom: '2.5rem' }}>
                Gain strategic insights into your competitors with AI-powered analysis. Track, compare, and visualize competitive intelligence to stay ahead in your market.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login" className="apple-button text-center" style={styles.button}>
                  Sign in
                </Link>
                <Link href="/register" className="apple-button-secondary text-center" style={styles.buttonSecondary}>
                  Create account
                </Link>
              </div>
            </div>
          </div>
          
          <div className="absolute -z-10 inset-0 overflow-hidden">
            <div className="absolute -top-[30%] -right-[20%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-primary-100 to-primary-200 blur-3xl opacity-30"></div>
            <div className="absolute -bottom-[30%] -left-[20%] w-[70%] h-[70%] rounded-full bg-gradient-to-tr from-primary-100 to-primary-200 blur-3xl opacity-30"></div>
          </div>
        </section>
        
        <section className="apple-section bg-apple-gray-50" style={{ ...styles.section, backgroundColor: '#f9f9f9' }}>
          <div className="apple-container" style={styles.container}>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-semibold text-apple-gray-900 mb-4" style={{ fontSize: '1.875rem', fontWeight: 600, color: '#1d1d1d', marginBottom: '1rem' }}>
                Powered by Google Gemini AI
              </h2>
              <p className="text-xl text-apple-gray-500 max-w-3xl mx-auto" style={{ fontSize: '1.25rem', color: '#8c8c8c', maxWidth: '48rem', margin: '0 auto' }}>
                Leverage the power of advanced AI to analyze your competitors and gain strategic insights.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div className="apple-card p-8 text-center" style={{ ...styles.card, padding: '2rem', textAlign: 'center' }}>
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6" style={{ width: '4rem', height: '4rem', borderRadius: '9999px', backgroundColor: '#eaf2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <UserGroupIcon className="h-8 w-8 text-primary-600" style={{ width: '2rem', height: '2rem', color: '#0066cc' }} />
                </div>
                <h3 className="text-xl font-semibold text-apple-gray-900 mb-3" style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1d1d1d', marginBottom: '0.75rem' }}>Competitor Tracking</h3>
                <p className="text-apple-gray-500" style={{ color: '#8c8c8c' }}>
                  Monitor your competitors' activities, features, and market positioning in real-time.
                </p>
              </div>
              
              <div className="apple-card p-8 text-center" style={{ ...styles.card, padding: '2rem', textAlign: 'center' }}>
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6" style={{ width: '4rem', height: '4rem', borderRadius: '9999px', backgroundColor: '#eaf2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <ChartBarIcon className="h-8 w-8 text-primary-600" style={{ width: '2rem', height: '2rem', color: '#0066cc' }} />
                </div>
                <h3 className="text-xl font-semibold text-apple-gray-900 mb-3" style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1d1d1d', marginBottom: '0.75rem' }}>Data Visualization</h3>
                <p className="text-apple-gray-500" style={{ color: '#8c8c8c' }}>
                  View interactive charts and graphs to understand competitive positioning at a glance.
                </p>
              </div>
              
              <div className="apple-card p-8 text-center" style={{ ...styles.card, padding: '2rem', textAlign: 'center' }}>
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6" style={{ width: '4rem', height: '4rem', borderRadius: '9999px', backgroundColor: '#eaf2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <LightBulbIcon className="h-8 w-8 text-primary-600" style={{ width: '2rem', height: '2rem', color: '#0066cc' }} />
                </div>
                <h3 className="text-xl font-semibold text-apple-gray-900 mb-3" style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1d1d1d', marginBottom: '0.75rem' }}>Strategic Insights</h3>
                <p className="text-apple-gray-500" style={{ color: '#8c8c8c' }}>
                  Get AI-generated recommendations and insights to inform your strategic decisions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="apple-section flex justify-center items-center" style={{ ...styles.section, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="text-lg text-apple-gray-600" style={{ fontSize: '1.125rem', color: '#636363' }}>Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="apple-section" style={styles.section}>
        <div className="apple-card p-6 bg-red-50 border-red-100" style={{ ...styles.card, padding: '1.5rem', backgroundColor: '#fef2f2', borderColor: '#fee2e2' }}>
          <div className="text-red-700" style={{ color: '#b91c1c' }}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="apple-section space-y-8" style={{ ...styles.section, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h1 className="text-3xl font-semibold text-apple-gray-900" style={styles.heading}>Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <div className="apple-card" style={styles.card}>
          <div className="p-6" style={{ padding: '1.5rem' }}>
            <div className="flex items-center" style={{ display: 'flex', alignItems: 'center' }}>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center" style={{ width: '3rem', height: '3rem', borderRadius: '9999px', backgroundColor: '#eaf2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserGroupIcon className="h-6 w-6 text-primary-600" style={{ width: '1.5rem', height: '1.5rem', color: '#0066cc' }} />
              </div>
              <div className="ml-4" style={{ marginLeft: '1rem' }}>
                <h3 className="text-lg font-medium text-apple-gray-900" style={{ fontSize: '1.125rem', fontWeight: 500, color: '#1d1d1d' }}>Competitors</h3>
                <p className="text-3xl font-semibold text-apple-gray-900 mt-1" style={{ fontSize: '1.875rem', fontWeight: 600, color: '#1d1d1d', marginTop: '0.25rem' }}>{stats.totalCompetitors}</p>
              </div>
            </div>
          </div>
          <div className="bg-apple-gray-50 px-6 py-3 border-t border-apple-gray-100" style={{ backgroundColor: '#f9f9f9', padding: '0.75rem 1.5rem', borderTop: '1px solid #f3f3f3' }}>
            <Link href="/competitors" className="text-sm font-medium text-primary-600 hover:text-primary-700" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#0066cc' }}>
              View all competitors
            </Link>
          </div>
        </div>

        <div className="apple-card" style={styles.card}>
          <div className="p-6" style={{ padding: '1.5rem' }}>
            <div className="flex items-center" style={{ display: 'flex', alignItems: 'center' }}>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center" style={{ width: '3rem', height: '3rem', borderRadius: '9999px', backgroundColor: '#eaf2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChartBarIcon className="h-6 w-6 text-primary-600" style={{ width: '1.5rem', height: '1.5rem', color: '#0066cc' }} />
              </div>
              <div className="ml-4" style={{ marginLeft: '1rem' }}>
                <h3 className="text-lg font-medium text-apple-gray-900" style={{ fontSize: '1.125rem', fontWeight: 500, color: '#1d1d1d' }}>Analyses</h3>
                <p className="text-3xl font-semibold text-apple-gray-900 mt-1" style={{ fontSize: '1.875rem', fontWeight: 600, color: '#1d1d1d', marginTop: '0.25rem' }}>{stats.totalAnalyses}</p>
              </div>
            </div>
          </div>
          <div className="bg-apple-gray-50 px-6 py-3 border-t border-apple-gray-100" style={{ backgroundColor: '#f9f9f9', padding: '0.75rem 1.5rem', borderTop: '1px solid #f3f3f3' }}>
            <Link href="/analysis" className="text-sm font-medium text-primary-600 hover:text-primary-700" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#0066cc' }}>
              View all analyses
            </Link>
          </div>
        </div>

        <div className="apple-card" style={styles.card}>
          <div className="p-6" style={{ padding: '1.5rem' }}>
            <div className="flex items-center" style={{ display: 'flex', alignItems: 'center' }}>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center" style={{ width: '3rem', height: '3rem', borderRadius: '9999px', backgroundColor: '#eaf2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MagnifyingGlassIcon className="h-6 w-6 text-primary-600" style={{ width: '1.5rem', height: '1.5rem', color: '#0066cc' }} />
              </div>
              <div className="ml-4" style={{ marginLeft: '1rem' }}>
                <h3 className="text-lg font-medium text-apple-gray-900" style={{ fontSize: '1.125rem', fontWeight: 500, color: '#1d1d1d' }}>Add Competitor</h3>
                <p className="text-apple-gray-500 mt-1" style={{ color: '#8c8c8c', marginTop: '0.25rem' }}>Track a new competitor</p>
              </div>
            </div>
          </div>
          <div className="bg-apple-gray-50 px-6 py-3 border-t border-apple-gray-100" style={{ backgroundColor: '#f9f9f9', padding: '0.75rem 1.5rem', borderTop: '1px solid #f3f3f3' }}>
            <Link href="/competitors/new" className="text-sm font-medium text-primary-600 hover:text-primary-700" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#0066cc' }}>
              Add competitor
            </Link>
          </div>
        </div>

        <div className="apple-card" style={styles.card}>
          <div className="p-6" style={{ padding: '1.5rem' }}>
            <div className="flex items-center" style={{ display: 'flex', alignItems: 'center' }}>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center" style={{ width: '3rem', height: '3rem', borderRadius: '9999px', backgroundColor: '#eaf2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LightBulbIcon className="h-6 w-6 text-primary-600" style={{ width: '1.5rem', height: '1.5rem', color: '#0066cc' }} />
              </div>
              <div className="ml-4" style={{ marginLeft: '1rem' }}>
                <h3 className="text-lg font-medium text-apple-gray-900" style={{ fontSize: '1.125rem', fontWeight: 500, color: '#1d1d1d' }}>AI Insights</h3>
                <p className="text-apple-gray-500 mt-1" style={{ color: '#8c8c8c', marginTop: '0.25rem' }}>Generate strategic insights</p>
              </div>
            </div>
          </div>
          <div className="bg-apple-gray-50 px-6 py-3 border-t border-apple-gray-100" style={{ backgroundColor: '#f9f9f9', padding: '0.75rem 1.5rem', borderTop: '1px solid #f3f3f3' }}>
            <Link href="/analysis" className="text-sm font-medium text-primary-600 hover:text-primary-700" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#0066cc' }}>
              Generate insights
            </Link>
          </div>
        </div>
      </div>

      <div className="apple-card p-6" style={{ ...styles.card, padding: '1.5rem' }}>
        <h2 className="text-xl font-semibold text-apple-gray-900 mb-6" style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1d1d1d', marginBottom: '1.5rem' }}>Quick Actions</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div className="bg-apple-gray-50 rounded-apple p-6" style={{ backgroundColor: '#f9f9f9', borderRadius: '0.85rem', padding: '1.5rem' }}>
            <h3 className="text-lg font-medium text-apple-gray-900 mb-2" style={{ fontSize: '1.125rem', fontWeight: 500, color: '#1d1d1d', marginBottom: '0.5rem' }}>Add a Competitor</h3>
            <p className="text-apple-gray-500 mb-4" style={{ color: '#8c8c8c', marginBottom: '1rem' }}>
              Track a new competitor and analyze their strengths and weaknesses.
            </p>
            <Link
              href="/competitors/new"
              className="apple-button py-2 px-4 text-sm inline-block"
              style={{ ...styles.button, padding: '0.5rem 1rem', fontSize: '0.875rem', display: 'inline-block' }}
            >
              Add Competitor
            </Link>
          </div>

          <div className="bg-apple-gray-50 rounded-apple p-6" style={{ backgroundColor: '#f9f9f9', borderRadius: '0.85rem', padding: '1.5rem' }}>
            <h3 className="text-lg font-medium text-apple-gray-900 mb-2" style={{ fontSize: '1.125rem', fontWeight: 500, color: '#1d1d1d', marginBottom: '0.5rem' }}>Generate Analysis</h3>
            <p className="text-apple-gray-500 mb-4" style={{ color: '#8c8c8c', marginBottom: '1rem' }}>
              Use AI to analyze your competitors and generate strategic insights.
            </p>
            <Link
              href="/analysis"
              className="apple-button py-2 px-4 text-sm inline-block"
              style={{ ...styles.button, padding: '0.5rem 1rem', fontSize: '0.875rem', display: 'inline-block' }}
            >
              Generate Analysis
            </Link>
          </div>

          <div className="bg-apple-gray-50 rounded-apple p-6" style={{ backgroundColor: '#f9f9f9', borderRadius: '0.85rem', padding: '1.5rem' }}>
            <h3 className="text-lg font-medium text-apple-gray-900 mb-2" style={{ fontSize: '1.125rem', fontWeight: 500, color: '#1d1d1d', marginBottom: '0.5rem' }}>View Competitors</h3>
            <p className="text-apple-gray-500 mb-4" style={{ color: '#8c8c8c', marginBottom: '1rem' }}>
              See all your tracked competitors and their details.
            </p>
            <Link
              href="/competitors"
              className="apple-button py-2 px-4 text-sm inline-block"
              style={{ ...styles.button, padding: '0.5rem 1rem', fontSize: '0.875rem', display: 'inline-block' }}
            >
              View Competitors
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 