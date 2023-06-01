import { Injectable } from '@nestjs/common';
import { GameConfig } from '@common/interfaces/GameConfig';
import { Color } from '@common/types/Color';
import { generateRandomInt } from '../utils/random';

@Injectable()
export class ColorGenerator {
  /**
   * Generates a new maze.
   * @param config Game config.
   * @returns Generated maze in the form of a 2D array.
   */
  generate({ maxPlayers }: GameConfig): Color[] {
    const uniqueColors: Set<Color> = new Set();

    while (uniqueColors.size < maxPlayers) {
      const hsv = this.generateRandomHSV(maxPlayers);
      const hex = this.hsv2hex(hsv);

      if (!uniqueColors.has(hex)) {
        uniqueColors.add(hex);
      }
    }

    return [...uniqueColors];
  }

  private generateRandomHSV(maxPlayers: number): [number, number, number] {
    const s = generateRandomInt(50, 100);
    const v = generateRandomInt(50, 100);

    const step = 360 / maxPlayers;
    const index = Math.floor(Math.random() * maxPlayers);

    let h = index * step;

    while (h < 0) h += 360;
    while (h >= 360) h -= 360;

    return [h, s, v];
  }

  private hsv2hex([h, s, v]: [number, number, number]): Color {
    const C = s * v;
    const X = C * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - C;

    const rTemp = this.getTempR(h, C, X);
    const gTemp = this.getTempG(h, C, X);
    const bTemp = this.getTempB(h, C, X);

    const r = Math.round((rTemp + m) * 255);
    const g = Math.round((gTemp + m) * 255);
    const b = Math.round((bTemp + m) * 255);

    const base = this.toHex(r) + this.toHex(g) + this.toHex(b);

    return ('#' + base).toUpperCase() as Color;
  }

  private getTempR(h: number, C: number, X: number): number {
    if (h <= 360) return C;
    if (h <= 300) return X;
    if (h <= 240) return 0;
    if (h <= 120) return X;
    if (h <= 60) return C;
  }

  private getTempG(h: number, C: number, X: number): number {
    if (h <= 360) return 0;
    if (h <= 240) return X;
    if (h <= 180) return C;
    if (h <= 60) return X;
  }

  private getTempB(h: number, C: number, X: number): number {
    if (h <= 360) return X;
    if (h <= 300) return C;
    if (h <= 180) return X;
    if (h <= 120) return 0;
  }

  private toHex(x: number): string {
    return x.toString(16).padStart(2, '0');
  }
}
