import { Container } from "pixi.js";
import { app } from "./main";

/** 앱 스크린 인터페이스 */
export interface AppScreen<T = any> extends Container {
  prepare?: (data?: T) => void;
  show?: () => Promise<void>;
  hide?: () => Promise<void>;
  update?: (delta: number) => void;
  resize?: (w: number, h: number) => void;
}

/** 앱스크린 생성자를위한 인터페이스 */
interface AppScreenConstructor {
  /** 이화면을 위한 중복되지않는 식별자 */
  readonly SCREEN_ID: string;
  readonly assetBundles?: string[];
  new (): AppScreen;
}

/** 화면 및 오버레이 탐색을 처리하는 클래스 */
class Navigation {
  /** 화면이 포함된 뷰 */
  public screenView = new Container();

  /** 오버레이가 포함된 뷰 */
  public overlayView = new Container();

  /** 표시되고 있는 현재 화면 */
  private currentScreen?: AppScreen;

  /** 스코프 문제를 피하기위한 리사이즈 함수 */
  private currentScreenResize?: () => void;

  /** 디폴트 로드 화면 */
  private loadScreen?: AppScreen;

  /** 표시되고 이는 현재 오버레이 */
  private currentOverlay?: AppScreen;

  /** 스코프 문제를 피하기 위한 리사이즈 함수 */
  private currentOverlayResize?: () => void;

  /** 화면의 width */
  private _w!: number;

  /** 화면의 height */
  private _h!: number;

  private readonly _screenMap = new Map<string, AppScreen>();

  public init(){
    app.stage.addChild(this.screenView, this.overlayView)
  }

  /**
   * 디폴트 로드 스크린을 세팅한다.
   * @param Ctor 로드스크린 생성자
   */
  public setLoadScreen(Ctor: AppScreenConstructor) {
    this.loadScreen = this._getScreen(Ctor);
  }

  public async showOverlay<T>(Ctor: AppScreenConstructor, data?: T) {
    
  }

  /**
   * 스크린 맵에서 스크린 인스턴스를 가져온다.
   * @param Ctor 스크린 생성자
   * @returns 요청한 스크린을 리턴한다.
   */
  private _getScreen(Ctor: AppScreenConstructor) {
    //이미 스크린인스터스가 스크린맵에 존재하는지 체크한다.
    let screen = this._screenMap.get(Ctor.SCREEN_ID);

    //만약 없다면, 스크린맵에 새롭게 스크린을 생성한다.
    if (!screen) {
      screen = new Ctor();
      this._screenMap.set(Ctor.SCREEN_ID, screen);
    }

    return screen;
  }


  private async _showScreen<T>(Ctor: AppScreenConstructor, isOverlay: boolean, data: T) {
    const current = isOverlay ? this.currentOverlay : this.currentScreen;
    if (current) {
      await this._removeScreen(current);
    }

  }


  /**
   * 스테이지에서 스크린을 제거 및 관련 티커업데이트, 리사이즈도 해제한다.
   * @param screen 
   * @param isOverlay 화면이 오버레이인지 확인하는 플래그
   */
  private async _removeScreen(screen: AppScreen, isOverlay = false) {
    //메소드가 존재한다면 스크린을 하이드한다.
    if (screen.hide) {
      await screen.hide();
    }

    //리사이즈 핸들러가 존재한다면 해제한다.
    if (isOverlay) {
      this.currentOverlayResize
        && window.removeEventListener('resize', this.currentOverlayResize);
    } else {
      this.currentScreenResize
        && window.removeEventListener('resize', this.currentScreenResize);
    }

    //update메소드가 존재한다면 해제한다.
    if (screen.update) {
      app.ticker.remove(screen.update, screen);
    }

    //부모로부터 스크린을 해제한다.(일반적으로 app.state가 변경되지 않은 경우)
    if (screen.parent) {
      screen.parent.removeChild(screen);
    }
  }

  /**
   * 스테이지에 화면을 추가한다. 티커 업데이트 및 리사이즈 함수도 연결한다.
   * @param screen 
   * @param isOverlay 화면이 오버레이인지 확인하는 플래그
   */
  private async _addScreen(screen: AppScreen, isOverlay = false) {
    //스테이지에 화면을 추가한다.
    (isOverlay ? this.overlayView : this.screenView).addChild(screen);

    //리사이즈가 가능하다면 리사이즈 함수를 추가한다.
    if (screen.resize) {
      //addEventListener의 스코프문제를 피하기위해 나중에 제거할수있는 다르함수에 리사이즈함수를 캡슐화합니다.

      if (isOverlay) {
        this.currentOverlayResize = () => screen.resize;
      } else {
        this.currentScreenResize = () => screen.resize;
      }

      //최초 리사이즈 실행
      screen.resize(this._w, this._h)
    }

    //업데이트가 가능하다면 티커에 업데이트함수를 추가합니다.
    if (screen.update) {
      app.ticker.add(screen.update, screen)
    }

    //스크린을 보여준다.
    if (screen.show) {
      await screen.show();
    }
  }
}