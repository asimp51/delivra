'use client';
import { formatCurrency, formatDateTime, cn } from '@/lib/utils';

const mockPayments = [
  { id: 'PAY-001', order: 'DLV-A8F2C', amount: 45.50, method: 'card', status: 'completed', date: '2026-04-13T10:30:00Z' },
  { id: 'PAY-002', order: 'DLV-B3D1E', amount: 128.00, method: 'card', status: 'completed', date: '2026-04-13T10:15:00Z' },
  { id: 'PAY-003', order: 'DLV-C7A9F', amount: 32.00, method: 'cash', status: 'pending', date: '2026-04-13T10:05:00Z' },
  { id: 'PAY-004', order: 'DLV-E1F4A', amount: 67.80, method: 'cash', status: 'pending', date: '2026-04-13T09:45:00Z' },
  { id: 'PAY-005', order: 'DLV-H2K5L', amount: 92.00, method: 'card', status: 'refunded', date: '2026-04-13T09:10:00Z' },
];

const statusColor: Record<string, string> = { completed: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', refunded: 'bg-red-100 text-red-700', failed: 'bg-gray-100 text-gray-500' };

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="kpi-card"><p className="text-2xl font-bold text-green-600">{formatCurrency(284930)}</p><p className="text-sm text-slate-500">Total Revenue</p></div>
        <div className="kpi-card"><p className="text-2xl font-bold text-blue-600">{formatCurrency(42740)}</p><p className="text-sm text-slate-500">Platform Commission</p></div>
        <div className="kpi-card"><p className="text-2xl font-bold text-orange-600">{formatCurrency(8200)}</p><p className="text-sm text-slate-500">Pending Payouts</p></div>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-slate-50 border-b border-slate-200">
            <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Payment ID</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Order</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Amount</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Method</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Date</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100">
            {mockPayments.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm font-mono text-slate-900">{p.id}</td>
                <td className="px-6 py-4 text-sm text-primary-600 font-medium">{p.order}</td>
                <td className="px-6 py-4 text-sm font-semibold">{formatCurrency(p.amount)}</td>
                <td className="px-6 py-4 text-sm capitalize text-slate-600">{p.method}</td>
                <td className="px-6 py-4"><span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', statusColor[p.status])}>{p.status}</span></td>
                <td className="px-6 py-4 text-xs text-slate-500">{formatDateTime(p.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
