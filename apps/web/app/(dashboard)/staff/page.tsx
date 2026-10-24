"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Users,
  UserPlus,
  Phone,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Search,
  LayoutGrid,
  List,
  Briefcase,
  X,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface StaffMember {
  _id?: string;
  id?: string;
  name: string;
  phone: string;
  pay_type: "flat" | "commission";
  flat_amount?: number | null;
  commission_percent?: number | null;
  role?: string;
  created_at?: string;
}

export default function StaffPage() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [payFilter, setPayFilter] = useState<"ALL" | "flat" | "commission">("ALL");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [payType, setPayType] = useState<"flat" | "commission">("flat");
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const token = document.cookie.split("; ").find((row) => row.startsWith("token="))?.split("=")[1];
      const res = await fetch("/api/staff", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStaffMembers(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch staff", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    try {
      const token = document.cookie.split("; ").find((row) => row.startsWith("token="))?.split("=")[1];
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.get("name"),
          phone: formData.get("phone"),
          pay_type: formData.get("pay_type"),
          flat_amount: formData.get("flat_amount") ? parseFloat(formData.get("flat_amount") as string) : null,
          commission_percent: formData.get("commission_percent")
            ? parseFloat(formData.get("commission_percent") as string)
            : null,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setNotification({ type: "success", message: "Staff member added successfully" });
        setTimeout(() => setNotification(null), 3500);
        fetchStaff();
      } else {
        const errData = await res.json().catch(() => ({}));
        setNotification({
          type: "error",
          message: errData.message || "Failed to add staff member. Check permissions.",
        });
      }
    } catch (err) {
      console.error(err);
      setNotification({ type: "error", message: "Network error adding staff member" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered members
  const filteredStaff = useMemo(() => {
    return staffMembers.filter((staff) => {
      const matchesSearch =
        staff.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.phone?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = payFilter === "ALL" || staff.pay_type === payFilter;
      return matchesSearch && matchesFilter;
    });
  }, [staffMembers, searchQuery, payFilter]);

  // Groupings for Monday boards
  const fixedStaffGroup = useMemo(
    () => filteredStaff.filter((s) => s.pay_type === "flat"),
    [filteredStaff]
  );
  const commissionStaffGroup = useMemo(
    () => filteredStaff.filter((s) => s.pay_type === "commission"),
    [filteredStaff]
  );

  // Stats calculations
  const totalStaffCount = staffMembers.length;
  const flatCount = staffMembers.filter((s) => s.pay_type === "flat").length;
  const commissionCount = staffMembers.filter((s) => s.pay_type === "commission").length;
  const totalMonthlyCommitment = staffMembers
    .filter((s) => s.pay_type === "flat" && s.flat_amount)
    .reduce((sum, s) => sum + (s.flat_amount || 0), 0);

  const flatPercentage = totalStaffCount > 0 ? (flatCount / totalStaffCount) * 100 : 0;
  const commissionPercentage = totalStaffCount > 0 ? (commissionCount / totalStaffCount) * 100 : 0;

  // Format Nigerian Phone for WhatsApp
  const formatWhatsAppUrl = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    let internationalPhone = cleanPhone;
    if (cleanPhone.startsWith("0")) {
      internationalPhone = "234" + cleanPhone.slice(1);
    }
    const message = encodeURIComponent(`Hello ${name}, sharing your staff update from SMB Portal.`);
    return `https://wa.me/${internationalPhone}?text=${message}`;
  };

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
          {notification.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Board Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
            <span>Workspaces</span>
            <span>&rsaquo;</span>
            <span className="text-purple-600 font-bold">Staff & Payroll</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-black">Staff & Compensation Board</h1>
          <p className="text-zinc-500 text-sm mt-0.5">
            Manage your store associates, salary tiers, and commission percentages.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center gap-2 w-full md:w-auto justify-center shadow-sm text-sm font-bold py-2.5 px-5"
        >
          <UserPlus size={18} />
          <span>+ Add Staff Member</span>
        </button>
      </div>

      {/* Progress Battery Bar */}
      <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-700">
              Payroll Structure Battery
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-semibold border border-zinc-200">
              {totalStaffCount} Employees
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a]"></span>
              Fixed Salary ({flatCount})
            </span>
            <span className="flex items-center gap-1.5 text-amber-600">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span>
              Commission ({commissionCount})
            </span>
          </div>
        </div>

        {/* Segmented Battery */}
        <div className="monday-battery w-full h-3 rounded-full overflow-hidden flex bg-zinc-100">
          <div
            style={{ width: `${flatPercentage}%` }}
            className="bg-[#16a34a] transition-all duration-500 hover:brightness-110"
            title={`Fixed Salary: ${flatCount} (${Math.round(flatPercentage)}%)`}
          />
          <div
            style={{ width: `${commissionPercentage}%` }}
            className="bg-[#f59e0b] transition-all duration-500 hover:brightness-110"
            title={`Commission: ${commissionCount} (${Math.round(commissionPercentage)}%)`}
          />
        </div>

        {/* KPI summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 border-l-4 border-l-emerald-600">
            <span className="text-xs text-zinc-500 font-medium block">Monthly Fixed Commitment</span>
            <span className="text-lg font-extrabold text-black">
              ₦{totalMonthlyCommitment.toLocaleString()}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 border-l-4 border-l-amber-500">
            <span className="text-xs text-zinc-500 font-medium block">Commission Associates</span>
            <span className="text-lg font-extrabold text-black">{commissionCount} Members</span>
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 border-l-4 border-l-purple-600">
            <span className="text-xs text-zinc-500 font-medium block">Total Active Roster</span>
            <span className="text-lg font-extrabold text-slate-900">{totalStaffCount} Onboarded</span>
          </div>
        </div>
      </div>

      {/* Monday Board Filter Bar & View Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search staff by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:border-brand-500 outline-none transition-colors shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Pills + View Mode */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setPayFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                payFilter === "ALL" ? "bg-white text-brand-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All ({staffMembers.length})
            </button>
            <button
              onClick={() => setPayFilter("flat")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                payFilter === "flat" ? "bg-[#00c875] text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Fixed ({flatCount})
            </button>
            <button
              onClick={() => setPayFilter("commission")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                payFilter === "commission" ? "bg-[#fdab3d] text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Commission ({commissionCount})
            </button>
          </div>

          {/* View Switcher (Cards vs Table) */}
          <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode("cards")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "cards" ? "bg-white text-brand-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
              title="Cards View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "table" ? "bg-white text-brand-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
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
        <div className="p-12 text-center text-secondary bg-white rounded-2xl border border-slate-200">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium">Loading staff members from board...</p>
        </div>
      ) : filteredStaff.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <Users size={40} className="mx-auto text-slate-300" />
          <h3 className="text-base font-bold text-slate-900">No Staff Members Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? "No staff matching your search query. Clear search to see all records."
              : "You haven't added any staff members yet. Click the button below to onboard your team."}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5 font-bold"
          >
            <UserPlus size={14} />
            <span>Add First Staff Member</span>
          </button>
        </div>
      ) : viewMode === "cards" ? (
        /* Monday Cards Board with Colored Groups */
        <div className="space-y-8">
          {/* Group 1: Fixed Salary Staff */}
          {(payFilter === "ALL" || payFilter === "flat") && fixedStaffGroup.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#00c875]"></span>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Fixed Salary Staff ({fixedStaffGroup.length})
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  Subtotal: ₦
                  {fixedStaffGroup
                    .reduce((acc, curr) => acc + (curr.flat_amount || 0), 0)
                    .toLocaleString()}/mo
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {fixedStaffGroup.map((staff) => (
                  <div
                    key={staff._id || staff.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/90 border-l-4 border-l-[#00c875] space-y-4 hover:border-brand-300 hover:shadow-md transition-all shadow-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-[#00c875]/15 text-[#00c875] font-bold flex items-center justify-center text-sm border border-[#00c875]/30">
                          {staff.name
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-base leading-tight">{staff.name}</h4>
                          <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Phone size={11} /> {staff.phone}
                          </span>
                        </div>
                      </div>

                      <span className="monday-pill monday-pill-done text-xs">
                        ₦{Number(staff.flat_amount || 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Briefcase size={12} className="text-brand-600" />
                        Fixed Monthly Salary
                      </span>
                      <span className="text-slate-900 font-semibold">Active</span>
                    </div>

                    {/* Touch Ergonomic 1-Tap Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <a
                        href={formatWhatsAppUrl(staff.phone, staff.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <MessageSquare size={14} className="text-[#00c875]" />
                        <span>WhatsApp</span>
                      </a>
                      <a
                        href={`tel:${staff.phone}`}
                        className="py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Phone size={14} className="text-brand-600" />
                        <span>Call Staff</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Group 2: Commission-Based Staff */}
          {(payFilter === "ALL" || payFilter === "commission") && commissionStaffGroup.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#fdab3d]"></span>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Commission-Based Staff ({commissionStaffGroup.length})
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-medium">Performance Payouts</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {commissionStaffGroup.map((staff) => (
                  <div
                    key={staff._id || staff.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/90 border-l-4 border-l-[#fdab3d] space-y-4 hover:border-brand-300 hover:shadow-md transition-all shadow-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-[#fdab3d]/15 text-[#fdab3d] font-bold flex items-center justify-center text-sm border border-[#fdab3d]/30">
                          {staff.name
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-base leading-tight">{staff.name}</h4>
                          <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Phone size={11} /> {staff.phone}
                          </span>
                        </div>
                      </div>

                      <span className="monday-pill monday-pill-working text-xs">
                        {staff.commission_percent}% Comm
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <TrendingUp size={12} className="text-[#fdab3d]" />
                        Per Sale Commission
                      </span>
                      <span className="text-slate-900 font-semibold">Active</span>
                    </div>

                    {/* Touch Ergonomic 1-Tap Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <a
                        href={formatWhatsAppUrl(staff.phone, staff.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <MessageSquare size={14} className="text-[#00c875]" />
                        <span>WhatsApp</span>
                      </a>
                      <a
                        href={`tel:${staff.phone}`}
                        className="py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Phone size={14} className="text-brand-600" />
                        <span>Call Staff</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Monday Table View */
        <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Staff Name</th>
                  <th className="p-4">Contact Phone</th>
                  <th className="p-4">Pay Model</th>
                  <th className="p-4">Rate / Compensation</th>
                  <th className="p-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStaff.map((staff) => (
                  <tr key={staff._id || staff.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-semibold text-slate-900 flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          staff.pay_type === "flat"
                            ? "bg-[#00c875]/15 text-[#00c875]"
                            : "bg-[#fdab3d]/15 text-[#fdab3d]"
                        }`}
                      >
                        {staff.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{staff.name}</span>
                    </td>
                    <td className="p-4 text-slate-600">{staff.phone}</td>
                    <td className="p-4">
                      <span
                        className={`monday-pill ${
                          staff.pay_type === "flat" ? "monday-pill-done" : "monday-pill-working"
                        }`}
                      >
                        {staff.pay_type === "flat" ? "Fixed Salary" : "Commission"}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-900">
                      {staff.pay_type === "flat"
                        ? `₦${Number(staff.flat_amount || 0).toLocaleString()}`
                        : `${staff.commission_percent}%`}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={formatWhatsAppUrl(staff.phone, staff.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#00c875]"
                          title="WhatsApp"
                        >
                          <MessageSquare size={16} />
                        </a>
                        <a
                          href={`tel:${staff.phone}`}
                          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-brand-600"
                          title="Call"
                        >
                          <Phone size={16} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* IMPROVED POPUP MODAL FOR ONBOARDING STAFF                  */}
      {/* ========================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-zinc-200 shadow-2xl p-6 sm:p-8 space-y-5 my-auto text-black">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-black">Onboard Staff Member</h3>
                <p className="text-xs text-zinc-500 font-medium">
                  Set up employee details, contact info, and compensation structure.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-black flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-black uppercase tracking-wider block">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Samuel Adekunle"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-300 text-black placeholder-zinc-400 text-sm focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-black uppercase tracking-wider block">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="e.g. 08012345678"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-300 text-black placeholder-zinc-400 text-sm focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-black uppercase tracking-wider block">
                  Compensation Model
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayType("flat")}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      payType === "flat"
                        ? "bg-purple-50 border-purple-600 text-purple-700 shadow-xs"
                        : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:text-black"
                    }`}
                  >
                    <DollarSign size={16} />
                    <span>Fixed Monthly</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayType("commission")}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      payType === "commission"
                        ? "bg-purple-50 border-purple-600 text-purple-700 shadow-xs"
                        : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:text-black"
                    }`}
                  >
                    <TrendingUp size={16} />
                    <span>Commission %</span>
                  </button>
                </div>
                <input type="hidden" name="pay_type" value={payType} />
              </div>

              {payType === "flat" ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-black uppercase tracking-wider block">
                    Monthly Salary Amount (₦) *
                  </label>
                  <input
                    type="number"
                    step="500"
                    name="flat_amount"
                    required
                    placeholder="e.g. 75000"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-300 text-black placeholder-zinc-400 text-sm focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-all"
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-black uppercase tracking-wider block">
                    Commission Percentage (%) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    max="100"
                    name="commission_percent"
                    required
                    placeholder="e.g. 15"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-300 text-black placeholder-zinc-400 text-sm focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-all"
                  />
                </div>
              )}

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-300 text-black font-semibold text-sm transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Add Staff Member</span>
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
