import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  isRecurring: boolean;
}

export const CATEGORIES = [
  { name: 'Food & Dining', icon: 'Utensils', color: 'bg-orange-100 text-orange-600' },
  { name: 'Transportation', icon: 'Car', color: 'bg-blue-100 text-blue-600' },
  { name: 'Rent & Utilities', icon: 'Home', color: 'bg-purple-100 text-purple-600' },
  { name: 'Shopping', icon: 'ShoppingBag', color: 'bg-pink-100 text-pink-600' },
  { name: 'Entertainment', icon: 'Film', color: 'bg-indigo-100 text-indigo-600' },
  { name: 'Health & Fitness', icon: 'Heart', color: 'bg-red-100 text-red-600' },
  { name: 'Travel', icon: 'Plane', color: 'bg-emerald-100 text-emerald-600' },
  { name: 'Others', icon: 'MoreHorizontal', color: 'bg-slate-100 text-slate-600' },
];
