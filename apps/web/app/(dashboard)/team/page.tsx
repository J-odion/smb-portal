"use client";
import { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, UserX, UserCheck } from 'lucide-react';

export default function TeamManagement() {
  const [users, setUsers] = useState([]);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('STAFF');

  useEffect(() => {
    // Simulating fetching users
    setUsers([
      { id: '1', email: 'owner@example.com', role: 'OWNER', status: 'ACTIVE' },
      { id: '2', email: 'manager@example.com', role: 'MANAGER', status: 'ACTIVE' },
      { id: '3', email: 'staff@example.com', role: 'STAFF', status: 'PENDING' }
    ]);
  }, []);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setUsers([...users, { id: Date.now().toString(), email: inviteEmail, role: inviteRole, status: 'PENDING' }]);
    setShowInvite(false);
    setInviteEmail('');
  };

  const handleRemove = (id: string, role: string) => {
    if (role === 'OWNER') return alert('Cannot remove the owner');
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="h2 gradient-text">Team Management</h1>
          <p className="text-secondary text-sm">Manage your staff access and permissions.</p>
        </div>
        <button onClick={() => setShowInvite(!showInvite)} className="btn btn-primary flex items-center gap-2 text-sm">
          <UserPlus size={16} /> {showInvite ? 'Cancel Invite' : 'Invite Staff'}
        </button>
      </div>

      {showInvite && (
        <div className="glass p-6 rounded-lg border border-brand-500/30 mb-8 max-w-2xl">
          <h3 className="font-bold mb-4 flex items-center gap-2"><UserPlus size={18} className="text-brand-500"/> Send Invitation</h3>
          <form onSubmit={handleInvite} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="text-xs text-secondary mb-1 block">Staff Email</label>
              <input 
                type="email" 
                required 
                value={inviteEmail} 
                onChange={(e) => setInviteEmail(e.target.value)} 
                placeholder="staff@business.com" 
                className="w-full p-3 rounded bg-tertiary border border-tertiary outline-none text-sm"
              />
            </div>
            <div className="w-full md:w-48">
              <label className="text-xs text-secondary mb-1 block">Role Access</label>
              <select 
                value={inviteRole} 
                onChange={(e) => setInviteRole(e.target.value)} 
                className="w-full p-3 rounded bg-tertiary border border-tertiary outline-none text-sm"
              >
                <option value="STAFF">Staff (Limited Access)</option>
                <option value="MANAGER">Manager (Admin Access)</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary h-12 w-full md:w-auto">Send Invite</button>
          </form>
        </div>
      )}

      <div className="glass rounded-lg border border-tertiary overflow-hidden">
        <div className="p-6 border-b border-tertiary">
          <h3 className="font-bold flex items-center gap-2"><Users size={18} /> Active Team Members</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-tertiary/50">
              <tr>
                <th className="p-4 text-xs font-bold text-secondary uppercase">Email</th>
                <th className="p-4 text-xs font-bold text-secondary uppercase">Role</th>
                <th className="p-4 text-xs font-bold text-secondary uppercase">Status</th>
                <th className="p-4 text-xs font-bold text-secondary uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-tertiary last:border-0 hover:bg-tertiary/20">
                  <td className="p-4 font-medium">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 w-fit ${user.role === 'OWNER' ? 'bg-brand-500/10 text-brand-500' : user.role === 'MANAGER' ? 'bg-blue-500/10 text-blue-500' : 'bg-secondary border border-tertiary'}`}>
                      {user.role === 'OWNER' && <Shield size={12} />}
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    {user.status === 'ACTIVE' ? (
                      <span className="text-success-500 flex items-center gap-1 text-sm"><UserCheck size={14} /> Active</span>
                    ) : (
                      <span className="text-warning-500 text-sm">Pending Invite</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {user.role !== 'OWNER' && (
                      <button onClick={() => handleRemove(user.id, user.role)} className="text-danger-500 hover:text-danger-400 p-2 rounded hover:bg-danger-500/10 transition-colors" title="Remove User">
                        <UserX size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
