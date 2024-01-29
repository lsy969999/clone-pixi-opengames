import { Container, Graphics, Sprite, Text } from "pixi.js";
import { AppScreen } from "../../navigation";
import { i18n } from "../../utils/i18n";
import { AudioSecondaryButton } from "../../ui/buttons/AudioSecondaryButton";
import { SecondaryButton } from "../../ui/buttons/SecondaryButton";
import { storage } from "../../storage";
import gsap from "gsap";

class PausePanel {
  public view = new Container();

  private readonly _base: Sprite;
  private readonly _titleText: Text;
  private readonly _scoreTitleText: Text;
  private readonly _scoreText: Text;

  constructor() {
    this._base = Sprite.from('images/pause-overlay/pause-panel.png')
    this._base.anchor.set(0.5)
    this.view.addChild(this._base)

    this._titleText = new Text(i18n.t('paused'), {
      fontSize: 30,
      fontWeight: '900',
      fontFamily: 'Bungee Regular',
      fill: 0xffffff,
      align: 'center'
    })

    this._titleText.anchor.set(0.5);
    this._titleText.y = -(this._base.height * 0.5) + 50;
    this._base.addChild(this._titleText);

    this._scoreTitleText = new Text(i18n.t('score'), {
      fontSize: 20,
      fontWeight: '900',
      fontFamily: 'Bungee Regular',
      fill: 0x000000,
      align: 'center'
    })

    this._scoreTitleText.anchor.set(0.5)
    this._scoreTitleText.y = -82;
    this._base.addChild(this._scoreTitleText);

    this._scoreText = new Text('', {
      fontSize: 60,
      fontWeight: '900',
      fontFamily: 'Bungee Regular',
      fill: 0x000000,
      align: 'center'
    })

    this._scoreText.anchor.set(0.5)
    this._scoreText.y = -37
    this._base.addChild(this._scoreText)
  }

  public setScore(score: number) {
    this._scoreText.text = score.toLocaleString()

    this._scoreText.style.fontSize = 60

    while(this._scoreText.width > this._base.width) {
      this._scoreText.style.fontSize--
    }
  }
}

type PauseCallback = (state: 'quit' | 'resume') => void

export class PauseOverlay extends Container implements AppScreen {
  public static SCREEN_ID = 'pause';
  public static assetBundles = ['images/pause-overlay'];

  private readonly _background: Graphics;
  private readonly _panel: PausePanel;
  private _audioBtn!: AudioSecondaryButton;
  private _resumeBtn!: SecondaryButton;
  private _quitBtn!: SecondaryButton;

  private _callBack!: PauseCallback;

  constructor() {
    super();
    this._background = new Graphics().beginFill(0x000000, 0.5).drawRect(0, 0, 50, 50);
    this._background.interactive = true;
    this.addChild(this._background);

    this._panel = new PausePanel();
    this.addChild(this._panel.view)

    this._buildButtons()
  }

  public prepare(data: {
    score: number,
    callback: PauseCallback
  }) {
    this._panel.setScore(data?.score ?? 0)
    this._callBack = data.callback
    this._audioBtn.forceSwitch(storage.getStorageItem('muted'))
  }

  public async show() {
    gsap.killTweensOf(this)

    this.alpha = 0
    await gsap.to(this, {
      alpha: 1,
      duration: 0.2,
      ease: 'linear'
    })
  }

  public async hide() {
    gsap.killTweensOf(this)
    await gsap.to(this, {
      alpha: 0,
      duration: 0.2,
      ease: 'linear'
    })
  }

  public resize(w: number, h: number) {
    this._background.width = w;
    this._background.height = h;

    this._panel.view.x = w * 0.5
    this._panel.view.y = h * 0.5
  }

  private _buildButtons() {
    this._audioBtn = new AudioSecondaryButton();
    this._panel.view.addChild(this._audioBtn)
    this._audioBtn.y = 50
    this._resumeBtn = new SecondaryButton({
      text: i18n.t('resume'),
      tint: 0xffc42c,
    })
    this._resumeBtn.onPress.connect(()=>{
      this._callBack?.('resume')
    })
    this._resumeBtn.y = this._audioBtn.y + 60;
    this._panel.view.addChild(this._resumeBtn);

    this._quitBtn = new SecondaryButton({
      text: i18n.t('quit'),
      tint: 0x49c8ff,
    })

    this._quitBtn.onPress.connect(() => {
      this._callBack?.('quit')
    })

    this._panel.view.addChild(this._quitBtn)
    this._quitBtn.y = this._resumeBtn.y  + 60
  }
}