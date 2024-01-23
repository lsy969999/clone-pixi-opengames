/** resize 함수가 동작하기전 최소 width 값 */
const minWidth = 428;

/** resize 함수가 동작하기전 최소 height 값 */
const minHeight = 925;

export const designConfig = {
  content: {
    width: minWidth,
    height: minHeight,
  },
  /** bubbles가 충동하는걸 보는걸 허용 */
  debugBody: false,
  /** 각 화면의 배경화면 타일 크기 */
  backgroundTileScale: 2,
  /** 백그라운드 데코가 사이드 스크린에 가까워지지 않도록 방지 */
  decorEdgePadding: 100,
  /** 백그라운드 데코가 다른거에 가까워지지않도록 방지 */
  decorMinDistance: 150,
  /** 데스크톱 환경에서 얼마나 많은 백그라운드 데코가 허용되는지 */
  decorCountDesktop: 6,
  /** 모바일 환경에서 얼마나 많은 백그라운드 데코가 허용되는지 */
  decorCountMobile: 3,
  /** redirect할 url */
  forkMeURL: ''
}