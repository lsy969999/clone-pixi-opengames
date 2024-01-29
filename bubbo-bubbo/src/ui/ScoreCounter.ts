import { Container, Sprite, Text } from "pixi.js";

export class ScoreCounter {
  public view = new Container();

  private readonly _base: Sprite;
  private readonly _scoreText: Text;

  constructor() {
    this._base = Sprite.from('info-bg');
    this._base.anchor.y = 0.5;
    this._base.scale.set(0.75);
    this.view.addChild(this._base);

    this._scoreText = new Text('', {
      fontSize: 40,
      fontWeight: '900',
      fontFamily: 'Bungee Regular',
      fill: 0x000000,
      stroke: 0xffffff,
      strokeThickness: 5,
      align: 'left',
    })

    this._scoreText.x = 20;
    this._scoreText.anchor.y = 0.5;
    this._base.addChild(this._scoreText)

    this.setScore(0);
  }

  public async setScore(score: number) {
    this._scoreText.style.fontSize = 30;
    this._scoreText.style.fontSize = 30;
    while(this._scoreText.width > this._base.width) {
      this._scoreText.style.fontSize--;
    }
  }
}