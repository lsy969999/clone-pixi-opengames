import { PlayOptions, Sound, sound } from "@pixi/sound";

class BGM {
  public currentAlias?: string;
  public current?: Sound;

  private _globalVolume = 0.15;
  private _insanceVolume = 0.15;

  public async play(alias: string, options?: PlayOptions) {
    if (this.currentAlias === alias) return;

    if (this.current) {
      const current = this.current;

      gsap.killTweensOf(current);
      gsap.to(current, {
        volume: 0,
        duration: 1,
        ease: 'linear'
      }).then(() => {
        current.stop();
      })

      this.current = sound.find(alias);
      this.currentAlias = alias;
      this.current.play({
        loop: true,
        ...options
      })
      this.current.volume = 0;
      gsap.killTweensOf(this.current);

      this._insanceVolume = options?.volume ?? 1
      gsap.to(this.current, {
        volume: this._globalVolume * this._insanceVolume,
        duration: 1,
        ease: 'linear'
      })
    }
  }

  public setVolume(v: number) {
    this._globalVolume = v;
    if (this.current) this.current.volume = this._globalVolume * this._insanceVolume;
  }

  public getVolume() {
    return this._globalVolume;
  }
}

class SFX {
  private _volume = 0.5;

  public play(alias: string, options?: PlayOptions) {
    const volume = this._volume * (options?.volume ?? 1)
    sound.play(alias, {...options, volume});
  }

  public setVolume(v: number) {
    this._volume = v;
  }

  public getVolume() {
    return this._volume
  }
}

export const audio = {
  muted(value: boolean) {
    if (value) sound.muteAll();
    else sound.unmuteAll();
  },
  getMasterVolume() {
    return sound.volumeAll;
  },
  setMasterVolume(v: number) {
    sound.volumeAll = v;
    if (!v) {
      sound.muteAll()
    } else {
      sound.unmuteAll()
    }
  }
}

export const bgm = new BGM();
export const sfx = new SFX();