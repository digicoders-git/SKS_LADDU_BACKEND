import { shiprocketRequest } from "../services/shiprocket.service.js";

// Enhanced Shiprocket Order Creation
export const createShiprocketOrder = async (order) => {
  try {
    console.log("📦 Creating Shiprocket order for:", order._id);
    
    // Split name into first and last name
    const nameParts = order.shippingAddress.name.trim().split(' ');
    const firstName = nameParts[0] || 'Customer';
    const lastName = nameParts.slice(1).join(' ') || 'Name';

    const payload = {
      order_id: order._id.toString(),
      order_date: new Date().toISOString().split("T")[0],

      pickup_location: "Sandila Ahirawan",

      billing_customer_name: firstName,
      billing_last_name: lastName,
      billing_address: order.shippingAddress.addressLine1,
      billing_address_2: order.shippingAddress.addressLine2 || "",
      billing_city: order.shippingAddress.city,
      billing_pincode: order.shippingAddress.pincode,
      billing_state: order.shippingAddress.state,
      billing_country: "India",
      billing_email: order.shippingAddress.email || "customer@example.com",
      billing_phone: order.shippingAddress.phone,

      shipping_is_billing: true,

      order_items: order.items.map((item) => ({
        name: item.productName,
        sku: item.product.toString(),
        units: item.quantity,
        selling_price: item.productPrice,
      })),

      payment_method: order.paymentMethod === "COD" ? "COD" : "Prepaid",
      sub_total: order.total,

      length: 10,
      breadth: 10,
      height: 5,
      weight: order.weight || 0.5,
    };
    
    console.log("📦 Shiprocket payload:", JSON.stringify(payload, null, 2));

    const res = await shiprocketRequest(
      "post",
      "/orders/create/adhoc",
      payload
    );
    
    console.log("✅ Shiprocket response:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Shiprocket order creation failed:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

// Get Shiprocket order tracking
export const getShiprocketTracking = async (awbCode) => {
  try {
    const res = await shiprocketRequest(
      "get",
      `/courier/track/awb/${awbCode}`
    );
    return res.data;
  } catch (error) {
    console.error("❌ Shiprocket tracking failed:", error.message);
    throw error;
  }
};
