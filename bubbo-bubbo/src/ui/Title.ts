import { Container, Text } from "pixi.js";
import { i18n } from "../utils/i18n";

export class Title {
  public view = new Container();

  constructor() {
    const bubboText = i18n.t('gameTitle');
    const titleTop = new Text(bubboText, {
      fontSize: 90,
      fontWeight: '900',
      fontFamily: 'Bungee Regular'
    });

    titleTop.anchor.set(0.5);
    this.view.addChild(titleTop);

    const titleBottom = new Text(bubboText, {
      fontSize: 90,
      fontWeight: '900',
      fontFamily: 'Bungee Regular'
    });

    titleBottom.y = titleTop.height - 20;
    titleBottom.anchor.set(0.5);
    this.view.addChild(titleBottom);

    const subtitle = new Text(i18n.t('gameSubtitle'), {
      fontSize: 32,
      fontWeight: '900',
      fontFamily: 'Bungee Regular'
    })

    subtitle.anchor.set(0.5);
    subtitle.y = titleBottom.y + titleBottom.height - 30;
    this.view.addChild(subtitle);
  }
}