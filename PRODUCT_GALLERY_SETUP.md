# Product Gallery Setup & Usage Guide

## What Was Implemented

✅ **New Section**: "Editions, Objects & Oddities"  
✅ **ProductCard Component**: Displays products with image carousel & color selector  
✅ **Automatic Image Loading**: Uses Vite's glob to load images from folders  
✅ **Flexible Product Structure**: Supports both direct images and color variants  
✅ **Responsive Design**: Works beautifully on desktop, tablet, and mobile  
✅ **Archive Aesthetic**: Clean, minimal, art-forward (not generic ecommerce)

---

## Project Files Created/Updated

### New Files:
- `src/config/productConfig.js` - Product definitions (where you add new products)
- `src/components/ProductCard.jsx` - Individual product card with carousel
- `src/components/ProductCard.css` - Product card styling
- `src/utils/productImageLoader.js` - Image loading utilities

### Updated Files:
- `src/components/Shop.jsx` - Now uses ProductCard, updated title
- `src/components/Shop.css` - Updated for products-grid layout

---

## How to Add Products

### Step 1: Create Product Folder
Create a folder in `public/product_gallery/` with the name you want to use:
```
public/product_gallery/
  product-1/          (existing)
  product-2/          (existing)
  product-3/          ← Create this
```

### Step 2: Add Images to Folder

**Option A: Direct Images (No Color Variants)**
```
public/product_gallery/product-3/
  image1.png
  image2.png
  image3.png
```

**Option B: Color Variants**
```
public/product_gallery/product-3/
  color-1/
    image1.png
    image2.png
  color-2/
    image1.png
    image2.png
```

### Step 3: Add Product Config
Edit `src/config/productConfig.js` and add your product:

```javascript
// For a product with direct images:
{
  id: 'product-3',
  slug: 'product-3',  // Must match folder name!
  title: 'My New Product',
  status: 'Unavailable',
}

// For a product with color variants:
{
  id: 'tshirt-black-white',
  slug: 'tshirt-black-white',  // Must match folder name!
  title: 'Classic T-Shirt',
  status: 'Unavailable',
  colors: [
    { id: 'color-1', name: 'Black', slug: 'color-1' },
    { id: 'color-2', name: 'White', slug: 'color-2' },
  ],
}
```

### Step 4: Restart Dev Server
```bash
npm run dev
```

The product will automatically appear in the "Editions, Objects & Oddities" section!

---

## Example: Adding a Limited Edition Print

### Folder Structure:
```
public/product_gallery/
  limited-print-01/
    front.png
    back.png
    detail.png
```

### Config Entry (in `src/config/productConfig.js`):
```javascript
{
  id: 'limited-print-01',
  slug: 'limited-print-01',
  title: 'Limited Edition Print #1',
  status: 'Unavailable',
}
```

---

## Example: Adding a T-Shirt with 4 Colors

### Folder Structure:
```
public/product_gallery/
  tshirt-01/
    color-1/
      front.png
      back.png
      detail.png
    color-2/
      front.png
      back.png
      detail.png
    color-3/
      front.png
      back.png
      detail.png
    color-4/
      front.png
      back.png
      detail.png
```

### Config Entry (in `src/config/productConfig.js`):
```javascript
{
  id: 'tshirt-01',
  slug: 'tshirt-01',
  title: 'Classic Tee',
  status: 'Unavailable',
  colors: [
    { id: 'color-1', name: 'Black', slug: 'color-1' },
    { id: 'color-2', name: 'White', slug: 'color-2' },
    { id: 'color-3', name: 'Cream', slug: 'color-3' },
    { id: 'color-4', name: 'Heather Gray', slug: 'color-4' },
  ],
}
```

---

## Product Card Features

✨ **Image Carousel**: Browse through product images with prev/next buttons  
✨ **Thumbnails**: Click thumbnails to jump to any image  
✨ **Color Selector**: Switch between color variants (if defined)  
✨ **Status Badge**: Shows "Unavailable" or custom status  
✨ **Inquire Link**: Directs to contact section  
✨ **Responsive**: Adapts to mobile, tablet, desktop  

---

## Image Format & Best Practices

**Supported Formats**:  
- PNG (recommended for quality)
- JPG/JPEG
- WebP (modern, smaller files)

**Best Practices**:
- Keep images square or 3:4 aspect ratio (portrait)
- Use consistent aspect ratio across all product images
- Optimize file size (compress before uploading)
- Name files clearly (image1.png, image2.png, etc.)
- Gallery aspect ratio is 3:4 (portrait), adjust images accordingly

---

## Styling & Customization

The product cards automatically inherit site colors:
- Text colors: `var(--text-primary)`, `var(--text-secondary)`
- Background: Transparent with subtle borders
- Hover effects: Subtle border/opacity changes

To customize colors or spacing, edit `src/components/ProductCard.css`

---

## Status Labels

You can customize the status for each product:

```javascript
status: 'Unavailable'
status: 'Sold Out'
status: 'Coming Soon'
status: 'Custom Status'
```

---

## Image Loading

Images are loaded using Vite's `import.meta.glob()`, which:
- Loads all images at build time
- Automatically includes images when you restart the dev server
- Works across all browsers (no API needed)
- Optimizes images for web

**Important**: Restart your dev server after adding new images/products!

---

## Troubleshooting

**Products not showing?**
- Check `slug` in config matches folder name exactly
- Restart dev server: `npm run dev`
- Check browser console for errors

**Images not loading?**
- Verify image files are in the correct folder
- Check supported image formats (PNG, JPG, WebP)
- Restart dev server
- Clear browser cache (Cmd+Shift+R or Ctrl+Shift+R)

**Color selector not appearing?**
- Add `colors` array to product config
- Verify color folder slugs match config slugs exactly

---

## Future Enhancements (Optional)

If you want to add more features later:
- **Descriptions**: Add a `description` field to products
- **Price**: Add a `price` field (currently hidden by design)
- **Availability**: Add inventory tracking
- **Categories**: Filter products by type (prints, merch, sculptures, etc.)
- **Additional Details**: Add size, material, edition info as fields

Just update the config and ProductCard component to use these fields!
