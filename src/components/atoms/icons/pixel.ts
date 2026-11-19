/**
 * Turns a pixel map (one string per row, `#` = filled) into a single SVG
 * path made of crisp 1×1 runs, so icons stay true pixel art at any size.
 */
export function pixelPath(rows: string[]): string {
  let d = '';
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (row[x] !== '#') {
        x++;
        continue;
      }
      const start = x;
      while (row[x] === '#') x++;
      d += `M${start} ${y}h${x - start}v1h-${x - start}z`;
    }
  });
  return d;
}
