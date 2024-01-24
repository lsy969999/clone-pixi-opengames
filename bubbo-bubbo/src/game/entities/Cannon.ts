import { Container, Sprite } from "pixi.js";
import { BubbleView } from "./BubbleView";
import { BubbleType, boardConfig } from "../boardConfig";

export class Cannon {
  public view = new Container();

  private readonly _bubbleView: BubbleView;
  private readonly _defaultBubbleScale = 2.5;
  private _parts: Record<string, Sprite> = {};
  private _type!: BubbleType | 'empty';
  private _rotation = 0;

  constructor() {
    this._build();

    this._bubbleView = new BubbleView();
    this._bubbleView.view.scale.set(0)
    this.view.addChild(this._bubbleView.view);
  }

  public get type(): BubbleType {
    return this._type;
  }

  public get rotation(): number {
    return this._rotation;
  }

  public set rotation(value: number) {
    this._rotation = value;
    this._parts['cannon-barrel'].rotation = this._parts['cannon-arrow'].rotation = value
  }

  public set type(value: BubbleType | 'empty') {
    this._bubbleView.view.scale.set(0);
    this._type = value
    if (value === 'empty') {
      this._parts['cannon-arrow'].tint = this._parts['cannon-main'].tint = 0xffffff;
      return;
    }

    this._parts['cannon-arrow'].tint = this._parts['cannon-main'].tint =
      boardConfig.bubbleTypeToColor[value]
    this._bubbleView.type = value;

    gsap.to(this._bubbleView.view.scale, {
      x: this._defaultBubbleScale,
      y: this._defaultBubbleScale,
      duration: 0.4,
      ease: 'back.out'
    })
  }
  
  private _build() {
    const create = (...ids: string[]) => {
      ids.forEach((id: string) => {
        const element = Sprite.from(id);
        element.anchor.set(0.5)
        this._parts[id] = element
        this.view.addChild(element);
      })
    }

    create('cannon-barrel', 'cannon-main', 'cannon-arrow', 'cannon-top')
  }
}