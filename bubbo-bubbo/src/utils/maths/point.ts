import { IPointData } from "pixi.js";

/**
 * 점의 크기를 구합니다.
 * @param point 
 * @returns 
 */
export function magnitude(point: IPointData): number {
  return Math.sqrt(point.x * point.x + point.y * point.y)
}

/**
 * 두점 사이의 거리
 * @param point1 
 * @param point2 
 * @returns 
 */
export function distance(point1: IPointData, point2: IPointData): number {
  return magnitude({ x: point1.x - point2.x, y: point1.y - point2.y })
}

/**
 * 점의 크기 조정
 * @param point 조정할 점
 * @param scale 조정 값
 */
export function scale(point: IPointData, scale: number): IPointData {
  return { x: point.x * scale, y: point.y  * scale }
}

/**
 * 점을 정규화시킨다.
 * @param point 
 */
export function normalize(point: IPointData): IPointData {
  const mag = magnitude(point);

  return scale(point, 1 / mag)
}

/**
 * 두 점을 더한다
 * @param point1 
 * @param point2 
 * @returns 
 */
export function add(point1: IPointData, point2: IPointData): IPointData {
  return { x: point1.x + point2.x, y: point1.y + point2.y }
}

/**
 * 한점에서 다른점을 뺍니다.
 * @param point1 
 * @param point2 
 * @returns 
 */
export function sub(point1: IPointData, point2: IPointData): IPointData {
  return { x: point1.x - point2.x, y: point1.y - point2.y }
}

/**
 * 두 점의 내적을 계산합니다.
 * @param point1 
 * @param point2 
 * @returns 
 */
export function dot(point1: IPointData, point2: IPointData): number {
  return point1.x * point2.x + point1.y * point2.y;
}

/**
 * 2D 점을 해당 각도(라디안)로 변환합니다.
 * @param point 
 * @returns 
 */
export function pointToAngle(point: IPointData): number {
  return Math.atan2(point.y, point.x)
}

/**
 * 라디안 단위의 각도를 2D 점으로 변환합니다.
 * @param angle 
 * @returns 
 */
export function angleToPoint(angle: number): IPointData {
  return { x: Math.cos(angle), y: Math.sin(angle) };
}

/**
 * 2D 점을 생성합니다.
 * @param x 
 * @param y 
 * @returns 
 */
export function point(x = 0, y = 0): IPointData {
  return { x, y }
}