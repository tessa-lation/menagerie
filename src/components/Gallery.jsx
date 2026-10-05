/**
 * Art Gallery Section
 * Replaced the previous stock image grid with a local gallery carousel
 */

import GalleryCarousel from './GalleryCarousel';
import './Gallery.css';

export default function Gallery() {
  return (
    <section id="conservatory" className="gallery">
      <div className="container">
        <h2>THE CONSERVATORY</h2>
        <p className="section-subtitle">
          A selection from the personal gallery — surreal, tactile, and strange
        </p>

        <GalleryCarousel />
      </div>
    </section>
  );
}
