import { Container, Graphics, IPointData } from "pixi.js";
import { BubbleType, boardConfig } from "../boardConfig";
import { BubbleView } from "./BubbleView";
import { PhysicsBody, PhysicsState } from "./PhysicsBody";
import { designConfig } from "../designConfig";
import gsap from "gsap";
import { randomRange } from "../../utils/maths/rand";
import { sfx } from "../../audio";

export class SpoofBubble {
  public i!: number;
  public j!: number;

  public get defaultX() {
    return (this.i + 1) * (boardConfig.bubbleSize / 2);
  }

  public get defaultY() {
    return -this.j * boardConfig.bubbleSize;
  }
}

let UID = 0;

export class Bubble extends SpoofBubble {
  public UID!: number;
  public view = new Container();
  public bubbleView: BubbleView;
  public body = new PhysicsBody();
  public dropGroupId!: number;

  private _type!: BubbleType;

  constructor() {
    super();

    this.bubbleView = new BubbleView();
    this.view.addChild(this.bubbleView.view)
  }

  public reset() {
    this.UID = this.body.UID = UID++;
    this.body.reset();
    this.i = this.j = - 1
    this.dropGroupId = 0;

    if (designConfig.debugBody) {
      this.view.addChild(
        new Graphics().beginFill(0xffffff, 0.5).drawCircle(0,0, this.body.radius)
      )
    }
  }

  public connect(i: number, j: number) {
    this.i = i;
    this.j = j;
    this.body.state = PhysicsState.STATIC;
  }

  public drop() {
    gsap.killTweensOf(this);
    this.body.state = PhysicsState.DYNAMIC;
    this.body.applyForce(randomRange(-30, 30), randomRange(-20, 0))
  }

  public bounce() {
    sfx.play('audio/bubble-land-sfx.wav', {
      speed: randomRange(0.8, 1.1, false)
    })
    this.bubbleView.type = 'glow'
    this.body.bounces++
    this.body.y -= this.body.velocity.y
    this.body.velocity.y = -Math.abs(this.body.velocity.y * this.body.damping);
  }

  public impact(direction: IPointData) {
    return gsap.to(this.bubbleView.view, {
      x: direction.x, 
      y: direction.y,
      duration: 0.075,
      yoyo: true,
      repeat: 1
    })
  }

  public update() {
    this.view.x = this.body.x;
    this.view.y = this.body.y;
  }

  public get x() {
    return this.body.x
  }

  public set x(value: number) {
    this.body.x = value;
  }

  public get type() {
    return this._type
  }

  public set type(value: BubbleType) {
    this._type = value;
    this.bubbleView.type = this.type
  }
}