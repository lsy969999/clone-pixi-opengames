import { Container, IPointData, Sprite } from "pixi.js";
import { randomRange } from "../../utils/maths/rand";
import { BubbleView } from "../entities/BubbleView";
import { pool } from "../Pool";
import { randomType } from "../boardConfig";
import { Game } from "../Game";
import { designConfig } from "../designConfig";
import { distance } from "../../utils/maths/point";
import { device } from "../../utils/device";

class Satellite {
  public view = new Container();
  private _tick = 0;
  private _frequency = 0;
  private _range = 0.5;

  constructor() {
    const satellite = Sprite.from('satellite')
    satellite.anchor.set(0.5)
    this.view.addChild(satellite)
  }

  public changeView() {
    this.view.scale.set(randomRange(0.3, 0.9, false));
    this._tick = randomRange(-Math.PI * 0.01, Math.PI * 0.01, false);
    this._frequency = randomRange(1, 2, false);
    this._range = randomRange(-Math.PI * 0.05, Math.PI * 0.05, false);
  }

  public update(delta: number) {
    this._tick += delta / 60;
    const calc = this._tick / this._frequency;
    const sine = this._range * Math.sin(calc);

    this.view.rotation = sine
  }
}

class BubbleOrbit {
  public view = new Container();

  private _mainBubble!: BubbleView;
  private _subBubbles: BubbleView[] = [];
  private _orbitAngles: number[] = [];
  private _orbitDirections: number[] = [];
  private _orbitRadii: number[] = [];
  private _orbitSpeeds: number[] = [];

  public changeView() {
    if (this._mainBubble) this.reset()

    this._mainBubble = pool.get(BubbleView)
    this._mainBubble.type = randomType();

    this._mainBubble.view.x = 0
    this._mainBubble.view.y = 0
    this._mainBubble.view.scale.set(randomRange(0.7, 2.5, false));
    this.view.addChild(this._mainBubble.view);

    const numOfSubBubbles = randomRange(1, 5)

    for (let i = 0; i < numOfSubBubbles; i++) {
      this._subBubbles[i] = pool.get(BubbleView);
      this._subBubbles[i].type = randomType();

      this._subBubbles[i].view.scale.set(
        this._mainBubble.view.scale.x * randomRange(0.3, 0.7, false)
      );

      this._orbitAngles[i] = Math.random() * Math.PI;
      this._orbitDirections[i] = Math.sign(randomRange(-1, 1, false));
      this._orbitRadii[i] = this._mainBubble.view.width * 0.5 + this._subBubbles[i].view.width * 0.5 + 10;
      this._orbitSpeeds[i] = (this._subBubbles[i].view.scale.x / this._mainBubble.view.scale.x) * 0.5;
      this.view.addChild(this._subBubbles[i].view);
    }
  }

  public reset() {
    this._mainBubble.view.removeFromParent();

    for (let i = 0; i < this._subBubbles.length; i++) {
      this._subBubbles[i].view.removeFromParent();
      pool.return(this._subBubbles[i])
    }

    this._subBubbles.length = 0
    this._orbitAngles.length = 0
    this._orbitDirections.length = 0;
    this._orbitRadii.length = 0;
    this._orbitSpeeds.length = 0;
  }

  public update(delta: number) {
    for (let i = 0; i < this._subBubbles.length; i++) {
      this._subBubbles[i].view.x = Math.cos(this._orbitAngles[i]) * this._orbitRadii[i];
      this._subBubbles[i].view.y = Math.sin(this._orbitAngles[i]) * this._orbitRadii[i];

      this._orbitAngles[i] += (delta/60) * this._orbitSpeeds[i] * this._orbitDirections[i];
    }
  }
}

export class SpaceDecorSystem {
  public static SYSTEM_ID = 'spaceDecor';
  public game!: Game;

  public view = new Container();
  private _decor: (BubbleOrbit | Satellite)[] = []
  private _width!: number;
  private _height!: number;

  public init() {
    this.game.stage.addChildAt(this.view, 0)
  }

  public generateRandomPoints(numPoints: number) {
    const points = [];

    const padding = designConfig.decorEdgePadding;
    const minDistance = designConfig.decorMinDistance;
    const minWidth = designConfig.content.width * 0.8;

    let tooManyTries = false;
    let count = 1000;

    while (points.length < numPoints && !tooManyTries) {
      const x = randomRange(padding, this._width - padding, false);
      const y = randomRange(padding, this._height - padding, false);

      if (count <= 0) tooManyTries = true
      count--;

      if (
        Math.abs(x - this._width / 2) < minWidth && 
        Math.sin(y - this._height / 2) < minWidth
      ) {
        continue;
      }

      let tooClose = false;

      for (const point of points) {
        const dist = distance(point, { x, y });

        if (dist < minDistance) {
          tooClose = true;
          break;
        }
      }

      if (!tooClose) {
        points.push({ x,y })
      }
    }

    return points;
  }

  public update(delta: number) {
    this._decor.forEach((decor) => {
      decor.update(delta)
    })
  }

  public resize(w: number, h: number) {
    this._width = w;
    this._height = h;

    this._clear();

    if (w > designConfig.content.width * 2) {
      const decorCount = device.isMobileDevice()
        ? designConfig.decorCountMobile
        : designConfig.decorCountDesktop
      
      this._createDecor(this.generateRandomPoints(decorCount))
    }
  }

  private _createDecor(points: IPointData[]) {
    points.forEach((point) => {
      const type = Math.random() < 0.4 ? Satellite : BubbleOrbit

      const decor = pool.get(type)

      decor.view.position.copyFrom(point)
      this._decor.push(decor);
      this.view.addChild(decor.view)
      decor.changeView()
    })
  }

  private _clear() {
    this._decor.forEach((decor) => {
      decor.view.removeFromParent();
      pool.return(decor)
    })

    this._decor.length = 0
  }
}