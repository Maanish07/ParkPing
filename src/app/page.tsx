'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import TagGenerator from '@/components/TagGenerator';
import TagCard from '@/components/TagCard';
import PrintableBadge from '@/components/PrintableBadge';
import BulkPrintModal from '@/components/BulkPrintModal';
import ActivityLogsModal from '@/components/ActivityLogsModal';
import WindshieldSimulator from '@/components/WindshieldSimulator';
import PasserbyMobileMockup from '@/components/PasserbyMobileMockup';
import StickerShowcase from '@/components/StickerShowcase';
import { VehicleTag, BadgeTheme } from '@/lib/types';
import { 
  Car, 
  ShieldCheck, 
  PhoneCall, 
  QrCode, 
  Sparkles, 
  Printer, 
  Search, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  Lock,
  Zap,
  Clock,
  HelpCircle,
  Smartphone,
  Award,
  ChevronDown,
  X
} from 'lucide-react';

export default function HomePage() {
  const [tags, setTags] = useState<VehicleTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'dnd' | 'inactive'>('all');
  
  // Modals
  const [selectedPrintTag, setSelectedPrintTag] = useState<VehicleTag | null>(null);
  const [showBulkPrint, setShowBulkPrint] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  const generatorRef = useRef<HTMLDivElement | null>(null);
  const garageRef = useRef<HTMLDivElement | null>(null);

  // Fetch initial tags
  const fetchTags = async () => {
    try {
      const res = await fetch('/api/tags');
      const data = await res.json();
      if (data.success && data.tags) {
        setTags(data.tags);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleTagsCreated = (newTags: VehicleTag[]) => {
    setTags((prev) => [...newTags, ...prev.filter((t) => !newTags.some((nt) => nt.id === t.id))]);
    // Scroll down to garage
    garageRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTagUpdated = (updated: VehicleTag) => {
    setTags((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    if (selectedPrintTag && selectedPrintTag.id === updated.id) {
      setSelectedPrintTag(updated);
    }
  };

  const handleTagDeleted = (tagId: string) => {
    setTags((prev) => prev.filter((t) => t.id !== tagId));
  };

  const scrollToGenerator = () => {
    generatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToGarage = () => {
    garageRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filtered tags
  const filteredTags = tags.filter((t) => {
    const matchesSearch =
      t.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.vehicleModel && t.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = tags.filter((t) => t.status === 'active').length;

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-black">
      {/* Navbar */}
      <Navbar
        totalVehicles={tags.length}
        activeCount={activeCount}
        totalPings={tags.reduce((acc, t) => acc + (t.scanCount || 0), 0)}
        onOpenBulkPrint={() => setShowBulkPrint(true)}
        onOpenLogs={() => setShowLogs(true)}
        onScrollToGenerator={scrollToGenerator}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-20 flex-1 w-full">
        {/* HERO SECTION FOR CAR OWNERS */}
        <section className="relative pt-6 pb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          {/* Left copy */}
          <div className="lg:max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-extrabold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>For Car Owners • Protect Your Car & Privacy</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
              The Smart Windshield Tag{' '}
              <span className="bg-gradient-to-r from-brand-400 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
                Every Car Owner Needs
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              Never worry about parking in tight spots or leaving handwritten phone number slips again. 
              Let anyone reach you via <strong>Masked Call or WhatsApp</strong> when your car needs attention — while your personal number stays 100% hidden.
            </p>

            {/* Benefit Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800">
                <div className="w-9 h-9 rounded-xl bg-brand-500/15 flex items-center justify-center text-brand-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white">Zero Spam / Harassment</div>
                  <div className="text-slate-400 text-[11px]">Real phone numbers are never shown</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center text-cyan-400 shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white">Multi-Car Garage Support</div>
                  <div className="text-slate-400 text-[11px]">Manage all family cars in one place</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={scrollToGenerator}
                className="py-4 px-8 rounded-2xl bg-gradient-to-r from-brand-500 to-amber-500 hover:from-brand-400 hover:to-amber-400 text-black font-black text-sm tracking-wide shadow-glow transition transform active:scale-95 flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Generate Smart Tag for My Car
              </button>

              <button
                onClick={scrollToGarage}
                className="py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm border border-slate-800 transition flex items-center gap-2"
              >
                <Car className="w-4 h-4 text-brand-400" />
                View My Registered Cars ({tags.length})
              </button>
            </div>
          </div>

          {/* Right Floating Badge Visual */}
          <div className="flex flex-col items-center justify-center relative">
            <div className="absolute -inset-6 bg-gradient-to-r from-brand-500/20 to-cyan-500/20 rounded-full blur-3xl opacity-60 pointer-events-none" />
            <div className="relative transform lg:rotate-1 hover:rotate-0 transition duration-300">
              {tags.length > 0 && (
                <PrintableBadge tag={tags[0]} />
              )}
            </div>
          </div>
        </section>

        {/* SECTION 1: INTERACTIVE WINDSHIELD SIMULATOR */}
        <section className="scroll-mt-24">
          <WindshieldSimulator selectedTag={tags[0]} />
        </section>

        {/* SECTION 2: LIVE PASSERBY SMARTPHONE DEMO */}
        <section className="scroll-mt-24">
          {tags.length > 0 && (
            <PasserbyMobileMockup tag={tags[0]} />
          )}
        </section>

        {/* SECTION 3: GENERATOR STUDIO (Single or Multi-Car) */}
        <section ref={generatorRef} className="scroll-mt-24">
          <TagGenerator onTagsCreated={handleTagsCreated} />
        </section>

        {/* SECTION 4: MY GARAGE (Active Registered Vehicles) */}
        <section ref={garageRef} className="space-y-6 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  My Registered Vehicles ({filteredTags.length})
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {tags.length} Cars
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Manage your active tags, change phone numbers on the fly, or print replacement stickers.
              </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Filter */}
              <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
                {(['all', 'active', 'dnd', 'inactive'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition capitalize ${
                      statusFilter === st
                        ? 'bg-brand-500 text-black shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search car plate / model..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 w-48 sm:w-60"
                />
              </div>
            </div>
          </div>

          {/* Tag Grid */}
          {loading ? (
            <div className="py-20 text-center text-slate-500">
              <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Loading vehicle garage...
            </div>
          ) : filteredTags.length === 0 ? (
            <div className="py-16 text-center glass-panel rounded-3xl border border-white/10 p-8">
              <Car className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <div className="text-base font-bold text-white">No Vehicles Found</div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                No car scanner matched your filter. Use the generator above to add a car to your garage.
              </p>
              <button
                onClick={scrollToGenerator}
                className="px-4 py-2 rounded-xl bg-brand-500 text-black font-extrabold text-xs shadow-glow"
              >
                + Add Car Tag
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTags.map((tag) => (
                <TagCard
                  key={tag.id}
                  tag={tag}
                  onTagUpdated={handleTagUpdated}
                  onTagDeleted={handleTagDeleted}
                  onSelectPrint={(t) => setSelectedPrintTag(t)}
                />
              ))}
            </div>
          )}
        </section>

        {/* SECTION 5: STICKER SPECS & AUTOMOTIVE QUALITY */}
        <section className="scroll-mt-24">
          <StickerShowcase />
        </section>

        {/* SECTION 6: FREQUENTLY ASKED QUESTIONS FOR CAR OWNERS */}
        <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-black text-white">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-400 mt-1">Everything you need to know about putting ParkPing on your car.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-1.5">
                <HelpCircle className="w-4 h-4 text-brand-400" />
                Will people see my real phone number?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                No. ParkPing uses a secure proxy bridge. When someone scans your QR code, they only see your car number and can call or message you through a masked relay. Your real number stays 100% private.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-1.5">
                <HelpCircle className="w-4 h-4 text-brand-400" />
                What if I change my phone number or sell my car?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                You never need to replace the physical QR sticker! Simply login to your ParkPing dashboard and update the linked phone number or transfer the tag to a new owner in 1 click.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-1.5">
                <HelpCircle className="w-4 h-4 text-brand-400" />
                Can I have tags for 2 or 3 cars in my family?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Yes! You can generate tags for multiple cars in a single batch. Each car can have its own designated driver phone number or share the primary family mobile number.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-1.5">
                <HelpCircle className="w-4 h-4 text-brand-400" />
                Does the person scanning need an app?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                No app required. They simply open their regular phone camera (iPhone or Android), point at the QR sticker, and the instant web portal opens right away.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-slate-800/80 py-8 px-4 sm:px-8 mt-16 no-print bg-[#06090f]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-brand-500 flex items-center justify-center text-black font-black text-xs">
              PP
            </div>
            <span className="text-slate-300 font-bold">ParkPing System</span>
            <span>• Next-Gen Smart Vehicle Privacy & Parking Scanner</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-slate-400">Multi-Car QR Engine</span>
            <span>•</span>
            <span className="text-slate-400">Masked VoIP & WhatsApp Bridge</span>
          </div>
        </div>
      </footer>

      {/* SINGLE PRINT MODAL */}
      {selectedPrintTag && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 no-print">
          <div className="rounded-3xl bg-slate-950 border border-slate-800 p-6 sm:p-8 flex flex-col items-center relative max-w-md w-full shadow-2xl">
            <button
              onClick={() => setSelectedPrintTag(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-white">Printable QR Badge</h3>
              <p className="text-xs text-slate-400">
                Vehicle: <strong className="text-yellow-400 font-mono">{selectedPrintTag.vehicleNumber}</strong>
              </p>
            </div>
            <PrintableBadge
              tag={selectedPrintTag}
              onThemeChange={(newTheme: BadgeTheme) => {
                handleTagUpdated({ ...selectedPrintTag, badgeTheme: newTheme });
              }}
            />
          </div>
        </div>
      )}

      {/* BULK PRINT MODAL */}
      {showBulkPrint && (
        <BulkPrintModal tags={tags} onClose={() => setShowBulkPrint(false)} />
      )}

      {/* ACTIVITY LOGS MODAL */}
      {showLogs && (
        <ActivityLogsModal onClose={() => setShowLogs(false)} />
      )}
    </div>
  );
}
