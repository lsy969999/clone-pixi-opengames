import { Assets, Container } from "pixi.js";
import { app } from "./main";
import { areBundlesLoaded } from "./assets";

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

  /**
   * 현재 화면 위에 오버레이 화면을 표시합니다.
   * @param Ctor 오버레이 화면의 생성자입니다.
   * @param data 오버레이로 전송될 데이터입니다.
   */
  public async showOverlay<T>(Ctor: AppScreenConstructor, data?: T) {
    //넘어온 screen을 overlay로 지정하고 currentScreen을 대체하지않고 위에 overlay screen을 표시합니다.
    this._showScreen(Ctor, true, data);
  }

  /**
   * 현재화면을 숨기고, 새화면을 표시합니다.
   * AppScreen 인터페이스와 일치하는 모든 클래스를 여기서 사용할수 있습니다.
   * @param Ctor 화면의 생성자입니다.
   * @param data 화면에 전송될 데이터입니다.
   */
  public async goToScreen<T>(Ctor: AppScreenConstructor, data?: T) {
    //넘어온 스크린을 overlay로 지정하지 않고, currentScreen을 대체합니다.
    this._showScreen(Ctor, false, data);
  }

  /**
   * 현재 오버레이가 활성화 되어 있으면 숨깁니다.
   */
  public async hideOverlay() {
    if (!this.currentOverlay) return;

    this._removeScreen(this.currentOverlay, true)
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

  /**
   * 현재 화면을 숨기고(있는 경우) 번들을 로드하고 새 화면을 표시합니다
   * @param Ctor 추가되는 화면 인스턴스입니다
   * @param isOverlay 화면이 오버레이인지 확인하는 플래그입니다.
   * @param data 화면에 전송할 데이터입니다.
   */
  private async _showScreen<T>(Ctor: AppScreenConstructor, isOverlay: boolean, data: T) {
    const current = isOverlay ? this.currentOverlay : this.currentScreen;

    //이미 생성된 화면이 있으면 숨깁니다.
    if (current) {
      await this._removeScreen(current);
    }

    //가능한 경우 새 화면의 자산 로드
    if (Ctor.assetBundles && !areBundlesLoaded(Ctor.assetBundles)) {
      //로드화면 표시
      if (this.loadScreen) {
        this._addScreen(this.loadScreen, isOverlay)
      }

      //이 새 화면에 필요한 모든 자산을 로드합니다.
      await Assets.loadBundle(Ctor.assetBundles)

      //로드화면 제거
      if (this.loadScreen) {
        this._removeScreen(this.loadScreen, isOverlay)
      }
    }

    //새로운 화면를 생성하고 스테이지에 추가한다.
    if (isOverlay) {
      this.currentOverlay = this._getScreen(Ctor)
      this.currentOverlay.prepare?.(data);
      await this._addScreen(this.currentOverlay, isOverlay);
    } else {
      this.currentScreen = this._getScreen(Ctor);
      this.currentScreen.prepare?.(data);
      await this._addScreen(this.currentScreen, isOverlay);
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

  /**
   * 화면 크기가 조정될 때마다 호출됩니다.
   * 화면 너비와 높이를 currentScreen과 currentOverlay 전달합니다.
   * @param w 화면의 width
   * @param h 화면의 height
   */
  public resize(w: number, h: number) {
    this._w = w;
    this._h = h;
    this.currentScreen?.resize?.(w, h);
    this.currentOverlay?.resize?.(w, h);
  }
}

/** 화면 및 오버레이 탐색을 처리하는 클래스 인스턴스 */
export const navigation = new Navigation();