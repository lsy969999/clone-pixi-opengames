/** PhysicsBody 상태 */
export enum PhysicsState {
  /** 힘의 영향을 받지 않으며 수동으로 움직이지 않는 한 같은 위치를 유지합니다 */
  STATIC,
  /** 힘의 영향을 받아 위치가 변경됨 */
  DYNAMIC,
  /** 힘의 영향을 받지만 미리 정의된 모션이 있음 */
  KINEMATIC,
}