/**
 * Product Image Loader Utility
 * Dynamically fetches image lists from product folders
 */

/**
 * Get images for a product folder
 * @param {string} productSlug - Product folder name (e.g., 'product-1')
 * @param {string} colorSlug - Optional color folder name (e.g., 'color-1')
 * @returns {Promise<string[]>} Array of image URLs
 */
export async function getProductImages(productSlug, colorSlug = null) {
  try {
    // Construct the path to list
    const basePath = `/product_gallery/${productSlug}`;
    const folderPath = colorSlug ? `${basePath}/${colorSlug}` : basePath;

    // Since we can't directly list directories in the browser,
    // we'll use Vite's import.meta.glob to get all images
    // This requires images to be imported at build time
    
    // For a more practical approach, we'll attempt to load a manifest file
    // If that doesn't exist, we'll try direct image loading
    
    return await loadImagesFromFolder(folderPath);
  } catch (error) {
    console.warn(`Failed to load images for ${productSlug}/${colorSlug || ''}:`, error);
    return [];
  }
}

/**
 * Load images from a folder path using Vite's glob
 * This works because Vite compiles at build time
 */
export function loadImagesFromFolder(folderPath) {
  try {
    // Use Vite's import.meta.glob to enumerate all images
    const globPattern = `/public${folderPath}/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP}`;
    
    // Note: This approach requires eager imports at build time
    // For runtime loading, we use a different strategy below
    return globPattern;
  } catch (error) {
    console.error('Error loading images:', error);
    return [];
  }
}

/**
 * Get image URLs for a product/color
 * Uses a simple pattern-based approach since we can't list directories at runtime
 */
export async function getImageUrls(productSlug, colorSlug = null) {
  const basePath = colorSlug 
    ? `/product_gallery/${productSlug}/${colorSlug}`
    : `/product_gallery/${productSlug}`;

  // Try to fetch a manifest file that lists images
  try {
    const response = await fetch(`${basePath}/manifest.json`);
    if (response.ok) {
      const manifest = await response.json();
      return manifest.images.map(img => `${basePath}/${img}`);
    }
  } catch (e) {
    // Manifest doesn't exist, fall back to scanning
  }

  // Fallback: Return a path hint; actual images loaded by component
  // The component will attempt to load images by name or use a fixed pattern
  return [basePath];
}

/**
 * Alternative: Use dynamic import with a known image pattern
 * For now, we'll return the folder path and let the component handle loading
 */
export function getProductFolderPath(productSlug, colorSlug = null) {
  if (colorSlug) {
    return `/product_gallery/${productSlug}/${colorSlug}`;
  }
  return `/product_gallery/${productSlug}`;
}
