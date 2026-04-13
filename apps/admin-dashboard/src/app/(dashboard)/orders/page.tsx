'use client';
import { useState } from 'react';
import { Search, Filter, Eye } from 'lucide-react';
import { cn, formatCurrency, formatDateTime, getStatusColor } from '@/lib/utils';

const mockOrders = [
  { id: 'DLV-A8F2C', customer: 'Ahmed Khan', vendor: 'Al Baik', category: 'Food', total: 45.50, status: 'delivered', payment: 'card', created: '2026-04-13T10:30:00Z' },
  { id: 'DLV-B3D1E', customer: 'Sarah Ali', vendor: 'Carrefour', category: 'Grocery', total: 128.00, status: 'in_transit', payment: 'card', created: '2026-04-13T10:15:00Z' },
  { id: 'DLV-C7A9F', customer: 'Omar Hassan', vendor: 'Nahdi Pharmacy', category: 'Pharmacy', total: 32.00, status: 'preparing', payment: 'cash', created: '2026-04-13T10:05:00Z' },
  { id: 'DLV-D2E8B', customer: 'Fatima Noor', vendor: 'Flowers Plus', category: 'Flowers', total: 85.00, status: 'confirmed', payment: 'card', created: '2026-04-13T09:55:00Z' },
  { id: 'DLV-E1F4A', customer: 'Khalid Saeed', vendor: 'Pizza Hut', category: 'Food', total: 67.80, status: 'pending', payment: 'cash', created: '2026-04-13T09:45:00Z' },
  { id: 'DLV-F9C3D', customer: 'Layla Ahmed', vendor: 'Pet World', category: 'Pets', total: 54.25, status: 'rider_assigned', payment: 'wallet', created: '2026-04-13T09:30:00Z' },
  { id: 'DLV-G4H7J', customer: 'Youssef Malik', vendor: 'Quick Mart', category: 'Convenience', total: 18.50, status: 'picked_up', payment: 'card', created: '2026-04-13T09:20:00Z' },
  { id: 'DLV-H2K5L', customer: 'Aisha Rahman', vendor: 'Al Baik', category: 'Food', total: 92.00, status: 'cancelled', payment: 'card', created: '2026-04-13T09:10:00Z' },
  { id: 'DLV-I6M8N', customer: 'Hassan Omar', vendor: 'Water Co', category: 'Water & Gas', total: 15.00, status: 'delivered', payment: 'cash', created: '2026-04-13T08:50:00Z' },
  { id: 'DLV-J3P1Q', customer: 'Nadia Sharif', vendor: 'Fresh Market', category: 'Grocery', total: 210.40, status: 'delivered', payment: 'card', created: '2026-04-13T08:30:00Z' },
];

const statuses = ['all', 'pending', 'confirmed', 'preparing', 'in_transit', 'delivered', 'cancelled'];

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const filtered = statusFilter === 'all' ? mockOrders : mockOrders.filter((o) => o.status === statusFilter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
        <p className="text-slate-500 mt-1">Monitor and manage all orders across the platform.</p>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search by order ID, customer..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm" />
        </div>
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1 overflow-x-auto">
          {statuses.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={cn('px-3 py-1.5 rounded-md text-xs font-medium capitalize whitespace-nowrap transition-colors', statusFilter === s ? 'bg-white shadow text-slate-900' : 'text-slate-600')}>
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Order</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Customer</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Vendor</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Category</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Total</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Payment</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Time</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-semibold text-primary-600">{order.id}</td>
                <td className="px-6 py-4 text-sm text-slate-900">{order.customer}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{order.vendor}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{order.category}</td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-900">{formatCurrency(order.total)}</td>
                <td className="px-6 py-4">
                  <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', getStatusColor(order.status))}>
                    {order.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 capitalize">{order.payment}</td>
                <td className="px-6 py-4 text-xs text-slate-400">{formatDateTime(order.created)}</td>
                <td className="px-4 py-4"><button className="p-1.5 rounded-md hover:bg-slate-100"><Eye className="w-4 h-4 text-slate-400" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
