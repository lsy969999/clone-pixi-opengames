import { Container, Sprite, Text } from "pixi.js";
import { i18n } from "../utils/i18n";
import { device } from "../utils/device";
import { designConfig } from "../game/designConfig";
import gsap from "gsap";

export class HelperPanel {
  public view = new Container();
  constructor() {
    const panel = Sprite.from('panel-small-instructions');

    panel.anchor.set(0.5)
    panel.scale.set(0.75)

    const text = i18n.t(device.isMobileDevice() ? 'helperMobile' : 'helperDesktop')

    const helpText = new Text(text, {
      fontSize: 19,
      fontWeight: '900',
      fontFamily: 'Opensans Semibold',
      fill: 0x000000,
      align: 'center'
    })

    helpText.anchor.set(0.5);

    helpText.x = -75
    panel.addChild(helpText)

    this.view.addChild(panel)
  }

  public prepare() {
    this.view.x = this._offScreenPos
  }

  public show() {
    return gsap.to(this.view, {
      x: 0,
      duration: 1,
      delay: 0.5,
      ease: 'back.out(1)'
    })
  }

  public hide() {
    return gsap.to(this.view, {
      x: this._offScreenPos
    })
  }

  private get _offScreenPos() :number {
    return -(designConfig.content.width * 0.5) - this.view.width * 0.5
  }
}