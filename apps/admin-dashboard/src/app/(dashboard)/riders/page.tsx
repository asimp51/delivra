'use client';
import { Bike, Star, Search, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockRiders = [
  { id: '1', name: 'Ali Mohammed', vehicle: 'motorcycle', status: 'online', onDelivery: false, rating: 4.9, deliveries: 1240, earnings: 8450 },
  { id: '2', name: 'Rashid Khan', vehicle: 'motorcycle', status: 'online', onDelivery: true, rating: 4.7, deliveries: 980, earnings: 6200 },
  { id: '3', name: 'Hassan Youssef', vehicle: 'bicycle', status: 'online', onDelivery: true, rating: 4.5, deliveries: 450, earnings: 2100 },
  { id: '4', name: 'Omar Farooq', vehicle: 'car', status: 'offline', onDelivery: false, rating: 4.6, deliveries: 670, earnings: 4300 },
  { id: '5', name: 'Tariq Abbas', vehicle: 'motorcycle', status: 'online', onDelivery: false, rating: 4.8, deliveries: 890, earnings: 5800 },
  { id: '6', name: 'Bilal Ahmed', vehicle: 'motorcycle', status: 'offline', onDelivery: false, rating: 4.2, deliveries: 320, earnings: 1900 },
  { id: '7', name: 'Samir Nabil', vehicle: 'bicycle', status: 'online', onDelivery: false, rating: 4.4, deliveries: 560, earnings: 2800 },
];

export default function RidersPage() {
  const online = mockRiders.filter(r => r.status === 'online').length;
  const onDelivery = mockRiders.filter(r => r.onDelivery).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Riders</h1>
          <p className="text-slate-500 mt-1">Monitor delivery riders and their status.</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> {online} Online
          </span>
          <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full font-medium">{onDelivery} On Delivery</span>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Search riders..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockRiders.map((rider) => (
          <div key={rider.id} className="card p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                  <Bike className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{rider.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{rider.vehicle}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={cn(
                  'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                  rider.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                )}>
                  <span className={cn('w-1.5 h-1.5 rounded-full', rider.status === 'online' ? 'bg-green-500' : 'bg-gray-400')} />
                  {rider.status}
                </span>
                {rider.onDelivery && <span className="text-xs text-blue-600 font-medium">On delivery</span>}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-bold">{rider.rating}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Rating</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold">{rider.deliveries}</p>
                <p className="text-xs text-slate-400 mt-0.5">Deliveries</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold">${rider.earnings}</p>
                <p className="text-xs text-slate-400 mt-0.5">Earnings</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
