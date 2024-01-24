/**
 * 두 값 사이의 선형 보간입니다.
 * @param x 시작값
 * @param y 끝값
 * @param t 보간 인자(0 또는 1). 0 이면 x, 1 이면 y
 * @returns 
 */
export function lerp(x: number, y: number, t: number): number {
  return (1 - t) * x + t * y;
}