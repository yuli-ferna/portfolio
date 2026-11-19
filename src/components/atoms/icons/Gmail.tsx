import { pixelPath } from './pixel';

// 16×13 pixel-art envelope.
const MAP = [
  '################',
  '################',
  '###..........###',
  '##.##......##.##',
  '##..##....##..##',
  '##...##..##...##',
  '##....####....##',
  '##.....##.....##',
  '##............##',
  '##............##',
  '##............##',
  '################',
  '################',
];
const d = pixelPath(MAP);

const Gmail = () => (
  <svg width="36" height="30" viewBox="0 -1.5 16 16" shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d={d} fill="var(--color-text-primary)" />
  </svg>
);

export default Gmail;
