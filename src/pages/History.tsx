import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { SavedAnalysis, AnalysisResult } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  Calendar,
  ChevronRight,
  Award,
  Trash2,
  X,
  CheckCircle2,
  XCircle,
  Target,
  Zap,
  MapPin
} from 'lucide-react';

export default function History() {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState<SavedAnalysis | null>(null);

  useEffect(() => {
    async function fetchAnalyses() {
      if (!user) return;

      const { data } = await supabase
        .from('linkedin_profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        setAnalyses(data);
      }
      setLoading(false);
    }

    fetchAnalyses();
  }, [user]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('linkedin_profiles')
      .delete()
      .eq('id', id);

    if (!error) {
      setAnalyses(analyses.filter(a => a.id !== id));
      if (selectedAnalysis?.id === id) {
        setSelectedAnalysis(null);
      }
    }
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-primary-500 to-primary-600';
    if (score >= 40) return 'from-yellow-500 to-amber-500';
    return 'from-red-500 to-rose-500';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-primary-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

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
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Analysis History</h1>
            <p className="text-dark-400">View and manage your past profile analyses</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">{analyses.length}</p>
            <p className="text-dark-500 text-sm">Total Analyses</p>
          </div>
        </div>

        {analyses.length === 0 ? (
          <div className="bg-dark-800/50 border border-dark-700/50 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-dark-700/50 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-dark-500" />
            </div>
            <h3 className="text-white font-medium mb-2">No analysis history</h3>
            <p className="text-dark-400">Your analyzed profiles will appear here</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* List */}
            <div className="lg:col-span-1 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
              {analyses.map((analysis, index) => (
                <motion.div
                  key={analysis.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedAnalysis(analysis)}
                  className={`bg-dark-800/50 border rounded-xl p-4 cursor-pointer transition-all ${
                    selectedAnalysis?.id === analysis.id
                      ? 'border-primary-500 bg-dark-800'
                      : 'border-dark-700/50 hover:border-primary-500/50 hover:bg-dark-800'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getScoreGradient(analysis.overall_score)} flex items-center justify-center font-bold text-lg text-white shadow-lg`}>
                      {analysis.overall_score}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate text-sm">
                        {analysis.profile_data?.headline || 'Profile Analysis'}
                      </p>
                      <p className="text-dark-500 text-xs flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(analysis.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-dark-500" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Detail View */}
            <div className="lg:col-span-2">
              {selectedAnalysis ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-dark-800/50 border border-dark-700/50 rounded-2xl p-6 space-y-6"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {selectedAnalysis.profile_data?.headline || 'Profile Analysis'}
                      </h3>
                      <p className="text-dark-400 text-sm">
                        Analyzed on {new Date(selectedAnalysis.created_at).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(selectedAnalysis.id)}
                      className="p-2 rounded-lg text-dark-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Score Display */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {[
                      { label: 'Overall', score: selectedAnalysis.analysis_result.overallScore },
                      { label: 'Skills', score: selectedAnalysis.analysis_result.skillsScore },
                      { label: 'Experience', score: selectedAnalysis.analysis_result.experienceScore },
                      { label: 'ATS', score: selectedAnalysis.analysis_result.atsScore },
                      { label: 'Communication', score: selectedAnalysis.analysis_result.communicationScore }
                    ].map((item) => (
                      <div key={item.label} className="bg-dark-700/30 rounded-xl p-3 text-center">
                        <p className={`text-2xl font-bold ${getScoreColor(item.score)}`}>
                          {item.score}
                        </p>
                        <p className="text-dark-500 text-xs">{item.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Chart */}
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Overall', score: selectedAnalysis.analysis_result.overallScore, color: '#f97316' },
                          { name: 'Skills', score: selectedAnalysis.analysis_result.skillsScore, color: '#22c55e' },
                          { name: 'Experience', score: selectedAnalysis.analysis_result.experienceScore, color: '#3b82f6' },
                          { name: 'ATS', score: selectedAnalysis.analysis_result.atsScore, color: '#8b5cf6' },
                          { name: 'Communication', score: selectedAnalysis.analysis_result.communicationScore, color: '#ec4899' },
                        ]}
                        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                          <Cell fill="#f97316" />
                          <Cell fill="#22c55e" />
                          <Cell fill="#3b82f6" />
                          <Cell fill="#8b5cf6" />
                          <Cell fill="#ec4899" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="flex items-center gap-2 text-white font-medium mb-3">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        Strengths
                      </h4>
                      <ul className="space-y-2">
                        {selectedAnalysis.analysis_result.strengths.slice(0, 3).map((s, i) => (
                          <li key={i} className="text-dark-400 text-sm flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="flex items-center gap-2 text-white font-medium mb-3">
                        <XCircle className="w-4 h-4 text-red-400" />
                        Areas to Improve
                      </h4>
                      <ul className="space-y-2">
                        {selectedAnalysis.analysis_result.weaknesses.slice(0, 3).map((w, i) => (
                          <li key={i} className="text-dark-400 text-sm flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Career Roadmap */}
                  <div>
                    <h4 className="flex items-center gap-2 text-white font-medium mb-3">
                      <MapPin className="w-4 h-4 text-primary-400" />
                      Career Roadmap
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {selectedAnalysis.analysis_result.careerRoadmap.map((step) => (
                        <div key={step.step} className="bg-dark-700/30 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="w-5 h-5 rounded-full bg-primary-500/20 text-primary-400 text-xs flex items-center justify-center">
                              {step.step}
                            </span>
                            <span className="text-white text-sm font-medium">{step.title}</span>
                          </div>
                          <p className="text-dark-500 text-xs">{step.timeline}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-dark-800/50 border border-dark-700/50 rounded-2xl p-12 text-center h-full flex items-center justify-center">
                  <div>
                    <div className="w-16 h-16 rounded-2xl bg-dark-700/50 flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-dark-500" />
                    </div>
                    <h3 className="text-white font-medium mb-2">Select an analysis</h3>
                    <p className="text-dark-400">Click on a past analysis to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
