'use client';
import { useState } from 'react';
import { Plus, ChevronRight, ChevronDown, Edit, Trash2, GripVertical, ToggleLeft, ToggleRight, FolderTree } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

const mockCategories: Category[] = [
  {
    id: '1', parent_id: null, name: 'Food & Dining', slug: 'food-dining', icon_url: '', sort_order: 0, is_active: true, metadata: { requires_preparation_time: true },
    children: [
      { id: '1a', parent_id: '1', name: 'Restaurants', slug: 'restaurants', sort_order: 0, is_active: true, metadata: {} },
      { id: '1b', parent_id: '1', name: 'Fast Food', slug: 'fast-food', sort_order: 1, is_active: true, metadata: {} },
      { id: '1c', parent_id: '1', name: 'Cafe & Coffee', slug: 'cafe-coffee', sort_order: 2, is_active: true, metadata: {} },
      { id: '1d', parent_id: '1', name: 'Desserts & Bakery', slug: 'desserts-bakery', sort_order: 3, is_active: true, metadata: {} },
      { id: '1e', parent_id: '1', name: 'Healthy & Diet', slug: 'healthy-diet', sort_order: 4, is_active: true, metadata: {} },
      { id: '1f', parent_id: '1', name: 'Asian Cuisine', slug: 'asian-cuisine', sort_order: 5, is_active: true, metadata: {} },
      { id: '1g', parent_id: '1', name: 'Pizza', slug: 'pizza', sort_order: 6, is_active: true, metadata: {} },
      { id: '1h', parent_id: '1', name: 'Burgers', slug: 'burgers', sort_order: 7, is_active: true, metadata: {} },
    ],
  },
  {
    id: '2', parent_id: null, name: 'Grocery', slug: 'grocery', icon_url: '', sort_order: 1, is_active: true, metadata: {},
    children: [
      { id: '2a', parent_id: '2', name: 'Supermarket', slug: 'supermarket', sort_order: 0, is_active: true, metadata: {} },
      { id: '2b', parent_id: '2', name: 'Fruits & Vegetables', slug: 'fruits-vegetables', sort_order: 1, is_active: true, metadata: {} },
      { id: '2c', parent_id: '2', name: 'Meat & Seafood', slug: 'meat-seafood', sort_order: 2, is_active: true, metadata: {} },
      { id: '2d', parent_id: '2', name: 'Dairy & Eggs', slug: 'dairy-eggs', sort_order: 3, is_active: true, metadata: {} },
      { id: '2e', parent_id: '2', name: 'Frozen Foods', slug: 'frozen-foods', sort_order: 4, is_active: true, metadata: {} },
    ],
  },
  {
    id: '3', parent_id: null, name: 'Pharmacy & Health', slug: 'pharmacy-health', icon_url: '', sort_order: 2, is_active: true, metadata: { requires_prescription_upload: true },
    children: [
      { id: '3a', parent_id: '3', name: 'Medicines', slug: 'medicines', sort_order: 0, is_active: true, metadata: {} },
      { id: '3b', parent_id: '3', name: 'Personal Care', slug: 'personal-care', sort_order: 1, is_active: true, metadata: {} },
      { id: '3c', parent_id: '3', name: 'Supplements', slug: 'supplements', sort_order: 2, is_active: true, metadata: {} },
    ],
  },
  {
    id: '4', parent_id: null, name: 'Flowers & Gifts', slug: 'flowers-gifts', icon_url: '', sort_order: 3, is_active: true, metadata: {},
    children: [
      { id: '4a', parent_id: '4', name: 'Bouquets', slug: 'bouquets', sort_order: 0, is_active: true, metadata: {} },
      { id: '4b', parent_id: '4', name: 'Gift Baskets', slug: 'gift-baskets', sort_order: 1, is_active: true, metadata: {} },
      { id: '4c', parent_id: '4', name: 'Chocolates', slug: 'chocolates', sort_order: 2, is_active: true, metadata: {} },
    ],
  },
  {
    id: '5', parent_id: null, name: 'Pet Supplies', slug: 'pet-supplies', icon_url: '', sort_order: 4, is_active: true, metadata: {},
    children: [
      { id: '5a', parent_id: '5', name: 'Dog Food', slug: 'dog-food', sort_order: 0, is_active: true, metadata: {} },
      { id: '5b', parent_id: '5', name: 'Cat Food', slug: 'cat-food', sort_order: 1, is_active: true, metadata: {} },
    ],
  },
  {
    id: '6', parent_id: null, name: 'Packages & Courier', slug: 'packages-courier', icon_url: '', sort_order: 5, is_active: true, metadata: {},
    children: [
      { id: '6a', parent_id: '6', name: 'Send Package', slug: 'send-package', sort_order: 0, is_active: true, metadata: {} },
      { id: '6b', parent_id: '6', name: 'Document Delivery', slug: 'document-delivery', sort_order: 1, is_active: true, metadata: {} },
    ],
  },
  { id: '7', parent_id: null, name: 'Convenience Store', slug: 'convenience-store', icon_url: '', sort_order: 6, is_active: true, metadata: {}, children: [] },
  { id: '8', parent_id: null, name: 'Shopping', slug: 'shopping', icon_url: '', sort_order: 7, is_active: true, metadata: {}, children: [] },
  { id: '9', parent_id: null, name: 'Home Services', slug: 'home-services', icon_url: '', sort_order: 8, is_active: true, metadata: {}, children: [] },
  { id: '10', parent_id: null, name: 'Water & Gas', slug: 'water-gas', icon_url: '', sort_order: 9, is_active: true, metadata: {}, children: [] },
];

function CategoryNode({ category, depth = 0 }: { category: Category; depth?: number }) {
  const [expanded, setExpanded] = useState(depth === 0);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-2 px-4 py-3 hover:bg-slate-50 border-b border-slate-100 transition-colors group',
          depth > 0 && 'bg-slate-25',
        )}
        style={{ paddingLeft: `${16 + depth * 32}px` }}
      >
        <GripVertical className="w-4 h-4 text-slate-300 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />

        <button
          onClick={() => setExpanded(!expanded)}
          className={cn('w-5 h-5 flex items-center justify-center', !hasChildren && 'invisible')}
        >
          {expanded
            ? <ChevronDown className="w-4 h-4 text-slate-500" />
            : <ChevronRight className="w-4 h-4 text-slate-500" />
          }
        </button>

        <div className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center text-sm',
          depth === 0 ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-600',
        )}>
          {category.name.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <p className={cn('text-sm font-medium text-slate-900 truncate', depth > 0 && 'font-normal')}>
            {category.name}
          </p>
          <p className="text-xs text-slate-400">{category.slug}</p>
        </div>

        {hasChildren && (
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {category.children!.length} sub
          </span>
        )}

        <span className={cn(
          'px-2 py-0.5 rounded-full text-xs font-medium',
          category.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500',
        )}>
          {category.is_active ? 'Active' : 'Inactive'}
        </span>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 rounded-md hover:bg-primary-50 text-slate-400 hover:text-primary-600" title="Add sub-category">
            <Plus className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-md hover:bg-blue-50 text-slate-400 hover:text-blue-600" title="Edit">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400" title="Toggle active">
            {category.is_active
              ? <ToggleRight className="w-4 h-4 text-green-600" />
              : <ToggleLeft className="w-4 h-4" />
            }
          </button>
          <button className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-600" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {expanded && hasChildren && (
        <div>
          {category.children!.map((child) => (
            <CategoryNode key={child.id} category={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categories Management</h1>
          <p className="text-slate-500 mt-1">Manage categories and sub-categories. Changes reflect instantly in the customer app.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="flex items-center gap-4 text-sm text-slate-500">
        <div className="flex items-center gap-1.5">
          <FolderTree className="w-4 h-4" />
          <span>{mockCategories.length} top-level categories</span>
        </div>
        <span className="text-slate-300">|</span>
        <span>{mockCategories.reduce((s, c) => s + (c.children?.length || 0), 0)} sub-categories</span>
        <span className="text-slate-300">|</span>
        <span>Drag to reorder | Hover for actions</span>
      </div>

      <div className="card overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 grid grid-cols-[1fr_auto_auto] items-center text-xs font-medium text-slate-500 uppercase tracking-wider">
          <span className="pl-12">Category</span>
          <span className="pr-20">Status</span>
          <span>Actions</span>
        </div>
        {mockCategories.map((cat) => (
          <CategoryNode key={cat.id} category={cat} />
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">Add Category</h2>
              <p className="text-sm text-slate-500 mt-1">Create a new top-level category or sub-category.</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Parent Category (optional)</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="">None (top-level category)</option>
                  {mockCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Name (English)</label>
                  <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" placeholder="e.g., Fast Food" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Name (Arabic)</label>
                  <input type="text" dir="rtl" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" placeholder="e.g., وجبات سريعة" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Slug</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50" placeholder="auto-generated-from-name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                <textarea className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" rows={2} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Icon / Image Upload</label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-primary-400 transition-colors cursor-pointer">
                  <p className="text-sm text-slate-500">Click or drag to upload</p>
                  <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG (max 2MB)</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Metadata (JSON)</label>
                <textarea className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono" rows={3} placeholder='{"requires_preparation_time": true}' />
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">Create Category</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
