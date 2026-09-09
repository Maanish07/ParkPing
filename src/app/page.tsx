'use client';

import React, { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import TagGenerator from '@/components/TagGenerator';
import PrintableBadge from '@/components/PrintableBadge';
import PasserbyMobileMockup from '@/components/PasserbyMobileMockup';
import StickerShowcase from '@/components/StickerShowcase';
import CheckoutOrderModal, { VehicleSlot } from '@/components/CheckoutOrderModal';
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
  Award,
  ChevronRight
} from 'lucide-react';

export default function HomePage() {
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutInitialCount, setCheckoutInitialCount] = useState<1 | 2 | 3>(1);
  const [checkoutInitialSlots, setCheckoutInitialSlots] = useState<VehicleSlot[]>([]);

  // Section Refs
  const orderRef = useRef<HTMLDivElement | null>(null);
  const howItWorksRef = useRef<HTMLDivElement | null>(null);
  const faqRef = useRef<HTMLDivElement | null>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartCheckout = (count: 1 | 2 | 3 = 1, slots?: VehicleSlot[]) => {
    setCheckoutInitialCount(count);
    if (slots) {
      setCheckoutInitialSlots(slots);
    }
    setShowCheckout(true);
  };

  // Demo tag for hero preview
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
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 flex flex-col justify-between selection:bg-amber-400 selection:text-black">
      {/* Navbar */}
      <Navbar
        onOpenCheckout={() => handleStartCheckout(1)}
        onScrollToHowItWorks={() => scrollToSection(howItWorksRef)}
        onScrollToOrder={() => scrollToSection(orderRef)}
        onScrollToFaq={() => scrollToSection(faqRef)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-12 space-y-16 sm:space-y-24 flex-1 w-full">
        {/* HERO SECTION */}
        <section className="relative pt-2 sm:pt-6 pb-6 sm:pb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12">
          {/* Subtle Ambient Light Glows */}
          <div className="absolute top-0 -left-20 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="lg:max-w-2xl space-y-4 sm:space-y-6">
            {/* Top Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black uppercase tracking-wider shadow-sm">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Smart Vehicle Privacy Tag · Masked Calling & WhatsApp</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 leading-[1.12]">
              Let anyone reach you —{' '}
              <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                without sharing your number.
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-sm sm:text-lg text-slate-600 leading-relaxed max-w-xl font-medium">
              Stick the ParkPing smart tag on your car or bike. If your car is blocking someone, or lights are left on, people scan it with any phone camera and reach you on a <strong>masked call or WhatsApp</strong>. Your personal mobile number stays 100% private.
            </p>

            {/* Pricing & CTA Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
              <button
                onClick={() => scrollToSection(orderRef)}
                className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm tracking-wide glow-yellow transition transform active:scale-95 flex items-center justify-center gap-2.5 shadow-xl cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Buy Smart Tag · ₹399</span>
                <span className="text-xs opacity-75 line-through font-normal">₹799</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollToSection(howItWorksRef)}
                className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-sm border border-slate-300 transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                See How It Works
              </button>
            </div>

            {/* Trust Line */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-600 pt-3 border-t border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <Check className="w-4 h-4 text-emerald-600 font-bold" />
                <span>Zero Number Leak</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <Truck className="w-4 h-4 text-amber-600 font-bold" />
                <span>Free Doorstep Delivery</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <Check className="w-4 h-4 text-blue-600 font-bold" />
                <span>Auto Vahan Details</span>
              </div>
            </div>
          </div>

          {/* Right Floating Badge Visual */}
          <div className="flex flex-col items-center justify-center relative mt-2 lg:mt-0">
            <div className="absolute -inset-6 bg-gradient-to-r from-amber-300/30 to-blue-200/30 rounded-3xl blur-2xl opacity-70 pointer-events-none" />
            <div className="relative transform hover:scale-[1.02] transition duration-300">
              <PrintableBadge tag={demoTag} compact />
            </div>
          </div>
        </section>

        {/* THREE STEPS: HOW IT WORKS */}
        <section ref={howItWorksRef} className="scroll-mt-24 pt-2">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <p className="text-xs font-black uppercase tracking-widest text-amber-600 mb-2">
              HOW IT WORKS
            </p>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950">
              Three steps. That&apos;s the whole thing.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 glass-card-hover relative bg-white">
              <div className="text-4xl font-black font-mono text-amber-500/30 mb-3">01</div>
              <h3 className="text-lg font-black text-slate-900 mb-1.5">Scan the tag</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Anyone can scan the QR sticker using a normal smartphone camera (iPhone or Android) — no mobile app required.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 glass-card-hover relative bg-white">
              <div className="text-4xl font-black font-mono text-amber-500/30 mb-3">02</div>
              <h3 className="text-lg font-black text-slate-900 mb-1.5">They reach out</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                They send a 1-click WhatsApp alert (e.g. &ldquo;Car Blocking Way&rdquo;) or place a masked call, right from the browser.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 glass-card-hover relative bg-white">
              <div className="text-4xl font-black font-mono text-amber-500/30 mb-3">03</div>
              <h3 className="text-lg font-black text-slate-900 mb-1.5">You stay private</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                You receive a masked call or WhatsApp notification. Your personal 10-digit mobile number is never revealed.
              </p>
            </div>
          </div>
        </section>

        {/* CORE FEATURE PILLARS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 glass-card-hover bg-white">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center font-bold mb-4 shadow-sm">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">Private Contact</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Your details are never visible to the person reaching you. Stops harassment, data brokers, and marketing spam.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 glass-card-hover bg-white">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 border border-blue-300 text-blue-700 flex items-center justify-center font-bold mb-4 shadow-sm">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">Masked Calls + WhatsApp</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Calls and WhatsApp alerts are routed through a secure virtual relay. Connects in seconds with zero delay.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 glass-card-hover bg-white">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center font-bold mb-4 shadow-sm">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">Auto Vahan Details & Delivery</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Automatic vehicle details lookup from RTO. Get instant digital eTag + 3M waterproof sticker delivered.
            </p>
          </div>
        </section>

        {/* ORDER TAG SECTION WITH MULTI-VEHICLE & LIVE VAHAN AUTO-FETCH */}
        <section ref={orderRef} className="scroll-mt-24">
          <TagGenerator onStartCheckout={(count, slots) => handleStartCheckout(count, slots)} />
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
        <section ref={faqRef} className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-200/90 space-y-6 scroll-mt-24 bg-white">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950">Frequently Asked Questions</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">Everything you need to know about ordering ParkPing for your car.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1.5">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                Will people see my real phone number?
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                No. ParkPing uses a secure proxy bridge. When someone scans your QR code, they only see your car number and can call or message you through a masked relay. Your real number stays 100% private.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1.5">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                What if I change my phone number or sell my car?
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                You never need to replace the physical QR sticker! Simply update your linked phone number in the portal or transfer the tag to a new owner in 1 click.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1.5">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                Can I order tags for 2 or 3 cars in my family?
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Yes! You can choose the 2-Car Combo (₹699) or 3-Car Family Pack (₹899). Each car can have its own designated driver phone number or share the primary family mobile number.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1.5">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                Does the person scanning need an app?
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                No app required. They simply open their regular phone camera (iPhone or Android), point at the QR sticker, and the instant web portal opens right away.
              </p>
            </div>
          </div>
        </section>

        {/* WRONGLY PARKED VISUAL EXPLAINER & CTA BANNER */}
        <section className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-200/90 bg-gradient-to-br from-white via-amber-50/40 to-blue-50/30 shadow-xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Image Showcase */}
            <div className="lg:col-span-7 flex justify-center items-center">
              <div className="w-full max-w-xl bg-white rounded-3xl p-2 sm:p-4 border border-slate-200 shadow-md hover:shadow-xl transition group">
                <img
                  src="/images/wrongly-parked-banner.png"
                  alt="Wrongly Parked Car Smart QR Notification - ParkPing"
                  className="w-full h-auto object-contain rounded-2xl group-hover:scale-[1.01] transition"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Right Copy & CTA */}
            <div className="lg:col-span-5 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                24/7 Vehicle Protection
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
                Wrongly Parked? <br />
                <span className="text-amber-600">Connect in Seconds.</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                If your car is ever blocking someone’s way or parked in an emergency zone, anyone can easily scan the QR code to call or message you through a 100% private, masked relay.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => scrollToSection(orderRef)}
                  className="py-3.5 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm glow-yellow transition flex items-center justify-center gap-2 shadow-md active:scale-95 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Order Your Smart Tag · ₹399</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* MOBILE STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200/90 z-40 sm:hidden flex items-center justify-between gap-3 shadow-2xl">
        <div className="leading-tight pl-1">
          <div className="text-[10px] uppercase font-bold text-slate-500">Smart Car Tag</div>
          <div className="text-sm font-black text-slate-950">
            ₹399 <span className="text-[11px] line-through text-slate-400 font-normal">₹799</span>
          </div>
        </div>

        <button
          onClick={() => scrollToSection(orderRef)}
          className="flex-1 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs glow-yellow transition flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Buy Smart Tag</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* FOOTER */}
      <footer className="w-full border-t border-slate-200 py-10 px-4 sm:px-8 mt-16 no-print bg-white pb-24 sm:pb-10">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-black font-black text-sm flex items-center justify-center shadow-sm shrink-0">
                PP
              </div>
              <div>
                <span className="text-slate-900 font-black text-base">ParkPing Smart Tag</span>
                <p className="text-xs text-slate-500">Zero Number Leak • Masked Call & WhatsApp Relays Across India</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 font-bold">
              <button onClick={() => scrollToSection(howItWorksRef)} className="hover:text-amber-600 transition cursor-pointer">
                How it works
              </button>
              <button onClick={() => scrollToSection(orderRef)} className="hover:text-amber-600 transition cursor-pointer">
                Buy Smart Tag
              </button>
              <button onClick={() => scrollToSection(orderRef)} className="hover:text-amber-600 transition cursor-pointer">
                Order Online
              </button>
              <button onClick={() => scrollToSection(faqRef)} className="hover:text-amber-600 transition cursor-pointer">
                FAQs
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <span>© {new Date().getFullYear()} ParkPing India. All rights reserved.</span>
            <span>Designed for Indian Car Owners • 100% Privacy Protected</span>
          </div>
        </div>
      </footer>

      {/* CHECKOUT / ORDER MODAL */}
      {showCheckout && (
        <CheckoutOrderModal
          initialTagCount={checkoutInitialCount}
          initialSlots={checkoutInitialSlots}
          onClose={() => setShowCheckout(false)}
          onOrderCompleted={() => {
            // Completed
          }}
        />
      )}
    </div>
  );
}
