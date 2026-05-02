/**
 * Drawing/annotation tool state shared between toolbar and canvas.
 */

export type ToolMode = "select" | "freehand" | "line" | "polygon" | "text";

export type DrawStyle = {
  color: string;
  thickness: number;
  dashed: boolean;
  /** 0–1; applied to stroke and (for closed polygons) the fill */
  opacity: number;
};

export type TextStyle = {
  color: string;
  fontSize: number;
  /** 0–1 */
  opacity: number;
};

export const DEFAULT_DRAW_STYLE: DrawStyle = {
  color: "#EF4444",
  thickness: 3,
  dashed: false,
  opacity: 1,
};

export const DEFAULT_TEXT_STYLE: TextStyle = {
  color: "#EF4444",
  fontSize: 16,
  opacity: 1,
};
