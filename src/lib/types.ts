export type VehicleType = 'car' | 'suv' | 'hatchback' | 'bike' | 'truck' | 'ev';

export type TagStatus = 'active' | 'dnd' | 'inactive';

export type BadgeTheme = 'dark_carbon' | 'amber_neon' | 'clean_white' | 'cyber_cyan';

export type FulfillmentStatus = 'pending_print' | 'printed' | 'dispatched' | 'delivered';

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface VehicleTag {
  id: string; // e.g. "PP-88219"
  orderId?: string; // e.g. "ORD-94821"
  vehicleNumber: string; // e.g. "DL 01 AB 1234"
  phoneNumber: string; // e.g. "+91 9876543210"
  alternatePhone?: string; // e.g. "+91 9876500000"
  ownerName?: string;
  vehicleModel?: string; // e.g. "Hyundai Creta"
  vehicleType: VehicleType;
  status: TagStatus;
  statusMessage?: string; // e.g. "Parked for 15 mins. Call if urgent."
  createdAt: string;
  updatedAt: string;
  scanCount: number;
  lastScannedAt?: string;
  badgeTheme: BadgeTheme;
  fulfillmentStatus?: FulfillmentStatus;
  shippingAddress?: ShippingAddress;
  paymentStatus?: 'paid' | 'cod' | 'pending';
  price?: number;
}

export type AlertType = 
  | 'blocking'
  | 'alarm'
  | 'lights_on'
  | 'window_open'
  | 'towing'
  | 'custom';

export interface QuickAlertTemplate {
  id: AlertType;
  label: string;
  iconName: string;
  shortDesc: string;
  defaultMessage: string;
  urgency: 'high' | 'medium' | 'normal';
}

export interface PingLog {
  id: string;
  tagId: string;
  vehicleNumber: string;
  alertType: AlertType;
  message: string;
  senderPhoneMasked?: string;
  actionType: 'call' | 'whatsapp' | 'sms' | 'ping';
  createdAt: string;
  status: 'delivered' | 'pending' | 'failed';
}

export interface CreateTagInput {
  vehicleNumber: string;
  phoneNumber: string;
  alternatePhone?: string;
  ownerName?: string;
  vehicleModel?: string;
  vehicleType?: VehicleType;
  badgeTheme?: BadgeTheme;
  statusMessage?: string;
  orderId?: string;
  fulfillmentStatus?: FulfillmentStatus;
  shippingAddress?: ShippingAddress;
  paymentStatus?: 'paid' | 'cod' | 'pending';
  price?: number;
}

