// Test Order Flow with Shiprocket Integration
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testOrder = {
  userId: "60d5ecb74b24c72d88f4e123", // Replace with actual user ID
  items: [
    {
      productId: "60d5ecb74b24c72d88f4e456", // Replace with actual product ID
      quantity: 2,
      size: "M",
      color: "Red"
    }
  ],
  shippingAddress: {
    name: "Test Customer",
    phone: "9876543210",
    email: "test@example.com",
    addressLine1: "123 Test Street",
    addressLine2: "Near Test Market",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    country: "India"
  },
  paymentMethod: "COD",
  notes: "Test order for Shiprocket integration"
};

async function testOrderFlow() {
  try {
    console.log('🚀 Testing Order Creation with Auto Shiprocket Integration...\n');
    
    // 1. Create Order
    console.log('📦 Creating order...');
    const orderResponse = await axios.post(`${BASE_URL}/orders`, testOrder);
    console.log('✅ Order created:', {
      orderId: orderResponse.data.order._id,
      status: orderResponse.data.order.status,
      shiprocketStatus: orderResponse.data.shiprocketStatus
    });
    
    const orderId = orderResponse.data.order._id;
    
    // 2. Check Order Status
    console.log('\n📋 Checking order status...');
    const statusResponse = await axios.get(`${BASE_URL}/orders/${orderId}/tracking`);
    console.log('✅ Order tracking info:', statusResponse.data.trackingInfo);
    
    // 3. Simulate Status Update (if needed)
    if (!orderResponse.data.order.shiprocketCreated) {
      console.log('\n🔄 Updating order status to confirmed...');
      const updateResponse = await axios.put(`${BASE_URL}/orders/${orderId}/status`, {
        status: 'confirmed'
      });
      console.log('✅ Order updated:', {
        status: updateResponse.data.order.status,
        shiprocketStatus: updateResponse.data.shiprocketStatus
      });
    }
    
    console.log('\n🎉 Order flow test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
}

// Run test
testOrderFlow();