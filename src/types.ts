export type Role = 'OWNER' | 'ADMIN' | 'STAFF' | 'CUSTOMER';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  username: string;
  role: Role;
  isApproved: boolean; // Staff/Admin need owner approval
  ordersCount: number;
  membershipLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
}

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  availabilityStatus: 'Available' | 'Unavailable';
  preparationTime: string; // e.g., "15 mins"
}

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Accepted' | 'Preparing' | 'Ready' | 'Served' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  username: string;
  customerName: string;
  items: {
    foodId: string;
    foodName: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  couponCodeUsed?: string;
  status: OrderStatus;
  paymentMethod: string; // UPI, Google Pay, PhonePe, Paytm, Credit Card, Debit Card, Cash
  paymentStatus: 'Paid' | 'Unpaid';
  timestamp: string;
}

export interface TableBooking {
  id: string;
  customerName: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  tableNumber: number;
  status: 'Approved' | 'Pending' | 'Cancelled';
}

export interface BuffetBooking {
  id: string;
  customerName: string;
  phone: string;
  buffetType: 'Veg' | 'Premium' | 'Family';
  price: number;
  seatsCount: number;
  date: string;
  timeSlot: string;
  status: 'Approved' | 'Pending' | 'Cancelled';
}

export interface Review {
  id: string;
  customerName: string;
  foodName?: string;
  rating: number; // 1 to 5
  comment: string;
  image?: string;
  timestamp: string;
}

export interface InventoryItem {
  id: string;
  ingredient: string;
  stockQuantity: number; // e.g. 50
  unit: string; // e.g. "kg", "litres", "units"
  consumptionRate: number; // daily usage
  expiryDate: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}
