/**
 * Product Configuration
 * 
 * Define your products here. Each product maps to a folder in public/product_gallery
 * 
 * Two structure options:
 * 
 * 1. DIRECT IMAGES (no color variants):
 *    {
 *      id: 'product-id',
 *      slug: 'product-id',
 *      title: 'Product Name',
 *      status: 'Unavailable',
 *    }
 *    Folder structure: public/product_gallery/product-id/image.png
 * 
 * 2. COLOR VARIANTS:
 *    {
 *      id: 'product-id',
 *      slug: 'product-id',
 *      title: 'Product Name',
 *      colors: [
 *        { id: 'color-1', name: 'Red', slug: 'color-1' },
 *        { id: 'color-2', name: 'Blue', slug: 'color-2' },
 *      ],
 *      status: 'Unavailable',
 *    }
 *    Folder structure: public/product_gallery/product-id/color-1/image.png, etc.
 */

export const products = [
  {
    id: 'product-1',
    slug: 'product-1',
    title: 'Product 1',
    status: 'Unavailable',
    // No colors array = direct images in folder
  },
  {
    id: 'product-2',
    slug: 'product-2',
    title: 'Product 2',
    status: 'Unavailable',
    colors: [
      { id: 'color-1', name: 'Color 1', slug: 'color-1' },
      { id: 'color-2', name: 'Color 2', slug: 'color-2' },
      { id: 'color-3', name: 'Color 3', slug: 'color-3' },
      { id: 'color-4', name: 'Color 4', slug: 'color-4' },
      { id: 'color-5', name: 'Color 5', slug: 'color-5' },
    ],
  },
];

/**
 * HOW TO ADD NEW PRODUCTS:
 * 
 * 1. Create a folder in public/product_gallery/ named: product-3, product-4, etc.
 * 2. Add the product entry here with the same folder name as the slug
 * 3. Choose one of two structures:
 * 
 *    A) Direct images (no variants):
 *       - Add images directly to public/product_gallery/product-3/
 *       - Don't include a 'colors' array in the config
 * 
 *    B) Color variants:
 *       - Create subfolders: color-1, color-2, etc.
 *       - Add images to each color folder
 *       - Define the colors array in the config
 * 
 * EXAMPLE - Adding a t-shirt with 3 colors:
 * 
 * {
 *   id: 'tshirt-01',
 *   slug: 'tshirt-01',
 *   title: 'Classic Tee',
 *   status: 'Unavailable',
 *   colors: [
 *     { id: 'color-1', name: 'Black', slug: 'color-1' },
 *     { id: 'color-2', name: 'White', slug: 'color-2' },
 *     { id: 'color-3', name: 'Cream', slug: 'color-3' },
 *   ],
 * }
 * 
 * Then create folder structure:
 * public/product_gallery/tshirt-01/
 *   color-1/
 *     image1.png
 *     image2.png
 *   color-2/
 *     image1.png
 *     image2.png
 *   color-3/
 *     image1.png
 *     image2.png
 */
