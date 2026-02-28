import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Moon, 
  Sun,
  ChevronRight,
  Key,
  Mail,
  Smartphone,
  Monitor,
  Save
} from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

const settingsSections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'language', label: 'Language', icon: Globe },
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState('profile');
  const [darkMode, setDarkMode] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl lg:text-4xl font-bold text-[#4C566A] mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
          Settings
        </h1>
        <p className="text-[#8B8E7E]">Manage your account preferences and settings.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="p-4 rounded-2xl bg-[#F8F9F6] border border-[#E0DDD4]/50 space-y-2">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={clsx(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                    isActive
                      ? 'bg-gradient-to-r from-[#E0DDD4]/50 to-transparent text-[#4C566A]'
                      : 'text-[#a8a29e] hover:text-[#5b8def] hover:bg-[#E0DDD4]/30'
                  )}
                >
                  <Icon className={clsx(
                    'w-5 h-5',
                    isActive ? 'text-[#5b8def]' : ''
                  )} />
                  <span className="font-medium">{section.label}</span>
                  <ChevronRight className={clsx(
                    'w-4 h-4 ml-auto transition-transform',
                    isActive ? 'rotate-90' : 'opacity-0'
                  )} />
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 space-y-6"
        >
          {/* Profile Section */}
          {activeSection === 'profile' && (
            <>
              <div className="p-6 rounded-2xl bg-[#F8F9F6] border border-[#E0DDD4]/30">
                <h2 className="text-xl font-semibold text-[#4C566A] mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
                  Profile Information
                </h2>
                
                <div className="flex items-start gap-6 mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#5b8def] to-[#3d7bd4] flex items-center justify-center text-white font-bold text-2xl">
                      AK
                    </div>
                    <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-[#5b8def] text-white flex items-center justify-center shadow-lg">
                      <Palette className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-[#4C566A] font-semibold text-lg">Alex Kim</h3>
                    <p className="text-[#6b7c94] text-sm mb-3">Product Lead</p>
                    <p className="text-[#6b7c94] text-sm">
                      This will be displayed on your profile and in team communications.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#8B8E7E] text-sm mb-2">Full Name</label>
                    <input 
                      type="text"
                      defaultValue="Alex Kim"
                      className="w-full px-4 py-3 rounded-xl bg-[#F1F3EE]/50 border border-[#E0DDD4]/50 text-[#4C566A] focus:outline-none focus:border-[#5E81AC] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8B8E7E] text-sm mb-2">Email Address</label>
                    <input 
                      type="email"
                      defaultValue="alex@brindra.io"
                      className="w-full px-4 py-3 rounded-xl bg-[#F1F3EE]/50 border border-[#E0DDD4]/50 text-[#4C566A] focus:outline-none focus:border-[#5E81AC] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8B8E7E] text-sm mb-2">Role</label>
                    <input 
                      type="text"
                      defaultValue="Product Lead"
                      className="w-full px-4 py-3 rounded-xl bg-[#F1F3EE]/50 border border-[#E0DDD4]/50 text-[#4C566A] focus:outline-none focus:border-[#5E81AC] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8B8E7E] text-sm mb-2">Location</label>
                    <input 
                      type="text"
                      defaultValue="San Francisco, CA"
                      className="w-full px-4 py-3 rounded-xl bg-[#F1F3EE]/50 border border-[#E0DDD4]/50 text-[#4C566A] focus:outline-none focus:border-[#5E81AC] transition-colors"
                    />
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#E0DDD4]/30 flex justify-end">
                  <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#5b8def] to-[#3d7bd4] text-white font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                    <Save className="w-5 h-5" />
                    Save Changes
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className="p-6 rounded-2xl bg-[#F8F9F6] border border-[#E0DDD4]/30">
              <h2 className="text-xl font-semibold text-[#4C566A] mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
                Notification Preferences
              </h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#E0DDD4]/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#5b8def]/20 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-[#5b8def]" />
                    </div>
                    <div>
                      <h3 className="text-[#4C566A] font-medium">Email Notifications</h3>
                      <p className="text-[#a8a29e] text-sm">Receive updates via email</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={clsx(
                      'w-14 h-8 rounded-full transition-colors relative',
                      emailNotifications ? 'bg-[#5b8def]' : 'bg-[#E0DDD4]'
                    )}
                  >
                    <div className={clsx(
                      'absolute top-1 w-6 h-6 rounded-full bg-white transition-transform',
                      emailNotifications ? 'translate-x-7' : 'translate-x-1'
                    )} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-[#E0DDD4]/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#4ade80]/20 flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-[#4ade80]" />
                    </div>
                    <div>
                      <h3 className="text-[#4C566A] font-medium">Push Notifications</h3>
                      <p className="text-[#a8a29e] text-sm">Receive updates on your device</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setPushNotifications(!pushNotifications)}
                    className={clsx(
                      'w-14 h-8 rounded-full transition-colors relative',
                      pushNotifications ? 'bg-[#5b8def]' : 'bg-[#E0DDD4]'
                    )}
                  >
                    <div className={clsx(
                      'absolute top-1 w-6 h-6 rounded-full bg-white transition-transform',
                      pushNotifications ? 'translate-x-7' : 'translate-x-1'
                    )} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Section */}
          {activeSection === 'security' && (
            <div className="p-6 rounded-2xl bg-[#F8F9F6] border border-[#E0DDD4]/30">
              <h2 className="text-xl font-semibold text-[#4C566A] mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
                Security Settings
              </h2>

              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-[#E0DDD4]/20 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#f472b6]/20 flex items-center justify-center">
                      <Key className="w-6 h-6 text-[#f472b6]" />
                    </div>
                    <div>
                      <h3 className="text-[#4C566A] font-medium">Password</h3>
                      <p className="text-[#a8a29e] text-sm">Last changed 30 days ago</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-[#E0DDD4]/50 text-[#4C566A] text-sm font-medium hover:bg-[#E0DDD4]/70 transition-colors">
                    Change
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-[#E0DDD4]/20 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#4ade80]/20 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-[#4ade80]" />
                    </div>
                    <div>
                      <h3 className="text-[#4C566A] font-medium">Two-Factor Authentication</h3>
                      <p className="text-[#a8a29e] text-sm">Add an extra layer of security</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-[#5b8def]/20 text-[#5b8def] text-sm font-medium hover:bg-[#5b8def]/30 transition-colors">
                    Enable
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Section */}
          {activeSection === 'appearance' && (
            <div className="p-6 rounded-2xl bg-[#F8F9F6] border border-[#E0DDD4]/30">
              <h2 className="text-xl font-semibold text-[#4C566A] mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
                Appearance
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[#4C566A] font-medium mb-4">Theme</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <button 
                      onClick={() => setDarkMode(true)}
                      className={clsx(
                        'p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3',
                        darkMode 
                          ? 'border-[#5b8def] bg-[#5b8def]/10' 
                          : 'border-[#E0DDD4]/30 hover:border-[#5b8def]/50'
                      )}
                    >
                      <Moon className="w-8 h-8 text-[#5b8def]" />
                      <span className="text-[#4C566A] text-sm font-medium">Dark</span>
                    </button>
                    <button 
                      onClick={() => setDarkMode(false)}
                      className={clsx(
                        'p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3',
                        !darkMode 
                          ? 'border-[#5b8def] bg-[#5b8def]/10' 
                          : 'border-[#E0DDD4]/30 hover:border-[#5b8def]/50'
                      )}
                    >
                      <Sun className="w-8 h-8 text-[#fbbf24]" />
                      <span className="text-[#4C566A] text-sm font-medium">Light</span>
                    </button>
                    <button className="p-4 rounded-xl border-2 border-[#E0DDD4]/30 hover:border-[#5b8def]/50 transition-all flex flex-col items-center gap-3">
                      <Monitor className="w-8 h-8 text-[#a78bfa]" />
                      <span className="text-[#4C566A] text-sm font-medium">System</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-[#4C566A] font-medium mb-4">Accent Color</h3>
                  <div className="flex gap-3">
                    {['#5b8def', '#4ade80', '#f472b6', '#fbbf24', '#a78bfa', '#22d3ee'].map((color) => (
                      <button
                        key={color}
                        className="w-10 h-10 rounded-xl hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Language Section */}
          {activeSection === 'language' && (
            <div className="p-6 rounded-2xl bg-[#F8F9F6] border border-[#E0DDD4]/30">
              <h2 className="text-xl font-semibold text-[#4C566A] mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
                Language & Region
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-[#a8a29e] text-sm mb-2">Display Language</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-[#F1F3EE]/50 border border-[#E0DDD4]/50 text-[#4C566A] focus:outline-none focus:border-[#5b8def] transition-colors">
                    <option>English (US)</option>
                    <option>English (UK)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                    <option>Japanese</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#a8a29e] text-sm mb-2">Time Zone</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-[#F1F3EE]/50 border border-[#E0DDD4]/50 text-[#4C566A] focus:outline-none focus:border-[#5b8def] transition-colors">
                    <option>Pacific Time (PT)</option>
                    <option>Mountain Time (MT)</option>
                    <option>Central Time (CT)</option>
                    <option>Eastern Time (ET)</option>
                    <option>UTC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#a8a29e] text-sm mb-2">Date Format</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-[#F1F3EE]/50 border border-[#E0DDD4]/50 text-[#4C566A] focus:outline-none focus:border-[#5b8def] transition-colors">
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[#E0DDD4]/30 flex justify-end">
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#5b8def] to-[#3d7bd4] text-white font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}