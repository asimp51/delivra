'use client';
import { TrendingUp, DollarSign, ShoppingBag, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500 mt-1">Deep insights into platform performance.</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '$284,930', change: '+18.2%', icon: DollarSign, color: 'bg-green-500' },
          { label: 'Total Orders', value: '12,847', change: '+12.5%', icon: ShoppingBag, color: 'bg-blue-500' },
          { label: 'Avg Order Value', value: '$22.18', change: '+3.7%', icon: TrendingUp, color: 'bg-purple-500' },
          { label: 'Avg Delivery Time', value: '28 min', change: '-5.2%', icon: Clock, color: 'bg-orange-500' },
        ].map((kpi) => (
          <div key={kpi.label} className="kpi-card">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 ${kpi.color} rounded-lg flex items-center justify-center`}>
                <kpi.icon className="w-5 h-5 text-white" />
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${kpi.change.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {kpi.change}
              </span>
            </div>
            <p className="text-2xl font-bold">{kpi.value}</p>
            <p className="text-sm text-slate-500">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue by Category</h3>
          <div className="space-y-3">
            {[
              { name: 'Food & Dining', revenue: 128218, pct: 45 },
              { name: 'Grocery', revenue: 71233, pct: 25 },
              { name: 'Pharmacy', revenue: 34192, pct: 12 },
              { name: 'Shopping', revenue: 22794, pct: 8 },
              { name: 'Flowers & Gifts', revenue: 14247, pct: 5 },
              { name: 'Others', revenue: 14246, pct: 5 },
            ].map((c) => (
              <div key={c.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-slate-500">{formatCurrency(c.revenue)} ({c.pct}%)</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 rounded-full" style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Peak Hours</h3>
          <div className="grid grid-cols-7 gap-1">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="text-center">
                <p className="text-xs text-slate-500 mb-2">{day}</p>
                {[9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].map((hour) => {
                  const intensity = Math.random();
                  return (
                    <div
                      key={hour}
                      className="w-full aspect-square rounded-sm mb-0.5"
                      style={{ backgroundColor: `rgba(5, 150, 105, ${0.1 + intensity * 0.8})` }}
                      title={`${day} ${hour}:00 - ${Math.round(intensity * 50)} orders`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
            <span>9 AM</span>
            <span>10 PM</span>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Top Performing Vendors</h3>
        <div className="grid grid-cols-5 gap-4">
          {[
            { name: 'Al Baik', orders: 2340, revenue: 45600, rating: 4.8 },
            { name: 'Pizza Hut', orders: 3150, revenue: 52800, rating: 4.1 },
            { name: 'Carrefour', orders: 1820, revenue: 98400, rating: 4.5 },
            { name: 'Nahdi', orders: 980, revenue: 24500, rating: 4.6 },
            { name: 'Pet World', orders: 420, revenue: 12600, rating: 4.3 },
          ].map((v) => (
            <div key={v.name} className="text-center p-4 bg-slate-50 rounded-xl">
              <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mx-auto mb-2 font-bold">{v.name[0]}</div>
              <p className="text-sm font-semibold">{v.name}</p>
              <p className="text-lg font-bold text-primary-600 mt-1">{formatCurrency(v.revenue)}</p>
              <p className="text-xs text-slate-500">{v.orders} orders</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
