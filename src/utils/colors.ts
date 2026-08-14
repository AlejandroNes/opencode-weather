export const COLORS = {
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  reset: "\x1b[0m",
} as const;

export function color(text: string, colorCode: string): string {
  return `${colorCode}${text}${COLORS.reset}`;
}
