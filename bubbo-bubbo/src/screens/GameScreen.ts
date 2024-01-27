import { Container, Texture, TilingSprite } from "pixi.js";
import { AppScreen } from "../navigation";
import { Game } from "../game/Game";
import { designConfig } from "../game/designConfig";
import gsap from "gsap";

export class GameScreen extends Container implements AppScreen {
  public static SCREEN_ID = 'game';
  public static assetBundle = ['images/game-screen']

  private readonly _background: TilingSprite;
  private readonly _game: Game;

  constructor() {
    super();

    this._background = new TilingSprite(Texture.from('background-tile-space'), 64, 64);
    this._background.tileScale.set(designConfig.backgroundTileScale);

    this.addChild(this._background);

    this._game = new Game()
    this._game.init()
    this.addChild(this._game.stage)
  }

  public async show() {
    gsap.killTweensOf(this);
    this.alpha = 0;
    this._game.awake();
    await gsap.to(this, {
      alpha: 1,
      duration: 0.2,
      ease: 'linear'
    })
    this._game.start()
  }

  public async hide() {
    gsap.killTweensOf(this);
    this._game.end();
    await gsap.to(this, {
      alpha: 0,
      duration: 0.2,
      ease: 'linear'
    })
    this._game.reset()
  }

  public updte(delta: number) {
    this._game.update(delta)
  }

  public resize(w: number, h: number) {
    this._background.width = w;
    this._background.height = h;

    this._game.resize(w, h)
  }
}