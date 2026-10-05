import { useEffect, useRef, useState } from 'react';
import './FallingImageBackground.css';

// Dynamically import all cutout/background images (built into the bundle)
const imageModules = import.meta.glob(
  '/src/assets/falling_gallery/*.{png,jpg,jpeg,webp}',
  { eager: true, query: '?url', import: 'default' }
);

const imagePathArray = Object.values(imageModules).sort();

function getDocumentHeight() {
  const body = document.body;
  const html = document.documentElement;

  return Math.max(
    body?.scrollHeight || 0,
    body?.offsetHeight || 0,
    html?.clientHeight || 0,
    html?.scrollHeight || 0,
    html?.offsetHeight || 0,
    window.innerHeight || 0
  );
}

// Parallax configuration presets
// Choose one preset below to preview different feels: 'subtle', 'dramatic', 'premium'.
const PRESET = 'subtle'; // change to 'subtle' or 'premium' to preview other presets

const PRESETS = {
  subtle: {
    farMovement: 12,
    midMovement: 36,
    nearMovement: 72,
    foregroundMovement: 96,
    scrollDepthMultiplier: 0.7,
    mouseDepthMultiplier: 0.8,
    smoothing: 0.06,
    farOpacity: 0.75,
    midOpacity: 0.88,
    nearOpacity: 0.95,
    fgOpacity: 0.98,
    minImageSize: 90,
    maxImageSize: 220,
    imageCount: 40,
    repeatPerImage: 4,
    depthWeights: [0.2, 0.5, 0.25, 0.05],
  },
  dramatic: {
    farMovement: 80,
    midMovement: 180,
    nearMovement: 320,
    foregroundMovement: 420,
    scrollDepthMultiplier: 1.5,
    mouseDepthMultiplier: 2.5,
    smoothing: 0.08,
    farOpacity: 0.8,
    midOpacity: 0.9,
    nearOpacity: 0.95,
    fgOpacity: 0.98,
    minImageSize: 90,
    maxImageSize: 260,
    imageCount: 64,
    repeatPerImage: 4,
    depthWeights: [0.12, 0.46, 0.37, 0.05],
  },
  premium: {
    farMovement: 8,
    midMovement: 18,
    nearMovement: 36,
    foregroundMovement: 48,
    scrollDepthMultiplier: 0.6,
    mouseDepthMultiplier: 0.9,
    smoothing: 0.06,
    farOpacity: 0.78,
    midOpacity: 0.88,
    nearOpacity: 0.95,
    fgOpacity: 0.98,
    minImageSize: 100,
    maxImageSize: 240,
    imageCount: 48,
    repeatPerImage: 4,
    depthWeights: [0.18, 0.5, 0.27, 0.05],
  },
};

const PARALLAX_CONFIG = PRESETS[PRESET] || PRESETS.dramatic;

// Build LAYERS array from config so the rest of the code reads these values.
const LAYERS = [
  { name: 'far', baseMove: PARALLAX_CONFIG.farMovement, scale: 0.92, opacity: PARALLAX_CONFIG.farOpacity, z: 0 },
  { name: 'mid', baseMove: PARALLAX_CONFIG.midMovement, scale: 1.0, opacity: PARALLAX_CONFIG.midOpacity, z: 1 },
  { name: 'near', baseMove: PARALLAX_CONFIG.nearMovement, scale: 1.06, opacity: PARALLAX_CONFIG.nearOpacity, z: 2 },
  { name: 'fg', baseMove: PARALLAX_CONFIG.foregroundMovement, scale: 1.12, opacity: PARALLAX_CONFIG.fgOpacity, z: 3 },
];

const MIN_WIDTH = PARALLAX_CONFIG.minImageSize; // px
const MAX_WIDTH = PARALLAX_CONFIG.maxImageSize; // px
const EASING = PARALLAX_CONFIG.smoothing; // interpolation factor

export default function FallingImageBackground() {
  const containerRef = useRef(null);
  const layerRefs = useRef({});
  const pieceRefs = useRef({});
  const layersState = useRef([]); // each layer: {pieces: [...], offsetX, offsetY}
  const mouse = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const documentHeightRef = useRef(getDocumentHeight());
  const [ready, setReady] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    function onChange() {
      setReduceMotion(mq.matches);
    }
    onChange();
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  useEffect(() => {
    const updateDocumentHeight = () => {
      documentHeightRef.current = getDocumentHeight();
    };

    updateDocumentHeight();

    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updateDocumentHeight();
      });

      const targets = [document.querySelector('.app-foreground'), document.body, document.documentElement].filter(Boolean);
      targets.forEach((target) => resizeObserver.observe(target));
    }

    window.addEventListener('resize', updateDocumentHeight);
    window.addEventListener('load', updateDocumentHeight);

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', updateDocumentHeight);
      window.removeEventListener('load', updateDocumentHeight);
    };
  }, []);

  // Initialize layers and pieces distributed across full document height
  useEffect(() => {
    documentHeightRef.current = getDocumentHeight();

    // Expand each source image repeatPerImage times and spread duplicates across buckets
    const REPEAT = PARALLAX_CONFIG.repeatPerImage || 4; // use each image N times
    // Create buckets and distribute image copies so duplicates are separated
    const buckets = Array.from({ length: REPEAT }, () => []);
    // Push each source image into each bucket (one copy per bucket) so we end up with REPEAT copies
    imagePathArray.forEach((src) => {
      for (let r = 0; r < REPEAT; r++) {
        buckets[r].push(src);
      }
    });
    // Shuffle each bucket to randomize order
    function shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    buckets.forEach(shuffle);
    // Interleave buckets so duplicates are not adjacent
    const expanded = [];
    let more = true;
    while (more) {
      more = false;
      for (let b = 0; b < buckets.length; b++) {
        if (buckets[b].length) {
          expanded.push(buckets[b].shift());
          more = true;
        }
      }
    }

    const totalCount = expanded.length;
    // Distribute vertically by bands to avoid clustering duplicates vertically
    const bandCount = Math.max(8, Math.ceil(totalCount / 6));
    const safeMin = 0.01;
    const safeMax = 0.99;
    const bandSpan = safeMax - safeMin;
    const bandStep = bandSpan / bandCount;

    const pieces = expanded.map((src, i) => {
      const r = Math.random();
      const width = Math.round(MIN_WIDTH + r * (MAX_WIDTH - MIN_WIDTH));
      const xPct = Math.random() * 100;
      const bandIndex = i % bandCount;
      const bandStart = safeMin + bandIndex * bandStep;
      const bandJitter = Math.random() * bandStep * 0.9;
      const baseYRatio = Math.min(safeMax, Math.max(safeMin, bandStart + bandJitter));
      const rotation = -18 + Math.random() * 36;
      return { id: `p-${i}`, src, baseX: xPct, baseYRatio, width, rotation };
    });

    // Debug: log counts so you can verify duplication in console
    try {
      // eslint-disable-next-line no-console
      console.log('Diorama: source images', imagePathArray.length, 'expanded copies', totalCount, 'bandCount', bandCount);
    } catch (e) {}

    // Distribute pieces into layers, prioritizing mid/near density
    const groups = LAYERS.map(() => ({ pieces: [], offsetX: 0, offsetY: 0, targetX: 0, targetY: 0 }));

    pieces.forEach((p, idx) => {
      // distribution based on PARALLAX_CONFIG.depthWeights (relative probabilities)
      const weights = PARALLAX_CONFIG.depthWeights || [0.15, 0.45, 0.35, 0.05];
      const r2 = Math.random();
      let acc = 0;
      let layerIndex = 1; // default mid
      for (let j = 0; j < weights.length; j++) {
        acc += weights[j];
        if (r2 <= acc) {
          layerIndex = j;
          break;
        }
      }
      groups[layerIndex].pieces.push(p);
    });

    layersState.current = groups;
    setReady(true);
  }, []);

  // Mouse position relative to center
  useEffect(() => {
    function move(e) {
      mouse.current.x = e.clientX - window.innerWidth / 2;
      mouse.current.y = e.clientY - window.innerHeight / 2;
    }
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, []);

  // rAF loop for parallax interpolation and positioning
  useEffect(() => {
    if (!ready) return;

    let last = performance.now();

    function frame(now) {
      const dt = Math.min(40, now - last);
      last = now;
      const scrollY = window.scrollY || window.pageYOffset || 0;

      // compute normalized mouse (-1..1)
      const rx = (mouse.current.x || 0) / (window.innerWidth / 2);
      const ry = (mouse.current.y || 0) / (window.innerHeight / 2);

      // document height for scroll-based parallax
      const docH = documentHeightRef.current || getDocumentHeight();
      const scrollRange = Math.max(1, docH - window.innerHeight);
      const scrollNorm = (scrollY / scrollRange) - 0.5; // -0.5 .. 0.5

      LAYERS.forEach((layerConfig, li) => {
        const layer = layersState.current[li];
        if (!layer) return;

        // Base movement for this layer (from config)
        const baseMove = layerConfig.baseMove || 0;

        // Mouse-driven offset (center-relative)
        const mouseOffsetX = baseMove * rx * PARALLAX_CONFIG.mouseDepthMultiplier;
        const mouseOffsetY = baseMove * ry * PARALLAX_CONFIG.mouseDepthMultiplier * 0.6; // reduce vertical effect

        // Scroll-driven offset (page vertical parallax)
        const scrollOffsetY = scrollNorm * baseMove * PARALLAX_CONFIG.scrollDepthMultiplier;

        // Combined target for this layer
        const targetX = mouseOffsetX;
        const targetY = mouseOffsetY + scrollOffsetY;

        // interpolate layer offsets toward combined target
        layer.offsetX = (layer.offsetX || 0) + (targetX - (layer.offsetX || 0)) * EASING;
        layer.offsetY = (layer.offsetY || 0) + (targetY - (layer.offsetY || 0)) * EASING;

        // apply transform to layer container
        const layerEl = layerRefs.current[`layer-${li}`];
        if (layerEl) {
          layerEl.style.transform = `translate3d(${layer.offsetX}px, ${layer.offsetY}px, 0) scale(${layerConfig.scale})`;
          layerEl.style.opacity = String(layerConfig.opacity);
          layerEl.style.zIndex = String(-10 + layerConfig.z);
        }

        // position pieces inside layer (account for scroll)
        layer.pieces.forEach((p) => {
          const el = pieceRefs.current[p.id];
          if (!el) return;
          const documentY = p.baseYRatio * docH;
          const viewportY = documentY - scrollY;
          el.style.left = `${p.baseX}%`;
          el.style.top = `${Math.round(viewportY)}px`;
          el.style.width = `${p.width}px`;
          el.style.transform = `translate3d(0,0,0) rotate(${p.rotation}deg)`;
          el.style.pointerEvents = 'none';
        });
      });

      if (!reduceMotion) rafRef.current = requestAnimationFrame(frame);
    }

    if (reduceMotion) {
      // position statically
      layersState.current.forEach((layerConfig, li) => {
        const layer = layersState.current[li];
        const layerEl = layerRefs.current[`layer-${li}`];
        if (layerEl) {
          layerEl.style.transform = `translate3d(0,0,0) scale(${layerConfig.scale})`;
          layerEl.style.opacity = String(layerConfig.opacity);
        }
        layer.pieces.forEach((p) => {
          const el = pieceRefs.current[p.id];
          if (!el) return;
          const documentY = p.baseYRatio * (documentHeightRef.current || getDocumentHeight());
          const viewportY = documentY - (window.scrollY || 0);
          el.style.left = `${p.baseX}%`;
          el.style.top = `${Math.round(viewportY)}px`;
          el.style.width = `${p.width}px`;
          el.style.transform = `translate3d(0,0,0) rotate(${p.rotation}deg)`;
          el.style.pointerEvents = 'none';
        });
      });
    } else {
      rafRef.current = requestAnimationFrame(frame);
    }

    return () => cancelAnimationFrame(rafRef.current);
  }, [ready, reduceMotion]);

  return (
    <div className="falling-image-background diorama" ref={containerRef} aria-hidden>
      {LAYERS.map((layerConfig, li) => (
        <div
          key={layerConfig.name}
          ref={(el) => (layerRefs.current[`layer-${li}`] = el)}
          className={`diorama-layer diorama-${layerConfig.name}`}
        >
          {(layersState.current[li] ? layersState.current[li].pieces : []).map((p) => (
            <div
              key={p.id}
              ref={(el) => (pieceRefs.current[p.id] = el)}
              className="diorama-piece"
              style={{ left: p.baseX + '%', top: '-9999px' }}
            >
              <img src={p.src} alt="" decoding="async" loading="lazy" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
