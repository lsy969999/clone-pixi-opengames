import { Application, Assets } from "pixi.js";
import { designConfig } from "./game/designConfig";
import { navigation } from "./navigation";
import { initAssets } from "./assets";
import { storage } from "./storage";
import { LoadScreen } from "./screens/LoadScreen";
import { audio, bgm } from "./audio";
import { getUrlParams } from "./utils/utils";

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
  navigation.init();
  navigation.resize(width, height);
}

/** 앱을 세팅하고 자산을 초기화 합니다. */
async function init() {
  //픽시캔버스를 바디에 추가합니다.
  document.body.appendChild(app.view);

  window.addEventListener('resize', resize)

  resize();

  await initAssets();

  storage.readyStorage();

  navigation.setLoadScreen(LoadScreen)

  audio.muted(storage.getStorageItem('muted'));

  document.addEventListener('pointerdown', () => {
    if (!hasInteracted) {
      bgm.play('audio/bubbo-bubbo-bg-music.wav')
    }
    hasInteracted = true
  })

  document.addEventListener('visibilitychange', ()=>{
    if(document.visibilityState !== 'visible') {
      audio.muted(true)
    } else {
      audio.muted(storage.getStorageItem('muted'))
    }
  })

  if (getUrlParams('play') !== null) {
    // await Assets.loadBundle(TitleSc)
  } else if (getUrlParams('loading') != null) {
    await navigation.goToScreen(LoadScreen)
  } else {

  }

}

init()