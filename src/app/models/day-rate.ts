export class DayRate {
  public date: Date;
  public value: number;

  public constructor(value: number, date: Date) {
    this.value = value;
    this.date = date;
  }
}
