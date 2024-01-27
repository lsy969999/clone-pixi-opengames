import { Vector2 } from "../../utils/maths/Vector2";
import { boardConfig } from "../boardConfig";

/** PhysicsBody 상태 */
export enum PhysicsState {
  /** 힘의 영향을 받지 않으며 수동으로 움직이지 않는 한 같은 위치를 유지합니다 */
  STATIC,
  /** 힘의 영향을 받아 위치가 변경됨 */
  DYNAMIC,
  /** 힘의 영향을 받지만 미리 정의된 모션이 있음 */
  KINEMATIC,
}

export class PhysicsBody {
  public static GRAVITY: number = 9.8 * (1 / 60);
  public UID = 0;

  public readonly radius = boardConfig.bubbleSize / 2;
  public readonly mass = 20;
  public position = new Vector2();
  public velocity = new Vector2();
  public damping = 0.6;
  public bounces = 0;
  public maxBounces = 1;

  private readonly _force = new Vector2();
  private _state: PhysicsState = PhysicsState.STATIC;

  public applyForce(forceX: number, forceY: number) {
    if (this.state !== PhysicsState.STATIC) {
      this._force.set(forceX, forceY);
      this.velocity.add(this._force.divideScalar(this.mass));
    }
  }

  public zeroVelocity() {
    this._force.setScalar(0);
    this.velocity.setScalar(0);
  }

  public reset() {
    this._force.set(0, 0);
    this.position.set(0, 0);
    this.velocity.set(0, 0);
    this.state = PhysicsState.STATIC;
    this.bounces = 0;
  }

  public get state() {
    return this._state;
  }

  public set state(value: number) {
    if (value === PhysicsState.STATIC) { 
      this.zeroVelocity()
    }
    this._state = value;
  }

  public get x(): number {
    return this.position.x;
  }

  public set x(value: number) {
    this.position.x = value;
  }

  public get y(): number {
    return this.position.y
  }

  public set y(value: number) {
    this.position.y = value;
  }
}