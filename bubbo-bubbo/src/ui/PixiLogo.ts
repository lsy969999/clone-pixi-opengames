import { Container, Sprite, Text } from "pixi.js";

export class PixiLogo {
  public view = new Container();

  constructor(header?: string) {
    const logo = Sprite.from('pixi-logo');
    logo.anchor.set(0.5);
    this.view.addChild(logo);

    if(header) {
      const headerText = new Text(header, {
        fontSize: 20,
        align: 'center'
      });

      headerText.anchor.set(0.5);
      headerText.y = -(logo.height * 0.5) - 15;
      this.view.addChild(headerText);
    }
  }
}