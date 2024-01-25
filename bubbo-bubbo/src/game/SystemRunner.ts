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
  update?: () => void;
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