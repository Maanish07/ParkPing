import { VehicleTag, PingLog, CreateTagInput } from './types';
import { generateTagId, formatVehicleNumber } from './mask';

// Default initial vehicle tags for immediate demonstration with order fulfillment details
const INITIAL_TAGS: VehicleTag[] = [
  {
    id: 'PP-48291',
    orderId: 'ORD-1092',
    vehicleNumber: 'DL 01 AB 1234',
    phoneNumber: '+91 98765 43210',
    alternatePhone: '+91 98111 22334',
    ownerName: 'Rahul Sharma',
    vehicleModel: 'Hyundai Creta (White)',
    vehicleType: 'suv',
    status: 'active',
    statusMessage: 'Parked in B-2 slot. Call if emergency.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    scanCount: 14,
    lastScannedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    badgeTheme: 'amber_neon',
    fulfillmentStatus: 'pending_print',
    paymentStatus: 'paid',
    price: 399,
    shippingAddress: {
      fullName: 'Rahul Sharma',
      street: 'Flat 402, Sunshine Apartments, Sector 14',
      city: 'Gurgaon',
      state: 'Haryana',
      pincode: '122001',
    },
  },
  {
    id: 'PP-91304',
    orderId: 'ORD-1093',
    vehicleNumber: 'MH 02 CD 5678',
    phoneNumber: '+91 98765 43210',
    alternatePhone: '',
    ownerName: 'Rahul Sharma',
    vehicleModel: 'Honda City (Black)',
    vehicleType: 'car',
    status: 'active',
    statusMessage: 'Available for urgent relocation.',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date().toISOString(),
    scanCount: 6,
    lastScannedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    badgeTheme: 'dark_carbon',
    fulfillmentStatus: 'pending_print',
    paymentStatus: 'paid',
    price: 399,
    shippingAddress: {
      fullName: 'Rahul Sharma',
      street: 'Flat 402, Sunshine Apartments, Sector 14',
      city: 'Gurgaon',
      state: 'Haryana',
      pincode: '122001',
    },
  },
  {
    id: 'PP-33921',
    orderId: 'ORD-1088',
    vehicleNumber: 'KA 03 EF 9012',
    phoneNumber: '+91 98222 33445',
    alternatePhone: '+91 98765 43210',
    ownerName: 'Priya Sharma',
    vehicleModel: 'Tata Nexon EV (Blue)',
    vehicleType: 'ev',
    status: 'dnd',
    statusMessage: 'Parked till 6 PM. Message via WhatsApp.',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    scanCount: 2,
    lastScannedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    badgeTheme: 'cyber_cyan',
    fulfillmentStatus: 'dispatched',
    paymentStatus: 'paid',
    price: 399,
    shippingAddress: {
      fullName: 'Priya Sharma',
      street: 'Villa 12, Palm Meadows, Whitefield',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560066',
    },
  }
];

const INITIAL_LOGS: PingLog[] = [
  {
    id: 'log-1',
    tagId: 'PP-48291',
    vehicleNumber: 'DL 01 AB 1234',
    alertType: 'blocking',
    message: 'Car parked close to exit gate, please shift slightly.',
    actionType: 'whatsapp',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'delivered',
  },
  {
    id: 'log-2',
    tagId: 'PP-91304',
    vehicleNumber: 'MH 02 CD 5678',
    alertType: 'lights_on',
    message: 'Headlights are on in basement parking.',
    actionType: 'call',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    status: 'delivered',
  }
];

// Global in-memory cache for API routes
let memoryTags: VehicleTag[] = [...INITIAL_TAGS];
let memoryLogs: PingLog[] = [...INITIAL_LOGS];

export function getAllTags(): VehicleTag[] {
  return memoryTags;
}

export function getTagById(id: string): VehicleTag | undefined {
  return memoryTags.find(t => t.id.toLowerCase() === id.toLowerCase());
}

export function createTag(input: CreateTagInput): VehicleTag {
  const newTag: VehicleTag = {
    id: generateTagId(),
    orderId: input.orderId || `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    vehicleNumber: formatVehicleNumber(input.vehicleNumber),
    phoneNumber: input.phoneNumber.trim(),
    alternatePhone: input.alternatePhone?.trim() || '',
    ownerName: input.ownerName?.trim() || 'Car Owner',
    vehicleModel: input.vehicleModel?.trim() || 'Vehicle',
    vehicleType: input.vehicleType || 'car',
    status: 'active',
    statusMessage: input.statusMessage?.trim() || 'Scan to contact owner if vehicle requires attention.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    scanCount: 0,
    badgeTheme: input.badgeTheme || 'amber_neon',
    fulfillmentStatus: input.fulfillmentStatus || 'pending_print',
    shippingAddress: input.shippingAddress,
    paymentStatus: input.paymentStatus || 'paid',
    price: input.price || 399,
  };

  memoryTags.unshift(newTag);
  return newTag;
}

export function createBulkTags(inputs: CreateTagInput[]): VehicleTag[] {
  const commonOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  return inputs.map(input => createTag({
    ...input,
    orderId: input.orderId || commonOrderId,
  }));
}

export function updateTag(id: string, updates: Partial<VehicleTag>): VehicleTag | null {
  const index = memoryTags.findIndex(t => t.id.toLowerCase() === id.toLowerCase());
  if (index === -1) return null;

  const current = memoryTags[index];
  const updated: VehicleTag = {
    ...current,
    ...updates,
    vehicleNumber: updates.vehicleNumber ? formatVehicleNumber(updates.vehicleNumber) : current.vehicleNumber,
    updatedAt: new Date().toISOString(),
  };

  memoryTags[index] = updated;
  return updated;
}

export function deleteTag(id: string): boolean {
  const initialLen = memoryTags.length;
  memoryTags = memoryTags.filter(t => t.id.toLowerCase() !== id.toLowerCase());
  return memoryTags.length < initialLen;
}

export function recordScan(id: string): VehicleTag | null {
  const tag = getTagById(id);
  if (!tag) return null;
  return updateTag(id, {
    scanCount: (tag.scanCount || 0) + 1,
    lastScannedAt: new Date().toISOString(),
  });
}

export function addPingLog(log: Omit<PingLog, 'id' | 'createdAt'>): PingLog {
  const newLog: PingLog = {
    ...log,
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
  };
  memoryLogs.unshift(newLog);
  return newLog;
}

export function getPingLogs(tagId?: string): PingLog[] {
  if (tagId) {
    return memoryLogs.filter(l => l.tagId.toLowerCase() === tagId.toLowerCase());
  }
  return memoryLogs;
}
