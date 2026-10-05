import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchCollageImages, formatImageData } from '../services/pexelsAPI';
import './SiteImageBackground.css';

gsap.registerPlugin(ScrollTrigger);

const FALLBACK_IMAGES = [
  {
    id: 'background-1',
    url: '/src/assets/hero.png',
    thumbUrl: '/src/assets/hero.png',
    alt: 'Subtle background collage image',
    photographer: 'The Menagerie',
    pexelsUrl: '#',
  },
];

const imageQueries = [
  'moody fine art texture',
  'vintage paper collage',
  'still life shadow detail',
  'studio paper cutout',
  'gallery wall abstract',
  'torn vellum texture',
];

const backgroundPieces = [
  { top: '8%', left: '4%', width: 220, rotate: -10, opacity: 0.92, scrollSpeed: 0.06, mouseStrength: 18, layer: 0 },
  { top: '18%', left: '68%', width: 210, rotate: 8, opacity: 0.83, scrollSpeed: -0.08, mouseStrength: 14, layer: 1 },
  { top: '34%', left: '20%', width: 150, rotate: 12, opacity: 0.88, scrollSpeed: 0.12, mouseStrength: 20, layer: 2 },
  { top: '54%', left: '60%', width: 180, rotate: -14, opacity: 0.76, scrollSpeed: -0.05, mouseStrength: 12, layer: 1 },
  { top: '64%', left: '9%', width: 130, rotate: 16, opacity: 0.9, scrollSpeed: 0.15, mouseStrength: 22, layer: 2 },
  { top: '72%', left: '76%', width: 170, rotate: -8, opacity: 0.82, scrollSpeed: -0.1, mouseStrength: 16, layer: 0 },
];

export default function SiteImageBackground() {
  const [images, setImages] = useState(FALLBACK_IMAGES);
  const [reduceMotion, setReduceMotion] = useState(false);
  const pieceRefs = useRef([]);
  const pointerX = useRef(0);
  const subscriptions = useRef([]);

  useEffect(() => {
    let active = true;

    async function loadImages() {
      const rawImages = await fetchCollageImages(imageQueries, backgroundPieces.length);
      const formatted = rawImages.map(formatImageData);

      if (active && formatted.length > 0) {
        setImages(formatted);
      }
    }

    loadImages();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    function handleReducedMotionChange() {
      setReduceMotion(mediaQuery.matches);
    }

    handleReducedMotionChange();
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleReducedMotionChange);
    } else {
      mediaQuery.addListener(handleReducedMotionChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleReducedMotionChange);
      } else {
        mediaQuery.removeListener(handleReducedMotionChange);
      }
    };
  }, []);

  const pieces = useMemo(
    () =>
      backgroundPieces.map((piece, index) => ({
        ...piece,
        image: images[index % images.length],
        id: `${piece.top}-${piece.left}-${index}`,
      })),
    [images],
  );

  useEffect(() => {
    if (reduceMotion) {
      pieceRefs.current.forEach((piece) => {
        if (!piece) return;
        gsap.set(piece, { x: 0, y: 0, rotation: 0, opacity: 1 });
      });
      return undefined;
    }

    const subscriptionsList = [];

    pieces.forEach((piece, index) => {
      const element = pieceRefs.current[index];
      if (!element) return;

      gsap.set(element, {
        x: 0,
        y: 0,
        rotation: piece.rotate,
        opacity: piece.opacity,
      });

      const trigger = ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
        onUpdate(self) {
          gsap.to(element, {
            y: piece.scrollSpeed * window.innerHeight * self.progress,
            ease: 'none',
            overwrite: true,
          });
        },
      });

      subscriptionsList.push(trigger);
    });

    function handlePointerMove(event) {
      pointerX.current = (event.clientX / window.innerWidth - 0.5) * 2;
      pieces.forEach((piece, index) => {
        const element = pieceRefs.current[index];
        if (!element) return;

        gsap.to(element, {
          x: pointerX.current * piece.mouseStrength,
          duration: 0.7,
          ease: 'power2.out',
          overwrite: true,
        });
      });
    }

    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      subscriptionsList.forEach((subscription) => subscription.kill());
      ScrollTrigger.getAll().forEach((instance) => instance.kill());
    };
  }, [pieces, reduceMotion]);

  return (
    <div className="site-image-background" aria-hidden="true">
      {pieces.map((piece, index) => (
        <div
          key={piece.id}
          className="background-piece"
          ref={(el) => (pieceRefs.current[index] = el)}
          style={{
            top: piece.top,
            left: piece.left,
            width: `${piece.width}px`,
            zIndex: piece.layer,
            opacity: piece.opacity,
          }}
        >
          <img src={piece.image.thumbUrl || piece.image.url} alt={piece.image.alt || ''} />
        </div>
      ))}
    </div>
  );
}
