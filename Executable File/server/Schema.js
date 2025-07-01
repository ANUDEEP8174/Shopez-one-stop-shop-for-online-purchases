import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  usertype: { type: String, enum: ['admin', 'customer'], default: 'customer' },
}, { timestamps: true });

// Admin Schema
const adminSchema = new mongoose.Schema({
  banner: { type: String, default: '' },
  categories: [{ type: String }],
}, { timestamps: true });

// Product Schema
const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String },
  mainImg: { type: String },
  carousel: [{ type: String }],
  sizes: [{ type: String, enum: ['S', 'M', 'L', 'XL'] }],
  category: { type: String },
  gender: { type: String, enum: ['Men', 'Women', 'Unisex'] },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 }
}, { timestamps: true });

// Order Schema
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  name: { type: String },
  email: { type: String },
  mobile: { type: String },
  address: { type: String },
  pincode: { type: String },
  title: { type: String },
  description: { type: String },
  mainImg: { type: String },
  size: { type: String },
  quantity: { type: Number },
  price: { type: Number },
  discount: { type: Number },
  paymentMethod: { type: String },
  orderDate: { type: Date, default: Date.now },
  deliveryDate: { type: Date },
  orderStatus: { 
    type: String, 
    enum: ['order placed', 'In-transit', 'delivered', 'cancelled'], 
    default: 'order placed' 
  }
}, { timestamps: true });

// Cart Schema
const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  title: { type: String },
  description: { type: String },
  mainImg: { type: String },
  size: { type: String },
  quantity: { type: Number, default: 1 },
  price: { type: Number },
  discount: { type: Number }
}, { timestamps: true });

// Models
export const User = mongoose.model('users', userSchema);
export const Admin = mongoose.model('admin', adminSchema);
export const Product = mongoose.model('products', productSchema);
export const Orders = mongoose.model('orders', orderSchema);
export const Cart = mongoose.model('cart', cartSchema);
