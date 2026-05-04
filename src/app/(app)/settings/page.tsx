'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Toggle from '@/components/ui/Toggle';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const TABS = ['Profile', 'Preferences', 'Account'];

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('Profile');
  const [displayName, setDisplayName] = useState(session?.user?.name || '');
  const [mapProvider, setMapProvider] = useState('google');
  const [defaultSector, setDefaultSector] = useState('all');
  const [highContrast, setHighContrast] = useState(false);

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-on-surface tracking-tight">Settings</h1>
        <p className="text-sm text-on-surface-variant mt-1">Manage your profile, preferences, and account security.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sub-nav */}
        <nav className="md:w-48 shrink-0">
          <div className="flex md:flex-col gap-1">
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-colors ${
                  activeTab === tab ? 'bg-primary/5 text-primary border border-primary/20' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                }`}>
                {tab}
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <div className="flex-1 space-y-8">
          {activeTab === 'Profile' && (
            <section>
              <h2 className="text-lg font-bold text-on-surface mb-4">Profile</h2>
              <div className="bg-surface-container border border-outline-variant rounded-xl p-6 space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  {session?.user?.image ? (
                    <img src={session.user.image} alt="" className="w-16 h-16 rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center">
                      <span className="text-xl font-bold text-white">{session?.user?.name?.[0] || '?'}</span>
                    </div>
                  )}
                  <Button variant="secondary" size="sm">Change Avatar</Button>
                </div>
                <Input label="Display Name" value={displayName} onChange={e => setDisplayName(e.target.value)} />
                <div>
                  <Input label="Email Address" value={session?.user?.email || ''} disabled />
                  <p className="text-xs text-on-surface-variant mt-1">Contact support to change your email address.</p>
                </div>
                <div className="flex items-center justify-between py-3 border-t border-outline-variant">
                  <div>
                    <p className="text-sm font-medium text-on-surface">Whitelist Status</p>
                    <p className="text-xs text-on-surface-variant">You are an approved early-access member.</p>
                  </div>
                  <Badge variant="success" icon="check_circle">Active</Badge>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'Preferences' && (
            <section>
              <h2 className="text-lg font-bold text-on-surface mb-4">Preferences</h2>
              <div className="bg-surface-container border border-outline-variant rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-on-surface">Map Provider</p>
                    <p className="text-xs text-on-surface-variant">Choose the default map style for discovering venues.</p>
                  </div>
                  <Select value={mapProvider} onChange={e => setMapProvider(e.target.value)}
                    options={[{ value: 'google', label: 'Google Maps' }, { value: 'mapbox', label: 'Mapbox Dark' }]}
                    className="w-40" />
                </div>
                <div className="border-t border-outline-variant" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-on-surface">Default Sector</p>
                    <p className="text-xs text-on-surface-variant">Set your primary neighborhood for quicker filtering.</p>
                  </div>
                  <Select value={defaultSector} onChange={e => setDefaultSector(e.target.value)}
                    options={[
                      { value: 'all', label: 'All Sectors' },
                      ...Array.from({length: 6}, (_, i) => ({ value: `Sector ${i+1}`, label: `Sector ${i+1}` })),
                    ]}
                    className="w-40" />
                </div>
                <div className="border-t border-outline-variant" />
                <Toggle enabled={highContrast} onChange={setHighContrast}
                  label="High Contrast Theme"
                  description="Force maximum contrast for readability (Obsidian theme is already dark)." />
              </div>
            </section>
          )}

          {activeTab === 'Account' && (
            <section>
              <h2 className="text-lg font-bold text-on-surface mb-4">Account</h2>
              <div className="bg-surface-container border border-outline-variant rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-on-surface">Export Data</p>
                    <p className="text-xs text-on-surface-variant">Download all your venues as JSON.</p>
                  </div>
                  <Button variant="secondary" size="sm" icon="download"
                    onClick={() => window.open('/api/venues?limit=9999', '_blank')}>
                    Export
                  </Button>
                </div>
                <div className="border-t border-outline-variant" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-error">Delete Account</p>
                    <p className="text-xs text-on-surface-variant">Permanently delete your account and all data.</p>
                  </div>
                  <Button variant="danger" size="sm" icon="delete">Delete</Button>
                </div>
              </div>
            </section>
          )}

          {/* Save */}
          <div className="flex justify-end">
            <Button variant="primary" icon="save">Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
