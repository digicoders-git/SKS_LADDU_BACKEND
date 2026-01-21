// Test Shiprocket Integration
// Run: node test-shiprocket.js

import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';
let adminToken = '';

// 1. Login as admin
const loginAdmin = async () => {
  try {
    const res = await axios.post(`${BASE_URL}/admin/login`, {
      adminId: 'Admin',
      password: 'Admin@123'
    });
    adminToken = res.data.token;
    console.log('✅ Admin login successful');
    return adminToken;
  } catch (error) {
    console.error('❌ Admin login failed:', error.response?.data || error.message);
    throw error;
  }
};

// 2. Get orders
const getOrders = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Orders fetched:', res.data.orders?.length || 0);
    return res.data.orders || [];
  } catch (error) {
    console.error('❌ Get orders failed:', error.response?.data || error.message);
    throw error;
  }
};

// 3. Update order status to confirmed (triggers Shiprocket)
const confirmOrder = async (orderId) => {
  try {
    const res = await axios.put(`${BASE_URL}/orders/${orderId}/status`, {
      status: 'confirmed'
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    console.log('✅ Order confirmed:', {
      orderId,
      shiprocketStatus: res.data.shiprocketStatus,
      shiprocketOrderId: res.data.order.shiprocketOrderId,
      awbCode: res.data.order.awbCode
    });
    
    // Debug: Show full response
    console.log('📋 Full response:', JSON.stringify(res.data, null, 2));
    
    return res.data.order;
  } catch (error) {
    console.error('❌ Order confirmation failed:', error.response?.data || error.message);
    throw error;
  }
};

// 4. Track order
const trackOrder = async (awbCode) => {
  try {
    const res = await axios.get(`${BASE_URL}/orders/track/${awbCode}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Tracking data:', res.data.trackingData);
    return res.data.trackingData;
  } catch (error) {
    console.error('❌ Tracking failed:', error.response?.data || error.message);
    throw error;
  }
};

// Main test function
const runTest = async () => {
  try {
    console.log('🚀 Starting Shiprocket Integration Test...\n');
    
    // Step 1: Login
    await loginAdmin();
    
    // Step 2: Get orders
    const orders = await getOrders();
    
    if (orders.length === 0) {
      console.log('⚠️ No orders found. Create an order first.');
      return;
    }
    
    // Step 3: Find a pending order
    const pendingOrder = orders.find(order => order.status === 'pending');
    
    if (!pendingOrder) {
      console.log('⚠️ No pending orders found. All orders are already processed.');
      return;
    }
    
    console.log(`📦 Testing with order: ${pendingOrder._id}`);
    
    // Step 4: Confirm order (triggers Shiprocket)
    const confirmedOrder = await confirmOrder(pendingOrder._id);
    
    // Step 5: Track order if AWB code exists
    if (confirmedOrder.awbCode) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      await trackOrder(confirmedOrder.awbCode);
    } else {
      console.log('⚠️ No AWB code found. Shiprocket order creation might have failed.');
    }
    
    console.log('\n✅ Shiprocket Integration Test Completed Successfully!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
};

// Run the test
runTest();