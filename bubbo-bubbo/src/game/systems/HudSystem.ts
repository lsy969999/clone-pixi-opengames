import { Container, Graphics, NineSlicePlane, Sprite, Texture } from "pixi.js";
import { Game } from "../Game";
import { System } from "../SystemRunner";
import { LaserLine } from "../../ui/LaserLine";
import { Title } from "../../ui/Title";
import { IconButton } from "../../ui/buttons/IconButton";
import { ScoreCounter } from "../../ui/ScoreCounter";
import { HelperPanel } from "../../ui/HelperPanel";
import { PointToaster } from "../../ui/PointToaster";
import { boardConfig } from "../boardConfig";
import { designConfig } from "../designConfig";
import { PauseSystem } from "./PauseSystem";

export class HudSystem implements System {
  public static SYSTEM_ID = 'hud';
  public game!: Game;
  public view = new Container();
  public readonly cannonContainer = new Container();
  private readonly _decorContainer = new Container();
  private readonly _gameHudContainer = new Container();

  private _laserLine!: LaserLine;
  private _topTray!: NineSlicePlane;
  private _roundedTray!: Sprite;
  private _hiddenTitle!: Title;
  private _bottomTray!: NineSlicePlane;
  private _leftBorder!: NineSlicePlane;
  private _rightBorder!: NineSlicePlane;
  private _pauseButton!: IconButton;
  private _scoreCounter!: ScoreCounter;
  private _helperPanel!: HelperPanel;

  private _mask!: Graphics;

  private _hasShownHelper = false;
  private readonly _toasterList: PointToaster[] = [];
  private _height!: number;
  private _topTrayOffsetRatio = 0;

  public init() {
    this.view.addChild(this._gameHudContainer, this._decorContainer);
    this.game.stage.addChild(this.view)

    this._laserLine = new LaserLine();
    this._laserLine.view.x = -boardConfig.bounceLine;
    this._laserLine.view.y = -designConfig.content.width * 0.5;

    this._topTray = new NineSlicePlane(Texture.from('top-tray'))
    this._topTray.x = -designConfig.content.width * 0.5;
    this._topTray.width = designConfig.content.width;

    this._roundedTray = Sprite.from('rounded-tray')
    this._roundedTray.anchor.set(0.5)

    this._hiddenTitle = new Title();
    this._hiddenTitle.view.scale.set(0.85);
    this._hiddenTitle.view.y -= 55;

    this._roundedTray.addChild(this._hiddenTitle.view);

    this._bottomTray = new NineSlicePlane(Texture.from('bottom-tray'))
    this._bottomTray.height = boardConfig.bounceLine - 30
    this._bottomTray.pivot.y = this._bottomTray.height;
    this._bottomTray.x -= designConfig.content.width * 0.5;
    this._bottomTray.width = designConfig.content.width;

    this._scoreCounter = new ScoreCounter();

    this._leftBorder = new NineSlicePlane(Texture.from('game-side-border'));
    this._leftBorder.x = -(designConfig.content.width * 0.5) - this._leftBorder.width;

    this._rightBorder = new NineSlicePlane(Texture.from('game-side-border'));
    this._rightBorder.x = designConfig.content.width * 0.5;

    const pause = this.game.systems.get(PauseSystem)

    this._pauseButton = new IconButton('icon-pause')
    this._pauseButton.onPress.connect(() => {
      pause.pause()
    })
    this._pauseButton.x = designConfig.content.width * 0.5 - 40
    this._pauseButton.y = designConfig.content.height + 37;

    this._mask = new Graphics()
      .beginFill(0x030320)
      .drawRect(
        -designConfig.content.width * 0.5,
        -designConfig.content.height,
        designConfig.content.width,
        designConfig.content.height
      )

    this._helperPanel = new HelperPanel()
    this._helperPanel.view.y = -designConfig.content.height + 200

    this._decorContainer.addChild(this._mask, this._leftBorder, this._rightBorder, this._topTray, this._roundedTray)
    this._gameHudContainer.addChild(this._bottomTray, this._scoreCounter.view, this._laserLine.view, this._helperPanel.view, this.cannonContainer, this._pauseButton)

    this._gameHudContainer.mask = this._mask

    //TODO
    // this.game.systems.get()
  }
}