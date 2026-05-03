export const GRID_SIZE_M = 1;
export const PIXELS_PER_METRE = 40;
export const CANVAS_WIDTH_M = 60;
export const CANVAS_HEIGHT_M = 40;
// 10% lets the user zoom way out to find bearings on the satellite —
// the imagery covers ~350m around the address, and at 10% zoom most of
// that fits the screen at once which is essential when locating a new
// site. With no satellite loaded, low zoom just shows a small grid in
// a sea of white — that's expected and the user can zoom back in.
export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 3;
export const ZOOM_STEP = 0.1;
