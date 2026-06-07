import React, { useState } from 'react';
import { Calendar, Users, Armchair, CheckCircle, Table, Sparkles, BookOpen, Clock } from 'lucide-react';
import { TableBooking, BuffetBooking, User } from '../types';

interface BookingSectionProps {
  currentUser: User | null;
  tableBookings: TableBooking[];
  buffetBookings: BuffetBooking[];
  onAddTableBooking: (booking: TableBooking) => void;
  onAddBuffetBooking: (booking: BuffetBooking) => void;
}

// Fixed tables capacity structure
const TABLES_IN_HOUSE = [
  { tableNumber: 1, capacity: 2, description: "Cozy Garden view" },
  { tableNumber: 2, capacity: 2, description: "Candlelit window corner" },
  { tableNumber: 3, capacity: 4, description: "Spacious central booth" },
  { tableNumber: 4, capacity: 4, description: "Family sofa lounge" },
  { tableNumber: 5, capacity: 6, description: "Acoustic music rail" },
  { tableNumber: 6, capacity: 6, description: "Executive glass suite" },
  { tableNumber: 7, capacity: 8, description: "Grand banquet table" },
  { tableNumber: 8, capacity: 12, description: "Royal Feast dining chamber" }
];

const BUFFET_TIERS = [
  { id: 'Veg', name: 'Veg Garden Fest', price: 599, description: '35+ exquisite pure-veg special culinary spreads' },
  { id: 'Premium', name: 'Premium Royal', price: 999, description: '60+ global multi-cuisine meats, sea-delights & kulfis' },
  { id: 'Family', name: 'Family Grand Reunion', price: 1999, description: 'Valued full platter for 4 members' }
];

const TIME_SLOTS = [
  '09:00 AM - 11:30 AM (Breakfast Special)',
  '12:00 PM - 03:00 PM (Royal Lunch)',
  '04:00 PM - 07:00 PM (Hi-Tea Counters)',
  '07:30 PM - 11:00 PM (Premium Diner)'
];

export default function BookingSection({
  currentUser,
  tableBookings,
  buffetBookings,
  onAddTableBooking,
  onAddBuffetBooking
}: BookingSectionProps) {
  const [bookingType, setBookingType] = useState<'Table' | 'Buffet'>('Table');

  // Table form fields
  const [tDate, setTDate] = useState('2026-06-10');
  const [tTime, setTTime] = useState('19:30');
  const [tGuests, setTGuests] = useState<number>(4);
  const [tTableNum, setTTableNum] = useState<number>(3);
  
  // Buffet form fields
  const [bType, setBType] = useState<'Veg' | 'Premium' | 'Family'>('Premium');
  const [bSeats, setBSeats] = useState<number>(4);
  const [bDate, setBDate] = useState('2026-06-10');
  const [bSlot, setBSlot] = useState(TIME_SLOTS[1]);

  const [notif, setNotif] = useState<string | null>(null);
  const [errNotif, setErrNotif] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 4000);
  };

  const showError = (msg: string) => {
    setErrNotif(msg);
    setTimeout(() => setErrNotif(null), 4000);
  };

  // Table Booking submission
  const handleTableSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // DOUBLE BOOKING PROTECTION: Check overlap on tableNumber, date, and hour
    const isDoubleBooked = tableBookings.some(
      b => b.tableNumber === tTableNum && b.date === tDate && b.status !== 'Cancelled'
    );

    if (isDoubleBooked) {
      showError(`Table #${tTableNum} is already reserved for ${tDate}. Double-booking prevented. Try choosing another raw table layout!`);
      return;
    }

    const tSelectionDetails = TABLES_IN_HOUSE.find(t => t.tableNumber === tTableNum);
    if (tSelectionDetails && tGuests > tSelectionDetails.capacity) {
      showError(`Table #${tTableNum} only hosts up to ${tSelectionDetails.capacity} diners. Adjust guests or choose another table!`);
      return;
    }

    const newBooking: TableBooking = {
      id: 'RES-' + Math.floor(1000 + Math.random() * 9000),
      customerName: currentUser ? currentUser.fullName : 'Guest Diner',
      phone: currentUser ? currentUser.phone : '+91 91111 22222',
      date: tDate,
      time: tTime,
      guests: tGuests,
      tableNumber: tTableNum,
      status: 'Approved' // Auto approved to give users smooth instant feedback!
    };

    onAddTableBooking(newBooking);
    showSuccess(`✓ Table ${tTableNum} successfully Reserved for ${tDate} at ${tTime}! Check-in code is ${newBooking.id}.`);
  };

  // Buffet Booking submission
  const handleBuffetSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (bSeats > 12) {
      showError(`Seat Booking limit reached. Groups larger than 12 guests require custom banqueting options. Direct phone call with Krish/Nikhil.`);
      return;
    }

    const selectedTier = BUFFET_TIERS.find(b => b.id === bType);
    const cost = (selectedTier?.price || 599) * bSeats;

    const newBuffet: BuffetBooking = {
      id: 'BUFA-' + Math.floor(1000 + Math.random() * 9000),
      customerName: currentUser ? currentUser.fullName : 'Guest Diner',
      phone: currentUser ? currentUser.phone : '+91 99999 88888',
      buffetType: bType,
      price: cost,
      seatsCount: bSeats,
      date: bDate,
      timeSlot: bSlot,
      status: 'Approved'
    };

    onAddBuffetBooking(newBuffet);
    showSuccess(`✓ Buffet seats reserved successfully! ${bSeats} VIP slots for ${bType} at ${bSlot} on ${bDate}. Final net price: ₹${cost}.`);
  };

  return (
    <div className="space-y-8">
      
      {/* HEADER SECTION */}
      <div>
        <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Instant Ticketing</span>
        <h2 className="text-3xl font-sans font-bold text-gray-900 dark:text-white mt-1 tracking-tight">Reservations Core</h2>
        <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">Book dinner tables or self serve gourmet VIP buffet loops elegantly.</p>
      </div>

      {notif && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-850 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 rounded-xl text-xs font-semibold">
          {notif}
        </div>
      )}

      {errNotif && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-400 border border-red-100 dark:border-red-900/50 rounded-xl text-xs font-semibold">
          ☠ Error: {errNotif}
        </div>
      )}

      {/* BOOKINGS SWITCH BAR */}
      <div className="flex gap-4 border-b border-gray-150 dark:border-neutral-800">
        <button
          onClick={() => setBookingType('Table')}
          className={`pb-3 font-sans font-bold text-sm tracking-tight cursor-pointer relative ${
            bookingType === 'Table'
              ? 'text-emerald-600 dark:text-emerald-450 border-b-2 border-emerald-600'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <span className="flex items-center gap-2">
            <Table className="w-4 h-4" />
            Spot Table Reservation
          </span>
        </button>

        <button
          onClick={() => setBookingType('Buffet')}
          className={`pb-3 font-sans font-bold text-sm tracking-tight cursor-pointer relative ${
            bookingType === 'Buffet'
              ? 'text-emerald-600 dark:text-emerald-450 border-b-2 border-emerald-600'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            VIP Grand Buffet Passes
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: ACTIVE FORMS */}
        <div className="lg:col-span-5 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-805/90 rounded-3xl p-6 shadow-xs">
          
          {bookingType === 'Table' ? (
            /* TABLE RESERVATION FORM */
            <form onSubmit={handleTableSubmit} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-500" /> Book a Table
                </h3>
                <p className="text-[11px] text-gray-450 dark:text-neutral-500">Pick date, table layouts, and guests dynamically.</p>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Diner Capacity Check *</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="number"
                    min={1}
                    max={20}
                    required
                    value={tGuests}
                    onChange={(e) => setTGuests(Number(e.target.value))}
                    className="w-full pl-9 text-xs rounded-xl border border-gray-200 dark:border-neutral-800 p-2.5 bg-transparent text-gray-700 dark:text-neutral-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Date selection</label>
                  <input
                    type="date"
                    required
                    value={tDate}
                    onChange={(e) => setTDate(e.target.value)}
                    className="w-full text-xs rounded-xl border border-gray-200 dark:border-neutral-800 p-2.5 bg-transparent text-gray-700 dark:text-neutral-300"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Arrival Time</label>
                  <input
                    type="time"
                    required
                    value={tTime}
                    onChange={(e) => setTTime(e.target.value)}
                    className="w-full text-xs rounded-xl border border-gray-200 dark:border-neutral-800 p-2.5 bg-transparent text-gray-700 dark:text-neutral-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Pick Raw Table Layout</label>
                <select
                  value={tTableNum}
                  onChange={(e) => setTTableNum(Number(e.target.value))}
                  className="w-full text-xs rounded-xl border border-gray-200 dark:border-neutral-800 p-2.5 bg-transparent text-gray-700 dark:text-neutral-300"
                >
                  {TABLES_IN_HOUSE.map(tab => (
                    <option key={tab.tableNumber} value={tab.tableNumber}>
                      Table Number {tab.tableNumber} (Capacity: {tab.capacity} Guests - {tab.description})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:-translate-y-0.5 transition cursor-pointer"
              >
                Secure Table Reservation
              </button>
            </form>
          ) : (
            /* BUFFET RESERVATION FORM */
            <form onSubmit={handleBuffetSubmit} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-gray-901 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Book Buffet Passports
                </h3>
                <p className="text-[11px] text-gray-450 dark:text-neutral-500">Pick buffet category and booking seats capacity passes.</p>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Buffet Tier</label>
                <div className="space-y-2">
                  {BUFFET_TIERS.map(tier => (
                    <label
                      key={tier.id}
                      className={`block p-3 border rounded-xl cursor-pointer transition ${
                        bType === tier.id
                          ? 'border-emerald-600 bg-emerald-50/20 text-emerald-850 dark:text-emerald-400 dark:bg-emerald-950/20 font-semibold'
                          : 'border-gray-200 dark:border-neutral-800 text-gray-700 dark:text-neutral-300'
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span>{tier.name}</span>
                        <span className="font-bold text-emerald-650 dark:text-emerald-400 font-mono">₹{tier.price}/pass</span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-normal mt-1">{tier.description}</p>
                      <input
                        type="radio"
                        name="buffet_scheme"
                        value={tier.id}
                        checked={bType === tier.id}
                        onChange={() => setBType(tier.id as 'Veg' | 'Premium' | 'Family')}
                        className="hidden"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Seats Passes Count</label>
                <div className="relative">
                  <Armchair className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="number"
                    min={1}
                    max={12}
                    required
                    value={bSeats}
                    onChange={(e) => setBSeats(Number(e.target.value))}
                    className="w-full pl-9 text-xs rounded-xl border border-gray-200 dark:border-neutral-800 p-2.5 bg-transparent text-gray-700 dark:text-neutral-350"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-gray-400">Limit: 12 passes</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Reservation Date</label>
                <input
                  type="date"
                  required
                  value={bDate}
                  onChange={(e) => setBDate(e.target.value)}
                  className="w-full text-xs rounded-xl border border-gray-200 dark:border-neutral-800 p-2.5 bg-transparent text-gray-700 dark:text-neutral-350"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Dining Slot Time</label>
                <select
                  value={bSlot}
                  onChange={(e) => setBSlot(e.target.value)}
                  className="w-full text-xs rounded-xl border border-gray-200 dark:border-neutral-800 p-2.5 bg-transparent text-gray-700 dark:text-neutral-300"
                >
                  {TIME_SLOTS.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:-translate-y-0.5 transition cursor-pointer"
              >
                Secure Buffet Passes
              </button>
            </form>
          )}

        </div>

        {/* RIGHT COLUMN: HOUSE MAP & ACTIVE BOOKINGS TICKETS */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* TABLE HOUSE LAYOUT INDICATOR */}
          {bookingType === 'Table' && (
            <div className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-805/90 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <Table className="w-4 h-4 text-emerald-500" /> Atria Feasty - Restaurant Floor Grid map
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {TABLES_IN_HOUSE.map(tab => {
                  // Check if reserved on selected date
                  const isReserved = tableBookings.some(
                    b => b.tableNumber === tab.tableNumber && b.date === tDate && b.status !== 'Cancelled'
                  );

                  return (
                    <div
                      key={tab.tableNumber}
                      onClick={() => !isReserved && setTTableNum(tab.tableNumber)}
                      className={`p-3.5 rounded-2xl border text-center transition cursor-pointer flex flex-col justify-between h-28 ${
                        isReserved
                          ? 'bg-red-50/10 border-red-200 dark:border-red-950/40 text-red-400'
                          : tTableNum === tab.tableNumber
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/15'
                          : 'bg-gray-50/50 dark:bg-neutral-800/30 border-gray-150 dark:border-neutral-805 text-gray-700 dark:text-neutral-300 hover:bg-gray-100 hover:scale-[1.02]'
                      }`}
                    >
                      <div className="text-[10px] font-mono uppercase tracking-widest font-semibold flex justify-between items-center">
                        <span>A-0{tab.tableNumber}</span>
                        {isReserved ? (
                          <span className="text-[8px] bg-red-500 text-white px-1.5 py-0.2 rounded-full uppercase font-bold">X</span>
                        ) : tTableNum === tab.tableNumber ? (
                          <span className="text-[8px] bg-white text-emerald-700 px-1.5 py-0.2 rounded-full uppercase font-bold">VIP</span>
                        ) : (
                          <span className="text-[8px] bg-emerald-100 text-emerald-750 px-1.5 py-0.2 rounded-full uppercase font-bold">ok</span>
                        )}
                      </div>
                      <div className="text-xl font-bold font-mono">T-{tab.tableNumber}</div>
                      <div className="text-[10px] opacity-80 leading-tight">Capacity: {tab.capacity} Pax</div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-4 text-[10px] font-mono text-gray-400 justify-center">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-600 rounded-xs"></span> Selection</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-red-400 rounded-xs"></span> Already Reserved</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-gray-150 dark:bg-neutral-800 rounded-xs"></span> Available Spot</span>
              </div>
            </div>
          )}

          {/* ACTIVE BOOKINGS TIMELINE LIST */}
          <div className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-850 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-901 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500 animate-bounce" />
              Your Active Bookings Timeline
            </h3>

            {tableBookings.length === 0 && buffetBookings.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-8">No booking records found in local memory storage. Start reserving above!</p>
            ) : (
              <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                {/* Tables Bookings */}
                {tableBookings.map(tb => (
                  <div key={tb.id} className="p-4 rounded-2xl border border-gray-150 dark:border-neutral-805 bg-gray-50/20 dark:bg-neutral-900/50 flex justify-between items-center">
                    <div>
                      <div className="text-[9px] bg-emerald-100 text-emerald-800 font-mono px-2 py-0.5 rounded-full uppercase inline-block">Table spots</div>
                      <h4 className="text-sm font-bold text-gray-950 dark:text-white mt-1">Table Number {tb.tableNumber} reservation</h4>
                      <div className="text-xs text-gray-500 mt-0.5 flex gap-3 text-[10px] font-mono">
                        <span>Date: {tb.date}</span>
                        <span>Time: {tb.time}</span>
                        <span>Guest Count: {tb.guests} Pax</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-gray-400 font-semibold block">ID: {tb.id}</span>
                      <span className="text-xs text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 rounded-md mt-1 inline-block uppercase">Approved</span>
                    </div>
                  </div>
                ))}

                {/* Buffet bookings */}
                {buffetBookings.map(buf => (
                  <div key={buf.id} className="p-4 rounded-2xl border border-gray-150 dark:border-neutral-805 bg-gray-50/20 dark:bg-neutral-900/50 flex justify-between items-center">
                    <div>
                      <div className="text-[9px] bg-amber-100 text-amber-800 font-mono px-2 py-0.5 rounded-full uppercase inline-block font-semibold">VIP Buffet pass</div>
                      <h4 className="text-sm font-bold text-gray-950 dark:text-white mt-1">{buf.seatsCount} Seats for {buf.buffetType} Buffet</h4>
                      <div className="text-xs text-gray-500 mt-0.5 flex flex-col sm:flex-row gap-1 sm:gap-3 text-[10px] font-mono">
                        <span>Date: {buf.date}</span>
                        <span>Slot: {buf.timeSlot}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-gray-400 font-semibold block">Price: ₹{buf.price}</span>
                      <span className="text-xs text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 rounded-md mt-1 inline-block uppercase">Approved</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
