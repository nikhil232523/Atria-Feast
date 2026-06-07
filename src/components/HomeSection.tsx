import React, { useState } from 'react';
import { Star, Clock, MapPin, Compass, Navigation, Award, MessageSquare, Utensils, CheckCircle, Flame } from 'lucide-react';
import { FoodItem, Review } from '../types';

interface HomeSectionProps {
  foodItems: FoodItem[];
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'timestamp'>) => void;
  onBookClick: () => void;
  onOrderClick: () => void;
}

export default function HomeSection({
  foodItems,
  reviews,
  onAddReview,
  onBookClick,
  onOrderClick
}: HomeSectionProps) {
  // Review inputs
  const [revName, setRevName] = useState('');
  const [revComment, setRevComment] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revFood, setRevFood] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  // Maps / GPS inputs
  const [startPoint, setStartPoint] = useState('Majestic Railway Station');
  const [customLat, setCustomLat] = useState('12.9733');
  const [customLng, setCustomLng] = useState('77.5736');
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);

  // Pre-fixed Atria coordinates
  const ATRIA_LAT = 13.032526;
  const ATRIA_LNG = 77.592126;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName || !revComment) return;
    onAddReview({
      customerName: revName,
      comment: revComment,
      rating: revRating,
      foodName: revFood || undefined
    });
    setRevName('');
    setRevComment('');
    setRevFood('');
    setRevRating(5);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  // Safe distance calculation using Haversine formula
  const calculateDistance = () => {
    let lat1 = parseFloat(customLat);
    let lon1 = parseFloat(customLng);
    
    // Landmark coordinate preset overrides
    if (startPoint === 'Majestic Railway Station') {
      lat1 = 12.9733; lon1 = 77.5736;
    } else if (startPoint === 'Indiranagar') {
      lat1 = 12.9784; lon1 = 77.6408;
    } else if (startPoint === 'Whitefield') {
      lat1 = 12.9698; lon1 = 77.7499;
    } else if (startPoint === 'Bangalore Airport') {
      lat1 = 13.1989; lon1 = 77.7068;
    }

    const R = 6371; // Earth radius in km
    const dLat = (ATRIA_LAT - lat1) * Math.PI / 180;
    const dLon = (ATRIA_LNG - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(ATRIA_LAT * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const dist = R * c; // in km

    setRouteInfo({
      distance: dist.toFixed(2),
      duration: Math.round(dist * 2.2 + 8) + " mins"
    });
  };

  // Find 3 featured elements to highlight
  const todaySpecials = foodItems.filter(f => f.rating >= 4.8).slice(0, 3);
  const populars = foodItems.slice(4, 8);

  return (
    <div className="space-y-20">
      
      {/* 1. HERO BANNER */}
      <section className="relative rounded-3xl overflow-hidden bg-neutral-950 text-white shadow-xl shadow-neutral-900/10">
        <div className="absolute inset-0 bg-cover bg-center brightness-[0.35]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1200')" }} />
        
        <div className="relative max-w-5xl mx-auto px-6 py-20 lg:py-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-8 animate-pulse">
            <Flame className="w-3.5 h-3.5" /> High-Spirited Epicurean Delights
          </div>
          
          <h1 className="text-4xl md:text-6xl font-sans font-bold tracking-tight text-white leading-tight">
            Indulge in Majestic Flavours at <br />
            <span className="text-emerald-400">Atria Feasty</span>
          </h1>
          
          <p className="mt-6 text-gray-300 md:text-lg max-w-2xl leading-relaxed">
            Bengaluru's award-winning destination specializing in North and South Indian delicacies, Madrid Tapas, traditional Shoyu Ramen, and artisan stonebaked pizzas.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button
              onClick={onOrderClick}
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5 transition cursor-pointer"
            >
              Order Foods Now
            </button>
            <button
              onClick={onBookClick}
              className="px-8 py-3.5 bg-neutral-900/80 hover:bg-neutral-800 text-white rounded-xl text-sm font-semibold border border-neutral-700 hover:-translate-y-0.5 transition cursor-pointer"
            >
              Book Premium Table
            </button>
          </div>

          {/* Quick timing ribbon inside hero */}
          <div className="mt-12 pt-6 border-t border-neutral-800 flex items-center gap-2 text-xs font-mono tracking-wider text-gray-400">
            <Clock className="w-4 h-4 text-emerald-400" />
            TIMINGS: 09:00 AM - 11:00 PM (MONDAY TO SUNDAY)
          </div>
        </div>
      </section>

      {/* 2. TODAY'S SPECIAL FOODS */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Gourmet Selection</span>
          <h2 className="text-3xl font-sans font-bold text-gray-900 dark:text-white mt-1 tracking-tight">Today's Special Creations</h2>
          <div className="h-1 w-12 bg-emerald-600 dark:bg-emerald-400 mx-auto mt-3 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {todaySpecials.map(food => (
            <div key={food.id} className="group bg-white dark:bg-neutral-900 rounded-2xl shadow-xs border border-gray-100 dark:border-neutral-800/80 overflow-hidden hover:shadow-md transition">
              <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-neutral-800">
                <img 
                  referrerPolicy="no-referrer"
                  src={food.image} 
                  alt={food.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                />
                <span className="absolute top-3 right-3 bg-amber-500/90 text-neutral-950 text-xs font-mono px-2.5 py-1 rounded-md font-bold flex items-center gap-1 shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-current" /> {food.rating}
                </span>
                <span className="absolute bottom-3 left-3 bg-neutral-900/85 text-emerald-400 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider backdrop-blur-xs">
                  {food.category}
                </span>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-center">
                  <h3 className="font-sans font-bold text-gray-900 dark:text-white line-clamp-1">{food.name}</h3>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold text-base shrink-0">₹{food.price}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-neutral-400 mt-2 line-clamp-2 h-8 leading-relaxed">
                  {food.description}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-gray-450 dark:text-neutral-500">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-emerald-500" /> Prep: {food.preparationTime}</span>
                  <button 
                    onClick={onOrderClick}
                    className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                  >
                    View in Menu
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEASTY BUFFET EXPERIENCE */}
      <section className="bg-emerald-900 dark:bg-neutral-950/40 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden shadow-lg">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 pointer-events-none hidden lg:block bg-gradient-to-l from-white/30 to-transparent flex items-center justify-center">
          <Utensils className="w-80 h-80 text-white" />
        </div>
        
        <div className="max-w-3xl relative">
          <span className="text-xs font-mono text-emerald-300 dark:text-emerald-400 uppercase tracking-widest font-bold">Unparalleled Dining</span>
          <h2 className="text-3xl lg:text-4xl font-sans font-bold tracking-tight mt-1">Magnificent Weekend Buffet Feast</h2>
          <p className="text-emerald-100/90 dark:text-neutral-300 mt-4 text-sm lg:text-base leading-relaxed">
            Secure reservations for our famous self-serve hot arrays. Featuring unlimited street foods counters, Spanish starters, chef-curated maincourses, and elaborate cold kulfis bars.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 dark:bg-neutral-900/50 backdrop-blur-xs p-5 rounded-2xl border border-white/15 dark:border-neutral-800 text-center">
              <div className="text-xs font-mono text-emerald-200 dark:text-emerald-400 font-semibold mb-1 uppercase">Veg Splendor</div>
              <div className="text-2xl font-bold font-mono">₹599<span className="text-xs text-white/75">/head</span></div>
              <div className="text-[10px] text-emerald-100/70 dark:text-neutral-400 mt-1.5">35+ Exotic Items</div>
            </div>
            
            <div className="bg-white/15 dark:bg-neutral-900/70 backdrop-blur-xs p-5 rounded-2xl border border-emerald-400/30 text-center relative overflow-hidden shadow-md">
              <span className="absolute top-0 right-0 bg-amber-500 text-neutral-950 text-[8px] font-mono font-bold px-2 py-0.5 uppercase tracking-widest rounded-bl-lg">Hot</span>
              <div className="text-xs font-mono text-amber-300 font-semibold mb-1 uppercase">Premium Royal</div>
              <div className="text-2xl font-bold font-mono">₹999<span className="text-xs text-white/75">/head</span></div>
              <div className="text-[10px] text-amber-200/90 mt-1.5">60+ Global Delights</div>
            </div>

            <div className="bg-white/10 dark:bg-neutral-900/50 backdrop-blur-xs p-5 rounded-2xl border border-white/15 dark:border-neutral-800 text-center">
              <div className="text-xs font-mono text-emerald-200 dark:text-emerald-400 font-semibold mb-1 uppercase">Family Reunion</div>
              <div className="text-2xl font-bold font-mono">₹1999<span className="text-xs text-white/75">/group</span></div>
              <div className="text-[10px] text-emerald-100/70 dark:text-neutral-400 mt-1.5">Valued for 4 Members</div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button 
              onClick={onBookClick}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-neutral-950 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
            >
              Book Buffet Seat
            </button>
            <div className="flex items-center gap-1 text-xs font-mono text-emerald-100/80">
              <CheckCircle className="w-4 h-4 text-amber-400 font-bold shrink-0" /> Fast verification on venue entries
            </div>
          </div>
        </div>
      </section>

      {/* 4. GOOGLE MAPS LOCATION INTEGRATION */}
      <section className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-3xl p-6 lg:p-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-4 space-y-5">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Find Our Venue</span>
              <h2 className="text-2xl font-sans font-bold text-gray-900 dark:text-white mt-1 tracking-tight">Interactive Map Finder</h2>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-neutral-400 leading-relaxed">
              Atria Feasty is situated near Hebbal, outer ring road, easily accessible from international airways and local transit channels:
            </p>

            <div className="p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-2xl space-y-2 border border-gray-100 dark:border-neutral-850">
              <div className="text-xs font-mono text-gray-400 uppercase">GPS Navigation Anchor Links</div>
              <div className="text-sm text-gray-700 dark:text-neutral-300"><span className="font-semibold text-gray-900 dark:text-white">Latitude:</span> 13.032526</div>
              <div className="text-sm text-gray-700 dark:text-neutral-300"><span className="font-semibold text-gray-900 dark:text-white">Longitude:</span> 77.592126</div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-600 dark:text-neutral-400 uppercase">Get Route From:</label>
              <select 
                value={startPoint} 
                onChange={(e) => {
                  setStartPoint(e.target.value);
                  setRouteInfo(null);
                }} 
                className="w-full text-sm rounded-xl border border-gray-200 dark:border-neutral-800 p-2.5 bg-transparent text-gray-700 dark:text-neutral-350"
              >
                <option value="Majestic Railway Station">Majestic Terminus (12.9733, 77.5736)</option>
                <option value="Indiranagar">Indiranagar Metro (12.9784, 77.6408)</option>
                <option value="Whitefield">Whitefield ITPL (12.9698, 77.7499)</option>
                <option value="Bangalore Airport">Bengaluru Airport (13.1989, 77.7068)</option>
              </select>

              <button
                onClick={calculateDistance}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <Compass className="w-4 h-4" /> Compute Distance & Route
              </button>
            </div>

            {routeInfo && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
                <div className="flex justify-between font-mono text-xs text-emerald-800 dark:text-emerald-400">
                  <span>Routing:</span>
                  <span className="font-bold flex items-center gap-0.5"><Navigation className="w-3 h-3 fill-current" /> Active</span>
                </div>
                <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white font-mono">{routeInfo.distance} <span className="text-xs font-sans text-gray-500">KM distance</span></div>
                <div className="text-xs text-gray-500 mt-1">Estimated Driving Period: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{routeInfo.duration}</span> (via Hebbal flyover pathway)</div>
              </div>
            )}
          </div>

          <div className="lg:col-span-8 bg-gray-50 dark:bg-neutral-800/30 rounded-2xl border border-gray-100 dark:border-neutral-805 p-2 h-96 relative overflow-hidden flex flex-col justify-between">
            {/* Map Frame rendering simulation */}
            <div className="absolute inset-0 bg-neutral-900/5 hover:bg-none transition duration-300 z-1 pointer-events-none" />
            
            {/* Render interactive coordinate system box with pins */}
            <div className="relative w-full h-full bg-linear-to-b from-sky-50 to-emerald-50 dark:from-neutral-950 dark:to-neutral-900 flex items-center justify-center border border-dashed border-gray-200 dark:border-neutral-800 rounded-xl overflow-hidden">
              
              {/* Radial Coordinate Circles */}
              <div className="absolute w-80 h-80 rounded-full border border-gray-200/50 dark:border-neutral-800/50" />
              <div className="absolute w-48 h-48 rounded-full border border-gray-200/50 dark:border-neutral-800/50 border-dashed" />
              
              {/* Pulse Indicator on Atria Feasty coordinate */}
              <div className="absolute flex flex-col items-center">
                <span className="relative flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-600 border-2 border-white dark:border-neutral-900 items-center justify-center text-white">
                    <MapPin className="w-3 h-3" />
                  </span>
                </span>
                <span className="mt-1 bg-neutral-950/95 text-white dark:bg-white dark:text-neutral-950 text-[10px] font-sans font-bold px-2 py-0.5 rounded-md shadow-md mb-8 whitespace-nowrap">
                  📍 Atria Feasty Destination
                </span>
              </div>

              {/* Transit landmarks shown dynamically */}
              <div className="absolute bottom-6 left-6 text-left">
                <div className="text-[10px] font-mono text-gray-400 uppercase">Marker Anchor Point 2</div>
                <div className="text-xs font-bold text-gray-700 dark:text-neutral-300">{startPoint}</div>
              </div>

              {/* Mock Scale bar */}
              <div className="absolute bottom-3 right-3 bg-neutral-950/80 text-white px-2 py-0.5 rounded-sm font-mono text-[9px] tracking-wider z-2">
                SCALE: 1 cm : 5.8 km
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. LOYALTY COUPON OFFERS */}
      <section className="space-y-6">
        <div className="max-w-2xl">
          <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Rewards Club</span>
          <h2 className="text-2xl font-sans font-bold text-gray-900 dark:text-white mt-1">Smart Loyalty Membership Discounts</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200/50 dark:from-neutral-900 dark:to-neutral-900/40 p-6 rounded-2xl border border-gray-200/60 dark:border-neutral-805 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-gray-400">
              <Award className="w-8 h-8 opacity-40" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 font-mono">Memberships Tier 1</span>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">Silver Loyalty Reward</h3>
            <div className="text-4xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-3">20% <span className="text-xs text-gray-450 font-normal">Discount</span></div>
            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-2">Issued automatically upon reaching <span className="font-bold">5 successful orders</span>.</p>
            <div className="mt-4 p-2 bg-white dark:bg-neutral-800 rounded-xl text-center border border-dashed border-gray-200 dark:border-neutral-700">
              <span className="font-mono text-xs font-bold tracking-widest text-gray-700 dark:text-neutral-300">SILVER20</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-neutral-900/50 dark:to-neutral-900 p-6 rounded-2xl border border-amber-200/50 dark:border-neutral-805 relative overflow-hidden shadow-xs">
            <div className="absolute top-4 right-4 text-amber-500">
              <Award className="w-8 h-8 opacity-40 animate-spin-slow" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 font-mono">Memberships Tier 2</span>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">Gold Loyalty Reward</h3>
            <div className="text-4xl font-black font-mono text-amber-600 mt-3">25% <span className="text-xs text-gray-450 font-normal">Discount</span></div>
            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-2">Issued automatically upon reaching <span className="font-bold">15 successful orders</span>.</p>
            <div className="mt-4 p-2 bg-white dark:bg-neutral-800 rounded-xl text-center border border-dashed border-amber-300/40 dark:border-neutral-700">
              <span className="font-mono text-xs font-bold tracking-widest text-amber-700 dark:text-neutral-300">GOLD25</span>
            </div>
          </div>

          <div className="bg-linear-to-br from-teal-50 to-emerald-50 dark:from-neutral-950/20 dark:to-neutral-900/40 p-6 rounded-2xl border border-emerald-100 dark:border-neutral-805 relative overflow-hidden shadow-xs">
            <div className="absolute top-4 right-4 text-emerald-600">
              <Award className="w-8 h-8 opacity-40" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 font-mono">Memberships Tier 3</span>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">Platinum Loyalty Reward</h3>
            <div className="text-4xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-3">30% <span className="text-xs text-gray-450 font-normal">Discount</span></div>
            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-2">Issued automatically upon reaching <span className="font-bold">30 successful orders</span>.</p>
            <div className="mt-4 p-2 bg-white dark:bg-neutral-800 rounded-xl text-center border border-dashed border-emerald-200 dark:border-neutral-700">
              <span className="font-mono text-xs font-bold tracking-widest text-emerald-700 dark:text-neutral-300">PLATINUM30</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CUSTOMER REVIEWS FEEDBACK LOOP */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Side: Submit reviews */}
        <div className="lg:col-span-4 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-xs space-y-4">
          <div>
            <h3 className="text-lg font-sans font-bold text-gray-900 dark:text-white">Leave Us A Review</h3>
            <p className="text-xs text-gray-500 dark:text-neutral-400">Share your thoughts on Atria Feasty's meals directly.</p>
          </div>

          <form onSubmit={handleReviewSubmit} className="space-y-3">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={revName}
                onChange={(e) => setRevName(e.target.value)}
                placeholder="Ex: Dr. Sharan Kappor"
                className="w-full text-xs rounded-xl border border-gray-200 dark:border-neutral-800 p-2.5 bg-transparent text-gray-700 dark:text-neutral-300"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Favorite Dish</label>
              <input
                type="text"
                value={revFood}
                onChange={(e) => setRevFood(e.target.value)}
                placeholder="Ex: Paneer Butter Masala"
                className="w-full text-xs rounded-xl border border-gray-200 dark:border-neutral-800 p-2.5 bg-transparent text-gray-700 dark:text-neutral-350"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Rating Score</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(score => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setRevRating(score)}
                    className={`p-2 rounded-lg text-xs font-mono font-bold shrink-0 transition cursor-pointer ${
                      revRating >= score ? 'bg-amber-500 text-neutral-900' : 'bg-gray-100 dark:bg-neutral-800 text-gray-400'
                    }`}
                  >
                    {score} ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Comment</label>
              <textarea
                required
                rows={3}
                value={revComment}
                onChange={(e) => setRevComment(e.target.value)}
                placeholder="Explain food tastes, presentation, hospitality..."
                className="w-full text-xs rounded-xl border border-gray-200 dark:border-neutral-800 p-2.5 bg-transparent text-gray-700 dark:text-neutral-350"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Post Live Review
            </button>

            {successMsg && (
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 text-center text-xs font-semibold rounded-lg">
                Review posted successfully!
              </div>
            )}
          </form>
        </div>

        {/* Right Side: Reviews timeline */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-sans font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-500" />
              Customer Feedbacks timeline
            </h3>
            <span className="text-xs text-gray-400">Total reviews: {reviews.length}</span>
          </div>

          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
            {reviews.map(review => (
              <div key={review.id} className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-805/90 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{review.customerName}</h4>
                    {review.foodName && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-neutral-800 dark:text-emerald-400 px-2 py-0.5 rounded-full font-mono mt-1 inline-block">
                        Dish Reviewed: {review.foodName}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star 
                        key={idx} 
                        className={`w-3.5 h-3.5 ${idx < review.rating ? 'text-amber-500 fill-current' : 'text-gray-200 dark:text-neutral-800'}`} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-neutral-400 italic font-sans leading-relaxed">
                  "{review.comment}"
                </p>
                <div className="text-[9px] font-mono text-gray-400 text-right uppercase">
                  {review.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

    </div>
  );
}
