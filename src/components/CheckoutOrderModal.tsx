'use client';

import React, { useState } from 'react';
import { VehicleTag, BadgeTheme } from '@/lib/types';
import { formatVehicleNumber } from '@/lib/mask';
import { VehicleDetails } from '@/lib/vahan';
import PrintableBadge from './PrintableBadge';
import { 
  CreditCard, 
  Car, 
  CheckCircle2, 
  Truck, 
  Lock, 
  ArrowRight, 
  X, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export interface VehicleSlot {
  vehicleNumber: string;
  mobileNumber: string;
  details?: VehicleDetails;
  loadingDetails?: boolean;
}

interface CheckoutOrderModalProps {
  onClose: () => void;
  onOrderCompleted: (createdTags: VehicleTag[]) => void;
  initialVehicleNumber?: string;
  initialTagCount?: 1 | 2 | 3;
  initialSlots?: VehicleSlot[];
}

export default function CheckoutOrderModal({
  onClose,
  onOrderCompleted,
  initialVehicleNumber = '',
  initialTagCount = 1,
  initialSlots,
}: CheckoutOrderModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [tagCount, setTagCount] = useState<1 | 2 | 3>(initialTagCount);
  
  // Slots for 1, 2, or 3 vehicles
  const [slots, setSlots] = useState<VehicleSlot[]>(() => {
    if (initialSlots && initialSlots.length > 0) {
      const merged = [...initialSlots];
      while (merged.length < 3) {
        merged.push({ vehicleNumber: '', mobileNumber: '' });
      }
      return merged;
    }
    return [
      {
        vehicleNumber: initialVehicleNumber ? formatVehicleNumber(initialVehicleNumber) : '',
        mobileNumber: '',
      },
      {
        vehicleNumber: '',
        mobileNumber: '',
      },
      {
        vehicleNumber: '',
        mobileNumber: '',
      },
    ];
  });

  // Delivery Address
  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    pincode: '',
    city: 'New Delhi',
    state: 'Delhi',
  });

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [processing, setProcessing] = useState(false);
  const [createdTags, setCreatedTags] = useState<VehicleTag[]>([]);

  // Prices
  const getPrice = () => {
    if (tagCount === 1) return 399;
    if (tagCount === 2) return 699;
    return 899;
  };

  // Auto-fetch vehicle details
  const handleVehicleNumberChange = async (index: number, val: string) => {
    const formatted = formatVehicleNumber(val);
    const updatedSlots = [...slots];
    updatedSlots[index].vehicleNumber = formatted;
    setSlots(updatedSlots);

    const cleanLength = formatted.replace(/\s+/g, '').length;
    if (cleanLength >= 8) {
      updatedSlots[index].loadingDetails = true;
      setSlots([...updatedSlots]);

      try {
        const res = await fetch(`/api/vehicle-lookup?plate=${encodeURIComponent(formatted)}`);
        const data = await res.json();
        if (data.success && data.vehicle) {
          updatedSlots[index].details = data.vehicle;
        }
      } catch (err) {
        console.error('Vehicle lookup error:', err);
      } finally {
        updatedSlots[index].loadingDetails = false;
        setSlots([...updatedSlots]);
      }
    }
  };

  const handlePincodeChange = (pin: string) => {
    setAddress({ ...address, pincode: pin });
    if (pin.length === 6) {
      if (pin.startsWith('11')) setAddress((prev) => ({ ...prev, city: 'New Delhi', state: 'Delhi' }));
      else if (pin.startsWith('40') || pin.startsWith('41')) setAddress((prev) => ({ ...prev, city: 'Mumbai', state: 'Maharashtra' }));
      else if (pin.startsWith('56')) setAddress((prev) => ({ ...prev, city: 'Bengaluru', state: 'Karnataka' }));
      else if (pin.startsWith('12')) setAddress((prev) => ({ ...prev, city: 'Gurgaon', state: 'Haryana' }));
      else if (pin.startsWith('20')) setAddress((prev) => ({ ...prev, city: 'Noida', state: 'Uttar Pradesh' }));
    }
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const activeSlots = slots.slice(0, tagCount);
    for (let i = 0; i < activeSlots.length; i++) {
      if (!activeSlots[i].vehicleNumber || !activeSlots[i].mobileNumber) {
        alert(`Please fill in Vehicle Number and Mobile Number for Car #${i + 1}`);
        return;
      }
    }
    if (!address.fullName || !address.street || !address.pincode) {
      alert('Please fill out your delivery address');
      return;
    }
    setStep(2);
  };

  const handleCompleteOrder = async () => {
    setProcessing(true);
    try {
      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const activeSlots = slots.slice(0, tagCount);
      const items = activeSlots.map((slot) => ({
        orderId,
        vehicleNumber: slot.vehicleNumber,
        phoneNumber: slot.mobileNumber,
        ownerName: address.fullName,
        vehicleModel: slot.details?.model || 'Motor Vehicle',
        vehicleType: slot.details?.vehicleType || 'car',
        badgeTheme: 'amber_neon' as BadgeTheme,
        statusMessage: 'Parked vehicle. Call / WhatsApp if my car requires attention.',
        shippingAddress: address,
        paymentStatus: paymentMethod,
        fulfillmentStatus: 'pending_print' as const,
        price: getPrice() / tagCount,
      }));

      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      const data = await res.json();
      if (data.success && data.tags) {
        setCreatedTags(data.tags);
        onOrderCompleted(data.tags);
        setStep(3);
      } else {
        alert(data.error || 'Failed to generate tags');
      }
    } catch (err: any) {
      alert(err.message || 'Error completing order');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-3xl rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 flex flex-col shadow-2xl relative my-8 text-slate-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: VEHICLE & DELIVERY DETAILS */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-6">
            {/* Header */}
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2 text-amber-600 text-xs font-black uppercase tracking-wider mb-1">
                <Truck className="w-4 h-4" />
                Step 1 of 2 · Vehicle & Delivery
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
                Order Your Smart Vehicle Tag
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                Free shipping across India · Automatic vehicle lookup from Vahan database · Ships in 24 hrs
              </p>
            </div>

            {/* Tag Pack Selector */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                Select Number of Vehicles / Tags:
              </label>
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                {[
                  { count: 1, title: '1 Car Tag', price: '₹399', orig: '₹799', badge: 'Popular' },
                  { count: 2, title: '2 Cars Combo', price: '₹699', orig: '₹1599', badge: 'Save ₹100' },
                  { count: 3, title: '3 Cars Family', price: '₹899', orig: '₹2399', badge: 'Best Value' },
                ].map((plan) => (
                  <button
                    key={plan.count}
                    type="button"
                    onClick={() => setTagCount(plan.count as any)}
                    className={`p-3 sm:p-3.5 rounded-2xl border-2 text-left flex flex-col justify-between transition relative ${
                      tagCount === plan.count
                        ? 'bg-amber-50/80 border-amber-500 text-slate-950 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-400 text-slate-950">
                      {plan.badge}
                    </div>
                    <div className="text-xs font-black text-slate-900">{plan.title}</div>
                    <div className="mt-1">
                      <span className="text-sm font-black text-amber-600">{plan.price}</span>{' '}
                      <span className="text-[10px] line-through text-slate-400">{plan.orig}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Inputs per Slot */}
            <div className="space-y-4">
              {Array.from({ length: tagCount }).map((_, idx) => {
                const slot = slots[idx];
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5 text-amber-600" />
                        Vehicle #{idx + 1}
                      </span>
                      {slot.loadingDetails && (
                        <span className="text-[10px] text-blue-600 font-bold flex items-center gap-1">
                          <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          Fetching Vahan details...
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Vehicle Registration Number *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. DL 01 AB 1234"
                          value={slot.vehicleNumber}
                          onChange={(e) => handleVehicleNumberChange(idx, e.target.value)}
                          className="w-full bg-white border border-slate-300 focus:border-amber-500 rounded-xl px-3 py-2.5 text-base sm:text-sm font-mono font-bold text-slate-900 placeholder:text-slate-400 uppercase focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Owner Mobile Number (For Masked Calls) *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="9876543210"
                          value={slot.mobileNumber}
                          onChange={(e) => {
                            const updated = [...slots];
                            updated[idx].mobileNumber = e.target.value;
                            setSlots(updated);
                          }}
                          className="w-full bg-white border border-slate-300 focus:border-amber-500 rounded-xl px-3 py-2.5 text-base sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    {slot.details && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between gap-3 text-xs animate-fadeIn">
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            {slot.details.model} ({slot.details.color})
                          </div>
                          <div className="text-[10px] text-slate-600 mt-0.5">
                            {slot.details.rtoLocation} • Fuel: <strong className="text-amber-700">{slot.details.fuelType}</strong>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                          RTO Verified
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Delivery Address */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-black uppercase tracking-wider text-slate-800">
                Shipping & Delivery Address
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-base sm:text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">PIN Code (6 Digits) *</label>
                  <input
                    type="tel"
                    required
                    maxLength={6}
                    placeholder="110001"
                    value={address.pincode}
                    onChange={(e) => handlePincodeChange(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-base sm:text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Street Address, House / Flat No. *</label>
                  <input
                    type="text"
                    required
                    placeholder="House No., Building Name, Area, Landmark"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-base sm:text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">City</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-base sm:text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">State</label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-base sm:text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 1 Submit Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex sm:flex-col justify-between items-center sm:items-start">
                <div className="text-xs text-slate-500">Total Amount:</div>
                <div className="text-xl font-black text-slate-950">₹{getPrice()}</div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm glow-yellow transition flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: CHOOSE PAYMENT METHOD */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2 text-amber-600 text-xs font-black uppercase tracking-wider mb-1">
                <CreditCard className="w-4 h-4" />
                Step 2 of 2 · Payment Method
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
                Choose How to Pay
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                100% Secure 256-Bit Encrypted Checkout · Instant digital QR download + physical tag shipping
              </p>
            </div>

            {/* Order Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">
                  ParkPing Smart Tags ({tagCount} Vehicle{tagCount > 1 ? 's' : ''})
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Delivering to: {address.fullName}, {address.city} ({address.pincode})
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-slate-950">₹{getPrice()}</div>
                <div className="text-[10px] text-emerald-600 font-bold">Free Shipping</div>
              </div>
            </div>

            {/* Payment Options */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition ${
                  paymentMethod === 'upi'
                    ? 'bg-amber-50/80 border-amber-500 text-slate-950 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-sm">
                    UPI
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">Instant UPI / QR / Google Pay / Paytm</div>
                    <div className="text-[11px] text-slate-500">Instant digital eTag delivery + Free physical tag</div>
                  </div>
                </div>
                <div className="text-sm font-black text-slate-950">₹{getPrice()}</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition ${
                  paymentMethod === 'card'
                    ? 'bg-amber-50/80 border-amber-500 text-slate-950 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center">
                    CARD
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">Credit / Debit Card / NetBanking</div>
                    <div className="text-[11px] text-slate-500">Visa, Mastercard, RuPay, Amex</div>
                  </div>
                </div>
                <div className="text-sm font-black text-slate-950">₹{getPrice()}</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition ${
                  paymentMethod === 'cod'
                    ? 'bg-amber-50/80 border-amber-500 text-slate-950 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center">
                    COD
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">Cash on Delivery (Pay upon arrival)</div>
                    <div className="text-[11px] text-slate-500">Pay cash/UPI to courier upon tag delivery</div>
                  </div>
                </div>
                <div className="text-sm font-black text-slate-950">₹{getPrice()}</div>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-slate-600 hover:text-slate-900 font-bold py-2 text-center"
              >
                ← Back to Vehicle details
              </button>

              <button
                type="button"
                onClick={handleCompleteOrder}
                disabled={processing}
                className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm glow-yellow transition flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95"
              >
                {processing ? (
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay ₹{getPrice()} & Activate Tag</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ORDER SUCCESS */}
        {step === 3 && (
          <div className="space-y-6 text-center py-2 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-300 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider mb-2 border border-emerald-200">
                ✓ Order Confirmed · Tag Activated
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
                Your Smart Vehicle Tag is Live!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1 font-medium">
                We have linked your vehicle with masked calling. Your digital eTag is ready to download and the physical 3M waterproof tag will be delivered in 2–3 days.
              </p>
            </div>

            {/* Generated Badges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center py-2">
              {createdTags.map((tag) => (
                <div key={tag.id} className="relative group">
                  <PrintableBadge tag={tag} compact />
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <a
                      href={`/p/${tag.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-blue-700 text-xs font-bold border border-slate-300 flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Test Scan
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Confirmation Note */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 max-w-lg mx-auto flex items-center gap-3 text-left">
              <Truck className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <div className="font-bold text-slate-900">Dispatched to WhatsApp & Shipping Address</div>
                <div className="text-[11px] text-slate-500">
                  Digital eTag PDF sent to your WhatsApp. Physical waterproof sticker arriving at {address.street}, {address.city}.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="py-3 px-8 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs glow-yellow transition shadow-md"
            >
              Done · Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
