/** Surface tension builds a bead before gravity draws a continuous attached trail. */
export function dripShape(progress: number, length: number, width: number) {
  const p = Math.max(0, Math.min(1, progress));
  const pooling = Math.min(1, p / .1);
  const flow = Math.max(0, (p - .1) / .9);
  const descent = length * (flow * flow * (3 - 2 * flow));
  const radius = width * (.38 + .8 * pooling);
  const neck = width * (.8 - .34 * flow);
  const drift = Math.sin(flow * 2.1) * width * .45;
  const tip = descent + radius;
  return `M${-width},-2 Q${-neck},1 ${-neck},${descent * .35}
    C${-neck},${descent * .7} ${drift - radius},${descent - radius} ${drift - radius},${descent}
    C${drift - radius},${tip + radius} ${drift + radius},${tip + radius} ${drift + radius},${descent}
    C${drift + radius},${descent - radius} ${neck},${descent * .7} ${neck},${descent * .35}
    Q${neck},1 ${width},-2 Z`;
}
