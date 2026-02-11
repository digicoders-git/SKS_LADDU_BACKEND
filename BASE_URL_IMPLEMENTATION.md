# BASE_URL Implementation for Local Uploads

## Overview
All local file uploads now use `BASE_URL` from `.env` to create complete URLs in the database.

## Environment Variable
```env
BASE_URL=http://localhost:5000
```

## How It Works

### Before (Relative URLs):
```javascript
// Database stored:
{
  url: "/uploads/products/product-123.jpg"
}
```

### After (Complete URLs with BASE_URL):
```javascript
// Database stores:
{
  url: "http://localhost:5000/uploads/products/product-123.jpg"
}
```

## Updated Controllers

### 1. Product Controller
**Create Product:**
```javascript
const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
mainImage: {
  url: `${baseUrl}/uploads/products/${file.filename}`
}
```

**Update Product:**
- Uses BASE_URL for new file URLs
- Strips BASE_URL when deleting old files

**Delete Product:**
- Strips BASE_URL to get local file path
- Deletes file from disk

### 2. Slider Controller
**Create Slider:**
```javascript
const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
image: {
  url: `${baseUrl}/uploads/sliders/${file.filename}`
}
```

**Update/Delete:**
- Same BASE_URL logic as products

### 3. Video Controller
**Add Video:**
```javascript
const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
url: `${baseUrl}/uploads/videos/${file.filename}`
```

**Delete Video:**
- Strips BASE_URL to get local file path

## Database Examples

### Product:
```json
{
  "_id": "696b706d7fba21dfdc014d3a",
  "name": "Kesar Laddu",
  "mainImage": {
    "url": "http://localhost:5000/uploads/products/product-1737369600-123456789.jpg",
    "publicId": "product-1737369600-123456789.jpg"
  },
  "galleryImages": [
    {
      "url": "http://localhost:5000/uploads/products/product-1737369601-987654321.jpg",
      "publicId": "product-1737369601-987654321.jpg"
    }
  ]
}
```

### Slider:
```json
{
  "_id": "696b714c7fba21dfdc014d46",
  "title": "Slider 1737369700",
  "image": {
    "url": "http://localhost:5000/uploads/sliders/slider-1737369700-123456789.jpg",
    "publicId": "slider-1737369700-123456789.jpg"
  }
}
```

### Video:
```json
{
  "_id": "696b71287fba21dfdc014d43",
  "url": "http://localhost:5000/uploads/videos/video-1737369800-123456789.mp4",
  "publicId": "video-1737369800-123456789.mp4"
}
```

## Benefits

### 1. Frontend Integration
Frontend can directly use URLs from database:
```javascript
<img src={product.mainImage.url} />
// Works directly without concatenation
```

### 2. Environment Flexibility
Change BASE_URL for different environments:
```env
# Development
BASE_URL=http://localhost:5000

# Production
BASE_URL=https://api.yourdomain.com

# Staging
BASE_URL=https://staging-api.yourdomain.com
```

### 3. CDN Ready
Easy to switch to CDN:
```env
BASE_URL=https://cdn.yourdomain.com
```

## File Deletion Logic

When deleting files, BASE_URL is stripped to get local path:
```javascript
// Database URL:
"http://localhost:5000/uploads/products/product-123.jpg"

// Strip BASE_URL:
"/uploads/products/product-123.jpg"

// Join with server path:
"server/uploads/products/product-123.jpg"

// Delete file
fs.unlinkSync(filePath)
```

## Fallback
If BASE_URL is not set in .env, defaults to:
```javascript
const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
```

## Testing

### 1. Create Product:
```bash
curl -X POST "http://localhost:5000/api/products" \
  -H "Authorization: Bearer TOKEN" \
  -F "name=Test Product" \
  -F "price=500" \
  -F "categoryId=CATEGORY_ID" \
  -F "mainImage=@image.jpg"
```

**Response:**
```json
{
  "mainImage": {
    "url": "http://localhost:5000/uploads/products/product-1737369600-123456789.jpg"
  }
}
```

### 2. Access File:
```
http://localhost:5000/uploads/products/product-1737369600-123456789.jpg
```

### 3. Frontend Usage:
```javascript
// No concatenation needed
<img src={product.mainImage.url} alt={product.name} />
```

## Production Deployment

### Update .env for production:
```env
BASE_URL=https://api.yourdomain.com
```

### Ensure static files are served:
```javascript
// server.js
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

### Or use reverse proxy (Nginx):
```nginx
location /uploads/ {
    alias /path/to/server/uploads/;
}
```

## Summary

✅ All file URLs now include BASE_URL  
✅ Database stores complete URLs  
✅ Frontend can use URLs directly  
✅ Easy environment switching  
✅ CDN ready  
✅ File deletion works correctly  
✅ Fallback to localhost if BASE_URL not set  

**Your uploads system is now production-ready with flexible URL management!** 🚀
