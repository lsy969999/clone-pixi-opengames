import { Container, NineSlicePlane, Sprite, Texture } from "pixi.js";
import { designConfig } from "../game/designConfig";
import gsap from "gsap";

export class LaserLine {
  public view = new Container();

  private readonly _line: NineSlicePlane
  private readonly _glow: Sprite;
  private _targetAlpha = 1;
  private _alphaDirection = 1;
  private readonly _alphaSpeed = 0.2;
  private readonly _minAlpha = 0.2;
  private readonly _maxAlpha = 0.5;
  private readonly _pulseAlpha = 1;
  private _isPulsing = false;

  constructor() {
    this._line = new NineSlicePlane(Texture.from('laser-line'))
    this._line.height -= 12;
    this._line.pivot.y = this._line.height * 0.5 - 6;
    this._line.width = designConfig.content.width;

    this._glow = Sprite.from('laser-line-glow');
    this._glow.anchor.set(0.5)
    this._glow.x = this._line.width * 0.5;
    this.view.addChild(this._glow, this._line)

    this._glow.alpha = 0.25
  }

  public update(delta: number) {
    if (this._isPulsing) return;

    this._targetAlpha += (delta / 60) * (this._alphaDirection * this._alphaSpeed);

    if (this._targetAlpha <= this._minAlpha) {
      this._targetAlpha = this._minAlpha;
      this._alphaDirection = 1
    } else if (this._targetAlpha >= this._maxAlpha) {
      this._targetAlpha = this._maxAlpha
      this._alphaDirection = -1
    }

    this._glow.alpha = this._targetAlpha
  }

  public pulse() {
    this._isPulsing = true;
    this._glow.alpha = this._pulseAlpha
    gsap.killTweensOf(this._glow)
    gsap.to(this._glow, {
      alpha: this._targetAlpha,
      delay: 0.2,
      onComplete: () => {
        this._isPulsing = false;
      }
    })
  }
}