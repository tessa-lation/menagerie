/**
 * Reusable Image Gallery Component
 * Displays images in an asymmetrical, collage-like layout
 */

import './ImageGallery.css';

export default function ImageGallery({ images, title, description }) {
  if (!images || images.length === 0) {
    return (
      <div className="gallery-empty">
        <p>Loading artwork...</p>
      </div>
    );
  }

  return (
    <div className="image-gallery">
      {title && <h3 className="gallery-title">{title}</h3>}
      {description && <p className="gallery-description">{description}</p>}

      <div className="gallery-grid">
        {images.map((image, index) => (
          <figure
            key={image.id}
            className={`gallery-item gallery-item-${(index % 4) + 1}`}
          >
            <div className="gallery-image-wrapper">
              <img
                src={image.thumbUrl || image.url}
                alt={image.alt}
                loading="lazy"
              />
              <div className="gallery-overlay">
                <a
                  href={image.pexelsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gallery-link"
                >
                  View on Pexels
                </a>
                {image.photographer && (
                  <p className="gallery-credit">
                    Photo by {image.photographer}
                  </p>
                )}
              </div>
            </div>
          </figure>
        ))}
      </div>
    </div>
  );
}
