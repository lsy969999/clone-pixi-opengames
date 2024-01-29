import { ButtonOptions, FancyButton } from "@pixi/ui";
import { Sprite, Text, TextStyle } from "pixi.js";
import { getAnimations } from "./configs/animationConfig";
import { sfx } from "../../audio";

export interface SecondaryButtonOptions {
  text: string;
  tint?: number;
  textStyle?: Partial<TextStyle>;
  buttonOptions?: ButtonOptions;
}

const DEFAULT_SCALE = 0.75;

export class SecondaryButton extends FancyButton {
  constructor(options?: SecondaryButtonOptions) {
    const text = new Text(options?.text ?? '', {
      fill: 0x000000,
      fontFamily: 'Bungee Regular',
      fontWeight: 'bold',
      align: 'center',
      fontSize: 40,
      ...options?.textStyle
    })
    super({
      defaultView: 'button-flat',
      anchor: 0.5,
      text,
      animations: getAnimations(DEFAULT_SCALE),
      scale: DEFAULT_SCALE,
      ...options?.buttonOptions
    });

    if (options?.tint) {
      (this.defaultView as Sprite).tint = options.tint
    }

    this.onPress.connect(()=>sfx.play('audio/secondary-button-press.wav'))
  }
}