'use client';
import { useState } from 'react';
import { Plus, Edit, Trash2, ToggleRight, ToggleLeft, Image, GripVertical } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  category: string;
  available: boolean;
  image: string;
}

const mockMenu: MenuItem[] = [
  { id: '1', name: 'Chicken Meal', description: 'Crispy fried chicken with fries and coleslaw', price: 18.00, category: 'Meals', available: true, image: 'CM' },
  { id: '2', name: 'Broasted Combo', description: 'Broasted chicken, rice, hummus and bread', price: 22.50, category: 'Meals', available: true, image: 'BC' },
  { id: '3', name: 'Family Bucket', description: '12pc chicken, 4 fries, 4 coleslaw, 2L Pepsi', price: 65.00, category: 'Family', available: true, image: 'FB' },
  { id: '4', name: 'Nuggets Box', description: '20pc crispy chicken nuggets', price: 15.00, category: 'Snacks', available: true, image: 'NB' },
  { id: '5', name: 'Cheese Burger', description: 'Grilled beef patty with cheese and special sauce', price: 12.00, discountedPrice: 9.99, category: 'Burgers', available: true, image: 'CB' },
  { id: '6', name: 'Shrimp Meal', description: 'Grilled shrimp with rice and garlic sauce', price: 28.00, category: 'Seafood', available: false, image: 'SM' },
  { id: '7', name: 'French Fries', description: 'Crispy golden fries - regular size', price: 5.00, category: 'Sides', available: true, image: 'FF' },
  { id: '8', name: 'Garlic Bread', description: 'Freshly baked garlic bread - 4 pieces', price: 6.50, category: 'Sides', available: true, image: 'GB' },
  { id: '9', name: 'Coleslaw', description: 'Fresh creamy coleslaw', price: 4.00, category: 'Sides', available: true, image: 'CS' },
  { id: '10', name: 'Pepsi 1L', description: 'Chilled Pepsi 1 liter bottle', price: 3.00, category: 'Beverages', available: true, image: 'P1' },
];

const categories = ['All', 'Meals', 'Family', 'Burgers', 'Snacks', 'Seafood', 'Sides', 'Beverages'];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const filtered = activeCategory === 'All' ? mockMenu : mockMenu.filter(i => i.category === activeCategory);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Menu Management</h1>
          <p className="text-slate-500 mt-1">{mockMenu.length} items across {categories.length - 1} categories</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium text-sm">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-primary-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(item => (
          <div key={item.id} className="card p-4 flex items-center gap-4 group hover:shadow-md transition-shadow">
            <GripVertical className="w-5 h-5 text-slate-300 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />

            <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-lg font-bold text-slate-400 shrink-0">
              {item.image}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900">{item.name}</h3>
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{item.category}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 truncate">{item.description}</p>
            </div>

            <div className="text-right shrink-0">
              {item.discountedPrice ? (
                <div>
                  <span className="text-sm text-slate-400 line-through">${item.price.toFixed(2)}</span>
                  <span className="text-sm font-bold text-primary-600 ml-1">${item.discountedPrice.toFixed(2)}</span>
                </div>
              ) : (
                <span className="text-sm font-bold text-slate-900">${item.price.toFixed(2)}</span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button className="p-1.5 text-slate-400 hover:text-slate-600">
                {item.available ? <ToggleRight className="w-6 h-6 text-primary-600" /> : <ToggleLeft className="w-6 h-6 text-slate-300" />}
              </button>
              <button className="p-1.5 rounded-md hover:bg-blue-50 text-slate-400 hover:text-blue-600"><Edit className="w-4 h-4" /></button>
              <button className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold">Add Menu Item</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Name</label><input className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Item name" /></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                    {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Description</label><textarea className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" rows={2} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label><input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="0.00" /></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Discounted Price ($)</label><input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Optional" /></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Image</label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center cursor-pointer hover:border-primary-400">
                  <Image className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Click to upload</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Option Groups (Size, Toppings, etc.)</label>
                <button className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-sm text-slate-500 hover:border-primary-400 hover:text-primary-600">
                  + Add Option Group
                </button>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">Add Item</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
