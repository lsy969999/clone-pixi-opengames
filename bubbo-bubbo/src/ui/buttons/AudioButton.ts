import { FancyButton, Switcher } from "@pixi/ui";
import { storage } from "../../storage";
import { getAnimations } from "./configs/animationConfig";
import { audio } from "../../audio";

const DEFAULT_SCALE = 0.75;
export class AudioButton extends FancyButton {
  private _switcher: Switcher;

  constructor() {
    const isMuted = storage.getStorageItem('muted');
    const switcher = new Switcher(
      ['icon-sound-on', 'icon-sound-off'],
      [],
      isMuted ? 1 : 0
    );
    super({
      defaultView: switcher,
      animations: getAnimations(DEFAULT_SCALE),
      anchor: 0.5,
      scale: DEFAULT_SCALE,
    })
    this._switcher = switcher;
    this.onPress.connect(() => {
      this.press()
    })
  }

  public press() {
    const isMuted = storage.getStorageItem('muted');
    this.forceSwitch(!isMuted)
    storage.setStorageItem('muted', !isMuted);
    audio.muted(!isMuted)
  }

  public forceSwitch(muted: boolean) {
    this._switcher.forceSwitch(muted ? 1 : 0);
  }
}