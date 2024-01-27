import type { Game } from "./Game";

/** 게임에 추가할 수 있는 시스템의 구조를 정의합니다. */
export interface System<S extends Game = Game> {
  /** 시스템이 추가된 장면에 대한 참조로, 자동으로 주입됩니다. */
  game?: S;
  /** 시스템이 초기화될 때 메서드가 호출됩니다. 시스템이 인스턴스화될 때 한 번만 호출됩니다. */
  init?: () => void;
  /** 시스템이 활성화될 때 메서드가 호출됩니다. 게임이 시작될 때마다 호출됩니다. */
  awake?: () => void;
  /** 시스템의 게임 로직이 시작될 때 메서드가 호출됩니다. 게임이 시작될 때마다 호출됩니다. */
  start?: () => void;
  /** 이 메소드는 게임이 업데이트될 때마다 호출되며 델타 시간이 인수로 전달됩니다. 게임 플레이 중에 여러 번 호출되었습니다. */
  update?: (delta: number) => void;
  /** 시스템의 게임 로직을 종료해야 할 때 호출되는 메서드입니다. 게임이 끝날 때마다 호출됩니다. */
  end?: () => void;
  /** 시스템을 재설정하기 위해 호출되는 메서드입니다. 게임이 끝날 때마다 호출됩니다. */
  reset?: () => void;
  /** 이 메서드는 시스템 크기가 조정될 때 호출되며 새 너비와 높이가 인수로 전달됩니다. 화면 크기가 조정될 때마다 호출됩니다. */
  resize?: (w: number, h: number) => void;
}

/** 시스템을 설명하는 클래스를 정의합니다. */
interface SystemClass<GAME extends Game = Game, SYSTEM extends System<GAME> = System<GAME>> {
  /** 시스템의 고유 식별자입니다. */
  SYSTEM_ID: string;
  /** 시스템의 인스턴스를 생성하는 생성자입니다 */
  new (): SYSTEM;
}

/** 시스템을 관리하고 시스템에 적절한 메소드를 호출하는 클래스 */
export class SystemRunner {
  /** 시스템이 연결된 게임의 인스턴스입니다. */
  private readonly _game: Game;

  /** 게임에 추가된 모든 시스템을 포함하는 맵 */
  public readonly allSystems: Map<string, System> = new Map();

  private readonly _width?: number;
  private readonly _height?: number;

  /**
   * SystemRunner의 새 인스턴스 만들기
   * @param game 
   */
  constructor(game: Game) {
    this._game = game;
  }

  /**
   * SystemRunner에 시스템을 추가합니다.
   * @param Class 추가할 시스템을 설명하는 클래스입니다.
   * @returns SystemRunner에 추가된 시스템의 인스턴스입니다.
   */
  public add<S extends System>(Class: SystemClass<Game, S>): S {
    const name = Class.SYSTEM_ID;

    // 시스템에 이름이 있는지 확인하고 없으면 오류가 발생합니다.
    if (!name) throw new Error('[SystemManager]: cannot add System without name');

    // 시스템이 이미 추가된 경우 기존 인스턴스를 반환합니다.
    if (this.allSystems.has(name)) {
      return this.allSystems.get(name) as S;
    }

    // 시스템의 새 인스턴스 생성
    const system = new Class();

    // 시스템의 게임 속성을 SystemRunner의 게임으로 설정합니다.
    system.game = this._game;

    // SystemRunner의 너비와 높이가 이미 설정된 경우 시스템에서 크기 조정을 호출합니다.
    if (this._width && this._height) system.resize?.(this._width, this._height);

    // SystemRunner의 allSystems 맵에 시스템을 추가합니다.
    this.allSystems.set(Class.SYSTEM_ID, system);

    // 시스템의 새 인스턴스를 반환합니다.
    return system;
  }

  /**
   * SystemRunner에서 시스템 인스턴스를 가져옵니다.
   * @param Class 얻을 수 있는 시스템을 설명하는 클래스
   * @returns 요청된 시스템의 인스턴스
   */
  public get<S extends System>(Class: SystemClass<Game, S>): S {
    return this.allSystems.get(Class.SYSTEM_ID) as S;
  }

  /**
   * 등록된 모든 시스템의 `init` 메소드를 호출합니다.
   */
  public init() {
    this.allSystems.forEach((system) => { system.init?.() });
  }

  /**
   * 등록된 모든 시스템의 `awake` 메소드를 호출합니다.
   */
  public awake() {
    this.allSystems.forEach((system) => { system.awake?.() });
  }

  /**
   * 등록된 모든 시스템의 `start` 메소드를 호출합니다.
   */
  public start() {
    this.allSystems.forEach((system) => { system.start?.() })
  }

  /**
   * 등록된 모든 시스템의 `update` 메소드를 호출합니다.
   * @param delta 마지막 업데이트 이후 경과된 시간입니다
   */
  public update(delta: number) {
    this.allSystems.forEach((system) => { system.update?.(delta) })
  }

  /**
   * 등록된 모든 시스템의 `end` 메소드를 호출합니다.
   */
  public end() {
    this.allSystems.forEach((system) => { system.end?.() })
  }

  /**
   * 등록된 모든 시스템의 `reset` 메소드를 호출합니다.
   */
  public reset() {
    this.allSystems.forEach((system) => { system.reset?.() })
  }

  /**
   * 등록된 모든 시스템의 `resize` 메소드를 호출합니다.
   */
  public resize(w: number, h: number) {
    this.allSystems.forEach((system) => { system.resize?.(w, h) })
  }
}