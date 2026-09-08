'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, ShieldCheck, Menu, X, ArrowRight, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenCheckout: () => void;
  onScrollToHowItWorks?: () => void;
  onScrollToOrder?: () => void;
  onScrollToFaq?: () => void;
}

export default function Navbar({
  onOpenCheckout,
  onScrollToHowItWorks,
  onScrollToOrder,
  onScrollToFaq,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (callback?: () => void) => {
    callback?.();
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-8 py-3.5 no-print shadow-sm transition">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 text-black font-black text-lg flex items-center justify-center shadow-md group-hover:scale-105 transition">
            PP
          </div>
          <div>
            <div className="font-black text-xl tracking-tight text-slate-900 flex items-center gap-2">
              <span>PARKPING</span>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                SAMPARK TAG
              </span>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium hidden sm:flex">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero Number Leak • Masked Calls & WhatsApp</span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-7 text-xs font-bold text-slate-600">
          <button
            onClick={onScrollToHowItWorks}
            className="hover:text-amber-600 transition"
          >
            How it Works
          </button>
          <button
            onClick={onScrollToOrder}
            className="hover:text-amber-600 transition"
          >
            Order Tag
          </button>
          <button
            onClick={onScrollToFaq}
            className="hover:text-amber-600 transition"
          >
            FAQs
          </button>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenCheckout}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs glow-yellow transition active:scale-95 shadow-md cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Buy Tag · ₹399</span>
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 border border-slate-200 transition active:scale-95"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-4 pb-3 border-t border-slate-200 mt-3 space-y-2 animate-fadeIn bg-white">
          <button
            onClick={() => handleNavClick(onScrollToHowItWorks)}
            className="w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100 hover:text-slate-950 transition flex items-center justify-between"
          >
            <span>How it Works</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <button
            onClick={() => handleNavClick(onScrollToOrder)}
            className="w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100 hover:text-slate-950 transition flex items-center justify-between"
          >
            <span>Order Smart Tag</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <button
            onClick={() => handleNavClick(onScrollToFaq)}
            className="w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100 hover:text-slate-950 transition flex items-center justify-between"
          >
            <span>FAQs</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => handleNavClick(onOpenCheckout)}
              className="w-full py-3 px-4 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Buy Tag Now · ₹399</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
