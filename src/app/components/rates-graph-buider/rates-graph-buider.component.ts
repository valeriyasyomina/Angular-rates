import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { YearRate } from '../../models/year-rate';
import { DayRate } from '../../models/day-rate';
import { Month } from '../../models/month';
import { MonthName } from '../../models/month-name';
import { Line } from './models/line';
import { Point } from './models/point';
import { RatesUIData } from './models/rates-ui-data';
import { YAxisData } from './models/y-axis-data';

const Y_LINES_NUMBER = 3;
const MAX_DISTANCE_DELTA = 5;
const Y_AXIS_DELTA = 10;

@Component({
  selector: 'app-rates-graph-buider',
  templateUrl: './rates-graph-buider.component.html',
  styleUrls: ['./rates-graph-buider.component.scss']
})
export class RatesGraphBuiderComponent implements OnInit {

  @Input()
  public yearRate = new YearRate();

  @ViewChild('graphData')
  public graphData: ElementRef;

  public lines: Line[] = [];
  public pointFound = false;
  public showTooltip = false;
  public movePoint = new Point(0, 0);
  public intersectionPoint = new Point(0, 0);
  public rateToShow: DayRate;
  public deltaRateString: string;
  public isLowerRate = false;
  public isFirstRateValue = false;
  public yAxisData: YAxisData[] = [];
  public graphWidth = 0;
  public graphHeight = 0;

  private graphOffsetLeft = 0;
  private graphOffsetTop = 0;
  private ratesUIData: RatesUIData[] = [];
  private maxRateValue = 0;
  private minRateValue = Number.MAX_VALUE;
  private yScale = 0;
  private xStep = 0;
  private numberOfPoints = 0;

  constructor() { }

  ngOnInit() {
    this.buildRatesGraph();
  }

  private buildRatesGraph() {
    this.graphWidth = this.graphData.nativeElement.clientWidth;
    this.graphHeight = this.graphData.nativeElement.clientHeight;
    this.graphOffsetLeft = this.graphData.nativeElement.offsetLeft;
    this.graphOffsetTop = this.graphData.nativeElement.offsetTop;
    this.calculateMaxMinRateValue();
    this.calculateYScale();
    this.calculateXStep();
    this.createYAxisData();
    this.createLines();
  }

  public svgMouseMove(event) {
    this.movePoint.x = event.clientX - this.graphOffsetLeft;
    this.movePoint.y = event.clientY - this.graphOffsetTop;
    this.processMouseMove();
  }

  private processMouseMove() {
    const line = this.getLineForIntersection(this.movePoint);
    const intersectionPointY = this.getYKoordinateIntersection(this.movePoint, line);
    if (intersectionPointY !== undefined) {
      this.intersectionPoint.x = this.movePoint.x;
      this.intersectionPoint.y = intersectionPointY;
      this.pointFound = true;
      const index = this.getNearestRateInfoIndex(new Point(this.movePoint.x, intersectionPointY));
      if (index !== -1) {
        this.processNearestRate(index);
        this.showTooltip = true;
      } else {
        this.showTooltip = false;
      }
    }
  }

  private processNearestRate(index: number) {
    this.rateToShow = this.ratesUIData[index].rate;
    if (index !== 0) {
      const previousRate = this.ratesUIData[index - 1].rate;
      const deltaRate = this.rateToShow.value - previousRate.value;
      this.deltaRateString = deltaRate.toFixed(3);
      this.isLowerRate = deltaRate < 0;
      this.isFirstRateValue = false;
    } else {
      this.isFirstRateValue = true;
    }
  }

  private getNearestRateInfoIndex(point: Point) {
     return this.ratesUIData.findIndex(r => this.calculateDistanceBetweenPoints(point, r.point) < MAX_DISTANCE_DELTA);
  }

  private calculateDistanceBetweenPoints(firstPoint: Point, secondPoint: Point) {
    return Math.sqrt((firstPoint.x - secondPoint.x) * (firstPoint.x - secondPoint.x) +
      (firstPoint.y - secondPoint.y) * (firstPoint.y - secondPoint.y));
  }

  private getYKoordinateIntersection(point: Point, line: Line) {
    let yKoordinate;
    if (line.start.y !== line.end.y) {
      yKoordinate = ((line.end.y - line.start.y) * (point.x - line.start.x)) /
        (line.end.x - line.start.x) + line.start.y;
    } else {
      yKoordinate = line.start.y;
    }
    return yKoordinate;
  }

  private getLineForIntersection(point: Point) {
    return this.lines.filter(l => l.start.x <= point.x && point.x <= l.end.x)[0];
  }

  private calculateMaxMinRateValue() {
    this.yearRate.monthes.forEach(m => {
      this.numberOfPoints += m.rates.length;
      m.rates.forEach(r => {
        if (Math.round(r.value) > this.maxRateValue) {
          this.maxRateValue = r.value;
        }
        if (Math.round(r.value) < this.minRateValue) {
          this.minRateValue = r.value;
        }
      });
    });
  }

  private createYAxisData() {
    const minRounded = Math.ceil(this.minRateValue);
    const maxRounded = Math.floor(this.maxRateValue);
    const rateStep = (maxRounded - minRounded) / (Y_LINES_NUMBER - 1);
    const yScaleRounded = this.graphHeight / (maxRounded - minRounded);
    let currentRateValue = this.minRateValue;
    for (let index = 0; index < Y_LINES_NUMBER; index++) {
      let yKoordinate = this.graphHeight - ((currentRateValue - minRounded) * yScaleRounded);
      if (index === 0) {
        yKoordinate -= Y_AXIS_DELTA;
      }
      if (index === Y_LINES_NUMBER - 1) {
        yKoordinate += Y_AXIS_DELTA;
      }
      this.yAxisData.push(new YAxisData(currentRateValue, yKoordinate));
      currentRateValue += rateStep;
    }
  }

  private calculateYScale() {
    const minMaxDelta = this.maxRateValue - this.minRateValue;
    if (minMaxDelta !== 0) {
      this.yScale = this.graphHeight / minMaxDelta;
    }
  }

  private calculateXStep() {
    if (this.numberOfPoints !== 0) {
      this.xStep = this.graphWidth / (this.numberOfPoints - 1);
    }
  }

  private createLines() {
    let xKoordinate = 0;
    for (let index = 0; index < this.yearRate.monthes.length; index++) {
      const currentMonth = this.yearRate.monthes[index];
      xKoordinate = this.createMonthLines(currentMonth, xKoordinate);
      if (index !== this.yearRate.monthes.length - 1) {  // не последняя итерация по месяцам
        const nextMonth = this.yearRate.monthes[index + 1];
        xKoordinate = this.addRateLine(currentMonth.rates[currentMonth.rates.length - 1],
          nextMonth.rates[0], xKoordinate, false);
      }
    }
  }

  private createMonthLines(month: Month, xKoordinate: number) {
    const monthPointsNumber = month.rates.length;
    for (let index = 0; index < monthPointsNumber - 1; index++) {
      xKoordinate = this.addRateLine(month.rates[index], month.rates[index + 1], xKoordinate, index === monthPointsNumber - 2);
    }
    return xKoordinate;
  }

  private addRateLine(startRate: DayRate, endRate: DayRate, xKoordinate: number, isLastIteration: boolean) {
    const yStart = this.graphHeight - ((startRate.value - this.minRateValue) * this.yScale);
    const yEnd = this.graphHeight - ((endRate.value - this.minRateValue) * this.yScale);

    // const startPoint = new Point(Math.round(xKoordinate), Math.round(yStart));
   //  const endPoint = new Point(Math.round(xKoordinate + this.xStep), Math.round(yEnd));
   const startPoint = new Point(xKoordinate, yStart);
   const endPoint = new Point(xKoordinate + this.xStep, yEnd);
    this.lines.push(new Line(startPoint, endPoint));

    this.addRateToList(xKoordinate, yStart, startRate);
    if (isLastIteration) {
      this.addRateToList(xKoordinate + this.xStep, yEnd, endRate);
    }
    xKoordinate += this.xStep;
    return xKoordinate;
  }

  private addRateToList(x: number, y: number, rate: DayRate) {
    // const point = new Point(Math.round(x), Math.round(y));
    const point = new Point(x, y);
    this.ratesUIData.push(new RatesUIData(point, rate));
  }
}
