import { Container, Sprite, Texture, TilingSprite } from "pixi.js";
import { Cannon } from "../game/entities/Cannon";
import { PixiLogo } from "../ui/PixiLogo";
import { designConfig } from "../game/designConfig";
import { randomType } from "../game/boardConfig";
import { i18n } from "../utils/i18n";
import { lerp } from "../utils/maths/maths";
import { randomRange } from "../utils/maths/rand";
import gsap from "gsap";

export class LoadScreen extends Container {
  public static SCREEN_ID = 'loader';
  public static assetBundle = ['images/preload'];

  private readonly _background: TilingSprite;
  private readonly _spinner: Sprite;
  private readonly _cannon: Cannon;
  private readonly _pixiLogo: PixiLogo;

  private _bottomContainer = new Container();
  private _targetOffset = 0;
  private _tick = 0;

  constructor() {
    super();

    this._background = new TilingSprite(Texture.from('background-tile'), 64, 64);
    this._background.tileScale.set(designConfig.backgroundTileScale);
    this.addChild(this._background);

    this._spinner = Sprite.from('loading-circle');
    this._spinner.anchor.set(0.5);
    this.addChild(this._spinner);

    this._cannon = new Cannon();
    this._cannon.view.scale.set(0.5);
    this._cannon.type = randomType();
    this.addChild(this._cannon.view);

    this._pixiLogo = new PixiLogo(i18n.t('pixiLogoHeader'));
    this._pixiLogo.view.scale.set(0.75);
    this._bottomContainer.addChild(this._pixiLogo.view);
    this.addChild(this._bottomContainer);
  }

  public async show() {
    gsap.killTweensOf(this);
    this.alpha = 0;
    this._bottomContainer.y = 0;
    await gsap.to(this, {
      alpha: 1,
      duration: 0.2,
      ease: 'linear'
    });
  }

  public async hide() {
    gsap.killTweensOf(this);
    await gsap.to(this._bottomContainer, {
      y: 100,
      duration: 0.25,
    });
    await gsap.to(this, {
      alpha: 0,
      delay: 0.1,
      duration: 0.2,
      ease: 'linear'
    })
  }

  public update(delta: number) {
    this._spinner.rotation -= delta / 60;

    this._cannon.rotation = lerp(
      this._cannon.rotation,
      this._spinner.rotation - this._targetOffset,
      0.1
    )

    if (this._tick <= 0) {
      this._targetOffset = randomRange(Math.PI * 0.2, Math.PI * 0.5);
      this._tick = 1;
    } else {
      this._tick -= delta / 60;
    }
  }

  public resize(w: number, h: number) {
    this._background.width = w;
    this._background.height = h;

    this._spinner.x = this._cannon.view.x = w * 0.5;
    this._spinner.y = this._cannon.view.y = h * 0.5;

    this._pixiLogo.view.x = w * 0.5;
    this._pixiLogo.view.y = h - 55
  }
}