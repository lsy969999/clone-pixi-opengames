import { FancyButton } from "@pixi/ui";
import { getAnimations } from "./configs/animationConfig";
import { sfx } from "../../audio";

const DEFAULT_SCALE = 0.75

export class IconButton extends FancyButton {
  constructor(icon: string, scale = DEFAULT_SCALE) {
    super({
      defaultView: 'button-flat-small',
      icon,
      iconOffset: {
        y: -4,
      },
      anchor: 0.5,
      animations: getAnimations(scale),
      scale
    })

    this.onPress.connect(() => {
      sfx.play('audio/secondary-button-press.wav', {
        speed: 1.1,
      })
    })
  }
}