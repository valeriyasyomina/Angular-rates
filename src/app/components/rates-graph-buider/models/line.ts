import { Point } from './point';

export class Line {
  public start: Point;
  public end: Point;

  public constructor(start: Point, end: Point) {
    this.start = start;
    this.end = end;
  }
}
