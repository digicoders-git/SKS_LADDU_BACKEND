// Test Order Creation with Shiprocket
import { createShiprocketOrder } from './controllers/shiprocketOrder.controller.js';
import dotenv from 'dotenv';

dotenv.config();

const testOrder = {
  _id: "696f54fc8864da619beec379",
  items: [{
    product: "696b71287fba21dfdc014d43",
    productName: "Kulhad laddu",
    productPrice: 544,
    quantity: 2
  }],
  total: 1088,
  paymentMethod: "COD",
  weight: 0.5,
  shippingAddress: {
    name: "Test Customer",
    phone: "9876543210",
    email: "test@example.com",
    addressLine1: "123 Test Street",
    addressLine2: "Near Test Market",
    city: "Delhi",
    state: "Delhi",
    pincode: "110001"
  }
};

const testOrderCreation = async () => {
  try {
    console.log('🚀 Testing Shiprocket order creation...');
    const result = await createShiprocketOrder(testOrder);
    console.log('✅ Order created successfully:', result);
  } catch (error) {
    console.error('❌ Order creation failed:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
};

testOrderCreation();