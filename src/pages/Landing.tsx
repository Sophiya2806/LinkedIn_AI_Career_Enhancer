import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  Target,
  Zap,
  Award,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Linkedin
} from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'AI-Powered Analysis',
    description: 'Advanced algorithms analyze your LinkedIn profile across 15+ dimensions to identify strengths and gaps.'
  },
  {
    icon: Target,
    title: 'ATS Score Optimization',
    description: 'Get your resume past applicant tracking systems with actionable keyword and formatting suggestions.'
  },
  {
    icon: TrendingUp,
    title: 'Career Roadmap',
    description: 'Personalized step-by-step career guidance based on your current experience and target roles.'
  },
  {
    icon: Award,
    title: 'Skills Gap Analysis',
    description: 'Identify missing skills in your industry and get recommendations for certifications and courses.'
  }
];

const benefits = [
  'Increase recruiter visibility by 3x',
  'Pass ATS filters with optimized keywords',
  'Build a compelling professional narrative',
  'Get noticed by top employers',
  'Accelerate your career progression'
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-dark-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600">
                <Linkedin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
                CareerEnhancer
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-dark-300 hover:text-white transition-colors px-4 py-2"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-5 py-2 rounded-lg font-medium transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/10 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-500/20 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-dark-800/80 border border-dark-700 rounded-full px-4 py-1.5 mb-8">
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span className="text-sm text-dark-300">AI-Powered Career Intelligence</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Transform Your LinkedIn
              <br />
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                Into Opportunities
              </span>
            </h1>

            <p className="text-xl text-dark-400 max-w-2xl mx-auto mb-10">
              Get AI-powered insights on your LinkedIn profile. Optimize for recruiters,
              ATS systems, and your dream career path.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="group bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 flex items-center gap-2"
              >
                Analyze Your Profile Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features"
                className="text-dark-300 hover:text-white transition-colors px-8 py-4 flex items-center gap-2"
              >
                Learn More
              </a>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto"
          >
            {[
              { value: '98%', label: 'ATS Pass Rate' },
              { value: '3x', label: 'More Profile Views' },
              { value: '50K+', label: 'Profiles Analyzed' },
              { value: '4.9', label: 'User Rating' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-dark-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-dark-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
                Accelerate Your Career
              </span>
            </h2>
            <p className="text-dark-400 max-w-2xl mx-auto text-lg">
              Our AI analyzes every aspect of your LinkedIn profile to give you actionable insights.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-dark-800/50 border border-dark-700/50 rounded-2xl p-6 hover:border-primary-500/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Why Top Professionals{' '}
                <span className="bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
                  Choose Us
                </span>
              </h2>
              <p className="text-dark-400 mb-8 text-lg">
                Join thousands of professionals who have transformed their LinkedIn profiles
                into powerful career assets.
              </p>

              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0" />
                    <span className="text-dark-300">{benefit}</span>
                  </motion.li>
                ))}
              </ul>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 mt-8 bg-dark-800 hover:bg-dark-700 border border-dark-600 hover:border-primary-500/50 text-white px-6 py-3 rounded-xl font-medium transition-all group"
              >
                Start Your Analysis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-2xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-dark-400 text-sm">Profile Analysis Score</span>
                <Zap className="w-5 h-5 text-primary-500" />
              </div>

              <div className="text-6xl font-bold bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent mb-4">
                87<span className="text-3xl">/100</span>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Skills Match', score: 92, color: 'from-green-500 to-emerald-500' },
                  { label: 'ATS Optimization', score: 85, color: 'from-primary-500 to-primary-600' },
                  { label: 'Experience Quality', score: 88, color: 'from-blue-500 to-cyan-500' }
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-dark-400">{item.label}</span>
                      <span className="text-white font-medium">{item.score}%</span>
                    </div>
                    <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-dark-900 to-dark-950">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Transform Your Career?
            </h2>
            <p className="text-dark-400 mb-8 text-lg">
              Join 50,000+ professionals who have optimized their LinkedIn profiles.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40"
            >
              Get Started For Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-dark-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600">
                <Linkedin className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
                CareerEnhancer
              </span>
            </div>
            <p className="text-dark-500 text-sm">
              Powered by AI. Built for professionals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
