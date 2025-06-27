// Utility helper functions

import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { BID_INCREMENT_RULES } from './constants';

/**
 * Format currency with locale-specific formatting
 */
export function formatCurrency(amount: number, currency: string = 'AED'): string {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Sanitize text to prevent XSS
 */
export function sanitizeText(text: string, maxLength: number = 255): string {
  if (typeof text !== 'string') return '';
  
  return text
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .trim()
    .substring(0, maxLength);
}

/**
 * Get dynamic bid increment based on current bid
 */
export function getDynamicIncrement(currentBid: number): number {
  const rule = BID_INCREMENT_RULES.find(r => currentBid < r.max);
  return rule ? rule.increment : 5000;
}

/**
 * Validate bid amount
 */
export function validateBidAmount(amount: number, minAmount: number): { valid: boolean; error?: string } {
  if (isNaN(amount) || amount <= 0) {
    return { valid: false, error: 'Cantidad inválida' };
  }
  
  if (amount < minAmount) {
    return { valid: false, error: `La puja mínima es ${formatCurrency(minAmount)}` };
  }
  
  if (amount > 9999999) {
    return { valid: false, error: 'Cantidad demasiado alta' };
  }
  
  return { valid: true };
}

/**
 * Parse price range string
 */
export function parsePriceRange(range: string): { min: number; max: number } | null {
  if (!range) return null;
  
  if (range === '50000+') {
    return { min: 50000, max: Infinity };
  }
  
  const [min, max] = range.split('-').map(Number);
  return { min, max };
}

/**
 * Format date with locale
 */
export function formatDate(date: string | Date, formatStr: string = 'PPp'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: es });
}

/**
 * Get relative time
 */
export function getRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: es });
}

/**
 * Calculate time left for auction
 */
export function calculateTimeLeft(closingDate: string): string {
  const closing = new Date(closingDate);
  const now = new Date();
  const diff = closing.getTime() - now.getTime();
  
  if (diff <= 0) return 'Cerrado';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Check if user can bid
 */
export function canUserBid(status: string): boolean {
  return status === 'approved';
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Validate phone number (UAE format)
 */
export function isValidPhone(phone: string): boolean {
  const re = /^(\+971)?[0-9]{9}$/;
  return re.test(phone.replace(/[\s-]/g, ''));
}

/**
 * Class names helper
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Remove BOM from string
 */
export function removeBOM(str: string): string {
  if (str.charCodeAt(0) === 0xFEFF) {
    return str.slice(1);
  }
  return str;
}

/**
 * Safe JSON parse
 */
export function safeJSONParse<T>(text: string): T | null {
  try {
    const cleanText = removeBOM(text);
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('JSON parse error:', error);
    return null;
  }
}

/**
 * Get initials from name
 */
export function getInitials(firstName: string, lastName?: string): string {
  const first = firstName?.charAt(0).toUpperCase() || '';
  const last = lastName?.charAt(0).toUpperCase() || '';
  return first + last;
}

/**
 * Translate specification key
 */
export function translateSpec(key: string): string {
  const translations: Record<string, string> = {
    engine: 'Motor',
    transmission: 'Transmisión',
    fuel: 'Combustible',
    color: 'Color',
    location: 'Ubicación',
    mileage: 'Kilometraje',
    year: 'Año',
    condition: 'Condición',
    model: 'Modelo',
  };
  return translations[key] || key;
}
