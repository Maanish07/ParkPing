/**
 * Masks a phone number so only country code and the last 2-3 digits are visible.
 * Example: "+91 9876543210" -> "+91 98•• •••• 10" or "+91 98XXX XXX10"
 */
export function maskPhoneNumber(phone: string, symbol: string = '•'): string {
  if (!phone) return '••••••••••';
  
  // Clean non-digit characters except leading plus
  const hasPlus = phone.startsWith('+');
  const digitsOnly = phone.replace(/\D/g, '');
  
  if (digitsOnly.length <= 4) {
    return digitsOnly.replace(/./g, symbol);
  }

  const prefix = digitsOnly.slice(0, 2);
  const suffix = digitsOnly.slice(-2);
  const maskedMiddle = symbol.repeat(Math.max(4, digitsOnly.length - 4));
  
  const formattedMask = `${hasPlus ? '+' : ''}${prefix} ${maskedMiddle.slice(0, 3)} ${maskedMiddle.slice(3)} ${suffix}`;
  return formattedMask;
}

/**
 * Normalizes vehicle number to standard uppercase spaced format
 * Example: "dl01ab1234" -> "DL 01 AB 1234"
 */
export function formatVehicleNumber(raw: string): string {
  if (!raw) return '';
  const clean = raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  
  // Typical Indian format: 2 letters, 2 digits, 1-2 letters, 4 digits (e.g. DL 01 AB 1234)
  const regex = /^([A-Z]{2})([0-9]{1,2})([A-Z]{0,3})([0-9]{1,4})$/;
  const match = clean.match(regex);
  if (match) {
    return [match[1], match[2], match[3], match[4]].filter(Boolean).join(' ');
  }
  return clean;
}

/**
 * Generate a friendly alphanumeric tag identifier like "PP-79214"
 */
export function generateTagId(): string {
  const prefix = 'PP';
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${randomNum}`;
}
