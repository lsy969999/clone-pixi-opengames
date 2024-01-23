import { Application } from "pixi.js";

/** 프로젝트에서 전역적으로 공유되는 픽시 인스턴스 */
export const app = new Application<HTMLCanvasElement>({
  resolution: window.devicePixelRatio, //TODO:
  backgroundColor: 0xffffff,
});

let hasInteracted = false

function resize() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

}