'use client';

import React from 'react';
import { Sparkles, ShoppingCart, ShieldCheck, Car, Eye, HelpCircle } from 'lucide-react';

interface NavbarProps {
  onOpenCheckout: () => void;
  onScrollToHowItWorks?: () => void;
  onScrollToOrder?: () => void;
  onScrollToSimulator?: () => void;
  onScrollToFaq?: () => void;
}

export default function Navbar({
  onOpenCheckout,
  onScrollToHowItWorks,
  onScrollToOrder,
  onScrollToSimulator,
  onScrollToFaq,
}: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 px-4 sm:px-8 py-3.5 no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 text-black font-black text-lg flex items-center justify-center shadow-md">
            PP
          </div>
          <div>
            <div className="font-black text-xl tracking-tight text-white flex items-center gap-2">
              <span>PARKPING</span>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400 border border-yellow-400/40">
                SAMPARK TAG
              </span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium hidden sm:flex">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero Number Leak • Masked Calls & WhatsApp</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-300">
          <button
            onClick={onScrollToHowItWorks}
            className="hover:text-yellow-400 transition"
          >
            How it Works
          </button>
          <button
            onClick={onScrollToSimulator}
            className="hover:text-yellow-400 transition"
          >
            Windshield Preview
          </button>
          <button
            onClick={onScrollToOrder}
            className="hover:text-yellow-400 transition"
          >
            Get the Tag
          </button>
          <button
            onClick={onScrollToFaq}
            className="hover:text-yellow-400 transition"
          >
            FAQs
          </button>
        </div>

        {/* Right CTA Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCheckout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs glow-yellow transition active:scale-95 shadow-md"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Buy Tag · ₹399</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
