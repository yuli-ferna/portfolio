import { pixelPath } from './pixel';

// 16×16 pixel-art GitHub mark (the cat is cut out of the circle).
const MAP = [
  '.....######.....',
  '...##########...',
  '..##.######.##..',
  '.###..####..###.',
  '.###........###.',
  '###..........###',
  '###..........###',
  '###..........###',
  '###..........###',
  '.###........###.',
  '.####......####.',
  '.##.##....#####.',
  '..##.#....####..',
  '...###....###...',
  '....##....##....',
  '......#..#......',
];
const d = pixelPath(MAP);

const Github = () => (
  <svg width="38" height="38" viewBox="0 0 16 16" shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d={d} fill="var(--color-text-primary)" />
  </svg>
);

export default Github;
