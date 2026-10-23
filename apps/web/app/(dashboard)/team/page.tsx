"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Users,
  UserPlus,
  Shield,
  ShieldAlert,
  UserCheck,
  Trash2,
  Search,
  LayoutGrid,
  List,
  Mail,
  X,
  CheckCircle2,
  AlertCircle,
  KeyRound
} from "lucide-react";

interface TeamUser {
  id?: string;
  _id?: string;
  email: string;
  role: "OWNER" | "MANAGER" | "STAFF";
  status?: string;
}

export default function TeamManagement() {
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"MANAGER" | "STAFF">("STAFF");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "OWNER" | "MANAGER" | "STAFF">("ALL");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const getToken = () => {
    return (
      document.cookie.split("; ").find((row) => row.startsWith("token="))?.split("=")[1] ||
      (typeof window !== "undefined" ? localStorage.getItem("token") || "" : "")
    );
  };

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch("/api/tenant/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(Array.isArray(data.users) ? data.users : []);
      }
    } catch (err) {
      console.error("Failed to fetch team members", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setIsSubmitting(true);

    try {
      const token = getToken();
      const res = await fetch("/api/tenant/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });

      if (res.ok) {
        setShowInviteModal(false);
        setInviteEmail("");
        setNotification({
          type: "success",
          message: `Successfully invited ${inviteEmail} as ${inviteRole}`,
        });
        setTimeout(() => setNotification(null), 4000);
        fetchTeam();
      } else {
        const errData = await res.json().catch(() => ({}));
        setNotification({
          type: "error",
          message: errData.message || "Failed to invite user. You may need OWNER or MANAGER role.",
        });
      }
    } catch (err) {
      console.error(err);
      setNotification({ type: "error", message: "Network error sending invitation" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (userId: string, role: string, email: string) => {
    if (role === "OWNER") {
      alert("The primary Owner account cannot be removed.");
      return;
    }

    if (!confirm(`Are you sure you want to revoke access for ${email}?`)) {
      return;
    }

    try {
      const token = getToken();
      const res = await fetch(`/api/tenant/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setNotification({ type: "success", message: `Revoked access for ${email}` });
        setTimeout(() => setNotification(null), 3500);
        fetchTeam();
      } else {
        const errData = await res.json().catch(() => ({}));
        setNotification({
          type: "error",
          message: errData.message || "Failed to remove user.",
        });
      }
    } catch (err) {
      console.error(err);
      setNotification({ type: "error", message: "Network error removing team member" });
    }
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch = u.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  // Groupings for Monday boards
  const adminGroup = useMemo(
    () => filteredUsers.filter((u) => u.role === "OWNER" || u.role === "MANAGER"),
    [filteredUsers]
  );
  const staffGroup = useMemo(
    () => filteredUsers.filter((u) => u.role === "STAFF"),
    [filteredUsers]
  );

  // Statistics
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "OWNER" || u.role === "MANAGER").length;
  const staffCount = users.filter((u) => u.role === "STAFF").length;

  const adminPercent = totalUsers > 0 ? (adminCount / totalUsers) * 100 : 0;
  const staffPercent = totalUsers > 0 ? (staffCount / totalUsers) * 100 : 0;

  return (
    <div className="space-y-6 animate-fade-in pb-24 md:pb-8">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 border shadow-lg animate-fade-in ${
            notification.type === "success"
              ? "bg-[#00c875]/10 border-[#00c875]/40 text-[#00c875]"
              : "bg-[#e2445c]/10 border-[#e2445c]/40 text-[#e2445c]"
          }`}
        >
          {notification.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Monday Board Breadcrumb & Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
            <span>Workspaces</span>
            <span>&rsaquo;</span>
            <span className="text-brand-400">Team Governance</span>
          </div>
          <h1 className="h2 gradient-text">Team & Access Control</h1>
          <p className="text-secondary text-sm">
            Manage authorized staff logins, roles, and administrative security privileges.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="btn btn-primary flex items-center gap-2 w-full md:w-auto justify-center shadow-lg shadow-brand-500/20 text-sm font-bold py-3 px-5"
        >
          <UserPlus size={18} />
          <span>+ Invite Member</span>
        </button>
      </div>

      {/* Monday Progress Battery Bar */}
      <div className="glass p-5 rounded-2xl border border-white/5 space-y-3">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">
              Role Allocation Battery
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white font-medium">
              {totalUsers} Active Logins
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-[#a25ddc]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#a25ddc]"></span>
              Admins & Managers ({adminCount})
            </span>
            <span className="flex items-center gap-1.5 text-[#00c875]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00c875]"></span>
              Staff / Cashiers ({staffCount})
            </span>
          </div>
        </div>

        {/* Segmented Battery */}
        <div className="monday-battery w-full h-3 rounded-full overflow-hidden flex bg-white/5">
          <div
            style={{ width: `${adminPercent}%` }}
            className="bg-[#a25ddc] transition-all duration-500 hover:brightness-110"
            title={`Admins/Managers: ${adminCount} (${Math.round(adminPercent)}%)`}
          />
          <div
            style={{ width: `${staffPercent}%` }}
            className="bg-[#00c875] transition-all duration-500 hover:brightness-110"
            title={`Store Staff: ${staffCount} (${Math.round(staffPercent)}%)`}
          />
        </div>

        {/* Monday KPI summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 border-l-4 border-l-[#a25ddc]">
            <span className="text-xs text-secondary font-medium block">Workspace Governance</span>
            <span className="text-lg font-extrabold text-white">{adminCount} Administrators</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 border-l-4 border-l-[#00c875]">
            <span className="text-xs text-secondary font-medium block">Store Floor Operators</span>
            <span className="text-lg font-extrabold text-white">{staffCount} Cashier Logins</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 border-l-4 border-l-[#0073ea]">
            <span className="text-xs text-secondary font-medium block">Seat Quota Usage</span>
            <span className="text-lg font-extrabold text-white">{totalUsers} / 10 Pro Seats</span>
          </div>
        </div>
      </div>

      {/* Monday Board Filter Bar & View Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="text"
            placeholder="Search team member by email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/80 border border-white/10 text-white placeholder-secondary text-sm focus:border-brand-500 outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Role Filters + View Mode */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1 bg-secondary/80 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setRoleFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                roleFilter === "ALL" ? "bg-brand-500 text-white" : "text-secondary hover:text-white"
              }`}
            >
              All ({users.length})
            </button>
            <button
              onClick={() => setRoleFilter("OWNER")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                roleFilter === "OWNER" ? "bg-[#a25ddc] text-white" : "text-secondary hover:text-white"
              }`}
            >
              Owner
            </button>
            <button
              onClick={() => setRoleFilter("MANAGER")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                roleFilter === "MANAGER" ? "bg-[#0073ea] text-white" : "text-secondary hover:text-white"
              }`}
            >
              Manager
            </button>
            <button
              onClick={() => setRoleFilter("STAFF")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                roleFilter === "STAFF" ? "bg-[#00c875] text-white" : "text-secondary hover:text-white"
              }`}
            >
              Staff
            </button>
          </div>

          {/* View Switcher */}
          <div className="flex items-center bg-secondary/80 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setViewMode("cards")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "cards" ? "bg-white/10 text-white" : "text-secondary hover:text-white"
              }`}
              title="Cards View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "table" ? "bg-white/10 text-white" : "text-secondary hover:text-white"
              }`}
              title="Table View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Board Content */}
      {loading ? (
        <div className="p-12 text-center text-secondary glass rounded-2xl border border-white/5">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Loading workspace team members...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-12 text-center glass rounded-2xl border border-white/5 space-y-3">
          <Users size={40} className="mx-auto text-secondary/50" />
          <h3 className="text-base font-bold text-white">No Members Match Search</h3>
          <p className="text-xs text-secondary max-w-sm mx-auto">
            Try adjusting your query or filter to view active credentials.
          </p>
        </div>
      ) : viewMode === "cards" ? (
        /* Monday Cards Board with Groups */
        <div className="space-y-8">
          {/* Group 1: Workspace Administrators */}
          {(roleFilter === "ALL" || roleFilter === "OWNER" || roleFilter === "MANAGER") &&
            adminGroup.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-[#a25ddc]"></span>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                      Workspace Administrators ({adminGroup.length})
                    </h3>
                  </div>
                  <span className="text-xs text-secondary font-medium">Full Access & Billing</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {adminGroup.map((user) => {
                    const uid = user._id || user.id || "";
                    const isOwner = user.role === "OWNER";
                    return (
                      <div
                        key={uid}
                        className="glass rounded-2xl p-5 border border-white/5 border-l-4 border-l-[#a25ddc] space-y-4 hover:border-white/20 transition-all shadow-sm"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-[#a25ddc]/20 text-[#a25ddc] font-bold flex items-center justify-center text-sm border border-[#a25ddc]/30">
                              {user.email.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-white text-base leading-tight truncate max-w-[160px] sm:max-w-[180px]">
                                {user.email.split("@")[0]}
                              </h4>
                              <span className="text-xs text-secondary truncate max-w-[160px] sm:max-w-[180px] block">
                                {user.email}
                              </span>
                            </div>
                          </div>

                          <span
                            className={`monday-pill text-xs ${
                              isOwner ? "monday-pill-review" : "monday-pill-info"
                            }`}
                          >
                            {isOwner ? "Owner" : "Manager"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-secondary">
                          <span className="flex items-center gap-1.5 text-white">
                            <Shield size={13} className="text-[#a25ddc]" />
                            {isOwner ? "Master Account" : "Store Admin"}
                          </span>
                          <span className="flex items-center gap-1 text-[#00c875]">
                            <UserCheck size={13} />
                            Active
                          </span>
                        </div>

                        {/* Quick Actions */}
                        <div className="pt-1">
                          {isOwner ? (
                            <div className="py-2.5 px-3 rounded-xl bg-white/[0.02] border border-white/5 text-center text-xs text-secondary">
                              Protected System Owner
                            </div>
                          ) : (
                            <button
                              onClick={() => handleRemove(uid, user.role, user.email)}
                              className="w-full py-2.5 px-3 rounded-xl bg-[#e2445c]/10 hover:bg-[#e2445c]/20 border border-[#e2445c]/30 text-[#e2445c] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <Trash2 size={14} />
                              <span>Revoke Access</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          {/* Group 2: Operational Team */}
          {(roleFilter === "ALL" || roleFilter === "STAFF") && staffGroup.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#00c875]"></span>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    Operational Team & Cashiers ({staffGroup.length})
                  </h3>
                </div>
                <span className="text-xs text-secondary font-medium">POS Terminal & Orders</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {staffGroup.map((user) => {
                  const uid = user._id || user.id || "";
                  return (
                    <div
                      key={uid}
                      className="glass rounded-2xl p-5 border border-white/5 border-l-4 border-l-[#00c875] space-y-4 hover:border-white/20 transition-all shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-[#00c875]/20 text-[#00c875] font-bold flex items-center justify-center text-sm border border-[#00c875]/30">
                            {user.email.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-white text-base leading-tight truncate max-w-[160px] sm:max-w-[180px]">
                              {user.email.split("@")[0]}
                            </h4>
                            <span className="text-xs text-secondary truncate max-w-[160px] sm:max-w-[180px] block">
                              {user.email}
                            </span>
                          </div>
                        </div>

                        <span className="monday-pill monday-pill-done text-xs">Staff</span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-secondary">
                        <span className="flex items-center gap-1.5 text-white">
                          <KeyRound size={13} className="text-[#00c875]" />
                          Terminal Access
                        </span>
                        <span className="flex items-center gap-1 text-[#00c875]">
                          <UserCheck size={13} />
                          Active
                        </span>
                      </div>

                      <div className="pt-1">
                        <button
                          onClick={() => handleRemove(uid, user.role, user.email)}
                          className="w-full py-2.5 px-3 rounded-xl bg-[#e2445c]/10 hover:bg-[#e2445c]/20 border border-[#e2445c]/30 text-[#e2445c] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Trash2 size={14} />
                          <span>Revoke Access</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Monday Table View */
        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.03] border-b border-white/10 text-xs font-bold text-secondary uppercase tracking-wider">
                <tr>
                  <th className="p-4">User Email</th>
                  <th className="p-4">Access Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((user) => {
                  const uid = user._id || user.id || "";
                  const isOwner = user.role === "OWNER";
                  return (
                    <tr key={uid} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 font-semibold text-white flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            isOwner
                              ? "bg-[#a25ddc]/20 text-[#a25ddc]"
                              : user.role === "MANAGER"
                              ? "bg-[#0073ea]/20 text-[#0073ea]"
                              : "bg-[#00c875]/20 text-[#00c875]"
                          }`}
                        >
                          {user.email.charAt(0).toUpperCase()}
                        </div>
                        <span>{user.email}</span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`monday-pill ${
                            isOwner
                              ? "monday-pill-review"
                              : user.role === "MANAGER"
                              ? "monday-pill-info"
                              : "monday-pill-done"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-1.5 text-xs text-[#00c875] font-semibold">
                          <span className="w-2 h-2 rounded-full bg-[#00c875]" />
                          Active
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {!isOwner && (
                          <button
                            onClick={() => handleRemove(uid, user.role, user.email)}
                            className="p-2 rounded-lg bg-[#e2445c]/10 hover:bg-[#e2445c]/20 text-[#e2445c] transition-colors"
                            title="Revoke Access"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slide-up Bottom Sheet (Mobile) / Centered Modal (Desktop) for Invite */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="glass w-full max-w-lg bg-secondary border border-white/10 rounded-t-3xl sm:rounded-2xl p-6 max-h-[90vh] overflow-y-auto space-y-5">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold text-white">Invite Team Member</h3>
                <p className="text-xs text-secondary">
                  Grant secure dashboard or POS access to an employee.
                </p>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-2 text-secondary hover:text-white rounded-full bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
                  Employee Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary" />
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="staff@yourbusiness.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-primary border border-white/10 text-white placeholder-secondary text-base focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
                  Select Permission Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setInviteRole("STAFF")}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      inviteRole === "STAFF"
                        ? "bg-[#00c875]/15 border-[#00c875] text-white"
                        : "bg-primary border-white/10 text-secondary hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00c875]" />
                      <span className="font-bold text-sm text-white">Staff Member</span>
                    </div>
                    <p className="text-xs text-secondary">Cashier POS & Sales order terminal access only.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInviteRole("MANAGER")}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      inviteRole === "MANAGER"
                        ? "bg-[#0073ea]/15 border-[#0073ea] text-white"
                        : "bg-primary border-white/10 text-secondary hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0073ea]" />
                      <span className="font-bold text-sm text-white">Store Manager</span>
                    </div>
                    <p className="text-xs text-secondary">
                      Access to analytics, inventory, and staff rosters.
                    </p>
                  </button>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="btn btn-secondary w-full py-3.5 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-full py-3.5 text-sm font-semibold flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending Invite...</span>
                    </>
                  ) : (
                    <span>Send Invite</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
