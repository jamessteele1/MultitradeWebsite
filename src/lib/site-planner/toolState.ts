/**
 * Drawing/annotation tool state shared between toolbar and canvas.
 */

export type ToolMode = "select" | "freehand" | "polygon" | "text";

export type DrawStyle = {
  color: string;
  thickness: number;
  dashed: boolean;
};

export type TextStyle = {
  color: string;
  fontSize: number;
};

export const DEFAULT_DRAW_STYLE: DrawStyle = {
  color: "#EF4444",
  thickness: 3,
  dashed: false,
};

export const DEFAULT_TEXT_STYLE: TextStyle = {
  color: "#EF4444",
  fontSize: 16,
};
