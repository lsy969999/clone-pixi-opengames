import { Container, Text } from "pixi.js";
import { designConfig } from "../game/designConfig";
import { randomRange } from "../utils/maths/rand";

export class PointToaster {
  public view = new Container();
  private readonly _pointText: Text;
  private _tint: number;

  constructor() {
    this._tint = 0xffffff;

    this._pointText = new Text('', {
      fontSize: 40,
      fontWeight: '900',
      fontFamily: 'Bungee Regular',
      fill: this._tint,
      stroke: 0x000000,
      strokeThickness: 3,
      align: 'center'
    })

    this._pointText.anchor.set(0.5);

    this.view.addChild(this._pointText)
  }

  public popSocre(score: number, onComplete: (toaster: this) => void) {
    this.view.alpha = 0;

    this._pointText.text = score;

    const wallEdge = designConfig.content.width * 0.5 - this._pointText.width * 0.5;

    this.view.x = Math.min(Math.max(this.view.x, -wallEdge), wallEdge)

    return gsap.to(this.view, {
      y: this.view.y - randomRange(15, 120),
      alpha: 1,
      duration: 0.25,
      onComplete: () => {
        gsap.to(this.view, {
          alpha: 0,
          onComplete: () => onComplete?.(this)
        })
      }
    })
  }

  public get tint(): number {
    return this._tint;
  }

  public set tint(value: number) {
    this._tint = value
    this._pointText.style.fill = value ?? 0xffffff;
  }
}