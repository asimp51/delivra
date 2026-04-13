'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Store, Star, Search, Filter, MoreVertical, CheckCircle, XCircle, Eye } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';

const mockVendors = [
  { id: '1', name: 'Al Baik', category: 'Food & Dining', status: 'verified', rating: 4.8, orders: 2340, joined: '2025-06-15', logo: 'AB' },
  { id: '2', name: 'Carrefour Express', category: 'Grocery', status: 'verified', rating: 4.5, orders: 1820, joined: '2025-07-01', logo: 'CE' },
  { id: '3', name: 'Nahdi Pharmacy', category: 'Pharmacy & Health', status: 'verified', rating: 4.6, orders: 980, joined: '2025-07-20', logo: 'NP' },
  { id: '4', name: 'Flowers Plus', category: 'Flowers & Gifts', status: 'pending', rating: 0, orders: 0, joined: '2026-04-10', logo: 'FP' },
  { id: '5', name: 'Pet World', category: 'Pet Supplies', status: 'verified', rating: 4.3, orders: 420, joined: '2025-09-05', logo: 'PW' },
  { id: '6', name: 'Pizza Hut', category: 'Food & Dining', status: 'verified', rating: 4.1, orders: 3150, joined: '2025-05-20', logo: 'PH' },
  { id: '7', name: 'Fresh Market', category: 'Grocery', status: 'suspended', rating: 3.2, orders: 150, joined: '2025-11-01', logo: 'FM' },
  { id: '8', name: 'Quick Fix', category: 'Home Services', status: 'pending', rating: 0, orders: 0, joined: '2026-04-12', logo: 'QF' },
];

const statusStyle: Record<string, string> = {
  verified: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  suspended: 'bg-red-100 text-red-700',
};

export default function VendorsPage() {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? mockVendors : mockVendors.filter((v) => v.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vendors</h1>
          <p className="text-slate-500 mt-1">Manage all registered vendors and their verification status.</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">{mockVendors.filter(v => v.status === 'verified').length} Verified</span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">{mockVendors.filter(v => v.status === 'pending').length} Pending</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search vendors..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
        </div>
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {['all', 'verified', 'pending', 'suspended'].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={cn('px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-colors', filter === s ? 'bg-white shadow text-slate-900' : 'text-slate-600')}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Vendor</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Category</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Rating</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Orders</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Joined</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((vendor) => (
              <tr key={vendor.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-lg flex items-center justify-center font-bold text-sm">{vendor.logo}</div>
                    <span className="text-sm font-medium text-slate-900">{vendor.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{vendor.category}</td>
                <td className="px-6 py-4">
                  <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', statusStyle[vendor.status])}>{vendor.status}</span>
                </td>
                <td className="px-6 py-4">
                  {vendor.rating > 0 ? (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium">{vendor.rating}</span>
                    </div>
                  ) : <span className="text-xs text-slate-400">N/A</span>}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{vendor.orders.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{formatDate(vendor.joined)}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/vendors/${vendor.id}`} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600"><Eye className="w-4 h-4" /></Link>
                    {vendor.status === 'pending' && <button className="p-1.5 rounded-md hover:bg-green-50 text-slate-400 hover:text-green-600"><CheckCircle className="w-4 h-4" /></button>}
                    {vendor.status !== 'suspended' && <button className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-600"><XCircle className="w-4 h-4" /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
