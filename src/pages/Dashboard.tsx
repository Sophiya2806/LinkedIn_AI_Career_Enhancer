import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { SavedAnalysis } from '../types';
import {
  FileSearch,
  TrendingUp,
  BarChart3,
  ArrowRight,
  Award,
  Target,
  Zap,
  Clock,
  ChevronRight
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [recentAnalyses, setRecentAnalyses] = useState<SavedAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    avgScore: 0,
    bestScore: 0
  });

  useEffect(() => {
    async function fetchAnalyses() {
      if (!user) return;

      const { data } = await supabase
        .from('linkedin_profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (data) {
        setRecentAnalyses(data);

        const allData = await supabase
          .from('linkedin_profiles')
          .select('overall_score')
          .eq('user_id', user.id);

        if (allData.data && allData.data.length > 0) {
          const scores = allData.data.map(d => d.overall_score);
          setStats({
            totalAnalyses: allData.data.length,
            avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
            bestScore: Math.max(...scores)
          });
        }
      }
      setLoading(false);
    }

    fetchAnalyses();
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent rounded-2xl p-6 sm:p-8 border border-primary-500/20"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome back, {user?.email?.split('@')[0]}!
              </h2>
              <p className="text-dark-400">
                Ready to optimize your LinkedIn profile for career success?
              </p>
            </div>
            <Link
              to="/analyze"
              className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-primary-500/25 group"
            >
              <FileSearch className="w-5 h-5" />
              Analyze Profile
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              icon: BarChart3,
              label: 'Total Analyses',
              value: stats.totalAnalyses,
              color: 'from-blue-500 to-cyan-500'
            },
            {
              icon: TrendingUp,
              label: 'Average Score',
              value: stats.avgScore,
              suffix: '/100',
              color: 'from-green-500 to-emerald-500'
            },
            {
              icon: Award,
              label: 'Best Score',
              value: stats.bestScore,
              suffix: '/100',
              color: 'from-primary-500 to-primary-600'
            },
            {
              icon: Target,
              label: 'Profile Level',
              value: stats.avgScore >= 80 ? 'Expert' : stats.avgScore >= 60 ? 'Advanced' : 'Developing',
              color: 'from-purple-500 to-pink-500'
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-dark-800/50 border border-dark-700/50 rounded-2xl p-6 hover:border-dark-600 transition-all"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-dark-400 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white">
                {stat.value}{stat.suffix || ''}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/analyze"
              className="bg-dark-800/50 border border-dark-700/50 rounded-xl p-5 hover:border-primary-500/50 hover:bg-dark-800 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-primary-500" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium mb-1">New Analysis</h4>
                  <p className="text-dark-400 text-sm">Start a fresh profile analysis</p>
                </div>
                <ChevronRight className="w-5 h-5 text-dark-500 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link
              to="/history"
              className="bg-dark-800/50 border border-dark-700/50 rounded-xl p-5 hover:border-primary-500/50 hover:bg-dark-800 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium mb-1">View History</h4>
                  <p className="text-dark-400 text-sm">See past analyses</p>
                </div>
                <ChevronRight className="w-5 h-5 text-dark-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link
              to="/settings"
              className="bg-dark-800/50 border border-dark-700/50 rounded-xl p-5 hover:border-primary-500/50 hover:bg-dark-800 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium mb-1">Set Goals</h4>
                  <p className="text-dark-400 text-sm">Define career targets</p>
                </div>
                <ChevronRight className="w-5 h-5 text-dark-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Recent Analyses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Analyses</h3>
            <Link to="/history" className="text-primary-500 hover:text-primary-400 text-sm font-medium flex items-center gap-1 group">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {recentAnalyses.length === 0 ? (
            <div className="bg-dark-800/50 border border-dark-700/50 rounded-2xl p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-dark-700/50 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-dark-500" />
              </div>
              <h4 className="text-white font-medium mb-2">No analyses yet</h4>
              <p className="text-dark-400 mb-6">Analyze your first LinkedIn profile to get started</p>
              <Link
                to="/analyze"
                className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium transition-all"
              >
                <FileSearch className="w-4 h-4" />
                Start Analysis
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAnalyses.map((analysis, index) => (
                <motion.div
                  key={analysis.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-dark-800/50 border border-dark-700/50 rounded-xl p-4 hover:border-primary-500/50 hover:bg-dark-800 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl ${
                      analysis.overall_score >= 80
                        ? 'bg-green-500/10 text-green-400'
                        : analysis.overall_score >= 60
                        ? 'bg-primary-500/10 text-primary-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {analysis.overall_score}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium truncate">
                        {analysis.profile_data?.headline || 'LinkedIn Profile Analysis'}
                      </h4>
                      <p className="text-dark-400 text-sm">
                        {new Date(analysis.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-dark-500 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
