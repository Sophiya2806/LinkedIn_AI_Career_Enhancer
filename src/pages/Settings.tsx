import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  User,
  Mail,
  Lock,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Shield,
  Bell,
  Palette
} from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          email: user?.email,
          full_name: name,
          updated_at: new Date().toISOString()
        });

      if (updateError) throw updateError;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
          <p className="text-dark-400">Manage your account preferences</p>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-800/50 border border-dark-700/50 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary-500/10">
                <User className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Profile Information</h2>
                <p className="text-dark-500 text-sm">Update your personal details</p>
              </div>
            </div>

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/10 border border-green-500/50 rounded-xl p-4 mb-6 flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <p className="text-green-400 text-sm">Profile updated successfully</p>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 mb-6 flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full bg-dark-700/50 border border-dark-600 rounded-xl px-4 py-3 pl-12 text-dark-400 cursor-not-allowed"
                  />
                </div>
                <p className="text-dark-500 text-xs mt-1.5">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 pl-12 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Security Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-dark-800/50 border border-dark-700/50 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Security</h2>
                <p className="text-dark-500 text-sm">Manage your account security</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-dark-700/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-dark-500" />
                  <div>
                    <p className="text-white font-medium">Password</p>
                    <p className="text-dark-500 text-sm">Last changed: Never</p>
                  </div>
                </div>
                <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                  Change
                </button>
              </div>
            </div>
          </motion.div>

          {/* Notifications Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-dark-800/50 border border-dark-700/50 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Bell className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Notifications</h2>
                <p className="text-dark-500 text-sm">Manage your notification preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-dark-700/30 rounded-xl cursor-pointer">
                <div>
                  <p className="text-white font-medium">Email Notifications</p>
                  <p className="text-dark-500 text-sm">Receive updates about your analyses</p>
                </div>
                <div className="relative">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-dark-600 peer-focus:ring-2 peer-focus:ring-primary-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </div>
              </label>

              <label className="flex items-center justify-between p-4 bg-dark-700/30 rounded-xl cursor-pointer">
                <div>
                  <p className="text-white font-medium">Weekly Tips</p>
                  <p className="text-dark-500 text-sm">Get career advice and tips</p>
                </div>
                <div className="relative">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-dark-600 peer-focus:ring-2 peer-focus:ring-primary-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </div>
              </label>
            </div>
          </motion.div>

          {/* Appearance Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-dark-800/50 border border-dark-700/50 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-pink-500/10">
                <Palette className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Appearance</h2>
                <p className="text-dark-500 text-sm">Customize your experience</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button className="p-4 bg-dark-700/30 border-2 border-primary-500 rounded-xl text-center">
                <div className="w-6 h-6 rounded-full bg-dark-950 mx-auto mb-2" />
                <p className="text-white text-sm font-medium">Dark</p>
              </button>
              <button className="p-4 bg-dark-700/30 border border-dark-600 rounded-xl text-center opacity-50 cursor-not-allowed">
                <div className="w-6 h-6 rounded-full bg-white mx-auto mb-2" />
                <p className="text-dark-400 text-sm">Light</p>
              </button>
              <button className="p-4 bg-dark-700/30 border border-dark-600 rounded-xl text-center opacity-50 cursor-not-allowed">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-dark-950 to-white mx-auto mb-2" />
                <p className="text-dark-400 text-sm">System</p>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
