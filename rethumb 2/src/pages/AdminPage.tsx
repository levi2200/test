import { useState } from 'react';

interface AdminPageProps {
  onNavigate: (page: string) => void;
  userEmail: string;
}

const MOCK_USERS = [
  { id: 1, email: 'marcus@daily.com', role: 'pro', uses: 47, joined: '2025-01-02', status: 'active', lastSeen: '2h ago' },
  { id: 2, email: 'priya@tech.io', role: 'free', uses: 2, joined: '2025-01-08', status: 'active', lastSeen: '5m ago' },
  { id: 3, email: 'jake@builds.co', role: 'partner', uses: 134, joined: '2024-12-20', status: 'active', lastSeen: '1d ago' },
  { id: 4, email: 'sarah.v@gmail.com', role: 'free', uses: 3, joined: '2025-01-09', status: 'locked', lastSeen: '3d ago' },
  { id: 5, email: 'mike.creator@gmail.com', role: 'pro', uses: 89, joined: '2024-12-15', status: 'active', lastSeen: '30m ago' },
  { id: 6, email: 'anna.tube@outlook.com', role: 'free', uses: 1, joined: '2025-01-10', status: 'active', lastSeen: '10m ago' },
  { id: 7, email: 'dean.vlogs@gmail.com', role: 'partner', uses: 210, joined: '2024-11-30', status: 'active', lastSeen: '4h ago' },
  { id: 8, email: 'test.user@mail.com', role: 'free', uses: 0, joined: '2025-01-11', status: 'active', lastSeen: 'Just now' },
];

const STATS = [
  { label: 'Total Users', value: '1,247', change: '+23 today', up: true },
  { label: 'Pro Subscribers', value: '342', change: '+8 today', up: true },
  { label: 'Generations Today', value: '2,891', change: '+12%', up: true },
  { label: 'Revenue (MRR)', value: '$684', change: '+$16', up: true },
];

const roleBadge = (role: string) => {
  const styles: Record<string, string> = {
    admin: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    pro: 'bg-brand/20 text-brand border-brand/30',
    partner: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    free: 'bg-white/5 text-white/40 border-white/10',
  };
  return `px-2.5 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${styles[role] || styles.free}`;
};

const statusBadge = (status: string) => {
  if (status === 'active') return 'bg-green-500/20 text-green-400 border-green-500/20';
  return 'bg-red-500/20 text-red-400 border-red-500/20';
};

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate, userEmail }) => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [_selectedUser, setSelectedUser] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('users');

  const filteredUsers = users.filter(u => {
    const matchFilter = filter === 'all' || u.role === filter;
    const matchSearch = u.email.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const changeRole = (userId: number, newRole: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 grid-bg">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-grotesk font-bold text-2xl text-white">Admin Panel</h1>
              <span className="px-2.5 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-purple-300 font-semibold">Admin</span>
            </div>
            <p className="text-sm text-white/40">Logged in as <span className="text-white/60">{userEmail}</span></p>
          </div>
          <button
            onClick={() => onNavigate('generate')}
            className="px-4 py-2 glass rounded-xl text-sm text-white/60 hover:text-white transition-all"
          >
            ← Back to App
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 glass rounded-xl w-fit mb-8">
          {['users', 'analytics', 'settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                activeTab === tab ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {STATS.map(({ label, value, change, up }) => (
                <div key={label} className="glass rounded-2xl p-5">
                  <div className="text-xs text-white/40 mb-2">{label}</div>
                  <div className="font-grotesk font-bold text-2xl text-white mb-1">{value}</div>
                  <div className={`text-xs font-medium ${up ? 'text-green-400' : 'text-red-400'}`}>
                    {up ? '↑' : '↓'} {change}
                  </div>
                </div>
              ))}
            </div>

            {/* User Table */}
            <div className="glass rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <h3 className="font-grotesk font-semibold text-white">Users</h3>
                <div className="flex gap-3 flex-wrap">
                  {/* Search */}
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/25 transition-all"
                    />
                  </div>
                  {/* Filter */}
                  <div className="flex gap-1">
                    {['all', 'free', 'pro', 'partner'].map(f => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                          filter === f ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto scroll-hide">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      {['Email', 'Role', 'Generations', 'Status', 'Last Seen', 'Joined', 'Actions'].map(h => (
                        <th key={h} className="text-left text-xs text-white/30 font-medium px-5 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-white/3 hover:bg-white/2 transition-all">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand/20 to-brand/5 border border-brand/20 flex items-center justify-center text-xs font-bold text-brand">
                              {user.email[0].toUpperCase()}
                            </div>
                            <span className="text-sm text-white/80">{user.email}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={roleBadge(user.role)}>{user.role}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-sm text-white/60">{user.uses}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${statusBadge(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-xs text-white/40">{user.lastSeen}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-xs text-white/40">{user.joined}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex gap-2">
                            {user.role !== 'partner' ? (
                              <button
                                onClick={() => changeRole(user.id, 'partner')}
                                className="px-2.5 py-1 text-[10px] font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-all"
                              >
                                Make Partner
                              </button>
                            ) : (
                              <button
                                onClick={() => changeRole(user.id, 'free')}
                                className="px-2.5 py-1 text-[10px] font-semibold bg-white/5 text-white/40 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
                              >
                                Remove Partner
                              </button>
                            )}
                            {user.role !== 'pro' && (
                              <button
                                onClick={() => changeRole(user.id, 'pro')}
                                className="px-2.5 py-1 text-[10px] font-semibold bg-brand/10 text-brand border border-brand/20 rounded-lg hover:bg-brand/20 transition-all"
                              >
                                Grant Pro
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-white/30">Showing {filteredUsers.length} of {users.length} users</span>
                <div className="flex gap-1">
                  <button className="px-3 py-1.5 text-xs glass rounded-lg text-white/40">← Prev</button>
                  <button className="px-3 py-1.5 text-xs bg-brand/10 rounded-lg text-brand border border-brand/20">1</button>
                  <button className="px-3 py-1.5 text-xs glass rounded-lg text-white/40">Next →</button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Generation Chart */}
              <div className="glass rounded-2xl p-6">
                <h3 className="font-grotesk font-semibold text-white text-sm mb-6">Daily Generations (Last 7 Days)</h3>
                <div className="flex items-end gap-2 h-32">
                  {[1420, 1890, 2100, 1750, 2450, 2700, 2891].map((val, i) => {
                    const pct = (val / 3000) * 100;
                    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex flex-col justify-end" style={{ height: '100px' }}>
                          <div
                            className="w-full bg-gradient-to-t from-brand to-red-400/70 rounded-t-md"
                            style={{ height: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[9px] text-white/30">{days[i]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Role Distribution */}
              <div className="glass rounded-2xl p-6">
                <h3 className="font-grotesk font-semibold text-white text-sm mb-6">User Role Distribution</h3>
                <div className="space-y-4">
                  {[
                    { role: 'Free', count: 832, color: 'bg-white/20', pct: 67 },
                    { role: 'Pro', count: 342, color: 'bg-brand', pct: 27 },
                    { role: 'Partner', count: 73, color: 'bg-blue-400', pct: 6 },
                  ].map(({ role, count, color, pct }) => (
                    <div key={role}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-white/60">{role}</span>
                        <span className="text-white/40">{count} users ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Revenue */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-grotesk font-semibold text-white text-sm mb-6">Revenue Overview</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'MRR', value: '$684' },
                  { label: 'ARR (Est.)', value: '$8,208' },
                  { label: 'New Subs Today', value: '8' },
                  { label: 'Churn Rate', value: '2.1%' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white/3 border border-white/5 rounded-xl p-4">
                    <div className="text-xs text-white/40 mb-2">{label}</div>
                    <div className="font-grotesk font-bold text-xl text-white">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-6">
            <div className="glass rounded-2xl p-6">
              <h3 className="font-grotesk font-semibold text-white text-sm mb-5">Platform Settings</h3>
              <div className="space-y-4">
                {[
                  { label: 'Free Trial Limit', desc: 'Number of free generations per user', value: '3' },
                  { label: 'Pro Price (USD/mo)', desc: 'Monthly subscription amount', value: '$2.00' },
                  { label: 'Max File Size', desc: 'Maximum upload size in MB', value: '10 MB' },
                ].map(({ label, desc, value }) => (
                  <div key={label} className="flex items-center justify-between py-3 border-b border-white/5">
                    <div>
                      <div className="text-sm font-medium text-white">{label}</div>
                      <div className="text-xs text-white/40">{desc}</div>
                    </div>
                    <div className="px-3 py-1.5 glass rounded-lg text-sm text-brand font-mono">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="font-grotesk font-semibold text-white text-sm mb-5">System Status</h3>
              <div className="space-y-3">
                {[
                  { service: 'Supabase Database', status: 'Operational' },
                  { service: 'Netlify Functions', status: 'Operational' },
                  { service: 'PayPal Webhook', status: 'Operational' },
                  { service: 'AI Generation API', status: 'Operational' },
                ].map(({ service, status }) => (
                  <div key={service} className="flex items-center justify-between">
                    <span className="text-sm text-white/60">{service}</span>
                    <span className="flex items-center gap-1.5 text-xs text-green-400">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full pulse-dot" />
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
