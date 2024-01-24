/**
 * 주어진 min max 범위 사이의 랜덤한 값을 생성
 * @param min 범위의 최소값
 * @param max 범위의 최대값
 * @param floor 결과값을 버림할지(디폴트 버림)
 * @returns 
 */
export function randomRange(min: number, max: number, floor = true) {
  const value = Math.random() * (max - min) + min;
  return floor ? Math.floor(value) : value
}

/**
 * 주어진 리스트에서 랜덤한 값을 반환
 * @param arr 
 * @param random 사용되는 랜덤함수(디폴트 Math.random)
 * @returns 
 */
export function randomItem<T>(arr: T[], random = Math.random) {
  return arr[Math.floor(random() * arr.length)]
}