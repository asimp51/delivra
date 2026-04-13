'use client';
import { Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900">Platform Settings</h1>

      <div className="card p-6 space-y-6">
        <h2 className="text-lg font-semibold border-b border-slate-100 pb-3">Commission & Fees</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Default Commission Rate (%)</label>
            <input type="number" defaultValue={15} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Default Delivery Fee ($)</label>
            <input type="number" defaultValue={3} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Tax Rate (%)</label>
            <input type="number" defaultValue={5} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Minimum Order Amount ($)</label>
            <input type="number" defaultValue={5} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
          </div>
        </div>
      </div>

      <div className="card p-6 space-y-6">
        <h2 className="text-lg font-semibold border-b border-slate-100 pb-3">Order Settings</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Auto-cancel timeout (minutes)</label>
            <input type="number" defaultValue={5} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
            <p className="text-xs text-slate-400 mt-1">Auto-cancel if vendor does not respond</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Max delivery radius (km)</label>
            <input type="number" defaultValue={15} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
          </div>
        </div>
      </div>

      <div className="card p-6 space-y-6">
        <h2 className="text-lg font-semibold border-b border-slate-100 pb-3">Rider Assignment Strategy</h2>
        <div className="space-y-3">
          {[
            { value: 'hybrid', label: 'Hybrid (Recommended)', desc: 'Finds nearby riders first, then picks the one with fewest deliveries today. Best balance of speed and fairness.' },
            { value: 'round_robin', label: 'Round Robin (Fair)', desc: 'Always assigns to the rider with fewest deliveries today. Perfectly fair earnings, but may be slower.' },
            { value: 'nearest', label: 'Nearest (Fast)', desc: 'Always assigns to the closest rider. Fastest delivery, but riders near busy areas earn more.' },
          ].map((strategy) => (
            <label key={strategy.value} className="flex items-start gap-3 p-4 border border-slate-200 rounded-lg cursor-pointer hover:border-primary-400 transition-colors">
              <input type="radio" name="assignment_strategy" defaultChecked={strategy.value === 'hybrid'} className="mt-1 text-primary-600 focus:ring-primary-500" />
              <div>
                <p className="text-sm font-semibold text-slate-900">{strategy.label}</p>
                <p className="text-xs text-slate-500 mt-1">{strategy.desc}</p>
              </div>
            </label>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Max concurrent orders per rider</label>
            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
              <option value="1">1 (Single order only)</option>
              <option value="2">2 (Order stacking)</option>
            </select>
            <p className="text-xs text-slate-400 mt-1">Whether a rider can carry 2 orders at once</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Offer timeout (seconds)</label>
            <input type="number" defaultValue={60} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
            <p className="text-xs text-slate-400 mt-1">Auto-decline if rider does not respond</p>
          </div>
        </div>
      </div>

      <div className="card p-6 space-y-6">
        <h2 className="text-lg font-semibold border-b border-slate-100 pb-3">Notifications</h2>
        <div className="space-y-3">
          {['New order alerts', 'Vendor registration alerts', 'Low rider availability alerts', 'Daily revenue summary email'].map((label) => (
            <label key={label} className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-700">{label}</span>
              <div className="relative w-11 h-6 bg-primary-600 rounded-full cursor-pointer">
                <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform" />
              </div>
            </label>
          ))}
        </div>
      </div>

      <button className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium text-sm">
        <Save className="w-4 h-4" /> Save Settings
      </button>
    </div>
  );
}
