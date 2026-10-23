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
          className={`p-4 rounded-xl flex items-center gap-3 border shadow-sm animate-fade-in ${
            notification.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle size={18} className="text-red-600 shrink-0" />
          )}
          <span className="text-sm font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Breadcrumb & Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
            <span>Workspaces</span>
            <span>&rsaquo;</span>
            <span className="text-purple-600">Team Governance</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-black">Team & Access Control</h1>
          <p className="text-zinc-600 text-sm mt-0.5">
            Manage authorized staff logins, roles, and administrative security privileges.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 w-full md:w-auto justify-center bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold py-2.5 px-5 rounded-xl shadow-md shadow-purple-600/20 transition-all cursor-pointer"
        >
          <UserPlus size={18} />
          <span>+ Invite Member</span>
        </button>
      </div>

      {/* Role Allocation Battery Bar */}
      <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-black">
              Role Allocation Battery
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-100 text-black font-semibold border border-zinc-200">
              {totalUsers} Active Logins
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-purple-700">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
              Admins & Managers ({adminCount})
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              Staff / Cashiers ({staffCount})
            </span>
          </div>
        </div>

        {/* Segmented Battery */}
        <div className="w-full h-3 rounded-full overflow-hidden flex bg-zinc-100">
          <div
            style={{ width: `${adminPercent}%` }}
            className="bg-purple-600 transition-all duration-500 hover:brightness-110"
            title={`Admins/Managers: ${adminCount} (${Math.round(adminPercent)}%)`}
          />
          <div
            style={{ width: `${staffPercent}%` }}
            className="bg-emerald-600 transition-all duration-500 hover:brightness-110"
            title={`Store Staff: ${staffCount} (${Math.round(staffPercent)}%)`}
          />
        </div>

        {/* KPI summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-white border border-zinc-200 border-l-4 border-l-purple-600 shadow-xs">
            <span className="text-xs text-zinc-500 font-medium block">Workspace Governance</span>
            <span className="text-lg font-extrabold text-black">{adminCount} Administrators</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-zinc-200 border-l-4 border-l-emerald-600 shadow-xs">
            <span className="text-xs text-zinc-500 font-medium block">Store Floor Operators</span>
            <span className="text-lg font-extrabold text-black">{staffCount} Cashier Logins</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-zinc-200 border-l-4 border-l-purple-500 shadow-xs">
            <span className="text-xs text-zinc-500 font-medium block">Seat Quota Usage</span>
            <span className="text-lg font-extrabold text-black">{totalUsers} / 10 Pro Seats</span>
          </div>
        </div>
      </div>

      {/* Filter Bar & View Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search team member by email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-zinc-200 text-black placeholder-zinc-400 text-sm focus:border-purple-600 outline-none transition-colors shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Role Filters + View Mode */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200 text-xs">
            <button
              onClick={() => setRoleFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                roleFilter === "ALL" ? "bg-purple-600 text-white shadow-sm" : "text-zinc-700 hover:text-black"
              }`}
            >
              All ({users.length})
            </button>
            <button
              onClick={() => setRoleFilter("OWNER")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                roleFilter === "OWNER" ? "bg-purple-600 text-white shadow-sm" : "text-zinc-700 hover:text-black"
              }`}
            >
              Owner
            </button>
            <button
              onClick={() => setRoleFilter("MANAGER")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                roleFilter === "MANAGER" ? "bg-purple-600 text-white shadow-sm" : "text-zinc-700 hover:text-black"
              }`}
            >
              Manager
            </button>
            <button
              onClick={() => setRoleFilter("STAFF")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                roleFilter === "STAFF" ? "bg-emerald-600 text-white shadow-sm" : "text-zinc-700 hover:text-black"
              }`}
            >
              Staff
            </button>
          </div>

          {/* View Switcher */}
          <div className="flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200 text-xs">
            <button
              onClick={() => setViewMode("cards")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "cards" ? "bg-white text-purple-600 shadow-sm" : "text-zinc-700 hover:text-black"
              }`}
              title="Cards View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "table" ? "bg-white text-purple-600 shadow-sm" : "text-zinc-700 hover:text-black"
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
        <div className="p-12 text-center text-zinc-500 bg-white rounded-2xl border border-zinc-200">
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium">Loading workspace team members...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-zinc-200 shadow-sm space-y-3">
          <Users size={40} className="mx-auto text-zinc-300" />
          <h3 className="text-base font-bold text-black">No Members Match Search</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Try adjusting your query or filter to view active credentials.
          </p>
        </div>
      ) : viewMode === "cards" ? (
        /* Cards Board with Groups */
        <div className="space-y-8">
          {/* Group 1: Workspace Administrators */}
          {(roleFilter === "ALL" || roleFilter === "OWNER" || roleFilter === "MANAGER") &&
            adminGroup.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-600"></span>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-black">
                      Workspace Administrators ({adminGroup.length})
                    </h3>
                  </div>
                  <span className="text-xs text-zinc-500 font-medium">Full Access & Billing</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {adminGroup.map((user) => {
                    const uid = user._id || user.id || "";
                    const isOwner = user.role === "OWNER";
                    return (
                      <div
                        key={uid}
                        className="bg-white rounded-2xl p-5 border border-zinc-200 border-l-4 border-l-purple-600 space-y-4 hover:border-purple-300 hover:shadow-md transition-all shadow-sm"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm border border-purple-200">
                              {user.email.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-black text-base leading-tight truncate max-w-[160px] sm:max-w-[180px]">
                                {user.email.split("@")[0]}
                              </h4>
                              <span className="text-xs text-zinc-500 truncate max-w-[160px] sm:max-w-[180px] block">
                                {user.email}
                              </span>
                            </div>
                          </div>

                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                            {isOwner ? "Owner" : "Manager"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-xs text-zinc-500">
                          <span className="flex items-center gap-1.5 text-zinc-700 font-medium">
                            <Shield size={13} className="text-purple-600" />
                            {isOwner ? "Master Account" : "Store Admin"}
                          </span>
                          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                            <UserCheck size={13} />
                            Active
                          </span>
                        </div>

                        {/* Quick Actions */}
                        <div className="pt-1">
                          {isOwner ? (
                            <div className="py-2.5 px-3 rounded-xl bg-zinc-50 border border-zinc-200 text-center text-xs text-zinc-600 font-semibold">
                              Protected System Owner
                            </div>
                          ) : (
                            <button
                              onClick={() => handleRemove(uid, user.role, user.email)}
                              className="w-full py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
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
                  <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-black">
                    Operational Team & Cashiers ({staffGroup.length})
                  </h3>
                </div>
                <span className="text-xs text-zinc-500 font-medium">POS Terminal & Orders</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {staffGroup.map((user) => {
                  const uid = user._id || user.id || "";
                  return (
                    <div
                      key={uid}
                      className="bg-white rounded-2xl p-5 border border-zinc-200 border-l-4 border-l-emerald-600 space-y-4 hover:border-emerald-300 hover:shadow-md transition-all shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm border border-emerald-200">
                            {user.email.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-black text-base leading-tight truncate max-w-[160px] sm:max-w-[180px]">
                              {user.email.split("@")[0]}
                            </h4>
                            <span className="text-xs text-zinc-500 truncate max-w-[160px] sm:max-w-[180px] block">
                              {user.email}
                            </span>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                          Staff
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-xs text-zinc-500">
                        <span className="flex items-center gap-1.5 text-zinc-700 font-medium">
                          <KeyRound size={13} className="text-emerald-600" />
                          Terminal Access
                        </span>
                        <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                          <UserCheck size={13} />
                          Active
                        </span>
                      </div>

                      <div className="pt-1">
                        <button
                          onClick={() => handleRemove(uid, user.role, user.email)}
                          className="w-full py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
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
        /* Table View */
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-xs font-bold text-zinc-600 uppercase tracking-wider">
                <tr>
                  <th className="p-4">User Email</th>
                  <th className="p-4">Access Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredUsers.map((user) => {
                  const uid = user._id || user.id || "";
                  const isOwner = user.role === "OWNER";
                  return (
                    <tr key={uid} className="hover:bg-zinc-50 transition-colors">
                      <td className="p-4 font-semibold text-black flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            isOwner
                              ? "bg-purple-100 text-purple-700"
                              : user.role === "MANAGER"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {user.email.charAt(0).toUpperCase()}
                        </div>
                        <span>{user.email}</span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            isOwner
                              ? "bg-purple-100 text-purple-700 border border-purple-200"
                              : user.role === "MANAGER"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-emerald-600" />
                          Active
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {!isOwner && (
                          <button
                            onClick={() => handleRemove(uid, user.role, user.email)}
                            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
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

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-lg border border-zinc-200 rounded-t-3xl sm:rounded-2xl p-6 max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-zinc-200">
              <div>
                <h3 className="text-lg font-bold text-black">Invite Team Member</h3>
                <p className="text-xs text-zinc-500">
                  Grant secure dashboard or POS access to an employee.
                </p>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-2 text-zinc-500 hover:text-black rounded-full bg-zinc-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-black uppercase tracking-wider">
                  Employee Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="staff@yourbusiness.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-zinc-300 text-black placeholder-zinc-400 text-base focus:border-purple-600 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-black uppercase tracking-wider">
                  Select Permission Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setInviteRole("STAFF")}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      inviteRole === "STAFF"
                        ? "bg-purple-50 border-purple-600 text-black ring-1 ring-purple-600"
                        : "bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                      <span className="font-bold text-sm text-black">Staff Member</span>
                    </div>
                    <p className="text-xs text-zinc-500">Cashier POS & Sales order terminal access only.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInviteRole("MANAGER")}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      inviteRole === "MANAGER"
                        ? "bg-purple-50 border-purple-600 text-black ring-1 ring-purple-600"
                        : "bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                      <span className="font-bold text-sm text-black">Store Manager</span>
                    </div>
                    <p className="text-xs text-zinc-500">
                      Access to analytics, inventory, and staff rosters.
                    </p>
                  </button>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="w-full py-3.5 text-sm font-semibold rounded-xl bg-white border border-zinc-200 text-black hover:bg-zinc-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 text-sm font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2 transition-colors shadow-md shadow-purple-600/20 cursor-pointer disabled:opacity-50"
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

