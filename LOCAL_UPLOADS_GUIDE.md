# Local Uploads Configuration

## Overview
Cloudinary has been **completely disabled** and replaced with **local file storage** for all media uploads (products, sliders, videos).

## Changes Made

### 1. Cloudinary Code Commented Out
- All Cloudinary imports and configurations are commented in `config/cloudinary.js`
- Cloudinary API calls are commented in all controllers

### 2. Local Storage Setup
- **Products**: `server/uploads/products/`
- **Sliders**: `server/uploads/sliders/`
- **Videos**: `server/uploads/videos/`

### 3. File Access
Files are served statically via Express:
```
http://localhost:5000/uploads/products/product-123456789.jpg
http://localhost:5000/uploads/sliders/slider-123456789.png
http://localhost:5000/uploads/videos/video-123456789.mp4
```

### 4. Updated Controllers
- `productController.js` - Local product image storage
- `sliderController.js` - Local slider image storage
- `videoController.js` - Local video storage

### 5. File Deletion
Old files are automatically deleted when:
- Updating product/slider images
- Deleting products/sliders/videos

## File Structure
```
server/
├── uploads/
│   ├── products/
│   │   ├── product-1234567890-123456789.jpg
│   │   └── product-1234567890-987654321.png
│   ├── sliders/
│   │   └── slider-1234567890-123456789.jpg
│   └── videos/
│       └── video-1234567890-123456789.mp4
├── config/
│   └── cloudinary.js (Cloudinary code commented)
└── controllers/
    ├── productController.js (Updated for local storage)
    ├── sliderController.js (Updated for local storage)
    └── videoController.js (Updated for local storage)
```

## Important Notes

### Security
- Files are served with CORS enabled
- Helmet configured with `crossOriginResourcePolicy: "cross-origin"`
- File size limits enforced by multer

### Backup
- **uploads/** folder is added to `.gitignore`
- Make sure to backup this folder separately
- Consider using external backup solutions

### Production Deployment
For production, consider:
1. Using a CDN for better performance
2. Implementing image optimization
3. Setting up proper backup strategies
4. Using cloud storage (S3, DigitalOcean Spaces) if needed

## Re-enabling Cloudinary (If Needed)
To re-enable Cloudinary:
1. Uncomment Cloudinary code in `config/cloudinary.js`
2. Uncomment Cloudinary API calls in controllers
3. Comment out local file deletion code
4. Update file URLs to use Cloudinary paths

## Testing
Test file uploads:
```bash
# Product with image
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Test Product" \
  -F "price=500" \
  -F "categoryId=CATEGORY_ID" \
  -F "mainImage=@/path/to/image.jpg"

# Slider
curl -X POST http://localhost:5000/api/sliders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/slider.jpg"

# Video
curl -X POST http://localhost:5000/api/videos \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "video=@/path/to/video.mp4"
```

## File Limits
- **Product Images**: 10MB per image, max 10 gallery images
- **Slider Images**: 5MB per image
- **Videos**: 200MB per video

## Supported Formats
- **Images**: JPG, JPEG, PNG, WebP
- **Videos**: MP4, MOV, WebM, MKV
