'use client';
import { Search, Users } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

const mockCustomers = [
  { id: '1', name: 'Ahmed Khan', email: 'ahmed@email.com', phone: '+966501234567', orders: 45, spent: 2340, joined: '2025-06-15' },
  { id: '2', name: 'Sarah Ali', email: 'sarah@email.com', phone: '+966509876543', orders: 32, spent: 1820, joined: '2025-07-01' },
  { id: '3', name: 'Omar Hassan', email: 'omar@email.com', phone: '+966505551234', orders: 28, spent: 1450, joined: '2025-07-20' },
  { id: '4', name: 'Fatima Noor', email: 'fatima@email.com', phone: '+966507778899', orders: 52, spent: 3200, joined: '2025-05-10' },
  { id: '5', name: 'Khalid Saeed', email: 'khalid@email.com', phone: '+966502223344', orders: 15, spent: 680, joined: '2025-11-01' },
  { id: '6', name: 'Layla Ahmed', email: 'layla@email.com', phone: '+966508889900', orders: 67, spent: 4100, joined: '2025-04-22' },
  { id: '7', name: 'Youssef Malik', email: 'youssef@email.com', phone: '+966503334455', orders: 8, spent: 290, joined: '2026-01-15' },
  { id: '8', name: 'Nadia Sharif', email: 'nadia@email.com', phone: '+966506667788', orders: 41, spent: 2870, joined: '2025-08-10' },
];

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
          <p className="text-slate-500 mt-1">{mockCustomers.length} registered customers.</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Search by name, email, phone..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm" />
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Customer</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Email</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Phone</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Orders</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Total Spent</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockCustomers.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">{c.name.split(' ').map(n=>n[0]).join('')}</div>
                    <span className="text-sm font-medium text-slate-900">{c.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{c.email}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{c.phone}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{c.orders}</td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-900">{formatCurrency(c.spent)}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{formatDate(c.joined)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
