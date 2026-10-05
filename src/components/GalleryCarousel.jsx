import { useEffect, useRef, useState } from 'react';
import './GalleryCarousel.css';

const IMAGES = [
  '/gallery/photo-01.png',
  '/gallery/photo-02.png',
  '/gallery/photo-03.png',
  '/gallery/photo-04.png',
  '/gallery/photo-05.png',
];

export default function GalleryCarousel({ autoplay = true, interval = 4500 }) {
  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState(false);
  const timerRef = useRef(null);

  const prev = () => setIndex((i) => (i - 1 + IMAGES.length) % IMAGES.length);
  const next = () => setIndex((i) => (i + 1) % IMAGES.length);
  const goTo = (i) => setIndex(i % IMAGES.length);

  useEffect(() => {
    if (!autoplay) return;
    if (hover) return;

    timerRef.current = setInterval(() => setIndex((i) => (i + 1) % IMAGES.length), interval);
    return () => clearInterval(timerRef.current);
  }, [autoplay, interval, hover]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div
      className="gallery-carousel"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <div className="carousel-window">
        {IMAGES.map((src, i) => (
          <div
            key={src}
            className={`carousel-slide ${i === index ? 'active' : ''}`}
            style={{ backgroundImage: `url(${src})` }}
            aria-hidden={i !== index}
          >
            <img src={src} alt={`Gallery image ${i + 1}`} loading="lazy" />
          </div>
        ))}

        <button className="carousel-control prev" onClick={prev} aria-label="Previous slide">
          ‹
        </button>
        <button className="carousel-control next" onClick={next} aria-label="Next slide">
          ›
        </button>
      </div>

      <div className="carousel-dots" role="tablist" aria-label="Gallery slides">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === index ? 'active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-selected={i === index}
          />
        ))}
      </div>
    </div>
  );
}
