/** Original lettering: each stroke retains its geometry for later ink transitions. */
type Point = [number, number];
type Curve = [Point, Point, Point, Point];
type Stroke = { curves: Curve[]; width: number; pressure: number[]; duration: number };

const stroke = (curves: Curve[], width: number, pressure: number[], duration = 230): Stroke =>
  ({ curves, width, pressure, duration });

// G A B R I E L. Deliberately irregular baselines and sharp brush lifts.
const strokes: Stroke[] = [
  stroke([[[207, 112], [143, 43], [62, 123], [66, 215]], [[66, 215], [66, 305], [162, 298], [195, 222]]], 31, [.08, .7, 1, .9, .6, .1], 620),
  stroke([[[132, 207], [160, 213], [197, 188], [220, 183]], [[220, 183], [201, 205], [199, 269], [197, 292]]], 23, [.1, .95, 1, .5, .03], 230),
  stroke([[[225, 285], [247, 222], [281, 132], [311, 97]]], 18, [.04, .6, .9, .06], 290),
  stroke([[[304, 96], [307, 148], [319, 239], [340, 277]]], 31, [.4, 1, .85, .05], 250),
  stroke([[[239, 226], [274, 213], [310, 211], [339, 200]]], 13, [.07, .7, 1, .02], 160),
  stroke([[[387, 116], [378, 164], [371, 228], [363, 284]]], 28, [.65, 1, .7, .05], 240),
  stroke([[[377, 126], [482, 66], [479, 185], [385, 194]], [[385, 194], [493, 158], [477, 295], [364, 271]]], 24, [.02, .85, .5, .25, 1, .6, .02], 450),
  stroke([[[519, 113], [506, 173], [502, 235], [491, 280]]], 29, [.5, 1, .7, .03], 230),
  stroke([[[508, 127], [613, 66], [615, 203], [510, 193]]], 25, [.02, .8, 1, .2], 310),
  stroke([[[541, 196], [557, 219], [574, 270], [612, 286]]], 26, [.5, 1, .75, .02], 210),
  stroke([[[659, 120], [644, 173], [636, 235], [628, 273]]], 29, [.6, 1, .6, .02], 260),
  stroke([[[718, 121], [708, 168], [700, 233], [691, 272]]], 28, [.7, 1, .75, .2], 250),
  stroke([[[711, 133], [742, 118], [779, 118], [801, 104]]], 22, [.1, 1, .75, .01], 160),
  stroke([[[704, 197], [730, 190], [762, 190], [779, 181]]], 17, [.2, 1, .7, .02], 150),
  stroke([[[690, 271], [728, 265], [767, 259], [792, 242]]], 24, [.3, 1, .7, .02], 170),
  stroke([[[853, 107], [835, 160], [826, 230], [818, 268]], [[818, 268], [854, 265], [903, 247], [943, 232]]], 31, [.6, 1, .8, .65, .4, .01], 410),
  stroke([[[115, 337], [297, 324], [680, 308], [961, 315]]], 10, [.02, .7, 1, .55, .01], 380),
];

function sample(curve: Curve, t: number): Point {
  const u = 1 - t;
  return [0, 1].map(axis => u ** 3 * curve[0][axis] + 3 * u * u * t * curve[1][axis]
    + 3 * u * t * t * curve[2][axis] + t ** 3 * curve[3][axis]) as Point;
}

const format = (point: Point) => point.map(n => n.toFixed(2)).join(',');
/** Global tempo: lower is faster. Scales writing, pauses and drips together. */
export const INK_SPEED = .5;
let elapsed = 280 * INK_SPEED;

export const inkStrokes = strokes.map((item, index) => {
  const points = item.curves.flatMap((curve, part) =>
    Array.from({ length: 81 }, (_, step) => ({ point: sample(curve, step / 80), t: (part + step / 80) / item.curves.length })),
  );
  const edges: [Point[], Point[]] = [[], []];
  points.forEach(({ point, t }, i) => {
    const before = points[Math.max(0, i - 1)].point;
    const after = points[Math.min(points.length - 1, i + 1)].point;
    const dx = after[0] - before[0], dy = after[1] - before[1];
    const length = Math.hypot(dx, dy) || 1;
    const p = t * (item.pressure.length - 1), k = Math.min(Math.floor(p), item.pressure.length - 2);
    const pressure = item.pressure[k] + (item.pressure[k + 1] - item.pressure[k]) * (p - k);
    const grain = Math.sin(i * 2.7 + index * 4) * .6 + Math.sin(i * 7.3) * .35;
    const radius = Math.max(.25, item.width * pressure / 2 + grain);
    edges[0].push([point[0] - dy / length * radius, point[1] + dx / length * radius]);
    edges[1].push([point[0] + dy / length * radius, point[1] - dx / length * radius]);
  });
  const polygon = [...edges[0], ...edges[1].reverse()];
  const outline = `M${polygon.map(format).join(' L')} Z`;
  const path = `M${format(item.curves[0][0])} ${item.curves.map(c => `C${format(c[1])} ${format(c[2])} ${format(c[3])}`).join(' ')}`;
  const delay = elapsed;
  const duration = Math.round(item.duration * INK_SPEED);
  elapsed += duration + (index === 1 || index === 4 || index === 6 || index === 9 || index === 10 || index === 14 ? 85 : 25) * INK_SPEED;
  return { outline, polygon, path, delay, duration, width: item.width, index };
});

export const writingDuration = elapsed;
// Attach to the actual bottom edge of a loaded stroke, never a guessed coordinate.
function bottomEdge(strokeIndex: number, x: number) {
  const polygon = inkStrokes[strokeIndex].polygon;
  const intersections = polygon.flatMap((a, i) => {
    const b = polygon[(i + 1) % polygon.length];
    if (a[0] === b[0] || x < Math.min(a[0], b[0]) || x > Math.max(a[0], b[0])) return [];
    return [a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0])];
  });
  if (!intersections.length) throw new Error(`Drip has no ink source: stroke ${strokeIndex}, x ${x}`);
  return Math.max(...intersections) - 2;
}

export const inkDrips = [
  // Source anchors the liquid; afterStroke identifies the last stroke of its letter.
  { source: 0, afterStroke: 1, x: 115, length: 30, width: 1.55, wait: 60, duration: 4200 },
  { source: 6, afterStroke: 6, x: 416, length: 31, width: 1.2, wait: 90, duration: 4700 },
  { source: 15, afterStroke: 15, x: 833, length: 28, width: 1.45, wait: 100, duration: 4100 },
  { source: 16, afterStroke: 16, x: 534, length: 44, width: .95, wait: 120, duration: 4900 },
].map(d => {
  const completedStroke = inkStrokes[d.afterStroke];
  return {
    ...d, y: bottomEdge(d.source, d.x), duration: Math.round(d.duration * INK_SPEED),
    delay: completedStroke.delay + completedStroke.duration + d.wait * INK_SPEED,
  };
});
export const inkDuration = Math.max(writingDuration, ...inkDrips.map(d => d.delay + d.duration));
