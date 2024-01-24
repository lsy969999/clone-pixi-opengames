import gsap from "gsap";
import { Container, Sprite, Texture } from "pixi.js";
import { BubbleType, boardConfig } from "../boardConfig";

export class BubbleView {
  public view = new Container();

  private readonly _shadow: Sprite;
  private readonly _sprite: Sprite;
  private readonly _shine: Sprite;
  private _type!: BubbleType;
  private readonly _shimmerTimeline: gsap.core.Timeline

  constructor(type?: BubbleType) {
    this._sprite = Sprite.from(type ? `bubble-${type}` : Texture.WHITE);
    this._sprite.anchor.set(0.5);
    this._sprite.width = boardConfig.bubbleSize;
    this._sprite.height = boardConfig.bubbleSize;

    this._shadow = Sprite.from(`bubble-shadow`);
    this._shadow.anchor.set(0.5);
    this._shadow.tint = 0xffffff;
    this._shadow.visible = !!type;
    this._shadow.width = this._sprite.width * 1.1;
    this._shadow.height = this._sprite.height * 1.1;
    this._shadow.y = (this._shadow.height - this._sprite.height) * 1.5

    this._sprite.visible = !!type;
    this._shadow.visible = !!type;

    this._shine = Sprite.from(`bubble-shine`)
    this._shine.anchor.set(0.5);
    this._shine.alpha = 0;
    this._shine.visible = false;

    this._sprite.addChild(this._shine);

    this.view.addChild(this._shadow, this._sprite)

    const duration = 0.1;

    this._shimmerTimeline = gsap
        .timeline({paused: true})
        .set(this._shine, {rotate: 0, alpha: 0})
        .to(this._shine, {
          rotate: Math.PI,
          ease: 'power3.out',
          duration,
        })
        .to(
          this._shine,
          {
            alpha: 1,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
              this._shine.visible = false;
            },
            duration: duration * 0.6
          },
          '<'
        )
  }

  public get type(): BubbleType {
    return this._type;
  }

  public set type(value: BubbleType | 'glow') {
    this._type = value;

    this._sprite.texture = Texture.from(`bubble-${this._type}`);

    this._shadow.tint = boardConfig.bubbleTypeToColor[value] ?? 0x606060;

    this._sprite.visible = true
    this._shadow.visible = value !== 'glow'
  }

  public shimmer(){
    this._shine.rotation = 0;
    this._shine.alpha = 0;
    this._shine.visible = true;

    return this._shimmerTimeline.play(0)
  }
}