'use client';
import { DollarSign, ShoppingBag, Clock, TrendingUp, Star } from 'lucide-react';

const topItems = [
  { name: 'Chicken Meal', sold: 342, revenue: 6156 },
  { name: 'Family Bucket', sold: 185, revenue: 12025 },
  { name: 'Broasted Combo', sold: 278, revenue: 6255 },
  { name: 'Cheese Burger', sold: 410, revenue: 4099 },
  { name: 'Nuggets Box', sold: 195, revenue: 2925 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500 mt-1">Track your store performance and revenue.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Revenue", value: '$1,284', icon: DollarSign, color: 'bg-green-500', change: '+12%' },
          { label: "Today's Orders", value: '47', icon: ShoppingBag, color: 'bg-blue-500', change: '+8%' },
          { label: 'Avg Prep Time', value: '18 min', icon: Clock, color: 'bg-orange-500', change: '-3 min' },
          { label: 'Rating', value: '4.8', icon: Star, color: 'bg-yellow-500', change: '+0.1' },
        ].map(kpi => (
          <div key={kpi.label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${kpi.color} rounded-lg flex items-center justify-center`}>
                <kpi.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{kpi.change}</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
            <p className="text-sm text-slate-500">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Revenue</h3>
          <div className="flex items-end gap-3 h-48">
            {[820, 1100, 950, 1284, 1150, 1400, 980].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-primary-100 rounded-t-lg relative" style={{ height: `${(val / 1400) * 100}%` }}>
                  <div className="absolute inset-0 bg-primary-500 rounded-t-lg opacity-80" />
                </div>
                <span className="text-xs text-slate-500">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Top Selling Items</h3>
          <div className="space-y-4">
            {topItems.map((item, i) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-sm font-bold text-primary-600">${item.revenue.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(item.sold / 410) * 100}%` }} />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{item.sold} sold</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
