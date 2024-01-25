const map: Record<string, NodeJS.Timeout> = {};

export function throttle(name: string, interval: number, fn: () => void) {
  if (map[name]) return;
  fn();
  map[name] = setTimeout(()=>delete map[name], interval)
}