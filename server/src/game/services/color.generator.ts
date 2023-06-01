import { Injectable } from '@nestjs/common';
import { GameConfig } from '@common/interfaces/GameConfig';
import { Color, HSV, RGB } from '@common/types/Color';
import { generateRandomInt } from '../utils/random';

@Injectable()
export class ColorGenerator {
  /**
   * Generates a random color list.
   * Colors will always differ in hue as much as possible.
   * @param config Game config.
   * @returns Generated color list.
   */
  generate({ maxPlayers }: GameConfig): Color[] {
    const hsv = this.generateRandomHSV(maxPlayers);

    return hsv.map((color) => this.rgb2hex(this.hsv2rgb(color)));
  }

  /**
   * Generates a list of random HSV colors in a format:
   * H - [0, 360], S - [0.75, 1], V - [0.75, 1]
   * @param maxPlayers How many HSV colors should be generated?
   * @returns A list of colors in HSV model.
   */
  private generateRandomHSV(maxPlayers: number): HSV[] {
    const step = 360 / maxPlayers;
    const startingIndex = Math.round(Math.random() * maxPlayers);
    const startingHue = Math.round(startingIndex * step);

    const colors: HSV[] = [];

    for (let i = 0; i < maxPlayers; i++) {
      const s = generateRandomInt(75, 100) / 100;
      const v = generateRandomInt(75, 100) / 100;

      let h = Math.round(startingHue + i * step);

      while (h >= 360) h -= 360;

      colors.push([h, s, v]);
    }

    return colors;
  }

  /**
   * Converts an HSV color value to RGB.
   * Acceptable format: H - [0, 360], S - [0, 1], V - [0, 1].
   * Return format: R - [0, 255], G - [0, 255], B - [0, 255].
   * @param HSV A color in HSV model.
   * @returns A color in RGB model.
   */
  private hsv2rgb([h, s, v]: HSV): RGB {
    const i = Math.floor(h / 60);
    const f = h / 60 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    // Prettier doesn't allow me to use one-liners with switch...
    if (i === 0) return [v * 255, t * 255, p * 255];
    if (i === 1) return [q * 255, v * 255, p * 255];
    if (i === 2) return [p * 255, v * 255, t * 255];
    if (i === 3) return [p * 255, q * 255, v * 255];
    if (i === 4) return [t * 255, p * 255, v * 255];
    if (i === 5) return [v * 255, p * 255, q * 255];
  }

  /**
   * Converts an RGB color to HEX form.
   * @param RGB A color in RGB model.
   * @returns A color in a HEX form.
   */
  private rgb2hex([r, g, b]: RGB): Color {
    const toHex = (x: number) => Math.round(x).toString(16).padStart(2, '0');

    return ('#' + toHex(r) + toHex(g) + toHex(b)).toUpperCase() as Color;
  }
}
