'use client';
import { Save, Upload } from 'lucide-react';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900">Store Settings</h1>

      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-semibold border-b border-slate-100 pb-3">Store Profile</h2>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-primary-700">AB</div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">
            <Upload className="w-4 h-4" /> Upload Logo
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Store Name</label><input className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" defaultValue="Al Baik Restaurant" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Category</label><input className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50" defaultValue="Food & Dining" readOnly /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Phone</label><input className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" defaultValue="+966501234567" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Email</label><input className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" defaultValue="contact@albaik.com" /></div>
        </div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Description</label><textarea className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" rows={3} defaultValue="Premium fried chicken restaurant serving fresh, crispy chicken since 1974." /></div>
      </div>

      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-semibold border-b border-slate-100 pb-3">Operating Hours</h2>
        <div className="space-y-3">
          {days.map((day, i) => (
            <div key={day} className="flex items-center gap-4">
              <span className="w-28 text-sm font-medium text-slate-700">{day}</span>
              <input type="time" className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm" defaultValue={i === 5 ? '13:00' : '09:00'} />
              <span className="text-slate-400">to</span>
              <input type="time" className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm" defaultValue="23:00" />
              <label className="flex items-center gap-2 ml-4">
                <input type="checkbox" className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" defaultChecked={i !== 5} />
                <span className="text-sm text-slate-600">Open</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-semibold border-b border-slate-100 pb-3">Delivery Settings</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Delivery Fee ($)</label><input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" defaultValue={3} /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Minimum Order ($)</label><input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" defaultValue={10} /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Avg Preparation Time (min)</label><input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" defaultValue={20} /></div>
        </div>
      </div>

      <button className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium text-sm">
        <Save className="w-4 h-4" /> Save Settings
      </button>
    </div>
  );
}
