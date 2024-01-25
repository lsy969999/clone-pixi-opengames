import { ButtonOptions, FancyButton } from "@pixi/ui";
import { Text, TextStyle } from "pixi.js";
import { sfx } from "../../audio";

export interface PrimaryButtonOptions {
  text: string,
  textStyle?: Partial<TextStyle>,
  buttonOptions?: ButtonOptions
}

const DEFAULT_SCALE = 0.6;

export class PrimaryButton extends FancyButton {
  constructor(options: PrimaryButtonOptions) {
    const text = new Text(options?.text ?? '', {
      fill: 0x49c8ff,
      fontFamily: 'Bungee Regula',
      fontWeight: 'bold',
      align: 'center',
      fontSize: 40,
      ...options?.textStyle
    })
    super({
      defaultView: 'play-btn-up',
      pressedView: 'play-btn-down',
      text,
      textOffset: {
        default: {
          y: -30,
        },
        pressed: {
          y: -15,
        }
      },
      anchorX: 0.5,
      anchorY: 1,
      scale: DEFAULT_SCALE,
      ...options.buttonOptions
    })

    this.onPress.connect(()=>{
      sfx.play('audio/primary-button-press.wav')
    })
  }
}