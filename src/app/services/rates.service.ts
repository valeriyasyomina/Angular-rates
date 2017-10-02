import { Injectable } from '@angular/core';
import { YearRate } from '../models/year-rate';
import { Month } from '../models/month';
import { MonthName } from '../models/month-name';
import { DayRate } from '../models/day-rate';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

const MONTHES_NUMBER = 12;
const DAYS_IN_MONTH = 3;
const MIN_VALUE = 40.4;
const MAX_VALUE = 81.23;

@Injectable()
export class RatesService {

  constructor() { }

  public getRates(year: number) {
    const yearRate = new YearRate();
    yearRate.year = year;
    for (let index = 0; index < MONTHES_NUMBER; index++) {
      const month = this.createRatesForMonth(index, DAYS_IN_MONTH, year);
      yearRate.monthes.push(month);
    }
    return Observable.of(yearRate);
  }

  private createRatesForMonth(monthNumber: number, daysInMonth: number, year: number): Month {
    const month = new Month();
    month.name = MonthName[monthNumber].toString();
    for (let day = 1; day <= daysInMonth; day++) {
      const value = Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE)) + MIN_VALUE;
      const dayRate = new DayRate(value, new Date(year, monthNumber, day));
      month.rates.push(dayRate);
    }
    return month;
  }
}
