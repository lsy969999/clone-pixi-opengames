import { Application } from "pixi.js";
import { designConfig } from "./game/designConfig";

/** 프로젝트에서 전역적으로 공유되는 픽시 인스턴스 */
export const app = new Application<HTMLCanvasElement>({
  resolution: window.devicePixelRatio, //TODO:
  backgroundColor: 0xffffff,
});

let hasInteracted = false

/** 앱 리사이즈 세팅 함수 */
function resize() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const minWidth = designConfig.content.width;
  const minHeight = designConfig.content.height;

  //현재 크기를 기준으로 렌더러 및 캔버스 크기 계산
  const scaleX = windowWidth < minWidth ? minWidth / windowWidth : 1;
  const scaleY = windowHeight < minHeight ? minHeight / windowHeight : 1;
  const scale = scaleX > scaleY ? scaleX : scaleY;
  const width = windowWidth * scale;
  const height = windowHeight * scale;

  //모바일 크기 조정 문제를 방지하려면 캔버스 스타일 치수를 업데이트하고 창을 위로 스크롤 하세요
  app.renderer.view.style.width = `${windowWidth}px`;
  app.renderer.view.style.height = `${windowHeight}px`;
  window.scrollTo(0, 0);

  //렌더러 및 네비게이션 화면의 크기를 업데이트
  app.renderer.resize(width, height)
}