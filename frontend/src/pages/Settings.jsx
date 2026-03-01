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
  Save,
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

const accentPalette = ['#5E81AC', '#88C0D0', '#A3BE8C', '#E07A5F', '#5E81AC', '#88C0D0'];

export default function Settings() {
  const [activeSection, setActiveSection] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [accentColor, setAccentColor] = useState('#5E81AC');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-1"
      >
        <h1 className="text-3xl font-bold text-accent-warm-grey">Settings</h1>
        <p className="text-text-default">Manage your account preferences and settings.</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="h-fit rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-3 shadow-sm"
        >
          <div className="space-y-1">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={clsx(
                    'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition',
                    isActive
                      ? 'bg-primary-soft-sky/25 text-[#4C566A] ring-1 ring-primary-soft-sky/40'
                      : 'text-accent-warm-grey hover:bg-background-light-sand'
                  )}
                >
                  <Icon className={clsx('h-4 w-4', isActive ? 'text-primary-dusty-blue' : 'text-text-default')} />
                  <span className="flex-1">{section.label}</span>
                  <ChevronRight className={clsx('h-4 w-4', isActive ? 'text-primary-dusty-blue' : 'text-text-default')} />
                </button>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-5 shadow-sm"
        >
          {activeSection === 'profile' && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-accent-warm-grey">Profile Information</h2>

              <div className="flex flex-col gap-4 rounded-2xl bg-background-light-sand p-4 sm:flex-row sm:items-center">
                <div className="relative">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-primary-dusty-blue text-lg font-semibold text-background-warm-off-white">AK</div>
                  <button className="absolute -bottom-1 -right-1 rounded-full border border-[#D9E1D7] bg-background-warm-off-white p-1.5 text-primary-dusty-blue shadow-sm">
                    <Palette className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-accent-warm-grey">Alex Kim</h3>
                  <p className="text-sm text-text-default">Product Lead</p>
                  <p className="mt-1 text-xs text-text-default">
                    This will be displayed on your profile and in team communications.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { label: 'Full Name', value: 'Alex Kim', type: 'text' },
                  { label: 'Email Address', value: 'alex@brindra.io', type: 'email' },
                  { label: 'Role', value: 'Product Lead', type: 'text' },
                  { label: 'Location', value: 'San Francisco, CA', type: 'text' },
                ].map((field) => (
                  <label key={field.label} className="space-y-1">
                    <span className="text-xs font-medium text-text-default">{field.label}</span>
                    <input
                      type={field.type}
                      defaultValue={field.value}
                      className="w-full rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-2.5 text-sm text-accent-warm-grey outline-none transition focus:border-primary-soft-sky focus:ring-2 focus:ring-primary-soft-sky/30"
                    />
                  </label>
                ))}
              </div>

              <div className="pt-1">
                <button className="inline-flex items-center gap-2 rounded-xl bg-primary-dusty-blue px-4 py-2.5 text-sm font-medium text-background-warm-off-white transition hover:bg-primary-soft-sky">
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-accent-warm-grey">Notification Preferences</h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-background-light-sand p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-background-warm-off-white p-2 text-primary-dusty-blue">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-accent-warm-grey">Email Notifications</h3>
                      <p className="text-xs text-text-default">Receive updates via email</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={clsx(
                      'relative h-6 w-11 rounded-full transition',
                      emailNotifications ? 'bg-primary-dusty-blue' : 'bg-slate-300'
                    )}
                  >
                    <span
                      className={clsx(
                        'absolute top-0.5 h-5 w-5 rounded-full bg-background-warm-off-white shadow transition',
                        emailNotifications ? 'left-5' : 'left-0.5'
                      )}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-background-light-sand p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-background-warm-off-white p-2 text-primary-dusty-blue">
                      <Smartphone className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-accent-warm-grey">Push Notifications</h3>
                      <p className="text-xs text-text-default">Receive updates on your device</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPushNotifications(!pushNotifications)}
                    className={clsx(
                      'relative h-6 w-11 rounded-full transition',
                      pushNotifications ? 'bg-primary-dusty-blue' : 'bg-slate-300'
                    )}
                  >
                    <span
                      className={clsx(
                        'absolute top-0.5 h-5 w-5 rounded-full bg-background-warm-off-white shadow transition',
                        pushNotifications ? 'left-5' : 'left-0.5'
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-accent-warm-grey">Security Settings</h2>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-background-light-sand p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-background-warm-off-white p-2 text-primary-dusty-blue">
                      <Key className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-accent-warm-grey">Password</h3>
                      <p className="text-xs text-text-default">Last changed 30 days ago</p>
                    </div>
                  </div>
                  <button className="rounded-lg border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-1.5 text-sm font-medium text-primary-dusty-blue transition hover:bg-background-warm-off-white">
                    Change
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-background-light-sand p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-background-warm-off-white p-2 text-primary-dusty-blue">
                      <Shield className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-accent-warm-grey">Two-Factor Authentication</h3>
                      <p className="text-xs text-text-default">Add an extra layer of security</p>
                    </div>
                  </div>
                  <button className="rounded-lg bg-primary-dusty-blue px-3 py-1.5 text-sm font-medium text-background-warm-off-white transition hover:bg-primary-soft-sky">
                    Enable
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-accent-warm-grey">Appearance</h2>

              <div className="space-y-4 rounded-xl bg-background-light-sand p-4">
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-accent-warm-grey">Theme</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setDarkMode(true)}
                      className={clsx(
                        'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition',
                        darkMode
                          ? 'border-primary-dusty-blue bg-primary-dusty-blue text-background-warm-off-white'
                          : 'border-[#88C0D0]/35 bg-background-warm-off-white text-primary-dusty-blue hover:bg-background-warm-off-white'
                      )}
                    >
                      <Moon className="h-4 w-4" />
                      Dark
                    </button>
                    <button
                      onClick={() => setDarkMode(false)}
                      className={clsx(
                        'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition',
                        !darkMode
                          ? 'border-primary-dusty-blue bg-primary-dusty-blue text-background-warm-off-white'
                          : 'border-[#88C0D0]/35 bg-background-warm-off-white text-primary-dusty-blue hover:bg-background-warm-off-white'
                      )}
                    >
                      <Sun className="h-4 w-4" />
                      Light
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-lg border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-2 text-sm text-primary-dusty-blue transition hover:bg-background-warm-off-white">
                      <Monitor className="h-4 w-4" />
                      System
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold text-accent-warm-grey">Accent Color</h3>
                  <div className="flex flex-wrap gap-2">
                    {accentPalette.map((color) => (
                      <button
                        key={color}
                        onClick={() => setAccentColor(color)}
                        className={clsx('h-7 w-7 rounded-full border-2 transition', accentColor === color ? 'border-accent-warm-grey scale-110' : 'border-[#D9E1D7]')}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'language' && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-accent-warm-grey">Language & Region</h2>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-xs font-medium text-text-default">Display Language</span>
                  <select className="w-full rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-2.5 text-sm text-accent-warm-grey outline-none transition focus:border-primary-soft-sky focus:ring-2 focus:ring-primary-soft-sky/30">
                    <option>English (US)</option>
                    <option>English (UK)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                    <option>Japanese</option>
                  </select>
                </label>

                <label className="space-y-1">
                  <span className="text-xs font-medium text-text-default">Time Zone</span>
                  <select className="w-full rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-2.5 text-sm text-accent-warm-grey outline-none transition focus:border-primary-soft-sky focus:ring-2 focus:ring-primary-soft-sky/30">
                    <option>Pacific Time (PT)</option>
                    <option>Mountain Time (MT)</option>
                    <option>Central Time (CT)</option>
                    <option>Eastern Time (ET)</option>
                    <option>UTC</option>
                  </select>
                </label>

                <label className="space-y-1 sm:col-span-2">
                  <span className="text-xs font-medium text-text-default">Date Format</span>
                  <select className="w-full rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-2.5 text-sm text-accent-warm-grey outline-none transition focus:border-primary-soft-sky focus:ring-2 focus:ring-primary-soft-sky/30">
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </label>
              </div>

              <div className="pt-1">
                <button className="inline-flex items-center gap-2 rounded-xl bg-primary-dusty-blue px-4 py-2.5 text-sm font-medium text-background-warm-off-white transition hover:bg-primary-soft-sky">
                  <Save className="h-4 w-4" />
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
