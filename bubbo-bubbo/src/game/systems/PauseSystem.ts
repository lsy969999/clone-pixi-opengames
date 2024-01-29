import { navigation } from "../../navigation";
import { Game } from "../Game";
import { System } from "../SystemRunner";

export type Tween = gsap.core.Tween | gsap.core.Timeline;

export class PauseSystem implements System {
  public static SYSTEM_ID = 'pause';
  public game!: Game;
  public isPaused  = false;

  private readonly _tweenList: Tween[] = [];
  private _visibilityPauseBound!: () => void;

  public start() {
    this._visibilityPauseBound = this._visibilityPauseBound.bind(this)
    document.addEventListener('visibilitychange', this._visibilityPauseBound)
  }

  public update() {
    if (!this.isPaused) {
      this._tweenList.forEach((tween) => {
        if (tween.totalProgress() >= 1) {
          
        }
      })
    }
  }

  public end() {

  }

  public reset() {

  }

  public addTween(tween: Tween) {

  }

  public removeTween(tween: Tween) {

  }

  public pause() {
    this.isPaused = true
    //TODO
  }

  public resume() {
    this.isPaused = false
    this._tweenList.forEach((tween) => {
      tween.resume()
    })
  }

  private _visibilityPause() {
    if (document.visibilityState !== 'visible') {
      if (!this.isPaused) this.pause()
    }
  }

  private async _pauseCallback(state: 'quit' | 'resume') {
    await navigation.hideOverlay();

    if (state === 'resume') this.resume()
    else {
      //TODO
      // navigation.goToScreen()
    }
  }
}