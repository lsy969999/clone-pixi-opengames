const DEFAULT_STORAGE = {
  /**
   * 오디오가 음소거 됐는지 여부
   */
  muted: false,
  /**
  * 플레이어가 달성한 최고 점수
  */
  highscore: 0,
}

export type StorageData = typeof DEFAULT_STORAGE;

/**
 * 로컬스토리지 키값
 */
const STORAGE_ID = 'bubbo-bubbo';

export const storage = {
  /**
   * 아직 설정되지 않은 경우 저장소 데이터를 기본값으로 초기화합니다.
   */
  readyStorage() {
    if (!localStorage.getItem(STORAGE_ID)) this.setStorage(DEFAULT_STORAGE)
  },
  /**
   * 저장데이터 반환
   * @returns 
   */
  getStorage(): StorageData {
    const data = localStorage.getItem(STORAGE_ID);
    
    return data ? JSON.parse(data) : undefined
  },
  /**
   * 로컬스토리지에서 특정 값을 반환 받습니다.
   * @param key 
   * @returns 
   */
  getStorageItem<T extends keyof StorageData>(key: T): StorageData[T] {
    const data = this.getStorage();
    
    return data[key];
  },
  /**
   * 저장 데이터에 특정 값을 설정합니다.
   * @param key 
   * @param value 
   * @returns 
   */
  setStorageItem<T extends keyof StorageData>(key: T, value: StorageData[T]): StorageData[T] {
    const data = this.getStorage();

    //key가 존재하는지 체크
    if (data && key in data) {
      data[key] = value;

      //로컬스토리지 세팅
      this.setStorage(data);
    }

    return data[key];
  },
  /**
   *  전체 저장 데이터를 세팅
   * @param data 
   * @returns 
   */
  setStorage(data: StorageData) {
    return localStorage.setItem(STORAGE_ID, JSON.stringify(data, undefined, 2));
  }
}