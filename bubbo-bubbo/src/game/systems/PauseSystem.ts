import { navigation } from "../../navigation";
import { PauseOverlay } from "../../screens/overlay/PauseOverlay";
import { removeFromArray } from "../../utils/utils";
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
    this._visibilityPauseBound = this._visibilityPause.bind(this)
    document.addEventListener('visibilitychange', this._visibilityPauseBound)
  }

  public update() {
    if (!this.isPaused) {
      this._tweenList.forEach((tween) => {
        if (tween.totalProgress() >= 1) {
          this.removeTween(tween)
        }
      })
    }
  }

  public end() {
    document.removeEventListener('visibilitychange', this._visibilityPauseBound)
  }

  public reset() {
    this.isPaused = false

    this._tweenList.forEach((tween) => {
      tween.kill();
    })

    this._tweenList.length = 0;
  }

  public addTween(tween: Tween) {
    this._tweenList.push(tween);
    return tween
  }

  public removeTween(tween: Tween) {
    removeFromArray(this._tweenList, tween)
    return tween
  }

  public pause() {
    this.isPaused = true
    navigation.showOverlay(PauseOverlay, {
      score: this.game.stats.get('score'),
      callback: this._pauseCallback.bind(this)
    })

    this._tweenList.forEach((tween) => {
      tween.pause()
    })
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