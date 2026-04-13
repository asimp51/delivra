'use client';
import { useState } from 'react';
import { Clock, Check, ChefHat, Package, Bell, Phone, MapPin } from 'lucide-react';

interface OrderCardData {
  id: string;
  number: string;
  customer: string;
  items: { name: string; qty: number; options?: string }[];
  total: number;
  time: string;
  elapsed: string;
  payment: string;
  address: string;
}

const incomingOrders: OrderCardData[] = [
  { id: '1', number: 'DLV-K2M8', customer: 'Ahmed Khan', items: [{ name: 'Chicken Meal', qty: 2, options: 'Large, Spicy' }, { name: 'Garlic Bread', qty: 1 }], total: 45.50, time: '11:32 AM', elapsed: '2 min ago', payment: 'Card', address: 'Downtown, Building 5' },
  { id: '2', number: 'DLV-L9N3', customer: 'Sarah Ali', items: [{ name: 'Family Bucket', qty: 1, options: 'Original' }, { name: 'Coleslaw', qty: 2 }, { name: 'Pepsi 1L', qty: 2 }], total: 78.00, time: '11:30 AM', elapsed: '4 min ago', payment: 'Cash', address: 'Al Olaya, Tower 12' },
];

const preparingOrders: OrderCardData[] = [
  { id: '3', number: 'DLV-M4P7', customer: 'Omar Hassan', items: [{ name: 'Broasted Combo', qty: 3 }, { name: 'French Fries', qty: 3 }], total: 62.00, time: '11:20 AM', elapsed: '14 min', payment: 'Card', address: 'Riyadh Park Mall' },
  { id: '4', number: 'DLV-N1Q5', customer: 'Fatima Noor', items: [{ name: 'Nuggets Box', qty: 1 }, { name: 'Cheese Burger', qty: 2 }], total: 38.50, time: '11:15 AM', elapsed: '19 min', payment: 'Wallet', address: 'King Fahd Road, Unit 8' },
];

const readyOrders: OrderCardData[] = [
  { id: '5', number: 'DLV-O8R2', customer: 'Khalid Saeed', items: [{ name: 'Shrimp Meal', qty: 1, options: 'Extra Sauce' }], total: 29.00, time: '11:05 AM', elapsed: '29 min', payment: 'Card', address: 'Embassy Quarter' },
];

function OrderCard({ order, column }: { order: OrderCardData; column: 'incoming' | 'preparing' | 'ready' }) {
  return (
    <div className="order-card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-primary-600">{order.number}</span>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          {order.elapsed}
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">
            {order.customer.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{order.customer}</p>
            <p className="text-xs text-slate-400">{order.payment}</p>
          </div>
        </div>
        <button className="p-1.5 rounded-lg hover:bg-slate-100"><Phone className="w-4 h-4 text-slate-400" /></button>
      </div>

      <div className="space-y-1.5 mb-3 py-3 border-y border-slate-100">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-slate-700">
              <span className="font-semibold text-slate-900">{item.qty}x</span> {item.name}
              {item.options && <span className="text-xs text-slate-400 ml-1">({item.options})</span>}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
        <MapPin className="w-3.5 h-3.5" />
        {order.address}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-slate-900">${order.total.toFixed(2)}</span>
        {column === 'incoming' && (
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50">Reject</button>
            <button className="px-4 py-1.5 text-xs font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700">Accept</button>
          </div>
        )}
        {column === 'preparing' && (
          <button className="px-4 py-1.5 text-xs font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" /> Mark Ready
          </button>
        )}
        {column === 'ready' && (
          <span className="px-3 py-1.5 text-xs font-semibold text-primary-600 bg-primary-50 rounded-lg flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5" /> Awaiting Rider
          </span>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
          <p className="text-slate-500 mt-1">Manage incoming and active orders in real-time.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            <Bell className="w-4 h-4" /> {incomingOrders.length} New
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Incoming */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full pulse-dot" />
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Incoming</h2>
            <span className="ml-auto bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">{incomingOrders.length}</span>
          </div>
          <div className="space-y-3">
            {incomingOrders.map((o) => <OrderCard key={o.id} order={o} column="incoming" />)}
          </div>
        </div>

        {/* Preparing */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-orange-500 rounded-full" />
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Preparing</h2>
            <span className="ml-auto bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">{preparingOrders.length}</span>
          </div>
          <div className="space-y-3">
            {preparingOrders.map((o) => <OrderCard key={o.id} order={o} column="preparing" />)}
          </div>
        </div>

        {/* Ready */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-primary-500 rounded-full" />
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Ready for Pickup</h2>
            <span className="ml-auto bg-primary-100 text-primary-700 text-xs font-bold px-2 py-0.5 rounded-full">{readyOrders.length}</span>
          </div>
          <div className="space-y-3">
            {readyOrders.map((o) => <OrderCard key={o.id} order={o} column="ready" />)}
          </div>
        </div>
      </div>
    </div>
  );
}
