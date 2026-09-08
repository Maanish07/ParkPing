'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, ShieldCheck } from 'lucide-react';

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
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-8 py-3.5 no-print shadow-sm transition">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 text-black font-black text-lg flex items-center justify-center shadow-md group-hover:scale-105 transition shrink-0">
            PP
          </div>
          <div>
            <div className="font-black text-xl tracking-tight text-slate-900">
              PARKPING
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
            className="hover:text-amber-600 transition cursor-pointer"
          >
            How it Works
          </button>
          <button
            onClick={onScrollToOrder}
            className="hover:text-amber-600 transition cursor-pointer"
          >
            Order Tag
          </button>
          <button
            onClick={onScrollToFaq}
            className="hover:text-amber-600 transition cursor-pointer"
          >
            FAQs
          </button>
        </div>

        {/* Right CTA Action */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onScrollToOrder || onOpenCheckout}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs glow-yellow transition active:scale-95 shadow-md cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 shrink-0" />
            <span>Buy Tag · ₹399</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
