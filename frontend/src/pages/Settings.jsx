import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
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
  LogOut,
} from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from 'react-toastify';
import api from '../api';
import { useTheme } from '../contexts/ThemeProvider';

const settingsSections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'language', label: 'Language', icon: Globe },
];

const accentPalette = ['#5E81AC', '#88C0D0', '#A3BE8C', '#E07A5F', '#4C566A', '#81A1C1'];
const languageOptions = ['English (US)', 'English (UK)', 'Spanish', 'French', 'German', 'Japanese'];
const timeZoneOptions = [
  'Asia/Kolkata',
  'UTC',
  'America/Los_Angeles',
  'America/Denver',
  'America/Chicago',
  'America/New_York',
];

export default function Settings({

  authUser,
  activePlan = 'demo',
  activeRole = null,
  canViewActivePlan = true,
  onAuthUserUpdated,
  onWorkspaceUpdated,
}) {
  const { theme, setTheme, accentColor, setAccentColor } = useTheme();

  const { handleLogout } = useAuth();
  const navigate = useNavigate();

  const handleSettingsLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      handleLogout();
      navigate('/', { replace: true });
    }
  };
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: authUser?.name || '',
    email: authUser?.email || '',
    workspaceName: authUser?.workspaceName || 'Team Workspace',
  });
  const [notifications, setNotifications] = useState({ email: true, push: false });
  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [appearance, setAppearance] = useState({ theme: 'dark', accentColor: accentColor || '#5E81AC' });
  const [language, setLanguage] = useState({
    displayLanguage: 'English (US)',
    timeZone: 'Asia/Kolkata',
  });

  const effectiveRole = activeRole || authUser?.role || 'member';
  const role = effectiveRole ? effectiveRole.replace('_', ' ') : 'member';
  const initials = (profile.name || 'User')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part?.[0]?.toUpperCase() || '')
    .join('');

  useEffect(() => {
    let isMounted = true;
    const loadSettings = async () => {
      try {
        setLoading(true);
        const response = await api.get('/auth/settings');
        if (!isMounted) return;
        const payload = response.data || {};
        const nextProfile = payload.profile || {};
        const nextSettings = payload.settings || {};
        setProfile({
          name: nextProfile.name || '',
          email: nextProfile.email || '',
          workspaceName: nextProfile.workspaceName || 'Team Workspace',
        });
        setNotifications({
          email: typeof nextSettings?.notifications?.email === 'boolean' ? nextSettings.notifications.email : true,
          push: typeof nextSettings?.notifications?.push === 'boolean' ? nextSettings.notifications.push : false,
        });
        setSecurity((prev) => ({
          ...prev,
          twoFactorEnabled:
            typeof nextSettings?.security?.twoFactorEnabled === 'boolean'
              ? nextSettings.security.twoFactorEnabled
              : false,
        }));
        setAppearance({
          theme: ['light', 'dark', 'system'].includes(nextSettings?.appearance?.theme) ? nextSettings.appearance.theme : 'dark',
          accentColor: nextSettings?.appearance?.accentColor || accentColor || '#5E81AC',
        });
        if (nextSettings?.appearance?.accentColor) setAccentColor(nextSettings.appearance.accentColor);
        const preferredTheme = ['light', 'dark', 'system'].includes(nextSettings?.appearance?.theme)
          ? nextSettings.appearance.theme
          : 'dark';
        setTheme(preferredTheme === 'system' ? resolveSystemTheme() : preferredTheme);

        setLanguage({
          displayLanguage: nextSettings?.language?.displayLanguage || 'English (US)',
          timeZone: nextSettings?.language?.timeZone || 'Asia/Kolkata',
        });
      } catch {
        toast.error('Failed to load settings');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setAppearance((prev) => (
      prev.accentColor === accentColor ? prev : { ...prev, accentColor }
    ));
  }, [accentColor]);

  const saveSettings = async (payload, successMessage) => {
    try {
      setSaving(true);
      const response = await api.put('/auth/settings', payload);
      const nextUser = response.data?.user || null;
      if (nextUser) {
        onAuthUserUpdated?.(nextUser);
        if (nextUser.workspaceName) onWorkspaceUpdated?.(nextUser.workspaceName);
      }
      toast.success(successMessage);
      return response.data;
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save settings');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handleProfileSave = async () => {
    const nextName = String(profile.name || '').trim();
    const nextEmail = String(profile.email || '').trim();
    if (!nextName || !nextEmail) {
      toast.error('Name and email are required');
      return;
    }
    await saveSettings(
      {
        name: nextName,
        email: nextEmail,
        workspaceName: String(profile.workspaceName || '').trim() || 'Team Workspace',
      },
      'Profile updated'
    );
  };

  const handleNotificationsSave = async () => {
    await saveSettings({ settings: { notifications } }, 'Notification settings updated');
  };

  const handleSecuritySave = async () => {
    const currentPassword = String(security.currentPassword || '');
    const newPassword = String(security.newPassword || '');
    const confirmPassword = String(security.confirmPassword || '');
    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword || !newPassword) {
        toast.error('Current password and new password are required');
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error('New password and confirm password do not match');
        return;
      }
      try {
        setSaving(true);
        await api.put('/auth/change-password', { currentPassword, newPassword });
        toast.success('Password updated');
        setSecurity((prev) => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to update password');
        setSaving(false);
        return;
      } finally {
        setSaving(false);
      }
    }
    await saveSettings({ settings: { security: { twoFactorEnabled: security.twoFactorEnabled } } }, 'Security settings updated');
  };

  const handleAppearanceSave = async () => {
    const selectedTheme = appearance.theme === 'system' ? resolveSystemTheme() : appearance.theme;
    setTheme(selectedTheme);
    setAccentColor(appearance.accentColor);
    await saveSettings({ settings: { appearance } }, 'Appearance updated');
  };


  const handleLanguageSave = async () => {
    await saveSettings(
      {
        settings: {
          language: {
            displayLanguage: language.displayLanguage,
            timeZone: language.timeZone,
          },
        },
      },
      'Language settings updated'
    );
  };

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

      {canViewActivePlan && (
        <section className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-default">Active Plan</p>
          <p className="mt-1 text-lg font-semibold text-primary-dusty-blue">{String(activePlan).toUpperCase()}</p>
        </section>
      )}

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
                  type="button"
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
          {loading && <p className="text-sm text-text-default">Loading settings...</p>}

          {!loading && activeSection === 'profile' && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-accent-warm-grey">Profile Information</h2>

              <div className="flex flex-col gap-4 rounded-2xl bg-background-light-sand p-4 sm:flex-row sm:items-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-primary-dusty-blue text-lg font-semibold text-background-warm-off-white">
                  {initials || 'U'}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-accent-warm-grey">{profile.name || 'User'}</h3>
                  <p className="text-sm text-text-default">{role}</p>
                  <p className="mt-1 text-xs text-text-default">This will be displayed on your profile and in team communications.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-xs font-medium text-text-default">Full Name</span>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(event) => setProfile((prev) => ({ ...prev, name: event.target.value }))}
                    className="w-full rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-2.5 text-sm text-accent-warm-grey outline-none transition focus:border-primary-soft-sky focus:ring-2 focus:ring-primary-soft-sky/30"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-medium text-text-default">Email Address</span>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(event) => setProfile((prev) => ({ ...prev, email: event.target.value }))}
                    className="w-full rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-2.5 text-sm text-accent-warm-grey outline-none transition focus:border-primary-soft-sky focus:ring-2 focus:ring-primary-soft-sky/30"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-medium text-text-default">Role</span>
                  <input
                    type="text"
                    value={role}
                    disabled
                    className="w-full rounded-xl border border-[#88C0D0]/35 bg-background-light-sand px-3 py-2.5 text-sm text-accent-warm-grey outline-none"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-medium text-text-default">Workspace</span>
                  <input
                    type="text"
                    value={profile.workspaceName}
                    onChange={(event) => setProfile((prev) => ({ ...prev, workspaceName: event.target.value }))}
                    className="w-full rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-2.5 text-sm text-accent-warm-grey outline-none transition focus:border-primary-soft-sky focus:ring-2 focus:ring-primary-soft-sky/30"
                  />
                </label>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleProfileSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary-dusty-blue px-4 py-2.5 text-sm font-medium text-background-warm-off-white transition hover:bg-primary-soft-sky disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {!loading && activeSection === 'notifications' && (
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
                    type="button"
                    onClick={() => setNotifications((prev) => ({ ...prev, email: !prev.email }))}
                    className={clsx('relative h-6 w-11 rounded-full transition', notifications.email ? 'bg-primary-dusty-blue' : 'bg-slate-300')}
                  >
                    <span
                      className={clsx(
                        'absolute top-0.5 h-5 w-5 rounded-full bg-background-warm-off-white shadow transition',
                        notifications.email ? 'left-5' : 'left-0.5'
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
                    type="button"
                    onClick={() => setNotifications((prev) => ({ ...prev, push: !prev.push }))}
                    className={clsx('relative h-6 w-11 rounded-full transition', notifications.push ? 'bg-primary-dusty-blue' : 'bg-slate-300')}
                  >
                    <span
                      className={clsx(
                        'absolute top-0.5 h-5 w-5 rounded-full bg-background-warm-off-white shadow transition',
                        notifications.push ? 'left-5' : 'left-0.5'
                      )}
                    />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNotificationsSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-primary-dusty-blue px-4 py-2.5 text-sm font-medium text-background-warm-off-white transition hover:bg-primary-soft-sky disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          )}

          {!loading && activeSection === 'security' && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-accent-warm-grey">Security Settings</h2>

              <div className="space-y-3">
                <div className="rounded-xl bg-background-light-sand p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-lg bg-background-warm-off-white p-2 text-primary-dusty-blue">
                      <Key className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-accent-warm-grey">Change Password</h3>
                      <p className="text-xs text-text-default">Use your current password to set a new one</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <input
                      type="password"
                      placeholder="Current password"
                      value={security.currentPassword}
                      onChange={(event) => setSecurity((prev) => ({ ...prev, currentPassword: event.target.value }))}
                      className="w-full rounded-lg border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-2 text-sm text-accent-warm-grey outline-none"
                    />
                    <input
                      type="password"
                      placeholder="New password"
                      value={security.newPassword}
                      onChange={(event) => setSecurity((prev) => ({ ...prev, newPassword: event.target.value }))}
                      className="w-full rounded-lg border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-2 text-sm text-accent-warm-grey outline-none"
                    />
                    <input
                      type="password"
                      placeholder="Confirm password"
                      value={security.confirmPassword}
                      onChange={(event) => setSecurity((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                      className="w-full rounded-lg border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-2 text-sm text-accent-warm-grey outline-none"
                    />
                  </div>
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
                  <button
                    type="button"
                    onClick={() => setSecurity((prev) => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))}
                    className={clsx(
                      'rounded-lg px-3 py-1.5 text-sm font-medium transition',
                      security.twoFactorEnabled
                        ? 'bg-secondary-sage-green/20 text-secondary-olive-accent'
                        : 'bg-primary-dusty-blue text-background-warm-off-white hover:bg-primary-soft-sky'
                    )}
                  >
                    {security.twoFactorEnabled ? 'Enabled' : 'Enable'}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSecuritySave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-primary-dusty-blue px-4 py-2.5 text-sm font-medium text-background-warm-off-white transition hover:bg-primary-soft-sky disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          )}

          {!loading && activeSection === 'appearance' && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-accent-warm-grey">Appearance</h2>

              <div className="space-y-4 rounded-xl bg-background-light-sand p-4">
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-accent-warm-grey">Theme</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAppearance((prev) => ({ ...prev, theme: 'dark' }));
                        setTheme('dark');

                      }}
                      className={clsx(
                        'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition',
                        appearance.theme === 'dark'
                          ? 'border-primary-dusty-blue bg-primary-dusty-blue text-background-warm-off-white'
                          : 'border-[#88C0D0]/35 bg-background-warm-off-white text-primary-dusty-blue'
                      )}
                    >
                      <Moon className="h-4 w-4" />
                      Dark
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAppearance((prev) => ({ ...prev, theme: 'light' }));
                        setTheme('light');

                      }}
                      className={clsx(
                        'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition',
                        appearance.theme === 'light'
                          ? 'border-primary-dusty-blue bg-primary-dusty-blue text-background-warm-off-white'
                          : 'border-[#88C0D0]/35 bg-background-warm-off-white text-primary-dusty-blue'
                      )}
                    >
                      <Sun className="h-4 w-4" />
                      Light
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAppearance((prev) => ({ ...prev, theme: 'system' }));
                        setTheme(resolveSystemTheme());

                      }}
                      className={clsx(
                        'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition',
                        appearance.theme === 'system'
                          ? 'border-primary-dusty-blue bg-primary-dusty-blue text-background-warm-off-white'
                          : 'border-[#88C0D0]/35 bg-background-warm-off-white text-primary-dusty-blue'
                      )}
                    >
                      <Monitor className="h-4 w-4" />
                      System
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-text-default">Current app theme: {theme || 'light'}</p>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold text-accent-warm-grey">Accent Color</h3>
                  <div className="flex flex-wrap gap-2">
                    {accentPalette.map((color, index) => (
                      <button
                        key={`${color}-${index}`}
                        type="button"
                        onClick={() => {
                          setAppearance((prev) => ({ ...prev, accentColor: color }));
                          setAccentColor(color);

                        }}
                        className={clsx(
                          'h-7 w-7 rounded-full border-2 transition',
                          appearance.accentColor === color ? 'border-accent-warm-grey scale-110' : 'border-[#D9E1D7]'
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAppearanceSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-primary-dusty-blue px-4 py-2.5 text-sm font-medium text-background-warm-off-white transition hover:bg-primary-soft-sky disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          )}

          {!loading && activeSection === 'language' && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-accent-warm-grey">Language & Region</h2>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-xs font-medium text-text-default">Display Language</span>
                  <select
                    value={language.displayLanguage}
                    onChange={(event) => setLanguage((prev) => ({ ...prev, displayLanguage: event.target.value }))}
                    className="w-full rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-2.5 text-sm text-accent-warm-grey outline-none transition focus:border-primary-soft-sky focus:ring-2 focus:ring-primary-soft-sky/30"
                  >
                    {languageOptions.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1">
                  <span className="text-xs font-medium text-text-default">Time Zone</span>
                  <select
                    value={language.timeZone}
                    onChange={(event) => setLanguage((prev) => ({ ...prev, timeZone: event.target.value }))}
                    className="w-full rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white px-3 py-2.5 text-sm text-accent-warm-grey outline-none transition focus:border-primary-soft-sky focus:ring-2 focus:ring-primary-soft-sky/30"
                  >
                    {timeZoneOptions.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>

              </div>

              <button
                type="button"
                onClick={handleLanguageSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-primary-dusty-blue px-4 py-2.5 text-sm font-medium text-background-warm-off-white transition hover:bg-primary-soft-sky disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-[#D9E1D7]">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-destructive-soft-red/10 p-4 text-destructive-danger hover:bg-destructive-soft-red/20 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">Log out</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
