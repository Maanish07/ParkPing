'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { VehicleTag, TagStatus, BadgeTheme, VehicleType, FulfillmentStatus, AdminMember, AdminRole } from '@/lib/types';
import { formatVehicleNumber } from '@/lib/mask';
import { VehicleDetails } from '@/lib/vahan';
import TagCard from '@/components/TagCard';
import PrintableBadge from '@/components/PrintableBadge';
import BulkPrintModal from '@/components/BulkPrintModal';
import ActivityLogsModal from '@/components/ActivityLogsModal';
import QRCodeCanvas from '@/components/QRCodeCanvas';
import { 
  Store, 
  Plus, 
  Layers, 
  Printer, 
  Search, 
  RefreshCw, 
  Clock, 
  ShieldCheck, 
  Car, 
  Phone, 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft, 
  Trash2, 
  LayoutGrid, 
  ExternalLink,
  X,
  ShoppingBag,
  Zap,
  Truck,
  PackageCheck,
  MapPin,
  Lock,
  Mail,
  Key,
  LogOut,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Shield,
  Check
} from 'lucide-react';

export default function MerchantAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [loggedInAdmin, setLoggedInAdmin] = useState<AdminMember | null>(null);

  const [tags, setTags] = useState<VehicleTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [fulfillmentFilter, setFulfillmentFilter] = useState<'all' | FulfillmentStatus>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | TagStatus>('all');

  // Active Main Tab: 'orders_queue' (Default) | 'inventory' | 'create_single' | 'create_bulk' | 'team_members'
  const [activeTab, setActiveTab] = useState<'orders_queue' | 'inventory' | 'create_single' | 'create_bulk' | 'team_members'>('orders_queue');

  // Modals state
  const [selectedTagForPrint, setSelectedTagForPrint] = useState<VehicleTag | null>(null);
  const [showBulkPrintModal, setShowBulkPrintModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [selectedTagIdsForBatch, setSelectedTagIdsForBatch] = useState<string[]>([]);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  // Team & Staff Members State
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPassword, setNewMemberPassword] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<AdminRole>('Fulfillment Manager');
  const [addingMember, setAddingMember] = useState(false);
  const [memberSuccessMsg, setMemberSuccessMsg] = useState('');

  // Manual Walk-In Single Tag Generator State
  const [singlePlate, setSinglePlate] = useState('');
  const [singlePhone, setSinglePhone] = useState('');
  const [singleAlternatePhone, setSingleAlternatePhone] = useState('');
  const [singleOwnerName, setSingleOwnerName] = useState('');
  const [singleVehicleType, setSingleVehicleType] = useState<VehicleType>('car');
  const [singleVehicleModel, setSingleVehicleModel] = useState('');
  const [singleTheme, setSingleTheme] = useState<BadgeTheme>('amber_neon');
  const [singleNote, setSingleNote] = useState('Scan with camera to contact owner if vehicle requires attention.');
  const [singleStreet, setSingleStreet] = useState('');
  const [singleCity, setSingleCity] = useState('New Delhi');
  const [singlePincode, setSinglePincode] = useState('110001');
  const [singleVahanLoading, setSingleVahanLoading] = useState(false);
  const [singleVahanDetails, setSingleVahanDetails] = useState<VehicleDetails | null>(null);
  const [isCreatingSingle, setIsCreatingSingle] = useState(false);

  // Manual Bulk Generator State
  interface BulkRow {
    id: string;
    vehicleNumber: string;
    phoneNumber: string;
    vehicleModel: string;
    vehicleType: VehicleType;
  }
  const [bulkRows, setBulkRows] = useState<BulkRow[]>([
    { id: '1', vehicleNumber: '', phoneNumber: '', vehicleModel: '', vehicleType: 'car' },
    { id: '2', vehicleNumber: '', phoneNumber: '', vehicleModel: '', vehicleType: 'suv' },
  ]);
  const [bulkGlobalPhone, setBulkGlobalPhone] = useState('');
  const [applyBulkGlobalPhone, setApplyBulkGlobalPhone] = useState(true);
  const [isCreatingBulk, setIsCreatingBulk] = useState(false);

  // Fetch Tags from API
  const fetchTags = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tags');
      const data = await res.json();
      if (data.success && Array.isArray(data.tags)) {
        setTags(data.tags);
      }
    } catch (e) {
      console.error('Error loading tags:', e);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Team Members from API
  const fetchMembers = async () => {
    setLoadingMembers(true);
    try {
      const res = await fetch('/api/admin/members');
      const data = await res.json();
      if (data.success && Array.isArray(data.members)) {
        setMembers(data.members);
      }
    } catch (e) {
      console.error('Error loading admin members:', e);
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('parkping_admin_token') : null;
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('parkping_admin_user') : null;
    if (token) {
      setIsAuthenticated(true);
      if (storedUser) {
        try {
          setLoggedInAdmin(JSON.parse(storedUser));
        } catch {}
      }
      fetchTags();
      fetchMembers();
    }
    setAuthChecking(false);
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem('parkping_admin_token', data.token);
        if (data.admin) {
          localStorage.setItem('parkping_admin_user', JSON.stringify(data.admin));
          setLoggedInAdmin(data.admin);
        }
        setIsAuthenticated(true);
        fetchTags();
        fetchMembers();
      } else {
        setAuthError(data.error || 'Invalid credentials');
      }
    } catch (err: any) {
      setAuthError('Connection error. Please try again.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('parkping_admin_token');
    localStorage.removeItem('parkping_admin_user');
    setIsAuthenticated(false);
    setLoggedInAdmin(null);
    setAdminPassword('');
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim() || !newMemberPassword.trim()) {
      alert('Please fill in all member fields');
      return;
    }
    setAddingMember(true);
    try {
      const res = await fetch('/api/admin/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newMemberName,
          email: newMemberEmail,
          password: newMemberPassword,
          role: newMemberRole,
        }),
      });
      const data = await res.json();
      if (data.success && data.member) {
        setMembers((prev) => [...prev, data.member]);
        setNewMemberName('');
        setNewMemberEmail('');
        setNewMemberPassword('');
        setMemberSuccessMsg(`Team member ${data.member.name} (${data.member.email}) created successfully! They can now log in.`);
        setTimeout(() => setMemberSuccessMsg(''), 6000);
      } else {
        alert(data.error || 'Failed to add team member');
      }
    } catch (err: any) {
      alert(err.message || 'Error adding team member');
    } finally {
      setAddingMember(false);
    }
  };

  const handleDeleteMember = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to revoke admin access for ${name}?`)) return;
    try {
      const res = await fetch(`/api/admin/members?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
      } else {
        alert(data.error || 'Failed to remove member');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Update Fulfillment Status
  const handleUpdateFulfillment = async (tagId: string, newFulfillmentStatus: FulfillmentStatus) => {
    setStatusUpdatingId(tagId);
    try {
      const res = await fetch(`/api/tags/${tagId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fulfillmentStatus: newFulfillmentStatus }),
      });
      const data = await res.json();
      if (data.success && data.tag) {
        setTags(tags.map((t) => (t.id === tagId ? data.tag : t)));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setStatusUpdatingId(null);
    }
  };

  // Vahan Auto-Lookup for Manual Form
  const handleSinglePlateChange = async (val: string) => {
    const formatted = formatVehicleNumber(val);
    setSinglePlate(formatted);

    const clean = formatted.replace(/\s+/g, '');
    if (clean.length >= 8) {
      setSingleVahanLoading(true);
      try {
        const res = await fetch(`/api/vehicle-lookup?plate=${encodeURIComponent(formatted)}`);
        const data = await res.json();
        if (data.success && data.vehicle) {
          setSingleVahanDetails(data.vehicle);
          setSingleVehicleModel(data.vehicle.model);
          setSingleVehicleType(data.vehicle.vehicleType);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSingleVahanLoading(false);
      }
    } else {
      setSingleVahanDetails(null);
    }
  };

  // Submit Manual Single Tag
  const handleCreateSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singlePlate.trim() || !singlePhone.trim()) {
      alert('Vehicle Number and Customer Phone Number are required!');
      return;
    }

    setIsCreatingSingle(true);
    try {
      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleNumber: singlePlate,
          phoneNumber: singlePhone,
          alternatePhone: singleAlternatePhone,
          ownerName: singleOwnerName || 'Walk-In Customer',
          vehicleModel: singleVehicleModel || singleVahanDetails?.model || 'Vehicle',
          vehicleType: singleVehicleType,
          badgeTheme: singleTheme,
          statusMessage: singleNote,
          fulfillmentStatus: 'pending_print',
          paymentStatus: 'paid',
          shippingAddress: singleStreet ? {
            fullName: singleOwnerName || 'Customer',
            street: singleStreet,
            city: singleCity,
            state: 'State',
            pincode: singlePincode,
          } : undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.tag) {
        setTags([data.tag, ...tags]);
        setSelectedTagForPrint(data.tag);
        // Reset form
        setSinglePlate('');
        setSinglePhone('');
        setSingleAlternatePhone('');
        setSingleOwnerName('');
        setSingleVehicleModel('');
        setSingleStreet('');
        setSingleVahanDetails(null);
        setActiveTab('orders_queue');
      } else {
        alert(data.error || 'Failed to create tag');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while creating tag');
    } finally {
      setIsCreatingSingle(false);
    }
  };

  // Bulk Form Handlers
  const handleAddBulkRow = () => {
    setBulkRows([
      ...bulkRows,
      {
        id: Date.now().toString(),
        vehicleNumber: '',
        phoneNumber: applyBulkGlobalPhone ? bulkGlobalPhone : '',
        vehicleModel: '',
        vehicleType: 'car',
      },
    ]);
  };

  const handleRemoveBulkRow = (id: string) => {
    if (bulkRows.length <= 1) return;
    setBulkRows(bulkRows.filter((r) => r.id !== id));
  };

  const handleUpdateBulkRow = (id: string, field: keyof BulkRow, val: string) => {
    setBulkRows(
      bulkRows.map((r) => {
        if (r.id === id) {
          if (field === 'vehicleNumber') {
            return { ...r, vehicleNumber: formatVehicleNumber(val) };
          }
          return { ...r, [field]: val };
        }
        return r;
      })
    );
  };

  const handleCreateBulk = async (e: React.FormEvent) => {
    e.preventDefault();
    const validItems = bulkRows.filter((r) => r.vehicleNumber.trim() && r.phoneNumber.trim());
    if (validItems.length === 0) {
      alert('Please fill out at least one vehicle with Vehicle Number and Mobile Number');
      return;
    }

    setIsCreatingBulk(true);
    try {
      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: validItems.map((r) => ({
            vehicleNumber: r.vehicleNumber,
            phoneNumber: r.phoneNumber,
            vehicleModel: r.vehicleModel || 'Vehicle',
            vehicleType: r.vehicleType,
            ownerName: 'Bulk Fleet Order',
            badgeTheme: 'amber_neon',
            fulfillmentStatus: 'pending_print',
            paymentStatus: 'paid',
          })),
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.tags)) {
        setTags([...data.tags, ...tags]);
        setSelectedTagIdsForBatch(data.tags.map((t: VehicleTag) => t.id));
        setShowBulkPrintModal(true);
        setActiveTab('orders_queue');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingBulk(false);
    }
  };

  const handleTagUpdated = (updated: VehicleTag) => {
    setTags(tags.map((t) => (t.id === updated.id ? updated : t)));
  };

  const handleTagDeleted = (id: string) => {
    setTags(tags.filter((t) => t.id !== id));
  };

  const pendingOrders = tags.filter((t) => (t.fulfillmentStatus || 'pending_print') === 'pending_print');
  const dispatchedOrders = tags.filter((t) => t.fulfillmentStatus === 'dispatched' || t.fulfillmentStatus === 'delivered');

  const filteredOrders = tags.filter((t) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      t.vehicleNumber.toLowerCase().includes(query) ||
      t.phoneNumber.includes(query) ||
      (t.orderId && t.orderId.toLowerCase().includes(query)) ||
      t.id.toLowerCase().includes(query) ||
      (t.ownerName && t.ownerName.toLowerCase().includes(query)) ||
      (t.shippingAddress && t.shippingAddress.city.toLowerCase().includes(query));

    const matchesFulfillment =
      fulfillmentFilter === 'all' || (t.fulfillmentStatus || 'pending_print') === fulfillmentFilter;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;

    return matchesQuery && matchesFulfillment && matchesStatus;
  });

  const handleBatchPrintAllPending = () => {
    const idsToPrint = pendingOrders.map((t) => t.id);
    if (idsToPrint.length === 0) {
      alert('No pending orders to print. All current orders have been dispatched!');
      return;
    }
    setSelectedTagIdsForBatch(idsToPrint);
    setShowBulkPrintModal(true);
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If Not Authenticated, Render Admin Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fafbfc] text-slate-900 flex flex-col justify-between selection:bg-amber-400 selection:text-black">
        {/* Simple top header */}
        <header className="w-full bg-white border-b border-slate-200 px-4 sm:px-8 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-black font-black text-sm flex items-center justify-center shadow-sm">
                PP
              </div>
              <div className="font-black text-lg text-slate-950">PARKPING ADMIN</div>
            </Link>
            <Link
              href="/"
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
            </Link>
          </div>
        </header>

        {/* Centered Login Card */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
                <Lock className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-slate-950">Store Owner Console</h2>
              <p className="text-xs text-slate-500">
                Enter your administrative credentials to manage vehicle QR tag printing and orders.
              </p>
            </div>

            {authError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center">
                {authError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Admin Email ID</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="admin@parkping.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 rounded-xl pl-10 pr-4 py-3 text-base sm:text-sm font-semibold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Admin Password</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 rounded-xl pl-10 pr-4 py-3 text-base sm:text-sm font-semibold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loggingIn}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm glow-yellow transition flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
              >
                {loggingIn ? (
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Log In to Store Console</span>
                  </>
                )}
              </button>

              {/* Demo 1-Click Credentials */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">Default: <code className="text-slate-600 font-mono">admin@parkping.com</code></span>
                <button
                  type="button"
                  onClick={() => {
                    setAdminEmail('admin@parkping.com');
                    setAdminPassword('admin123');
                  }}
                  className="text-amber-700 hover:text-amber-800 font-bold"
                >
                  ⚡ Autofill Demo Credentials
                </button>
              </div>
            </form>
          </div>
        </div>

        <footer className="text-center py-6 text-xs text-slate-400">
          ParkPing Internal Fulfillment Portal • Secure Access Only
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 flex flex-col justify-between selection:bg-amber-400 selection:text-black">
      {/* Top Merchant Navigation Header */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-8 py-3.5 no-print shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 text-black font-black text-lg flex items-center justify-center shadow-md group-hover:scale-105 transition">
                PP
              </div>
              <div>
                <div className="font-black text-lg sm:text-xl tracking-tight text-slate-950 flex items-center gap-2">
                  <span>PARKPING</span>
                  <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-sm">
                    STORE OWNER PORTAL
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1 font-medium hidden sm:flex">
                  <Store className="w-3 h-3 text-amber-600" />
                  <span>Automatic QR Order Fulfillment & Physical Sticker Dispatch</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {loggedInAdmin && (
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-slate-900">{loggedInAdmin.name}</span>
                <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-bold">
                  {loggedInAdmin.role}
                </span>
              </div>
            )}

            <button
              onClick={() => setShowLogsModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-bold transition shadow-sm"
            >
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Live Scan Logs</span>
            </button>

            <Link
              href="/"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-black transition active:scale-95 shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 text-xs font-bold transition active:scale-95 shadow-sm"
              title="Log Out of Store Console"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Merchant Portal Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex-1 w-full space-y-6 sm:space-y-8">
        {/* KPI OVERVIEW CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pending to Print KPI */}
          <div className="bg-white rounded-3xl p-5 border-2 border-amber-300 bg-gradient-to-br from-amber-50/50 to-white flex items-center justify-between shadow-sm">
            <div>
              <div className="text-xs uppercase font-bold text-amber-700 tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                Pending to Print
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
                {pendingOrders.length}{' '}
                <span className="text-xs text-amber-600 font-semibold font-mono">Orders</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">QR Auto-Generated · Ready to Print</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center font-bold shadow-sm">
              <Printer className="w-6 h-6" />
            </div>
          </div>

          {/* Dispatched KPI */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 flex items-center justify-between shadow-sm">
            <div>
              <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                Dispatched & Delivered
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">
                {dispatchedOrders.length}{' '}
                <span className="text-xs text-slate-400 font-semibold">Stickers</span>
              </div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">Shipped via Express Post</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
              <Truck className="w-6 h-6" />
            </div>
          </div>

          {/* Active Relays KPI */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 flex items-center justify-between shadow-sm">
            <div>
              <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                Active Vehicle Tags
              </div>
              <div className="text-2xl sm:text-3xl font-black text-blue-700 mt-1">
                {tags.length} <span className="text-xs text-slate-400 font-semibold">Total</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">100% Number Masking Active</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>

          {/* Total Revenue KPI */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 flex items-center justify-between shadow-sm">
            <div>
              <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                Total Orders Value
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
                ₹{(tags.length * 399).toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Online & Walk-In Payments</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center font-bold">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>
        </section>

        {/* WORKFLOW BANNER */}
        <section className="p-4 sm:p-5 rounded-3xl bg-amber-50/80 border border-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 mt-0.5 font-bold shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-950 flex items-center gap-2">
                <span>Automatic QR Tag Generation is Live</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                  Zero Manual Entry Needed
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                When customers place an order on your storefront, their vehicle specs and QR codes are <strong>automatically generated and ready below</strong>. You only need to click <strong>&ldquo;Print 3M Vinyl Sticker&rdquo;</strong> and dispatch it to their shipping address!
              </p>
            </div>
          </div>

          <button
            onClick={handleBatchPrintAllPending}
            disabled={pendingOrders.length === 0}
            className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs glow-yellow transition flex items-center justify-center gap-2 shrink-0 active:scale-95 disabled:opacity-40 shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Batch Print All {pendingOrders.length} Pending Stickers (A4 Sheet)</span>
          </button>
        </section>

        {/* MERCHANT TAB CONTROLLER */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setActiveTab('orders_queue')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition ${
                activeTab === 'orders_queue'
                  ? 'bg-amber-400 text-slate-950 shadow-sm glow-yellow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span>Orders to Print & Dispatch ({pendingOrders.length} Pending)</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition ${
                activeTab === 'inventory'
                  ? 'bg-amber-400 text-slate-950 shadow-sm glow-yellow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>All Registered Vehicles ({tags.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('create_single')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition ${
                activeTab === 'create_single'
                  ? 'bg-amber-400 text-slate-950 shadow-sm glow-yellow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Walk-In Tag Generator</span>
            </button>

            <button
              onClick={() => setActiveTab('create_bulk')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition ${
                activeTab === 'create_bulk'
                  ? 'bg-amber-400 text-slate-950 shadow-sm glow-yellow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Bulk Fleet Generator</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('team_members');
                fetchMembers();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition ${
                activeTab === 'team_members'
                  ? 'bg-amber-400 text-slate-950 shadow-sm glow-yellow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Team Members & Access ({members.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={fetchTags}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition shadow-sm"
              title="Refresh orders list"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </section>

        {/* TAB 1: ORDERS FULFILLMENT & PRINT QUEUE */}
        {activeTab === 'orders_queue' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Search & Fulfillment Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Search by Order ID (ORD-1092), Vehicle Number, Customer Phone, City..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none transition shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={fulfillmentFilter}
                  onChange={(e) => setFulfillmentFilter(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                >
                  <option value="all">All Orders ({tags.length})</option>
                  <option value="pending_print">Pending Print ({pendingOrders.length})</option>
                  <option value="dispatched">Dispatched ({dispatchedOrders.length})</option>
                </select>
              </div>
            </div>

            {/* Orders Cards List */}
            {loading ? (
              <div className="text-center py-20 text-slate-500">
                <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                Loading orders queue...
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <PackageCheck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-slate-900">No orders match this filter</h4>
                <p className="text-xs text-slate-500 mt-1">All current orders are fulfilled or try changing search criteria.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((tag) => {
                  const isPending = (tag.fulfillmentStatus || 'pending_print') === 'pending_print';
                  const scanUrl = typeof window !== 'undefined' ? `${window.location.origin}/p/${tag.id}` : `/p/${tag.id}`;

                  return (
                    <div
                      key={tag.id}
                      className={`rounded-3xl p-5 sm:p-6 border transition-all shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-6 ${
                        isPending
                          ? 'border-amber-400/80 bg-white'
                          : 'border-slate-200 bg-slate-50/70'
                      }`}
                    >
                      {/* Left Column: Order & Customer Details */}
                      <div className="flex items-start gap-4 flex-1">
                        {/* QR Code Preview Thumbnail */}
                        <div className="shrink-0 bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
                          <QRCodeCanvas value={scanUrl} size={76} level="M" />
                          <span className="text-[8px] font-black text-slate-900 uppercase tracking-tight mt-1">
                            Live QR
                          </span>
                        </div>

                        {/* Customer & Vehicle Info */}
                        <div className="space-y-1.5 flex-1 min-w-0">
                          {/* Order Header Line */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono font-black text-xs px-2.5 py-0.5 rounded-lg bg-amber-400 text-slate-950 shadow-sm">
                              {tag.orderId || tag.id}
                            </span>
                            
                            {isPending ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                                Ready to Print Sticker
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                <CheckCircle2 className="w-3 h-3" />
                                Dispatched / Shipped
                              </span>
                            )}

                            <span className="text-[11px] text-slate-500 font-mono">
                              Tag: {tag.id}
                            </span>
                          </div>

                          {/* Indian Vehicle Plate Look */}
                          <div className="flex items-center gap-3 pt-1">
                            <div className="inline-flex items-center rounded-lg border-2 border-black bg-yellow-400 text-black shadow-sm overflow-hidden">
                              <span className="bg-blue-900 text-white px-1.5 py-0.5 text-[8px] font-black leading-none border-r border-black">
                                IND
                              </span>
                              <span className="py-0.5 px-2 text-sm font-black font-mono tracking-wider">
                                {tag.vehicleNumber}
                              </span>
                            </div>

                            <span className="text-xs font-bold text-slate-900 truncate">
                              {tag.vehicleModel || 'Vehicle'}
                            </span>
                          </div>

                          {/* Customer & Mobile */}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-700 pt-0.5">
                            <span className="font-semibold text-slate-900">
                              👤 {tag.ownerName || 'Customer'}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="font-mono font-bold text-amber-700 flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              {tag.phoneNumber}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-[11px] text-emerald-700 font-bold">
                              ₹{tag.price || 399} ({tag.paymentStatus === 'cod' ? 'COD' : 'Paid Online'})
                            </span>
                          </div>

                          {/* Shipping Address */}
                          {tag.shippingAddress ? (
                            <div className="text-[11px] text-slate-600 flex items-start gap-1.5 pt-1 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                              <span>
                                {tag.shippingAddress.street}, {tag.shippingAddress.city}, {tag.shippingAddress.state} -{' '}
                                <strong className="text-slate-900 font-mono">{tag.shippingAddress.pincode}</strong>
                              </span>
                            </div>
                          ) : (
                            <div className="text-[11px] text-slate-400 italic">
                              Direct / Walk-In Generation
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Column: Store Owner Action Buttons */}
                      <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-200 shrink-0">
                        {/* Primary Print Button */}
                        <button
                          onClick={() => setSelectedTagForPrint(tag)}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs glow-yellow transition flex items-center justify-center gap-2 active:scale-95 shadow-md"
                        >
                          <Printer className="w-4 h-4" />
                          <span>Print 3M Sticker</span>
                        </button>

                        {/* Dispatch Toggle Button */}
                        {isPending ? (
                          <button
                            onClick={() => handleUpdateFulfillment(tag.id, 'dispatched')}
                            disabled={statusUpdatingId === tag.id}
                            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
                          >
                            <Truck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Mark as Dispatched</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateFulfillment(tag.id, 'pending_print')}
                            disabled={statusUpdatingId === tag.id}
                            className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 text-[11px] font-semibold transition"
                          >
                            Move to Pending Print
                          </button>
                        )}

                        {/* Test Scan link */}
                        <a
                          href={`/p/${tag.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-bold"
                        >
                          <ExternalLink className="w-3 h-3" /> Test Passerby Scan
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ALL REGISTERED VEHICLES DIRECTORY */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tags.map((tag) => (
                <TagCard
                  key={tag.id}
                  tag={tag}
                  onTagUpdated={handleTagUpdated}
                  onTagDeleted={handleTagDeleted}
                  onSelectPrint={(t) => setSelectedTagForPrint(t)}
                />
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: WALK-IN MANUAL GENERATOR */}
        {activeTab === 'create_single' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl relative overflow-hidden animate-fadeIn">
            <div className="max-w-2xl pb-6 border-b border-slate-200">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Walk-In Customer Studio
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
                Generate Smart Tag for Walk-In Customer
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                Enter vehicle plate number to auto-fetch Vahan RTO details, link the customer&apos;s phone number, and print the sticker instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 pt-6 sm:pt-8 items-start">
              <form onSubmit={handleCreateSingle} className="lg:col-span-7 space-y-5">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>Vehicle Registration Number *</span>
                    {singleVahanLoading && (
                      <span className="text-[10px] text-blue-600 font-bold flex items-center gap-1">
                        <div className="w-2.5 h-2.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        Fetching Vahan RTO details...
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. DL 01 AB 1234 or MH 12 AB 9999"
                      value={singlePlate}
                      onChange={(e) => handleSinglePlateChange(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-300 focus:border-amber-500 rounded-2xl px-4 py-3 text-lg font-mono font-black text-slate-950 placeholder:text-slate-400 uppercase focus:outline-none transition shadow-inner"
                    />
                    <div className="absolute right-3.5 top-3.5 px-2.5 py-1 rounded bg-blue-900 text-white font-black text-[10px] font-mono tracking-wider">
                      IND
                    </div>
                  </div>
                </div>

                {singleVahanDetails && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-between gap-3 text-xs animate-fadeIn shadow-sm">
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{singleVahanDetails.model}</span>
                        <span className="text-[10px] text-slate-500 font-normal">({singleVahanDetails.color})</span>
                      </div>
                      <div className="text-[11px] text-slate-600 mt-1">
                        {singleVahanDetails.rtoLocation} • Fuel: <strong className="text-amber-700">{singleVahanDetails.fuelType}</strong>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                      ✓ RTO Verified
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                      Vehicle Model / Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Hyundai Creta, Maruti Swift, Thar 4x4"
                      value={singleVehicleModel}
                      onChange={(e) => setSingleVehicleModel(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                      Vehicle Category / Type
                    </label>
                    <select
                      value={singleVehicleType}
                      onChange={(e) => setSingleVehicleType(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none transition"
                    >
                      <option value="car">Car (Sedan / Hatchback)</option>
                      <option value="suv">SUV / MUV</option>
                      <option value="ev">Electric Vehicle (EV)</option>
                      <option value="bike">Motorcycle / Two-Wheeler</option>
                      <option value="truck">Commercial / Truck</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={singleOwnerName}
                      onChange={(e) => setSingleOwnerName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                      Customer Mobile Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={singlePhone}
                        onChange={(e) => setSinglePhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isCreatingSingle}
                    className="w-full py-4 px-8 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm tracking-wide glow-yellow transition flex items-center justify-center gap-2 active:scale-95 shadow-md disabled:opacity-50"
                  >
                    {isCreatingSingle ? (
                      <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generate & Open Print Modal</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Right Live Sticker Preview */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center p-5 sm:p-7 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-xl">
                <div className="text-xs font-black uppercase tracking-widest text-slate-300 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  Live Sticker 300 DPI Preview
                </div>
                <PrintableBadge
                  tag={{
                    id: 'PP-WALKIN',
                    vehicleNumber: singlePlate ? formatVehicleNumber(singlePlate) : 'DL 01 AB 1234',
                    phoneNumber: singlePhone || '+91 98765 43210',
                    ownerName: singleOwnerName || 'Customer',
                    vehicleModel: singleVehicleModel || singleVahanDetails?.model || 'Hyundai Creta',
                    vehicleType: singleVehicleType,
                    status: 'active',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    scanCount: 0,
                    badgeTheme: singleTheme,
                  }}
                  compact
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BULK FLEET GENERATOR */}
        {activeTab === 'create_bulk' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl relative overflow-hidden animate-fadeIn">
            <div className="max-w-2xl pb-6 border-b border-slate-200">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-black uppercase tracking-wider mb-2">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                Fleet & Multi-Car Bulk Generator
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
                Generate Multiple Vehicle Tags at Once
              </h2>
            </div>

            <form onSubmit={handleCreateBulk} className="pt-6 space-y-6">
              <div className="space-y-3">
                {bulkRows.map((row, index) => (
                  <div
                    key={row.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center gap-3"
                  >
                    <span className="w-7 h-7 rounded-xl bg-slate-200 flex items-center justify-center text-xs font-mono font-bold text-slate-800 shrink-0">
                      #{index + 1}
                    </span>

                    <div className="w-full md:w-52 shrink-0">
                      <input
                        type="text"
                        required
                        placeholder="Plate (e.g. DL 01 AB 1234)"
                        value={row.vehicleNumber}
                        onChange={(e) => handleUpdateBulkRow(row.id, 'vehicleNumber', e.target.value)}
                        className="w-full bg-white border border-slate-300 focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-slate-900 placeholder:text-slate-400 uppercase focus:outline-none"
                      />
                    </div>

                    <div className="w-full md:w-48 shrink-0">
                      <input
                        type="tel"
                        required
                        placeholder="Mobile Number"
                        value={row.phoneNumber}
                        onChange={(e) => handleUpdateBulkRow(row.id, 'phoneNumber', e.target.value)}
                        className="w-full bg-white border border-slate-300 focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                      />
                    </div>

                    <div className="w-full md:flex-1">
                      <input
                        type="text"
                        placeholder="Model (e.g. Honda City / Creta)"
                        value={row.vehicleModel}
                        onChange={(e) => handleUpdateBulkRow(row.id, 'vehicleModel', e.target.value)}
                        className="w-full bg-white border border-slate-300 focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveBulkRow(row.id)}
                      disabled={bulkRows.length <= 1}
                      className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-slate-200 disabled:opacity-30 transition self-end md:self-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleAddBulkRow}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition border border-slate-300"
                >
                  <Plus className="w-4 h-4 text-amber-600" />
                  <span>+ Add Another Vehicle Row</span>
                </button>

                <button
                  type="submit"
                  disabled={isCreatingBulk}
                  className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm glow-yellow transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
                >
                  {isCreatingBulk ? (
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate & Print Batch Sheet</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 5: TEAM & STAFF MEMBERS ACCESS */}
        {activeTab === 'team_members' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header Banner */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black uppercase tracking-wider mb-2">
                  <Shield className="w-3.5 h-3.5 text-amber-600" />
                  Administrative Access Control
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
                  Team Members & Staff Logins
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                  Add staff members who can log into the Store Console to print stickers and manage order fulfillment.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <span className="text-slate-500">Super Admin Default: </span>
                <code className="font-mono font-bold text-slate-900">admin@parkping.com</code>
              </div>
            </div>

            {/* Success Notification */}
            {memberSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{memberSuccessMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Add Team Member Form */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-5">
                <div className="flex items-center gap-2 text-slate-950 font-black text-lg border-b border-slate-100 pb-3">
                  <UserPlus className="w-5 h-5 text-amber-500" />
                  <span>Add New Team Member</span>
                </div>

                <form onSubmit={handleAddMember} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Sharma"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Staff Email Address (Login ID) *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="e.g. vikram@parkping.com"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Initial Password *
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={newMemberPassword}
                        onChange={(e) => setNewMemberPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Designated Role & Permission
                    </label>
                    <select
                      value={newMemberRole}
                      onChange={(e) => setNewMemberRole(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-amber-500"
                    >
                      <option value="Super Admin">Super Admin (Full Access & Team Management)</option>
                      <option value="Fulfillment Manager">Fulfillment Manager (Orders & Dispatch)</option>
                      <option value="Print Operator">Print Operator (Sticker Batch Printing)</option>
                      <option value="Support Agent">Support Agent (Scan Logs & Customer Support)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={addingMember}
                    className="w-full py-3.5 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs glow-yellow transition flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50 active:scale-95"
                  >
                    {addingMember ? (
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Create Staff Member Access</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Right Column: Active Staff Accounts List */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 font-black text-lg text-slate-950">
                    <Users className="w-5 h-5 text-amber-500" />
                    <span>Active Team & Admin Accounts ({members.length})</span>
                  </div>

                  <button
                    onClick={fetchMembers}
                    disabled={loadingMembers}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                    title="Refresh members"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingMembers ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                <div className="space-y-3">
                  {members.map((m) => (
                    <div
                      key={m.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:border-slate-300 transition"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 font-black text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                          {m.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-slate-950">{m.name}</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                m.role === 'Super Admin'
                                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                                  : m.role === 'Fulfillment Manager'
                                  ? 'bg-blue-100 text-blue-900 border-blue-300'
                                  : m.role === 'Print Operator'
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : 'bg-purple-100 text-purple-900 border-purple-300'
                              }`}
                            >
                              {m.role}
                            </span>
                            {m.isSuperAdmin && (
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-slate-900 text-white">
                                Master Super Admin
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-mono text-slate-600 mt-0.5">
                            {m.email}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Added on {new Date(m.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                      </div>

                      <div className="self-end sm:self-auto">
                        {m.isSuperAdmin ? (
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
                            Protected Super Admin
                          </span>
                        ) : (
                          <button
                            onClick={() => handleDeleteMember(m.id, m.name)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition active:scale-95"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Revoke Access</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-slate-700 leading-relaxed mt-4">
                  <div className="font-bold text-slate-900 flex items-center gap-1 mb-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    How Staff Logins Work:
                  </div>
                  Any team member you add can immediately navigate to{' '}
                  <strong className="font-mono text-slate-900">/admin</strong> or{' '}
                  <strong className="font-mono text-slate-900">https://parkping-xi.vercel.app/admin</strong>, 
                  enter their email and password, and fulfill car sticker orders without needing developer access.
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: SINGLE STICKER PRINT */}
      {selectedTagForPrint && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-6 flex flex-col items-center shadow-2xl relative text-slate-900">
            <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-slate-200">
              <div className="text-xs font-black uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                <Printer className="w-4 h-4" />
                Physical Sticker Print & 300 DPI Export
              </div>
              <button
                onClick={() => setSelectedTagForPrint(null)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-2">
              <PrintableBadge
                tag={selectedTagForPrint}
                compact={false}
                onThemeChange={(newTheme) => {
                  const updated = { ...selectedTagForPrint, badgeTheme: newTheme };
                  setSelectedTagForPrint(updated);
                  handleTagUpdated(updated);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL: BATCH PRINT SHEET */}
      {showBulkPrintModal && (
        <BulkPrintModal
          tags={tags.filter((t) =>
            selectedTagIdsForBatch.length > 0 ? selectedTagIdsForBatch.includes(t.id) : true
          )}
          onClose={() => {
            setShowBulkPrintModal(false);
            setSelectedTagIdsForBatch([]);
          }}
        />
      )}

      {/* MODAL: SCAN AUDIT LOGS */}
      {showLogsModal && <ActivityLogsModal onClose={() => setShowLogsModal(false)} />}

      {/* MERCHANT FOOTER */}
      <footer className="w-full border-t border-slate-200 py-8 px-4 sm:px-8 mt-16 no-print bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">ParkPing Store Owner Fulfillment Console</span>
            <span>•</span>
            <span>Zero Manual Generation · Instant Print & Ship</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600 font-semibold">
            <Link href="/" className="hover:text-amber-600">
              Customer Storefront
            </Link>
            <button onClick={() => setShowLogsModal(true)} className="hover:text-amber-600">
              Live Audit Logs
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
