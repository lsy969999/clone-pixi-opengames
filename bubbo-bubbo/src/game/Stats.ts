import { storage } from "../storage";

/**
 * 완전히 정의된 초기 통계를 생성하는 데 사용되는 사용자의 기본 통계,
 * 재설정 값도 마찬가지입니다. 통계는 게임마다 재설정됩니다.
 */
const DEFAULT_STATS = {
  /** 플레이어의 총점 */
  score: 0,
  /** 플레이어의 최고 점수 */
  highscore: 0,
  /** 플레이어가 레벨에서 얼마나 많은 버블을 제거했는지 */
  bubblesPopped: 0,
  /** 플레이어 샷당 'bubblesPopped'의 최대 양 */
  bestCombo: 0,
  /** 얼마나 많은 파워업이 실행되었는지 */
  powerupsUsed: 0,
}

/** 기본 데이터에서 정의된 유형 */
export type StatType = typeof DEFAULT_STATS;
/** 기본 데이터에서 정의된 키입니다. */
export type StatKey = keyof StatType

/** 기본 데이터로부터 사용자별 통계를 처리하는 클래스입니다. */
export class Stats {
  private _stats = { ...DEFAULT_STATS };

  /**
   * 사용자의 통계를 포함하는 개체,
   * 인스턴스화 시 기본값은 `DEFAULT_STATS`입니다.
   * 기본 데이터 덮어쓰기를 방지하기 위해 객체 확산 연산자를 사용합니다.
   */
  constructor() {
    // 통계 최고 점수를 저장된 최고 점수로 설정합니다.
    this.set('highscore', storage.getStorageItem('highscore'));
  }

  /**
   * 지정된 통계에 값을 설정합니다.
   * @param stat 
   * @param value 
   * @returns 
   */
  public set<T extends StatKey>(stat: T, value: StatType[T]) {
    this._stats[stat] = value
    return this.get(stat)
  }

  /**
   * 지정된 스텟을 얻습니다
   * @param state 
   */
  public get<T extends StatKey>(state: T): StatType[T];
  /**
   * 사용 가능한 모든 통계를 가져옵니다.
   */
  public get(): StatType;
  public get<T extends StatKey>(stat?: T): StatType[T] | StatType {
    if (stat) {
      return this._stats[stat]
    }

    return this._stats
  }

  /**
   * 제공된 값에 따라 통계를 증가시킵니다.
   * 아무것도 제공되지 않으면 기본값은 '1'입니다.
   * @param stat 
   * @param value 
   * @returns 
   */
  public increment<T extends StatKey>(stat: T, value: StatType[T] = 1) {
    if (typeof this._stats[stat] === 'number') {
      (this._stats[stat] as number) += value as number;
    } else{
      console.warn(`Cannot increment non-number state: ${stat}`);
    }

    return this.get(stat)
  }

  /** 플레이어 통계를 재설정합니다. 통계는 게임마다 재설정됩니다. */
  public reset() {
    this._stats = { ...DEFAULT_STATS }
  }
}