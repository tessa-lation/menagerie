import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchCollageImages, formatImageData } from '../services/pexelsAPI';
import useCursorRepulsion from '../hooks/useCursorRepulsion';
import './BackgroundScrollCollage.css';

gsap.registerPlugin(ScrollTrigger);

const FALLBACK_IMAGES = [
  {
    id: 'background-hero',
    url: '/src/assets/hero.png',
    thumbUrl: '/src/assets/hero.png',
    alt: 'Subtle background collage placeholder',
    photographer: 'The Menagerie',
    pexelsUrl: '#',
  },
];

const backgroundQueries = [
  'moody still life texture',
  'shadowed botanical silhouette',
  'museum sculpture detail',
  'torn paper collage texture',
  'fine art texture dark',
  'surreal abstract background',
];

const backgroundPieces = [
  { top: '12%', left: '5%', width: 190, rotate: -15, scale: 0.95, scrollSpeed: .1 + rand(6) * 0.3, layer: 0, shape: 'portrait' },
  { top: '22%', left: '66%', width: 210, rotate: 8, scale: 0.98, scrollSpeed: .1 + rand(6) * 0.3, layer: 1, shape: 'landscape' },
  { top: '48%', left: '18%', width: 135, rotate: 10, scale: 0.9, scrollSpeed: .1 + rand(6) * 0.3, layer: 2, shape: 'circle' },
  { top: '65%', left: '60%', width: 170, rotate: -10, scale: 0.93, scrollSpeed: .1 + rand(6) * 0.3, layer: 1, shape: 'portrait' },
  { top: '78%', left: '8%', width: 120, rotate: 16, scale: 0.9, scrollSpeed: .1 + rand(6) * 0.3, layer: 2, shape: 'ticket' },
  { top: '35%', left: '80%', width: 145, rotate: -12, scale: 0.96, scrollSpeed: .1 + rand(6) * 0.3, layer: 0, shape: 'circle' },
];

export default function BackgroundScrollCollage() {
  const [images, setImages] = useState(FALLBACK_IMAGES);
  const [reduceMotion, setReduceMotion] = useState(false);
  const pieceRefs = useRef([]);
  const triggers = useRef([]);
  // Store scroll offsets calculated by GSAP (will be combined with cursor repulsion)
  const scrollOffsetsRef = useRef({});

  useEffect(() => {
    let active = true;

    async function loadImages() {
      const rawImages = await fetchCollageImages(backgroundQueries, backgroundPieces.length);
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
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    function handleMotionChange() {
      setReduceMotion(motionQuery.matches);
    }

    handleMotionChange();
    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', handleMotionChange);
    } else {
      motionQuery.addListener(handleMotionChange);
    }

    return () => {
      if (motionQuery.removeEventListener) {
        motionQuery.removeEventListener('change', handleMotionChange);
      } else {
        motionQuery.removeListener(handleMotionChange);
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
    pieceRefs.current.forEach((ref) => {
      if (!ref) return;
      gsap.set(ref, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
      });
    });

    triggers.current.forEach((trigger) => trigger.kill());
    triggers.current = [];

    if (!reduceMotion) {
      const ctx = gsap.context(() => {
        pieces.forEach((piece, index) => {
          const ref = pieceRefs.current[index];
          if (!ref) return;

          gsap.set(ref, {
            rotation: piece.rotate,
            scale: piece.scale,
          });

          const trigger = ScrollTrigger.create({
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.8,
            onUpdate(self) {
              // Calculate the scroll offset and store it for combination with cursor repulsion
              const scrollYOffset = piece.scrollSpeed * window.innerHeight * self.progress;
              const pieceId = piece.id;
              scrollOffsetsRef.current[pieceId] = { x: 0, y: scrollYOffset };
            },
          });

          triggers.current.push(trigger);
        });
      });

      return () => {
        triggers.current.forEach((trigger) => trigger.kill());
        ctx.revert();
      };
    }

    return undefined;
  }, [pieces, reduceMotion]);

  // Create a mapping from ref index to piece ID for cursor repulsion
  const indexToPieceIdRef = useRef({});
  useEffect(() => {
    pieces.forEach((piece, index) => {
      indexToPieceIdRef.current[index] = piece.id;
    });
  }, [pieces]);

  // Apply cursor repulsion to background pieces
  // Combines GSAP scroll animation (Y) with repulsion effect (X/Y)
  useCursorRepulsion(pieceRefs.current, {
    repulsionRadius: 500, // Distance from cursor where repulsion activates (wider effect)
    repulsionStrength: 1.0, // Base strength of cursor velocity → repulsion conversion
    velocityMultiplier: 0.12, // Scales cursor speed to repulsion force (lower = slower, dreamier)
    springStrength: 0.02, // How strongly pieces pull back to base position (lower = slower return)
    damping: 0.94, // Velocity decay (higher = slower settling, smoother)
    cursorStillThreshold: 1.0, // Cursor speed below which repulsion stops
    getBaseOffset: (index) => {
      const pieceId = indexToPieceIdRef.current[index];
      return scrollOffsetsRef.current[pieceId] || { x: 0, y: 0 };
    },
  });

  return (
    <div className="background-scroll-collage" aria-hidden="true">
      {pieces.map((piece, index) => (
        <div
          key={piece.id}
          ref={(el) => (pieceRefs.current[index] = el)}
          className={`background-piece background-${piece.shape}`}
          style={{
            top: piece.top,
            left: piece.left,
            width: `${piece.width}px`,
            zIndex: piece.layer,
          }}
        >
          <img src={piece.image.thumbUrl || piece.image.url} alt={piece.image.alt || ''} loading="eager" />
        </div>
      ))}
    </div>
  );
}
