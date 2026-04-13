'use client';
import { useState } from 'react';
import { Plus, Tag, Trash2, Edit } from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

const mockPromos = [
  { id: '1', code: 'WELCOME50', type: 'percentage', value: 50, minOrder: 20, maxDiscount: 15, maxUses: 1000, used: 423, starts: '2026-03-01', expires: '2026-06-30', active: true },
  { id: '2', code: 'FREEDEL', type: 'free_delivery', value: 0, minOrder: 10, maxDiscount: null, maxUses: null, used: 1892, starts: '2026-04-01', expires: '2026-04-30', active: true },
  { id: '3', code: 'SAVE10', type: 'fixed_amount', value: 10, minOrder: 50, maxDiscount: null, maxUses: 500, used: 500, starts: '2026-01-01', expires: '2026-03-31', active: false },
  { id: '4', code: 'GROCERY20', type: 'percentage', value: 20, minOrder: 30, maxDiscount: 20, maxUses: 2000, used: 756, starts: '2026-04-01', expires: '2026-05-31', active: true },
];

const typeLabel: Record<string, string> = { percentage: '%', fixed_amount: '$', free_delivery: 'Free Del.' };

export default function PromotionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Promotions</h1>
          <p className="text-slate-500 mt-1">Create and manage promo codes.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium text-sm">
          <Plus className="w-4 h-4" /> Create Promo
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Code</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Type</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Value</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Min Order</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Usage</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Period</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
              <th className="w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockPromos.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-primary-500" />
                    <span className="text-sm font-mono font-bold text-slate-900">{p.code}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 capitalize">{p.type.replace('_', ' ')}</td>
                <td className="px-6 py-4 text-sm font-medium">{p.type === 'percentage' ? `${p.value}%` : p.type === 'fixed_amount' ? formatCurrency(p.value) : '-'}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{formatCurrency(p.minOrder)}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="font-medium">{p.used}</span>
                  {p.maxUses && <span className="text-slate-400">/{p.maxUses}</span>}
                </td>
                <td className="px-6 py-4 text-xs text-slate-500">{formatDate(p.starts)} - {formatDate(p.expires)}</td>
                <td className="px-6 py-4">
                  <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', p.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
                    {p.active ? 'Active' : 'Expired'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-1">
                    <button className="p-1.5 hover:bg-slate-100 rounded-md"><Edit className="w-4 h-4 text-slate-400" /></button>
                    <button className="p-1.5 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" /></button>
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
