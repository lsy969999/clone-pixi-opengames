/**
 * 밀리초 단위를 Pixi의 기본 스칼라 시간(60fps)으로 변환합니다.
 * @param ms 변환할 밀리초 수입니다.
 * @returns Pixi의 기본 스칼라 시간에 해당하는 시간입니다.
 */
export function toDefaultScalarTime(ms: number) {
  return (ms * 60) / 1000; //Pixi의 기본 스칼라 시간(60FPS)
}

/**
 * 밀리초를 초로 변환합니다.
 * @param ms 변환할 밀리초 수입니다.
 * @returns 
 */
export function toSeconds(ms: number) {
  return ms / 1000;//gsap 이 초기반을 사용합니다.
}