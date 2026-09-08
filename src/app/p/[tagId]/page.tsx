import React from 'react';
import PasserbyScanView from '@/components/PasserbyScanView';
import { getTagById, recordScan } from '@/lib/storage';
import { maskPhoneNumber } from '@/lib/mask';
import { ShieldAlert, Car, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ tagId: string }> | { tagId: string };
}

export default async function PublicScanPage({ params }: PageProps) {
  const resolvedParams = await params;
  const tagId = resolvedParams.tagId;
  
  // Fetch from storage
  const tag = getTagById(tagId);

  if (!tag) {
    return (
      <div className="min-h-screen bg-[#080c14] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-rose-950/60 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 shadow-xl">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-white">Invalid or Expired Vehicle Tag</h1>
        <p className="text-sm text-slate-400 max-w-sm mt-2">
          The ParkPing tag ID <strong className="font-mono text-yellow-400">&ldquo;{tagId}&rdquo;</strong> does not exist or has been deactivated by the owner.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Go to ParkPing Home
        </Link>
      </div>
    );
  }

  // Record scan
  recordScan(tagId);

  // Mask phone numbers for public security
  const publicData = {
    id: tag.id,
    vehicleNumber: tag.vehicleNumber,
    vehicleModel: tag.vehicleModel,
    vehicleType: tag.vehicleType,
    status: tag.status,
    statusMessage: tag.statusMessage,
    badgeTheme: tag.badgeTheme,
    maskedPhone: maskPhoneNumber(tag.phoneNumber),
    maskedAlternate: tag.alternatePhone ? maskPhoneNumber(tag.alternatePhone) : undefined,
    hasAlternate: Boolean(tag.alternatePhone),
  };

  return <PasserbyScanView tag={publicData} />;
}
