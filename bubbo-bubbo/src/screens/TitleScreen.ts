import { Container, FederatedPointerEvent, Graphics, Rectangle, Texture, TilingSprite } from "pixi.js";
import { AppScreen } from "../navigation";
import { Title } from "../ui/Title";
import { PixiLogo } from "../ui/PixiLogo";
import { Cannon } from "../game/entities/Cannon";
import { PrimaryButton } from "../ui/buttons/PrimaryButton";
import { AudioButton } from "../ui/buttons/AudioButton";
import { Porthole } from "../ui/Porthole";
import { designConfig } from "../game/designConfig";
import { i18n } from "../utils/i18n";
import { boardConfig, randomType } from "../game/boardConfig";
import { throttle } from "../utils/throttle";
import { sfx } from "../audio";
import { storage } from "../storage";
import gsap from "gsap";

export class TitleScreen extends Container implements AppScreen {
  public static SCREEN_ID = 'title';
  public static assetBundles = ['images/title-screen'];

  private readonly _hitContainer = new Container();
  private readonly _hitArea: Rectangle;
  private readonly _background: TilingSprite;

  private _title!: Title;
  private _pixiLogo!: PixiLogo;
  private _cannon!: Cannon;
  private _footer!: Graphics;
  private _forkBtn!: PrimaryButton;
  private _playBtn!: PrimaryButton;
  private _audioBtn!: AudioButton;
  private _portholeOne!: Porthole;
  private _portholeTwo!: Porthole;
  private _aimAngle!: number;
  private _topAnimContainer = new Container();
  private _midAnimContainer = new Container();
  private _bottomAnimContainer = new Container();

  constructor() {
    super();

    this._background = new TilingSprite(Texture.from('background-tile'), 64, 64);
    this._background.tileScale.set(designConfig.backgroundTileScale);
    this._background.interactive = true;
    this.addChild(this._background);

    this._hitArea = new Rectangle();

    this._hitContainer.interactive = true
    this._hitContainer.hitArea = this._hitArea
    this.addChild(this._hitContainer)

    this._buildDetails()
    this._buildButtons()

    this.addChild(this._topAnimContainer, this._midAnimContainer, this._bottomAnimContainer)
  }

  public prepare() {
    this._portholeOne.stop()
    this._portholeTwo.stop()

    gsap.set(this._topAnimContainer, {y: -350});
    gsap.set(this._midAnimContainer, {x: 200});
    gsap.set(this._bottomAnimContainer, {y: 350});
  }

  public async show() {
    this._hitContainer.on('pointermove', this._calculateAngle.bind(this))
    this._hitContainer.on('pointertap', this._calculateAngle.bind(this))

    gsap.killTweensOf(this)

    this.alpha = 0

    this._portholeOne.start()
    this._portholeTwo.start()

    this._audioBtn.forceSwitch(storage.getStorageItem('muted'))

    await gsap.to(this, {alpha: 1, duration: 0.2, ease: 'linear'})

    const endData = {
      x: 0,
      y: 0,
      duration: 0.75,
      ease: 'elastic.out(1, 0.5)',
    };

    gsap.to(this._topAnimContainer, endData)
    gsap.to(this._midAnimContainer, endData)
    gsap.to(this._bottomAnimContainer, endData)
  }

  public async hide() {
    this._hitContainer.removeAllListeners();

    gsap.killTweensOf(this);

    await gsap.to(this, {alpha: 0, duration: 0.2, ease: 'linear'});

    this._portholeOne.stop()
    this._portholeTwo.stop();
  }

  public resize(w: number, h: number) {
    this._background.width = w;
    this._background.height = h;

    this._title.view.x = w * 0.5;
    this._title.view.y = 145;

    this._pixiLogo.view.x = 55;
    this._pixiLogo.view.y = h - 40;

    this._footer.width = w * 1.2;
    this._footer.x = w * 0.5;
    this._footer.y = h;

    this._forkBtn.x = w - this._pixiLogo.view.x;
    this._forkBtn.y = this._pixiLogo.view.y + this._forkBtn.height * 0.5 - 5;

    this._audioBtn.x = w - 40;
    this._audioBtn.y = 40;

    this._cannon.view.x = w * 0.5;
    this._cannon.view.y = h - this._footer.height * 0.5

    this._playBtn.x = w * 0.5;
    this._playBtn.y =
      this._cannon.view.y - this._cannon.view.height / 2 - this._playBtn.height / 2 + 10

    this._portholeOne.view.x = 40
    this._portholeOne.view.y = 40

    this._portholeTwo.view.x = w - 40
    this._portholeTwo.view.y = this._title.view.y + this._title.view.height + 10;

    this._hitArea.width = w
    this._hitArea.height = h - boardConfig.bounceLine * 0.75
  }

  private _calculateAngle(e: FederatedPointerEvent) {
    const globalPos = this._cannon.view.getGlobalPosition();
    const angleRadians = Math.atan2(e.global.y - globalPos.y, e.global.x - globalPos.x);

    if (Math.abs(this._aimAngle - angleRadians) > Math.PI * 0.0002) {
      throttle('cannon-audio', 150, () => {
        sfx.play('audio/cannon-move.wav', {
          volume: 0.2
        })
      })
    }

    this._aimAngle = angleRadians
    this._cannon.rotation = angleRadians + Math.PI * 0.5
  }

  private _buildDetails() {
    this._title = new Title();
    this._topAnimContainer.addChild(this._title.view);

    const type = randomType()

    this._footer = new Graphics()
      .beginFill(boardConfig.bubbleTypeToColor[type])
      .drawEllipse(0,0,300,125);
    this._bottomAnimContainer.addChild(this._footer)

    this._cannon = new Cannon()
    this._cannon.view.scale.set(0.75);
    this._cannon.type = type;
    this._bottomAnimContainer.addChild(this._cannon.view)

    this._pixiLogo = new PixiLogo()
    this._pixiLogo.view.scale.set(0.35)
    this._bottomAnimContainer.addChild(this._pixiLogo.view);

    this._portholeOne = new Porthole()
    this._topAnimContainer.addChild(this._portholeOne.view);

    this._portholeTwo = new Porthole();
    this._midAnimContainer.addChild(this._portholeTwo.view)
  }

  private _buildButtons() {
    this._forkBtn = new PrimaryButton({
      text: i18n.t('forkGithub'),
      textStyle: {
        fill: 0xe91e63,
        fontFamily: 'Opensans Semibold',
        fontWeight: 'bold',
        align: 'center',
        fontSize: 16,
      },
      buttonOptions: {
        defaultView: 'pixi-btn-up',
        pressedView: 'pixi-btn-down',
        textOffset: {
          default: {
            y: -13,
          },
          pressed: {
            y: -8
          }
        }
      }
    });

    this._forkBtn.onPress.connect(() => {
      window.open(designConfig.forkMeURL, '_blank')?.focus()
    })

    this._bottomAnimContainer.addChild(this._forkBtn);

    this._audioBtn = new AudioButton();
    this._topAnimContainer.addChild(this._audioBtn);

    this._playBtn = new PrimaryButton({
      text: i18n.t('titlePlay'),
    });

    this._playBtn.onPress.connect(() => {
      //go to game screen
    })

    this._bottomAnimContainer.addChild(this._playBtn)
  }
}