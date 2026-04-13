'use client';
import { ShoppingBag, DollarSign, Store, Bike, Users, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const kpis = [
  { label: 'Total Orders', value: '12,847', change: '+12.5%', icon: ShoppingBag, color: 'bg-blue-500' },
  { label: 'Revenue', value: '$284,930', change: '+18.2%', icon: DollarSign, color: 'bg-green-500' },
  { label: 'Active Vendors', value: '342', change: '+5.3%', icon: Store, color: 'bg-purple-500' },
  { label: 'Active Riders', value: '89', change: '+8.1%', icon: Bike, color: 'bg-orange-500' },
  { label: 'Customers', value: '28,491', change: '+22.4%', icon: Users, color: 'bg-pink-500' },
  { label: 'Avg Order Value', value: '$22.18', change: '+3.7%', icon: TrendingUp, color: 'bg-teal-500' },
];

const recentOrders = [
  { id: 'DLV-A8F2C', customer: 'Ahmed Khan', vendor: 'Al Baik', total: 45.50, status: 'delivered', time: '12 min ago' },
  { id: 'DLV-B3D1E', customer: 'Sarah Ali', vendor: 'Carrefour', total: 128.00, status: 'in_transit', time: '18 min ago' },
  { id: 'DLV-C7A9F', customer: 'Omar Hassan', vendor: 'Nahdi Pharmacy', total: 32.00, status: 'preparing', time: '25 min ago' },
  { id: 'DLV-D2E8B', customer: 'Fatima Noor', vendor: 'Flowers Plus', total: 85.00, status: 'confirmed', time: '30 min ago' },
  { id: 'DLV-E1F4A', customer: 'Khalid Saeed', vendor: 'Pizza Hut', total: 67.80, status: 'pending', time: '35 min ago' },
  { id: 'DLV-F9C3D', customer: 'Layla Ahmed', vendor: 'Pet World', total: 54.25, status: 'rider_assigned', time: '42 min ago' },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-orange-100 text-orange-800',
  in_transit: 'bg-teal-100 text-teal-800',
  delivered: 'bg-green-100 text-green-800',
  rider_assigned: 'bg-purple-100 text-purple-800',
};

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Welcome back! Here is what is happening with Delivra today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="kpi-card">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 ${kpi.color} rounded-lg flex items-center justify-center`}>
                <kpi.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                {kpi.change}
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
              <p className="text-sm text-slate-500">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {recentOrders.map((order) => (
              <div key={order.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{order.id}</p>
                    <p className="text-xs text-slate-500">{order.customer}</p>
                  </div>
                </div>
                <div className="text-sm text-slate-600">{order.vendor}</div>
                <div className="text-sm font-semibold text-slate-900">{formatCurrency(order.total)}</div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                  {order.status.replace('_', ' ')}
                </span>
                <span className="text-xs text-slate-400">{order.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900">Orders by Category</h2>
          </div>
          <div className="p-6 space-y-4">
            {[
              { name: 'Food & Dining', count: 5842, pct: 45, color: 'bg-orange-500' },
              { name: 'Grocery', count: 3214, pct: 25, color: 'bg-green-500' },
              { name: 'Pharmacy', count: 1542, pct: 12, color: 'bg-blue-500' },
              { name: 'Shopping', count: 1028, pct: 8, color: 'bg-purple-500' },
              { name: 'Flowers & Gifts', count: 642, pct: 5, color: 'bg-pink-500' },
              { name: 'Others', count: 579, pct: 5, color: 'bg-gray-400' },
            ].map((cat) => (
              <div key={cat.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700 font-medium">{cat.name}</span>
                  <span className="text-slate-500">{cat.count.toLocaleString()} ({cat.pct}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
