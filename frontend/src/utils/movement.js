// frontend/src/utils/movement.js

// Speed of the car (Degrees per tick)
const SPEED = 0.002; 

/**
 * Calculates the next Lat/Lon step towards a target
 */
export const moveTowards = (current, target) => {
  if (!current || !target) return current;

  const dx = target.lon - current.lon;
  const dy = target.lat - current.lat;
  
  const distance = Math.sqrt(dx * dx + dy * dy);

  // If we are very close, just snap to position (Arrival)
  if (distance < SPEED) {
    return target;
  }

  // Vector Math: Normalize and Scale
  const ratio = SPEED / distance;
  const moveX = dx * ratio;
  const moveY = dy * ratio;

  return {
    ...current,
    lat: current.lat + moveY,
    lon: current.lon + moveX
  };
};