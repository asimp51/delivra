'use client';
import { Plus, MapPin, Edit, Trash2 } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

const mockZones = [
  { id: '1', name: 'Downtown', deliveryFee: 2.00, active: true, vendors: 45, riders: 12 },
  { id: '2', name: 'Uptown', deliveryFee: 3.50, active: true, vendors: 28, riders: 8 },
  { id: '3', name: 'Industrial Area', deliveryFee: 5.00, active: true, vendors: 12, riders: 4 },
  { id: '4', name: 'Suburbs - North', deliveryFee: 4.00, active: true, vendors: 18, riders: 6 },
  { id: '5', name: 'Suburbs - South', deliveryFee: 4.50, active: false, vendors: 8, riders: 2 },
  { id: '6', name: 'Airport Zone', deliveryFee: 6.00, active: true, vendors: 5, riders: 3 },
];

export default function ZonesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Delivery Zones</h1>
          <p className="text-slate-500 mt-1">Manage delivery areas and fees.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium text-sm">
          <Plus className="w-4 h-4" /> Add Zone
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockZones.map((zone) => (
          <div key={zone.id} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-500" />
                <h3 className="font-semibold text-slate-900">{zone.name}</h3>
              </div>
              <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', zone.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
                {zone.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 py-3 border-t border-slate-100">
              <div className="text-center">
                <p className="text-lg font-bold text-primary-600">{formatCurrency(zone.deliveryFee)}</p>
                <p className="text-xs text-slate-500">Delivery Fee</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">{zone.vendors}</p>
                <p className="text-xs text-slate-500">Vendors</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">{zone.riders}</p>
                <p className="text-xs text-slate-500">Riders</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
              <button className="flex-1 py-1.5 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-1"><Edit className="w-3.5 h-3.5" /> Edit</button>
              <button className="py-1.5 px-3 text-sm text-red-600 border border-slate-200 rounded-lg hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
