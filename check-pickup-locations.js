// Check Pickup Locations
import { shiprocketRequest } from './services/shiprocket.service.js';
import dotenv from 'dotenv';

dotenv.config();

const checkPickupLocations = async () => {
  try {
    console.log('🏪 Checking pickup locations...');
    const res = await shiprocketRequest('get', '/settings/company/pickup');
    console.log('📍 Available pickup locations:');
    
    if (res.data?.data?.shipping_address) {
      res.data.data.shipping_address.forEach((location, index) => {
        console.log(`${index + 1}. ${location.pickup_location} - ${location.address}, ${location.city}`);
      });
    }
    
    return res.data;
  } catch (error) {
    console.error('❌ Failed to get pickup locations:', error.message);
  }
};

checkPickupLocations();