/**
 * useCursorRepulsion Hook (v2: Velocity-Based Physics)
 * 
 * Creates an organic cursor repulsion effect using velocity tracking and spring physics.
 * Images only react when the cursor is moving; they smoothly settle when cursor stops.
 * 
 * Physics Model:
 * - Track cursor velocity (speed of movement)
 * - Apply repulsion force only when cursor is moving AND within radius
 * - Use spring force to gently pull images back to their base position
 * - Apply damping to smoothly dissipate motion
 * 
 * Configuration (all values are tunable):
 * - repulsionRadius: Distance (px) from cursor where repulsion applies (default: 150)
 * - repulsionStrength: Multiplier for how much cursor velocity creates repulsion (default: 0.8)
 * - velocityMultiplier: Scales the cursor velocity contribution (default: 0.15)
 * - springStrength: How strongly images pull back to base offset (default: 0.15)
 * - damping: Velocity decay factor per frame (default: 0.92)
 * - cursorStillThreshold: Cursor speed below which to treat as stopped (default: 1.0)
 * - getBaseOffset: Callback for additional offsets like scroll (default: no offset)
 */

import { useEffect, useRef } from 'react';

const useCursorRepulsion = (elementRefs, config = {}) => {
  // Configuration with sensible defaults
  const {
    repulsionRadius = 150,
    repulsionStrength = 0.8,
    velocityMultiplier = 0.15,
    springStrength = 0.15,
    damping = 0.92,
    cursorStillThreshold = 1.0,
    getBaseOffset = () => ({ x: 0, y: 0 }), // Optional: callback for additional offsets (e.g., scroll)
  } = config;

  // Track cursor position and velocity globally
  const cursorRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0, vx: 0, vy: 0 });
  // Store per-element physics state (offset, velocity)
  const physicsRef = useRef({});
  // Animation frame ID for cleanup
  const animationFrameRef = useRef(null);

  // Update cursor position and calculate velocity
  useEffect(() => {
    function handleMouseMove(e) {
      const prevX = cursorRef.current.x;
      const prevY = cursorRef.current.y;
      
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
      
      // Calculate cursor velocity (difference from previous position)
      cursorRef.current.vx = cursorRef.current.x - prevX;
      cursorRef.current.vy = cursorRef.current.y - prevY;
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animation loop for velocity-based repulsion and spring damping
  useEffect(() => {
    // Initialize physics state for all elements
    Object.keys(elementRefs).forEach((key) => {
      if (!physicsRef.current[key]) {
        physicsRef.current[key] = {
          offsetX: 0, // Current offset from base position
          offsetY: 0,
          velX: 0, // Velocity of the offset
          velY: 0,
        };
      }
    });

    function animate() {
      // Calculate cursor speed (magnitude of velocity vector)
      const cursorSpeed = Math.sqrt(
        cursorRef.current.vx * cursorRef.current.vx +
          cursorRef.current.vy * cursorRef.current.vy
      );

      Object.entries(elementRefs).forEach(([key, ref]) => {
        if (!ref) return;

        const physics = physicsRef.current[key] || {
          offsetX: 0,
          offsetY: 0,
          velX: 0,
          velY: 0,
        };

        // Get element's bounding rect for center calculation
        const rect = ref.getBoundingClientRect();
        const elementCenterX = rect.left + rect.width / 2;
        const elementCenterY = rect.top + rect.height / 2;

        // Calculate vector from cursor to element center
        const dx = elementCenterX - cursorRef.current.x;
        const dy = elementCenterY - cursorRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Only apply repulsion if cursor is moving and element is within radius
        if (
          cursorSpeed > cursorStillThreshold &&
          distance < repulsionRadius &&
          distance > 0
        ) {
          // Normalize direction vector (push away from cursor)
          const dirX = dx / distance;
          const dirY = dy / distance;

          // Proximity factor: 0 at edge of radius, 1 at cursor
          const proximityFactor = 1 - distance / repulsionRadius;

          // Repulsion force based on cursor velocity * proximity
          // Faster cursor movement = stronger repulsion
          const repulsionForce =
            cursorSpeed * velocityMultiplier * repulsionStrength * proximityFactor;

          // Apply repulsion force to velocity (impulse-based)
          physics.velX += dirX * repulsionForce;
          physics.velY += dirY * repulsionForce;
        }

        // Spring force: pull offset back toward zero (base position)
        // This creates the smooth return effect
        physics.velX += -physics.offsetX * springStrength;
        physics.velY += -physics.offsetY * springStrength;

        // Apply damping to velocity (friction-like effect)
        physics.velX *= damping;
        physics.velY *= damping;

        // Stop motion when velocity becomes negligible (prevents jitter)
        if (Math.abs(physics.velX) < 0.01) physics.velX = 0;
        if (Math.abs(physics.velY) < 0.01) physics.velY = 0;

        // Update position based on velocity
        physics.offsetX += physics.velX;
        physics.offsetY += physics.velY;

        // Get any base offset (e.g., from scroll animations) and combine with repulsion
        const baseOffset = getBaseOffset(key);
        const finalX = Math.round(physics.offsetX + (baseOffset.x || 0));
        const finalY = Math.round(physics.offsetY + (baseOffset.y || 0));

        // Apply combined transform to element
        // Use will-change: transform in CSS for better performance
        ref.style.transform = `translate(${finalX}px, ${finalY}px)`;

        physicsRef.current[key] = physics;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    elementRefs,
    repulsionRadius,
    repulsionStrength,
    velocityMultiplier,
    springStrength,
    damping,
    cursorStillThreshold,
    getBaseOffset,
  ]);

  return {};
};

export default useCursorRepulsion;
