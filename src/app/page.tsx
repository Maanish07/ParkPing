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
  Lock, 
  Zap, 
  Clock, 
  HelpCircle, 
  Smartphone, 
  Award, 
  X,
  Star,
  Check,
  Phone,
  MessageSquare,
  ShieldAlert
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

  // Section Refs
  const generatorRef = useRef<HTMLDivElement | null>(null);
  const garageRef = useRef<HTMLDivElement | null>(null);
  const howItWorksRef = useRef<HTMLDivElement | null>(null);
  const simulatorRef = useRef<HTMLDivElement | null>(null);

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

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
    <div className="min-h-screen bg-[#06090f] text-slate-100 flex flex-col justify-between selection:bg-yellow-400 selection:text-black">
      {/* Navbar */}
      <Navbar
        totalVehicles={tags.length}
        activeCount={activeCount}
        totalPings={tags.reduce((acc, t) => acc + (t.scanCount || 0), 0)}
        onOpenBulkPrint={() => setShowBulkPrint(true)}
        onOpenLogs={() => setShowLogs(true)}
        onScrollToGenerator={() => scrollToSection(generatorRef)}
        onScrollToHowItWorks={() => scrollToSection(howItWorksRef)}
        onScrollToGarage={() => scrollToSection(garageRef)}
        onScrollToSimulator={() => scrollToSection(simulatorRef)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-24 flex-1 w-full">
        {/* HERO SECTION */}
        <section className="relative pt-6 pb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="lg:max-w-2xl space-y-6">
            {/* Top Star Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-black uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 fill-yellow-400" />
              <span>Smart Vehicle Privacy Tag · Masked Calling & WhatsApp</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.08]">
              Let anyone reach you —{' '}
              <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                without sharing your number.
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              Stick the ParkPing smart tag on your car or bike. If there&apos;s ever a problem, someone is blocked, or lights are left on, people scan it with any phone camera and reach you on a <strong>masked call or WhatsApp</strong>. Your personal mobile number stays completely private.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => scrollToSection(generatorRef)}
                className="py-4 px-8 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-sm tracking-wide glow-yellow transition transform active:scale-95 flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Generate Free eTag Now
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollToSection(howItWorksRef)}
                className="py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm border border-slate-700 transition flex items-center gap-2"
              >
                See How It Works
              </button>
            </div>

            {/* Trust Line */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-white/5">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Check className="w-4 h-4 text-yellow-400 font-bold" />
                <span>Zero Number Leak</span>
              </div>
              <span className="text-slate-700">•</span>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Check className="w-4 h-4 text-yellow-400 font-bold" />
                <span>Works with Any Phone Camera</span>
              </div>
              <span className="text-slate-700">•</span>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Check className="w-4 h-4 text-yellow-400 font-bold" />
                <span>Multi-Car Support</span>
              </div>
            </div>
          </div>

          {/* Right Floating Badge Visual */}
          <div className="flex flex-col items-center justify-center relative">
            <div className="absolute -inset-8 bg-gradient-to-r from-yellow-400/20 to-cyan-500/20 rounded-full blur-3xl opacity-60 pointer-events-none" />
            <div className="relative transform lg:rotate-1 hover:rotate-0 transition duration-300">
              {tags.length > 0 && (
                <PrintableBadge tag={tags[0]} />
              )}
            </div>
          </div>
        </section>

        {/* THREE STEPS: HOW IT WORKS SECTION */}
        <section ref={howItWorksRef} className="scroll-mt-24 pt-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-black uppercase tracking-widest text-yellow-400 mb-2">
              HOW IT WORKS
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Three steps. That&apos;s the whole thing.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card rounded-3xl p-8 border border-white/10 glass-card-hover relative">
              <div className="text-4xl font-black font-mono text-yellow-400/40 mb-4">01</div>
              <h3 className="text-lg font-black text-white mb-2">Scan the tag</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Anyone can scan the QR sticker using a normal smartphone camera (iPhone or Android) — no mobile app required.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-8 border border-white/10 glass-card-hover relative">
              <div className="text-4xl font-black font-mono text-yellow-400/40 mb-4">02</div>
              <h3 className="text-lg font-black text-white mb-2">They reach out</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                They send a 1-click alert (e.g. &ldquo;Car Blocking Way&rdquo;) or place a call, right from the browser.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-8 border border-white/10 glass-card-hover relative">
              <div className="text-4xl font-black font-mono text-yellow-400/40 mb-4">03</div>
              <h3 className="text-lg font-black text-white mb-2">You stay private</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                You receive a masked call, SMS, or WhatsApp message. Your 10-digit mobile number is never visible to anyone.
              </p>
            </div>
          </div>
        </section>

        {/* CORE PILLARS GRID */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-3xl p-6 border border-white/10 glass-card-hover">
            <div className="w-12 h-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 flex items-center justify-center font-bold mb-4 shadow">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">Private Contact</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your details are never visible to the person reaching you. Stops harassment, data brokers, and marketing spam.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-white/10 glass-card-hover">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold mb-4 shadow">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">Masked Calls + WhatsApp</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calls and WhatsApp alerts are routed through a secure virtual relay. Connects in seconds with zero delay.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-white/10 glass-card-hover">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold mb-4 shadow">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">Instant Free eTag</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get printable sticker badges instantly. Change your phone number anytime in cloud without reprinting!
            </p>
          </div>
        </section>

        {/* INTERACTIVE WINDSHIELD SIMULATOR */}
        <section ref={simulatorRef} className="scroll-mt-24">
          <WindshieldSimulator selectedTag={tags[0]} />
        </section>

        {/* LIVE SMARTPHONE SCAN DEMO */}
        <section className="scroll-mt-24">
          {tags.length > 0 && (
            <PasserbyMobileMockup tag={tags[0]} />
          )}
        </section>

        {/* INSTANT ETAG GENERATOR STUDIO */}
        <section ref={generatorRef} className="scroll-mt-24">
          <TagGenerator onTagsCreated={handleTagsCreated} />
        </section>

        {/* MY GARAGE / REGISTERED VEHICLES */}
        <section ref={garageRef} className="space-y-6 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  My Registered Vehicles ({filteredTags.length})
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-yellow-400 font-mono font-bold">
                  {tags.length} Total
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Manage your active tags, change phone numbers on the fly, or print replacement stickers.
              </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
                {(['all', 'active', 'dnd', 'inactive'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition capitalize ${
                      statusFilter === st
                        ? 'bg-yellow-400 text-black shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search plate / model..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-yellow-400 w-48 sm:w-60"
                />
              </div>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="py-20 text-center text-slate-500">
              <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
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
                onClick={() => scrollToSection(generatorRef)}
                className="px-4 py-2 rounded-xl bg-yellow-400 text-black font-black text-xs glow-yellow"
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

        {/* STICKER AUTOMOTIVE QUALITY */}
        <section className="scroll-mt-24">
          <StickerShowcase />
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-black text-white">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-400 mt-1">Everything you need to know about putting ParkPing on your car.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-1.5">
                <HelpCircle className="w-4 h-4 text-yellow-400 shrink-0" />
                Will people see my real phone number?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                No. ParkPing uses a secure proxy bridge. When someone scans your QR code, they only see your car number and can call or message you through a masked relay. Your real number stays 100% private.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-1.5">
                <HelpCircle className="w-4 h-4 text-yellow-400 shrink-0" />
                What if I change my phone number or sell my car?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                You never need to replace the physical QR sticker! Simply login to your ParkPing dashboard and update the linked phone number or transfer the tag to a new owner in 1 click.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-1.5">
                <HelpCircle className="w-4 h-4 text-yellow-400 shrink-0" />
                Can I have tags for 2 or 3 cars in my family?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Yes! You can generate tags for multiple cars in a single batch. Each car can have its own designated driver phone number or share the primary family mobile number.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-1.5">
                <HelpCircle className="w-4 h-4 text-yellow-400 shrink-0" />
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
      <footer className="w-full border-t border-slate-800/80 py-10 px-4 sm:px-8 mt-20 no-print bg-[#050810]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-yellow-400 text-black font-black text-sm flex items-center justify-center shadow">
              PP
            </div>
            <div>
              <span className="text-slate-200 font-bold text-sm">ParkPing Sampark Tag</span>
              <p className="text-[11px] text-slate-500">Privacy-First Smart Vehicle Contact Platform</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 font-semibold">
            <button onClick={() => scrollToSection(howItWorksRef)} className="hover:text-yellow-400">
              How it works
            </button>
            <button onClick={() => scrollToSection(generatorRef)} className="hover:text-yellow-400">
              Create eTag
            </button>
            <button onClick={() => scrollToSection(garageRef)} className="hover:text-yellow-400">
              My Garage
            </button>
            <button onClick={() => setShowLogs(true)} className="hover:text-yellow-400">
              Activity Logs
            </button>
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
