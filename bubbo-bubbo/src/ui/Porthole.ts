import { Container, Graphics, Texture, TilingSprite } from "pixi.js";
import { BubbleView } from "../game/entities/BubbleView";
import { randomRange } from "../utils/maths/rand";
import { randomType } from "../game/boardConfig";
import gsap from "gsap";

interface PortholeOptions {
  frameColor: number;
  frameWidth: number;
  size: number;
}

export class Porthole {
  public static DEFAULT_OPTIONS: PortholeOptions = {
    frameColor: 0x767676,
    frameWidth: 10,
    size: 60,
  }

  public view = new Container();
  private readonly _frame: Graphics;
  private readonly _background: TilingSprite;
  private readonly _mask: Graphics;
  private readonly _bubble: BubbleView;

  private readonly _radius: number;
  private _isBubbleSet = false;

  constructor(options?: PortholeOptions) {
    options = {...Porthole.DEFAULT_OPTIONS, ...options};

    this._frame = new Graphics()
      .beginFill(options.frameColor)
      .drawCircle(0, 0, options.size + options.frameWidth);

    this.view.addChild(this._frame);

    this._background = new TilingSprite(Texture.from('background-tile-space'), 64, 64);
    this._background.anchor.set(0.5);

    this._background.width = this._background.height = options.size * 2;
    this._frame.addChild(this._background);

    this._mask = new Graphics().beginFill(options.frameColor).drawCircle(0, 0, options.size);
    this._background.mask = this._mask;
    this.view.addChild(this._mask);

    this._bubble = new BubbleView();
    this._background.addChild(this._bubble.view);
    this._radius = this._frame.width * 0.5;
  }

  public start() {
    this._setBubble()
  }

  public stop() {
    this._setBubble()
    gsap.killTweensOf(this._bubble.view)
  }

  private _setBubble() {
    this._isBubbleSet = true;
    this._bubble.view.scale.set(randomRange(0.5, 1, false));
    this._bubble.type = randomType();
    const angle = Math.random() * Math.PI * 2;
    const radius = this._radius + this._bubble.view.width * 0.5;
    this._bubble.view.x = Math.cos(angle) * radius;
    this._bubble.view.y = Math.sin(angle) * radius;

    gsap.delayedCall(randomRange(3, 6), this._moveBubble.bind(this))
  }

  private _moveBubble() {
    if (!this._isBubbleSet) return;
    this._isBubbleSet = false;

    const offset = randomRange(-Math.PI * 0.33, Math.PI * 0.33, false);
    const angle = Math.atan2(this._bubble.view.y, this._bubble.view.x) + offset;
    const radius = this._radius + this._bubble.view.width * 0.5;
    const x = -radius * Math.cos(angle);
    const y = -radius * Math.sin(angle);

    gsap.to(this._bubble.view, {
      x,
      y,
      duration: randomRange(2, 5),
      ease: 'none',
      onComplete: this._setBubble.bind(this)
    })

  }
}