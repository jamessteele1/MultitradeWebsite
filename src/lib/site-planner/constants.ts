export const GRID_SIZE_M = 1;
export const PIXELS_PER_METRE = 40;
export const CANVAS_WIDTH_M = 60;
export const CANVAS_HEIGHT_M = 40;
// Min zoom is the floor where the canvas still reads — below ~25% the
// satellite tiles + grid become a blank haze, so we cap there rather
// than let users zoom into useless white space.
export const MIN_ZOOM = 0.25;
export const MAX_ZOOM = 3;
export const ZOOM_STEP = 0.1;
