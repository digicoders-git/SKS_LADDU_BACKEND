// Direct Shiprocket API Test
import { shiprocketRequest, getShiprocketToken } from './services/shiprocket.service.js';
import dotenv from 'dotenv';

dotenv.config();

const testShiprocketConnection = async () => {
  try {
    console.log('🔑 Testing Shiprocket credentials...');
    console.log('Email:', process.env.SHIPROCKET_EMAIL);
    console.log('Base URL:', process.env.SHIPROCKET_BASE_URL);
    
    // Test login
    const token = await getShiprocketToken();
    console.log('✅ Login successful, token received');
    
    // Test API call
    const res = await shiprocketRequest('get', '/settings/company/pickup');
    console.log('✅ Pickup locations:', res.data);
    
  } catch (error) {
    console.error('❌ Shiprocket test failed:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
};

testShiprocketConnection();