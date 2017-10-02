import { Point } from './point';
import { DayRate } from '../../../models/day-rate';

export class RatesUIData {
  public point: Point;
  public rate: DayRate;

  public constructor(point: Point, rate: DayRate) {
    this.point = point;
    this.rate = rate;
  }
}
