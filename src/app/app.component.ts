import { Component, OnInit } from '@angular/core';
import { RatesService } from './services/rates.service';
import { YearRate } from './models/year-rate';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public rates = new YearRate();
  public year = 2017;
  public dataLoaded = false;

  public constructor(private ratesService: RatesService) {}

  ngOnInit() {
    this.ratesService.getRates(this.year)
      .subscribe(res => {
        this.rates = res;
        this.dataLoaded = true;
      });
  }

}
