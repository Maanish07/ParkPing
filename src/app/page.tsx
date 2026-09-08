'use client';

import React, { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import TagGenerator from '@/components/TagGenerator';
import PrintableBadge from '@/components/PrintableBadge';
import WindshieldSimulator from '@/components/WindshieldSimulator';
import PasserbyMobileMockup from '@/components/PasserbyMobileMockup';
import StickerShowcase from '@/components/StickerShowcase';
import CheckoutOrderModal from '@/components/CheckoutOrderModal';
import { VehicleTag } from '@/lib/types';
import { 
  ShieldCheck, 
  PhoneCall, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Lock, 
  Zap, 
  HelpCircle, 
  Star, 
  ShoppingCart, 
  Truck,
  Droplets,
  Sun,
  Award
} from 'lucide-react';

export default function HomePage() {
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutInitialPlate, setCheckoutInitialPlate] = useState('');

  // Section Refs
  const orderRef = useRef<HTMLDivElement | null>(null);
  const howItWorksRef = useRef<HTMLDivElement | null>(null);
  const simulatorRef = useRef<HTMLDivElement | null>(null);
  const faqRef = useRef<HTMLDivElement | null>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartCheckout = (plate?: string) => {
    if (plate) setCheckoutInitialPlate(plate);
    setShowCheckout(true);
  };

  // Demo tag for windshield preview
  const demoTag: VehicleTag = {
    id: 'PP-48291',
    vehicleNumber: 'DL 01 AB 1234',
    phoneNumber: '+91 98765 43210',
    ownerName: 'Rahul Sharma',
    vehicleModel: 'Hyundai Creta (White)',
    vehicleType: 'suv',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    scanCount: 14,
    badgeTheme: 'amber_neon',
  };

  return (
    <div className="min-h-screen bg-[#06090f] text-slate-100 flex flex-col justify-between selection:bg-yellow-400 selection:text-black">
      {/* Navbar */}
      <Navbar
        onOpenCheckout={() => handleStartCheckout()}
        onScrollToHowItWorks={() => scrollToSection(howItWorksRef)}
        onScrollToOrder={() => scrollToSection(orderRef)}
        onScrollToSimulator={() => scrollToSection(simulatorRef)}
        onScrollToFaq={() => scrollToSection(faqRef)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-24 flex-1 w-full">
        {/* HERO SECTION */}
        <section className="relative pt-6 pb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="lg:max-w-2xl space-y-6">
            {/* Top Badge */}
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
              Stick the ParkPing smart tag on your car or bike. If there&apos;s ever a problem, your car is blocking someone, or lights are left on, people scan it with any phone camera and reach you on a <strong>masked call or WhatsApp</strong>. Your personal mobile number stays completely private.
            </p>

            {/* Pricing & Buy CTA */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => handleStartCheckout()}
                className="py-4 px-8 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-sm tracking-wide glow-yellow transition transform active:scale-95 flex items-center gap-2.5 shadow-xl"
              >
                <ShoppingCart className="w-4 h-4" />
                Buy Smart Tag · ₹399
                <span className="text-xs opacity-75 line-through">₹799</span>
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
                <Truck className="w-4 h-4 text-yellow-400 font-bold" />
                <span>Free Delivery Across India</span>
              </div>
              <span className="text-slate-700">•</span>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Check className="w-4 h-4 text-yellow-400 font-bold" />
                <span>Auto Vahan Details Lookup</span>
              </div>
            </div>
          </div>

          {/* Right Floating Badge Visual */}
          <div className="flex flex-col items-center justify-center relative">
            <div className="absolute -inset-8 bg-gradient-to-r from-yellow-400/20 to-cyan-500/20 rounded-full blur-3xl opacity-60 pointer-events-none" />
            <div className="relative transform lg:rotate-1 hover:rotate-0 transition duration-300">
              <PrintableBadge tag={demoTag} compact />
            </div>
          </div>
        </section>

        {/* THREE STEPS: HOW IT WORKS */}
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
                They send a 1-click WhatsApp alert (e.g. &ldquo;Car Blocking Way&rdquo;) or place a call, right from the browser.
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

        {/* CORE FEATURE PILLARS */}
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
            <h3 className="text-base font-bold text-white mb-1.5">Auto Vahan Details & Delivery</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automatic vehicle details lookup from RTO. Get instant digital eTag + 3M waterproof sticker delivered.
            </p>
          </div>
        </section>

        {/* ORDER TAG SECTION WITH LIVE VAHAN AUTO-FETCH */}
        <section ref={orderRef} className="scroll-mt-24">
          <TagGenerator onStartCheckout={(plate) => handleStartCheckout(plate)} />
        </section>

        {/* INTERACTIVE WINDSHIELD SIMULATOR */}
        <section ref={simulatorRef} className="scroll-mt-24">
          <WindshieldSimulator selectedTag={demoTag} />
        </section>

        {/* LIVE SMARTPHONE SCAN DEMO */}
        <section className="scroll-mt-24">
          <PasserbyMobileMockup tag={demoTag} />
        </section>

        {/* STICKER AUTOMOTIVE QUALITY */}
        <section className="scroll-mt-24">
          <StickerShowcase />
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section ref={faqRef} className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 space-y-6 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-black text-white">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-400 mt-1">Everything you need to know about ordering ParkPing for your car.</p>
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
                You never need to replace the physical QR sticker! Simply update your linked phone number in the portal or transfer the tag to a new owner in 1 click.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-1.5">
                <HelpCircle className="w-4 h-4 text-yellow-400 shrink-0" />
                Can I order tags for 2 or 3 cars in my family?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Yes! You can choose the 2-Car Combo (₹699) or 3-Car Family Pack (₹899). Each car can have its own designated driver phone number or share the primary family mobile number.
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
            <button onClick={() => handleStartCheckout()} className="hover:text-yellow-400">
              Buy Smart Tag
            </button>
            <button onClick={() => scrollToSection(simulatorRef)} className="hover:text-yellow-400">
              Windshield Preview
            </button>
            <button onClick={() => scrollToSection(faqRef)} className="hover:text-yellow-400">
              FAQs
            </button>
          </div>
        </div>
      </footer>

      {/* CHECKOUT / ORDER MODAL */}
      {showCheckout && (
        <CheckoutOrderModal
          initialVehicleNumber={checkoutInitialPlate}
          onClose={() => setShowCheckout(false)}
          onOrderCompleted={() => {
            // Keep completed state
          }}
        />
      )}
    </div>
  );
}
