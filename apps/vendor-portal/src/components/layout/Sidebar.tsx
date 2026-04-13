'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, UtensilsCrossed, BarChart3, Star, Settings, LogOut, Package, ToggleLeft, ToggleRight } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/menu', label: 'Menu', icon: UtensilsCrossed },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/reviews', label: 'Reviews', icon: Star },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-white border-r border-slate-200 flex flex-col z-30">
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Delivra</h1>
            <p className="text-xs text-slate-500">Vendor Portal</p>
          </div>
        </div>
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-sm font-semibold text-slate-900">Al Baik Restaurant</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-slate-500">Store Status</span>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-1.5">
              {isOpen ? (
                <><ToggleRight className="w-6 h-6 text-primary-600" /><span className="text-xs font-semibold text-primary-600">Open</span></>
              ) : (
                <><ToggleLeft className="w-6 h-6 text-slate-400" /><span className="text-xs font-semibold text-slate-400">Closed</span></>
              )}
            </button>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <item.icon className="w-5 h-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-100">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors">
          <LogOut className="w-5 h-5" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
