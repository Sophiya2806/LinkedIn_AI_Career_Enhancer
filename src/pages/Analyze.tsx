import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { LinkedInProfile, AnalysisResult } from '../types';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';
import {
  Sparkles,
  FileSearch,
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Award,
  Target,
  MessageSquare,
  MapPin,
  Zap,
  Briefcase,
  GraduationCap
} from 'lucide-react';

const profileTemplate: LinkedInProfile = {
  headline: 'Senior Software Engineer | Python | AWS | Full Stack Development',
  summary: 'Experienced software engineer with 8+ years of expertise in building scalable web applications. Led multiple teams delivering enterprise solutions impacting 10M+ users. Passionate about clean code, microservices architecture, and cloud technologies.',
  experience: [
    {
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      duration: '3 years',
      description: 'Led a team of 5 engineers to build microservices architecture serving 10M+ users. Reduced system latency by 40% through optimization initiatives.'
    },
    {
      title: 'Software Engineer',
      company: 'StartupXYZ',
      duration: '2 years',
      description: 'Built full-stack applications using React, Node.js, and PostgreSQL. Contributed to 3x user growth through feature development.'
    },
    {
      title: 'Junior Developer',
      company: 'AgencyABC',
      duration: '2 years',
      description: 'Developed responsive web applications for various clients. Mentored interns and contributed to code reviews.'
    }
  ],
  education: [
    {
      school: 'University of Technology',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      year: '2016'
    }
  ],
  skills: [
    'Python', 'JavaScript', 'React', 'Node.js', 'AWS', 'Docker',
    'PostgreSQL', 'MongoDB', 'Git', 'Agile', 'Team Leadership',
    'Microservices', 'System Design', 'CI/CD'
  ],
  certifications: ['AWS Solutions Architect', 'Google Cloud Professional'],
  connections: 500
};

export default function Analyze() {
  const { session } = useAuth();
  const [profile, setProfile] = useState<LinkedInProfile>(profileTemplate);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'form' | 'results'>('form');

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/analyze-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ profile })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setAnalysis(data.analysis);
      setActiveTab('results');
    } catch (err: any) {
      setError(err.message || 'Failed to analyze profile');
    } finally {
      setLoading(false);
    }
  };

  const radarData = analysis ? [
    { subject: 'Skills', value: analysis.skillsScore, fullMark: 100 },
    { subject: 'Experience', value: analysis.experienceScore, fullMark: 100 },
    { subject: 'ATS Score', value: analysis.atsScore, fullMark: 100 },
    { subject: 'Communication', value: analysis.communicationScore, fullMark: 100 },
  ] : [];

  const barData = analysis ? [
    { name: 'Overall', score: analysis.overallScore, color: '#f97316' },
    { name: 'Skills', score: analysis.skillsScore, color: '#22c55e' },
    { name: 'Experience', score: analysis.experienceScore, color: '#3b82f6' },
    { name: 'ATS', score: analysis.atsScore, color: '#8b5cf6' },
    { name: 'Communication', score: analysis.communicationScore, color: '#ec4899' },
  ] : [];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-primary-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-primary-500 to-primary-600';
    if (score >= 40) return 'from-yellow-500 to-amber-500';
    return 'from-red-500 to-rose-500';
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 border-b border-dark-800 pb-4">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'form'
                ? 'bg-primary-500/10 text-primary-500 border border-primary-500/20'
                : 'text-dark-400 hover:text-white hover:bg-dark-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileSearch className="w-4 h-4" />
              Enter Profile
            </div>
          </button>
          {analysis && (
            <button
              onClick={() => setActiveTab('results')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'results'
                  ? 'bg-primary-500/10 text-primary-500 border border-primary-500/20'
                  : 'text-dark-400 hover:text-white hover:bg-dark-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart className="w-4 h-4" />
                View Results
              </div>
            </button>
          )}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-400">{error}</p>
          </motion.div>
        )}

        {activeTab === 'form' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Instructions */}
            <div className="bg-gradient-to-r from-primary-500/10 to-transparent rounded-xl p-4 border border-primary-500/20">
              <div className="flex items-center gap-2 text-primary-400 mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">Profile Analysis Tips</span>
              </div>
              <p className="text-dark-400 text-sm">
                Fill in your LinkedIn profile details below. You can copy-paste directly from LinkedIn or use the template provided.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Headline & Summary */}
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-dark-300 mb-2">
                    <Briefcase className="w-4 h-4" />
                    Headline
                  </label>
                  <input
                    type="text"
                    value={profile.headline || ''}
                    onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-all"
                    placeholder="Your LinkedIn headline"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-dark-300 mb-2">
                    <MessageSquare className="w-4 h-4" />
                    About / Summary
                  </label>
                  <textarea
                    value={profile.summary || ''}
                    onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
                    rows={5}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-all resize-none"
                    placeholder="Your professional summary"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-dark-300 mb-2">
                    <Target className="w-4 h-4" />
                    Skills (comma-separated)
                  </label>
                  <textarea
                    value={profile.skills?.join(', ') || ''}
                    onChange={(e) => setProfile({ ...profile, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    rows={2}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-all resize-none"
                    placeholder="Python, JavaScript, React, etc."
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-dark-300 mb-2">
                    <Award className="w-4 h-4" />
                    Certifications (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={profile.certifications?.join(', ') || ''}
                    onChange={(e) => setProfile({ ...profile, certifications: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-all"
                    placeholder="AWS Solutions Architect, PMP, etc."
                  />
                </div>
              </div>

              {/* Experience & Education */}
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-dark-300 mb-2">
                    <Briefcase className="w-4 h-4" />
                    Experience
                  </label>
                  <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2">
                    {(profile.experience || []).map((exp, index) => (
                      <div key={index} className="bg-dark-800/50 border border-dark-700/50 rounded-lg p-3">
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <input
                            type="text"
                            value={exp.title}
                            onChange={(e) => {
                              const newExp = [...(profile.experience || [])];
                              newExp[index] = { ...newExp[index], title: e.target.value };
                              setProfile({ ...profile, experience: newExp });
                            }}
                            className="bg-dark-700 border border-dark-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500"
                            placeholder="Job Title"
                          />
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => {
                              const newExp = [...(profile.experience || [])];
                              newExp[index] = { ...newExp[index], company: e.target.value };
                              setProfile({ ...profile, experience: newExp });
                            }}
                            className="bg-dark-700 border border-dark-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500"
                            placeholder="Company"
                          />
                        </div>
                        <input
                          type="text"
                          value={exp.duration}
                          onChange={(e) => {
                            const newExp = [...(profile.experience || [])];
                            newExp[index] = { ...newExp[index], duration: e.target.value };
                            setProfile({ ...profile, experience: newExp });
                          }}
                          className="w-full bg-dark-700 border border-dark-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500 mb-2"
                          placeholder="Duration"
                        />
                        <textarea
                          value={exp.description || ''}
                          onChange={(e) => {
                            const newExp = [...(profile.experience || [])];
                            newExp[index] = { ...newExp[index], description: e.target.value };
                            setProfile({ ...profile, experience: newExp });
                          }}
                          rows={2}
                          className="w-full bg-dark-700 border border-dark-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500 resize-none"
                          placeholder="Key achievements and responsibilities"
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => setProfile({
                        ...profile,
                        experience: [...(profile.experience || []), { title: '', company: '', duration: '', description: '' }]
                      })}
                      className="w-full py-2 border-2 border-dashed border-dark-700 rounded-lg text-dark-500 hover:border-primary-500 hover:text-primary-400 transition-all text-sm"
                    >
                      + Add Experience
                    </button>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-dark-300 mb-2">
                    <GraduationCap className="w-4 h-4" />
                    Education
                  </label>
                  <div className="space-y-2">
                    {(profile.education || []).map((edu, index) => (
                      <div key={index} className="bg-dark-800/50 border border-dark-700/50 rounded-lg p-3">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={edu.school}
                            onChange={(e) => {
                              const newEdu = [...(profile.education || [])];
                              newEdu[index] = { ...newEdu[index], school: e.target.value };
                              setProfile({ ...profile, education: newEdu });
                            }}
                            className="bg-dark-700 border border-dark-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500"
                            placeholder="School Name"
                          />
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => {
                              const newEdu = [...(profile.education || [])];
                              newEdu[index] = { ...newEdu[index], degree: e.target.value };
                              setProfile({ ...profile, education: newEdu });
                            }}
                            className="bg-dark-700 border border-dark-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500"
                            placeholder="Degree"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Analyze Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="flex items-center gap-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Analyzing Profile...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    Analyze My Profile
                    <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Overall Score */}
              <div className="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className={`w-40 h-40 mx-auto rounded-full bg-gradient-to-br ${getScoreGradient(analysis.overallScore)} flex items-center justify-center mb-6 shadow-2xl`}
                >
                  <div className="text-center">
                    <div className={`text-5xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                      {analysis.overallScore}
                    </div>
                    <div className="text-white/70 text-sm">/ 100</div>
                  </div>
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-2">Your LinkedIn Profile Score</h2>
                <p className="text-dark-400">
                  {analysis.overallScore >= 80
                    ? 'Excellent! Your profile is highly optimized.'
                    : analysis.overallScore >= 60
                    ? 'Good progress! Keep optimizing for better results.'
                    : 'Your profile needs optimization. Follow the suggestions below.'}
                </p>
              </div>

              {/* Charts Row */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <div className="bg-dark-800/50 border border-dark-700/50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Score Breakdown</h3>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis type="number" domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} width={80} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                          {barData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Radar Chart */}
                <div className="bg-dark-800/50 border border-dark-700/50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Profile Analysis Radar</h3>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                        <Radar
                          name="Score"
                          dataKey="value"
                          stroke="#f97316"
                          fill="#f97316"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="bg-dark-800/50 border border-green-500/20 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Strengths</h3>
                  </div>
                  <ul className="space-y-3">
                    {analysis.strengths.map((strength, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-dark-300">{strength}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="bg-dark-800/50 border border-red-500/20 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-lg bg-red-500/10">
                      <XCircle className="w-5 h-5 text-red-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Areas to Improve</h3>
                  </div>
                  <ul className="space-y-3">
                    {analysis.weaknesses.map((weakness, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <span className="text-dark-300">{weakness}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Missing Skills */}
              {analysis.missingSkills.length > 0 && (
                <div className="bg-dark-800/50 border border-primary-500/20 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-lg bg-primary-500/10">
                      <Target className="w-5 h-5 text-primary-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Missing Skills to Develop</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingSkills.map((skill, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="px-4 py-2 bg-dark-700/50 border border-primary-500/30 rounded-full text-primary-400 text-sm"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}

              {/* Improvement Suggestions */}
              <div className="bg-dark-800/50 border border-dark-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Zap className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Improvement Suggestions</h3>
                </div>
                <ul className="space-y-3">
                  {analysis.improvementSuggestions.map((suggestion, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 bg-dark-700/30 rounded-lg p-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 text-blue-400 text-sm font-medium">
                        {index + 1}
                      </div>
                      <span className="text-dark-300">{suggestion}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Career Roadmap */}
              <div className="bg-gradient-to-br from-primary-500/5 to-dark-900/50 border border-primary-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 rounded-lg bg-primary-500/10">
                    <MapPin className="w-5 h-5 text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Your Career Roadmap</h3>
                </div>
                <div className="relative">
                  {analysis.careerRoadmap.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.15 }}
                      className="relative pl-8 pb-8 last:pb-0"
                    >
                      {index !== analysis.careerRoadmap.length - 1 && (
                        <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-dark-700" />
                      )}
                      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-primary-500/30">
                        {step.step}
                      </div>
                      <div className="bg-dark-800/50 border border-dark-700/50 rounded-xl p-5 ml-4">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h4 className="font-semibold text-white">{step.title}</h4>
                          <span className="text-xs px-3 py-1 bg-primary-500/10 text-primary-400 rounded-full whitespace-nowrap">
                            {step.timeline}
                          </span>
                        </div>
                        <p className="text-dark-400 text-sm">{step.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button
                  onClick={() => {
                    setAnalysis(null);
                    setActiveTab('form');
                  }}
                  className="flex items-center justify-center gap-2 bg-dark-800 hover:bg-dark-700 border border-dark-600 hover:border-primary-500/50 text-white px-6 py-3 rounded-xl font-medium transition-all"
                >
                  <FileSearch className="w-5 h-5" />
                  Analyze Another Profile
                </button>
              </div>
            </motion.div>
          )
        )}
      </div>
    </DashboardLayout>
  );
}
