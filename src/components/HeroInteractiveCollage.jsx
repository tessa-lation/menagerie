import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { fetchCollageImages, formatImageData } from '../services/pexelsAPI';
import './HeroInteractiveCollage.css';

gsap.registerPlugin(Draggable);

const FALLBACK_IMAGES = [
  {
    id: 'local-hero-1',
    url: '/src/assets/hero.png',
    thumbUrl: '/src/assets/hero.png',
    alt: 'Surreal collage placeholder',
    photographer: 'The Menagerie',
    pexelsUrl: '#',
  },
];

const heroQueries = [
  'surreal portrait collage cutout',
  'fine art still life dark',
  'textured paper and shadow',
  'vintage sculpture detail',
  'antique botanical study',
  'gallery wall fragment',
];

const heroPieces = [
  { top: '8%', left: '6%', width: 220, rotate: -8, scale: 0.98, layer: 2, shape: 'portrait' },
  { top: '18%', left: '58%', width: 240, rotate: 6, scale: 1.02, layer: 2, shape: 'landscape' },
  { top: '42%', left: '12%', width: 160, rotate: 12, scale: 0.92, layer: 2, shape: 'ticket' },
  { top: '52%', left: '70%', width: 180, rotate: -12, scale: 1.0, layer: 2, shape: 'portrait' },
  { top: '68%', left: '32%', width: 260, rotate: 0, scale: 1.04, layer: 2, shape: 'wide' },
];

export default function HeroInteractiveCollage() {
  const [images, setImages] = useState(FALLBACK_IMAGES);
  const [reduceMotion, setReduceMotion] = useState(false);
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const draggables = useRef([]);

  useEffect(() => {
    let active = true;

    async function loadImages() {
      const rawImages = await fetchCollageImages(heroQueries, heroPieces.length);
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
      heroPieces.map((piece, index) => ({
        ...piece,
        image: images[index % images.length],
        id: `${piece.top}-${piece.left}-${index}`,
      })),
    [images],
  );

  useEffect(() => {
    if (!containerRef.current) return;

    draggables.current.forEach((instance) => instance?.kill());
    draggables.current = [];

    const ctx = gsap.context(() => {
      pieces.forEach((piece, index) => {
        const card = cardRefs.current[index];
        if (!card) return;

        gsap.set(card, {
          x: 0,
          y: 0,
          rotation: piece.rotate,
          scale: piece.scale,
          zIndex: 2,
          transformOrigin: 'center center',
        });

        if (!reduceMotion) {
          gsap.to(card, {
            y: '+=5',
            x: '+=4',
            duration: 8 + index,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        }

        const draggable = Draggable.create(card, {
          type: 'x,y',
          edgeResistance: 0.8,
          inertia: !reduceMotion,
          bounds: containerRef.current,
          allowContextMenu: true,
          onPress() {
            gsap.to(this.target, {
              scale: piece.scale * 1.08,
              duration: 0.24,
              ease: 'power3.out',
            });
            this.target.style.zIndex = 12;
          },
          onDrag() {
            gsap.to(this.target, {
              rotation: piece.rotate + this.deltaY * 0.02 + this.deltaX * 0.01,
              duration: 0.14,
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
            this.target.style.zIndex = 12;
          },
        })[0];

        draggables.current.push(draggable);
      });
    }, containerRef);

    return () => {
      draggables.current.forEach((instance) => instance?.kill());
      ctx.revert();
    };
  }, [pieces, reduceMotion]);

  return (
    <div className="hero-interactive-collage" ref={containerRef}>
      {pieces.map((piece, index) => (
        <div
          key={piece.id}
          className={`hero-piece hero-${piece.shape}`}
          style={{
            top: piece.top,
            left: piece.left,
            width: `${piece.width}px`,
            zIndex: 2,
          }}
        >
          <figure
            ref={(el) => (cardRefs.current[index] = el)}
            className="hero-piece-card"
          >
            <img src={piece.image.thumbUrl || piece.image.url} alt={piece.image.alt || ''} loading="eager" />
          </figure>
        </div>
      ))}
    </div>
  );
}
