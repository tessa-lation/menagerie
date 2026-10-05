import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { fetchCollageImages, formatImageData } from '../services/pexelsAPI';
import './LivingCollage.css';

// Register the GSAP plugins we need for scroll-based motion and draggable interaction.
gsap.registerPlugin(ScrollTrigger, Draggable);

const FALLBACK_IMAGES = [
  {
    id: 'local-hero',
    url: '/src/assets/hero.png',
    thumbUrl: '/src/assets/hero.png',
    alt: 'Surreal collage placeholder',
    photographer: 'The Menagerie',
    pexelsUrl: '#',
  },
];

const collageQueries = [
  'classical sculpture museum shadow',
  'botanical dark floral still life',
  'antique fabric texture velvet',
  'surreal architecture shadow',
  'gold ornate frame museum',
  'marble statue detail',
];

// Base collage layout: position, default rotation, scale, scroll depth, and layering.
// Use this array to customize the collage structure and visual hierarchy.
const pieceLayout = [
  { top: '9%', left: '7%', width: 210, rotate: -7, scale: 0.98, scrollSpeed: 0.08, layer: 4, shape: 'portrait' },
  { top: '18%', left: '67%', width: 250, rotate: 5, scale: 1.03, scrollSpeed: -0.06, layer: 1, shape: 'landscape' },
  { top: '43%', left: '13%', width: 150, rotate: 12, scale: 0.92, scrollSpeed: 0.14, layer: 5, shape: 'circle' },
  { top: '51%', left: '74%', width: 180, rotate: -13, scale: 1.01, scrollSpeed: 0.1, layer: 3, shape: 'portrait' },
  { top: '64%', left: '35%', width: 270, rotate: 2, scale: 1.05, scrollSpeed: -0.08, layer: 0, shape: 'wide' },
  { top: '73%', left: '6%', width: 130, rotate: -3, scale: 0.95, scrollSpeed: 0.16, layer: 2, shape: 'ticket' },
  { top: '7%', left: '42%', width: 120, rotate: 18, scale: 0.89, scrollSpeed: 0.2, layer: 6, shape: 'circle' },
  { top: '77%', left: '81%', width: 145, rotate: 9, scale: 1.02, scrollSpeed: -0.09, layer: 1, shape: 'ticket' },
  { top: '35%', left: '47%', width: 170, rotate: -18, scale: 1.0, scrollSpeed: 0.12, layer: 3, shape: 'portrait' },
  { top: '28%', left: '2%', width: 110, rotate: 28, scale: 0.94, scrollSpeed: -0.14, layer: 0, shape: 'ticket' },
  { top: '12%', left: '83%', width: 105, rotate: -22, scale: 0.9, scrollSpeed: 0.15, layer: 5, shape: 'circle' },
  { top: '58%', left: '58%', width: 130, rotate: 17, scale: 0.97, scrollSpeed: 0.11, layer: 2, shape: 'ticket' },
];

export default function LivingCollage() {
  const [images, setImages] = useState(FALLBACK_IMAGES);
  const [reduceMotion, setReduceMotion] = useState(false);
  const containerRef = useRef(null);
  const outerRefs = useRef([]);
  const innerRefs = useRef([]);
  const draggables = useRef([]);
  const scrollTriggers = useRef([]);

  // Load the collage imagery from Pexels and preserve the existing fetch flow.
  useEffect(() => {
    let active = true;

    async function loadImages() {
      const rawImages = await fetchCollageImages(collageQueries, 12);
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

  // Watch the user's reduced-motion preference and soften motion when requested.
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

  // Compose the layout with loaded image data.
  // This is where original position, rotation and image source are combined.
  const collagePieces = useMemo(
    () =>
      pieceLayout.map((layout, index) => ({
        ...layout,
        image: images[index % images.length],
        id: `${layout.top}-${layout.left}-${index}`,
      })),
    [images],
  );

  // Core GSAP animation effect: scroll parallax and draggable behavior.
  useEffect(() => {
    if (!containerRef.current) return;

    draggables.current.forEach((instance) => instance?.kill());
    scrollTriggers.current.forEach((trigger) => trigger?.kill());
    draggables.current = [];
    scrollTriggers.current = [];

    // Use gsap.context to ensure all animations are scoped to this component.
    const ctx = gsap.context(() => {
      collagePieces.forEach((piece, index) => {
        const outer = outerRefs.current[index];
        const inner = innerRefs.current[index];
        if (!outer || !inner) return;

        // The outer wrapper handles scroll-based parallax motion.
        // The inner draggable element handles pointer drag motion.
        // Together they combine original layout + scroll offset + drag offset.
        gsap.set(outer, {
          y: 0,
        });

        gsap.set(inner, {
          x: 0,
          y: 0,
          rotation: piece.rotate,
          scale: piece.scale,
          transformOrigin: 'center center',
        });

        if (!reduceMotion) {
          // ScrollTrigger creates the layered parallax effect.
          // Each outer wrapper moves at a different rate based on scrollSpeed.
          const trigger = gsap.to(outer, {
            y: piece.scrollSpeed * 180,
            ease: 'none',
            scrollTrigger: {
              trigger: document.body,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.75,
              invalidateOnRefresh: true,
            },
          });
          scrollTriggers.current.push(trigger.scrollTrigger);
        }

        // Draggable controls the tactile drag behavior on the inner collage piece.
        // Drag motion updates x/y without disturbing the outer scroll parallax wrapper.
        const draggable = Draggable.create(inner, {
          type: 'x,y',
          edgeResistance: 0.85,
          inertia: !reduceMotion,
          bounds: containerRef.current,
          allowContextMenu: true,
          onPress() {
            gsap.to(this.target, {
              scale: piece.scale * 1.05,
              duration: 0.24,
              ease: 'power3.out',
            });
            this.target.style.zIndex = 100;
          },
          onDrag() {
            const wobble = this.x * 0.01 + this.y * 0.005;
            gsap.to(this.target, {
              rotation: piece.rotate + wobble,
              duration: 0.15,
              ease: 'power1.out',
            });
          },
          onRelease() {
            gsap.to(this.target, {
              scale: piece.scale,
              rotation: piece.rotate + (Math.random() * 4 - 2),
              duration: 0.45,
              ease: 'power3.out',
            });
            this.target.style.zIndex = 10 + piece.layer;
          },
        })[0];

        draggables.current.push(draggable);
      });
    }, containerRef);

    return () => {
      draggables.current.forEach((instance) => instance?.kill());
      scrollTriggers.current.forEach((trigger) => trigger?.kill());
      ctx.revert();
    };
  }, [collagePieces, reduceMotion]);

  return (
    <div className="living-collage" ref={containerRef} aria-hidden="true">
      <div className="collage-wash" />
      <div className="collage-title-fragment">archive in motion</div>

      {collagePieces.map((piece, index) => (
        <div
          key={piece.id}
          ref={(el) => (outerRefs.current[index] = el)}
          className={`collage-piece-wrap collage-${piece.shape}`}
          style={{
            top: piece.top,
            left: piece.left,
            width: `${piece.width}px`,
            zIndex: 10 + piece.layer,
          }}
        >
          <figure
            ref={(el) => (innerRefs.current[index] = el)}
            className="collage-piece"
            style={{ cursor: reduceMotion ? 'default' : 'grab' }}
          >
            <img src={piece.image.thumbUrl || piece.image.url} alt={piece.image.alt || ''} loading="eager" />
          </figure>
        </div>
      ))}
    </div>
  );
}
