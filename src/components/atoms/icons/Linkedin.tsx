import { pixelPath } from './pixel';

// 16×16 pixel-art LinkedIn badge ("in" cut out of a rounded square).
const MAP = [
  '.##############.',
  '################',
  '################',
  '###..###########',
  '###..###########',
  '################',
  '###..##.....####',
  '###..##......###',
  '###..##..##..###',
  '###..##..##..###',
  '###..##..##..###',
  '###..##..##..###',
  '###..##..##..###',
  '################',
  '################',
  '.##############.',
];
const d = pixelPath(MAP);

const Linkedin = () => (
  <svg width="40" height="40" viewBox="0 0 16 16" shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d={d} fill="var(--color-text-primary)" />
  </svg>
);

export default Linkedin;
