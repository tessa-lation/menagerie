/**
 * Product Card Component
 * Displays a single product with image carousel and optional color selector
 */

import { useState, useEffect } from 'react';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const [selectedColor, setSelectedColor] = useState(
    product.colors ? product.colors[0] : null
  );
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load images for this product/color
  useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true);
      
      try {
        // Build the folder path
        const colorSlug = selectedColor?.slug;
        const folderPath = colorSlug
          ? `product_gallery/${product.slug}/${colorSlug}`
          : `product_gallery/${product.slug}`;

        // Use dynamic import with glob pattern
        // This is evaluated at build time by Vite
        const imageModules = import.meta.glob('/public/product_gallery/**/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP}', {
          eager: true,
          query: '?url',
          import: 'default',
        });

        // Filter images for this product/color
        const productImages = Object.entries(imageModules)
          .filter(([path]) => path.includes(`/${folderPath}/`))
          .map(([, url]) => url)
          .sort();

        setImages(productImages);
        setCurrentImageIndex(0);
      } catch (error) {
        console.error(`Failed to load images for ${product.slug}:`, error);
        setImages([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, [product, selectedColor]);

  const handleNextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const handlePrevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const currentImage = images[currentImageIndex];

  return (
    <article className="product-card">
      {/* Image Gallery */}
      <div className="product-gallery">
        <div className="gallery-main">
          {isLoading ? (
            <div className="gallery-loading">
              <p>Loading images...</p>
            </div>
          ) : images.length > 0 ? (
            <>
              <img
                src={currentImage}
                alt={`${product.title} - Image ${currentImageIndex + 1}`}
                className="gallery-image"
              />
              {images.length > 1 && (
                <div className="gallery-controls">
                  <button
                    className="gallery-btn gallery-prev"
                    onClick={handlePrevImage}
                    aria-label="Previous image"
                  >
                    ←
                  </button>
                  <button
                    className="gallery-btn gallery-next"
                    onClick={handleNextImage}
                    aria-label="Next image"
                  >
                    →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="gallery-empty">
              <p>No images available</p>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="gallery-thumbnails">
            {images.map((img, index) => (
              <button
                key={index}
                className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => handleThumbnailClick(index)}
                aria-label={`Image ${index + 1}`}
              >
                <img src={img} alt={`Thumbnail ${index + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>

        {/* Color Selector */}
        {product.colors && product.colors.length > 0 && (
          <div className="color-selector">
            <label className="color-label">Color:</label>
            <div className="color-buttons">
              {product.colors.map((color) => (
                <button
                  key={color.id}
                  className={`color-btn ${selectedColor?.id === color.id ? 'active' : ''}`}
                  onClick={() => setSelectedColor(color)}
                  title={color.name}
                >
                  {color.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Status */}
        <div className="product-status">
          <span className="status-badge">{product.status || 'Unavailable'}</span>
        </div>

        {/* Inquiry Link */}
        <a href="#guest-book" className="product-inquire">
          Inquire
        </a>
      </div>
    </article>
  );
}
