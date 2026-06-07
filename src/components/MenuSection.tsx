import React, { useState } from 'react';
import { Search, Star, Clock, ShoppingCart, Plus, Minus, Edit3, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { FoodItem, User } from '../types';

interface MenuSectionProps {
  foodItems: FoodItem[];
  currentUser: User | null;
  onAddToCart: (food: FoodItem) => void;
  onUpdateMenu: (updated: FoodItem[]) => void;
}

const CATEGORIES = [
  'All',
  'Indian Foods',
  'Indian Street Foods',
  'Italian Foods',
  'Spanish Foods',
  'Arabian Foods',
  'Japanese Foods',
  'Chinese Foods',
  'Desserts',
  'Ice Creams',
  'Juices'
];

export default function MenuSection({
  foodItems,
  currentUser,
  onAddToCart,
  onUpdateMenu
}: MenuSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Admin Editing State
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Indian Foods',
    description: '',
    price: 0,
    image: '',
    availabilityStatus: 'Available' as 'Available' | 'Unavailable',
    preparationTime: '15 mins'
  });

  const [notification, setNotification] = useState<string | null>(null);

  const canManageMenu = currentUser && (currentUser.role === 'OWNER' || currentUser.role === 'ADMIN');

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Filter items
  const filteredItems = foodItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleEditClick = (item: FoodItem) => {
    setEditingItem(item);
    setIsAddingNew(false);
    setFormData({
      name: item.name,
      category: item.category,
      description: item.description,
      price: item.price,
      image: item.image,
      availabilityStatus: item.availabilityStatus,
      preparationTime: item.preparationTime
    });
  };

  const handleCreateNewClick = () => {
    setIsAddingNew(true);
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Indian Foods',
      description: '',
      price: 150,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400',
      availabilityStatus: 'Available',
      preparationTime: '15 mins'
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.price <= 0) return;

    if (isAddingNew) {
      const newItem: FoodItem = {
        id: 'food-' + Math.random().toString(36).substring(2, 9),
        name: formData.name,
        category: formData.category,
        description: formData.description,
        price: Number(formData.price),
        image: formData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400',
        rating: 4.5,
        availabilityStatus: formData.availabilityStatus,
        preparationTime: formData.preparationTime
      };
      onUpdateMenu([newItem, ...foodItems]);
      setIsAddingNew(false);
      showNotification(`"${newItem.name}" added successfully to the catalog!`);
    } else if (editingItem) {
      const updatedMenu = foodItems.map(f => {
        if (f.id === editingItem.id) {
          return {
            ...f,
            name: formData.name,
            category: formData.category,
            description: formData.description,
            price: Number(formData.price),
            image: formData.image,
            availabilityStatus: formData.availabilityStatus,
            preparationTime: formData.preparationTime
          };
        }
        return f;
      });
      onUpdateMenu(updatedMenu);
      setEditingItem(null);
      showNotification(`"${formData.name}" edited successfully!`);
    }
  };

  const handleDeleteItem = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from the menu?`)) {
      const updatedMenu = foodItems.filter(f => f.id !== id);
      onUpdateMenu(updatedMenu);
      showNotification(`Removed "${name}" from menu.`);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Atria Live Catalog</span>
          <h2 className="text-3xl font-sans font-bold text-gray-900 dark:text-white mt-1 tracking-tight">Food Menu</h2>
          <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">Savor delicious traditional spices curated from premium culinary grids.</p>
        </div>

        {/* Add food action for Owners and Admins */}
        {canManageMenu && (
          <button
            onClick={handleCreateNewClick}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:-translate-y-0.5 transition cursor-pointer shrink-0"
          >
            + Create Food Item
          </button>
        )}
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-850 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 text-xs font-semibold rounded-xl">
          ✓ {notification}
        </div>
      )}

      {/* ADMIN EDIT / ADD DRAWER PRESETS */}
      {(editingItem || isAddingNew) && (
        <div className="p-6 bg-gray-50 dark:bg-neutral-800 rounded-2xl border border-gray-200 dark:border-neutral-700 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-sans font-bold text-gray-900 dark:text-white">
              {isAddingNew ? 'Create New Culinary Item' : `Edit: ${editingItem?.name}`}
            </h3>
            <button
              onClick={() => {
                setEditingItem(null);
                setIsAddingNew(false);
              }}
              className="text-gray-400 hover:text-gray-600 text-xs font-mono cursor-pointer"
            >
              Cancel Edit
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Food Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 dark:border-neutral-700 p-2.5 bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Catalog Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 dark:border-neutral-700 p-2.5 bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300"
              >
                {CATEGORIES.filter(c => c !== 'All').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Price (₹ INR) *</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full text-xs rounded-xl border border-gray-200 dark:border-neutral-700 p-2.5 bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 dark:border-neutral-700 p-2.5 bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Preparation Speed</label>
              <input
                type="text"
                value={formData.preparationTime}
                onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                placeholder="Ex Check: 15 mins"
                className="w-full text-xs rounded-xl border border-gray-200 dark:border-neutral-700 p-2.5 bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Image URL Path</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full text-xs rounded-xl border border-gray-200 dark:border-neutral-700 p-2.5 bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Availability Status</label>
              <select
                value={formData.availabilityStatus}
                onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value as 'Available' | 'Unavailable' })}
                className="w-full text-xs rounded-xl border border-gray-200 dark:border-neutral-700 p-2.5 bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300"
              >
                <option value="Available">Available for Cooking</option>
                <option value="Unavailable">Mark Temporary Out-Of-Stock</option>
              </select>
            </div>

            <div className="md:col-span-3 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setIsAddingNew(false);
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-neutral-750 text-gray-600 dark:text-neutral-300 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                {isAddingNew ? 'Create Item' : 'Save Modifications'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SEARCH AND SLIDING FILTERS CONTROLLER */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 font-bold" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search our delicious catalog for paneer, chicken, sushi, tacos, burgers..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-gray-800 dark:text-neutral-100 shadow-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
          />
        </div>

        {/* Category sliding badges */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs font-medium cursor-pointer shrink-0 transition ${
                selectedCategory === category
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10'
                  : 'bg-white dark:bg-neutral-900 border border-gray-200/50 dark:border-neutral-805 text-gray-600 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-850'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* FOOD CARDS VIEW */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center text-gray-400">
          No food items found matching your filter options. Try adjusting filters or searches!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map(food => {
            const isAvail = food.availabilityStatus === 'Available';

            return (
              <div 
                key={food.id} 
                className={`group bg-white dark:bg-neutral-900 rounded-2xl shadow-xs border border-gray-100 dark:border-neutral-805/90 overflow-hidden hover:shadow-md transition relative flex flex-col justify-between ${
                  !isAvail ? 'opacity-70' : ''
                }`}
              >
                {/* Product Image */}
                <div className="relative h-44 overflow-hidden bg-gray-50 dark:bg-neutral-800 shrink-0">
                  <img
                    referrerPolicy="no-referrer"
                    src={food.image} 
                    alt={food.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                  />
                  <span className="absolute top-3 right-3 bg-white/90 dark:bg-neutral-950/90 text-gray-950 dark:text-amber-400 text-xs font-semibold px-2 py-0.5 rounded-lg flex items-center gap-0.5 shadow-xs">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-current" /> {food.rating}
                  </span>
                  
                  {/* Availability badge */}
                  <span className={`absolute bottom-3 left-3 text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1 text-white ${
                    isAvail ? 'bg-emerald-650/85' : 'bg-red-650/85'
                  }`}>
                    {isAvail ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {food.availabilityStatus}
                  </span>
                </div>

                {/* Content Container */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{food.category}</span>
                    <h3 className="font-sans font-bold text-gray-950 dark:text-white text-sm line-clamp-1 mt-0.5">{food.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1 line-clamp-2 h-8 leading-relaxed">
                      {food.description}
                    </p>
                  </div>

                  <div className="mt-4 space-y-3.5">
                    {/* Price and timing details */}
                    <div className="flex justify-between items-center text-[10px] text-gray-450 font-semibold font-mono">
                      <span className="flex items-center gap-0.5"><Clock className="w-3 h-3 text-emerald-500" /> {food.preparationTime}</span>
                      <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">₹{food.price}</span>
                    </div>

                    {/* Manage capabilities vs Add to Cart capability */}
                    <div className="flex gap-2">
                      {canManageMenu ? (
                        <>
                          <button
                            onClick={() => handleEditClick(food)}
                            className="flex-1 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400 rounded-xl text-xs font-bold leading-none flex items-center justify-center gap-1 transition cursor-pointer"
                            title="Edit Item details"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Modify
                          </button>
                          <button
                            onClick={() => handleDeleteItem(food.id, food.name)}
                            className="p-2 border border-red-100 hover:border-red-200 text-red-500 dark:border-red-950 dark:text-red-400 rounded-xl transition cursor-pointer"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <button
                          disabled={!isAvail}
                          onClick={() => onAddToCart(food)}
                          className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer ${
                            isAvail 
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs' 
                              : 'bg-gray-100 dark:bg-neutral-800 text-gray-400 cursor-not-allowed border-none'
                          }`}
                        >
                          <ShoppingCart className="w-3.5 h-3.5" /> Add To Feast
                        </button>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
